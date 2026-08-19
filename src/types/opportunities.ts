export type OpportunityType = 
  | 'job'
  | 'internship'
  | 'siwes'
  | 'scholarship'
  | 'competition'
  | 'fellowship'
  | 'project'
  | 'program';

export type OpportunityCategory = 
  | 'Student Jobs'
  | 'Freelance Jobs'
  | 'Internships'
  | 'SIWES opportunities'
  | 'Projects'
  | 'Competitions'
  | 'Scholarships'
  | 'Fellowships'
  | 'Entrepreneurship opportunities'
  | 'Enterprise opportunities';

export type OpportunityStatus = 
  | 'open'
  | 'under_review'
  | 'filled'
  | 'expired'
  | 'suspended'
  | 'draft';

export type ModerationStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type OpportunityModerationStatus = ModerationStatus;

export type WorkMode = 'remote' | 'on_campus' | 'hybrid';

export type BudgetValue = number | {
  min: number;
  max: number;
  currency?: string;
  label?: string;
};

export interface OpportunityAttachment {
  id: string;
  name: string;
  url: string;
  type: 'document' | 'guideline' | 'link' | 'image' | 'pdf';
  size?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  opportunityType: OpportunityType;
  category: OpportunityCategory;
  organizationName: string;
  organizationLogo?: string;
  creatorId: string;
  creatorName: string;
  creatorRole: 'student' | 'client' | 'admin' | 'faculty' | 'enterprise';
  creatorEmail?: string;
  creatorPhone?: string;
  creatorAvatar?: string;
  budget: BudgetValue;
  budgetType?: 'fixed' | 'range' | 'stipend' | 'prize' | 'grant' | 'unpaid' | 'hourly';
  budgetString?: string;
  deadline: string; // ISO string
  location: string;
  campus: string; // Ago-Iwoye Main, Sagamu Medical, Ayetoro Agricultural, Ibogun Engineering, All Campuses, Remote
  workMode: WorkMode;
  requirements: string[];
  responsibilities?: string[];
  eligibility?: string[];
  targetFaculties?: string[];
  targetLevels?: string[];
  attachments?: OpportunityAttachment[];
  applicationCount: number;
  status: OpportunityStatus;
  moderationStatus: ModerationStatus;
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  isFeatured?: boolean;
  viewsCount?: number;
  hiredApplicantId?: string;
  hiredApplicantName?: string;
  hiredApplicationId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 
  | 'pending'
  | 'under_review'
  | 'shortlisted'
  | 'rejected'
  | 'hired'
  | 'awarded';

export interface OpportunityApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: OpportunityType;
  opportunityCategory: OpportunityCategory;
  creatorId: string; // Job owner ID
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentAvatar?: string;
  studentFaculty?: string;
  studentDepartment?: string;
  studentLevel?: string;
  studentMatric?: string;
  coverMessage: string;
  portfolioLinks: { title: string; url: string }[];
  relevantSkills: string[];
  proposedBudget?: number;
  availabilityDate?: string;
  attachments?: { name: string; url: string; type: string }[];
  status: ApplicationStatus;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityFilterOptions {
  searchQuery: string;
  opportunityType: string;
  category: string;
  campus: string;
  workMode: string;
  minBudget: number;
  maxBudget: number;
  status: string;
  moderationStatus: string;
  onlyActiveDeadline: boolean;
  sortBy: 'latest' | 'deadline' | 'budget_high' | 'budget_low' | 'popular';
}
