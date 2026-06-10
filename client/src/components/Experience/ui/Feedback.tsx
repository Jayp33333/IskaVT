import { USE_GOOGLE_FORM_FEEDBACK } from "../../../constants/feedbackConfig";
import { FeedbackGoogleForm } from "./FeedbackGoogleForm";
import { FeedbackNative } from "./FeedbackNative";

type FeedbackProps = {
  tourStarted: boolean;
};

export const Feedback = (props: FeedbackProps) =>
  USE_GOOGLE_FORM_FEEDBACK ? (
    <FeedbackGoogleForm {...props} />
  ) : (
    <FeedbackNative {...props} />
  );
