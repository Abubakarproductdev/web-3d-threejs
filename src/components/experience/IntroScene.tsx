import { ArrowIcon } from '../ui/Icons';

export default function IntroScene({ onBegin, onSpark, discovered = false, reading = false }: {
  onBegin: () => void; onSpark: () => void; discovered?: boolean; reading?: boolean;
}) {
  return <div className={`intro-copy${reading ? ' is-readable' : ''}`}>
    <p className="intro-eyebrow"><span />THE MAKER'S ROOM</p>
    <h1 className="intro-name" aria-label="Muhammad Abubakar">
      <span className="name-line" aria-hidden="true"><span>MUHAMMAD</span></span>
      <span className="name-line" aria-hidden="true"><span>ABUBAKAR<span className="name-period">.</span></span></span>
    </h1>
    <div className="intro-bottom">
      <p className="intro-description">Software engineer. Builder by nature.<br /><span>A little curiosity can become something useful.</span></p>
      <button className="begin-button" onClick={onBegin}>
        <span className="round-arrow"><ArrowIcon /></span>
        <span className="begin-label">{reading ? 'READ THE STORY' : 'SCROLL TO BEGIN'}<span>Take the scenic route.</span></span>
      </button>
    </div>
    {!reading && <button className="keyboard-spark" onClick={onSpark}>{discovered ? 'Put the orange spark back' : 'Touch the orange spark and open the room'}</button>}
  </div>;
}