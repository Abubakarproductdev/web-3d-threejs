import { ArrowIcon } from '../ui/Icons';

export default function DiscoveryScene({ onContact, onRestart, reading = false, active = false }: {
  onContact: () => void; onRestart: () => void; reading?: boolean; active?: boolean;
}) {
  return <div className={`discovery-scene${reading ? ' is-readable' : ''}`} inert={!reading && !active}>
    <div className="discovery-copy">
      <p className="scene-eyebrow">THE NEXT PAGE</p>
      <h2>CURIOUS MIND.<br />USEFUL THINGS.</h2>
      <p className="discovery-statement">I build systems that turn ideas into<br className="desktop-break" /> something people can use.</p>
      <div className="education-note">
        <span className="education-line" />
        <div><p>BACHELOR'S IN SOFTWARE ENGINEERING</p><span>Capital University of Science and Technology<br />2022 - 2026</span></div>
      </div>
      <div className="discovery-actions">
        <button className="begin-button light" onClick={onContact}><span className="round-arrow"><ArrowIcon /></span><span className="begin-label">LET'S MAKE SOMETHING<span>The next idea could be yours.</span></span></button>
        <button className="restart-button" onClick={onRestart}>BACK TO THE BEGINNING <span aria-hidden="true">&#8599;</span></button>
      </div>
    </div>
  </div>;
}