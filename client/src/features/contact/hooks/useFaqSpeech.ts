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

const SPEECH_RATE = 1.12;
const SPEECH_PITCH = 1.16;
const SPEAK_CHUNK_SIZE = 280;

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

const SPEAK_DELAY_MS = 80;

/** Normalize acronyms so browser TTS pronounces them correctly. */
function prepareSpeechText(text: string): string {
  return text
    .replace(/\bPUP\b/g, "P U P")
    .replace(/\bDIT\b/g, "D I T")
    .replace(/\bSIS\b/g, "S I S")
    .replace(/\bISKA\b/gi, "iska");
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

export function useFaqSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const speakingIdRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speakTimeoutRef = useRef<number | null>(null);
  const chunkIndexRef = useRef(0);
  const chunksRef = useRef<string[]>([]);
  const activeSpeechIdRef = useRef<string | null>(null);
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    speakingIdRef.current = speakingId;
  }, [speakingId]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const loadVoices = () => {
      preferredVoiceRef.current = pickEnergeticStudentVoice(
        window.speechSynthesis.getVoices(),
      );
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported]);

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
    const voice =
      preferredVoiceRef.current ??
      pickEnergeticStudentVoice(window.speechSynthesis.getVoices());

    utterance.rate = SPEECH_RATE;
    utterance.pitch = SPEECH_PITCH;
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
