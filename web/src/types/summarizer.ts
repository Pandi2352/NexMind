export interface Summary {
  _id: string;
  sourceText: string;
  style: string;
  summaryText: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSummaryDto {
  sourceText: string;
  style?: string;
}
