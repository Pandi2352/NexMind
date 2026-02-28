export interface HealthConsultation {
  _id: string;
  symptoms: string;
  age?: number;
  gender?: string;
  existingConditions?: string;
  advice: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthConsultationDto {
  symptoms: string;
  age?: number;
  gender?: string;
  existingConditions?: string;
}
