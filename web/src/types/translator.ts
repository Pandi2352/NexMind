export interface Translation {
  _id: string;
  sourceText: string;
  targetLanguage: string;
  sourceLanguage: string;
  translatedText: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTranslationDto {
  sourceText: string;
  targetLanguage: string;
  sourceLanguage?: string;
}
