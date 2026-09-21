import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { chapters, CONTACT } from '../../lib/story';
import { ArrowIcon, CloseIcon, SparkIcon } from '../ui/Icons';

type Props = {
  view: 'index' | 'contact';
  onClose: () => void;
  onNavigate: (progress: number) => void;
  onContact: () => void;
  reducedMotion: boolean;
  onToggleMotion: () => void;
  illustrationMode: boolean;
  onToggleIllustration: () => void;
  webglAvailable: boolean;
};

export default function StoryDialog(props: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const closingTween = useRef<gsap.core.Tween | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const initialReducedMotion = useRef(props.reducedMotion);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.showModal();
    const animation = gsap.fromTo(surface.current, { yPercent: initialReducedMotion.current ? 0 : 100 }, { yPercent: 0, duration: 0.65, ease: 'power4.out' });
    return () => {
      animation.kill();
      closingTween.current?.kill();
      if (node.open) node.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    surface.current?.scrollTo({ top: 0 });
    dialog.current?.querySelector<HTMLButtonElement>('.dialog-close')?.focus({ preventScroll: true });
  }, [props.view]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (props.reducedMotion) props.onClose();
    else closingTween.current = gsap.to(surface.current, { yPercent: -101, duration: 0.48, ease: 'power3.inOut', onComplete: props.onClose });
  }, [props.reducedMotion, props.onClose]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return <dialog className={`story-dialog ${props.view === 'contact' ? 'contact-dialog' : ''}`} ref={dialog} aria-labelledby="dialog-title" onCancel={(event) => { event.preventDefault(); close(); }}>
    <div className="dialog-surface" ref={surface}>
      <div className="dialog-header"><span className="dialog-brand">ma<span>.</span></span><span>{props.view === 'index' ? 'THE STORY INDEX' : 'A NEW BEGINNING'}</span><button className="dialog-close" onClick={close} autoFocus>CLOSE <CloseIcon /></button></div>
      {props.view === 'index' ? <div className="index-body">
        <div className="index-heading"><p>EVERY STORY HAS A WAY IN.</p><h2 id="dialog-title">TAKE A<br />LOOK<br />AROUND<span>.</span></h2><SparkIcon /></div>
        <div className="index-content">
          <nav aria-label="Story chapters" className="chapter-list">{chapters.map((chapter) => <button key={chapter.id} onClick={() => props.onNavigate(chapter.progress)}><span className="index-number">{chapter.number}</span><span className="index-chapter-text"><span>{chapter.title}</span><small>{chapter.subtitle}</small></span><ArrowIcon /></button>)}<button className="index-contact" onClick={props.onContact}><span className="index-number">&nbsp;</span><span className="index-chapter-text"><span>Let's make something</span><small>The next chapter starts with a conversation.</small></span><ArrowIcon /></button></nav>
          <div className="experience-settings"><p>MAKE YOURSELF AT HOME</p><button onClick={props.onToggleMotion} aria-pressed={props.reducedMotion}><span>Motion</span><span>{props.reducedMotion ? 'REDUCED' : 'FULL EXPERIENCE'} <span aria-hidden="true">&#8596;</span></span></button><button onClick={props.onToggleIllustration} disabled={!props.webglAvailable} aria-pressed={props.illustrationMode}><span>World</span><span>{props.illustrationMode ? 'ILLUSTRATED' : 'INTERACTIVE 3D'} <span aria-hidden="true">&#8596;</span></span></button></div>
        </div>
      </div> : <div className="contact-body">
        <div className="contact-heading"><p>MUHAMMAD ABUBAKAR / SOFTWARE ENGINEER</p><h2 id="dialog-title">GOOD THINGS<br />START WITH<br />HELLO<span>.</span></h2></div>
        <div className="contact-details"><SparkIcon className="contact-spark" /><p>Have a question, a possibility,<br />or something worth building?</p><a className="email-link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}<ArrowIcon /></a><div className="contact-secondary"><a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a><button onClick={copyEmail}>{copied ? 'EMAIL COPIED' : 'COPY EMAIL'} <span aria-hidden="true">&#8599;</span></button></div><p className="copy-status" role="status">{copyError ? 'Copy is unavailable. Select the email address above, or click it to write.' : copied ? 'Ready whenever you are.' : ''}</p><div className="portfolio-handle"><span>PORTFOLIO</span><p>{CONTACT.portfolio}</p></div></div>
      </div>}
      <div className="dialog-foot"><span>A LITTLE CURIOSITY GOES A LONG WAY.</span><span>MUHAMMAD ABUBAKAR</span></div>
    </div>
  </dialog>;
}