import type { CSSProperties, ReactNode } from 'react';

interface ProjectFrameData {
  slug: string;
  href?: string;
  image: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
}

interface ProjectBrowserFrameProps {
  project: ProjectFrameData;
  number: string;
  metadata?: ReactNode;
  compact?: boolean;
  children: ReactNode;
}

function displayUrl(project: ProjectFrameData) {
  if (!project.href) return project.slug;
  try {
    return new URL(project.href).hostname.replace(/^www\./, '');
  } catch {
    return project.slug;
  }
}

export default function ProjectBrowserFrame({
  project,
  number,
  metadata,
  compact = false,
  children,
}: ProjectBrowserFrameProps) {
  const contain = project.imageFit === 'contain';

  return (
    <div
      className={`slide-frame project-browser-frame${compact ? ' is-compact' : ''}`}
      style={
        {
          '--project-image-fit': project.imageFit ?? 'contain',
          '--project-image-position': project.imagePosition ?? 'top center',
        } as CSSProperties
      }
    >
      <div className="browser-bar project-browser-bar">
        <div className="project-browser-leading">
          <span className="browser-controls" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {!compact && metadata}
        </div>
        {!compact && <span className="project-browser-url">{displayUrl(project)}</span>}
        {!compact && <span className="project-browser-code">PROJECT_{number}</span>}
      </div>
      <div className="slide-media project-browser-screen">
        {contain && (
          <img
            className="project-browser-backdrop"
            src={project.image}
            alt=""
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    </div>
  );
}
