export const CONTENT_FORMATS = ["Article", "Graphic Asset", "Event Brief"] as const;
export type ContentFormat = (typeof CONTENT_FORMATS)[number];

export interface ContentDraft {
  headline: string;
  format: ContentFormat;
  tags: string[];
}

export interface ReviewItem extends ContentDraft {
  id: number;
  submittedAt: string;
}
