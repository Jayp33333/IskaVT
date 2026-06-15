import { useCallback, useEffect, useRef, useState } from "react";

const FEMALE_VOICE_PATTERN =
  /female|woman|samantha|victoria|zira|susan|karen|moira|tessa|fiona|veena|alice|emma|linda|heera|paulina|sara|joanna|ivy|kimberly|penelope|olivia|ava|nicole|laura|allison|aria|jenny|serena|sophie|hazel|michelle|nancy/i;

/** Young, bright female voices — checked in order across Windows, macOS, and Chrome */
const ENERGETIC_STUDENT_VOICE_PRIORITY: RegExp[] = [
  /microsoft aria/i,
  /microsoft jenny/i,
  /google.*english.*female/i,
  /samantha/i,
  /tessa/i,
  /joanna/i,
  /ivy/i,
  /kimberly/i,
  /zira/i,
  /karen/i,
  /fiona/i,
  /moira/i,
  /victoria/i,
  /emma/i,
  /olivia/i,
  /\baria\b/i,
  /\bjenny\b/i,
  /nicole/i,
  /susan/i,
  /allison/i,
  /serena/i,
  /sophie/i,
];

const AVOID_VOICE_PATTERN =
  /male|boy|man|david|mark|james|richard|george|daniel|thomas|paul|guy|adult male/i;

const MALE_VOICE_PATTERN =
  /male|man|boy|david|mark|james|richard|george|daniel|thomas|paul|guy|alex|fred|rishi|aaron|christopher|ryan|nathan|steve|john|michael|andrew|brian|eric|tony|william|roger|lee|bruce|fred|junior|grandpa/i;

/** Authoritative male voices — checked in order across Windows, macOS, and Chrome */
const MALE_VOICE_PRIORITY: RegExp[] = [
  /microsoft david/i,
  /microsoft guy/i,
  /google.*english.*male/i,
  /daniel/i,
  /james/i,
  /mark/i,
  /richard/i,
  /paul/i,
  /george/i,
  /thomas/i,
  /alex/i,
  /fred/i,
  /aaron/i,
  /christopher/i,
  /ryan/i,
];

const FEMALE_SPEECH_RATE = 1.12;
const FEMALE_SPEECH_PITCH = 1.16;
const MALE_SPEECH_RATE = 0.98;
const MALE_SPEECH_PITCH = 0.92;
const SPEAK_CHUNK_SIZE = 280;

export type SpeechVoiceProfile = "female" | "male";

export type SpeechVoiceSettings = {
  profile?: SpeechVoiceProfile;
  pitch?: number;
  rate?: number;
};

function normalizeSpeechVoiceSettings(
  options: SpeechVoiceProfile | SpeechVoiceSettings = "female",
): Required<Pick<SpeechVoiceSettings, "profile">> &
  Pick<SpeechVoiceSettings, "pitch" | "rate"> {
  if (typeof options === "string") {
    return { profile: options };
  }

  return {
    profile: options.profile ?? "female",
    pitch: options.pitch,
    rate: options.rate,
  };
}

function isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const extended = voice as SpeechSynthesisVoice & { gender?: string };
  if (extended.gender === "female") {
    return true;
  }

  return FEMALE_VOICE_PATTERN.test(voice.name);
}

function scoreEnergeticStudentVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;

  if (/child|girl|young|teen|student|junior/.test(name)) {
    score += 120;
  }

  if (/natural|online|neural/.test(name)) {
    score += 80;
  }

  if (isFemaleVoice(voice)) {
    score += 40;
  }

  if (voice.lang.toLowerCase().startsWith("en-us")) {
    score += 15;
  }

  if (voice.lang.toLowerCase().startsWith("en")) {
    score += 8;
  }

  if (AVOID_VOICE_PATTERN.test(voice.name)) {
    score -= 200;
  }

  return score;
}

function pickEnergeticStudentVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) {
    return null;
  }

  const english = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );
  const pool = english.length > 0 ? english : voices;
  const female = pool.filter(
    (voice) => isFemaleVoice(voice) && !AVOID_VOICE_PATTERN.test(voice.name),
  );
  const candidates = female.length > 0 ? female : pool;

  for (const pattern of ENERGETIC_STUDENT_VOICE_PRIORITY) {
    const match = candidates.find((voice) => pattern.test(voice.name));
    if (match) {
      return match;
    }
  }

  return (
    [...candidates].sort(
      (a, b) => scoreEnergeticStudentVoice(b) - scoreEnergeticStudentVoice(a),
    )[0] ?? null
  );
}

function isMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const extended = voice as SpeechSynthesisVoice & { gender?: string };
  if (extended.gender === "male") {
    return true;
  }

  return MALE_VOICE_PATTERN.test(voice.name);
}

function scoreMaleVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;

  if (/natural|online|neural/.test(name)) {
    score += 80;
  }

  if (isMaleVoice(voice)) {
    score += 40;
  }

  if (voice.lang.toLowerCase().startsWith("en-us")) {
    score += 15;
  }

  if (voice.lang.toLowerCase().startsWith("en")) {
    score += 8;
  }

  if (FEMALE_VOICE_PATTERN.test(voice.name)) {
    score -= 200;
  }

  return score;
}

function pickMaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) {
    return null;
  }

  const english = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );
  const pool = english.length > 0 ? english : voices;
  const male = pool.filter(
    (voice) => isMaleVoice(voice) && !FEMALE_VOICE_PATTERN.test(voice.name),
  );
  const candidates = male.length > 0 ? male : pool.filter(
    (voice) => !FEMALE_VOICE_PATTERN.test(voice.name),
  );

  for (const pattern of MALE_VOICE_PRIORITY) {
    const match = candidates.find((voice) => pattern.test(voice.name));
    if (match) {
      return match;
    }
  }

  return (
    [...candidates].sort((a, b) => scoreMaleVoice(b) - scoreMaleVoice(a))[0] ??
    null
  );
}

function pickVoiceForProfile(
  voices: SpeechSynthesisVoice[],
  profile: SpeechVoiceProfile,
): SpeechSynthesisVoice | null {
  return profile === "male"
    ? pickMaleVoice(voices)
    : pickEnergeticStudentVoice(voices);
}

const SPEAK_DELAY_MS = 80;

/** Normalize acronyms so browser TTS pronounces them correctly. */
function prepareSpeechText(text: string): string {
  return text
    .replace(/\bPUP\b/g, "P U P")
    .replace(/\bDIT\b/g, "D I T")
    .replace(/\bSIS\b/g, "S I S")
    .replace(/\bROTC\b/g, "R O T C")
    .replace(/\bBSIT\b/g, "B S I T")
    .replace(/\bBSCE\b/g, "B S C E")
    .replace(/\bBSEE\b/g, "B S E E")
    .replace(/\bBSHM\b/g, "B S H M")
    .replace(/\bBEED\b/g, "B E E D")
    .replace(/\bBSA\b/g, "B S A")
    .replace(/\bBPA\b/g, "B P A")
    .replace(/\bMBA\b/g, "M B A")
    .replace(/\bMPA\b/g, "M P A")
    .replace(/\bMEM\b/g, "M E M")
    .replace(/\bINSPIRED\b/g, "inspired")
    .replace(/\bNN\b/g, "noon")
    .replace(/\bISKA\b/gi, "iska")
    .replace(/\bJamito\b/g, "Hamito");
}

function splitSpeechText(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= SPEAK_CHUNK_SIZE) {
    return [trimmed];
  }

  const sentences = trimmed.match(/[^.!?]+[.!?]+|\S+/g) ?? [trimmed];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = `${current}${sentence}`.trim();
    if (next.length > SPEAK_CHUNK_SIZE && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = next;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [trimmed];
}

export function useFaqSpeech(
  options: SpeechVoiceProfile | SpeechVoiceSettings = "female",
) {
  const voiceSettings = normalizeSpeechVoiceSettings(options);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const speakingIdRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const voiceProfileRef = useRef(voiceSettings.profile);
  const voicePitchRef = useRef(voiceSettings.pitch);
  const voiceRateRef = useRef(voiceSettings.rate);
  const speakTimeoutRef = useRef<number | null>(null);
  const chunkIndexRef = useRef(0);
  const chunksRef = useRef<string[]>([]);
  const activeSpeechIdRef = useRef<string | null>(null);
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  voiceProfileRef.current = voiceSettings.profile;
  voicePitchRef.current = voiceSettings.pitch;
  voiceRateRef.current = voiceSettings.rate;

  useEffect(() => {
    speakingIdRef.current = speakingId;
  }, [speakingId]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const loadVoices = () => {
      preferredVoiceRef.current = pickVoiceForProfile(
        window.speechSynthesis.getVoices(),
        voiceProfileRef.current,
      );
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported, voiceSettings.profile, voiceSettings.pitch, voiceSettings.rate]);

  const clearSpeakTimeout = useCallback(() => {
    if (speakTimeoutRef.current !== null) {
      window.clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) {
      return;
    }

    clearSpeakTimeout();
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    activeSpeechIdRef.current = null;
    chunksRef.current = [];
    chunkIndexRef.current = 0;
    setSpeakingId(null);
  }, [clearSpeakTimeout, isSupported]);

  const createUtterance = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const profile = voiceProfileRef.current;
    const voice =
      preferredVoiceRef.current ??
      pickVoiceForProfile(window.speechSynthesis.getVoices(), profile);

    utterance.rate =
      voiceRateRef.current ??
      (profile === "male" ? MALE_SPEECH_RATE : FEMALE_SPEECH_RATE);
    utterance.pitch =
      voicePitchRef.current ??
      (profile === "male" ? MALE_SPEECH_PITCH : FEMALE_SPEECH_PITCH);
    utterance.lang = voice?.lang ?? "en-US";

    if (voice) {
      utterance.voice = voice;
    }

    return utterance;
  }, []);

  const speakNextChunk = useCallback(() => {
    if (!isSupported) {
      return;
    }

    const speechId = activeSpeechIdRef.current;
    const chunks = chunksRef.current;

    if (!speechId || chunkIndexRef.current >= chunks.length) {
      utteranceRef.current = null;
      activeSpeechIdRef.current = null;
      setSpeakingId(null);
      return;
    }

    const utterance = createUtterance(chunks[chunkIndexRef.current]);
    utterance.onend = () => {
      chunkIndexRef.current += 1;
      speakNextChunk();
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      activeSpeechIdRef.current = null;
      setSpeakingId(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [createUtterance, isSupported]);

  const speak = useCallback(
    (id: string, text: string) => {
      if (!isSupported || !text.trim()) {
        return;
      }

      clearSpeakTimeout();
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      activeSpeechIdRef.current = null;
      chunksRef.current = [];
      chunkIndexRef.current = 0;

      speakTimeoutRef.current = window.setTimeout(() => {
        speakTimeoutRef.current = null;
        chunksRef.current = splitSpeechText(prepareSpeechText(text));
        chunkIndexRef.current = 0;
        activeSpeechIdRef.current = id;
        setSpeakingId(id);
        speakNextChunk();
      }, SPEAK_DELAY_MS);
    },
    [clearSpeakTimeout, isSupported, speakNextChunk],
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, speakingId, speakingIdRef, isSupported };
}
