import { useFeedbackSettings } from "../../../context/FeedbackSettingsContext";
import { FeedbackGoogleForm } from "./FeedbackGoogleForm";
import { FeedbackNative } from "./FeedbackNative";

type FeedbackProps = {
  tourStarted: boolean;
};

export const Feedback = (props: FeedbackProps) => {
  const { feedbackMode, googleFormEmbedUrl, googleFormViewUrl } =
    useFeedbackSettings();

  if (feedbackMode === "google_form") {
    return (
      <FeedbackGoogleForm
        {...props}
        embedUrl={googleFormEmbedUrl}
        viewUrl={googleFormViewUrl}
      />
    );
  }

  return <FeedbackNative {...props} />;
};
