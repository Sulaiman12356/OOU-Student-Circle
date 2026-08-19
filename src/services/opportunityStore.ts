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

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp-job-1',
    title: 'Campus Media Brand Designer & Creative Content Lead',
    description: 'Apex Brand Studio is hiring a talented student graphic designer & media strategist to produce high-impact social media creatives, flyers, merchandise mockups, and event visual kits for student-facing brand campaigns across Ago-Iwoye.',
    opportunityType: 'job',
    category: 'Freelance Jobs',
    organizationName: 'Apex Brand Studio & Tech Hub',
    organizationLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=150&auto=format&fit=crop&q=80',
    creatorId: 'client-1',
    creatorName: 'Johnson Peter',
    creatorRole: 'client',
    creatorEmail: 'johnson.peter@gmail.com',
    creatorPhone: '+234 802 333 4455',
    budget: 35000,
    budgetType: 'fixed',
    budgetString: '₦35,000 / Project Gig',
    deadline: '2026-10-15T23:59:59Z',
    location: 'Ago-Iwoye & Ijebu-Ode',
    campus: 'Ago-Iwoye Main Campus',
    workMode: 'hybrid',
    requirements: [
      'Proficiency in Adobe Photoshop, Illustrator, or Figma / Canva Pro',
      'Strong eye for modern minimalist typography, color palettes, and layout composition',
      'Demonstrated portfolio of logo designs, event banners, or flyer artwork',
      'Ability to meet quick 24-48hr turnaround times for high-priority campus events'
    ],
    responsibilities: [
      'Design digital banners, flyers, and carousel posts for weekly marketing pushes',
      'Coordinate with campus student brand ambassadors for visual assets',
      'Deliver print-ready high-resolution files (CMYK vector / PDF)'
    ],
    eligibility: [
      'Currently enrolled OOU Undergraduate student (Any level)',
      'Verified OOU Student ID / Matriculation status'
    ],
    targetFaculties: ['Faculty of Arts', 'Faculty of Science', 'Faculty of Social & Management Sciences'],
    targetLevels: ['200L', '300L', '400L'],
    attachments: [
      {
        id: 'att-1',
        name: 'Brand Guidelines & Creative Brief.pdf',
        url: '#attachment-brief-doc',
        type: 'document',
        size: '1.4 MB'
      }
    ],
    applicationCount: 2,
    status: 'open',
    moderationStatus: 'approved',
    moderatedBy: 'admin-1',
    moderatedAt: '2026-05-15T10:00:00Z',
    isFeatured: true,
    viewsCount: 412,
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z'
  },
  {
    id: 'opp-siwes-1',
    title: 'OOU ICT Directorate Frontend Software Engineering SIWES / Internship 2026',
    description: 'The OOU Directorate of Information & Communication Technology (ICT) invites ambitious student software engineers for an intensive 6-month SIWES & Industrial Attachment program. Interns will work alongside senior software architects building next-generation university portals, e-learning engines, and student verification microservices.',
    opportunityType: 'siwes',
    category: 'SIWES opportunities',
    organizationName: 'OOU Directorate of Information & Communication Technology (ICT)',
    organizationLogo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
    creatorId: 'admin-1',
    creatorName: 'ICT Directorate Admin',
    creatorRole: 'admin',
    creatorEmail: 'ict.internships@oouagoiwoye.edu.ng',
    creatorPhone: '+234 812 345 6789',
    budget: 45000,
    budgetType: 'stipend',
    budgetString: '₦45,000 / Month Monthly Stipend',
    deadline: '2026-11-01T23:59:59Z',
    location: 'OOU ICT Center, Ago-Iwoye Main Campus',
    campus: 'Ago-Iwoye Main Campus',
    workMode: 'hybrid',
    requirements: [
      'Foundational proficiency in HTML5, CSS3, modern JavaScript/TypeScript, and React',
      'Understanding of Git/GitHub version control workflows and RESTful APIs',
      'Enrolled in 300L/400L with official University SIWES / Industrial Attachment recommendation letter',
      'Passionate problem solver eager to write clean, maintainable, modular code'
    ],
    responsibilities: [
      'Build responsive, accessible user interfaces for campus web platforms',
      'Collaborate in agile sprint reviews and code audits',
      'Write end-to-end integration tests and documentation'
    ],
    eligibility: [
      '300L or 400L Computer Science, Computer Engineering, or Electrical Engineering students',
      'Minimum CGPA of 3.0 / 5.0'
    ],
    targetFaculties: ['Faculty of Science', 'Faculty of Engineering & Environmental Studies'],
    targetLevels: ['300L', '400L'],
    attachments: [
      {
        id: 'att-siwes-1',
        name: 'SIWES Internship Curriculum & Induction Schedule.pdf',
        url: '#attachment-siwes-curriculum',
        type: 'pdf',
        size: '2.1 MB'
      },
      {
        id: 'att-siwes-2',
        name: 'University Placement Acceptance Form.pdf',
        url: '#attachment-placement-form',
        type: 'pdf',
        size: '650 KB'
      }
    ],
    applicationCount: 3,
    status: 'open',
    moderationStatus: 'approved',
    moderatedBy: 'admin-1',
    moderatedAt: '2026-05-10T12:00:00Z',
    isFeatured: true,
    viewsCount: 680,
    createdAt: '2026-05-10T11:00:00Z',
    updatedAt: '2026-05-10T12:00:00Z'
  },
  {
    id: 'opp-comp-1',
    title: 'OOU Vice-Chancellor Undergraduate Innovation & Entrepreneurship Challenge 2026',
    description: 'The Office of the Vice-Chancellor in partnership with Alumni Enterprise Fund announces the 2026 Innovation Challenge. Student teams are invited to submit tech-enabled solutions addressing food security, renewable energy, campus commerce, or healthcare. Top 3 finalists receive equity-free seed grants, incubator mentorship, and incubation lab space.',
    opportunityType: 'competition',
    category: 'Competitions',
    organizationName: 'Office of the Vice-Chancellor & OOU Alumni Innovation Council',
    organizationLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    creatorId: 'admin-1',
    creatorName: 'Prof. Academic Directorate',
    creatorRole: 'admin',
    creatorEmail: 'vc.innovation@oouagoiwoye.edu.ng',
    budget: 1000000,
    budgetType: 'prize',
    budgetString: '₦1,000,000 Grand Prize Grant',
    deadline: '2026-12-15T23:59:59Z',
    location: 'OOU Senate Building & Otunba Gbenga Daniel Hall',
    campus: 'All Campuses (Ago-Iwoye, Sagamu, Ayetoro, Ibogun)',
    workMode: 'on_campus',
    requirements: [
      'Student-led team of 1 to 4 current OOU undergraduates',
      'Working software prototype, hardware demo, or validated business model',
      '5-minute pitch video link and 10-slide executive pitch deck PDF'
    ],
    responsibilities: [
      'Participate in the 3-day boot camp and pitch semi-finals',
      'Incorporate mentor feedback into the final demo day presentation'
    ],
    eligibility: [
      'Open to all currently registered OOU students across all 4 campuses',
      'Multi-disciplinary teams with female co-founders strongly encouraged'
    ],
    targetFaculties: ['All Faculties'],
    targetLevels: ['100L', '200L', '300L', '400L', '500L'],
    attachments: [
      {
        id: 'att-comp-1',
        name: 'Innovation Challenge Rulebook & Scoring Rubric.pdf',
        url: '#attachment-challenge-rules',
        type: 'pdf',
        size: '1.8 MB'
      },
      {
        id: 'att-comp-2',
        name: 'Pitch Deck Template (10 Slides).pptx',
        url: '#attachment-pitch-template',
        type: 'guideline',
        size: '3.4 MB'
      }
    ],
    applicationCount: 5,
    status: 'open',
    moderationStatus: 'approved',
    moderatedBy: 'admin-1',
    moderatedAt: '2026-05-01T08:00:00Z',
    isFeatured: true,
    viewsCount: 920,
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z'
  },
  {
    id: 'opp-schol-1',
    title: 'Ogun State High-Achiever Undergraduate Merit Scholarship 2026',
    description: 'Annual merit scholarship awarding tuition grants, book allowances, and academic stipends to exceptional undergraduates with a cumulative GPA of 4.0 and above. Funded by the Ogun State Higher Education Endowment Foundation.',
    opportunityType: 'scholarship',
    category: 'Scholarships',
    organizationName: 'Ogun State Higher Education Endowment Trust',
    organizationLogo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    creatorId: 'admin-1',
    creatorName: 'Scholarship Board Registrar',
    creatorRole: 'admin',
    creatorEmail: 'scholarships@ogunstate.gov.ng',
    budget: 200000,
    budgetType: 'grant',
    budgetString: '₦200,000 / Academic Session',
    deadline: '2026-11-30T23:59:59Z',
    location: 'OOU Academic Affairs Directorate',
    campus: 'All Campuses (Ago-Iwoye, Sagamu, Ayetoro, Ibogun)',
    workMode: 'on_campus',
    requirements: [
      'Official verified transcript showing Minimum 4.00 CGPA at the end of last academic session',
      'Two letters of recommendation from Head of Department or Faculty Dean',
      '500-word personal academic statement on career aspirations and community service impact'
    ],
    eligibility: [
      'Full-time registered undergraduate (200L to Final Year)',
      'Ogun State indigene or bona fide resident with Certificate of Origin / Residence'
    ],
    targetFaculties: ['All Faculties'],
    targetLevels: ['200L', '300L', '400L', '500L'],
    attachments: [
      {
        id: 'att-schol-1',
        name: 'Scholarship Application Guidelines & Verification Form.pdf',
        url: '#attachment-scholarship-guidelines',
        type: 'pdf',
        size: '950 KB'
      }
    ],
    applicationCount: 4,
    status: 'open',
    moderationStatus: 'approved',
    moderatedBy: 'admin-1',
    moderatedAt: '2026-05-02T10:00:00Z',
    isFeatured: true,
    viewsCount: 750,
    createdAt: '2026-05-02T09:00:00Z',
    updatedAt: '2026-05-02T10:00:00Z'
  },
  {
    id: 'opp-fellow-1',
    title: 'OOU Millennium Campus Tech & Leadership Fellowship',
    description: 'A 9-month prestigious leadership incubator for outstanding student tech innovators, organizers, and social entrepreneurs. Fellows receive leadership masterclasses, executive mentorship from global tech leaders, and project seed funding.',
    opportunityType: 'fellowship',
    category: 'Fellowships',
    organizationName: 'Global Campus Leadership Alliance & OOU Innovation Circle',
    creatorId: 'client-1',
    creatorName: 'Johnson Peter',
    creatorRole: 'client',
    creatorEmail: 'fellowship@campusleaders.org',
    budget: 150000,
    budgetType: 'stipend',
    budgetString: '₦150,000 Project Grant + Mentorship',
    deadline: '2026-10-31T23:59:59Z',
    location: 'Hybrid / Virtual & Ago-Iwoye Hub',
    campus: 'All Campuses (Ago-Iwoye, Sagamu, Ayetoro, Ibogun)',
    workMode: 'hybrid',
    requirements: [
      'Proven record of campus leadership, club founding, or tech community organizing',
      'Proposal for a social impact or technology solution tackling a community problem'
    ],
    eligibility: ['200L - 400L Students with active extracurricular track record'],
    applicationCount: 2,
    status: 'open',
    moderationStatus: 'approved',
    isFeatured: false,
    viewsCount: 310,
    createdAt: '2026-05-05T14:00:00Z',
    updatedAt: '2026-05-05T14:00:00Z'
  },
  {
    id: 'opp-proj-1',
    title: 'Solar Power Charging Station Prototype (Engineering Capstone Team)',
    description: 'Faculty of Engineering team is looking for a student electrical/embedded systems programmer to build an IoT battery monitoring firmware for solar charging hubs installed across Ibogun campus.',
    opportunityType: 'project',
    category: 'Projects',
    organizationName: 'OOU Ibogun Engineering Research Group',
    creatorId: 'student-1',
    creatorName: 'Onifade Sulaiman',
    creatorRole: 'student',
    budget: 180000,
    budgetType: 'fixed',
    budgetString: '₦180,000 Research Grant Milestone',
    deadline: '2026-10-20T23:59:59Z',
    location: 'Ibogun Campus Engineering Lab',
    campus: 'Ibogun Engineering Campus',
    workMode: 'on_campus',
    requirements: [
      'Experience with C/C++, Arduino / ESP32 microcontrollers',
      'Knowledge of basic telemetry, MQTT or HTTP API communication',
      'Enrolled at Ibogun campus or able to attend weekly lab test sessions'
    ],
    eligibility: ['300L - 500L Engineering & Computer Science students'],
    applicationCount: 1,
    status: 'open',
    moderationStatus: 'approved',
    isFeatured: false,
    viewsCount: 240,
    createdAt: '2026-05-08T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z'
  },
  {
    id: 'opp-mod-test-1',
    title: 'Campus Delivery Courier & Urgent Errand Runner Service',
    description: 'Looking for 3 energetic student runners with bicycles or motorbikes to handle fast campus food and document deliveries between Mini Campus and Perm Site.',
    opportunityType: 'job',
    category: 'Student Jobs',
    organizationName: 'Ago-Iwoye Fast Dispatch',
    creatorId: 'client-1',
    creatorName: 'Johnson Peter',
    creatorRole: 'client',
    budget: 20000,
    budgetType: 'fixed',
    budgetString: '₦20,000 / Weekly Payout',
    deadline: '2026-11-15T23:59:59Z',
    location: 'Ago-Iwoye Main & Mini Campus',
    campus: 'Ago-Iwoye Main Campus',
    workMode: 'on_campus',
    requirements: ['Must be resident in Ago-Iwoye', 'Punctual, trustworthy, and polite'],
    applicationCount: 0,
    status: 'under_review',
    moderationStatus: 'pending',
    isFeatured: false,
    viewsCount: 18,
    createdAt: '2026-05-18T14:00:00Z',
    updatedAt: '2026-05-18T14:00:00Z'
  }
];

export const initialApplications: OpportunityApplication[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-job-1',
    opportunityTitle: 'Campus Media Brand Designer & Creative Content Lead',
    opportunityType: 'job',
    opportunityCategory: 'Freelance Jobs',
    creatorId: 'client-1',
    studentId: 'student-2',
    studentName: 'Adebayo Samuel',
    studentEmail: 'adebayo.samuel@gmail.com',
    studentPhone: '+234 803 111 2233',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    studentFaculty: 'Faculty of Arts',
    studentDepartment: 'Fine and Applied Arts',
    studentLevel: '300L',
    studentMatric: 'FAA/2022/0119',
    coverMessage: 'Dear Johnson Peter, I am a 300L Fine and Applied Arts student and verified brand designer on StudentCircle with 19 completed 5-star jobs. I specialize in eye-catching campus event fliers and brand identity kits. I have attached my Behance portfolio and sample flyers.',
    portfolioLinks: [
      { title: 'Behance Portfolio', url: 'https://behance.net/adebayodesigns' },
      { title: 'Instagram Portfolio', url: 'https://instagram.com/adebayo_creatives' }
    ],
    relevantSkills: ['Graphic Design', 'Adobe Illustrator', 'Photoshop', 'Brand Identity', 'Flyer Design'],
    proposedBudget: 35000,
    availabilityDate: 'Immediately (Available 20 hrs/week)',
    attachments: [
      { name: 'Adebayo_Samuel_Design_Resume.pdf', url: '#attachment-resume', type: 'pdf' },
      { name: 'Recent_Campus_Event_Visuals.pdf', url: '#attachment-samples', type: 'pdf' }
    ],
    status: 'shortlisted',
    reviewerNotes: 'Strong portfolio and great ratings. Shortlisted for interview call.',
    createdAt: '2026-05-16T11:20:00Z',
    updatedAt: '2026-05-17T09:30:00Z'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-siwes-1',
    opportunityTitle: 'OOU ICT Directorate Frontend Software Engineering SIWES / Internship 2026',
    opportunityType: 'siwes',
    opportunityCategory: 'SIWES opportunities',
    creatorId: 'admin-1',
    studentId: 'student-1',
    studentName: 'Onifade Sulaiman',
    studentEmail: 'clarityofficial85@gmail.com',
    studentPhone: '+234 805 178 0169',
    studentAvatar: founderImage,
    studentFaculty: 'Faculty of Science',
    studentDepartment: 'Computer Science',
    studentLevel: '400L',
    studentMatric: 'CSC/2021/0482',
    coverMessage: 'Greetings ICT Directorate Team, As a 400L Computer Science student and creator of OOU StudentCircle with deep full-stack experience in React, TypeScript, and modern APIs, I am excited to apply for this SIWES opportunity to contribute to high-impact university infrastructure systems.',
    portfolioLinks: [
      { title: 'GitHub Profile', url: 'https://github.com/ipesola' },
      { title: 'Live Portfolio', url: 'https://ooustudentcircle.com' }
    ],
    relevantSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Firebase', 'REST APIs'],
    availabilityDate: 'Available for full 6-month term',
    attachments: [
      { name: 'Sulaiman_Onifade_CV.pdf', url: '#attachment-cv', type: 'pdf' },
      { name: 'Official_HOD_SIWES_Recommendation.pdf', url: '#attachment-recommendation', type: 'pdf' }
    ],
    status: 'pending',
    createdAt: '2026-05-12T14:10:00Z',
    updatedAt: '2026-05-12T14:10:00Z'
  }
];

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
