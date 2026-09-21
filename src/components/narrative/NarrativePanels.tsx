import type { ReactNode } from 'react';
import { SparkIcon } from '../ui/Icons';

export function NarrativePanel({ className, children, label }: { className: string; children: ReactNode; label: string }) {
  return <article className={`narrative-panel ${className}`} aria-label={label}><div className="panel-inner">{children}</div></article>;
}

export default function NarrativePanels({ reading = false }: { reading?: boolean }) {
  return <div className={`narrative-panels${reading ? ' is-readable' : ''}`}>
    <NarrativePanel className="panel-question" label="First, a question">
      <span className="panel-number">A QUESTION</span>
      <h2>WHAT<br />IF<span>?</span></h2>
      <svg className="question-sketch" viewBox="0 0 240 120" fill="none" aria-hidden="true">
        <path d="M13 103 117 55l107 29-101 27-110-8Z" fill="#f6f5ef" stroke="#242520" strokeWidth="1.3" />
        <path d="M75 82V33L123 7v61L75 82Z" fill="#f6f5ef" stroke="#242520" strokeWidth="1.3" />
        <path d="M93 75V42c0-13 18-24 18-9v36" fill="#f15a24" stroke="#242520" strokeWidth="1.3" />
        <path d="m124 94 12-7-15-2 13-7-15-3 14-7" stroke="#242520" strokeWidth="1.3" />
        <circle cx="170" cy="37" r="21" fill="#f15a24" stroke="#242520" strokeWidth="1.3" />
        <path d="m170 8 1-5m25 26 6-3m-56-5-5-5" stroke="#242520" strokeWidth="1.3" />
      </svg>
      <p>Every useful thing<br />starts with a question.</p>
    </NarrativePanel>
    <NarrativePanel className="panel-exploration" label="Then, a little exploration">
      <span className="panel-number">A LITTLE EXPLORATION</span>
      <div className="panel-illustration"><img src="/images/makers-room.jpg" alt="A hand-drawn room on a notebook, with stairs leading to an orange door" /></div>
      <p>Take it apart.<br />See what it could become.</p>
      <span className="sketch-caption">FIG. 01 / A PLACE TO BEGIN</span>
    </NarrativePanel>
    <NarrativePanel className="panel-purpose" label="Finally, a purpose">
      <span className="panel-number">A PURPOSE</span>
      <SparkIcon className="panel-spark" />
      <h2>MAKE<br />IT<br />USEFUL.</h2>
      <p>Not just something that works.<br />Something that matters.</p>
    </NarrativePanel>
  </div>;
}