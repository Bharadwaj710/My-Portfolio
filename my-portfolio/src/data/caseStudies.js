import proedxLanding from "../assets/Proedx-landing-page.png";
import studentDash from "../assets/Student-dash.png";
import collegeDash from "../assets/College-dash.png";
import hrDash from "../assets/Hr-dash.png";
import adminDashb from "../assets/admin-dashb.png";
import liveInterview from "../assets/live-interview.png";

import collabToolImg from "../assets/collabTool.png";
import mySpaceImg from "../assets/My-space.png";
import roomImg from "../assets/Room.png";

import navyAiImg from "../assets/navy-ai-system.jpg";
import wdipImg from "../assets/wdip-platform.jpg";

export const caseStudies = [
  {
    slug: "proedxai",
    number: "01",
    title: "ProedX",
    subtitle: "AI-Powered Career Preparation Platform",
    headline: "Connecting career assessment, learning, and interview practice in one platform.",
    isFeatured: false,
    status: "Completed",
    statusType: "completed",
    badgeText: null,
    timeline: "2024 – 2025",
    role: "Full-Stack & Applied AI Contributor",
    ownership: "Full-Stack Web Application (Personal / Collaborative Project)",
    category: "AI-Powered Career Preparation Platform",
    shortDescription:
      "An AI-powered career preparation platform combining skill assessments, personalized learning recommendations, mock interview practice, and career-readiness tracking.",
    problemStatement:
      "Students often use separate tools for skill assessment, learning, and interview preparation. ProedX brings these workflows into one platform, helping students assess their readiness, explore recommended courses, practice interviews, review feedback, and monitor learning progress.",
    workflowTitle: "Intended Student Product Workflow",
    productWorkflow: [
      {
        step: "01",
        title: "Career & Skill Assessment",
        description: "Students complete structured diagnostic assessments across technical domains to evaluate baseline competencies."
      },
      {
        step: "02",
        title: "Learning Needs & Course Recommendations",
        description: "Assessment outcomes identify curriculum gaps and recommend targeted learning tracks and modular course materials."
      },
      {
        step: "03",
        title: "AI-Assisted Mock Interview Practice",
        description: "Adaptive interview sessions present tailored behavioral and technical questions in a timed environment."
      },
      {
        step: "04",
        title: "Video Recording & Speech Transcription",
        description: "Candidates record responses via webcam; audio is transcribed to text using OpenAI Whisper speech-to-text."
      },
      {
        step: "05",
        title: "Response Evaluation & Multimodal Feedback",
        description: "Transcripts are analyzed for technical depth via Gemini API and visual cues via OpenCV and MediaPipe."
      },
      {
        step: "06",
        title: "Career-Readiness & Progress Review",
        description: "Aggregated performance scorecards and historical interview analytics are reviewed by students, academic placement cells, and recruiters."
      }
    ],
    intendedUsers: [
      "Engineering students preparing for software engineering and campus placement interviews.",
      "College placement officers and faculty tracking cohort benchmark metrics and readiness.",
      "Corporate HR recruiters evaluating pre-screened candidate pools by verified competency domains.",
      "Platform administrators managing institutional tenants, course modules, and role permissions."
    ],
    primaryStack: [
      "React.js",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "Flask",
      "Google Gemini API",
      "Whisper",
      "OpenCV",
      "MediaPipe",
      "Docker",
      "Render",
      "Vercel"
    ],
    heroImage: proedxLanding,
    heroImageAlt: "ProedX Platform Overview — Connecting assessment, learning, and interview practice",
    galleryImages: [
      {
        src: studentDash,
        title: "Student Readiness Dashboard",
        caption: "Student Dashboard — Overview of readiness indicators, enrolled course tracks, and upcoming interview assessments.",
        alt: "ProedX Student Dashboard Interface"
      },
      {
        src: liveInterview,
        title: "Live Mock Interview Interface",
        caption: "Live Interview View — Real-time camera feed, dynamic question prompt, recording state, and response submission controls.",
        alt: "ProedX Live Interview Interface"
      },
      {
        src: collegeDash,
        title: "College Placement Portal",
        caption: "College Portal — Cohort-level readiness distributions, domain proficiencies, and institutional assessment summaries.",
        alt: "ProedX College Dashboard Interface"
      },
      {
        src: hrDash,
        title: "HR Recruiter Talent Filter",
        caption: "Recruiter Portal — Candidate search filtered by validated competency scores, interview reports, and domain specialties.",
        alt: "ProedX Recruiter Dashboard Interface"
      },
      {
        src: adminDashb,
        title: "Administration & Course Management",
        caption: "Admin Console — Course catalog management, lesson configurations, user role assignments, and platform settings.",
        alt: "ProedX Admin Dashboard Interface"
      },
      {
        src: proedxLanding,
        title: "Platform Overview",
        caption: "Landing Overview — Unified gateway guiding students through assessments, coursework, and AI mock interviews.",
        alt: "ProedX Landing Page Overview"
      }
    ],
    contributionIntro:
      "Key areas of full-stack development, API integration, and machine learning pipeline orchestration contributed to the platform:",
    specificContributions: [
      {
        area: "Full-Stack Application Workflows & API Integration",
        detail: "Developed responsive React interfaces and integrated RESTful endpoints with the Node.js/Express application gateway for user onboarding, profile state, and assessment workflows."
      },
      {
        area: "Database-Backed Course, Assessment, and Progress Functionality",
        detail: "Implemented MongoDB schemas and Mongoose queries managing user profiles, role permissions, course catalogs, student module progress, and historical assessment records."
      },
      {
        area: "AI-Assisted Interview and Transcription Integration",
        detail: "Connected the speech-to-text audio processing pipeline using Whisper and orchestrated structured evaluation prompts with the Google Gemini API to produce standardized rubric scorecards."
      },
      {
        area: "Computer-Vision Integration for Interview Monitoring",
        detail: "Integrated OpenCV and MediaPipe pipelines in the Python service to capture camera presence, head orientation, and eye contact cues during practice sessions as advisory feedback."
      },
      {
        area: "Role-Specific Application Interfaces",
        detail: "Built differentiated UI views and access controls for four user personas: Students, Academic Placement Coordinators, HR Recruiters, and Platform Administrators."
      },
      {
        area: "Service Integration, Containerization, and Deployment",
        detail: "Containerized the Python Flask AI service using Docker, deployed web tiers on Vercel, and deployed backend services on Render."
      }
    ],
    architecture: [
      {
        title: "Inter-Service Data Flow",
        description:
          "1. Browser → Express Backend (REST API requests for auth, courses, and interviews) → 2. Express Backend → MongoDB (User profiles, assessment history, role metadata) → 3. Express Backend → Python Flask Service (Asynchronous media dispatch for evaluation) → 4. Python AI Service → External Providers (Audio transcribed via Whisper; structured prompts sent to Google Gemini API) → 5. Evaluation scores and visual metrics persist in MongoDB and display on the Student Dashboard."
      },
      {
        title: "Role-Specific Isolation & Security",
        description:
          "Stateless JWT tokens encapsulate verified user role claims (Student, College, HR, Admin). Backend route middleware strictly enforces tenant boundaries, ensuring student assessment data is exposed only to designated college placement cells and authorized hiring recruiters."
      }
    ],
    engineeringDecisions: [
      {
        title: "Separation of Application Gateway from Python AI Integrations",
        motivation: "Prevent Python's Global Interpreter Lock (GIL) and heavy OpenCV/Whisper memory footprints during video/audio processing from blocking standard web API requests.",
        benefit: "The Node.js API gateway remains non-blocking and responsive; inference workloads can scale and restart independently.",
        tradeoff: "Introduces cross-service HTTP network latency and requires managing two separate deployment environments (Vercel and Render).",
        unresolved: "Requires robust asynchronous retry logic and timeout handling between the Express gateway and the Flask microservice."
      },
      {
        title: "Integrating Hosted AI Providers (Gemini API) vs Self-Hosting Large LLMs",
        motivation: "Avoid significant GPU server provisioning and maintenance expenses while accessing advanced instruction-following models for interview evaluation.",
        benefit: "Zero GPU infrastructure overhead, automatic provider updates, and predictable operational costs.",
        tradeoff: "Inference response latency depends on external provider API availability and variable network round-trip times.",
        unresolved: "Upstream rate limits require client-side loading indicators and fallback error states during peak usage."
      },
      {
        title: "Asynchronous Video Response Processing Pipeline",
        motivation: "Ingesting multi-megabyte video recordings directly through a monolithic web process can exhaust server memory under concurrent submissions.",
        benefit: "Preserves web server stability by handling media asynchronously and storing artifacts via cloud storage.",
        tradeoff: "Candidate scorecards are not instantaneous; students view a processing status before their full report compiles.",
        unresolved: "Requires resilient client-side retry handling if network drops occur during initial video upload."
      },
      {
        title: "Balancing Vision-Based Interview Cues with False-Positive Risks",
        motivation: "Provide candidates with realistic behavioral preparation by offering feedback on eye contact, head orientation, and camera presence.",
        benefit: "Extends interview coaching beyond pure text answers to include behavioral communication delivery.",
        tradeoff: "Sub-optimal room lighting, camera angles, and hardware variations can trigger noisy detections.",
        unresolved: "Cues are strictly labeled as advisory preparation guidance rather than punitive proctoring or cheating detection."
      }
    ],
    resultsAndEvidence: [
      "Operational live application deployed on Vercel with cloud backend and MongoDB Atlas persistence.",
      "Verified multi-role user flows demonstrated across Student, College Placement, HR Recruiter, and Admin dashboards.",
      "End-to-end interview pipeline verified: question prompt presentation, video recording, transcription, and structured score generation.",
      "Public source code repository available on GitHub with documented endpoints and modular directory structure.",
      "Strict technical truthfulness: Zero fabricated user counts, no unsupported latency claims, and no vector-database or Redis claims."
    ],
    limitationsAndNextSteps: [
      {
        area: "Automated API & Integration Testing",
        detail: "Expanding automated end-to-end test suites across the React client, Express gateway, and Flask AI service to ensure contract stability across releases."
      },
      {
        area: "Cross-Service Failure Handling & Observability",
        detail: "Implementing centralized structured logging and distributed tracing to monitor inter-service latency and handle transient network timeouts gracefully."
      },
      {
        area: "Interview Scoring Empirical Validation",
        detail: "Validating Gemini grading rubrics against standardized benchmark human interviewer ratings across varied speech accents and cadences."
      },
      {
        area: "Computer-Vision False-Positive Benchmarking",
        detail: "Conducting systematic evaluation of OpenCV and MediaPipe facial and gaze tracking under diverse ambient lighting conditions and camera angles."
      },
      {
        area: "Concurrency & Load Stress-Testing",
        detail: "Executing load tests to measure system throughput and memory consumption when multiple users submit interview recordings simultaneously."
      }
    ],
    links: {
      live: "https://proed-x-ai.vercel.app/",
      github: "https://github.com/Bharadwaj710/ProedX-AI",
      demoVideo: null,
      demoVideoNote: "Demo video walk-through is available upon request for technical interviews.",
      isProprietary: false,
      note: "Live application deployed on Vercel. Public GitHub repository contains full source code and setup documentation."
    }
  },
  {
    slug: "converge",
    number: "02",
    title: "Converge",
    subtitle: "Real-Time Collaboration Platform",
    headline: "One workspace for collaborative technical interviews.",
    isFeatured: false,
    status: "Completed",
    statusType: "completed",
    badgeText: null,
    timeline: "2024",
    role: "Full-Stack & Real-Time Systems Developer",
    ownership: "Personal Full-Stack Web Application",
    category: "Real-Time Collaboration Platform",
    shortDescription:
      "A full-stack collaboration workspace for technical interviews and pair programming, combining shared editing, real-time communication, participant audio/video, and interview-focused tools.",
    caseStudyIntro:
      "Converge explores how technical interviews and collaborative problem-solving can work within a single browser-based workspace. It brings together collaborative editing, code execution integration, group discussion, participant communication, and role-aware workflows. The project involved building frontend experiences, integrating backend APIs and persistent storage, and investigating real-time synchronization and deployment issues across the application stack.",
    problemStatement:
      "Technical interviews and collaborative problem-solving often require multiple separate tools for coding, communication, and discussion. Converge aims to combine these workflows in one browser-based workspace, reducing the need to switch between separate applications.",
    workflowTitle: "Intended Technical Interview Workflow",
    productWorkflow: [
      {
        step: "01",
        title: "Session Initiation & Room Allocation",
        description: "An interviewer or peer initializes a dedicated workspace, generating an isolated room namespace with distinct UUID routing."
      },
      {
        step: "02",
        title: "Participant Authentication & Role Joining",
        description: "Collaborators join the room using JWT-backed identities with role-aware privileges for interviewers, candidates, and peers."
      },
      {
        step: "03",
        title: "Real-Time Collaborative Editing",
        description: "Low-latency synchronized text editing transmits live keystroke mutations, cursor positions, and typing awareness via Socket.IO."
      },
      {
        step: "04",
        title: "Live Peer Audio/Video Communication",
        description: "Documented media signaling via WebRTC and PeerJS enabling direct peer-to-peer audio and video interaction alongside the editor."
      },
      {
        step: "05",
        title: "Integrated Group Discussion & Problem Solving",
        description: "Side-by-side discussion channels, structured chat, and interview-oriented scratchpad controls streamline technical collaboration."
      },
      {
        step: "06",
        title: "Debounced In-Memory Persistence",
        description: "Document mutations are batched in an in-memory buffer and committed to MongoDB after typing pauses to protect database throughput."
      }
    ],
    intendedUsers: [
      "Software engineers and peer programmers co-authoring technical specifications and scratchpad notes.",
      "Technical interviewers and candidates conducting live technical coding interviews.",
      "Students and distributed engineering teams collaborating remotely on shared problem-solving and meeting notes."
    ],
    primaryStack: [
      "JavaScript",
      "React",
      "Tailwind CSS",
      "React Router",
      "Framer Motion",
      "Axios",
      "Node.js",
      "Express",
      "Socket.IO",
      "MongoDB",
      "Mongoose",
      "JWT"
    ],
    heroImage: collabToolImg,
    heroImageAlt: "Converge Collaborative Workspace Interface — One workspace for collaborative technical interviews",
    galleryImages: [
      {
        src: collabToolImg,
        title: "Workspace Platform Overview",
        caption: "Platform Landing — Gateway for creating real-time collaborative rooms, initiating technical interview sessions, and managing workspace access.",
        alt: "Converge Platform Overview"
      },
      {
        src: roomImg,
        title: "Live Collaborative Editing Room",
        caption: "Active Collaboration Canvas — Multi-user synchronized text editor with active participant tracking, live typing awareness, and chat discussion panel.",
        alt: "Converge Live Editing Room"
      },
      {
        src: mySpaceImg,
        title: "My Space Session Dashboard",
        caption: "My Space Management — Personal dashboard organizing created session rooms, document history, and collaborator permissions.",
        alt: "Converge My Space Interface"
      }
    ],
    contributionIntro:
      "Key areas of full-stack development, WebSocket event orchestration, and cross-stack system debugging contributed to the platform:",
    specificContributions: [
      {
        area: "Full-Stack Workspace & API Integration",
        detail: "Developed and integrated responsive React frontend components with Node.js/Express backend API endpoints, establishing document routing, state synchronization, and core session lifecycles."
      },
      {
        area: "Real-Time WebSocket Synchronization Layer",
        detail: "Engineered room-partitioned Socket.IO event channels for low-latency document delta broadcasting, participant connection presence, and live typing awareness."
      },
      {
        area: "Authentication & Document CRUD Operations",
        detail: "Implemented JWT authentication flows, session authorization middleware, personal My-Space workspace dashboards, and MongoDB document persistence schemas."
      },
      {
        area: "Debounced Database Persistence Buffer",
        detail: "Built an in-memory mutation buffer with a debounce timer that batches live typing deltas and commits full document snapshots to MongoDB to prevent database write amplification."
      },
      {
        area: "Engineering Debugging & Issue Investigation",
        detail: "Investigated cross-stack issues including typing-indicator participant identity attribution in discussion mode, JWT/Axios header contract consistency, MongoDB deployment connectivity, and code-execution API integration."
      }
    ],
    architecture: [
      {
        title: "Documented System Topology & Inter-Service Flow",
        description:
          "1. React Frontend (Browser) → Express REST API (Auth, user profile state, session rooms, and document operations) → 2. Express Backend → MongoDB via Mongoose (Persistence for user accounts, room metadata, and document snapshots) → 3. React Frontend ↔ Socket.IO Server (Bi-directional WebSocket loop for document mutation broadcasting, typing indicators, and presence) → 4. Documented Media Layer: PeerJS / WebRTC (Documented signaling channel intended for peer-to-peer participant audio and video communication)."
      },
      {
        title: "Event-Driven Broadcast Loop & Debounced Persistence Buffer",
        description:
          "Clients connect via WebSocket over Socket.IO to isolated room namespaces (UUID-based). Each text mutation triggers an optimistic local UI update followed by a socket emit to the server, which broadcasts the delta payload to connected room peers. To eliminate database write amplification during rapid typing bursts, an in-memory buffer collects deltas and commits full document snapshots to MongoDB only after an inactivity pause (2000ms debounce) or upon room termination."
      },
      {
        title: "Documented Engineering Investigations & Verification Status",
        description:
          "Technical challenges investigated during development: 1. Typing Indicators: Activity in discussion mode occasionally attributed to the wrong participant; investigation focused on identity mapping and event handling compared to the code editor (root cause/fix pending final confirmation). 2. Authentication Contracts: Inconsistent token conventions between localStorage, Axios headers, and Express middleware were audited and normalized. 3. Deployment Debugging: Addressed MongoDB connection timeouts, Node.js runtime compatibility, and Vite API environment variables. 4. Code Execution Sandbox: External code-execution integration returned an invalid API key error during execution tests. Project Status: Built; current end-to-end production functionality requires ongoing verification."
      }
    ],
    links: {
      live: "https://collab-tool1.vercel.app/",
      github: "https://github.com/Bharadwaj710/Collab-Tool",
      demoVideo: null,
      isProprietary: false,
      note: "Live demo deployed on Vercel. Canonical repository on GitHub."
    }
  },
  {
    slug: "navy-ai-prediction",
    number: "03",
    title: "AI-Based Defect Prediction System",
    subtitle: "Semantic Retrieval for Maintenance Defect Routing",
    headline: "Semantic retrieval for maintenance defect routing.",
    isFeatured: false,
    status: "Internship Work",
    statusType: "internship",
    badgeText: "internship work",
    timeline: "Internship",
    role: "AI & Backend Engineering Intern",
    ownership: "Internship Engineering Project",
    category: "AI-Assisted Maintenance Defect Routing",
    shortDescription:
      "An AI-assisted maintenance defect routing system using sentence embeddings and PostgreSQL/pgvector similarity search to recommend responsible engineering departments from historical records.",
    caseStudyIntro:
      "During my internship, I worked on an AI-assisted defect prediction system designed to help route maintenance logs to the appropriate department. The application uses sentence embeddings and vector similarity search over historical defect records, exposed through a Python FastAPI service. My contributions included backend development, database integration, offline model configuration, and deployment troubleshooting across an internal network.",
    problemStatement:
      "Maintenance defect descriptions can differ in wording and terminology, making historical cases difficult to identify through exact text matching alone. The system uses embedding-based similarity retrieval over historical defect records to identify related cases and recommend a likely responsible department. The system exposes the prediction workflow through a Python HTTP API and a web interface, configured for a restricted offline network environment.",
    workflowTitle: "Conceptual Defect Routing Workflow",
    productWorkflow: [
      {
        step: "01",
        title: "Defect Description Intake",
        description: "A maintenance engineer inputs a free-form technical defect narrative through the browser-based web interface."
      },
      {
        step: "02",
        title: "HTTP Prediction Dispatch",
        description: "The web interface dispatches an asynchronous HTTP POST request (/predict) containing the defect log to the FastAPI host."
      },
      {
        step: "03",
        title: "Offline Dense Embedding Generation",
        description: "A local Sentence Transformer model generates a dense semantic embedding vector directly on the host machine without internet connectivity."
      },
      {
        step: "04",
        title: "pgvector Cosine Similarity Search",
        description: "PostgreSQL with the pgvector extension queries historical defect embeddings to identify semantically related prior maintenance cases."
      },
      {
        step: "05",
        title: "Department Selection Logic",
        description: "Backend routing logic analyzes top-k nearest neighbor historical records to select the most probable responsible department."
      },
      {
        step: "06",
        title: "Structured JSON Response",
        description: "FastAPI delivers a structured response payload returning the recommended department and confidence indicators to the client UI."
      }
    ],
    intendedUsers: [
      "Dockyard maintenance planners and triage personnel categorizing incoming defect reports.",
      "Fleet technical support coordinators routing service orders to specialized engineering groups.",
      "Maintenance engineering departments receiving pre-screened work queues."
    ],
    primaryStack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Sentence Transformers",
      "JavaScript",
      "HTML / CSS",
      "IIS"
    ],
    heroImage: navyAiImg,
    heroImageAlt: "AI-Based Defect Prediction System — Conceptual Architecture & Retrieval Pipeline",
    galleryImages: [
      {
        src: navyAiImg,
        title: "Sanitized Conceptual Architecture",
        caption: "Conceptual System Architecture — Sanitized overview illustrating text encoding, pgvector similarity retrieval, and departmental triage recommendation within an offline host environment.",
        alt: "AI-Based Defect Prediction System Pipeline Architecture"
      }
    ],
    contributionIntro:
      "Key areas of backend API engineering, vector database integration, offline model configuration, and network debugging contributed to the project:",
    specificContributions: [
      {
        area: "FastAPI Prediction Endpoint & Contract Design",
        detail: "Implemented the core POST /predict endpoint in FastAPI, structuring request parsing, input validation, and delivering standardized JSON prediction responses."
      },
      {
        area: "PostgreSQL & pgvector Retrieval Pipeline",
        detail: "Integrated the prediction pipeline with PostgreSQL using the pgvector extension, querying historical defect records and vector embeddings to locate semantically similar cases."
      },
      {
        area: "Offline Model Loading & Local Execution",
        detail: "Configured the Sentence Transformer embedding pipeline to load and run entirely from local weights, ensuring reliable execution within an isolated network without external API dependencies."
      },
      {
        area: "Frontend Integration & Web Interface Hosting",
        detail: "Connected the HTML/CSS/JavaScript web interface to the FastAPI service and configured the frontend client for deployment under an IIS hosting environment."
      },
      {
        area: "Cross-PC Network Diagnostics & LAN Address Resolution",
        detail: "Diagnosed an end-to-end communication failure where the web UI loaded remotely but API calls failed due to hardcoded localhost loopback; updated configuration to the server's network LAN IP and verified remote client requests."
      }
    ],
    architecture: [
      {
        title: "Conceptual System Topology & Request Lifecycle",
        description:
          "1. Web Interface (HTML, CSS, JavaScript hosted via IIS) → 2. Python FastAPI Backend (Accepts POST /predict requests with incoming defect text) → 3. Sentence Transformer Pipeline (Encodes defect narrative into dense semantic vectors using local model weights) → 4. PostgreSQL + pgvector (Executes vector distance queries across historical defect embeddings to retrieve top related records) → 5. Department Prediction Logic (Aggregates candidate records to recommend a likely responsible department) → 6. Structured JSON Response (Returns predicted department and confidence metrics to the client UI)."
      },
      {
        title: "Debugging the Gap Between Local Development and Network Deployment",
        description:
          "During cross-PC integration testing on the internal network, the web interface loaded successfully from a remote client machine, but all prediction requests failed silently. Investigation revealed that the frontend client was attempting to dispatch HTTP requests to 127.0.0.1:8000. In a remote browser session, 127.0.0.1 resolves to the client computer's local loopback interface rather than the host server running the FastAPI backend. Reconfiguring the frontend API endpoint to target the host machine's dedicated LAN IP resolved the routing mismatch, successfully restoring client-to-server request flow and validating remote cross-PC operation."
      },
      {
        title: "Evaluation Context, Unresolved Variables & Production Verification Gaps",
        description:
          "In accordance with strict technical truthfulness and defense confidentiality: 1. Conflicting historical accuracy metrics (ranging from ~57% to 89% across different evaluation stages) remain unverified against a unified test suite, and operational benchmarks are intentionally excluded. 2. The exact production embedding model (all-mpnet-base-v2 vs all-MiniLM-L6-v2) and full integration of auxiliary terminology correction tables (naval_dictionary / corrected_words) require repository reconciliation. 3. System status: Core prediction API and web interface were implemented and internal-network request flow was validated; full production deployment and live maintenance platform integration require confirmation."
      }
    ],
    links: {
      live: null,
      github: null,
      demoVideo: null,
      isProprietary: true,
      note: "Internal / Proprietary Internship Project — deployed on an internal restricted network; source code and operational records are confidential."
    }
  },
  {
    slug: "wdip",
    number: "04",
    title: "Workforce Deployment Intelligence Platform (WDIP)",
    subtitle: "AI Workforce Intelligence Platform",
    headline: "AI workforce intelligence platform for talent mobility and skills matching.",
    isFeatured: false,
    status: "In Progress",
    statusType: "in-progress",
    badgeText: "in progress",
    timeline: "2025 – Present",
    role: "AI Backend Engineer",
    ownership: "Personal Engineering Project",
    category: "AI Workforce Intelligence Platform",
    shortDescription:
      "An AI workforce intelligence platform designed to help organizations connect employee skills with project opportunities, identify skill gaps, and discover relevant internal knowledge.",
    caseStudyIntro:
      "WDIP explores how exisitng engineers can support internal talent mobility. The platform is being developed to help organizations understand employee capabilities, compare them with project requirements, and identify relevant learning resources for role transitions. Its planned architecture combines FastAPI and PostgreSQL with recommendation logic, semantic retrieval, and RAG, with an emphasis on explainable results and practical engineering decisions.",
    problemStatement:
      "Organizations continually adapt to new technologies and project requirements, but existing employee capabilities and institutional knowledge can be difficult to connect with emerging opportunities. WDIP aims to make those connections easier by bringing together structured workforce data, skill matching, project requirements, and relevant organizational knowledge.",
    workflowTitle: "Intended Workforce Deployment Workflow",
    productWorkflow: [
      {
        step: "01",
        title: "Employee Capability Intake",
        description: "Structured employee profiles capturing verified competencies, years of experience, current role, and skill sets are validated via Pydantic schemas."
      },
      {
        step: "02",
        title: "Project Requirement Ingestion",
        description: "Planned project requisition schemas define target technical domains, prerequisite tools, and seniority criteria for emerging team roles."
      },
      {
        step: "03",
        title: "Skill-Gap & Transition Analysis",
        description: "Planned recommendation logic compares employee proficiencies against project criteria to identify skill adjacencies and competency gaps."
      },
      {
        step: "04",
        title: "Semantic Knowledge Discovery",
        description: "Planned PostgreSQL/pgvector semantic retrieval pipeline over internal knowledge articles and learning documentation for role upskilling."
      },
      {
        step: "05",
        title: "Grounded Transition Guidance (RAG)",
        description: "Planned retrieval-augmented generation pipeline to provide explainable recommendations and personalized upskilling pathways."
      },
      {
        step: "06",
        title: "Explainable Deployment Recommendation",
        description: "Transparent scoring outputs ranked project matches with detailed reasoning to support internal talent mobility decisions."
      }
    ],
    intendedUsers: [
      "Engineering leaders and technical managers staffing project teams from internal talent pools.",
      "Resource allocation and talent deployment managers optimizing workforce mobility.",
      "Software engineers exploring internal project opportunities, skill adjacencies, and role transitions."
    ],
    primaryStack: [
      "Python",
      "FastAPI",
      "Uvicorn",
      "Pydantic",
      "Pydantic Settings",
      "Swagger / OpenAPI"
    ],
    heroImage: wdipImg,
    heroImageAlt: "Workforce Deployment Intelligence Platform (WDIP) — Architectural Roadmap",
    galleryImages: [
      {
        src: wdipImg,
        title: "Platform Roadmap & Planned Architecture",
        caption: "WDIP Architecture Overview — Conceptual roadmap highlighting the implemented modular FastAPI foundation alongside the planned relational data layer, semantic search, and RAG knowledge assistance pipeline.",
        alt: "WDIP Architecture Roadmap"
      }
    ],
    contributionIntro:
      "Key areas of backend architecture, API contract design, service-layer modularity, and learning-focused engineering contributed to the project:",
    specificContributions: [
      {
        area: "FastAPI Backend Foundation & Project Organization",
        detail: "Established the core FastAPI application structure, configuring Uvicorn execution, health check endpoints, and root route handlers."
      },
      {
        area: "Pydantic Request Validation Schemas",
        detail: "Created strict Pydantic models for employee profiles (capturing name, experience in years, current role, and skills) to enforce contract validation on submission."
      },
      {
        area: "Modular API Routing with APIRouter",
        detail: "Organized endpoint pathways using FastAPI's APIRouter across dedicated route modules to ensure clean URL grouping and maintainable API versioning."
      },
      {
        area: "Service-Layer Separation & Centralized Configuration",
        detail: "Decoupled HTTP request handling from business logic via a dedicated service layer, and configured environment management using Pydantic Settings."
      },
      {
        area: "Rule-Based Prediction Practice & Swagger Verification",
        detail: "Implemented a rule-based prediction API as a deliberate learning exercise to practice request/response schemas, routing, and service separation, verifying endpoints through FastAPI Swagger UI."
      }
    ],
    architecture: [
      {
        title: "Implemented Backend Foundation vs. Planned Target Topology",
        description:
          "Current Implemented Foundation: Client → FastAPI Application Gateway → APIRouter Modules (Employee & Predictor) → Pydantic Schema Validation → Dedicated Service Layer → JSON Response (tested via Swagger UI). Planned Target Topology: React/TypeScript Dashboard → FastAPI API Services → PostgreSQL Relational Workforce Store (Employee, Skill, Project, KnowledgeArticle, TransitionRequest entities)."
      },
      {
        title: "Engineering Decisions & Architectural Rationale",
        description:
          "Key architectural decisions guiding the backend design: 1. Router and Service Decoupling: Separating endpoint handling from service logic ensures business logic can be tested and modified independently of HTTP transport layers. 2. Pydantic Contract Validation: Ensures type safety, automatic error handling, and autogenerated OpenAPI documentation. 3. Planned Relational Modeling: Explicit foreign-key relations among employees, skills, and projects model talent mobility more accurately than unstructured keyword tagging. 4. Explainability First: Recommendation logic is architected to produce transparent score breakdowns rather than opaque black-box recommendations."
      },
      {
        title: "Current Foundation Status & Prioritized Engineering Roadmap",
        description:
          "In accordance with strict technical truthfulness: 1. Current Status: The employee endpoint demonstrates successful request validation and response formatting, not persistent database storage; the prediction exercise uses simple keyword heuristics rather than a trained ML model. 2. Prioritized Roadmap: Milestone 1: Implement PostgreSQL and SQLAlchemy relational entities for Employee, Skill, and Project data. Milestone 2: Build explainable skill-gap analysis and project matching. Milestone 3: Implement Sentence Transformers, pgvector, and RAG over organizational knowledge articles. Milestone 4: Add RapidFuzz evaluation, React frontend integration, and production testing safeguards."
      }
    ],
    links: {
      live: null,
      github: null,
      demoVideo: null,
      isProprietary: false,
      note: "In active private development — initial FastAPI backend foundation functional locally; GitHub repository and live deployment require confirmation."
    }
  }
];

export default caseStudies;
