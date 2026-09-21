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
  architecture: {
    title: string;
    summary: string;
    stages: { step: string; name: string; detail: string }[];
  };
  features: { title: string; desc: string; tag: string }[];
  metrics: { value: string; label: string }[];
  techStack: { category: string; items: string[] }[];
  testInstructions: string[];
};

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'fast-send': {
    id: 'fast-send',
    tag: 'PROJECT 01 / SMART PHOTO DISCOVERY',
    title: 'FAST SEND.',
    subtitle: 'Smart photo delivery for trips and events. Fast, private, AI-powered.',
    category: 'Computer Vision & Ephemeral Cloud',
    timeline: '2024 — 2025',
    role: 'Lead AI & Full Stack Architect',
    status: 'Ready for Testing',
    liveDemoUrl: 'https://example.com/fast-send-demo', // Placeholder ready for user URL
    repoUrl: 'https://github.com/Abubakarproductdev/fast-send', // Placeholder ready for user URL
    overview:
      'Fast Send re-engineers event photo distribution from the ground up. Instead of manual sorting or chaotic shared drives, attendees scan a single QR code without installing any mobile application. An automated edge AI pipeline recognizes individual faces and delivers private, high-resolution galleries directly to each person.',
    problem:
      'During weddings, group trips, and conferences, attendees take thousands of photographs that are lost across disconnected cloud folders and compressed chat groups. Hosts dread the hours spent manually sorting and sending pictures, while 85% of guests never receive the moments they were part of.',
    solution:
      'Fast Send creates an ephemeral event portal via dynamic QR codes. When a guest scans the code, an encrypted facial vector fingerprint is generated on-device or at the edge. New event photos are indexed against this vector space, and matching albums are securely delivered without requiring account registration or app downloads.',
    architecture: {
      title: 'Real-time Facial Recognition & Ephemeral Delivery Pipeline',
      summary:
        'A microservices workflow built around ultra-fast embeddings, cosine vector clustering, and zero-storage privacy.',
      stages: [
        { step: '01', name: 'QR Session Auth', detail: 'Dynamic QR token establishes an ephemeral guest session without login.' },
        { step: '02', name: 'Face Landmark Embedding', detail: '512-dimensional facial embedding extracted via optimized lightweight model.' },
        { step: '03', name: 'Vector Index Match', detail: 'HNSW vector search queries event photo clusters with cosine similarity > 0.88.' },
        { step: '04', name: 'Private Delivery', detail: 'Personalized gallery generated and delivered via private edge CDN URLs.' },
      ],
    },
    features: [
      {
        title: 'Zero App Installation Required',
        desc: 'Works seamlessly in any mobile browser immediately upon scanning the venue QR code.',
        tag: 'Frictionless UX',
      },
      {
        title: 'AI Facial Clustering',
        desc: 'Advanced face landmark detection identifies guests across lighting changes, angles, and sunglasses.',
        tag: 'Vision AI',
      },
      {
        title: 'Privacy-First Ephemeral Storage',
        desc: 'Facial vectors are encrypted and session keys expire automatically 48 hours post-event.',
        tag: 'Security',
      },
      {
        title: 'Instant High-Res Delivery',
        desc: 'High-speed edge distribution serves uncompressed originals directly to guest devices.',
        tag: 'Cloud CDN',
      },
    ],
    metrics: [
      { value: '100%', label: 'app-free guest access' },
      { value: '< 2.4s', label: 'photo recognition & match time' },
      { value: '99.2%', label: 'positive individual match rate' },
      { value: '48h', label: 'automatic privacy expiry' },
    ],
    techStack: [
      { category: 'AI & Vision', items: ['PyTorch', 'FaceNet', 'Vector Cosine Search', 'OpenCV'] },
      { category: 'Backend & Cloud', items: ['Python', 'FastAPI', 'Redis', 'Docker', 'AWS S3'] },
      { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Web Cam API'] },
      { category: 'Security', items: ['AES-256 Token Auth', 'Ephemeral CDN Links', 'Cloudflare'] },
    ],
    testInstructions: [
      'Click the "Test Live App" button above to launch the web client.',
      'Scan the sample event QR code using your phone camera or use the on-screen camera prompt.',
      'Allow the camera to capture a quick selfie to create your session face embedding.',
      'Watch as test event photographs containing your face are automatically clustered and delivered!',
    ],
  },
  sivo: {
    id: 'sivo',
    tag: 'PROJECT 02 / ACCESSIBILITY & COMPUTER VISION',
    title: 'SIVO.',
    subtitle: 'A Pakistan Sign Language translator built for human connection.',
    category: 'Computer Vision & Assistive Tech',
    timeline: '2024 — 2025',
    role: 'Computer Vision & AI Engineer',
    status: 'Ready for Testing',
    liveDemoUrl: 'https://example.com/sivo-demo', // Placeholder ready for user URL
    repoUrl: 'https://github.com/Abubakarproductdev/sivo', // Placeholder ready for user URL
    overview:
      'SIVO is a bidirectional communication bridge for the deaf and hard-of-hearing community in Pakistan. Powered by real-time computer vision and lightweight neural networks, SIVO translates Pakistan Sign Language (PSL) into synthesized speech and translates spoken responses back into animated sign sequences.',
    problem:
      'Over 1.5 million deaf individuals in Pakistan experience severe communication gaps in hospitals, government offices, and schools due to a critical shortage of certified sign language interpreters (fewer than 50 nationwide). Existing global sign language tools fail to recognize PSL gestures, dialectal variations, and local idioms.',
    solution:
      'SIVO employs MediaPipe hand landmark tracking and spatial-temporal neural networks running in real-time on edge devices. By mapping 21 hand keypoints and body posture coordinates rather than raw video frames, SIVO achieves 90% accuracy while cutting CPU and battery usage by 70%, allowing it to run smoothly on budget smartphones.',
    architecture: {
      title: 'Lightweight Spatial-Temporal Gesture Recognition Pipeline',
      summary:
        'Coordinate-based deep learning pipeline translating dynamic hand kinematics into synthesized audio and text.',
      stages: [
        { step: '01', name: 'Landmark Extraction', detail: 'Real-time 21-point hand + 33-point pose keypoint extraction at 30 FPS.' },
        { step: '02', name: 'Spatial Normalization', detail: 'Coordinates centered relative to wrist and scaled invariant to distance.' },
        { step: '03', name: 'Temporal LSTM Classifier', detail: 'Sequential neural model predicts PSL gesture sequence and grammar.' },
        { step: '04', name: 'Urdu Speech Synthesis', detail: 'Text-to-speech engine renders spoken audio response with natural intonation.' },
      ],
    },
    features: [
      {
        title: 'Real-Time PSL Translation',
        desc: 'Translates continuous Pakistani sign language gestures into clear audio and text with sub-100ms latency.',
        tag: 'Real-Time AI',
      },
      {
        title: 'Bidirectional Voice-to-Sign',
        desc: 'Listens to spoken Urdu and English and renders clear visual sign illustrations for the deaf user.',
        tag: 'Bidirectional',
      },
      {
        title: 'Low-Power Edge Processing',
        desc: 'Extracts coordinates on-device without streaming heavy raw video to cloud servers.',
        tag: '70% Less CPU',
      },
      {
        title: 'Custom PSL Dataset',
        desc: 'Curated and annotated with local deaf community members across essential daily conversational domains.',
        tag: 'Community Driven',
      },
    ],
    metrics: [
      { value: '90%', label: 'gesture recognition accuracy' },
      { value: '70%', label: 'reduction in mobile CPU usage' },
      { value: '< 95ms', label: 'end-to-end inference latency' },
      { value: '1.5M+', label: 'community members addressed' },
    ],
    techStack: [
      { category: 'AI & ML', items: ['TensorFlow', 'MediaPipe', 'LSTM Neural Nets', 'OpenCV'] },
      { category: 'Audio & NLP', items: ['SpeechRecognition', 'Urdu TTS', 'pyttsx3'] },
      { category: 'Application', items: ['Python', 'Flask Cloud Engine', 'React Native', 'TypeScript'] },
      { category: 'Deployment', items: ['Docker', 'Azure VM', 'Edge ONNX Runtime'] },
    ],
    testInstructions: [
      'Click the "Test Live App" button above to access the SIVO interactive interface.',
      'Enable your webcam or camera when prompted.',
      'Perform sample signs (e.g. "Salam", "Shukriya", "Madad") in front of the camera.',
      'Observe the real-time hand skeleton overlay and listen to the instant synthesized Urdu audio output!',
    ],
  },
  boostwork: {
    id: 'boostwork',
    tag: 'PROJECT 03 / AI SAAS & ANALYTICS',
    title: 'BOOSTWORK.',
    subtitle: 'An AI proposal generator and Upwork performance tracker.',
    category: 'Agentic LLMs & Freelancer Growth',
    timeline: '2025 — PRESENT',
    role: 'Full Stack Creator & Product Engineer',
    status: 'Ready for Testing',
    liveDemoUrl: 'https://example.com/boostwork-demo', // Placeholder ready for user URL
    repoUrl: 'https://github.com/Abubakarproductdev/boostwork', // Placeholder ready for user URL
    overview:
      'BoostWork transforms how technical freelancers and agencies compete on Upwork. Instead of sending generic AI templates, BoostWork deploys an agentic workflow that analyzes client hire history, evaluates unstated project bottlenecks, crafts tailor-made value-first proposals, and tracks conversion analytics to maximize client reply rates.',
    problem:
      'Freelancers and agency teams spend 2 to 4 hours daily sifting through job boards and writing personalized proposals. Generic AI tools produce sterile, detectable cover letters that get rejected, while platform Connects become increasingly expensive with average reply rates hovering below 12%.',
    solution:
      'BoostWork combines RFP parsing, past client feedback mining, and calibrated prompt chains. It diagnoses the exact pain point hidden inside a job post, highlights past shipped proof-of-work, and generates high-converting opening hooks that prompt client replies, increasing win rates by 60%.',
    architecture: {
      title: 'Agentic LangGraph Proposal Intelligence Engine',
      summary:
        'Multi-agent pipeline that ingests client post metadata, interrogates client review patterns, and structures high-conversion proposals.',
      stages: [
        { step: '01', name: 'RFP Deep Ingestion', detail: 'Extracts job scope, tech stack, client rating, and spending patterns.' },
        { step: '02', name: 'Pain Point Synthesis', detail: 'LangGraph agent analyzes past reviews to identify client communication preferences.' },
        { step: '03', name: 'Tailored Hook Generation', detail: 'LLM crafts custom 3-line attention hooks targeting the exact technical hurdle.' },
        { step: '04', name: 'Analytics & Win-Rate Tracker', detail: 'Tracks sent proposals, interviews won, and Connects ROI over time.' },
      ],
    },
    features: [
      {
        title: 'Agentic Proposal Crafting',
        desc: 'Avoids canned templates by tailoring technical solutions directly to the client specific codebase dilemma.',
        tag: 'Agentic AI',
      },
      {
        title: 'Client Pattern Recognition',
        desc: 'Analyzes client past hire history and reviewer comments to match tone, budget expectations, and urgency.',
        tag: 'Deep Insights',
      },
      {
        title: 'Connects Conservation & ROI',
        desc: 'Calculates job feasibility score before you apply, eliminating wasted Connects on low-probability posts.',
        tag: 'Analytics',
      },
      {
        title: 'Performance CRM & Analytics',
        desc: 'Comprehensive dashboard reporting reply rates, interview transitions, and revenue per proposal sent.',
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
      { category: 'AI & Agents', items: ['LangGraph', 'OpenAI API', 'Vector Retrieval', 'Prompt Chains'] },
      { category: 'Full Stack', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
      { category: 'Database & Auth', items: ['PostgreSQL', 'Prisma ORM', 'NextAuth', 'Redis'] },
      { category: 'Analytics', items: ['Recharts', 'Conversion Tracking API', 'Vercel Edge'] },
    ],
    testInstructions: [
      'Click the "Test Live App" button above to launch the BoostWork demo dashboard.',
      'Paste any sample Upwork job URL or RFP description into the prompt box.',
      'Select your target freelancer profile and technical specialization.',
      'Click "Generate Proposal" to inspect the synthesized client diagnosis, opening hook, and structured proposal pitch!',
    ],
  },
};
