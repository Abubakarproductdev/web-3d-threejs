import { useState } from 'react';
import { CERTIFICATIONS, EDUCATION, EXPERIENCES, SKILLS } from '../../lib/story';
import { ArrowIcon } from '../ui/Icons';

/* ————————————————————————————————————————————————————————————————
   PHASES 7 · 8 · 9  —  TECHNICAL ARCHITECTURAL PLATES
   Full-bleed technical drafting folio plates with precision annotations,
   active leader lines, interactive tool matrices, and seamless transitions.
   ———————————————————————————————————————————————————————————————— */

function DraftingCorners() {
  return (
    <div className="drafting-markers" aria-hidden="true">
      <span className="drafting-cross top-left">+</span>
      <span className="drafting-cross top-right">+</span>
      <span className="drafting-cross bottom-left">+</span>
      <span className="drafting-cross bottom-right">+</span>
    </div>
  );
}

function PlateHead({ kicker, title, spec }: { kicker: string; title: string; spec?: string }) {
  return (
    <header className="plate-head">
      <div className="plate-meta">
        <p className="plate-kicker">{kicker}</p>
        {spec && <span className="plate-spec">{spec}</span>}
      </div>
      <h2>{title}</h2>
    </header>
  );
}

/* PHASE 7 — Experience: The Three Rooms site plan */
export function ExperiencePlate({ reading = false }: { reading?: boolean }) {
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);

  return (
    <section className={`chapter-plate plate-experience${reading ? ' is-readable' : ''}`}>
      <div className="plate-art" aria-hidden="true">
        <img src="/images/plate-rooms.jpg" alt="Architectural drawing of three rooms: Ezitech AI lab, Arzens security tower, and Upwork studio pavilion" />
      </div>
      <span className="plate-frame" aria-hidden="true" />
      <DraftingCorners />

      <div className="plate-coordinates" aria-hidden="true">
        <span>LOC: 33.6844° N / 73.0479° E</span>
        <span>ELEV: +0.00 M</span>
        <span>SPEC: ARCH-EXP-07</span>
      </div>

      <PlateHead kicker="CHAPTER 07 / WHERE I HAVE WORKED" title="EXPERIENCE." spec="SITE PLAN // 3 ROOMS" />

      <div className="callout-layer">
        {EXPERIENCES.map((e, i) => (
          <article
            className={`callout callout-${i + 1}${hoveredRoom === i ? ' is-hovered' : ''}`}
            key={e.place}
            onMouseEnter={() => setHoveredRoom(i)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <span className="callout-leader" aria-hidden="true">
              <i className="leader-stem" />
            </span>
            <span className="callout-node" aria-hidden="true">
              <i className="pulse-ring" />
            </span>
            <div className="callout-chip">
              <div className="callout-chip-header">
                <span className="callout-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="callout-date-badge">{e.date}</span>
              </div>
              <strong>{e.place}</strong>
              <span className="callout-role">{e.role}</span>
              <p>{e.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="plate-scale" aria-hidden="true">
        <span className="scale-rail"><i className="scale-fill" /></span>
        <div className="scale-ticks">
          <div className="scale-tick-item"><b className="scale-tick" /><span>01 ROOM // EZITECH</span></div>
          <div className="scale-tick-item"><b className="scale-tick" /><span>02 ARCH // ARZENS</span></div>
          <div className="scale-tick-item"><b className="scale-tick" /><span>03 FIELD // UPWORK</span></div>
        </div>
      </div>
    </section>
  );
}

/* PHASE 8 — Skills: The Maker's Workbench & Specification Legend */
export function SkillsPlate({ reading = false }: { reading?: boolean }) {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  return (
    <section className={`chapter-plate plate-skills${reading ? ' is-readable' : ''}`}>
      <div className="plate-art" aria-hidden="true">
        <img src="/images/plate-atlas.jpg" alt="Technical drawing of a maker's workbench with precision tools" />
      </div>
      <span className="plate-frame" aria-hidden="true" />
      <DraftingCorners />

      <div className="plate-coordinates" aria-hidden="true">
        <span>BENCH: TOOL-SPEC-08</span>
        <span>INSTRUMENTS: 6 DOMAINS</span>
        <span>STATUS: PRODUCTION READY</span>
      </div>

      <PlateHead kicker="CHAPTER 08 / WHAT I KNOW" title="SKILLS." spec="SPECIFICATION // TOOL INDEX" />

      <ol className="legend">
        {SKILLS.map((s, i) => (
          <li
            className={`legend-row legend-row-${i + 1}${activeGroup === i ? ' is-active' : ''}`}
            key={s.group}
            onMouseEnter={() => setActiveGroup(i)}
            onMouseLeave={() => setActiveGroup(null)}
          >
            <div className="legend-no-wrapper">
              <span className="legend-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="legend-domain">{s.group}</span>
            </div>
            <span className="legend-leader" aria-hidden="true">
              <i className="leader-rule" />
              <i className="leader-dot" />
            </span>
            <div className="legend-body">
              <div className="skill-chips">
                {s.items.map((tech) => (
                  <span className="skill-chip" key={tech}>{tech}</span>
                ))}
              </div>
              <small className="skill-note">{s.note}</small>
            </div>
          </li>
        ))}
      </ol>

      <aside className="plate-notes">
        <div className="seal-header">
          <span className="seal-badge">ACCREDITATION</span>
          <span className="seal-status">VERIFIED // SPEC 2026</span>
        </div>
        <div className="cert-list">
          {CERTIFICATIONS.map((cert) => (
            <p key={cert} className="cert-item">
              <span className="cert-dot" aria-hidden="true">&#9670;</span>
              <span>{cert}</span>
            </p>
          ))}
        </div>
        <div className="edu-block">
          <span className="edu-degree">{EDUCATION.degree}</span>
          <span className="edu-school">{EDUCATION.school} &middot; {EDUCATION.dates}</span>
        </div>
      </aside>
    </section>
  );
}

/* PHASE 9 — The Threshold: Finale */
export function FinalePlate({ onContact, onRestart, reading = false, active = false }: {
  onContact: () => void; onRestart: () => void; reading?: boolean; active?: boolean;
}) {
  return (
    <section className={`chapter-plate plate-finale${reading ? ' is-readable' : ''}`} inert={!reading && !active}>
      <div className="plate-art" aria-hidden="true">
        <img src="/images/plate-threshold.jpg" alt="Architectural drawing of an open doorway and orange sphere on a circular pedestal" />
      </div>
      <span className="plate-frame" aria-hidden="true" />
      <DraftingCorners />
      <div className="finale-center">
        <p className="plate-kicker">CHAPTER 09 / WHERE I AM GOING</p>
        <h2 className="finale-huge">THE DOOR<br />IS OPEN.</h2>
        <p className="finale-name">MUHAMMAD ABUBAKAR<span>SOFTWARE ENGINEER</span></p>
        <p className="finale-invite">I build systems that turn ideas into something people can use. The next useful thing could be ours.</p>
        <div className="finale-cta">
          <button className="begin-button" onClick={onContact}>
            <span className="round-arrow"><ArrowIcon /></span>
            <span className="begin-label">START A CONVERSATION<span>Good things start with hello.</span></span>
          </button>
          <button className="restart-button" onClick={onRestart}>BACK TO THE BEGINNING <span aria-hidden="true">&#8599;</span></button>
        </div>
      </div>
    </section>
  );
}
