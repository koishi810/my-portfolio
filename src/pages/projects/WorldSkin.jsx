import ProjectDetailTemplate from "../../templates/ProjectDetailTemplate.jsx";
import { worldSkinContent } from "../../data/projects/worldSkinContent.js";
import "../../styles/project.css";

export default function WorldSkin() {
  return <ProjectDetailTemplate project={worldSkinContent} />;
}
