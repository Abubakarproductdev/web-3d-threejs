export type ProjectDetail = {
  id: 'fast-send' | 'sivo' | 'boostwork';
  tag: string;
  title: string;
  subtitle: string;
  category: string;
  timeline: string;
  role: string;
  status: string;
  liveDemoUrl: string;
  repoUrl: string;
  overview: string;
  problem: string;
  solution: string;
  principles?: { name: string; desc: string }[];
  architecture: {
    title: string;
    summary: string;
    stages: { step: string; name: string; detail: string }[];
  };
  features: { title: string; desc: string; tag: string }[];
  metrics: { value: string; label: string }[];
  techStack: { category: string; items: string[] }[];
  resilience?: { scenario: string; solution: string }[];
  testInstructions: string[];
};

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'fast-send': {
    id: 'fast-send',
    tag: 'PROJECT 01 / MOBILE AI & EPHEMERAL DELIVERY',
    title: 'FAST SEND.',
    subtitle: 'Trip-scoped photo collection → face-matched personal galleries → WhatsApp delivery.',
    category: 'Mobile AI, Face Embeddings & Messaging Distribution',
    timeline: '2024 — 2025',
    role: 'Lead AI & Full Stack Mobile Architect',
    status: 'Architecture & Engine Built',
    liveDemoUrl: 'https://github.com/Abubakarproductdev/fast-send',
    repoUrl: 'https://github.com/Abubakarproductdev/fast-send',
    overview:
      'FASTSEND is an end-to-end event photo distribution system engineered for iPhone (organizer + photo-taking attendees) and any modern browser (guest registration and personal galleries). By combining a foreground delta scanner, background URLSession original transfers, MongoDB document storage, and an insightface AI pipeline, Fast Send replaces messy group chats and manual sorting with personalized, face-matched gallery delivery directly over WhatsApp.',
    problem:
      'During weddings, trips, and conferences, attendees capture thousands of photos that get lost across fragmented cloud drives and compressed messaging groups. Organizers dread hours spent manually identifying guests, iOS strictly limits autonomous background photo scanning, browsers cannot natively render iPhone HEIC/HEVC files, and WhatsApp templates require strict pre-approved opt-in compliance.',
    solution:
      'Fast Send implements a robust three-tier media architecture (Proxy → Original → Web Derivative) powered by MongoDB and AWS S3. Guests register via trip QR codes with a single solo selfie; an asynchronous FastAPI and Celery worker fleet extracts 512D facial vectors using insightface (buffalo_l), matches attendee faces at a generous 0.5 storage floor, decodes HEIC originals via pillow-heif into browser-safe WebP/JPEGs, and triggers WhatsApp template delivery with an instant on-screen web gallery fallback.',
    principles: [
      {
        name: 'Nothing Silent',
        desc: 'Every upload action is either user-confirmed (tap-to-push) or transparently system-visible via background URLSession transfers, ensuring strict compliance with iOS App Store review guidelines.',
      },
      {
        name: 'Three-Tier Media Pipeline',
        desc: 'Proxy (1080px JPEG, instant matching) → Original (archival Wi-Fi upload) → Web Derivative (browser-safe JPEG/WebP). Never serve raw HEIC/MOV to a generic web browser.',
      },
      {
        name: 'Everything Is Retry-able',
        desc: 'Every step writes status to durable local SQLite on device and MongoDB on backend before advancing; network drops or process kills resume seamlessly from the last state.',
      },
      {
        name: 'Decoupled Threshold & Storage Floor',
        desc: 'Matches are stored generously down to a 0.5 confidence floor; strict 0.65 cutoffs are applied at query/gallery time so matching logic can be retuned without re-running heavy ML.',
      },
      {
        name: 'Graceful Degradation Everywhere',
        desc: 'If face matching, scene classification, or derivative transcoding fails, attendees still receive the full unsorted album or original file download rather than an error dead-end.',
      },
    ],
    architecture: {
      title: 'Distributed Asynchronous Face-Matching & Delivery Architecture',
      summary:
        'Decoupled microservice topology connecting React Native iOS clients, FastAPI REST endpoints, Celery + Redis task queues, insightface ML workers, MongoDB storage, and Twilio WhatsApp distribution.',
      stages: [
        {
          step: '01',
          name: 'QR Guest Registration & Selfie Embedding',
          detail: 'Guest scans trip QR code in any browser, provides phone number and solo selfie. FastAPI extracts 512D face vector via insightface. Attendee document is saved in MongoDB and a personal gallery link is rendered immediately on-screen as an instant fallback.',
        },
        {
          step: '02',
          name: 'Capture, Push Reminders & Delta Scanning',
          detail: 'Organizer initiates trip in React Native app. APNs push notifications or local triggers prompt organizer to push photos. App diffs PHAsset library against local SQLite queue, generates 1080px proxies, and queues originals for background URLSession Wi-Fi transfers.',
        },
        {
          step: '03',
          name: 'Asynchronous ML Matching & MongoDB Staging',
          detail: 'Celery worker downloads proxy from S3 (/proxies), classifies scene nature flags, extracts face vectors via insightface (buffalo_l), calculates cosine similarity against MongoDB attendee embeddings, and inserts match records with raw confidence scores.',
        },
        {
          step: '04',
          name: 'High-Res Arrival & Web Derivative Generation',
          detail: 'When original HEIC/MOV arrives via background URLSession in S3 (/originals), worker decodes HEIC via pillow-heif and transcodes video via ffmpeg to H.264 MP4, publishing browser-optimized derivatives to S3 (/web) fronted by CloudFront CDN.',
        },
        {
          step: '05',
          name: 'End of Trip WhatsApp Delivery Service',
          detail: 'Organizer taps "End Trip". Distribution service resolves attendee gallery preferences (mine_only, mine_and_nature, all) and media filters, dispatching approved Twilio WhatsApp template messages with dynamic personal gallery links.',
        },
      ],
    },
    features: [
      {
        title: 'Two-Tier Push Architecture',
        desc: 'Fast 1080px proxy upload over mobile data for instant ML matching, paired with OS-managed background URLSession for pristine HEIC originals.',
        tag: 'iOS Engineering',
      },
      {
        title: 'Offline SQLite Upload Queue',
        desc: 'Local SQLite database tracks idempotent asset state by device_local_id, surviving app kills and intermittent cell towers without duplicate uploads.',
        tag: 'Durable State',
      },
      {
        title: 'InsightFace Vector Clustering',
        desc: 'State-of-the-art buffalo_l deep embedding model detects faces across angles, lighting shifts, and accessories with cosine similarity search.',
        tag: 'Vision AI',
      },
      {
        title: 'HEIC & HEVC Transcoding Engine',
        desc: 'Automated server-side conversion of iPhone HEIC/MOV formats into cross-browser WebP, JPEG, and H.264 MP4 derivatives.',
        tag: 'Media Pipeline',
      },
      {
        title: 'Twilio WhatsApp API Integration',
        desc: 'Pre-approved Meta templates deliver private gallery links directly to guest WhatsApp accounts with verified opt-in compliance.',
        tag: 'Messaging',
      },
      {
        title: 'MongoDB Document Storage',
        desc: 'Flexible NoSQL document model storing Trip, Attendee, MediaAsset, and Match collections with high read throughput and vector index scalability.',
        tag: 'Database',
      },
    ],
    metrics: [
      { value: '100%', label: 'browser-safe derivatives (0 raw HEIC)' },
      { value: '< 2.4s', label: 'proxy face embedding & match time' },
      { value: '18', label: 'resilience failure modes handled' },
      { value: '0', label: 'data loss on app kill via SQLite queue' },
    ],
    techStack: [
      { category: 'Mobile (iOS)', items: ['React Native', 'expo-media-library', 'expo-file-system', 'Local SQLite Queue', 'Background URLSession', 'APNs Push'] },
      { category: 'Backend API & Workers', items: ['Python', 'FastAPI', 'Celery', 'Redis', 'Pydantic'] },
      { category: 'AI & Media Pipeline', items: ['insightface (buffalo_l)', 'Scene Classifier CNN', 'pillow-heif (HEIC decode)', 'ffmpeg (H.264 transcode)', 'OpenCV'] },
      { category: 'Database & Storage', items: ['MongoDB (NoSQL Document Store)', 'AWS S3 (/proxies, /originals, /web)', 'CloudFront CDN'] },
      { category: 'Guest Frontend & Delivery', items: ['React', 'TypeScript', 'Tailwind CSS', 'Twilio WhatsApp Business API'] },
    ],
    resilience: [
      {
        scenario: 'iOS forbids silent background upload',
        solution: 'Notification-triggered foreground sync on tap + OS-managed background URLSession transfers.',
      },
      {
        scenario: 'Guest browser cannot render HEIC',
        solution: 'Server decodes HEIC via pillow-heif to WebP/JPEG under S3 /web; raw HEIC kept solely for optional archival download.',
      },
      {
        scenario: 'App force-quit mid-queue',
        solution: 'Local SQLite queue persists asset states across process kills; resumes automatically upon next launch or reminder.',
      },
      {
        scenario: 'WhatsApp delivery fails or throttles',
        solution: 'Personal gallery link is generated and displayed on-screen immediately upon QR registration, eliminating WhatsApp as a single point of failure.',
      },
      {
        scenario: 'Bystander faces in group photos',
        solution: 'Only registered attendee embeddings are persisted; bystander vectors are evaluated transiently during matching and discarded.',
      },
      {
        scenario: 'Duplicate upload tap',
        solution: 'Unique constraint on (trip_id, device_local_id) makes every database insertion completely idempotent.',
      },
    ],
    testInstructions: [
      'Click "View Source Repo" above to inspect the React Native mobile client and FastAPI backend code.',
      'Review the Attendee Registration sequence: scan QR, capture solo selfie, and observe instant gallery link creation.',
      'Test the dual-tier upload model: immediate 1080px JPEG proxy push followed by background URLSession transfer for originals.',
      'Inspect the Celery task queue extracting insightface vectors and indexing match results into MongoDB.',
    ],
  },

  sivo: {
    id: 'sivo',
    tag: 'PROJECT 02 / ACCESSIBILITY & COMPUTER VISION',
    title: 'SIVO.',
    subtitle: 'Bidirectional Pakistan Sign Language translator built for human connection.',
    category: 'Computer Vision, Assistive Tech & Edge Neural Networks',
    timeline: '2024 — 2025',
    role: 'Computer Vision & Mobile AI Engineer',
    status: 'Live Backend & Standalone APK',
    liveDemoUrl: 'https://speechtosign-dkcxagh5bhfrdwd2.centralindia-01.azurewebsites.net',
    repoUrl: 'https://github.com/Abubakarproductdev/sivo',
    overview:
      'SIVO is a bidirectional translation system that bridges the communication divide between Pakistan\'s 1.5 million hearing-impaired individuals and the general public. Built with a React Native / Expo mobile application, a high-performance Python/Flask AI backend hosted on Azure App Services (Central India), and Firebase cloud services, SIVO converts Pakistan Sign Language (PSL) into synthesized speech and translates spoken responses back into seamless sign language video playback.',
    problem:
      'Over 1.5 million deaf individuals in Pakistan experience severe communication barriers in hospitals, banks, and schools due to a critical shortage of certified sign language interpreters (fewer than 50 nationwide). Existing global sign language tools do not understand PSL gestures or local syntax, while streaming continuous raw video to cloud servers consumes excessive mobile data and quickly drains phone batteries.',
    solution:
      'SIVO implements a dual-pipeline architecture optimized for mobile devices. In Sign-to-Speech mode, Google MediaPipe Holistic extracts 543 spatial coordinates across hands, face, and posture. A 30-frame temporal window normalizes distances before an LSTM neural network (psl_model_v3.h5) and custom NLP grammar engine (nlp_weights.bin) translate gestures into fluent speech. In Speech-to-Sign mode, speech is mapped to 40+ offline sign videos bundled directly inside the Android APK, utilizing a dual-player ping-pong engine for gapless, zero-latency sentence playback.',
    principles: [
      {
        name: 'Offline-First Video Bundling',
        desc: 'Over 40 .mp4 sign language videos are bundled directly inside the Android APK via expo-asset, dynamically extracted to native file cache so Speech-to-Sign requires zero network latency.',
      },
      {
        name: 'Dual-Player Ping-Pong Engine',
        desc: 'Two hidden expo-av video components alternate seamlessly: while Video A plays, Video B preloads the next word, achieving gapless conversational sentence reconstruction.',
      },
      {
        name: 'Coordinate-Only Deep Learning',
        desc: 'Transmits 543 normalized landmark coordinates rather than raw video frames, slashing mobile CPU usage by 70% and ensuring smooth operation on low-cost smartphones.',
      },
      {
        name: 'NLP Grammar Reconstruction',
        desc: 'Converts raw detected sign keywords (e.g., "I", "Go", "Home") into natural, grammatically correct spoken sentences (e.g., "I am going home") via calibrated NLP weights.',
      },
      {
        name: 'Strict Version Integrity',
        desc: 'Over-The-Air (OTA) updates are disabled in app.json to guarantee the standalone APK firmly relies on its bundled native code and assets, preventing accidental downgrades.',
      },
    ],
    architecture: {
      title: 'Bidirectional Spatial-Temporal Gesture Recognition & Video Synthesis',
      summary:
        'Hybrid edge-cloud architecture connecting React Native (Expo) on Android, Python/Flask on Azure App Services, MediaPipe Holistic, TensorFlow LSTM, and Firebase Firestore.',
      stages: [
        {
          step: '01',
          name: 'MediaPipe Holistic Landmark Extraction',
          detail: 'Google MediaPipe Holistic model extracts 543 spatial coordinates (21 hand landmarks per hand, 33 body pose points, 468 facial mesh keypoints) per frame at 30 FPS.',
        },
        {
          step: '02',
          name: 'Temporal Windowing & Spatial Normalization',
          detail: 'Aggregates coordinates across 30 sequential frames, normalizing keypoint coordinates relative to wrist anchors to make inference invariant to camera distance and user positioning.',
        },
        {
          step: '03',
          name: 'LSTM Neural Model Gesture Prediction',
          detail: 'The normalized 30-frame sequence is fed into an LSTM deep learning model (psl_model_v3.h5) on Azure App Services, identifying the sign gesture and outputting raw keyword tokens.',
        },
        {
          step: '04',
          name: 'Custom NLP Grammar Correction',
          detail: 'A specialized NLP algorithm (nlp_weights.bin) evaluates keyword sequences and synthesizes grammatically complete, conversational Urdu/English sentences.',
        },
        {
          step: '05',
          name: 'Speech-to-Sign Offline Video Ping-Pong',
          detail: 'Spoken audio is transcribed via Expo native speech recognition, mapped via VideoDictionary.js, and rendered through alternating expo-av video components with zero buffering.',
        },
      ],
    },
    features: [
      {
        title: 'Sign-to-Speech Pipeline',
        desc: 'Live camera tracking converts dynamic PSL hand gestures and facial expressions into spoken Urdu/English audio in real time.',
        tag: 'Gesture AI',
      },
      {
        title: 'Speech-to-Sign Engine',
        desc: 'Translates spoken voice input into fluid sign language sequences using bundled offline MP4 video clips.',
        tag: 'Bidirectional',
      },
      {
        title: 'Offline Video Dictionary (40+ Videos)',
        desc: 'Bundled APK video assets loaded dynamically via expo-asset to native cache, operating without internet dependency.',
        tag: 'Zero Latency',
      },
      {
        title: 'Ping-Pong Video Player',
        desc: 'Dual-player architecture preloads upcoming sign clips while current clip plays, preventing stutter and pauses between words.',
        tag: 'Seamless UX',
      },
      {
        title: 'Custom Stack Navigation & App.js Router',
        desc: 'Lightweight stack-based navigation avoiding heavy third-party routing libraries, providing full control over the Android hardware back button.',
        tag: 'Mobile Performance',
      },
      {
        title: 'ChatContext & Firebase Firestore Sync',
        desc: 'Global state manager syncing real-time conversations, user metadata, and historical translation logs to Firebase Firestore collections.',
        tag: 'Cloud Sync',
      },
    ],
    metrics: [
      { value: '90%', label: 'gesture recognition accuracy' },
      { value: '70%', label: 'reduction in mobile CPU usage' },
      { value: '543', label: 'spatial landmarks tracked per frame' },
      { value: '40+', label: 'offline sign videos bundled in APK' },
    ],
    techStack: [
      { category: 'Frontend Mobile (Android)', items: ['React Native', 'Expo Framework', 'expo-asset', 'expo-av (Ping-Pong Player)', 'ChatContext', 'ThemeContext', 'AsyncStorage'] },
      { category: 'AI & Backend Cloud', items: ['Python', 'Flask', 'Azure App Services (Central India)', 'Google MediaPipe Holistic', 'TensorFlow / Keras LSTM (psl_model_v3.h5)'] },
      { category: 'NLP & Audio', items: ['Custom NLP Engine (nlp_weights.bin)', 'Expo Speech Recognition', 'pyttsx3 / gTTS'] },
      { category: 'Database & Services', items: ['Firebase Authentication', 'Cloud Firestore (users, conversations)', 'Vercel (Landing & APK distribution)'] },
      { category: 'Build & Release', items: ['Expo Application Services (EAS Build)', 'Standalone Android APK', 'Disabled OTA Updates (Version Lock)'] },
    ],
    testInstructions: [
      'Access the live Azure App Service backend at speechtosign-dkcxagh5bhfrdwd2.centralindia-01.azurewebsites.net.',
      'In Sign-to-Speech mode, present sign gestures to camera to verify 543-keypoint MediaPipe extraction and LSTM grammar synthesis.',
      'In Speech-to-Sign mode, speak test phrases to watch the dual-player ping-pong video player assemble bundled sign clips with zero buffering.',
      'Inspect historical conversation persistence in Cloud Firestore under the conversations collection.',
    ],
  },

  boostwork: {
    id: 'boostwork',
    tag: 'PROJECT 03 / AGENTIC LLMS & SAAS',
    title: 'BOOSTWORK.',
    subtitle: 'An AI proposal generator and Upwork performance tracker.',
    category: 'Agentic LLMs & Freelancer Growth SaaS',
    timeline: '2025 — PRESENT',
    role: 'Full Stack Creator & Product Engineer',
    status: 'Live SaaS Platform',
    liveDemoUrl: 'https://boost-working.vercel.app/write',
    repoUrl: 'https://github.com/Abubakarproductdev/boostwork',
    overview:
      'BoostWork transforms how freelancers and technical agencies win high-value contracts on Upwork. Rather than outputting detectable, generic AI cover letters, BoostWork deploys an agentic workflow that interrogates client hire history, uncovers hidden technical bottlenecks inside job posts (RFPs), crafts tailor-made opening hooks that prove competence, and tracks Connects ROI and proposal win-rate analytics.',
    problem:
      'Freelancers spend 2 to 4 hours every day manually writing proposals or spraying bland AI templates that get rejected. Meanwhile, platform Connects prices have skyrocketed and average freelancer reply rates linger below 12%, resulting in drained budgets and missed client opportunities.',
    solution:
      'BoostWork combines RFP parsing, past client feedback mining, and calibrated prompt chains. It diagnoses the exact pain point hidden inside a job post, highlights past shipped proof-of-work, and generates high-converting opening hooks that prompt client replies, increasing win rates to 60% and reducing wasted Connects by 45%. You can test the live proposal generator directly at https://boost-working.vercel.app/write.',
    principles: [
      {
        name: 'Value-First Technical Hooks',
        desc: 'Eliminates introductory fluff ("Dear Hiring Manager") in favor of immediate technical diagnosis and shipped proof-of-work in the opening 2 lines.',
      },
      {
        name: 'Client Review Mining',
        desc: 'Interrogates past freelancer reviews and client hire patterns to identify unstated technical dilemmas, tone preferences, and budget expectations.',
      },
      {
        name: 'Connects Conservation First',
        desc: 'Scores job post feasibility before applying, warning freelancers away from low-conversion or ghost job posts to protect expensive Connects.',
      },
      {
        name: 'Full Loop Conversion Tracking',
        desc: 'Links generated proposals directly to client replies, interviews, and contracts won, turning proposal drafting into data-driven iteration.',
      },
    ],
    architecture: {
      title: 'Agentic LangGraph Proposal Intelligence & Conversion Engine',
      summary:
        'Multi-agent pipeline that ingests client post metadata, interrogates client review patterns, and structures high-conversion technical proposals.',
      stages: [
        {
          step: '01',
          name: 'RFP Deep Ingestion',
          detail: 'Extracts job scope, tech stack requirements, client hire rating, average hourly rate paid, and spending patterns from Upwork posts.',
        },
        {
          step: '02',
          name: 'Pain Point & Review Synthesis',
          detail: 'LangGraph agent analyzes past reviews left by previous freelancers on the client profile to identify communication preferences and project bottlenecks.',
        },
        {
          step: '03',
          name: 'Tailored Hook Generation',
          detail: 'Calibrated LLM prompt chains craft custom 3-line attention hooks addressing the exact codebase hurdle without generic filler.',
        },
        {
          step: '04',
          name: 'Analytics & Win-Rate Tracker',
          detail: 'Comprehensive CRM tracks submitted proposals, interview conversion rates, and Connects ROI to maximize monthly contract value.',
        },
      ],
    },
    features: [
      {
        title: 'Live Interactive Proposal Writer',
        desc: 'Full-featured web workspace deployed at https://boost-working.vercel.app/write for instant proposal drafting and customization.',
        tag: 'Live Product',
      },
      {
        title: 'Agentic Client Pattern Recognition',
        desc: 'Analyzes client past hires and reviews to match exact communication tone, technical depth, and urgency expectations.',
        tag: 'LangGraph AI',
      },
      {
        title: 'Connects Conservation & ROI Scorer',
        desc: 'Evaluates job feasibility and client hiring velocity to prevent wasting costly platform Connects on ghost posts.',
        tag: 'ROI Optimization',
      },
      {
        title: 'Performance CRM & Win-Rate Analytics',
        desc: 'Comprehensive dashboard reporting reply rates, interview transitions, and revenue generated per proposal sent.',
        tag: 'Full Stack SaaS',
      },
    ],
    metrics: [
      { value: '60%', label: 'reported client reply rate' },
      { value: '45%', label: 'reduction in wasted Connects' },
      { value: '3.8x', label: 'faster proposal turnaround' },
      { value: '100%', label: 'customized technical hooks' },
    ],
    techStack: [
      { category: 'AI & Multi-Agent Workflows', items: ['LangGraph', 'OpenAI GPT-4o', 'Prompt Chains', 'Vector Retrieval', 'Context Distillation'] },
      { category: 'Full-Stack Web', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
      { category: 'Database & Auth', items: ['MongoDB / PostgreSQL', 'Prisma ORM / Mongoose', 'NextAuth', 'Redis'] },
      { category: 'Analytics & Cloud', items: ['Vercel Edge Platform', 'Recharts', 'Conversion Tracking API'] },
    ],
    testInstructions: [
      'Click "LAUNCH LIVE DEMO" or navigate directly to https://boost-working.vercel.app/write.',
      'Paste any sample Upwork job post or RFP into the writing interface.',
      'Select your freelancer specialization, target rate, and portfolio highlights.',
      'Click "Generate Proposal" to inspect the synthesized client diagnosis, opening hook, and structured pitch in real time!',
    ],
  },
};
