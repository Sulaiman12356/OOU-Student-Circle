import { 
  Opportunity, 
  OpportunityApplication, 
  OpportunityFilterOptions, 
  OpportunityType, 
  OpportunityCategory, 
  ModerationStatus, 
  OpportunityStatus, 
  ApplicationStatus 
} from '../types/opportunities';
import founderImage from '../assets/images/founder_sulaiman.jpg';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { DataStore } from './dataStore';

const STORAGE_OPPORTUNITIES_KEY = 'oou_studentcircle_opportunities_v1';
const STORAGE_APPLICATIONS_KEY = 'oou_studentcircle_opportunity_applications_v1';
const STORAGE_BOOKMARKS_KEY = 'oou_studentcircle_opportunity_bookmarks_v1';

// Initial Opportunities - Empty, dynamically created by employers, clients & students
export const initialOpportunities: Opportunity[] = [];

// Initial Applications - Empty, dynamically submitted by students
export const initialApplications: OpportunityApplication[] = [];

export class OpportunityStore {
  private static getStored<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  }

  private static setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // --- OPPORTUNITIES ---
  static getOpportunities(filters?: Partial<OpportunityFilterOptions>): Opportunity[] {
    let list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);

    if (!filters) return list;

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(op => 
        op.title.toLowerCase().includes(q) ||
        op.description.toLowerCase().includes(q) ||
        op.organizationName.toLowerCase().includes(q) ||
        op.category.toLowerCase().includes(q) ||
        op.requirements.some(r => r.toLowerCase().includes(q)) ||
        (op.targetFaculties && op.targetFaculties.some(f => f.toLowerCase().includes(q)))
      );
    }

    if (filters.opportunityType && filters.opportunityType !== 'all') {
      list = list.filter(op => op.opportunityType === filters.opportunityType);
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter(op => op.category === filters.category);
    }

    if (filters.campus && filters.campus !== 'all') {
      list = list.filter(op => 
        op.campus === filters.campus || 
        op.campus.includes(filters.campus) ||
        op.campus.includes('All Campuses')
      );
    }

    if (filters.workMode && filters.workMode !== 'all') {
      list = list.filter(op => op.workMode === filters.workMode);
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter(op => op.status === filters.status);
    }

    if (filters.moderationStatus && filters.moderationStatus !== 'all') {
      list = list.filter(op => op.moderationStatus === filters.moderationStatus);
    }

    if (filters.onlyActiveDeadline) {
      const now = new Date().toISOString();
      list = list.filter(op => op.deadline >= now);
    }

    if (filters.minBudget !== undefined && filters.minBudget > 0) {
      list = list.filter(op => {
        const val = typeof op.budget === 'number' ? op.budget : op.budget.min;
        return val >= filters.minBudget!;
      });
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'deadline':
          list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
          break;
        case 'budget_high':
          list.sort((a, b) => {
            const valA = typeof a.budget === 'number' ? a.budget : a.budget.max;
            const valB = typeof b.budget === 'number' ? b.budget : b.budget.max;
            return valB - valA;
          });
          break;
        case 'budget_low':
          list.sort((a, b) => {
            const valA = typeof a.budget === 'number' ? a.budget : a.budget.min;
            const valB = typeof b.budget === 'number' ? b.budget : b.budget.min;
            return valA - valB;
          });
          break;
        case 'popular':
          list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
          break;
        case 'latest':
        default:
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return list;
  }

  static getOpportunityById(id: string): Opportunity | undefined {
    const list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
    return list.find(op => op.id === id);
  }

  static getOpportunitiesByCreator(creatorId: string): Opportunity[] {
    const list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
    return list.filter(op => op.creatorId === creatorId);
  }

  static saveOpportunity(opportunity: Opportunity): void {
    const list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
    const index = list.findIndex(op => op.id === opportunity.id);
    
    if (index >= 0) {
      list[index] = { ...opportunity, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(opportunity);
    }
    
    this.setStored(STORAGE_OPPORTUNITIES_KEY, list);

    // Sync with Firestore if available
    if (db) {
      try {
        const docRef = doc(db, 'opportunities', opportunity.id);
        setDoc(docRef, opportunity, { merge: true }).catch(err => console.warn('Firestore opportunity sync note:', err));
      } catch (err) {
        console.warn('Firestore save notice:', err);
      }
    }
  }

  static updateOpportunityModeration(
    opportunityId: string, 
    moderationStatus: ModerationStatus, 
    moderationNotes?: string,
    adminId?: string
  ): void {
    const list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
    const target = list.find(op => op.id === opportunityId);
    if (target) {
      target.moderationStatus = moderationStatus;
      if (moderationNotes !== undefined) target.moderationNotes = moderationNotes;
      if (adminId) target.moderatedBy = adminId;
      target.moderatedAt = new Date().toISOString();
      
      // Auto-sync status
      if (moderationStatus === 'approved' && target.status === 'under_review') {
        target.status = 'open';
      } else if (moderationStatus === 'suspended') {
        target.status = 'suspended';
      }

      target.updatedAt = new Date().toISOString();
      this.setStored(STORAGE_OPPORTUNITIES_KEY, list);

      if (db) {
        try {
          const docRef = doc(db, 'opportunities', opportunityId);
          setDoc(docRef, { 
            moderationStatus, 
            moderationNotes: moderationNotes || '',
            moderatedBy: adminId || 'admin',
            moderatedAt: target.moderatedAt,
            status: target.status,
            updatedAt: target.updatedAt
          }, { merge: true }).catch(err => console.warn('Firestore moderation sync note:', err));
        } catch (e) {
          console.warn('Firestore error:', e);
        }
      }

      // Notify creator
      DataStore.addNotification({
        userId: target.creatorId,
        title: `Opportunity ${moderationStatus === 'approved' ? 'Approved & Published' : moderationStatus === 'suspended' ? 'Suspended' : 'Moderation Updated'}`,
        message: `Your opportunity posting "${target.title}" is now ${moderationStatus}. ${moderationNotes ? `Note: ${moderationNotes}` : ''}`,
        type: 'system',
        link: `/opportunities`
      });
    }
  }

  static updateOpportunityStatus(
    opportunityId: string, 
    status: OpportunityStatus,
    hiredApplicantId?: string,
    hiredApplicantName?: string,
    hiredApplicationId?: string
  ): void {
    const list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
    const target = list.find(op => op.id === opportunityId);
    if (target) {
      target.status = status;
      if (hiredApplicantId) target.hiredApplicantId = hiredApplicantId;
      if (hiredApplicantName) target.hiredApplicantName = hiredApplicantName;
      if (hiredApplicationId) target.hiredApplicationId = hiredApplicationId;
      target.updatedAt = new Date().toISOString();
      this.setStored(STORAGE_OPPORTUNITIES_KEY, list);

      if (db) {
        try {
          const docRef = doc(db, 'opportunities', opportunityId);
          setDoc(docRef, { 
            status, 
            hiredApplicantId: hiredApplicantId || null,
            hiredApplicantName: hiredApplicantName || null,
            hiredApplicationId: hiredApplicationId || null,
            updatedAt: target.updatedAt 
          }, { merge: true }).catch(err => console.warn('Firestore update note:', err));
        } catch (e) {
          console.warn('Firestore error:', e);
        }
      }
    }
  }

  static deleteOpportunity(opportunityId: string): void {
    let list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
    list = list.filter(op => op.id !== opportunityId);
    this.setStored(STORAGE_OPPORTUNITIES_KEY, list);

    if (db) {
      try {
        deleteDoc(doc(db, 'opportunities', opportunityId)).catch(err => console.warn('Firestore delete note:', err));
      } catch (e) {
        console.warn('Firestore delete note:', e);
      }
    }
  }

  static incrementViews(opportunityId: string): void {
    const list = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
    const target = list.find(op => op.id === opportunityId);
    if (target) {
      target.viewsCount = (target.viewsCount || 0) + 1;
      this.setStored(STORAGE_OPPORTUNITIES_KEY, list);
    }
  }

  // --- APPLICATIONS ---
  static getApplications(opportunityId?: string, studentId?: string, creatorId?: string): OpportunityApplication[] {
    let list = this.getStored<OpportunityApplication[]>(STORAGE_APPLICATIONS_KEY, initialApplications);
    
    if (opportunityId) {
      list = list.filter(app => app.opportunityId === opportunityId);
    }
    if (studentId) {
      list = list.filter(app => app.studentId === studentId);
    }
    if (creatorId) {
      list = list.filter(app => app.creatorId === creatorId);
    }

    return list;
  }

  static getApplicationById(id: string): OpportunityApplication | undefined {
    const list = this.getStored<OpportunityApplication[]>(STORAGE_APPLICATIONS_KEY, initialApplications);
    return list.find(app => app.id === id);
  }

  static submitApplication(application: OpportunityApplication): void {
    const list = this.getStored<OpportunityApplication[]>(STORAGE_APPLICATIONS_KEY, initialApplications);
    const index = list.findIndex(app => app.id === application.id);

    if (index >= 0) {
      list[index] = { ...application, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(application);

      // Increment application count on the parent opportunity
      const oppList = this.getStored<Opportunity[]>(STORAGE_OPPORTUNITIES_KEY, initialOpportunities);
      const targetOpp = oppList.find(op => op.id === application.opportunityId);
      if (targetOpp) {
        targetOpp.applicationCount = (targetOpp.applicationCount || 0) + 1;
        this.setStored(STORAGE_OPPORTUNITIES_KEY, oppList);
      }
    }

    this.setStored(STORAGE_APPLICATIONS_KEY, list);

    if (db) {
      try {
        const docRef = doc(db, 'opportunityApplications', application.id);
        setDoc(docRef, application, { merge: true }).catch(err => console.warn('Firestore app save note:', err));
      } catch (err) {
        console.warn('Firestore app save notice:', err);
      }
    }

    // Notify Opportunity Creator
    DataStore.addNotification({
      userId: application.creatorId,
      title: 'New Opportunity Application Received!',
      message: `${application.studentName} (${application.studentDepartment || 'Student'}) applied for "${application.opportunityTitle}".`,
      type: 'proposal',
      link: `/opportunities`
    });

    // Notify Student
    DataStore.addNotification({
      userId: application.studentId,
      title: 'Application Submitted Successfully',
      message: `Your application for "${application.opportunityTitle}" has been delivered to the reviewer.`,
      type: 'proposal',
      link: `/student/jobs`
    });
  }

  static updateApplicationStatus(applicationId: string, status: ApplicationStatus, reviewerNotes?: string): void {
    const list = this.getStored<OpportunityApplication[]>(STORAGE_APPLICATIONS_KEY, initialApplications);
    const target = list.find(app => app.id === applicationId);
    if (target) {
      target.status = status;
      if (reviewerNotes !== undefined) target.reviewerNotes = reviewerNotes;
      target.updatedAt = new Date().toISOString();
      this.setStored(STORAGE_APPLICATIONS_KEY, list);

      if (db) {
        try {
          const docRef = doc(db, 'opportunityApplications', applicationId);
          setDoc(docRef, { status, reviewerNotes: reviewerNotes || '', updatedAt: target.updatedAt }, { merge: true })
            .catch(err => console.warn('Firestore app status update note:', err));
        } catch (e) {
          console.warn('Firestore error:', e);
        }
      }

      // Notify applicant
      let statusTitle = 'Application Status Updated';
      if (status === 'shortlisted') statusTitle = '🌟 Congratulations! You have been Shortlisted';
      if (status === 'hired' || status === 'awarded') statusTitle = '🎉 Congratulations! You have been Selected / Awarded!';
      if (status === 'rejected') statusTitle = 'Application Update';

      DataStore.addNotification({
        userId: target.studentId,
        title: statusTitle,
        message: `Your application for "${target.opportunityTitle}" is now marked as ${status.replace('_', ' ')}. ${reviewerNotes ? `Feedback: ${reviewerNotes}` : ''}`,
        type: 'proposal',
        link: `/student/jobs`
      });
    }
  }

  static deleteApplication(applicationId: string): void {
    let list = this.getStored<OpportunityApplication[]>(STORAGE_APPLICATIONS_KEY, initialApplications);
    list = list.filter(app => app.id !== applicationId);
    this.setStored(STORAGE_APPLICATIONS_KEY, list);

    if (db) {
      try {
        deleteDoc(doc(db, 'opportunityApplications', applicationId)).catch(err => console.warn('Firestore delete note:', err));
      } catch (e) {
        console.warn('Firestore delete error:', e);
      }
    }
  }

  // --- BOOKMARKS ---
  static getBookmarks(userId: string): string[] {
    const bookmarks = this.getStored<Record<string, string[]>>(STORAGE_BOOKMARKS_KEY, {});
    return bookmarks[userId] || [];
  }

  static getBookmarkedOpportunityIds(userId: string): string[] {
    return this.getBookmarks(userId);
  }

  static toggleBookmark(userId: string, opportunityId: string): boolean {
    const bookmarks = this.getStored<Record<string, string[]>>(STORAGE_BOOKMARKS_KEY, {});
    const userList = bookmarks[userId] || [];
    const index = userList.indexOf(opportunityId);
    let isNowBookmarked = false;

    if (index >= 0) {
      userList.splice(index, 1);
      isNowBookmarked = false;
    } else {
      userList.push(opportunityId);
      isNowBookmarked = true;
    }

    bookmarks[userId] = userList;
    this.setStored(STORAGE_BOOKMARKS_KEY, bookmarks);
    return isNowBookmarked;
  }

  static isBookmarked(userId: string, opportunityId: string): boolean {
    const bookmarks = this.getStored<Record<string, string[]>>(STORAGE_BOOKMARKS_KEY, {});
    return (bookmarks[userId] || []).includes(opportunityId);
  }
}
