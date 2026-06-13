import ProjectDetailTemplate from "../../templates/ProjectDetailTemplate.jsx";
import { emotionBloomContent } from "../../data/projects/emotionBloomContent.js";
import "../../styles/project.css";

export default function EmotionBloom() {
  return <ProjectDetailTemplate project={emotionBloomContent} />;
}
