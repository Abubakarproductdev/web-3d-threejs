import { useEffect } from 'react';
import { PROJECT_DETAILS, type ProjectDetail } from '../../lib/projectDetails';
import { ArrowIcon } from '../ui/Icons';

type Props = {
  projectId: string;
  onBack: () => void;
  onSelectProject: (id: string) => void;
};

const ORDER: ('fast-send' | 'sivo' | 'boostwork')[] = ['fast-send', 'sivo', 'boostwork'];

export default function ProjectDetailPage({ projectId, onBack, onSelectProject }: Props) {
  const project: ProjectDetail = PROJECT_DETAILS[projectId] || PROJECT_DETAILS['fast-send'];

  useEffect(() => {
    // Scroll page to top whenever a new project is loaded
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Handle Escape key to close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [projectId, onBack]);

  const currentIndex = ORDER.indexOf(project.id);
  const prevProject = currentIndex > 0 ? PROJECT_DETAILS[ORDER[currentIndex - 1]] : null;
  const nextProject = currentIndex < ORDER.length - 1 ? PROJECT_DETAILS[ORDER[currentIndex + 1]] : null;

  return (
    <div className="project-detail-page" role="main" aria-label={`Project Case Study: ${project.title}`}>
      {/* Sticky Header Bar */}
      <header className="project-detail-header">
        <div className="project-header-inner">
          <button
            onClick={onBack}
            className="project-back-button"
            aria-label="Back to Portfolio Journey"
          >
            <span className="back-arrow">&larr;</span>
            <span className="back-text">BACK TO PORTFOLIO JOURNEY</span>
            <span className="esc-hint">ESC</span>
          </button>

          <div className="project-header-center">
            <span className="project-counter">
              PROJECT 0{currentIndex + 1} / 0{ORDER.length}
            </span>
            <span className="header-project-name">{project.title}</span>
          </div>

          <div className="project-header-actions">
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="header-test-button"
              title={`Test ${project.title} live in a new window`}
            >
              TEST LIVE APP <span aria-hidden="true">&nearr;</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="project-detail-body">
        
        {/* HERO SECTION */}
        <section className="project-hero-section">
          <div className="project-hero-eyebrow">
            <span className="eyebrow-tick" />
            <span className="eyebrow-text">{project.tag}</span>
            <span className="status-badge">{project.status}</span>
          </div>

          <h1 className="project-hero-title">{project.title}</h1>
          <p className="project-hero-subtitle">{project.subtitle}</p>

          {/* Primary Action Buttons */}
          <div className="project-cta-group">
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-cta-button"
            >
              <span>LAUNCH LIVE DEMO</span>
              <span className="cta-arrow">&nearr;</span>
            </a>

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-cta-button"
            >
              <span>VIEW SOURCE REPO</span>
              <span className="cta-arrow">&nearr;</span>
            </a>

            <a href="#architecture" className="tertiary-cta-button">
              <span>EXPLORE ARCHITECTURE</span>
              <span className="cta-arrow">&darr;</span>
            </a>
          </div>

          {/* Metadata Rail */}
          <div className="project-metadata-grid">
            <div className="meta-item">
              <span className="meta-label">TIMELINE</span>
              <span className="meta-value">{project.timeline}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">ROLE & CONTRIBUTION</span>
              <span className="meta-value">{project.role}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">DOMAIN / CATEGORY</span>
              <span className="meta-value">{project.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">TESTING STATUS</span>
              <span className="meta-value accent">{project.status}</span>
            </div>
          </div>
        </section>

        {/* OVERVIEW & PROBLEM / SOLUTION */}
        <section className="project-narrative-section">
          <div className="narrative-lead-card">
            <span className="section-label">EXECUTIVE SUMMARY</span>
            <p className="lead-paragraph">{project.overview}</p>
          </div>

          <div className="problem-solution-grid">
            <div className="problem-card">
              <div className="card-header">
                <span className="card-number">01</span>
                <h3>THE CORE PROBLEM</h3>
              </div>
              <p>{project.problem}</p>
            </div>

            <div className="solution-card">
              <div className="card-header">
                <span className="card-number">02</span>
                <h3>THE SYSTEM SOLUTION</h3>
              </div>
              <p>{project.solution}</p>
            </div>
          </div>
        </section>

        {/* SYSTEM ARCHITECTURE BLUEPRINT */}
        <section id="architecture" className="project-architecture-section">
          <div className="section-header">
            <span className="section-eyebrow">ENGINEERING PIPELINE</span>
            <h2>{project.architecture.title}</h2>
            <p className="section-summary">{project.architecture.summary}</p>
          </div>

          <div className="architecture-pipeline-grid">
            {project.architecture.stages.map((stage) => (
              <div key={stage.step} className="pipeline-stage-card">
                <span className="stage-step">{stage.step}</span>
                <h4 className="stage-name">{stage.name}</h4>
                <p className="stage-detail">{stage.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CORE DESIGN PRINCIPLES (IF AVAILABLE) */}
        {project.principles && project.principles.length > 0 && (
          <section className="project-principles-section">
            <div className="section-header">
              <span className="section-eyebrow">ARCHITECTURAL FOUNDATION</span>
              <h2>Core Design Principles</h2>
            </div>

            <div className="principles-grid">
              {project.principles.map((pr, idx) => (
                <div key={pr.name} className="principle-card">
                  <span className="principle-num">0{idx + 1}</span>
                  <h4 className="principle-title">{pr.name}</h4>
                  <p className="principle-desc">{pr.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CORE CAPABILITIES / KEY FEATURES */}
        <section className="project-features-section">
          <div className="section-header">
            <span className="section-eyebrow">CAPABILITIES</span>
            <h2>Key Subsystems & Features</h2>
          </div>

          <div className="features-grid">
            {project.features.map((feat) => (
              <div key={feat.title} className="feature-card">
                <span className="feature-tag">{feat.tag}</span>
                <h4 className="feature-title">{feat.title}</h4>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAULT TOLERANCE & RESILIENCE MATRIX (IF AVAILABLE) */}
        {project.resilience && project.resilience.length > 0 && (
          <section className="project-resilience-section">
            <div className="section-header">
              <span className="section-eyebrow">FAULT TOLERANCE</span>
              <h2>Resilience & Fallback Architecture</h2>
              <p className="section-summary">
                Engineered failure handling ensuring uninterrupted user experience across mobile OS limitations, biometric edge cases, and network dropouts.
              </p>
            </div>

            <div className="resilience-grid">
              {project.resilience.map((item) => (
                <div key={item.scenario} className="resilience-card">
                  <div className="resilience-scenario">
                    <span className="resilience-badge">FAILURE MODE</span>
                    <h4>{item.scenario}</h4>
                  </div>
                  <div className="resilience-solution">
                    <span className="resilience-badge solution">ARCHITECTURAL MITIGATION</span>
                    <p>{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QUANTITATIVE METRICS */}
        <section className="project-metrics-section">
          <div className="section-header">
            <span className="section-eyebrow">VERIFIED METRICS</span>
            <h2>Measured Performance & Impact</h2>
          </div>

          <div className="metrics-grid">
            {project.metrics.map((m) => (
              <div key={m.label} className="metric-box">
                <strong className="metric-value">{m.value}</strong>
                <span className="metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TECHNOLOGY STACK INDEX */}
        <section className="project-stack-section">
          <div className="section-header">
            <span className="section-eyebrow">SPECIFICATION</span>
            <h2>Technology & Infrastructure Matrix</h2>
          </div>

          <div className="tech-stack-groups">
            {project.techStack.map((group) => (
              <div key={group.category} className="stack-group-card">
                <h4 className="stack-category">{group.category}</h4>
                <div className="stack-pills">
                  {group.items.map((item) => (
                    <span key={item} className="stack-pill">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE TESTING CONTAINER */}
        <section className="project-test-section">
          <div className="test-banner-card">
            <div className="test-banner-content">
              <span className="test-banner-tag">EXPERIENCE THE PROJECT DIRECTLY</span>
              <h2>Ready to test {project.title}?</h2>
              <p className="test-intro">
                Follow these steps to explore the live interactive prototype:
              </p>
              <ul className="test-instructions-list">
                {project.testInstructions.map((step, idx) => (
                  <li key={idx}>
                    <span className="step-idx">{idx + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="test-actions-row">
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="banner-primary-btn"
                >
                  TEST LIVE PROTOTYPE NOW &nearr;
                </a>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="banner-secondary-btn"
                >
                  VIEW SOURCE ON GITHUB &nearr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER CAROUSEL & RETURN */}
        <footer className="project-detail-footer">
          <div className="project-nav-row">
            {prevProject ? (
              <button
                onClick={() => onSelectProject(prevProject.id)}
                className="prev-project-btn"
              >
                <span className="nav-arrow">&larr;</span>
                <span className="nav-meta">
                  <small>PREVIOUS PROJECT</small>
                  <strong>{prevProject.title}</strong>
                </span>
              </button>
            ) : <div />}

            <button onClick={onBack} className="footer-return-btn">
              <span>RETURN TO PORTFOLIO JOURNEY</span>
            </button>

            {nextProject ? (
              <button
                onClick={() => onSelectProject(nextProject.id)}
                className="next-project-btn"
              >
                <span className="nav-meta text-right">
                  <small>NEXT PROJECT</small>
                  <strong>{nextProject.title}</strong>
                </span>
                <span className="nav-arrow">&rarr;</span>
              </button>
            ) : <div />}
          </div>
        </footer>

      </div>
    </div>
  );
}
