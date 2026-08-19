import { 
  UserProfile, 
  ServiceItem, 
  JobPost, 
  JobProposal, 
  ChatMessage, 
  Conversation, 
  ReviewItem, 
  AppNotification, 
  NotificationType,
  WalletTransaction, 
  VerificationRequest, 
  PlatformReport, 
  AdminLog, 
  PlatformSettings,
  UserRole,
  ServiceRequest,
  ServiceQuote,
  ServiceOrder,
  ServiceReview,
  PricingType
} from '../types';
import founderImage from '../assets/images/founder_sulaiman.jpg';

// Storage keys
const STORAGE_PREFIX = 'oou_studentcircle_';

// Initial Demo Seed Users
export const initialUsers: UserProfile[] = [
  {
    id: 'student-1',
    email: 'clarityofficial85@gmail.com',
    role: 'student',
    fullName: 'Onifade Sulaiman',
    phoneNumber: '+234 805 178 0169',
    profilePhoto: founderImage,
    location: 'Ago-Iwoye (Main Campus)',
    faculty: 'Faculty of Science',
    department: 'Computer Science',
    level: '400L',
    matricNumber: 'CSC/2021/0482',
    skills: ['Web Development', 'React', 'TypeScript', 'Tailwind CSS', 'UI/UX Design', 'Node.js'],
    shortBio: 'Computer Science student and full-stack web developer passionate about building digital products that empower students and solve real community problems.',
    rating: 4.9,
    reviewsCount: 28,
    completedJobsCount: 28,
    totalEarnings: 245000,
    availableForWork: true,
    isVerified: true,
    verificationStatus: 'verified',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-05-12T14:30:00Z',
    portfolio: [
      {
        id: 'p-1',
        title: 'OOU Campus Marketplace',
        description: 'Modern student portal and service directory built with React.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        projectUrl: 'https://github.com/ipesola/oou-studentcircle'
      },
      {
        id: 'p-2',
        title: 'Ago-Iwoye Food Delivery App UI',
        description: 'Clean mobile interface design for local restaurant deliveries.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'student-2',
    email: 'adebayo.samuel@gmail.com',
    role: 'student',
    fullName: 'Adebayo Samuel',
    phoneNumber: '+234 803 111 2233',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    location: 'Ago-Iwoye (Mini Campus)',
    faculty: 'Faculty of Arts',
    department: 'Fine and Applied Arts',
    level: '300L',
    matricNumber: 'FAA/2022/0119',
    skills: ['Logo Design', 'Brand Identity', 'Flyer Design', 'Photoshop', 'Illustrator'],
    shortBio: 'Graphic designer specialized in minimalist logos, professional business branding, social media fliers and print design.',
    rating: 4.8,
    reviewsCount: 19,
    completedJobsCount: 19,
    totalEarnings: 95000,
    availableForWork: true,
    isVerified: true,
    verificationStatus: 'verified',
    status: 'active',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-05-10T12:00:00Z'
  },
  {
    id: 'student-3',
    email: 'maryam.adeola@gmail.com',
    role: 'student',
    fullName: 'Maryam Adeola',
    phoneNumber: '+234 814 998 7766',
    profilePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    location: 'Ago-Iwoye (Main Campus)',
    faculty: 'Faculty of Social and Management Sciences',
    department: 'Mass Communication',
    level: '300L',
    matricNumber: 'MAC/2022/0304',
    skills: ['Content Writing', 'Copywriting', 'Social Media Management', 'Proofreading', 'SEO Writing'],
    shortBio: 'Mass Communication student, creative writer, and social media strategist helping small businesses tell compelling brand stories.',
    rating: 4.9,
    reviewsCount: 14,
    completedJobsCount: 14,
    totalEarnings: 72000,
    availableForWork: true,
    isVerified: true,
    verificationStatus: 'verified',
    status: 'active',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-05-14T11:20:00Z'
  },
  {
    id: 'student-4',
    email: 'praise.daniel@gmail.com',
    role: 'student',
    fullName: 'Praise Daniel',
    phoneNumber: '+234 809 334 5566',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    location: 'Sagamu Campus',
    faculty: 'Faculty of Basic Medical Sciences',
    department: 'Biochemistry',
    level: '300L',
    matricNumber: 'BCH/2022/0088',
    skills: ['Photography', 'Video Editing', 'Premiere Pro', 'Event Coverage', 'Reels Creation'],
    shortBio: 'Campus event photographer & short-form video editor producing viral visual content for student brands and university events.',
    rating: 4.7,
    reviewsCount: 8,
    completedJobsCount: 8,
    totalEarnings: 55000,
    availableForWork: true,
    isVerified: false,
    verificationStatus: 'pending',
    status: 'active',
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'client-1',
    email: 'johnson.peter@gmail.com',
    role: 'client',
    fullName: 'Johnson Peter',
    phoneNumber: '+234 802 333 4455',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    location: 'Ago-Iwoye & Ijebu-Ode',
    businessName: 'Apex Brand Studio & Tech Hub',
    businessCategory: 'Marketing & Digital Services',
    businessDescription: 'Creative studio and coworking space empowering campus enterprises in Ogun State.',
    jobsPostedCount: 5,
    totalSpent: 85000,
    isVerified: true,
    status: 'active',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-05-15T09:00:00Z'
  },
  {
    id: 'admin-1',
    email: 'clarityofficial85@gmail.com',
    role: 'admin',
    fullName: 'Onifade Sulaiman (Platform Admin)',
    phoneNumber: '+234 805 178 0169',
    profilePhoto: founderImage,
    location: 'OOU Main Campus Admin Hub',
    isVerified: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z'
  }
];

// Initial Demo Seed Services
export const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    studentId: 'student-2',
    studentName: 'Adebayo Samuel',
    studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Fine and Applied Arts',
    studentLevel: '300L',
    studentFaculty: 'Faculty of Arts',
    isStudentVerified: true,
    title: 'Modern Minimalist Logo & Complete Brand Identity Design',
    category: 'Graphic Design',
    description: 'Get a clean, bespoke logo that elevates your campus business. Includes 3 initial concepts, unlimited revisions, high-resolution source vector files (AI, SVG, PNG, PDF), and realistic 3D brand mockups.',
    skills: ['Graphic Design', 'Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Photoshop'],
    tags: ['Logo Design', 'Branding', 'Vector Art', 'Flyer Design'],
    startingPrice: 5000,
    price: 5000,
    pricingType: 'Starting From',
    deliveryTime: '2 Days',
    deliveryDays: 2,
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Mini Campus & Permanent Site',
    location: 'Ago-Iwoye Main Campus',
    isDigital: true,
    coverPhoto: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    ],
    portfolioLinks: [
      { title: 'Behance Portfolio', url: 'https://behance.net/adebayodesigns' }
    ],
    availability: 'Available Now',
    viewsCount: 148,
    status: 'published',
    rating: 4.8,
    reviewsCount: 12,
    completedOrders: 19,
    ordersCompleted: 19,
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-05-10T12:00:00Z'
  },
  {
    id: 'srv-2',
    studentId: 'student-1',
    studentName: 'Onifade Sulaiman',
    studentPhoto: founderImage,
    studentDepartment: 'Computer Science',
    studentLevel: '400L',
    studentFaculty: 'Faculty of Science',
    isStudentVerified: true,
    title: 'Custom Responsive Full-Stack Web App Development (React & Node)',
    category: 'Web Development',
    description: 'Transform your startup idea, student society, or business with a blazing fast, high-converting web platform. Built with React 18, TypeScript, Tailwind CSS, and secure APIs. Includes mobile responsiveness, SEO optimization, and deployment support.',
    skills: ['Web Development', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'API Integration'],
    tags: ['Web Development', 'Full-Stack', 'React', 'Frontend', 'Backend'],
    startingPrice: 25000,
    price: 25000,
    pricingType: 'Fixed Price',
    deliveryTime: '4 Days',
    deliveryDays: 4,
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Permanent Site & Cross-Campus Remote',
    location: 'Ago-Iwoye Main Campus',
    isDigital: true,
    coverPhoto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
    ],
    portfolioLinks: [
      { title: 'Live App Demo', url: 'https://github.com/ipesola' }
    ],
    availability: 'Available Now',
    viewsCount: 312,
    status: 'published',
    rating: 4.9,
    reviewsCount: 18,
    completedOrders: 28,
    ordersCompleted: 28,
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-05-12T14:30:00Z'
  },
  {
    id: 'srv-3',
    studentId: 'student-3',
    studentName: 'Maryam Adeola',
    studentPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Mass Communication',
    studentLevel: '300L',
    studentFaculty: 'Faculty of Social and Management Sciences',
    isStudentVerified: true,
    title: 'SEO Article Writing, Research Papers & High-Converting Copywriting',
    category: 'Writing',
    description: 'Engaging, well-researched, plagiarism-free content tailored to your target audience. Includes proofreading, structural formatting, SEO keyword placement, and references.',
    skills: ['Writing', 'Content Writing', 'Copywriting', 'Proofreading', 'SEO Writing'],
    tags: ['Content Writing', 'Research', 'Editing', 'Copywriting'],
    startingPrice: 3500,
    price: 3500,
    pricingType: 'Per Unit',
    deliveryTime: '24 Hours',
    deliveryDays: 1,
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Mini Campus & Ago-Iwoye',
    location: 'Ago-Iwoye Main Campus',
    isDigital: true,
    coverPhoto: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=80'
    ],
    availability: 'Available Now',
    viewsCount: 189,
    status: 'published',
    rating: 4.9,
    reviewsCount: 9,
    completedOrders: 14,
    ordersCompleted: 14,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-05-14T11:20:00Z'
  },
  {
    id: 'srv-4',
    studentId: 'student-3',
    studentName: 'Maryam Adeola',
    studentPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Mass Communication',
    studentLevel: '300L',
    studentFaculty: 'Faculty of Social and Management Sciences',
    isStudentVerified: true,
    title: 'Social Media Management & Instagram/TikTok Growth Strategy',
    category: 'Social Media Management',
    description: 'Grow your student business or brand on Instagram, TikTok, and Twitter. Includes 14 custom graphics, weekly content schedule, captions, hashtags, and direct customer engagement.',
    skills: ['Social Media Management', 'Digital Marketing', 'Instagram Growth', 'Canva'],
    tags: ['Social Media', 'Marketing', 'Instagram', 'Content Strategy'],
    startingPrice: 15000,
    price: 15000,
    pricingType: 'Starting From',
    deliveryTime: '7 Days',
    deliveryDays: 7,
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Cross-Campus & Ago-Iwoye',
    location: 'Ago-Iwoye Main Campus',
    isDigital: true,
    coverPhoto: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80'
    ],
    availability: 'Weekdays (8am - 6pm)',
    viewsCount: 164,
    status: 'published',
    rating: 4.8,
    reviewsCount: 5,
    completedOrders: 7,
    ordersCompleted: 7,
    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-05-08T10:00:00Z'
  },
  {
    id: 'srv-5',
    studentId: 'student-4',
    studentName: 'Praise Daniel',
    studentPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Biochemistry',
    studentLevel: '300L',
    studentFaculty: 'Faculty of Basic Medical Sciences',
    isStudentVerified: false,
    title: '4K Campus Event Photography & Professional Portrait Sessions',
    category: 'Photography',
    description: 'High-definition 4K photography for department dinners, induction ceremonies, student birthdays, convocations, and brand product photoshoots. All edited high-res digital shots delivered via Google Drive within 48 hours.',
    skills: ['Photography', 'Event Coverage', 'Portrait Photography', 'Lightroom'],
    tags: ['Photography', 'Event Coverage', 'Portraits', 'Media'],
    startingPrice: 12000,
    price: 12000,
    pricingType: 'Starting From',
    deliveryTime: '2 Days',
    deliveryDays: 2,
    campus: 'Sagamu Medical Campus',
    serviceArea: 'Teaching Hospital (OOUTH) & Sagamu Hostels',
    location: 'Sagamu Medical Campus',
    isDigital: false,
    coverPhoto: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    ],
    availability: 'Weekends Only',
    viewsCount: 142,
    status: 'published',
    rating: 4.7,
    reviewsCount: 6,
    completedOrders: 8,
    ordersCompleted: 8,
    createdAt: '2024-03-10T16:00:00Z',
    updatedAt: '2024-05-01T10:00:00Z'
  },
  {
    id: 'srv-6',
    studentId: 'student-4',
    studentName: 'Praise Daniel',
    studentPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Biochemistry',
    studentLevel: '300L',
    studentFaculty: 'Faculty of Basic Medical Sciences',
    isStudentVerified: false,
    title: 'High-Impact Video Editing for Reels, TikToks & YouTube Recaps',
    category: 'Video Editing',
    description: 'Dynamic pacing, trending sound effects, captions, color grading, and b-roll cuts designed to maximize viral engagement on Instagram Reels and TikTok.',
    skills: ['Video Editing', 'Premiere Pro', 'CapCut', 'Reels Editing', 'Sound Design'],
    tags: ['Video Editing', 'Reels', 'TikTok', 'Short Form'],
    startingPrice: 8000,
    price: 8000,
    pricingType: 'Fixed Price',
    deliveryTime: '24 Hours',
    deliveryDays: 1,
    campus: 'Sagamu Medical Campus',
    serviceArea: 'Online Delivery / Nationwide',
    location: 'Sagamu Medical Campus',
    isDigital: true,
    coverPhoto: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80'
    ],
    availability: 'Available Now',
    viewsCount: 110,
    status: 'published',
    rating: 4.8,
    reviewsCount: 4,
    completedOrders: 5,
    ordersCompleted: 5,
    createdAt: '2024-03-15T12:00:00Z',
    updatedAt: '2024-05-02T10:00:00Z'
  },
  {
    id: 'srv-7',
    studentId: 'student-1',
    studentName: 'Onifade Sulaiman',
    studentPhoto: founderImage,
    studentDepartment: 'Computer Science',
    studentLevel: '400L',
    studentFaculty: 'Faculty of Science',
    isStudentVerified: true,
    title: 'Python, SQL & Data Analysis Tutoring (Beginner to Advanced)',
    category: 'Tutoring',
    description: '1-on-1 personalized academic tutoring in programming (Python, C++, Java, JavaScript) and data analysis (Excel, Pandas, SQL). Perfect for 100L-300L students preparing for exams, practical tests, or final year projects.',
    skills: ['Tutoring', 'Python', 'Data Analysis', 'SQL', 'Academic Mentorship'],
    tags: ['Tutoring', 'Programming', 'Python', 'Data Science', 'Academics'],
    startingPrice: 6000,
    price: 6000,
    pricingType: 'Per Unit',
    deliveryTime: '2-3 Days',
    deliveryDays: 3,
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Science Complex / Library Study Rooms',
    location: 'Ago-Iwoye Main Campus',
    isDigital: false,
    coverPhoto: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
    ],
    availability: 'By Appointment / Booking',
    viewsCount: 220,
    status: 'published',
    rating: 5.0,
    reviewsCount: 14,
    completedOrders: 18,
    ordersCompleted: 18,
    createdAt: '2024-02-25T14:00:00Z',
    updatedAt: '2024-05-15T09:00:00Z'
  },
  {
    id: 'srv-8',
    studentId: 'student-2',
    studentName: 'Adebayo Samuel',
    studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Fine and Applied Arts',
    studentLevel: '300L',
    studentFaculty: 'Faculty of Arts',
    isStudentVerified: true,
    title: 'Fast Project Spiral Binding, Color Printing & Document Formatting',
    category: 'Printing assistance',
    description: 'Skip long queues at the campus cybercafes! Get your course handouts, project work, seminar slides, and spiral bindings handled professionally with rapid pickup at Mini Campus or Permanent Site gate.',
    skills: ['Printing assistance', 'Binding', 'Formatting', 'Proofing', 'Campus Delivery'],
    tags: ['Printing', 'Binding', 'Projects', 'Handouts', 'Campus Pickup'],
    startingPrice: 1500,
    price: 1500,
    pricingType: 'Per Unit',
    deliveryTime: '24 Hours',
    deliveryDays: 1,
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Mini Campus Main Gate & High School Area',
    location: 'Ago-Iwoye Main Campus',
    isDigital: false,
    coverPhoto: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&auto=format&fit=crop&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&auto=format&fit=crop&q=80'
    ],
    availability: 'Available Now',
    viewsCount: 95,
    status: 'published',
    rating: 4.9,
    reviewsCount: 7,
    completedOrders: 11,
    ordersCompleted: 11,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-05-10T12:00:00Z'
  }
];

// Initial Demo Seed Jobs
export const initialJobs: JobPost[] = [
  {
    id: 'job-1',
    clientId: 'client-1',
    clientName: 'Johnson Peter',
    clientCompany: 'Apex Brand Studio',
    title: 'Need a UI/UX Designer to design modern mobile app screens',
    category: 'Design & Creative',
    description: 'We are developing a student campus utility app and need 6 high-fidelity Figma screens with clean typography and modern components.',
    budget: 15000,
    deadline: 'May 30, 2024',
    location: 'Ago-Iwoye / Remote',
    isDigital: true,
    requiredSkills: ['UI/UX Design', 'Figma', 'Mobile Design'],
    status: 'open',
    proposalsCount: 3,
    createdAt: '2024-05-15T09:30:00Z',
    updatedAt: '2024-05-15T09:30:00Z'
  },
  {
    id: 'job-2',
    clientId: 'client-1',
    clientName: 'Johnson Peter',
    clientCompany: 'Apex Brand Studio',
    title: 'Content Writer needed for campus magazine and blog articles',
    category: 'Writing & Translation',
    description: 'Looking for a skilled student writer to produce 3 insightful 800-word articles about tech and career development for OOU undergraduates.',
    budget: 8000,
    deadline: 'June 5, 2024',
    location: 'Remote',
    isDigital: true,
    requiredSkills: ['Content Writing', 'Research', 'Editing'],
    status: 'proposals_received',
    proposalsCount: 2,
    createdAt: '2024-05-14T15:00:00Z',
    updatedAt: '2024-05-14T15:00:00Z'
  },
  {
    id: 'job-3',
    clientId: 'client-1',
    clientName: 'Johnson Peter',
    clientCompany: 'Apex Brand Studio',
    title: 'Social Media Manager for local food brand in Ago-Iwoye',
    category: 'Marketing & Growth',
    description: 'Create engaging daily stories, product posts, and manage client inquiries on Instagram and WhatsApp for 2 weeks.',
    budget: 20000,
    deadline: 'June 10, 2024',
    location: 'Ago-Iwoye',
    isDigital: true,
    requiredSkills: ['Social Media Management', 'Canva', 'Content Strategy'],
    status: 'in_progress',
    proposalsCount: 4,
    hiredStudentId: 'student-3',
    hiredStudentName: 'Maryam Adeola',
    hiredProposalId: 'prop-3',
    createdAt: '2024-05-10T12:00:00Z',
    updatedAt: '2024-05-12T10:00:00Z'
  },
  {
    id: 'job-4',
    clientId: 'client-1',
    clientName: 'Johnson Peter',
    clientCompany: 'Apex Brand Studio',
    title: 'Web Developer to build landing page for student event',
    category: 'Tech & Development',
    description: 'Build a high-performance single page web application with ticket registration form and schedule.',
    budget: 25000,
    deadline: 'May 10, 2024',
    location: 'Remote',
    isDigital: true,
    requiredSkills: ['Web Development', 'React', 'Tailwind CSS'],
    status: 'completed',
    proposalsCount: 2,
    hiredStudentId: 'student-1',
    hiredStudentName: 'Onifade Sulaiman',
    hiredProposalId: 'prop-1',
    createdAt: '2024-05-01T08:00:00Z',
    updatedAt: '2024-05-10T18:00:00Z'
  }
];

// Initial Seed Proposals
export const initialProposals: JobProposal[] = [
  {
    id: 'prop-1',
    jobId: 'job-4',
    jobTitle: 'Web Developer to build landing page for student event',
    studentId: 'student-1',
    studentName: 'Onifade Sulaiman',
    studentPhoto: founderImage,
    studentDepartment: 'Computer Science',
    studentLevel: '400L',
    studentRating: 4.9,
    coverMessage: 'Hello Johnson! As a 400L Computer Science student with extensive React and Tailwind experience, I can build an ultra-fast, responsive landing page with full ticket registration within 3 days.',
    price: 25000,
    deliveryTime: '3 Days',
    status: 'accepted',
    createdAt: '2024-05-02T10:00:00Z'
  },
  {
    id: 'prop-2',
    jobId: 'job-1',
    jobTitle: 'Need a UI/UX Designer to design modern mobile app screens',
    studentId: 'student-2',
    studentName: 'Adebayo Samuel',
    studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Fine and Applied Arts',
    studentLevel: '300L',
    studentRating: 4.8,
    coverMessage: 'I would love to craft a clean, intuitive Figma prototype for your campus app. Check my portfolio for previous mobile design projects.',
    price: 15000,
    deliveryTime: '2 Days',
    status: 'pending',
    createdAt: '2024-05-15T10:30:00Z'
  },
  {
    id: 'prop-3',
    jobId: 'job-3',
    jobTitle: 'Social Media Manager for local food brand in Ago-Iwoye',
    studentId: 'student-3',
    studentName: 'Maryam Adeola',
    studentPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    studentDepartment: 'Mass Communication',
    studentLevel: '300L',
    studentRating: 4.9,
    coverMessage: 'As a Mass Comm student currently handling multiple food and lifestyle brand pages in Ago-Iwoye, I have a proven strategy to boost foot-traffic and WhatsApp orders.',
    price: 20000,
    deliveryTime: '14 Days',
    status: 'accepted',
    createdAt: '2024-05-11T09:00:00Z'
  }
];

// Initial Seed Reviews
export const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    jobId: 'job-4',
    jobTitle: 'Web Developer to build landing page for student event',
    reviewerId: 'client-1',
    reviewerName: 'Johnson Peter',
    reviewerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    reviewerRole: 'client',
    recipientId: 'student-1',
    recipientName: 'Onifade Sulaiman',
    rating: 5,
    feedback: 'Sulaiman is exceptional! He built our landing page ahead of schedule, communicated proactively, and delivered clean code. Highly recommended for any serious web project at OOU.',
    createdAt: '2024-05-10T19:00:00Z'
  },
  {
    id: 'rev-2',
    jobId: 'job-legacy-1',
    jobTitle: 'Corporate Logo & Brand Identity Package',
    reviewerId: 'client-1',
    reviewerName: 'Johnson Peter',
    reviewerRole: 'client',
    recipientId: 'student-2',
    recipientName: 'Adebayo Samuel',
    rating: 5,
    feedback: 'Adebayo created a stunning logo for our creative studio. Very creative mind and understood the brief instantly.',
    createdAt: '2024-04-18T14:00:00Z'
  }
];

// Initial Seed Service Requests (Module 3)
export const initialServiceRequests: ServiceRequest[] = [
  {
    id: 'sreq-1',
    serviceId: 'srv-2',
    serviceTitle: 'Custom Responsive Full-Stack Web App Development (React & Node)',
    serviceCategory: 'Web Development',
    serviceCoverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    providerId: 'student-1',
    providerName: 'Onifade Sulaiman',
    providerPhoto: founderImage,
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerEmail: 'johnson.peter@gmail.com',
    customerPhone: '+234 802 333 4455',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    customerRole: 'client',
    title: 'Department Seminar Registration & Ticket Portal',
    description: 'We need an interactive single-page registration site with responsive tables, speaker showcase, and PDF ticket generator for the upcoming Faculty conference.',
    requestedPrice: 35000,
    pricingType: 'Custom Quote',
    deadline: 'May 28, 2024',
    deliveryTime: '3 Days',
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Permanent Site',
    status: 'quoted',
    quoteId: 'squote-1',
    createdAt: '2024-05-14T10:00:00Z',
    updatedAt: '2024-05-14T14:30:00Z'
  },
  {
    id: 'sreq-2',
    serviceId: 'srv-1',
    serviceTitle: 'Modern Minimalist Logo & Complete Brand Identity Design',
    serviceCategory: 'Graphic Design',
    serviceCoverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    providerId: 'student-2',
    providerName: 'Adebayo Samuel',
    providerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerEmail: 'johnson.peter@gmail.com',
    customerPhone: '+234 802 333 4455',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    customerRole: 'client',
    title: 'Minimalist Logo for Campus Creative Studio',
    description: 'Need a vector logo with yellow/navy palette for our brand launch at Ago-Iwoye.',
    requestedPrice: 5000,
    pricingType: 'Starting From',
    deadline: 'May 18, 2024',
    deliveryTime: '2 Days',
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Mini Campus',
    status: 'accepted',
    orderId: 'sord-1',
    createdAt: '2024-05-08T09:00:00Z',
    updatedAt: '2024-05-08T11:00:00Z'
  },
  {
    id: 'sreq-3',
    serviceId: 'srv-7',
    serviceTitle: 'Python, SQL & Data Analysis Tutoring (Beginner to Advanced)',
    serviceCategory: 'Tutoring',
    serviceCoverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    providerId: 'student-1',
    providerName: 'Onifade Sulaiman',
    providerPhoto: founderImage,
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerEmail: 'johnson.peter@gmail.com',
    customerPhone: '+234 802 333 4455',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    customerRole: 'client',
    title: 'Weekend Data Analysis Prep (Pandas & SQL Queries)',
    description: 'Looking for 3 intensive revision sessions on data visualization and SQL queries ahead of project submission.',
    requestedPrice: 6000,
    pricingType: 'Per Unit',
    deadline: 'June 2, 2024',
    deliveryTime: '3 Days',
    campus: 'Main Campus (Ago-Iwoye)',
    serviceArea: 'Library Study Area',
    status: 'pending',
    createdAt: '2024-05-15T08:30:00Z',
    updatedAt: '2024-05-15T08:30:00Z'
  }
];

// Initial Seed Quotes (Module 3)
export const initialServiceQuotes: ServiceQuote[] = [
  {
    id: 'squote-1',
    requestId: 'sreq-1',
    serviceId: 'srv-2',
    serviceTitle: 'Custom Responsive Full-Stack Web App Development (React & Node)',
    serviceCoverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    providerId: 'student-1',
    providerName: 'Onifade Sulaiman',
    providerPhoto: founderImage,
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    price: 35000,
    deliveryTime: '3 Days',
    message: 'Hello Mr. Peter! I can build the complete conference registration portal with fast QR ticket check-in and responsive layout in 3 days.',
    scopeBreakdown: [
      'Full React 18 & Tailwind CSS responsive interface',
      'Instant PDF ticket generator with QR token',
      'Admin export of attendees to Excel/CSV',
      'Free hosting setup on Vercel/Netlify'
    ],
    validUntil: '2024-05-25T23:59:59Z',
    status: 'pending',
    createdAt: '2024-05-14T14:30:00Z',
    updatedAt: '2024-05-14T14:30:00Z'
  }
];

// Initial Seed Orders (Module 3)
export const initialServiceOrders: ServiceOrder[] = [
  {
    id: 'sord-1',
    serviceId: 'srv-1',
    serviceTitle: 'Modern Minimalist Logo & Complete Brand Identity Design',
    serviceCategory: 'Graphic Design',
    serviceCoverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    requestId: 'sreq-2',
    providerId: 'student-2',
    providerName: 'Adebayo Samuel',
    providerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    customerEmail: 'johnson.peter@gmail.com',
    amount: 5000,
    pricingType: 'Starting From',
    deliveryTime: '2 Days',
    requirements: 'Minimalist brand logo with high-res vector files.',
    status: 'completed',
    deliveryNotes: 'All vector source files (AI, SVG, PDF, PNG) delivered and approved.',
    deliveredAt: '2024-05-10T10:00:00Z',
    completedAt: '2024-05-10T12:00:00Z',
    hasReview: true,
    createdAt: '2024-05-08T11:00:00Z',
    updatedAt: '2024-05-10T12:00:00Z'
  },
  {
    id: 'sord-2',
    serviceId: 'srv-2',
    serviceTitle: 'Custom Responsive Full-Stack Web App Development (React & Node)',
    serviceCategory: 'Web Development',
    serviceCoverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    providerId: 'student-1',
    providerName: 'Onifade Sulaiman',
    providerPhoto: founderImage,
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    customerEmail: 'johnson.peter@gmail.com',
    amount: 25000,
    pricingType: 'Fixed Price',
    deliveryTime: '4 Days',
    requirements: 'Custom web portal for campus brand.',
    status: 'completed',
    deliveryNotes: 'Deployed live on production domain with clean GitHub source repository.',
    deliveredAt: '2024-05-12T12:00:00Z',
    completedAt: '2024-05-12T14:30:00Z',
    hasReview: true,
    createdAt: '2024-05-08T15:00:00Z',
    updatedAt: '2024-05-12T14:30:00Z'
  },
  {
    id: 'sord-3',
    serviceId: 'srv-7',
    serviceTitle: 'Python, SQL & Data Analysis Tutoring (Beginner to Advanced)',
    serviceCategory: 'Tutoring',
    serviceCoverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    providerId: 'student-1',
    providerName: 'Onifade Sulaiman',
    providerPhoto: founderImage,
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    amount: 6000,
    pricingType: 'Per Unit',
    deliveryTime: '3 Days',
    requirements: 'Personalized SQL query tutorials and pandas exercises.',
    status: 'in_progress',
    hasReview: false,
    createdAt: '2024-05-14T11:00:00Z',
    updatedAt: '2024-05-14T11:00:00Z'
  }
];

// Initial Seed Service Reviews (Module 3)
export const initialServiceReviews: ServiceReview[] = [
  {
    id: 'srev-1',
    serviceId: 'srv-2',
    serviceTitle: 'Custom Responsive Full-Stack Web App Development (React & Node)',
    orderId: 'sord-2',
    providerId: 'student-1',
    providerName: 'Onifade Sulaiman',
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    customerDepartment: 'Apex Brand Studio',
    rating: 5,
    title: 'Top Tier Developer in OOU!',
    comment: 'Sulaiman is a gifted software engineer! He delivered our complete platform with pristine code, instant loading speeds, and great communication throughout. Best tech talent on campus.',
    tags: ['Fast Delivery', 'Top Quality Code', 'Great Communication', 'Highly Recommended'],
    isVerifiedTransaction: true,
    createdAt: '2024-05-12T15:00:00Z'
  },
  {
    id: 'srev-2',
    serviceId: 'srv-1',
    serviceTitle: 'Modern Minimalist Logo & Complete Brand Identity Design',
    orderId: 'sord-1',
    providerId: 'student-2',
    providerName: 'Adebayo Samuel',
    customerId: 'client-1',
    customerName: 'Johnson Peter',
    customerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    customerDepartment: 'Apex Brand Studio',
    rating: 5,
    title: 'Creative and fast logo design',
    comment: 'Adebayo understood our creative vision immediately and delivered high-res vector assets in 48 hours. The 3D mockup is impressive.',
    tags: ['Creative Vision', 'Punctual', 'High Quality'],
    isVerifiedTransaction: true,
    createdAt: '2024-05-10T13:00:00Z'
  }
];

// Initial Seed Conversations & Messages
export const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['client-1', 'student-1'],
    participantDetails: {
      'client-1': {
        name: 'Johnson Peter',
        role: 'client',
        departmentOrCompany: 'Apex Brand Studio',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
      },
      'student-1': {
        name: 'Onifade Sulaiman',
        role: 'student',
        departmentOrCompany: 'Computer Science (400L)',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      }
    },
    lastMessage: 'Great work Sulaiman! The landing page is working perfectly on all devices.',
    lastMessageTimestamp: '2024-05-10T18:30:00Z',
    unreadCounts: { 'student-1': 0, 'client-1': 0 },
    relatedJobId: 'job-4'
  },
  {
    id: 'conv-2',
    participants: ['client-1', 'student-3'],
    participantDetails: {
      'client-1': {
        name: 'Johnson Peter',
        role: 'client',
        departmentOrCompany: 'Apex Brand Studio',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
      },
      'student-3': {
        name: 'Maryam Adeola',
        role: 'student',
        departmentOrCompany: 'Mass Communication (300L)',
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80'
      }
    },
    lastMessage: 'Thank you Mr. Johnson! I have scheduled the first 4 social media posts for this week.',
    lastMessageTimestamp: '2024-05-15T11:45:00Z',
    unreadCounts: { 'client-1': 1, 'student-3': 0 },
    relatedJobId: 'job-3'
  }
];

export const initialMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1',
      conversationId: 'conv-1',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      text: 'Hello Sulaiman! I reviewed your proposal for the event landing page. Can we connect on the specific ticket form requirements?',
      timestamp: '2024-05-02T11:00:00Z',
      read: true
    },
    {
      id: 'm-2',
      conversationId: 'conv-1',
      senderId: 'student-1',
      senderName: 'Onifade Sulaiman',
      text: 'Hi Mr. Johnson! Yes absolutely. I can integrate automated email confirmations and a clean mobile-friendly form. Let me spin up a staging preview for you.',
      timestamp: '2024-05-02T11:05:00Z',
      read: true
    },
    {
      id: 'm-3',
      conversationId: 'conv-1',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      text: 'Great work Sulaiman! The landing page is working perfectly on all devices.',
      timestamp: '2024-05-10T18:30:00Z',
      read: true
    }
  ],
  'conv-2': [
    {
      id: 'm-4',
      conversationId: 'conv-2',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      text: 'Hello Maryam, we have accepted your proposal for the social media management gig. Welcome on board!',
      timestamp: '2024-05-12T10:15:00Z',
      read: true
    },
    {
      id: 'm-5',
      conversationId: 'conv-2',
      senderId: 'student-3',
      senderName: 'Maryam Adeola',
      text: 'Thank you Mr. Johnson! I have scheduled the first 4 social media posts for this week.',
      timestamp: '2024-05-15T11:45:00Z',
      read: true
    }
  ]
};

// Initial Seed Notifications
export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    title: 'Payment Released to Wallet',
    message: '₦22,500 has been credited to your wallet for completing "Web Developer to build landing page".',
    type: 'payment' as any,
    link: '/student/earnings',
    read: false,
    createdAt: '2024-05-10T19:05:00Z'
  },
  {
    id: 'notif-2',
    userId: 'student-1',
    title: '5-Star Review Received!',
    message: 'Johnson Peter left a 5-star review: "Sulaiman is exceptional! He built our landing page ahead of schedule..."',
    type: 'review',
    link: '/student/reviews',
    read: true,
    createdAt: '2024-05-10T19:00:00Z'
  },
  {
    id: 'notif-3',
    userId: 'student-1',
    title: 'New Job Matching Your Skills',
    message: 'A client just posted "Need a UI/UX Designer to design modern mobile app screens" in Ago-Iwoye.',
    type: 'proposal',
    link: '/student/jobs',
    read: true,
    createdAt: '2024-05-15T09:35:00Z'
  },
  {
    id: 'notif-4',
    userId: 'client-1',
    title: 'New Proposal Received',
    message: 'Adebayo Samuel submitted a proposal for "Need a UI/UX Designer".',
    type: 'proposal',
    link: '/client/proposals',
    read: false,
    createdAt: '2024-05-15T10:30:00Z'
  }
];

// Initial Seed Transactions
export const initialTransactions: WalletTransaction[] = [
  {
    id: 'tx-1001',
    jobId: 'job-4',
    jobTitle: 'Web Developer to build landing page for student event',
    payerId: 'client-1',
    payerName: 'Johnson Peter',
    recipientId: 'student-1',
    recipientName: 'Onifade Sulaiman',
    amount: 25000,
    platformFee: 2500,
    netAmount: 22500,
    status: 'released',
    type: 'payment',
    createdAt: '2024-05-10T19:00:00Z',
    reference: 'OOU-PAY-778921-SC'
  },
  {
    id: 'tx-1002',
    jobId: 'job-3',
    jobTitle: 'Social Media Manager for local food brand in Ago-Iwoye',
    payerId: 'client-1',
    payerName: 'Johnson Peter',
    recipientId: 'student-3',
    recipientName: 'Maryam Adeola',
    amount: 20000,
    platformFee: 2000,
    netAmount: 18000,
    status: 'held_in_escrow',
    type: 'escrow_hold',
    createdAt: '2024-05-12T10:00:00Z',
    reference: 'OOU-PAY-993102-SC'
  }
];

// Initial Verification Requests for Admin
export const initialVerificationRequests: VerificationRequest[] = [
  {
    id: 'vr-1',
    studentId: 'student-4',
    studentName: 'Praise Daniel',
    studentEmail: 'praise.daniel@gmail.com',
    matricNumber: 'BCH/2022/0088',
    faculty: 'Faculty of Basic Medical Sciences',
    department: 'Biochemistry',
    level: '300L',
    idCardImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    createdAt: '2024-05-14T08:00:00Z'
  },
  {
    id: 'vr-2',
    studentId: 'student-1',
    studentName: 'Onifade Sulaiman',
    studentEmail: 'sulaiman@ooustudentcircle.com',
    matricNumber: 'CSC/2021/0482',
    faculty: 'Faculty of Science',
    department: 'Computer Science',
    level: '400L',
    idCardImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    status: 'verified',
    adminNotes: 'Verified against OOU student portal database.',
    createdAt: '2024-01-16T10:00:00Z',
    resolvedAt: '2024-01-16T12:30:00Z'
  }
];

// Initial Reports
export const initialReports: PlatformReport[] = [
  {
    id: 'rep-1',
    reporterId: 'client-1',
    reporterName: 'Johnson Peter',
    targetType: 'service',
    targetId: 'srv-flagged-09',
    targetTitle: 'Duplicate Unverified Service Posting',
    reason: 'Spam or Duplicate',
    description: 'User created multiple identical services in quick succession without complete contact information.',
    status: 'resolved',
    resolutionNotes: 'Duplicate listing removed and warning sent.',
    createdAt: '2024-04-20T14:00:00Z'
  }
];

// Initial Admin Audit Logs
export const initialAdminLogs: AdminLog[] = [
  {
    id: 'log-1',
    adminId: 'admin-1',
    adminEmail: 'clarityofficial85@gmail.com',
    action: 'VERIFY_STUDENT',
    targetType: 'user',
    targetId: 'student-1',
    details: 'Approved student ID verification for Onifade Sulaiman (CSC/2021/0482)',
    timestamp: '2024-01-16T12:30:00Z'
  },
  {
    id: 'log-2',
    adminId: 'admin-1',
    adminEmail: 'clarityofficial85@gmail.com',
    action: 'SERVICE_APPROVED',
    targetType: 'service',
    targetId: 'srv-2',
    details: 'Approved service "I will create a responsive, modern business website"',
    timestamp: '2024-02-15T11:30:00Z'
  }
];

// Initial Platform Settings
export const initialPlatformSettings: PlatformSettings = {
  platformName: 'OOU StudentCircle',
  platformFeePercent: 10,
  maintenanceMode: false,
  supportEmail: 'hello@ooustudentcircle.com',
  supportPhone: '+234 812 345 6789',
  primaryCampus: 'Olabisi Onabanjo University, Ago-Iwoye, Ogun State',
  allowedFaculties: [
    'Faculty of Science',
    'Faculty of Social and Management Sciences',
    'Faculty of Arts',
    'Faculty of Law',
    'Faculty of Basic Medical Sciences',
    'Faculty of Clinical Sciences',
    'Faculty of Pharmacy',
    'Faculty of Engineering & Environmental Studies',
    'Faculty of Agricultural Sciences',
    'Faculty of Education'
  ]
};

// Data Store Helper Functions with Local Storage Sync
export class DataStore {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // Users
  static getUsers(): UserProfile[] {
    const users = this.getItem<UserProfile[]>('users', initialUsers);
    return users.map(u => {
      if (u.id === 'student-1' && (!u.profilePhoto || u.profilePhoto.includes('unsplash'))) {
        return { ...u, profilePhoto: founderImage };
      }
      return u;
    });
  }

  static getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static saveUser(user: UserProfile): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    this.setItem('users', users);
  }

  static updateUserStatus(userId: string, status: 'active' | 'suspended'): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.status = status;
      this.setItem('users', users);
    }
  }

  // Services
  static getServices(): ServiceItem[] {
    const rawServices = this.getItem<ServiceItem[]>('services', initialServices);
    return rawServices.map(s => {
      const startingPrice = s.price ?? s.startingPrice ?? s.pricing?.startingAt ?? 5000;
      const tags = s.tags && s.tags.length > 0 ? s.tags : (s.skills && s.skills.length > 0 ? s.skills : ['Freelance', 'Student Talent']);
      const skills = s.skills && s.skills.length > 0 ? s.skills : tags;
      const coverPhoto = s.coverPhoto || s.coverImage || s.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80';
      const coverImage = coverPhoto;
      const deliveryDays = s.deliveryDays || (s.deliveryTime ? parseInt(s.deliveryTime, 10) || 2 : 2);
      const deliveryTime = s.deliveryTime || `${deliveryDays} Days`;
      const campus = s.campus || s.location || 'Main Campus (Ago-Iwoye)';
      const serviceArea = s.serviceArea || 'Campus Wide & Online';
      const pricingType: PricingType = s.pricingType || 'Starting From';
      const viewsCount = s.viewsCount ?? 45;
      
      const pricing = s.pricing || {
        startingAt: startingPrice,
        currency: 'NGN',
        tiers: {
          basic: {
            name: 'Basic Package',
            description: 'Essential deliverable with source files and standard revisions.',
            price: startingPrice,
            deliveryDays,
            features: ['Essential deliverable']
          },
          standard: {
            name: 'Standard Package',
            description: 'Full comprehensive deliverable with priority support and all assets.',
            price: Math.round(startingPrice * 1.5),
            deliveryDays: deliveryDays + 1,
            features: ['Full project deliverable', 'Source files', 'Priority revisions']
          },
          premium: {
            name: 'Pro VIP Package',
            description: 'VIP expedited turnaround with unlimited revisions and consultation.',
            price: Math.round(startingPrice * 2.5),
            deliveryDays: deliveryDays + 2,
            features: ['VIP expedited turnaround', 'Unlimited revisions', '1-on-1 consultation']
          }
        }
      };

      return {
        ...s,
        price: startingPrice,
        startingPrice,
        pricingType,
        tags,
        skills,
        coverPhoto,
        coverImage,
        deliveryDays,
        deliveryTime,
        campus,
        serviceArea,
        viewsCount,
        pricing
      };
    });
  }

  static getServiceById(id: string): ServiceItem | undefined {
    return this.getServices().find(s => s.id === id);
  }

  static getServicesByStudentId(studentId: string): ServiceItem[] {
    return this.getServices().filter(s => s.studentId === studentId);
  }

  static getServicesByStudent(studentId: string): ServiceItem[] {
    return this.getServicesByStudentId(studentId);
  }

  static saveService(service: ServiceItem): void {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index >= 0) {
      services[index] = { ...service, updatedAt: new Date().toISOString() };
    } else {
      services.unshift(service);
    }
    this.setItem('services', services);
  }

  static deleteService(serviceId: string): void {
    const services = this.getServices().filter(s => s.id !== serviceId);
    this.setItem('services', services);
  }

  static updateServiceStatus(serviceId: string, status: ServiceItem['status']): void {
    const services = this.getServices();
    const target = services.find(s => s.id === serviceId);
    if (target) {
      target.status = status;
      this.setItem('services', services);
    }
  }

  // Jobs
  static getJobs(): JobPost[] {
    return this.getItem<JobPost[]>('jobs', initialJobs);
  }

  static getJobById(id: string): JobPost | undefined {
    return this.getJobs().find(j => j.id === id);
  }

  static getJobsByClientId(clientId: string): JobPost[] {
    return this.getJobs().filter(j => j.clientId === clientId);
  }

  static getJobsByClient(clientId: string): JobPost[] {
    return this.getJobsByClientId(clientId);
  }

  static deleteJob(jobId: string): void {
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    this.setItem('jobs', jobs);
  }

  static saveJob(job: JobPost): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = { ...job, updatedAt: new Date().toISOString() };
    } else {
      jobs.unshift(job);
    }
    this.setItem('jobs', jobs);
  }

  static updateJobStatus(jobId: string, status: JobPost['status'], hiredStudentId?: string, hiredProposalId?: string): void {
    const jobs = this.getJobs();
    const target = jobs.find(j => j.id === jobId);
    if (target) {
      target.status = status;
      if (hiredStudentId) target.hiredStudentId = hiredStudentId;
      if (hiredProposalId) target.hiredProposalId = hiredProposalId;
      target.updatedAt = new Date().toISOString();
      this.setItem('jobs', jobs);
    }
  }

  // Proposals
  static getProposals(): JobProposal[] {
    return this.getItem<JobProposal[]>('proposals', initialProposals);
  }

  static getProposalsByJobId(jobId: string): JobProposal[] {
    return this.getProposals().filter(p => p.jobId === jobId);
  }

  static getProposalsByStudentId(studentId: string): JobProposal[] {
    return this.getProposals().filter(p => p.studentId === studentId);
  }

  static getProposalsByStudent(studentId: string): JobProposal[] {
    return this.getProposalsByStudentId(studentId);
  }

  static saveProposal(proposal: JobProposal): void {
    const proposals = this.getProposals();
    const index = proposals.findIndex(p => p.id === proposal.id);
    if (index >= 0) {
      proposals[index] = proposal;
    } else {
      proposals.unshift(proposal);
      // Increment proposal count on job
      const jobs = this.getJobs();
      const targetJob = jobs.find(j => j.id === proposal.jobId);
      if (targetJob) {
        targetJob.proposalsCount = (targetJob.proposalsCount || 0) + 1;
        if (targetJob.status === 'open') {
          targetJob.status = 'proposals_received';
        }
        this.setItem('jobs', jobs);
      }
    }
    this.setItem('proposals', proposals);
  }

  static updateProposalStatus(proposalId: string, status: JobProposal['status']): void {
    const proposals = this.getProposals();
    const target = proposals.find(p => p.id === proposalId);
    if (target) {
      target.status = status;
      this.setItem('proposals', proposals);
    }
  }

  // Conversations & Messages
  static getConversations(): Conversation[] {
    return this.getItem<Conversation[]>('conversations', initialConversations);
  }

  static getConversationsForUser(userId: string): Conversation[] {
    return this.getConversations().filter(c => c.participants.includes(userId));
  }

  static getMessages(conversationId: string): ChatMessage[] {
    const allMessages = this.getItem<Record<string, ChatMessage[]>>('messages', initialMessages);
    return allMessages[conversationId] || [];
  }

  static sendMessage(conversationId: string, message: ChatMessage): void {
    const allMessages = this.getItem<Record<string, ChatMessage[]>>('messages', initialMessages);
    if (!allMessages[conversationId]) {
      allMessages[conversationId] = [];
    }
    allMessages[conversationId].push(message);
    this.setItem('messages', allMessages);

    // Update conversation last message
    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = message.text;
      conv.lastMessageTimestamp = message.timestamp;
      this.setItem('conversations', conversations);
    }
  }

  static getOrCreateConversation(userAId: string, userBId: string, jobId?: string): Conversation {
    const conversations = this.getConversations();
    let conv = conversations.find(c => 
      c.participants.includes(userAId) && c.participants.includes(userBId)
    );

    if (!conv) {
      const userA = this.getUserById(userAId);
      const userB = this.getUserById(userBId);
      
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participants: [userAId, userBId],
        participantDetails: {
          [userAId]: {
            name: userA?.fullName || 'User',
            role: userA?.role || 'student',
            departmentOrCompany: userA?.department || userA?.businessName || '',
            photo: userA?.profilePhoto
          },
          [userBId]: {
            name: userB?.fullName || 'User',
            role: userB?.role || 'client',
            departmentOrCompany: userB?.department || userB?.businessName || '',
            photo: userB?.profilePhoto
          }
        },
        lastMessage: 'Conversation started',
        lastMessageTimestamp: new Date().toISOString(),
        unreadCounts: { [userAId]: 0, [userBId]: 0 },
        relatedJobId: jobId
      };
      conversations.unshift(newConv);
      this.setItem('conversations', conversations);
      return newConv;
    }
    return conv;
  }

  // Reviews
  static getReviews(): ReviewItem[] {
    return this.getItem<ReviewItem[]>('reviews', initialReviews);
  }

  static getReviewsForRecipient(recipientId: string): ReviewItem[] {
    return this.getReviews().filter(r => r.recipientId === recipientId);
  }

  static getReviewsForUser(userId: string): ReviewItem[] {
    return this.getReviewsForRecipient(userId);
  }

  static verifyUser(userId: string, isVerified: boolean): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.isVerified = isVerified;
      target.verificationStatus = isVerified ? 'verified' : 'unverified';
      this.setItem('users', users);
    }
  }

  static saveReview(review: ReviewItem): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.setItem('reviews', reviews);

    // Recalculate recipient rating
    const userReviews = reviews.filter(r => r.recipientId === review.recipientId);
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    const recipient = this.getUserById(review.recipientId);
    if (recipient) {
      recipient.rating = Number(avgRating.toFixed(1));
      recipient.reviewsCount = userReviews.length;
      this.saveUser(recipient);
    }
  }

  // Notifications
  static getNotificationsForUser(userId: string): AppNotification[] {
    const notifs = this.getItem<AppNotification[]>('notifications', initialNotifications);
    return notifs.filter(n => n.userId === userId);
  }

  static addNotification(notification: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
    id?: string;
    read?: boolean;
    createdAt?: string;
  }): void {
    const notifs = this.getItem<AppNotification[]>('notifications', initialNotifications);
    const fullNotification: AppNotification = {
      id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      read: notification.read ?? false,
      createdAt: notification.createdAt || new Date().toISOString()
    };
    notifs.unshift(fullNotification);
    this.setItem('notifications', notifs);
  }

  static markAllNotificationsAsRead(userId: string): void {
    const notifs = this.getItem<AppNotification[]>('notifications', initialNotifications);
    notifs.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.setItem('notifications', notifs);
  }

  // Transactions
  static getTransactions(): WalletTransaction[] {
    return this.getItem<WalletTransaction[]>('transactions', initialTransactions);
  }

  static getTransactionsForUser(userId: string): WalletTransaction[] {
    return this.getTransactions().filter(t => t.payerId === userId || t.recipientId === userId);
  }

  static recordTransaction(tx: WalletTransaction): void {
    const txs = this.getTransactions();
    const index = txs.findIndex(t => t.id === tx.id);
    if (index >= 0) {
      txs[index] = tx;
    } else {
      txs.unshift(tx);
    }
    this.setItem('transactions', txs);
  }

  static saveTransaction(tx: WalletTransaction): void {
    this.recordTransaction(tx);
  }

  // Verification Requests
  static getVerificationRequests(): VerificationRequest[] {
    return this.getItem<VerificationRequest[]>('verificationRequests', initialVerificationRequests);
  }

  static saveVerificationRequest(req: VerificationRequest): void {
    const reqs = this.getVerificationRequests();
    const index = reqs.findIndex(r => r.id === req.id);
    if (index >= 0) {
      reqs[index] = req;
    } else {
      reqs.unshift(req);
    }
    this.setItem('verificationRequests', reqs);
  }

  static updateVerificationStatus(requestId: string, status: VerificationRequest['status'], adminNotes?: string): void {
    const reqs = this.getVerificationRequests();
    const target = reqs.find(r => r.id === requestId);
    if (target) {
      target.status = status;
      if (adminNotes) target.adminNotes = adminNotes;
      target.resolvedAt = new Date().toISOString();
      this.setItem('verificationRequests', reqs);

      // Update student profile verification
      const student = this.getUserById(target.studentId);
      if (student) {
        student.isVerified = status === 'verified';
        student.verificationStatus = status;
        student.verificationNotes = adminNotes;
        this.saveUser(student);
      }
    }
  }

  // Reports
  static getReports(): PlatformReport[] {
    return this.getItem<PlatformReport[]>('reports', initialReports);
  }

  static saveReport(report: PlatformReport): void {
    const reports = this.getReports();
    reports.unshift(report);
    this.setItem('reports', reports);
  }

  static updateReportStatus(reportId: string, status: PlatformReport['status'], notes?: string): void {
    const reports = this.getReports();
    const target = reports.find(r => r.id === reportId);
    if (target) {
      target.status = status;
      if (notes) target.resolutionNotes = notes;
      this.setItem('reports', reports);
    }
  }

  // Admin Logs
  static getAdminLogs(): AdminLog[] {
    return this.getItem<AdminLog[]>('adminLogs', initialAdminLogs);
  }

  static logAdminAction(action: string, targetType: string, targetId: string, details: string, adminId = 'admin-1', adminEmail = 'admin@ooustudentcircle.com'): void {
    const logs = this.getAdminLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      adminId,
      adminEmail,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString()
    });
    this.setItem('adminLogs', logs);
  }

  // Service Requests (Module 3)
  static getServiceRequests(): ServiceRequest[] {
    return this.getItem<ServiceRequest[]>('serviceRequests', initialServiceRequests);
  }

  static getServiceRequestById(id: string): ServiceRequest | undefined {
    return this.getServiceRequests().find(r => r.id === id);
  }

  static getServiceRequestsByCustomer(customerId: string): ServiceRequest[] {
    return this.getServiceRequests().filter(r => r.customerId === customerId);
  }

  static getServiceRequestsByProvider(providerId: string): ServiceRequest[] {
    return this.getServiceRequests().filter(r => r.providerId === providerId);
  }

  static saveServiceRequest(request: ServiceRequest): void {
    const requests = this.getServiceRequests();
    const index = requests.findIndex(r => r.id === request.id);
    if (index >= 0) {
      requests[index] = { ...request, updatedAt: new Date().toISOString() };
    } else {
      requests.unshift(request);
    }
    this.setItem('serviceRequests', requests);

    // Send notification to provider if it's a new request
    if (index < 0) {
      this.addNotification({
        userId: request.providerId,
        title: 'New Service Request Received! 🎯',
        message: `${request.customerName} sent a request for "${request.serviceTitle}": ${request.title}`,
        type: 'job_match',
        link: '/student/services?tab=requests'
      });
    }
  }

  static updateServiceRequestStatus(id: string, status: ServiceRequest['status'], extra?: { quoteId?: string; orderId?: string }): void {
    const requests = this.getServiceRequests();
    const target = requests.find(r => r.id === id);
    if (target) {
      target.status = status;
      if (extra?.quoteId) target.quoteId = extra.quoteId;
      if (extra?.orderId) target.orderId = extra.orderId;
      target.updatedAt = new Date().toISOString();
      this.setItem('serviceRequests', requests);
    }
  }

  // Service Quotes (Module 3)
  static getServiceQuotes(): ServiceQuote[] {
    return this.getItem<ServiceQuote[]>('serviceQuotes', initialServiceQuotes);
  }

  static getServiceQuoteById(id: string): ServiceQuote | undefined {
    return this.getServiceQuotes().find(q => q.id === id);
  }

  static getServiceQuotesByRequest(requestId: string): ServiceQuote[] {
    return this.getServiceQuotes().filter(q => q.requestId === requestId);
  }

  static getServiceQuotesByProvider(providerId: string): ServiceQuote[] {
    return this.getServiceQuotes().filter(q => q.providerId === providerId);
  }

  static getServiceQuotesByCustomer(customerId: string): ServiceQuote[] {
    return this.getServiceQuotes().filter(q => q.customerId === customerId);
  }

  static saveServiceQuote(quote: ServiceQuote): void {
    const quotes = this.getServiceQuotes();
    const index = quotes.findIndex(q => q.id === quote.id);
    if (index >= 0) {
      quotes[index] = { ...quote, updatedAt: new Date().toISOString() };
    } else {
      quotes.unshift(quote);
    }
    this.setItem('serviceQuotes', quotes);

    // Update associated request status to 'quoted'
    this.updateServiceRequestStatus(quote.requestId, 'quoted', { quoteId: quote.id });

    // Notify customer
    this.addNotification({
      userId: quote.customerId,
      title: 'New Service Quote Received! 💼',
      message: `${quote.providerName} sent you a quote of ₦${quote.price.toLocaleString()} for "${quote.serviceTitle}"`,
      type: 'proposal_received',
      link: '/student/services?tab=quotes'
    });
  }

  static updateServiceQuoteStatus(id: string, status: ServiceQuote['status']): void {
    const quotes = this.getServiceQuotes();
    const target = quotes.find(q => q.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      this.setItem('serviceQuotes', quotes);

      // If declined, update request
      if (status === 'declined') {
        this.updateServiceRequestStatus(target.requestId, 'declined');
        this.addNotification({
          userId: target.providerId,
          title: 'Service Quote Declined',
          message: `${target.customerName} declined the quote for "${target.serviceTitle}"`,
          type: 'proposal_rejected',
          link: '/student/services?tab=quotes'
        });
      }
    }
  }

  // Service Orders (Module 3)
  static getServiceOrders(): ServiceOrder[] {
    return this.getItem<ServiceOrder[]>('serviceOrders', initialServiceOrders);
  }

  static getServiceOrderById(id: string): ServiceOrder | undefined {
    return this.getServiceOrders().find(o => o.id === id);
  }

  static getServiceOrdersByCustomer(customerId: string): ServiceOrder[] {
    return this.getServiceOrders().filter(o => o.customerId === customerId);
  }

  static getServiceOrdersByProvider(providerId: string): ServiceOrder[] {
    return this.getServiceOrders().filter(o => o.providerId === providerId);
  }

  static saveServiceOrder(order: ServiceOrder): void {
    const orders = this.getServiceOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift(order);
    }
    this.setItem('serviceOrders', orders);

    if (index < 0) {
      // Notify both parties
      this.addNotification({
        userId: order.providerId,
        title: 'New Service Order Started! 🎉',
        message: `Order for "${order.serviceTitle}" (₦${order.amount.toLocaleString()}) has commenced.`,
        type: 'job_hired',
        link: '/student/services?tab=orders'
      });

      this.addNotification({
        userId: order.customerId,
        title: 'Order Confirmed! 🚀',
        message: `Your order with ${order.providerName} for "${order.serviceTitle}" is now active.`,
        type: 'job_hired',
        link: '/student/services?tab=orders'
      });
    }
  }

  static updateServiceOrderStatus(id: string, status: ServiceOrder['status'], notes?: string, deliveryFiles?: string[]): void {
    const orders = this.getServiceOrders();
    const target = orders.find(o => o.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      if (notes) target.deliveryNotes = notes;
      if (deliveryFiles) target.deliveryFiles = deliveryFiles;

      if (status === 'delivered') {
        target.deliveredAt = new Date().toISOString();
        this.addNotification({
          userId: target.customerId,
          title: 'Service Order Delivered! 📦',
          message: `${target.providerName} has delivered the work for "${target.serviceTitle}". Please review and approve.`,
          type: 'escrow_release',
          link: '/student/services?tab=orders'
        });
      } else if (status === 'completed') {
        target.completedAt = new Date().toISOString();
        
        // Update service completed count
        const services = this.getServices();
        const srv = services.find(s => s.id === target.serviceId);
        if (srv) {
          srv.completedOrders = (srv.completedOrders || 0) + 1;
          srv.ordersCompleted = (srv.ordersCompleted || 0) + 1;
          this.setItem('services', services);
        }

        // Update provider earnings and completed jobs
        const provider = this.getUserById(target.providerId);
        if (provider) {
          provider.completedJobsCount = (provider.completedJobsCount || 0) + 1;
          provider.totalEarnings = (provider.totalEarnings || 0) + target.amount;
          this.saveUser(provider);
        }

        // Notify provider and customer
        this.addNotification({
          userId: target.providerId,
          title: 'Order Completed & Payment Approved! 💰',
          message: `Order for "${target.serviceTitle}" is marked completed. ₦${target.amount.toLocaleString()} added to your records.`,
          type: 'escrow_release',
          link: '/student/services?tab=orders'
        });

        this.addNotification({
          userId: target.customerId,
          title: 'Order Completed! Leave a Review ⭐',
          message: `Your order for "${target.serviceTitle}" is complete. Leave a verified review for ${target.providerName}.`,
          type: 'review_received',
          link: '/student/services?tab=orders'
        });
      } else if (status === 'cancelled') {
        target.cancelledAt = new Date().toISOString();
      }

      this.setItem('serviceOrders', orders);
    }
  }

  // Service Reviews (Module 3 - Enforces 1 Review per Completed Order)
  static getServiceReviews(): ServiceReview[] {
    return this.getItem<ServiceReview[]>('serviceReviews', initialServiceReviews);
  }

  static getServiceReviewsByService(serviceId: string): ServiceReview[] {
    return this.getServiceReviews().filter(r => r.serviceId === serviceId);
  }

  static getServiceReviewsByProvider(providerId: string): ServiceReview[] {
    return this.getServiceReviews().filter(r => r.providerId === providerId);
  }

  static canReviewOrder(orderId: string, customerId: string): { canReview: boolean; reason?: string; order?: ServiceOrder } {
    const order = this.getServiceOrderById(orderId);
    if (!order) {
      return { canReview: false, reason: 'Order not found' };
    }
    if (order.customerId !== customerId) {
      return { canReview: false, reason: 'You can only review services you ordered.' };
    }
    if (order.status !== 'completed') {
      return { canReview: false, reason: 'Reviews can only be submitted after the service order is marked completed.' };
    }
    if (order.hasReview) {
      return { canReview: false, reason: 'A review has already been submitted for this completed transaction.' };
    }
    const existing = this.getServiceReviews().find(r => r.orderId === orderId);
    if (existing) {
      return { canReview: false, reason: 'A review already exists for this order.' };
    }
    return { canReview: true, order };
  }

  static saveServiceReview(review: ServiceReview): { success: boolean; error?: string } {
    const check = this.canReviewOrder(review.orderId, review.customerId);
    if (!check.canReview) {
      return { success: false, error: check.reason };
    }

    const reviews = this.getServiceReviews();
    reviews.unshift({
      ...review,
      isVerifiedTransaction: true,
      createdAt: new Date().toISOString()
    });
    this.setItem('serviceReviews', reviews);

    // Mark order as reviewed
    const orders = this.getServiceOrders();
    const orderIndex = orders.findIndex(o => o.id === review.orderId);
    if (orderIndex >= 0) {
      orders[orderIndex].hasReview = true;
      this.setItem('serviceOrders', orders);
    }

    // Recalculate and update service rating and review count
    const serviceReviews = reviews.filter(r => r.serviceId === review.serviceId);
    const avgRating = serviceReviews.length > 0
      ? Number((serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length).toFixed(1))
      : review.rating;
    
    const services = this.getServices();
    const srvIndex = services.findIndex(s => s.id === review.serviceId);
    if (srvIndex >= 0) {
      services[srvIndex].rating = avgRating;
      services[srvIndex].reviewsCount = serviceReviews.length;
      this.setItem('services', services);
    }

    // Recalculate provider overall profile rating
    const providerReviews = reviews.filter(r => r.providerId === review.providerId);
    const providerAvg = providerReviews.length > 0
      ? Number((providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1))
      : review.rating;
    
    const provider = this.getUserById(review.providerId);
    if (provider) {
      provider.rating = providerAvg;
      provider.reviewsCount = providerReviews.length;
      this.saveUser(provider);
    }

    // Notify provider
    this.addNotification({
      userId: review.providerId,
      title: 'New Verified 5-Star Review! ⭐',
      message: `${review.customerName} left a ${review.rating}-star review on "${review.serviceTitle}"`,
      type: 'review_received',
      link: '/student/services?tab=reviews'
    });

    return { success: true };
  }

  // Service View Counter
  static incrementServiceViews(serviceId: string): void {
    const services = this.getServices();
    const target = services.find(s => s.id === serviceId);
    if (target) {
      target.viewsCount = (target.viewsCount || 0) + 1;
      this.setItem('services', services);
    }
  }

  // Provider Dynamic Real-Time Statistics (Module 3)
  static getProviderStats(providerId: string) {
    const myServices = this.getServicesByStudentId(providerId);
    const myRequests = this.getServiceRequestsByProvider(providerId);
    const myQuotes = this.getServiceQuotesByProvider(providerId);
    const myOrders = this.getServiceOrdersByProvider(providerId);
    const myReviews = this.getServiceReviewsByProvider(providerId);

    const totalViews = myServices.reduce((sum, s) => sum + (s.viewsCount || 0), 0);
    const totalRequests = myRequests.length;
    const totalQuotes = myQuotes.length;
    const activeOrders = myOrders.filter(o => o.status === 'in_progress' || o.status === 'delivered').length;
    const completedOrders = myOrders.filter(o => o.status === 'completed');
    const completedServices = completedOrders.length;
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const avgRating = myReviews.length > 0
      ? Number((myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1))
      : (myServices.length > 0 ? (myServices[0].rating || 5.0) : 5.0);

    return {
      totalViews,
      totalRequests,
      totalQuotes,
      activeOrders,
      completedServices,
      totalRevenue,
      averageRating: avgRating,
      totalReviews: myReviews.length,
      publishedServicesCount: myServices.filter(s => s.status === 'published').length
    };
  }

  // Platform Settings
  static getPlatformSettings(): PlatformSettings {
    return this.getItem<PlatformSettings>('platformSettings', initialPlatformSettings);
  }

  static savePlatformSettings(settings: PlatformSettings): void {
    this.setItem('platformSettings', settings);
  }
}
