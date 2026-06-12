import { useFeedbackSettings } from "../../../context/FeedbackSettingsContext";
import { FeedbackGoogleForm } from "./FeedbackGoogleForm";
import { FeedbackNative } from "./FeedbackNative";

export const Feedback = () => {
  const { feedbackMode, googleFormEmbedUrl, googleFormViewUrl } =
    useFeedbackSettings();

  if (feedbackMode === "google_form") {
    return (
      <FeedbackGoogleForm
        embedUrl={googleFormEmbedUrl}
        viewUrl={googleFormViewUrl}
      />
    );
  }

  return <FeedbackNative />;
};
