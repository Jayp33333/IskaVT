import { useEffect, useRef, useState } from "react";
import useWorld from "../../../hooks/useWorld";
import { DestinationCelebration } from "./DestinationCelebration";
import { useFaqSpeech } from "../../../features/contact/hooks/useFaqSpeech";
import { getArrivalTtsMessage } from "../../../data/campusGuideContent";

const ARRIVAL_PAUSE_MS = 2000;
const CELEBRATION_HIDE_MS = 6000;

export const DestinationChecker = () => {
  const characterPosition = useWorld((state: any) => state.characterPosition);
  const pinPosition = useWorld((state: any) => state.pinPosition);
  const isPinConfirmed = useWorld((state: any) => state.isPinConfirmed);
  const isPinTeleported = useWorld((state: any) => state.isPinTeleported);
  const selectedDestination = useWorld((state: any) => state.selectedDestination);
  const arrivalBannerDestination = useWorld((state: any) => state.arrivalBannerDestination);
  const setIsPinConfirmed = useWorld((state: any) => state.setIsPinConfirmed);
  const setPinPosition = useWorld((state: any) => state.setPinPosition);
  const setSelectedDestination = useWorld((state: any) => state.setSelectedDestination);
  const setSelectedDestinationId = useWorld((state: any) => state.setSelectedDestinationId);
  const setIsArrivalPaused = useWorld((state: any) => state.setIsArrivalPaused);
  const setArrivalBannerDestination = useWorld((state: any) => state.setArrivalBannerDestination);

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationBurstKey, setCelebrationBurstKey] = useState(0);
  const arrivalTimersRef = useRef<number[]>([]);
  const { speak, stop, isSupported } = useFaqSpeech();

  const clearArrivalTimers = () => {
    arrivalTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    arrivalTimersRef.current = [];
  };

  const scheduleArrivalTimers = () => {
    clearArrivalTimers();

    arrivalTimersRef.current = [
      window.setTimeout(() => setIsArrivalPaused(false), ARRIVAL_PAUSE_MS),
      window.setTimeout(() => {
        setShowCelebration(false);
        setIsArrivalPaused(false);
      }, CELEBRATION_HIDE_MS),
    ];
  };

  useEffect(() => {
    if (!isPinConfirmed || !characterPosition || !pinPosition) return;

    const THRESHOLD = 1.5;
    const interval = setInterval(() => {
      const distance = characterPosition.distanceTo(pinPosition);

      if (distance <= THRESHOLD && !isPinTeleported) {
        const destinationLabel = selectedDestination || "your destination";
        setArrivalBannerDestination(destinationLabel);
        setPinPosition(null);
        setIsPinConfirmed(false);
        setIsArrivalPaused(true);
        setCelebrationBurstKey((key) => key + 1);
        setShowCelebration(true);
        setSelectedDestination(null);
        setSelectedDestinationId(null);
        if (isSupported) {
          speak("tour-arrived", getArrivalTtsMessage(destinationLabel));
        }
        scheduleArrivalTimers();

        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    characterPosition,
    pinPosition,
    isPinConfirmed,
    isPinTeleported,
    selectedDestination,
    setIsPinConfirmed,
    setPinPosition,
    setSelectedDestination,
    setSelectedDestinationId,
    setArrivalBannerDestination,
    isSupported,
    speak,
  ]);

  useEffect(() => {
    if (!arrivalBannerDestination && showCelebration) {
      clearArrivalTimers();
      setShowCelebration(false);
      setIsArrivalPaused(false);
    }
  }, [arrivalBannerDestination, showCelebration, setIsArrivalPaused]);

  useEffect(
    () => () => {
      clearArrivalTimers();
      stop();
    },
    [stop],
  );

  return (
    <DestinationCelebration active={showCelebration} burstKey={celebrationBurstKey} />
  );
};
