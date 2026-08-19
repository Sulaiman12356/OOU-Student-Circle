import { UserProfile, StudentLevel, VerificationStatus, PortfolioItem, ServiceItem } from './index';

export type ConnectTab = 'explore' | 'suggestions' | 'connections' | 'requests';

export interface StudentInterest {
  id: string;
  name: string;
  category: 'Tech' | 'Business' | 'Creative' | 'Academic' | 'Social' | 'General';
}

export interface StudentAchievement {
  id: string;
  title: string;
  issuer?: string;
  year?: string;
  description?: string;
}

export interface StudentPrivacySettings {
  profileVisibility: 'public' | 'students_only' | 'hidden';
  showServices: boolean;
  allowConnectionRequests: boolean;
  allowDirectMessages: 'everyone' | 'connections_only' | 'none';
  showEmail: boolean;
  showPhone: boolean;
}

export interface PublicStudentProfile {
  id: string;
  fullName: string;
  profilePhoto?: string;
  coverPhoto?: string;
  department?: string;
  faculty?: string;
  level?: StudentLevel;
  location: string; // Campus (e.g., 'Main Campus (Permanent Site)', 'Mini Campus', etc.)
  campusSlug?: string;
  shortBio?: string;
  skills?: string[];
  interests?: string[];
  achievements?: StudentAchievement[];
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startYear?: string;
    endYear?: string;
    isCurrent?: boolean;
  }>;
  portfolio?: PortfolioItem[];
  services?: ServiceItem[];
  isVerified: boolean;
  verificationStatus?: VerificationStatus;
  rating?: number;
  reviewsCount?: number;
  completedJobsCount?: number;
  availableForWork?: boolean;
  createdAt: string;
  privacySettings?: StudentPrivacySettings;
  // Opt-in public contact
  publicEmail?: string;
  publicPhone?: string;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  senderDepartment?: string;
  senderLevel?: string;
  senderCampus?: string;
  receiverId: string;
  receiverName?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
  note?: string;
}

export interface StudentConnection {
  id: string;
  user1Id: string;
  user2Id: string;
  users: [string, string];
  connectedAt: string;
}

export interface StudentConnectFilter {
  search: string;
  campus: string;
  faculty: string;
  department: string;
  level: string;
  skill: string;
  interest: string;
  onlyVerified: boolean;
  availableForWork: boolean;
}

export interface SmartRecommendations {
  nearCampus: PublicStudentProfile[];
  similarSkills: PublicStudentProfile[];
  inDepartment: PublicStudentProfile[];
  youMayKnow: PublicStudentProfile[];
}
