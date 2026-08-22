// Official Founder & Innovation Story Configuration for OOU StudentCircle
import founderImage from '../assets/images/founder_sulaiman.jpg';

export interface FounderChapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle?: string;
  content: string[];
  highlight?: string;
}

export interface FounderTimelineStage {
  stage: number;
  title: string;
  subtitle: string;
  description: string;
}

export interface FounderInfo {
  name: string;
  alias: string;
  fullNameWithAlias: string;
  role: string;
  institution: string;
  department: string;
  level: string;
  photoUrl: string;
  whatsapp: string;
  whatsappFormatted: string;
  whatsappUrl: string;
  email: string;
  emailUrl: string;
  quote: string;
  mission: string;
  vision: string;
  conclusionQuote: string;
  chapters: FounderChapter[];
  timeline: FounderTimelineStage[];
  fourPillarsRelation: {
    title: string;
    description: string;
    route: string;
    badge: string;
  }[];
}

export const founderConfig: FounderInfo = {
  name: "Onifade Sulaiman",
  alias: "Mr. Clarity",
  fullNameWithAlias: "Onifade Sulaiman (also known as Mr. Clarity)",
  role: "Founder, OOU StudentCircle",
  institution: "Olabisi Onabanjo University (OOU)",
  department: "Computer Science",
  level: "400 Level",
  photoUrl: founderImage,
  whatsapp: "08051780169",
  whatsappFormatted: "+234 805 178 0169",
  whatsappUrl: "https://wa.me/2348051780169?text=Hello%20Onifade%20Sulaiman%2C%20I%20am%20reaching%20out%20regarding%20OOU%20StudentCircle.",
  email: "clarityofficial85@gmail.com",
  emailUrl: "mailto:clarityofficial85@gmail.com?subject=Inquiry%20-%20OOU%20StudentCircle",
  
  quote: "I don't want StudentCircle to be just another platform students sign up for. I want it to become a place where a student's skill, idea, business or connection can lead to a real opportunity.",
  
  mission: "To make student talent easier to discover, student businesses easier to access, campus services easier to find and opportunities easier to reach.",
  
  vision: "To build a connected digital ecosystem where students can discover one another, create opportunities, access services, build businesses and connect their skills to the people who need them.",

  conclusionQuote: "So StudentCircle is not simply an app I wanted to build. It is an idea that grew from a simple observation: There are talented students everywhere. There are businesses operating around them. There are people looking for services. There are opportunities waiting to be discovered. The missing piece is connection.",

  chapters: [
    {
      id: "where-it-started",
      chapterNumber: "CHAPTER 1",
      title: "Where It Started",
      subtitle: "Seeing the Everyday Reality of Students",
      content: [
        "The idea for StudentCircle did not begin as a grand technology company or a corporate pitch deck. It started from observing the everyday reality of campus life as a student at Olabisi Onabanjo University.",
        "Every single day around me, I saw incredible talent. Students were designing logos and flyers, editing videos, building software, writing academic projects, running boutique businesses, selling quality products from their hostels, and operating vital campus printing and document services.",
        "Students with skills urgently needed customers. At the same time, other students, staff, and local clients were constantly looking for reliable hands to get things done.",
        "Yet almost all of this activity was scattered — buried across crowded WhatsApp status updates, private group chats, word of mouth, physical posters, and informal conversations. If you didn't happen to know the right person on your contact list, that talent remained completely invisible.",
        "This led to a simple, persistent question: What if there was one central place where students could discover these opportunities, services, and connections?"
      ],
      highlight: "What if there was one place where students could discover these opportunities and services?"
    },
    {
      id: "the-problem",
      chapterNumber: "CHAPTER 2",
      title: "The Problem I Kept Seeing",
      subtitle: "The Disconnect Between Talent and Opportunity",
      content: [
        "The disconnect happened every day in plain sight.",
        "A student or department would need an urgent graphic designer or web developer, while another skilled student was sitting just three hostels away with nothing to work on.",
        "A student travelling to campus would need their project typed, printed, and spiral-bound before arrival, but had no way to send files ahead to a trusted Motion Ground shop.",
        "A student vendor had great products in stock, but could only reach the small handful of contacts who viewed their 24-hour WhatsApp statuses.",
        "A student with genuine digital or artisanal skills struggled to find paying clients, while outside clients were hesitant to hire students because there was no structure, verification, or accountability.",
        "I realized that the fundamental problem was never a shortage of student talent. The problem was discovery and trust."
      ],
      highlight: "Student talent exists. The connection between talent and opportunity is what is missing."
    },
    {
      id: "the-idea",
      chapterNumber: "CHAPTER 3",
      title: "The Idea Began to Take Shape",
      subtitle: "One Connected Campus Ecosystem",
      content: [
        "As these observations accumulated, the concept of StudentCircle crystallized: one platform addressing multiple student needs, unlocking multiple opportunities within a single, connected ecosystem.",
        "Instead of treating campus freelancing, student commerce, peer networking, and physical campus services as isolated problems, we brought them together into four cohesive pillars:",
        "1. Student Connect: Allowing students across all faculties and campuses to discover one another by skills, department, and academic interests.",
        "2. Student Services: Giving student professionals a structured portfolio to receive legitimate client requests with milestone escrow protection.",
        "3. Marketplace: Enabling student vendors to list physical products with verified campus delivery and pickup.",
        "4. Campus Hub (Motion Ground): Giving campus print shops, photocopiers, and document centers a digital storefront to receive remote pre-orders and reduce physical queues."
      ]
    },
    {
      id: "why-oou",
      chapterNumber: "CHAPTER 4",
      title: "Why OOU?",
      subtitle: "Grounding Innovation in a Real Multi-Campus Community",
      content: [
        "Starting with Olabisi Onabanjo University was an intentional decision. OOU is a multi-campus institution with vibrant student communities spread across Ago-Iwoye, Mini Campus, Ayetoro, Ibogun, and Sagamu.",
        "Across these different locations, students possess distinct skills, run diverse micro-enterprises, and face unique logistical challenges. Local campus businesses provide essential everyday services, and incoming aspirants constantly need reliable orientation and verified service providers.",
        "StudentCircle begins at OOU because this is the environment I know intimately. I understand the daily struggles, the communication gaps, and the real friction students face when trying to earn, collaborate, and access services.",
        "We are building directly from lived campus experience to ensure every feature solves an actual, everyday problem."
      ]
    },
    {
      id: "the-challenges",
      chapterNumber: "CHAPTER 5",
      title: "The Challenges",
      subtitle: "Building While Learning and Growing",
      content: [
        "Building StudentCircle has been one of the most demanding and humbling journeys of my life. I had to learn that having an idea is only five percent of the equation — ninety-five percent is execution, resilience, and listening.",
        "I was building while still learning advanced computer science concepts, writing code late into the night, and figuring out how to architect a platform that serves four completely different user categories: student freelancers, student buyers, campus vendors, and physical shop owners.",
        "Resources were limited. Balancing demanding academic coursework, leadership responsibilities, and platform development required immense discipline and sacrifices. There were technical roadblocks, features that had to be redesigned from scratch, and moments of doubt.",
        "I did not have everything figured out from day one. But every mistake became a lesson in user empathy, data integrity, and system reliability. I learned that true entrepreneurship is not about pretending to be invincible — it is about staying committed to the problem you set out to solve."
      ]
    },
    {
      id: "why-i-kept-building",
      chapterNumber: "CHAPTER 6",
      title: "Why I Kept Building",
      subtitle: "Creating Lasting Infrastructure for Student Talent",
      content: [
        "Whenever the process felt overwhelming, the core purpose kept me going. StudentCircle was never about just launching another website — it was about building digital infrastructure for student talent and campus commerce.",
        "I kept building because a skilled student deserves a legitimate avenue to earn an honest living, build a verifiable work history, and gain professional dignity before graduation.",
        "I kept building because a campus print shop owner shouldn't lose customers simply because students don't want to stand in a two-hour physical queue during exam rush.",
        "I kept building because an incoming aspirant should be able to connect with senior peers, find trusted services, and feel welcomed into the university ecosystem.",
        "When you realize that your work can directly impact someone's livelihood and academic journey, giving up ceases to be an option."
      ]
    },
    {
      id: "what-studentcircle-means",
      chapterNumber: "CHAPTER 7",
      title: "What StudentCircle Means",
      subtitle: "The Philosophy Behind the Name",
      content: [
        "The name 'StudentCircle' reflects the core philosophy of our platform.",
        "'Student' places the student and the campus community squarely at the centre of every decision, policy, and feature we build.",
        "'Circle' represents connection, completeness, and mutual growth. In a circle, no one is left isolated at a dead end.",
        "Students connect with fellow students, skilled professionals connect with paying clients, vendors connect with buyers, campus shops connect with remote customers, and ideas connect with real opportunities. StudentCircle is that complete, supportive, and self-reinforcing circle."
      ]
    },
    {
      id: "the-bigger-vision",
      chapterNumber: "CHAPTER 8",
      title: "The Bigger Vision",
      subtitle: "A Scalable Blueprint for Nigerian Tertiary Institutions",
      content: [
        "OOU is our foundational home and proving ground, but our long-term vision looks toward the future of student empowerment across Nigeria.",
        "Tertiary institutions across the country are filled with brilliant, industrious young people whose skills remain largely undiscovered beyond their immediate social circles.",
        "Our ambition is to refine, validate, and perfect this model at OOU — proving that a campus-focused digital ecosystem can foster genuine economic self-reliance, reduce graduate unemployment, and build verifiable trust.",
        "We are taking this journey step by step, with patience, integrity, and an unwavering commitment to the student community."
      ]
    }
  ],

  timeline: [
    {
      stage: 1,
      title: "Observation",
      subtitle: "Seeing the Gap",
      description: "Noticing that student talent, commerce, and services at OOU were fragmented across isolated WhatsApp statuses and word of mouth."
    },
    {
      stage: 2,
      title: "Idea",
      subtitle: "Connecting the Pieces",
      description: "Conceptualizing a unified digital ecosystem bringing together Student Connect, Freelance Services, Marketplace, and Motion Ground shops."
    },
    {
      stage: 3,
      title: "Research",
      subtitle: "Understanding the Ecosystem",
      description: "Engaging directly with campus freelancers, shop owners, vendors, and students to map real user workflows, payment trust issues, and verification needs."
    },
    {
      stage: 4,
      title: "Building",
      subtitle: "Turning Idea into Product",
      description: "Developing the full-stack architecture, secure escrow mechanisms, real-time messaging, and multi-campus location support."
    },
    {
      stage: 5,
      title: "Testing & Refinement",
      subtitle: "Learning from Real Users",
      description: "Iterating on feedback from OOU students to polish mobile responsiveness, matriculation verification, and shop pre-order flows."
    },
    {
      stage: 6,
      title: "Growth & Vision",
      subtitle: "Building Beyond One Campus",
      description: "Establishing a proven, repeatable framework at OOU with a long-term vision to support tertiary institutions nationwide."
    }
  ],

  fourPillarsRelation: [
    {
      title: "Student Connect",
      description: "Discover and collaborate with peers across Ago-Iwoye, Ibogun, Ayetoro, and Sagamu based on shared skills and academic interests.",
      route: "/student-connect",
      badge: "Peer Discovery"
    },
    {
      title: "Student Services",
      description: "Hire verified student talent with transparent pricing, portfolio reviews, and escrow-protected milestone payments.",
      route: "/services",
      badge: "Freelance & Skills"
    },
    {
      title: "Campus Marketplace",
      description: "Buy and sell physical products within your campus with verified vendor profiles and local delivery or pickup.",
      route: "/marketplace",
      badge: "Student Commerce"
    },
    {
      title: "Campus Hub (Motion Ground)",
      description: "Digitally access campus print shops, photocopiers, and service centers to upload files and order remotely.",
      route: "/campus",
      badge: "Motion Ground"
    }
  ]
};
