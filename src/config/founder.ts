// Official Founder & Innovation Story Configuration for OOU StudentCircle
import founderImage from '../assets/images/founder_sulaiman.jpg';

export const FOUNDER_PROFILE_IMAGE = founderImage;

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
  
  mission: "To make student talent easier to find, student businesses easier to discover and campus services easier to access.",
  
  vision: "To build a connected digital ecosystem where students can find opportunities, offer their skills, run businesses and connect with people who need what they provide.",

  conclusionQuote: "So StudentCircle is not simply an app I wanted to build. It is an idea that grew from a simple observation: There are talented students everywhere. There are businesses operating around them. There are people looking for services. There are opportunities waiting to be discovered. The missing piece is connection.",

  chapters: [
    {
      id: "where-it-started",
      chapterNumber: "CHAPTER 1",
      title: "Where It Started",
      subtitle: "Seeing the Everyday Reality of Students",
      content: [
        "The idea for StudentCircle did not begin as a large technology company or a corporate presentation. It started from observing the everyday reality of campus life as a student at Olabisi Onabanjo University.",
        "Every day around me, I saw genuine talent. Students were designing graphics, editing videos, writing code, helping with projects, running small businesses, selling products from their hostels, and providing printing and document services.",
        "Students with skills needed customers. At the same time, other students, staff and local people were looking for reliable people to get things done.",
        "Yet much of this activity remained scattered across WhatsApp statuses, personal contacts, word of mouth, physical shops, social media and campus groups. If you did not happen to have the right person on your contact list, that talent was hard to find.",
        "This led to a simple question: What if there was one place where students could discover these opportunities, services and people?"
      ],
      highlight: "What if there was one place where students could discover these opportunities and services?"
    },
    {
      id: "the-problem",
      chapterNumber: "CHAPTER 2",
      title: "The Problem I Kept Seeing",
      subtitle: "The Disconnect Between Talent and Opportunity",
      content: [
        "The problem happened every day in plain sight.",
        "A student might need a graphic designer. Another student nearby had the skill.",
        "A student travelling to campus might need a printed and bound project before arriving, and a campus shop was ready to handle it.",
        "A student vendor had products in stock, while students nearby were looking to buy them.",
        "A student had a valuable digital skill but struggled to find clients, while clients hesitated to hire students because there was no structure or verification.",
        "The problem was not the absence of talent. The problem was discovery and trust."
      ],
      highlight: "Student talent exists. The connection between talent and opportunity is what is missing."
    },
    {
      id: "the-idea",
      chapterNumber: "CHAPTER 3",
      title: "The Idea Began to Take Shape",
      subtitle: "One Connected Campus Ecosystem",
      content: [
        "These observations led to the idea of StudentCircle: one platform addressing multiple student needs and connecting multiple opportunities.",
        "Instead of treating campus freelancing, student commerce, peer networking and physical campus services as disconnected pieces, we brought them together into four simple pillars:",
        "1. Student Connect: Meet and connect with students across OOU. Discover people with similar interests, skills and goals.",
        "2. Student Services: Find students who can help with real services, or create a profile and offer your own skills.",
        "3. Marketplace: Buy and sell products from student vendors around your campus.",
        "4. Campus Hub (Motion Ground): Find campus shops and everyday services before you get there."
      ]
    },
    {
      id: "why-oou",
      chapterNumber: "CHAPTER 4",
      title: "Why OOU?",
      subtitle: "Grounding the Platform in a Real Community",
      content: [
        "Starting with Olabisi Onabanjo University was a natural decision. OOU has students across different locations and campuses, including Ago-Iwoye, Mini Campus, Ayetoro, Ibogun and Sagamu.",
        "Students across these campuses have different skills, businesses and needs. Campus businesses provide essential everyday services, and incoming aspirants need reliable information and service providers.",
        "StudentCircle begins with OOU because I understand this environment and the day-to-day challenges students encounter when trying to earn, collaborate and access services.",
        "We are building directly from lived campus experience so every feature solves an actual problem."
      ]
    },
    {
      id: "the-challenges",
      chapterNumber: "CHAPTER 5",
      title: "The Challenges",
      subtitle: "Building While Learning and Growing",
      content: [
        "Building StudentCircle has been a demanding and humbling journey. I had to learn that an idea is only the start. Turning an idea into an actual product requires patience, listening and steady work.",
        "I was building while still learning technology and product development, writing code late into the night, and figuring out how to connect students, vendors and clients in a reliable way.",
        "Resources were limited. Balancing academic work, leadership responsibilities and platform development required discipline and difficult tradeoffs. There were technical hurdles, features that had to be reworked, and lessons learned from mistakes.",
        "I did not have everything figured out from day one. But every challenge taught me to listen more closely to users and focus on building what is truly useful."
      ]
    },
    {
      id: "why-i-kept-building",
      chapterNumber: "CHAPTER 6",
      title: "Why I Kept Building",
      subtitle: "Creating Infrastructure for Student Talent",
      content: [
        "Whenever building became difficult, the reason for doing it kept me going. The goal is bigger than creating another website. It is to create infrastructure around student talent and student commerce.",
        "A student should be able to discover another student's skill. A student professional should be able to find legitimate clients. A campus vendor should be able to reach customers beyond people walking past the shop.",
        "An incoming aspirant should be able to discover campus services before arriving, and students should be able to connect with each other across OOU locations.",
        "That is the ecosystem StudentCircle is trying to build."
      ]
    },
    {
      id: "what-studentcircle-means",
      chapterNumber: "CHAPTER 7",
      title: "What StudentCircle Means",
      subtitle: "The Philosophy Behind the Name",
      content: [
        "The name reflects what the platform stands for.",
        "'Student' represents the people and community at the centre of the platform.",
        "'Circle' represents connection. The idea is that opportunities should not remain isolated.",
        "Students connect with students, professionals, vendors, campus businesses, clients and opportunities. StudentCircle represents that connected community."
      ]
    },
    {
      id: "the-bigger-vision",
      chapterNumber: "CHAPTER 8",
      title: "The Bigger Vision",
      subtitle: "A Model for Student Opportunity",
      content: [
        "OOU is our starting point and foundation, but the long-term vision is to develop a model that can eventually support students across other Nigerian tertiary institutions.",
        "Campuses across the country are full of talented students whose skills deserve to be discovered.",
        "Our ambition is to refine and prove this model at OOU first, making it easier for student talent and student businesses to be found and trusted.",
        "We are taking this step by step, with honesty, patience and dedication to students."
      ]
    }
  ],

  timeline: [
    {
      stage: 1,
      title: "Observation",
      subtitle: "Seeing the Gap",
      description: "Noticing that student talent, businesses and services at OOU were scattered across personal chats and word of mouth."
    },
    {
      stage: 2,
      title: "Idea",
      subtitle: "Connecting the Pieces",
      description: "Bringing together Student Connect, Student Services, Marketplace and Campus Hub into one connected platform."
    },
    {
      stage: 3,
      title: "Research",
      subtitle: "Understanding the Student Ecosystem",
      description: "Talking directly with students, campus freelancers, vendors and shop owners to understand their daily challenges and needs."
    },
    {
      stage: 4,
      title: "Building",
      subtitle: "Turning the Idea into a Working Platform",
      description: "Developing the platform, secure milestone escrow, real-time messaging and multi-campus support."
    },
    {
      stage: 5,
      title: "Testing",
      subtitle: "Learning from Real Users",
      description: "Gathering feedback from OOU students to improve the experience, verification flow and service requests."
    },
    {
      stage: 6,
      title: "Growth",
      subtitle: "Building Beyond One Campus",
      description: "Establishing a solid model at OOU with the long-term vision of supporting students across Nigerian tertiary institutions."
    }
  ],

  fourPillarsRelation: [
    {
      title: "Student Connect",
      description: "Meet and connect with students across OOU. Discover people with similar interests, skills and goals.",
      route: "/student-connect",
      badge: "Student Connect"
    },
    {
      title: "Student Services",
      description: "Find students who can help with real services, or create a profile and offer your own skills.",
      route: "/services",
      badge: "Student Services"
    },
    {
      title: "Marketplace",
      description: "Buy and sell products from student vendors around your campus.",
      route: "/marketplace",
      badge: "Marketplace"
    },
    {
      title: "Campus Hub (Motion Ground)",
      description: "Find campus shops and everyday services before you get there.",
      route: "/campus",
      badge: "Campus Hub"
    }
  ]
};
