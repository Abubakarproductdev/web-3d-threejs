type IconProps = { className?: string; };

export function ArrowIcon({ className = '' }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function SparkIcon({ className = '' }: IconProps) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 2v36M2 20h36M7.3 7.3l25.4 25.4M7.3 32.7 32.7 7.3" stroke="currentColor" strokeWidth="3" /></svg>;
}

export function CloseIcon({ className = '' }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function DoorIcon({ className = '' }: IconProps) {
  return <svg className={className} viewBox="0 0 60 80" fill="none" aria-hidden="true"><path d="M5 76V29C5 15.2 16.2 4 30 4s25 11.2 25 25v47H5Z" stroke="currentColor" strokeWidth="2" /><path d="M15 76V30a15 15 0 0 1 30 0v46" stroke="currentColor" strokeWidth="2" /><path d="m15 76 21-9V20M30 48v4" stroke="currentColor" strokeWidth="2" /></svg>;
}