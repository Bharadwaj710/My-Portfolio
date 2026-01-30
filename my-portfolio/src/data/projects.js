import collabToolImg from "../assets/collabTool.png";
import mySpaceImg from "../assets/My-space.png";
import roomImg from "../assets/Room.png";
import taskWidget from "../assets/Taskwidget.png";
import velocitx1 from "../assets/Velocitix-1.jpg";
import velocitx2 from "../assets/Velocitix-2.jpg";
import velocitx3 from "../assets/Velocitix-3.jpg";
import velocitx4 from "../assets/Velocitix-4.jpg";

const projects = [
  {
    id: 1,
    title: "Real Time Collaboration Tool",
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
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
    ],
  },
  {
    id: 2,
    title: "Hospital Management Web App",
    description:
      "A full-stack hospital management system for tracking patients, doctors, appointments, and billing. Includes admin dashboards, secure authentication, and dynamic data visualization for hospital statistics",
    images: [
      {
        src: "https://picsum.photos/600/400?random=2",
        alt: "Hospital Management Dashboard",
        preload: true,
      },
    ],
    link: "https://projects-hb7b.vercel.app/",
    github: "https://github.com/Bharadwaj710/PROJECTS",
    features: [
      "Role-based login for Admins, Doctors, and Staff",
      "Patient registration and appointment scheduling",
      "Doctor availability management",
      "Medical report and billing generation",
      "Real-time updates for appointments",
      "Intuitive admin dashboard with analytics",
    ],
    tech: [
      "React.js",
      "Tailwind CSS",
      "Node.js",
      "JWT Authentication",
      "Express.js",
      "MongoDB",
      "Vite",
    ],
  },
  {
    id: 3,
    title: "Task Widget Application",
    description:
      "A lightweight desktop widget that helps users stay organized by tracking tasks, Pomodoro timer- for productive sessions, and Total time tracked right from their desktop.",
    images: [
      {
        src: taskWidget,
        alt: "Task Widget Interface",
        preload: true,
      },
    ],
    link: "https://example.com/chat",
    features: [
      "Minimal, distraction-free floating desktop widget",
      "Add, edit, and delete daily tasks quickly",
      "Real-time progress tracking with percentage completion",
      "Local storage persistence (tasks saved automatically)",
      "Compact and responsive UI with smooth animations",
      "Built using Electron.js + React.js for cross-platform desktop support",
    ],
    tech: [
      "Electron.js",
      "React.js / Vanilla JS",
      "Tailwind CSS",
      "LocalStorage / IndexedDB",
    ],
  },
  {
    id: 4,
    title: "Goal Tracker – Productivity Desktop App",
    description:
      "A minimal desktop application built to help users set, track, and visualize their personal or work goals. The app provides features like goal creation, daily progress tracking, streak visualization, and reminders — all accessible right from your desktop. Designed for distraction-free productivity with an intuitive UI and local offline storage.",
    images: [
      {
        src: "https://picsum.photos/600/400?random=4",
        alt: "Goal Tracker Dashboard",
        preload: true,
      },
    ],
    link: "https://example.com/tasks",
    features: [
      "Add, edit, and delete personal or professional goals",
      "Visual progress tracking with daily completion streaks",
      "Local data persistence (no internet required)",
      "Compact, lightweight UI optimized for desktops",
      "Smooth animations and notifications for goal reminders",
      "Works seamlessly alongside the Task Widget",
    ],
    tech: [
      "Next.js",
      "Tailwind CSS",
      "Electron.js",
      "LocalStorage / JSON-based persistence",
      "Vite",
    ],
  },
  {
    id: 5,
    title: "Velocitix AI (Career Guidance Platform)",
    description:
      "An AI-powered career guidance and analysis platform that evaluates student skills through video analysis, recommends personalized courses, and provides dashboards for admins, colleges, HRs, and students.",
    images: [
      {
        src: velocitx1,
        alt: "VelociTX Main Dashboard",
        preload: true,
      },
      {
        src: velocitx2,
        alt: "VelociTX Video Analysis Interface",
      },
      {
        src: velocitx3,
        alt: "VelociTX Course Recommendations",
      },
      {
        src: velocitx4,
        alt: "VelociTX Admin Analytics",
      },
    ],
    link: "https://velocitixai-sao9.vercel.app/",
    github: "https://github.com/Bharadwaj710/velocitixai",
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
      "MongoDB",
      "Tailwind CSS",
      "JWT Auth",
      "Google Gemini API",
      "Whisper (speech-to-text)",
      "OpenCV",
      "MediaPipe",
      "Cloudinary (for storing videos and images)",
    ],
  },
];

export default projects;
