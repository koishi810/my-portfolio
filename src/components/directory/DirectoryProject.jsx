import SiteAnchor from "../SiteAnchor.jsx";
export default function DirectoryProject({ project }) {
  const clearPointerFocus = (event) => {
    event.currentTarget.removeAttribute("data-pointer-focus");
  };
  const image = (
    <img
      alt={project.imageLabel}
      decoding="async"
      loading="lazy"
      src={project.image}
    />
  );

  return (
    <article className={`directory-project directory-project-${project.slug}`} id={`work-${project.slug}`}>
      <div className="directory-project-copy">
        {project.date ? <p className="directory-project-date">{project.date}</p> : null}
        <h3>
          <span>{project.title}</span>
          {project.subtitle ? <span>{project.subtitle}</span> : null}
        </h3>
        <p className="directory-project-type">{project.type}</p>
        <p className="directory-project-description">{project.description}</p>
      </div>
      {project.detailHref ? (
        <SiteAnchor
          className="directory-project-image"
          href={project.detailHref}
          aria-label={`${project.title} project`}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            // A previously keyboard-focused native link can retain its ring
            // through pointer navigation and Back. Preserve focus, track input.
            event.currentTarget.setAttribute("data-pointer-focus", "true");
          }}
          onPointerCancel={clearPointerFocus}
          onKeyDown={clearPointerFocus}
          onBlur={clearPointerFocus}
        >
          {image}
        </SiteAnchor>
      ) : (
        <figure className="directory-project-image">{image}</figure>
      )}
    </article>
  );
}
