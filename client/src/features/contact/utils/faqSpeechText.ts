import type {
  ContactFaqItem,
  ContactFaqStep,
  ContactFaqSubItem,
} from "../constants";

function getStepSpeechText(step: ContactFaqStep, index: number): string {
  const parts = [`Step ${index + 1}. ${step.title}`];

  if (step.description) {
    parts.push(step.description);
  }

  if (step.link) {
    parts.push(`Link: ${step.link.label}`);
  }

  if (step.requirements?.length) {
    parts.push("Requirements.");
    step.requirements.forEach((item, reqIndex) => {
      parts.push(`${reqIndex + 1}. ${item}`);
    });
  }

  if (step.exampleLabel) {
    parts.push(step.exampleLabel);
  }

  return parts.join(". ");
}

function getFaqFullSpeechText(
  item: ContactFaqItem | ContactFaqSubItem,
): string {
  const parts: string[] = [item.question];

  if (item.answer) {
    parts.push(item.answer);
  }

  if ("requirementsHeading" in item && item.requirementsHeading) {
    parts.push(item.requirementsHeading);
  }

  if ("requirements" in item && item.requirements?.length) {
    item.requirements.forEach((requirement, index) => {
      parts.push(`${index + 1}. ${requirement}`);
    });
  }

  if ("steps" in item && item.steps?.length) {
    item.steps.forEach((step, index) => {
      parts.push(getStepSpeechText(step, index));
    });
  }

  return parts.join(". ");
}

export function getFaqSpeechText(
  item: ContactFaqItem | ContactFaqSubItem,
): string {
  const hasSubItems = "subItems" in item && item.subItems?.length;

  if (hasSubItems) {
    const parts: string[] = [];

    if (item.answer) {
      parts.push(item.answer);
    }

    const options = item.subItems!.map((subItem) => subItem.question);
    parts.push(
      `Choose one of the following for step-by-step instructions: ${options.join(", ")}.`,
    );

    return parts.join(" ");
  }

  return getFaqFullSpeechText(item);
}
