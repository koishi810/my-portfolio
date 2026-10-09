import ProjectDetailTemplate from "../../templates/ProjectDetailTemplate.jsx";
import { placeholderProjects } from "../../data/projects.js";
export default function EmotionBloom() {
  return <ProjectDetailTemplate project={placeholderProjects["emotion-bloom"]} />;
}
