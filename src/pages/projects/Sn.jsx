import ProjectDetailTemplate from "../../templates/ProjectDetailTemplate.jsx";
import { snContent } from "../../data/projects/snContent.js";
import "../../styles/project.css";

export default function Sn() {
  return <ProjectDetailTemplate project={snContent} />;
}
