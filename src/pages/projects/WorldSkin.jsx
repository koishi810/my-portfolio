import ProjectDetailTemplate from "../../templates/ProjectDetailTemplate.jsx";
import { placeholderProjects } from "../../data/projects.js";
export default function WorldSkin() {
  return <ProjectDetailTemplate project={placeholderProjects["world-skin"]} />;
}
