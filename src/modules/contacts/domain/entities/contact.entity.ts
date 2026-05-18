export interface ContactEntity {
  id: string;
  fullName: string;
  jobTitle: string | null;
  phoneNumber: string;
  email: string;
  isInternal: boolean;
  linkedUserId: string | null;
  organizationId: string;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
