import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildGoogleFormUrls,
  DEFAULT_FEEDBACK_MODE,
  getDefaultGoogleFormUrl,
} from "../constants/feedbackConfig";
import { settingsAPI, type FeedbackMode } from "../services/settingsApi";

type FeedbackSettingsContextValue = {
  feedbackMode: FeedbackMode;
  googleFormUrl: string;
  googleFormEmbedUrl: string;
  googleFormViewUrl: string;
  loading: boolean;
  refresh: () => Promise<void>;
};

const FeedbackSettingsContext =
  createContext<FeedbackSettingsContextValue | null>(null);

export function FeedbackSettingsProvider({ children }: { children: ReactNode }) {
  const [feedbackMode, setFeedbackMode] =
    useState<FeedbackMode>(DEFAULT_FEEDBACK_MODE);
  const [googleFormUrl, setGoogleFormUrl] = useState(getDefaultGoogleFormUrl());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await settingsAPI.getPublic();
      setFeedbackMode(response.data.feedbackMode);
      setGoogleFormUrl(response.data.googleFormUrl);
    } catch {
      setFeedbackMode(DEFAULT_FEEDBACK_MODE);
      setGoogleFormUrl(getDefaultGoogleFormUrl());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const urls = useMemo(
    () => buildGoogleFormUrls(googleFormUrl),
    [googleFormUrl]
  );

  const value = useMemo(
    () => ({
      feedbackMode,
      googleFormUrl,
      googleFormEmbedUrl: urls.embedUrl,
      googleFormViewUrl: urls.viewUrl,
      loading,
      refresh: load,
    }),
    [feedbackMode, googleFormUrl, urls, loading, load]
  );

  return (
    <FeedbackSettingsContext.Provider value={value}>
      {children}
    </FeedbackSettingsContext.Provider>
  );
}

export function useFeedbackSettings() {
  const context = useContext(FeedbackSettingsContext);
  if (!context) {
    throw new Error(
      "useFeedbackSettings must be used within FeedbackSettingsProvider"
    );
  }
  return context;
}
