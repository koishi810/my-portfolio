export default function ProjectDetailTemplate({ project }) {
  return (
    <main className="page project-page">
      <h1>{project?.title || "Project Detail Placeholder"}</h1>
      {project?.subtitle ? <p>{project.subtitle}</p> : null}
    </main>
  );
}
