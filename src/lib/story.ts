export const PALETTE = {
  paper: '#f6f5ef',
  white: '#fffef8',
  orange: '#f15a24',
  ink: '#242520',
  stone: '#d9d7cc',
} as const;

export type Chapter = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  progress: number;
  chapterNarration: string;
  duration: number;
  startTime: number;
  endTime: number;
  narrationSrc?: string;
};

export const chapters: Chapter[] = [
  {
    id: 'beginning',
    number: '01',
    title: 'The beginning',
    subtitle: 'A name. A room. A little curiosity.',
    progress: 0,
    chapterNarration: 'I am Muhammad Abubakar. A software engineer, and a builder by nature.',
    duration: 22,
    startTime: 0,
    endTime: 22,
  },
  {
    id: 'a-thought-takes-shape',
    number: '02',
    title: 'A thought takes shape',
    subtitle: 'From what if, to what comes next.',
    progress: 0.15,
    chapterNarration: 'A question. A little exploration. Something useful.',
    duration: 16,
    startTime: 22,
    endTime: 38,
  },
  {
    id: 'fast-send',
    number: '03',
    title: 'Fast Send',
    subtitle: 'Smart photo delivery for trips and events.',
    progress: 0.30,
    chapterNarration: 'Guests scan a code. No app. The right photos find the right people.',
    duration: 20,
    startTime: 38,
    endTime: 58,
  },
  {
    id: 'sivo',
    number: '04',
    title: 'SIVO',
    subtitle: 'Pakistan Sign Language, translated with care.',
    progress: 0.43,
    chapterNarration: 'A hand becomes language. Language becomes a voice that includes everyone.',
    duration: 20,
    startTime: 58,
    endTime: 78,
  },
  {
    id: 'boostwork',
    number: '05',
    title: 'BoostWork',
    subtitle: 'Proposals that learn. Work that wins.',
    progress: 0.55,
    chapterNarration: 'A blank page learns how to speak for the work behind it.',
    duration: 18,
    startTime: 78,
    endTime: 96,
  },
  {
    id: 'experience',
    number: '06',
    title: 'Where I have worked',
    subtitle: 'Three rooms. Three ways of learning.',
    progress: 0.64,
    chapterNarration: 'Internships, freelance work, and the discipline of shipping.',
    duration: 20,
    startTime: 96,
    endTime: 116,
  },
  {
    id: 'skills',
    number: '07',
    title: 'What I know',
    subtitle: 'The tools behind the useful things.',
    progress: 0.77,
    chapterNarration: 'Backend, data, cloud, intelligence, interfaces, and the walls that protect them.',
    duration: 18,
    startTime: 116,
    endTime: 134,
  },
  {
    id: 'finale',
    number: '08',
    title: "Where I'm going",
    subtitle: 'The next useful thing.',
    progress: 0.91,
    chapterNarration: 'Curious mind. Useful things. The next idea could be yours.',
    duration: 18,
    startTime: 134,
    endTime: 152,
  },
];

export type WorldState = {
  progress: number;
  entrance: number;
  cameraPush: number;
  cameraReturn: number;
  unfold: number;
  turn: number;
  paperLift: number;
  spark: number;
  journey: number;
  pointerX: number;
  pointerY: number;
  velocity: number;
};

export const initialWorldState = (): WorldState => ({
  progress: 0,
  entrance: 0,
  cameraPush: 0,
  cameraReturn: 0,
  unfold: 0,
  turn: 0,
  paperLift: 0,
  spark: 0,
  journey: 0,
  pointerX: 0,
  pointerY: 0,
  velocity: 0,
});

export const CONTACT = {
  email: 'sshaiy2255@gmail.com',
  phone: '+923275887747',
  portfolio: 'Abubakarproductdev',
};

export const PROJECTS = {
  fastSend: {
    tag: 'PROJECT 01 / FAST SEND',
    title: 'FAST SEND.',
    statement: 'Trip-scoped photo collection → face-matched personal galleries → WhatsApp delivery.',
    beats: [
      'Trip-scoped photo collection & face matching.',
      'Three-tier pipeline (Proxy → Original → Web).',
      'Offline SQLite queue + background URLSession.',
      'WhatsApp delivery + instant web fallback.',
    ],
    tech: ['React Native iOS', 'FastAPI', 'insightface', 'MongoDB & S3', 'Twilio WhatsApp'],
    metrics: [
      { value: '100%', label: 'browser-safe derivatives (0 raw HEIC)' },
      { value: '< 2.4s', label: 'face embedding & match time' },
    ],
  },
  sivo: {
    tag: 'PROJECT 02 / SIVO',
    title: 'SIVO.',
    statement: 'A Pakistan Sign Language translator built for human connection.',
    beats: [
      'MediaPipe Holistic 543-landmark tracking.',
      'LSTM gesture recognition + custom NLP grammar.',
      'Offline 40+ video ping-pong player in APK.',
      'Python/Flask on Azure + Firebase Firestore.',
    ],
    tech: ['React Native (Expo)', 'MediaPipe Holistic', 'TensorFlow LSTM', 'Flask on Azure', 'Firebase'],
    metrics: [
      { value: '90%', label: 'gesture recognition accuracy' },
      { value: '70%', label: 'reduction in mobile CPU usage' },
    ],
  },
  boost: {
    tag: 'PROJECT 03 / BOOSTWORK',
    title: 'BOOSTWORK.',
    statement: 'An AI proposal generator and Upwork performance tracker. Live at boost-working.vercel.app/write.',
    beats: [
      'A blank document learns to speak.',
      'Agentic client hire pattern & review mining.',
      'Tailored value hooks that boost reply rates by 60%.',
      'Connects ROI optimization and win-rate insights.',
    ],
    tech: ['Full-stack AI SaaS', 'LangGraph Agents', 'OpenAI GPT-4o', 'Next.js & Vercel'],
    metrics: [
      { value: '60%', label: 'reported client reply rate' },
      { value: '45%', label: 'reduction in wasted Connects' },
    ],
  },
} as const;

export const EXPERIENCES = [
  {
    no: 'CHAPTER 01',
    place: 'EZITECH',
    role: 'AI / MACHINE LEARNING INTERN',
    date: '2025',
    note: 'Learning how intelligent systems are trained, tested, and trusted.',
  },
  {
    no: 'CHAPTER 02',
    place: 'ARZENS PVT LTD',
    role: 'AI AUTOMATION / SECURITY ENGINEER INTERN',
    date: '2026',
    note: 'Automation that moves fast, with security built in from the start.',
  },
  {
    no: 'CHAPTER 03',
    place: 'UPWORK',
    role: 'FULL STACK / AI SOLUTIONS',
    date: '2024 — PRESENT',
    note: 'Freelancing in full stack development and AI solutions, shipped with clients.',
  },
] as const;

export const SKILLS = [
  { group: 'BACKEND', items: ['Python', 'FastAPI', 'Next.js'], note: 'The machinery underneath.' },
  { group: 'DATABASE', items: ['MongoDB', 'PostgreSQL'], note: 'Stored memories, layered well.' },
  { group: 'CLOUD', items: ['Azure VMs', 'Oracle', 'Docker', 'Kubernetes'], note: 'The weather around everything.' },
  { group: 'AI', items: ['LangGraph', 'Vector DBs', 'Small LLMs'], note: 'An intelligence that evolves.' },
  { group: 'FRONTEND', items: ['React', 'React Native'], note: 'The visible surface.' },
  { group: 'SECURITY', items: ['Cloudflare'], note: 'Protective architecture.' },
] as const;

export const CERTIFICATIONS = [
  'Cloud Infrastructure and AI Foundations — Oracle',
  'Python for Full Stack — Coursera',
] as const;

export const EDUCATION = {
  degree: "BACHELOR'S IN SOFTWARE ENGINEERING",
  school: 'Capital University of Science and Technology',
  dates: '2022 - 2026',
} as const;
