// Official Founder Configuration for OOU StudentCircle
import founderImage from '../assets/images/founder_sulaiman.jpg';

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
  shortBio: string;
  story: string[];
  mission: string;
  vision: string;
  coreValues: { title: string; desc: string }[];
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
  whatsappUrl: "https://wa.me/2348051780169?text=Hello%20Onifade%20Sulaiman%20(Mr.%20Clarity)%2C%20I%20am%20reaching%20out%20regarding%20OOU%20StudentCircle.",
  email: "clarityofficial85@gmail.com",
  emailUrl: "mailto:clarityofficial85@gmail.com?subject=Inquiry%20-%20OOU%20StudentCircle",
  shortBio: "Computer Science student at Olabisi Onabanjo University and digital innovator dedicated to bridging student talent with genuine economic opportunities.",
  story: [
    "As a Computer Science student at Olabisi Onabanjo University, I witnessed firsthand the immense pool of untapped student talent across our campuses — graphic designers, web developers, content writers, tutors, video editors, and craftspeople struggling to connect with clients who actively needed their skills.",
    "Traditional freelancing platforms present high entry barriers, steep foreign currency hurdles, and lack local campus trust. Meanwhile, campus businesses, local organizations, and fellow students struggle to find affordable, dependable service providers nearby.",
    "I founded OOU StudentCircle to build a secure, verified, and campus-tailored marketplace. Our mission is to empower every skilled student to gain authentic work experience, build an unshakeable reputation, and earn sustainable income right from school."
  ],
  mission: "To democratize access to verified student talent across Nigerian universities, turning classroom knowledge into sustainable economic empowerment and real-world career readiness.",
  vision: "To become the undisputed talent bridge for tertiary institutions across Africa — where student skills are celebrated, verified, and seamlessly connected to local and global opportunities.",
  coreValues: [
    {
      title: "Student-First Empowerment",
      desc: "Every feature, policy, and fee structure is designed to benefit and protect student talent and their academic schedules."
    },
    {
      title: "Verified Authenticity",
      desc: "True campus verification ensures clients work with real, accountable OOU student professionals."
    },
    {
      title: "Secure Escrow & Fair Value",
      desc: "Transactions are protected with escrow safety, ensuring students are paid for their hard work and clients receive quality deliverables."
    },
    {
      title: "Sustainable Community",
      desc: "Fostering collaboration between Ago-Iwoye, Sagamu, Ayetoro, and Ibogun campuses to build a vibrant peer economy."
    }
  ]
};

