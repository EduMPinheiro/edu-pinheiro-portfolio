import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import DecryptedText from './components/DecryptedText';
import Magnet from './components/Magnet';
import SplashCursor from './components/SplashCursor';
import ProjectBrowserFrame from './components/ProjectBrowserFrame';
import { BorderBeam } from './components/ui/BorderBeam';
import { trackEvent, trackPageView } from './analytics';
import './styles.css';

const contact = {
  email: 'pinheiro.edu96@gmail.com',
  whatsapp: 'https://wa.me/5511994196200',
  github: 'https://github.com/EduMPinheiro',
  instagram: 'https://www.instagram.com/edu_mpinheiro',
};

const projects = [
  { slug: 'instituto-nastri', name: 'Instituto Nastri', status: 'Conceito', statusEn: 'Concept', image: '/project-previews/instituto-nastri.png', href: 'https://institutonastri.vercel.app', summary: 'Organizei as informações do instituto para tornar tratamentos, especialidades e profissionais mais fáceis de entender. A interface combina precisão médica com uma sensação acolhedora, reforçando o cuidado individualizado da clínica.', summaryEn: 'I organized the institute’s information so treatments, specialties, and professionals are easier to understand. The interface balances medical precision with a welcoming tone, reinforcing the clinic’s individualized care.', role: 'Direção visual, design de interface e desenvolvimento front-end.', roleEn: 'Visual direction, interface design, and front-end development.', deliverables: 'Site institucional, experiência responsiva e interface focada em agendamentos.', deliverablesEn: 'Institutional website, responsive experience, and appointment-focused interface.', technologies: ['Interface', 'Front-end', 'Design responsivo'], technologiesEn: ['Interface', 'Front-end', 'Responsive design'], year: '2026', disciplines: 'Web design · Desenvolvimento', accent: '#1b342d', accentPrimary: '#702d34', accentSecondary: '#dac7ac' },
  { slug: 'beth-gauna', name: 'Beth Gauna', status: 'Cliente', statusEn: 'Client', image: '/project-previews/beth-gauna.png', href: 'https://www.betegauna.com.br', summary: 'Transformei o trabalho de caligrafia e engraving em uma experiência visual mais sofisticada. O projeto foi estruturado para valorizar o processo artesanal, apresentar os serviços com clareza e facilitar o contato para novos pedidos.', summaryEn: 'I turned the work of calligraphy and engraving into a more sophisticated visual experience. The project highlights the handmade process, presents the services clearly, and makes it easier for new clients to get in touch.', role: 'Direção visual, design de interface e desenvolvimento front-end.', roleEn: 'Visual direction, interface design, and front-end development.', deliverables: 'Site de portfólio, apresentação de serviços e experiência de contato.', deliverablesEn: 'Portfolio website, service presentation, and contact experience.', technologies: ['Interface', 'Front-end', 'Design responsivo'], technologiesEn: ['Interface', 'Front-end', 'Responsive design'], year: '2026', disciplines: 'Web design · Desenvolvimento', accent: '#4a352a', accentPrimary: '#c9a96e', accentSecondary: '#f3ece1' },
  { slug: 'zarah-flor', name: 'Zarah Flor', status: 'Conceito', statusEn: 'Concept', image: '/project-previews/zarah-flor.png', href: 'https://zarahflor.vercel.app', summary: 'Criei uma presença digital para uma marca de cuidados especializada em pele negra. A direção visual usa tons terrosos, fotografia e tipografia editorial para comunicar acolhimento, autoestima e conhecimento técnico.', summaryEn: 'I created a digital presence for a care brand specializing in Black skin. Earthy tones, photography, and editorial typography communicate warmth, self-esteem, and technical knowledge.', role: 'Conceito visual, design de interface e desenvolvimento front-end.', roleEn: 'Visual concept, interface design, and front-end development.', deliverables: 'Site institucional, apresentação de tratamentos e experiência focada em agendamentos.', deliverablesEn: 'Institutional website, treatment presentation, and appointment-focused experience.', technologies: ['Interface', 'Front-end', 'Design responsivo'], technologiesEn: ['Interface', 'Front-end', 'Responsive design'], year: '2026', disciplines: 'Direção visual · Web design', accent: '#623f32', accentPrimary: '#8e4b32', accentSecondary: '#3b241e' },
  { slug: 'tarot-da-joli', name: 'Tarot da Joli', status: 'Cliente', statusEn: 'Client', image: '/project-previews/tarot-da-joli.png', href: 'https://www.tarotdajoli.com.br', summary: 'Desenvolvi uma interface mística, mas simples de usar, para apresentar as leituras e orientar a pessoa até o agendamento. A navegação foi pensada para transmitir calma, intimidade e confiança, sem deixar o conteúdo confuso.', summaryEn: 'I developed a mystical interface that remains simple to use, presenting the readings and guiding people toward booking. The navigation is designed to feel calm, intimate, and trustworthy without making the content confusing.', role: 'Direção visual, design de interface e desenvolvimento front-end.', roleEn: 'Visual direction, interface design, and front-end development.', deliverables: 'Apresentação de serviços, fluxo de leituras e experiência de contato via WhatsApp.', deliverablesEn: 'Service presentation, tarot reading flow, and WhatsApp contact experience.', technologies: ['Interface', 'Front-end', 'Design responsivo'], technologiesEn: ['Interface', 'Front-end', 'Responsive design'], year: '2026', disciplines: 'Web design · Desenvolvimento', accent: '#3f2e54', accentPrimary: '#6b3fa0', accentSecondary: '#d6ae57' },
  { slug: 'rafael-montenegro', name: 'Rafael Montenegro Advocacia', status: 'Conceito', statusEn: 'Concept', image: '/project-previews/rafael-montenegro.png', href: 'https://rafaelmontenegro-advocacia.vercel.app', summary: 'Estruturei o conteúdo para transformar serviços jurídicos complexos em uma comunicação mais direta. O site prioriza clareza, credibilidade e caminhos rápidos para encontrar uma solução ou iniciar um atendimento.', summaryEn: 'I structured the content to make complex legal services more direct and understandable. The site prioritizes clarity, credibility, and quick paths to find a solution or start a consultation.', role: 'Direção visual, design de interface e desenvolvimento front-end.', roleEn: 'Visual direction, interface design, and front-end development.', deliverables: 'Site institucional, apresentação da atuação e interface focada em consultas.', deliverablesEn: 'Institutional website, practice presentation, and consultation-focused interface.', technologies: ['Interface', 'Front-end', 'Design responsivo'], technologiesEn: ['Interface', 'Front-end', 'Responsive design'], year: '2026', disciplines: 'Direção visual · Web design', accent: '#263746', accentPrimary: '#294c55', accentSecondary: '#b89b62' },
  { slug: 'sem-panelinha', name: 'Sem Panelinha', status: 'Autoral', statusEn: 'Independent', image: '/project-previews/sem-panelinha.png', href: 'https://sempanelinha.vercel.app', summary: 'Organizei a proposta e os conteúdos da marca em uma experiência mais leve e fácil de explorar. O foco foi apresentar o produto com personalidade, sem excesso de informação e com uma navegação mais objetiva.', summaryEn: 'I organized the brand’s proposition and content into a lighter experience that is easier to explore. The focus was to present the product with personality, less information overload, and more objective navigation.', role: 'Conceito, design de interface e desenvolvimento front-end.', roleEn: 'Concept, interface design, and front-end development.', deliverables: 'Conceito digital, interface responsiva e apresentação interativa.', deliverablesEn: 'Digital concept, responsive interface, and interactive presentation.', technologies: ['Interface', 'Front-end', 'Design responsivo'], technologiesEn: ['Interface', 'Front-end', 'Responsive design'], year: '2026', disciplines: 'Produto digital · Desenvolvimento', accent: '#25352f', accentPrimary: '#b4d333', accentSecondary: '#3b5fd7' },
  { slug: 'dex-plus', name: 'Dex+', status: 'Autoral', statusEn: 'Independent', image: '/project-previews/dex-plus.png', href: 'https://dex-plus.vercel.app', summary: 'Criei uma experiência digital inspirada em interfaces de tecnologia e dados. O projeto transforma informações e funcionalidades em uma interface visual, rápida e intuitiva, com foco em exploração e descoberta.', summaryEn: 'I created a digital experience inspired by technology and data interfaces. The project turns information and functionality into a visual, fast, intuitive interface focused on exploration and discovery.', role: 'Conceito de produto, design de interface e desenvolvimento front-end.', roleEn: 'Product concept, interface design, and front-end development.', deliverables: 'Interface interativa, experiência de navegação Pokémon e fluxo responsivo de produto.', deliverablesEn: 'Interactive interface, Pokémon browsing experience, and responsive product flow.', technologies: ['Interface', 'Front-end', 'Design responsivo'], technologiesEn: ['Interface', 'Front-end', 'Responsive design'], year: '2026', disciplines: 'Produto digital · Desenvolvimento', accent: '#17356a', accentPrimary: '#2f5bff', accentSecondary: '#ff3b4d' },
].map((project) => ({
  ...project,
  imageFit: ['sem-panelinha', 'dex-plus'].includes(project.slug) ? 'contain' : 'cover',
  imagePosition: 'top center',
  metadataPt: 'DESIGN + DEVELOPMENT / ' + project.year + ' / ' + project.status.toUpperCase(),
  metadataEn: 'DESIGN + DEVELOPMENT / ' + project.year + ' / ' + project.statusEn.toUpperCase(),
}));
const texts = {
  pt: { email: 'E-mail', instagram: 'Instagram', work: 'Projetos', about: 'Sobre', contact: 'Contato', role: 'Web Designer & Developer', lead: 'Ideias próprias.', rest: 'Produtos à altura.', intro: 'Design e desenvolvimento para transformar ideias em produtos digitais com identidade, clareza e propósito.', start: 'Começar um projeto', explore: 'Explorar projetos', selected: 'Projetos selecionados', hint: 'Arraste ou use as setas', view: 'Ver projeto', roleLabel: 'Meu papel', deliverablesLabel: 'Entregas', technologiesLabel: 'Tecnologias', aboutTitle: 'Design com identidade. Código com intenção.', aboutBody: 'Sou o Edu. Trabalho entre design e desenvolvimento, procurando o ponto em que uma ideia deixa de parecer template e começa a ter identidade. Crio sites para profissionais e pequenas marcas que querem se apresentar de um jeito mais próprio.', aboutBaseLabel: 'Base', aboutBase: 'São Paulo, Brasil', aboutFocusLabel: 'Foco', aboutFocus: 'Web design + Front-end', aboutAvailabilityLabel: 'Disponibilidade', aboutAvailability: 'Projetos freelance', contactTitle: 'Tem um projeto em mente?', contactBody: 'Vamos criar uma presença que realmente pareça sua.', contactAction: 'Conversar sobre o projeto', contactProtocol: 'CONTATO', close: 'Fechar', back: 'Voltar aos projetos', next: 'Próximo projeto', context: 'Contexto', contribution: 'Contribuição', contributionValue: 'Design e desenvolvimento', location: 'São Paulo, Brasil', footerWork: 'Web design · Desenvolvimento', previousProject: 'Projeto anterior', nextProject: 'Próximo projeto', selectProject: 'Selecionar projeto', screenshotOf: 'Screenshot do projeto', fullPreviewOf: 'Preview completo de' },
  en: { email: 'Email', instagram: 'Instagram', work: 'Work', about: 'About', contact: 'Contact', role: 'Web Designer & Developer', lead: 'Original ideas.', rest: 'Digital products to match.', intro: 'Design and development that transforms ideas into digital products with identity, clarity, and purpose.', start: 'Start a project', explore: 'Explore projects', selected: 'Selected work', hint: 'Drag or use the arrows', view: 'View project', roleLabel: 'My role', deliverablesLabel: 'Deliverables', technologiesLabel: 'Technologies', aboutTitle: 'Design with identity. Code with intention.', aboutBody: 'I’m Edu. I work between design and development, looking for the point where an idea stops feeling like a template and starts having an identity. I create websites for professionals and small brands that want to present themselves in a more distinctive way.', aboutBaseLabel: 'Base', aboutBase: 'São Paulo, Brazil', aboutFocusLabel: 'Focus', aboutFocus: 'Web design + Front-end', aboutAvailabilityLabel: 'Availability', aboutAvailability: 'Freelance projects', contactTitle: 'Have a project in mind?', contactBody: 'Let’s create a presence that truly feels like yours.', contactAction: 'Talk about your project', contactProtocol: 'CONTACT', close: 'Close', back: 'Back to work', next: 'Next project', context: 'Context', contribution: 'Contribution', contributionValue: 'Design and development', location: 'São Paulo, Brazil', footerWork: 'Web design · Development', previousProject: 'Previous project', nextProject: 'Next project', selectProject: 'Select project', screenshotOf: 'Project screenshot', fullPreviewOf: 'Full preview of' },
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
  useEffect(() => { trackPageView(); }, [path]);
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
    <nav className="desktop-nav" aria-label="Primary navigation"><a {...makeLink('projetos')}>{copy.work}</a><button type="button" onClick={(event) => onAbout?.(event.currentTarget)}>{copy.about}</button><a {...makeLink('contato')}>{copy.contact}</a></nav>
    <div className="header-actions"><button className="language-toggle" type="button" onClick={toggleLocale}><b>{localeLabel(copy)}</b> / {localeLabel(copy, true)}</button><button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><span /><span /><span /></button></div>
    <nav id="mobile-nav" className={'mobile-nav' + (open ? ' is-open' : '')} aria-label="Mobile navigation"><a {...makeLink('projetos')}>{copy.work}<Arrow /></a><button type="button" onClick={(event) => { setOpen(false); onAbout?.(event.currentTarget); }}>{copy.about}<Arrow /></button><a {...makeLink('contato')}>{copy.contact}<Arrow /></a></nav>
  </div></header>;
}

function localeLabel(copy, alternate = false) { return copy.work === 'Projetos' ? (alternate ? 'EN' : 'PT') : (alternate ? 'PT' : 'EN'); }

function trackContactClick(href) {
  if (href === contact.whatsapp) trackEvent('whatsapp_click');
  if (href.startsWith('mailto:')) trackEvent('email_click');
  if (href === contact.instagram) trackEvent('instagram_click');
}
function hexToRgbChannels(hex) {
  const value = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) return '47, 91, 255';
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16)).join(', ');
}

function accentLastWord(text) { const words = text.split(" "); return <>{words.slice(0, -1).join(" ")} <span className="contact-title-accent">{words[words.length - 1]}</span></>; }

function Home({ copy, locale, navigate, toggleLocale }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutTriggerRef = useRef(null);
  return <div className="site-shell"><Header copy={copy} navigate={navigate} toggleLocale={toggleLocale} onAbout={(trigger) => { aboutTriggerRef.current = trigger; setAboutOpen(true); }} /><main><section className="compact-hero"><div className="shell hero-grid"><div className="hero-main-content"><p className="hero-kicker"><span className="hero-label">EDU.PINHEIRO / {copy.role.toUpperCase()}</span></p><h1 className="hero-title"><span>{copy.lead}</span><span>{copy.rest}</span></h1><div className="hero-bottom-row"><div className="hero-intro"><p>{copy.intro}</p><a className="text-cta" href={contact.whatsapp} target="_blank" rel="noreferrer" onClick={() => { trackEvent('whatsapp_click'); trackEvent('contact_cta_click'); }}>{copy.start}<Arrow external /></a></div><a className="hero-scroll" href="#projetos" onClick={(event) => { event.preventDefault(); navigate('#projetos'); }}>{copy.explore}<span aria-hidden="true">↓</span></a></div></div><div className="hero-art" aria-hidden="true"><span className="hero-signature-entry"><Magnet padding={80} magnetStrength={8} maxOffset={5} activeTransition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" inactiveTransition="transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" wrapperClassName="hero-signature-magnet" innerClassName="hero-signature-magnet-inner"><span className="hero-mark">/E</span></Magnet></span><i className="hero-cross" /><i className="hero-dots" /><i className="hero-rule" /></div></div></section><HeroCarousel copy={copy} locale={locale} /><section className="compact-contact" id="contato"><div className="shell contact-inner"><div><span className="section-kicker contact-protocol"><b>03</b> / {copy.contactProtocol}</span><h2>{accentLastWord(copy.contactTitle)}</h2><p>{copy.contactBody}</p></div><a className="contact-cta" href={contact.whatsapp} target="_blank" rel="noreferrer" onClick={() => { trackEvent('whatsapp_click'); trackEvent('contact_cta_click'); }}>{copy.contactAction}<Arrow external /></a></div></section></main><Footer copy={copy} />{aboutOpen && <AboutPanel copy={copy} close={() => { setAboutOpen(false); requestAnimationFrame(() => aboutTriggerRef.current?.focus()); }} />}</div>;
}

function HeroCarousel({ copy, locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationLockRef = useRef(false);
  const swipeStart = useRef(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const projectsRef = useRef(null);
  const [projectsInView, setProjectsInView] = useState(false);
  const stageRef = useRef(null);
  useEffect(() => {
    const section = projectsRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') { setProjectsInView(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setProjectsInView(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  const active = projects[activeIndex];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 0 : .42;
  const ease = [0.22, 1, 0.36, 1];
  const previous = projects[(activeIndex - 1 + projects.length) % projects.length];
  const next = projects[(activeIndex + 1) % projects.length];
  const counterText = `${String(activeIndex + 1).padStart(2, '0')} / 07`;
  const metadata = locale === 'pt' ? active.metadataPt : active.metadataEn;
  const detailItems = [
    { label: copy.roleLabel, value: locale === 'pt' ? active.role : active.roleEn },
    { label: copy.deliverablesLabel, value: locale === 'pt' ? active.deliverables : active.deliverablesEn },
    { label: copy.technologiesLabel, value: (locale === 'pt' ? active.technologies : active.technologiesEn).join(' · ') },
  ];
  const slideVariants = {
    enter: (sign) => ({
      x: reduced ? 0 : sign > 0 ? 36 : -36,
      y: 0,
      opacity: reduced ? 1 : 0,
      scale: reduced ? 1 : .985,
    }),
    center: { x: 0, y: 0, opacity: 1, scale: 1 },
    exit: (sign) => ({
      x: reduced ? 0 : sign > 0 ? -36 : 36,
      y: 0,
      opacity: reduced ? 1 : 0,
      scale: reduced ? 1 : .985,
    }),
  };

  const select = (index, nextDirection = index > activeIndex ? 1 : -1) => {
    if (animationLockRef.current || index === activeIndex) return;
    animationLockRef.current = true;
    trackEvent('project_open', { project_name: projects[index].name });
    setDirection(nextDirection);
    setIsAnimating(true);
    setActiveIndex(index);
  };
  const move = (delta) => select((activeIndex + delta + projects.length) % projects.length, delta > 0 ? 1 : -1);
  const onPointerDown = (event) => {
    if (animationLockRef.current) return;
    swipeStart.current = { x: event.clientX, pointerId: event.pointerId, pointerType: event.pointerType };
    if (event.pointerType !== 'touch') return;
    setSwipeOffset(0);
    setIsTouching(true);
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch {}
  };
  const onPointerMove = (event) => {
    const start = swipeStart.current;
    if (!start || event.pointerId !== start.pointerId || animationLockRef.current) return;
    const delta = event.clientX - start.x;
    if (start.pointerType !== 'touch') {
      if (Math.abs(delta) > 48) { swipeStart.current = null; move(delta < 0 ? 1 : -1); }
      return;
    }
    setSwipeOffset(Math.max(-64, Math.min(64, delta)));
  };
  const onPointerUp = (event) => {
    const start = swipeStart.current;
    if (!start || event.pointerId !== start.pointerId) return;
    const delta = event.clientX - start.x;
    swipeStart.current = null;
    if (start.pointerType !== 'touch') return;
    setSwipeOffset(0);
    setIsTouching(false);
    if (Math.abs(delta) >= 56) move(delta < 0 ? 1 : -1);
  };
  const onPointerCancel = () => {
    swipeStart.current = null;
    setSwipeOffset(0);
    setIsTouching(false);
  };
  const onKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  };

  const swipeTilt = Math.max(-2, Math.min(2, swipeOffset * 0.035));
  const ambientStyle = {
    '--ambient-primary-rgb': hexToRgbChannels(active.accentPrimary),
    '--ambient-secondary-rgb': hexToRgbChannels(active.accentSecondary),
  };

  return <section ref={projectsRef} className={`hero-carousel projects-section${projectsInView ? ' is-in-view' : ''}`} id="projetos" style={{ '--active-accent': active.accent, '--project-primary': active.accentPrimary, '--project-secondary': active.accentSecondary }}>
    <div className="projects-background" aria-hidden="true">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`ambient-${active.slug}`}
          className={`project-ambient-layer project-ambient-layer--${active.slug}`}
          style={ambientStyle}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : .55, ease }}
        />
      </AnimatePresence>
    </div>
    <div className="shell carousel-shell projects-content">
      <div className="carousel-topline">
        <div><span className="section-kicker">01</span><h2 id="projects-title">{copy.selected}</h2><span className="mobile-swipe-hint">{copy.hint}<span aria-hidden="true"> ↔</span></span></div>
        <DecryptedText key={`${active.slug}-${locale}-counter`} text={counterText} speed={25} maxIterations={6} sequential revealDirection="start" animateOn="view" useOriginalCharsOnly={false} characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+:._" duration={350} parentClassName="counter decrypted-counter" encryptedClassName="is-encrypted" aria-live="polite" />
      </div>
      <div ref={stageRef} className="carousel-stage" onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} tabIndex="0" aria-labelledby="projects-title">
        <NeighborProject project={previous} side="previous" locale={locale} copy={copy} onSelect={() => move(-1)} />
        <div className="carousel-active-slot project-slide-stack">
          <AnimatePresence mode="sync" initial={false} custom={direction}>
            <motion.article key={active.slug} className="active-project-card" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration, ease }} onAnimationComplete={(definition) => { if (definition === 'center') { animationLockRef.current = false; setIsAnimating(false); } }}>
              <div className={`mobile-swipe-visual${isTouching ? ' is-touching' : ''}`} style={{ '--mobile-swipe-offset': `${swipeOffset}px`, '--mobile-swipe-tilt': `${swipeTilt}deg` }}><ProjectBrowserFrame
                project={active}
                number={String(activeIndex + 1).padStart(2, '0')}
                metadata={<DecryptedText key={`${active.slug}-${locale}-metadata`} text={metadata} speed={25} maxIterations={6} sequential revealDirection="start" animateOn="view" useOriginalCharsOnly={false} characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+:._" duration={350} parentClassName="text-scramble project-metadata" encryptedClassName="is-encrypted" />}
              >
                <img src={active.image} alt={copy.screenshotOf + ' ' + active.name} />
              </ProjectBrowserFrame>
              <span className="carousel-scanline" aria-hidden="true" />
            </div>
            </motion.article>
          </AnimatePresence>
        <BorderBeam size={140} duration={10} borderWidth={1} colorFrom="#00E5FF" colorTo="#E600A9" className="carousel-border-beam" />
        </div>
        <NeighborProject project={next} side="next" locale={locale} copy={copy} onSelect={() => move(1)} />
        <button className="carousel-arrow carousel-arrow--previous" type="button" aria-label={copy.previousProject} onClick={() => move(-1)} disabled={isAnimating}>←</button>
        <button className="carousel-arrow carousel-arrow--next" type="button" aria-label={copy.nextProject} onClick={() => move(1)} disabled={isAnimating}>→</button>
      </div>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div key={active.slug} className="carousel-info" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .32, ease }}>
          <div className="carousel-info-main">
            <div className="project-info"><span className="project-number">{String(activeIndex + 1).padStart(2, '0')}</span><div><h3>{active.name}</h3><p className="status">{locale === 'pt' ? active.status : active.statusEn}</p></div></div>
            <div className="carousel-meta"><p className="summary">{locale === 'pt' ? active.summary : active.summaryEn}</p><a className="slide-link" href={active.href} target="_blank" rel="noreferrer" onClick={() => trackEvent('project_open', { project_name: active.name })}>{copy.view}<Arrow external /></a></div>
          </div>
          <div className="project-details">
            {detailItems.map((item) => <div className="project-detail" key={item.label}><span className="project-detail-label">{item.label}</span><p className="project-detail-value">{item.value}</p></div>)}
          </div>
        </motion.div>
      </AnimatePresence>
      <ProjectPicker projects={projects} activeIndex={activeIndex} locale={locale} onSelect={select} disabled={isAnimating} copy={copy} />
    </div>
  </section>;
}

function NeighborProject({ project, side, locale, onSelect, copy }) {
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const number = String(projectIndex + 1).padStart(2, '0');
  return <button className={'carousel-neighbor carousel-neighbor--' + side} type="button" onClick={onSelect} aria-label={copy.selectProject + ' ' + project.name}>
    <span className="neighbor-media"><ProjectBrowserFrame project={project} number={number} compact><img src={project.image} alt="" /></ProjectBrowserFrame></span>
    <span className="neighbor-label"><small>{number}</small><strong>{project.name}</strong><em>{locale === 'pt' ? project.status : project.statusEn}</em></span>
  </button>;
}

function ProjectPicker({ projects: items, activeIndex, locale, onSelect, disabled, copy }) {
  return <nav className="project-picker" aria-label={copy.selectProject}>{items.map((project, index) => <button key={project.slug} className={index === activeIndex ? 'is-active' : ''} type="button" aria-current={index === activeIndex ? 'true' : undefined} disabled={disabled} onClick={() => onSelect(index)}><small>{String(index + 1).padStart(2, '0')}</small><span>{project.name === 'Instituto Nastri' ? 'Nastri' : project.name === 'Rafael Montenegro Advocacia' ? 'Rafael' : project.name}</span></button>)}</nav>;
}

function AboutPanel({ copy, close }) {
  const closeRef = useRef(null);
  const openerRef = useRef(document.activeElement);
  const facts = [[copy.aboutBaseLabel, copy.aboutBase], [copy.aboutFocusLabel, copy.aboutFocus], [copy.aboutAvailabilityLabel, copy.aboutAvailability]];
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && close();
    document.body.classList.add('modal-open');
    closeRef.current?.focus();
    addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('modal-open'); removeEventListener('keydown', onKey); };
  }, [close]);
  return <div className="about-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}><aside className="about-panel" role="dialog" aria-modal="true" aria-labelledby="about-title"><button ref={closeRef} className="panel-close" type="button" onClick={close} aria-label={copy.close}>×</button><span className="section-kicker">02</span><h2 id="about-title">{copy.aboutTitle}</h2><p>{copy.aboutBody}</p><div className="about-facts">{facts.map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><strong className="about-signature">Edu <span>Pinheiro</span></strong></aside></div>;
}

function Footer({ copy }) {
  const links = [['WhatsApp', contact.whatsapp], [copy.email, 'mailto:' + contact.email], ['GitHub', contact.github], [copy.instagram, contact.instagram]];
  return <footer className="compact-footer"><div className="shell"><div className="footer-row"><span>Edu Pinheiro, {copy.role}</span><span>{copy.location}</span></div><div className="footer-links">{links.map(([name, href]) => <a key={name + href} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" onClick={() => trackContactClick(href)}><span>{name}</span><Arrow external /></a>)}</div><div className="footer-bottom"><span>© Edu Pinheiro</span><span>{copy.footerWork}</span></div></div></footer>;
}

function CasePage({ project, copy, locale, navigate, toggleLocale }) {
const trackedProjectRef = useRef(null);
  useEffect(() => {
    if (trackedProjectRef.current === project.slug) return;
    trackedProjectRef.current = project.slug;
    trackEvent('project_open', { project_name: project.name });
  }, [project.slug]);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <div className="site-shell"><Header copy={copy} navigate={navigate} toggleLocale={toggleLocale} casePage /><main><section className="case-hero shell"><a className="back-link" href="/#projetos" onClick={(event) => { event.preventDefault(); navigate('/#projetos'); }}>← {copy.back}</a><div className="case-title-block"><span className="project-number">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span className="status">{locale === 'pt' ? project.status : project.statusEn}</span><h1>{project.name}</h1><p>{locale === 'pt' ? project.summary : project.summaryEn}</p></div></section><section className="case-image shell"><img src={project.image} alt={copy.fullPreviewOf + ' ' + project.name} /></section><section className="case-details shell"><div><small>{copy.context}</small><p>{locale === 'pt' ? project.summary : project.summaryEn}</p></div><div><small>{copy.contribution}</small><p>{copy.contributionValue}</p></div><div><a className="text-cta" href={project.href} target="_blank" rel="noreferrer">{copy.view}<Arrow external /></a></div></section><section className="case-next shell"><span>{copy.next}</span><a href={'/projetos/' + next.slug} onClick={(event) => { event.preventDefault(); navigate('/projetos/' + next.slug); }}><strong>{next.name}</strong><Arrow /></a></section></main><Footer copy={copy} /></div>;
}

createRoot(document.getElementById('root')).render(
  <>
    <SplashCursor
      SIM_RESOLUTION={64}
      DYE_RESOLUTION={256}
      CAPTURE_RESOLUTION={256}
      DENSITY_DISSIPATION={4.8}
      VELOCITY_DISSIPATION={2.4}
      PRESSURE={0.1}
      PRESSURE_ITERATIONS={12}
      CURL={3}
      SPLAT_RADIUS={0.06}
      SPLAT_FORCE={2000}
      SHADING={false}
      COLOR_UPDATE_SPEED={1.5}
      TRANSPARENT
    />
    <StrictMode>
      <App />
    </StrictMode>
  </>
);








