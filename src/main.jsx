import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import './styles.css';

const contact = {
  email: 'pinheiro.edu96@gmail.com',
  whatsapp: 'https://wa.me/5511994196200',
  github: 'https://github.com/EduMPinheiro',
  instagram: 'https://www.instagram.com/edu_mpinheiro',
};

const projects = [
  ['instituto-nastri', 'Instituto Nastri', 'Conceito', 'Concept', '/project-previews/instituto-nastri.png', 'https://institutonastri.vercel.app', 'Dermatologia e tricologia com ciência, precisão e naturalidade.', 'Dermatology and trichology with science, precision, and naturalness.', '#1b342d', 'Web design · Desenvolvimento'],
  ['beth-gauna', 'Beth Gauna', 'Cliente', 'Client', '/project-previews/beth-gauna.png', 'https://www.betegauna.com.br', 'Caligrafia e engraving para eternizar momentos.', 'Calligraphy and engraving to make moments last.', '#4a352a', 'Web design · Desenvolvimento'],
  ['zarah-flor', 'Zarah Flor', 'Conceito', 'Concept', '/project-previews/zarah-flor.png', 'https://zarahflor.vercel.app', 'Uma experiência digital voltada à estética e aos cuidados com a pele negra.', 'A digital experience focused on aesthetics and care for Black skin.', '#623f32', 'Direção visual · Web design'],
  ['tarot-da-joli', 'Tarot da Joli', 'Cliente', 'Client', '/project-previews/tarot-da-joli.png', 'https://www.tarotdajoli.com.br', 'Tarot online com uma atmosfera intuitiva e acolhedora.', 'Online tarot with an intuitive and welcoming atmosphere.', '#3f2e54', 'Web design · Desenvolvimento'],
  ['rafael-montenegro', 'Rafael Montenegro Advocacia', 'Conceito', 'Concept', '/project-previews/rafael-montenegro.png', 'https://rafaelmontenegro-advocacia.vercel.app', 'Estudo de presença institucional para um escritório de advocacia.', 'An institutional presence study for a law firm.', '#263746', 'Direção visual · Web design'],
  ['sem-panelinha', 'Sem Panelinha', 'Autoral', 'Independent', '/project-previews/sem-panelinha.png', 'https://sempanelinha.vercel.app', 'Aplicativo autoral para montar times em jogos de vôlei.', 'An independent app for creating teams in volleyball games.', '#25352f', 'Produto digital · Desenvolvimento'],
  ['dex-plus', 'Dex+', 'Autoral', 'Independent', '/project-previews/dex-plus.png', 'https://dex-plus.vercel.app', 'Pokédex autoral com uma direção mais futurista.', 'An independent Pokédex with a more futuristic direction.', '#17356a', 'Produto digital · Desenvolvimento'],
].map(([slug, name, status, statusEn, image, href, summary, summaryEn, accent, disciplines]) => ({ slug, name, status, statusEn, image, href, summary, summaryEn, accent, disciplines }));

const texts = {
  pt: { email: 'E-mail', instagram: 'Instagram', work: 'Projetos', about: 'Sobre', contact: 'Contato', role: 'Web Designer & Developer', lead: 'Construindo', rest: 'produtos digitais.', intro: 'Crio sites e experiências digitais com identidade, clareza e propósito.', start: 'Começar um projeto', selected: 'Projetos selecionados', hint: 'Arraste ou use as setas', view: 'Ver projeto', aboutTitle: 'Do conceito ao código.', aboutBody: 'Sou Edu Pinheiro, web designer e developer freelancer. Desenvolvo experiências digitais próprias para pessoas e negócios que precisam de uma presença com intenção, clareza e personalidade.', contactTitle: 'Tem um projeto em mente?', contactBody: 'Vamos conversar sobre sua ideia.', close: 'Fechar', back: 'Voltar aos projetos', next: 'Próximo projeto', context: 'Contexto', contribution: 'Contribuição', location: 'São Paulo, Brasil' },
  en: { email: 'Email', instagram: 'Instagram', work: 'Work', about: 'About', contact: 'Contact', role: 'Web Designer & Developer', lead: 'Building', rest: 'digital products.', intro: 'I create digital experiences with identity, clarity, and purpose.', start: 'Start a project', selected: 'Selected work', hint: 'Drag or use the arrows', view: 'View project', aboutTitle: 'From concept to code.', aboutBody: 'I’m Edu Pinheiro, a freelance web designer and developer. I build distinctive digital experiences for people and businesses that need a presence with intention, clarity, and personality.', contactTitle: 'Have a project in mind?', contactBody: 'Let’s talk about your idea.', close: 'Close', back: 'Back to work', next: 'Next project', context: 'Context', contribution: 'Contribution', location: 'São Paulo, Brazil' },
};

const Arrow = ({ external = false }) => <span className="arrow" aria-hidden="true">{external ? '↗' : '→'}</span>;

function localeFromBrowser() {
  const saved = localStorage.getItem('edu-locale');
  if (saved === 'pt' || saved === 'en') return saved;
  return (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function App() {
  const [locale, setLocale] = useState(localeFromBrowser);
  const [path, setPath] = useState(window.location.pathname);
  const copy = texts[locale];
  useEffect(() => { document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'; document.title = 'Edu Pinheiro — Web Designer & Developer'; }, [locale]);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); addEventListener('popstate', onPop); return () => removeEventListener('popstate', onPop); }, []);
  const navigate = (href) => {
    const [pathname, hash] = href.split('#');
    history.pushState({}, '', href);
    setPath(pathname || window.location.pathname);
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 0);
    else scrollTo({ top: 0, behavior: 'instant' });
  };
  const toggleLocale = () => setLocale((old) => { const next = old === 'pt' ? 'en' : 'pt'; localStorage.setItem('edu-locale', next); return next; });
  const slug = path.split('/').filter(Boolean).find((part, index, list) => list[index - 1] === 'projetos');
  const project = projects.find((item) => item.slug === slug);
  return project ? <CasePage project={project} copy={copy} locale={locale} navigate={navigate} toggleLocale={toggleLocale} /> : <Home copy={copy} locale={locale} navigate={navigate} toggleLocale={toggleLocale} />;
}

function Header({ copy, navigate, toggleLocale, onAbout, casePage = false }) {
  const [open, setOpen] = useState(false);
  const makeLink = (id) => ({ href: (casePage ? '/#' : '#') + id, onClick: (event) => { event.preventDefault(); setOpen(false); navigate((casePage ? '/#' : '#') + id); } });
  return <header className="site-header"><div className="shell header-inner">
    <a className="wordmark" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>Edu Pinheiro</a>
    <nav className="desktop-nav" aria-label="Primary navigation"><a {...makeLink('projetos')}>{copy.work}</a><button type="button" onClick={onAbout}>{copy.about}</button><a {...makeLink('contato')}>{copy.contact}</a></nav>
    <div className="header-actions"><button className="language-toggle" type="button" onClick={toggleLocale}><b>{localeLabel(copy)}</b> / {localeLabel(copy, true)}</button><button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><span /><span /><span /></button></div>
    <nav id="mobile-nav" className={'mobile-nav' + (open ? ' is-open' : '')} aria-label="Mobile navigation"><a {...makeLink('projetos')}>{copy.work}<Arrow /></a><button type="button" onClick={() => { setOpen(false); onAbout?.(); }}>{copy.about}<Arrow /></button><a {...makeLink('contato')}>{copy.contact}<Arrow /></a></nav>
  </div></header>;
}

function localeLabel(copy, alternate = false) { return copy.work === 'Projetos' ? (alternate ? 'EN' : 'PT') : (alternate ? 'PT' : 'EN'); }

function accentLastWord(text) { const words = text.split(" "); return <>{words.slice(0, -1).join(" ")} <span className="contact-title-accent">{words[words.length - 1]}</span></>; }

function Home({ copy, locale, navigate, toggleLocale }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  return <div className="site-shell"><Header copy={copy} navigate={navigate} toggleLocale={toggleLocale} onAbout={() => setAboutOpen(true)} /><main><section className="compact-hero"><div className="shell hero-grid"><div><p className="hero-kicker"><span className="hero-label">EDU.PINHEIRO / {copy.role.toUpperCase()}</span></p><h1 className="hero-title"><span>{copy.lead}</span><span>{copy.rest}</span></h1><div className="hero-intro"><p>{copy.intro}</p><a className="text-cta" href={contact.whatsapp} target="_blank" rel="noreferrer">{copy.start}<Arrow external /></a></div></div><div className="hero-art" aria-hidden="true"><span className="hero-mark">/E</span><i className="hero-cross" /><i className="hero-dots" /><i className="hero-rule" /></div></div></section><HeroCarousel copy={copy} locale={locale} /><section className="compact-contact" id="contato"><div className="shell contact-inner"><div><span className="section-kicker contact-protocol"><b>03</b> / CONTACT_PROTOCOL</span><h2>{accentLastWord(copy.contactTitle)}</h2><p>{copy.contactBody}</p></div><a className="contact-cta" href={contact.whatsapp} target="_blank" rel="noreferrer">{copy.start}<Arrow external /></a></div></section></main><Footer copy={copy} />{aboutOpen && <AboutPanel copy={copy} close={() => setAboutOpen(false)} />}</div>;
}

function HeroCarousel({ copy, locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const swipeStart = useRef(null);
  const stageRef = useRef(null);
  const active = projects[activeIndex];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 0 : .5;
  const ease = [0.22, 1, 0.36, 1];
  const previous = projects[(activeIndex - 1 + projects.length) % projects.length];
  const next = projects[(activeIndex + 1) % projects.length];

  const select = (index) => {
    if (isAnimating || index === activeIndex) return;
    const delta = (index - activeIndex + projects.length) % projects.length;
    setDirection(delta <= projects.length / 2 ? 1 : -1);
    setIsAnimating(true);
    setActiveIndex(index);
  };
  const move = (delta) => select((activeIndex + delta + projects.length) % projects.length);
  const onPointerDown = (event) => { swipeStart.current = event.clientX; };
  const onPointerMove = (event) => {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    if (Math.abs(delta) > 48) { swipeStart.current = null; move(delta < 0 ? 1 : -1); }
  };
  const onPointerUp = () => { swipeStart.current = null; };
  const onKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  };

  return <section className="hero-carousel" id="projetos" style={{ '--active-accent': active.accent }}>
    <AnimatePresence initial={false}>
      <motion.div key={active.slug} className="carousel-backdrop" style={{ backgroundImage: 'url(' + active.image + ')' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .6, ease }} />
    </AnimatePresence>
    <motion.div className="carousel-accent" animate={{ backgroundColor: active.accent }} transition={{ duration: reduced ? 0 : .6, ease }} />
    <div className="shell carousel-shell">
      <div className="carousel-topline">
        <div><span className="section-kicker">01</span><h2 id="projects-title">{copy.selected}</h2></div>
        <span className="counter" aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} / 07</span>
      </div>
      <div ref={stageRef} className="carousel-stage" onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => { swipeStart.current = null; }} tabIndex="0" aria-labelledby="projects-title">
        <NeighborProject project={previous} side="previous" locale={locale} onSelect={() => select((activeIndex - 1 + projects.length) % projects.length)} />
        <div className="carousel-active-slot">
          <AnimatePresence initial={false} custom={direction}>
            <motion.article key={active.slug} className="active-project-card" custom={direction} variants={{
              enter: (sign) => ({ opacity: 0, x: reduced ? 0 : sign * 40, scale: reduced ? 1 : .96, filter: reduced ? 'blur(0px)' : 'blur(3px)' }),
              center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
              exit: (sign) => ({ opacity: 0, x: reduced ? 0 : sign * -40, scale: reduced ? 1 : .97, filter: reduced ? 'blur(0px)' : 'blur(3px)' }),
            }} initial="enter" animate="center" exit="exit" transition={{ duration, ease }} onAnimationComplete={(definition) => { if (definition === 'center') setIsAnimating(false); }}>
              <div className="slide-frame"><div className="browser-bar"><span className="browser-id">PROJECT_{String(activeIndex + 1).padStart(2, '0')}</span><span className="browser-name">{active.name.toUpperCase()}</span><span className="browser-status">STATUS: {(locale === 'pt' ? active.status : active.statusEn).toUpperCase()}</span></div><div className="slide-media"><img src={active.image} alt={'Screenshot do projeto ' + active.name} /></div><span className="carousel-scanline" aria-hidden="true" /></div>
            </motion.article>
          </AnimatePresence>
        </div>
        <NeighborProject project={next} side="next" locale={locale} onSelect={() => select((activeIndex + 1) % projects.length)} />
        <button className="carousel-arrow carousel-arrow--previous" type="button" aria-label="Projeto anterior" onClick={() => move(-1)} disabled={isAnimating}>←</button>
        <button className="carousel-arrow carousel-arrow--next" type="button" aria-label="Próximo projeto" onClick={() => move(1)} disabled={isAnimating}>→</button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={active.slug} className="carousel-info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : .14, ease }}>
          <div className="project-info"><span className="project-number">{String(activeIndex + 1).padStart(2, '0')}</span><div><h3>{active.name}</h3><p className="status">{locale === 'pt' ? active.status : active.statusEn}</p></div></div>
          <div className="carousel-meta"><p className="summary">{locale === 'pt' ? active.summary : active.summaryEn}</p><a className="slide-link" href={active.href} target="_blank" rel="noreferrer">{copy.view}<Arrow external /></a></div>
        </motion.div>
      </AnimatePresence>
      <ProjectPicker projects={projects} activeIndex={activeIndex} locale={locale} onSelect={select} disabled={isAnimating} />
    </div>
  </section>;
}

function NeighborProject({ project, side, locale, onSelect }) {
  return <button className={'carousel-neighbor carousel-neighbor--' + side} type="button" onClick={onSelect} aria-label={'Selecionar ' + project.name}>
    <span className="neighbor-media"><img src={project.image} alt="" /></span>
    <span className="neighbor-label"><small>{project.slug === 'instituto-nastri' ? '01' : project.slug === 'beth-gauna' ? '02' : project.slug === 'zarah-flor' ? '03' : project.slug === 'tarot-da-joli' ? '04' : project.slug === 'rafael-montenegro' ? '05' : project.slug === 'sem-panelinha' ? '06' : '07'}</small><strong>{project.name}</strong><em>{locale === 'pt' ? project.status : project.statusEn}</em></span>
  </button>;
}

function ProjectPicker({ projects: items, activeIndex, locale, onSelect, disabled }) {
  return <nav className="project-picker" aria-label="Selecionar projeto">{items.map((project, index) => <button key={project.slug} className={index === activeIndex ? 'is-active' : ''} type="button" aria-current={index === activeIndex ? 'true' : undefined} disabled={disabled} onClick={() => onSelect(index)}><small>{String(index + 1).padStart(2, '0')}</small><span>{project.name === 'Instituto Nastri' ? 'Nastri' : project.name === 'Rafael Montenegro Advocacia' ? 'Rafael' : project.name}</span></button>)}</nav>;
}

function AboutPanel({ copy, close }) {
  useEffect(() => { const onKey = (event) => event.key === 'Escape' && close(); document.body.classList.add('modal-open'); addEventListener('keydown', onKey); return () => { document.body.classList.remove('modal-open'); removeEventListener('keydown', onKey); }; }, [close]);
  return <div className="about-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}><aside className="about-panel" role="dialog" aria-modal="true" aria-labelledby="about-title"><button className="panel-close" type="button" onClick={close} aria-label={copy.close}>×</button><span className="section-kicker">02</span><h2 id="about-title">{copy.aboutTitle}</h2><p>{copy.aboutBody}</p><strong>Edu <span>Pinheiro</span></strong></aside></div>;
}

function Footer({ copy }) {
  const links = [['WhatsApp', contact.whatsapp], [copy.email, 'mailto:' + contact.email], ['GitHub', contact.github], [copy.instagram, contact.instagram]];
  return <footer className="compact-footer"><div className="shell"><div className="footer-row"><span>Edu Pinheiro, {copy.role}</span><span>{copy.location}</span></div><div className="footer-links">{links.map(([name, href]) => <a key={name + href} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"><span>{name}</span><Arrow external /></a>)}</div><div className="footer-bottom"><span>© Edu Pinheiro</span><span>Web design · Desenvolvimento</span></div></div></footer>;
}

function CasePage({ project, copy, locale, navigate, toggleLocale }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <div className="site-shell"><Header copy={copy} navigate={navigate} toggleLocale={toggleLocale} casePage /><main><section className="case-hero shell"><a className="back-link" href="/#projetos" onClick={(event) => { event.preventDefault(); navigate('/#projetos'); }}>← {copy.back}</a><div className="case-title-block"><span className="project-number">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span className="status">{locale === 'pt' ? project.status : project.statusEn}</span><h1>{project.name}</h1><p>{locale === 'pt' ? project.summary : project.summaryEn}</p></div></section><section className="case-image shell"><img src={project.image} alt={'Preview completo de ' + project.name} /></section><section className="case-details shell"><div><small>{copy.context}</small><p>{locale === 'pt' ? project.summary : project.summaryEn}</p></div><div><small>{copy.contribution}</small><p>Design e desenvolvimento</p></div><div><a className="text-cta" href={project.href} target="_blank" rel="noreferrer">{copy.view}<Arrow external /></a></div></section><section className="case-next shell"><span>{copy.next}</span><a href={'/projetos/' + next.slug} onClick={(event) => { event.preventDefault(); navigate('/projetos/' + next.slug); }}><strong>{next.name}</strong><Arrow /></a></section></main><Footer copy={copy} /></div>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);








