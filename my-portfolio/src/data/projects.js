import collabToolImg from "../assets/collabTool.png";
import mySpaceImg from "../assets/My-space.png";
import roomImg from "../assets/Room.png";
import proedxLanding from "../assets/Proedx-landing-page.png";
import studentDash from "../assets/Student-dash.png";
import collegeDash from "../assets/College-dash.png";
import hrDash from "../assets/Hr-dash.png";
import adminDashb from "../assets/admin-dashb.png";
import liveInterview from "../assets/live-interview.png";
import navyAiImg from "../assets/navy-ai-system.jpg";
import wdipImg from "../assets/wdip-platform.jpg";

const projects = [
  {
    id: 1,
    status: "Completed",
    title: "ProEdxAI (Career Guidance Platform)",
    description:
      "A comprehensive career readiness platform that bridges the gap between learning and employment. It leverages a dual-engine architecture (Node.js & Flask) to provide students with AI-powered mock interviews, real-time proctoring, and hyper-personalized course recommendations.",
    images: [
      {
        src: proedxLanding,
        alt: "ProedX Landing Page",
        preload: true,
      },
      {
        src: studentDash,
        alt: "Student Dashboard",
      },
      {
        src: collegeDash,
        alt: "College Dashboard",
      },
      {
        src: hrDash,
        alt: "HR Dashboard",
      },
      {
        src: adminDashb,
        alt: "Admin Dashboard",
      },
      {
        src: liveInterview,
        alt: "Live Interview",
      },
    ],
    link: "https://proed-x-ai.vercel.app/",
    github: "https://github.com/Bharadwaj710/ProedX-AI",
    features: [
      "AI-based career assessment using facial and voice analysis",
      "Real-time video upload and Cloudinary integration",
      "Automatic transcription and speech confidence evaluation (Whisper + Gemini AI)",
      "Personalized course recommendations using AI models",
      "Admin, Student, College & HR dashboards with role-based access",
      "Real-time notifications for new users, course updates, and hiring events",
      "Course management with modules, lessons, and PDF uploads",
      "Student leaderboard and filtering by domain/skills",
      "Profile picture upload and persistent user profiles",
      "Secure authentication (JWT + bcrypt)",
    ],
    tech: [
      "React.js",
      "Express.js",
      "Flask",
      "Python",
      "MongoDB",
      "Tailwind CSS",
      "JWT Auth",
      "Google Gemini API",
      "Whisper (speech-to-text)",
      "OpenCV",
      "MediaPipe",
      "Cloudinary",
    ],
  },
  {
    id: 2,
    status: "Completed",
    title: "Converge (Real-Time Collaboration Tool)",
    description:
      "A collaborative text editor allowing multiple users to edit documents in real time. Designed to support future video/audio collaboration using WebRTC.",
    images: [
      {
        src: collabToolImg,
        alt: "Collaboration Tool Interface",
        preload: true,
      },
      {
        src: mySpaceImg,
        alt: "My Space View",
      },
      {
        src: roomImg,
        alt: "Room Collaboration View",
      },
    ],
    link: "https://collab-tool1.vercel.app/",
    github: "https://github.com/Bharadwaj710/Collab-Tool",
    features: [
      "Live multi-user document editing",
      "Typing indicators and synchronization",
      "User authentication with JWT",
      "Optimized Socket.IO handling",
      "Future-ready for video/audio collaboration",
    ],
    tech: [
      "React.js",
      "Node.js",
      "Express.js",
      "Socket.IO",
      "MongoDB",
      "Tailwind CSS",
      "JWT Auth",
    ],
  },
  {
    id: 3,
    status: "Internship Work",
    title: "Navy AI Department Prediction System",
    description:
      "An AI-assisted classification and retrieval pipeline engineered to predict responsible engineering and maintenance departments from historical naval defect logs using dense semantic embeddings and vector similarity search.",
    images: [
      {
        src: navyAiImg,
        alt: "Navy AI Department Prediction System Interface",
        preload: true,
      },
    ],
    link: null,
    github: null,
    features: [
      "Preprocessing and normalization of historical technical defect descriptions",
      "Dense vector embeddings generation using Sentence Transformers",
      "Similarity indexing and retrieval with PostgreSQL and pgvector",
      "Semantic search engine matching defect narratives to department domains",
      "Inference API endpoints for automated department categorization and routing",
    ],
    tech: [
      "Python",
      "PostgreSQL",
      "pgvector",
      "Sentence Transformers",
      "Semantic Search",
      "FastAPI / Flask",
      "REST APIs",
    ],
  },
  {
    id: 4,
    status: "In Progress",
    title: "WDIP — Workforce Deployment Intelligence Platform",
    description:
      "An intelligent talent allocation and resource planning backend engineered to match engineers to project requisitions using semantic skill matching, vector embeddings, and structured competency evaluations.",
    images: [
      {
        src: wdipImg,
        alt: "Workforce Deployment Intelligence Platform Interface",
        preload: true,
      },
    ],
    link: null,
    github: null,
    features: [
      "[Implemented] Relational data modeling for talent profiles, skill taxonomies, and project requisitions",
      "[Implemented] Vector embedding generation for developer skill sets via pgvector",
      "[Implemented] FastAPI backend service with endpoints for skill matching and query retrieval",
      "[Planned] Hybrid search combining fuzzy string matching with dense semantic vectors",
      "[Planned] Automated team composition recommendations and utilization analytics",
    ],
    tech: [
      "FastAPI",
      "Python",
      "PostgreSQL",
      "pgvector",
      "Embeddings",
      "Fuzzy Matching",
      "REST APIs",
    ],
  },
];

export default projects;
