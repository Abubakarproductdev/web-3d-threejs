import { PROJECTS } from '../../lib/story';

/* ————————————————————————————————————————————————————————————————
   PHASES 4 · 5 · 6  —  the project acts (unchanged by request).
   ———————————————————————————————————————————————————————————————— */

function Eyebrow({ children }: { children: string }) {
  return <p className="scene-eyebrow"><span className="eyebrow-tick" />{children}</p>;
}

type CardProps = {
  onClick?: () => void;
};

function QrCard({ onClick }: CardProps) {
  const rows = ['1111011', '1000010', '1011111', '1001010', '1111101'];
  return <div className="act-card is-clickable" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} title={onClick ? 'Click to view Fast Send case study & test live app' : undefined}>
    <span className="act-card-tag">FIG. 02 / NO APP NEEDED</span>
    <div className="qr-grid">
      {rows.map((row, r) =>
        row.split('').map((c, col) => (
          <i key={`${r}-${col}`} className={c === '1' ? (r + col) % 4 === 0 ? 'on accent' : 'on' : ''} />
        )),
      )}
    </div>
    <p>SCAN. SMILE. DELIVERED. <span className="card-click-hint">&nearr;</span></p>
  </div>;
}

function SivoCard({ onClick }: CardProps) {
  return <div className="act-card is-clickable" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} title={onClick ? 'Click to view SIVO case study & test live app' : undefined}>
    <span className="act-card-tag">FIG. 03 / HAND TO VOICE</span>
    <div className="hand-diagram">
      <span className="palm" />
      <i /><i /><i /><i />
      <b className="dot d1" /><b className="dot d2" /><b className="dot d3" /><b className="dot d4" />
    </div>
    <div className="voice-bars"><i /><i /><i /><i /><i /></div>
    <p>SIGNS BECOME SPEECH. <span className="card-click-hint">&nearr;</span></p>
  </div>;
}

function BoostCard({ onClick }: CardProps) {
  return <div className="act-card is-clickable" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} title={onClick ? 'Click to view BoostWork case study & test live app' : undefined}>
    <span className="act-card-tag">FIG. 04 / WORDS THAT WORK</span>
    <div className="doc-lines"><i className="accent" /><i /><i /><i /><i /></div>
    <div className="data-bars"><i style={{ height: '38%' }} /><i className="accent" style={{ height: '82%' }} /><i style={{ height: '58%' }} /></div>
    <p>DRAFT. DATA. DIRECTION. <span className="card-click-hint">&nearr;</span></p>
  </div>;
}

type ActProps = {
  reading?: boolean;
  onOpenProject?: (id: string) => void;
};

export function FastSendAct({ reading = false, onOpenProject }: ActProps) {
  const p = PROJECTS.fastSend;
  return <div className={`chapter-act act-fast${reading ? ' is-readable' : ''}`} data-act="fast">
    <div className="act-copy">
      <Eyebrow>{p.tag}</Eyebrow>
      <h2 onClick={() => onOpenProject?.('fast-send')} className="act-clickable-title" title="View Fast Send Case Study">{p.title}</h2>
      <p className="act-statement">{p.statement}</p>
      <ul className="act-beats">{p.beats.map((b) => <li key={b}><span />{b}</li>)}</ul>
      <div className="act-tech">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
      <div className="act-action">
        <button
          type="button"
          onClick={() => onOpenProject?.('fast-send')}
          className="act-explore-button"
          aria-label="Explore Fast Send case study and test live prototype"
        >
          <span>EXPLORE CASE STUDY &amp; TEST</span>
          <span className="btn-arrow">&nearr;</span>
        </button>
      </div>
    </div>
    <QrCard onClick={() => onOpenProject?.('fast-send')} />
  </div>;
}

export function SivoAct({ reading = false, onOpenProject }: ActProps) {
  const p = PROJECTS.sivo;
  return <div className={`chapter-act act-sivo${reading ? ' is-readable' : ''}`} data-act="sivo">
    <div className="act-copy">
      <Eyebrow>{p.tag}</Eyebrow>
      <h2 onClick={() => onOpenProject?.('sivo')} className="act-clickable-title" title="View SIVO Case Study">{p.title}</h2>
      <p className="act-statement">{p.statement}</p>
      <ul className="act-beats">{p.beats.map((b) => <li key={b}><span />{b}</li>)}</ul>
      <div className="act-tech">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
      <div className="act-metrics">{p.metrics.map((m) => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>
      <div className="act-action">
        <button
          type="button"
          onClick={() => onOpenProject?.('sivo')}
          className="act-explore-button"
          aria-label="Explore SIVO case study and test live prototype"
        >
          <span>EXPLORE CASE STUDY &amp; TEST</span>
          <span className="btn-arrow">&nearr;</span>
        </button>
      </div>
    </div>
    <SivoCard onClick={() => onOpenProject?.('sivo')} />
  </div>;
}

export function BoostAct({ reading = false, onOpenProject }: ActProps) {
  const p = PROJECTS.boost;
  return <div className={`chapter-act act-boost${reading ? ' is-readable' : ''}`} data-act="boost">
    <div className="act-copy">
      <Eyebrow>{p.tag}</Eyebrow>
      <h2 onClick={() => onOpenProject?.('boostwork')} className="act-clickable-title" title="View BoostWork Case Study">{p.title}</h2>
      <p className="act-statement">{p.statement}</p>
      <ul className="act-beats">{p.beats.map((b) => <li key={b}><span />{b}</li>)}</ul>
      <div className="act-tech">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
      <div className="act-metrics">{p.metrics.map((m) => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>
      <div className="act-action">
        <button
          type="button"
          onClick={() => onOpenProject?.('boostwork')}
          className="act-explore-button"
          aria-label="Explore BoostWork case study and test live prototype"
        >
          <span>EXPLORE CASE STUDY &amp; TEST</span>
          <span className="btn-arrow">&nearr;</span>
        </button>
      </div>
    </div>
    <BoostCard onClick={() => onOpenProject?.('boostwork')} />
  </div>;
}
