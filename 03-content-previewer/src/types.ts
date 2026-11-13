export const CONTENT_FORMATS = ["Article", "Graphic Asset", "Event Brief", "Web Page", "Email"] as const;
export type ContentFormat = (typeof CONTENT_FORMATS)[number];

export interface ContentDraft {
  headline: string;
  format: ContentFormat;
  tags: string[];
  author: string;
  publishDate: string;
  audience: string;
  description: string;
  hasImage: boolean;
  altText: string;
  destinationUrl: string;
}

export const REVIEW_STATUSES = ["Draft", "In Review", "Changes Requested", "Approved", "Published"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const QUALITY_CHECKS = [
  "Correct heading hierarchy",
  "Consistent formatting and terminology",
  "Relevant graphics and image quality",
  "Image alternative text",
  "Working links",
  "Complete metadata",
  "Responsive layout",
  "Appropriate visual styling",
] as const;
export type QualityCheck = (typeof QUALITY_CHECKS)[number];

export interface ReviewEvent {
  id: string;
  status: ReviewStatus;
  action: string;
  actor: string;
  changedAt: string;
  note?: string;
}

export interface ReviewItem extends ContentDraft {
  id: number;
  submittedAt: string;
  status: ReviewStatus;
  checklist: Record<QualityCheck, boolean>;
  history: ReviewEvent[];
}

export const REQUEST_TYPES = [
  "New webpage creation",
  "Existing content update",
  "Image or file replacement",
  "Metadata correction",
  "Content migration",
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export interface ContentRequest {
  id: number;
  type: RequestType;
  priority: "Low" | "Normal" | "High" | "Urgent";
  requester: string;
  dueDate: string;
  assetName: string;
  requestedChanges: string;
  createdAt: string;
}

export interface ValidationCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export function validateMetadata(draft: ContentDraft): ValidationCheck[] {
  const dateParts = draft.publishDate.split("-").map(Number);
  const parsedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(draft.publishDate)
    && dateParts.length === 3
    && parsedDate.getFullYear() === dateParts[0]
    && parsedDate.getMonth() === dateParts[1] - 1
    && parsedDate.getDate() === dateParts[2];
  let validUrl = true;
  if (draft.destinationUrl.trim()) {
    try {
      const url = new URL(draft.destinationUrl.trim());
      validUrl = url.protocol === "http:" || url.protocol === "https:";
    } catch {
      validUrl = false;
    }
  }

  return [
    { label: "Title", passed: Boolean(draft.headline.trim()), detail: draft.headline.trim() ? "Title is present." : "Add a title before submitting." },
    { label: "Author", passed: Boolean(draft.author.trim()), detail: draft.author.trim() ? "Author is present." : "Add an author." },
    { label: "Publish date", passed: validDate, detail: validDate ? "Date is valid." : "Use a real date in YYYY-MM-DD format." },
    { label: "Content type", passed: Boolean(draft.format), detail: "Content type is selected." },
    { label: "Target audience", passed: Boolean(draft.audience.trim()), detail: draft.audience.trim() ? "Audience is defined." : "Describe the intended audience." },
    { label: "Description", passed: draft.description.length <= 160, detail: `${draft.description.length}/160 characters.` },
    { label: "Image alt text", passed: !draft.hasImage || Boolean(draft.altText.trim()), detail: !draft.hasImage || draft.altText.trim() ? "Image description is ready." : "Add alt text when an image is used." },
    { label: "Destination URL", passed: validUrl, detail: !draft.destinationUrl.trim() ? "Optional field is empty." : validUrl ? "URL is valid." : "Enter a valid http or https URL." },
  ];
}
