import { featuredProjects } from "./projects.js";
import { matryoshkaProject } from "./matryoshka.js";
import { sugarProject } from "./sugarN.js";
import { iroHyohonProject } from "./iroHyohon.js";

// Directory-specific presentation keeps the existing home cards unchanged.
export const directoryProjects = [...featuredProjects, matryoshkaProject, sugarProject, iroHyohonProject].map((project) => ({
  ...project,
  detailHref: project.href,
  directoryImage: project.slug === "koko"
    ? "/assets/directory/koko-logo.svg"
    : project.slug === "flower-machine"
      ? "/assets/directory/flower-machine.png"
      : project.image,
}));

export const workCategories = [
  { id: "ui-ux", number: "01", label: "UI/UX", projectSlugs: ["koko"] },
  { id: "graphic", number: "02", label: "グラフィック", projectSlugs: ["arctic-lab", "sn"] },
  { id: "interaction", number: "03", label: "インタラクション", projectSlugs: ["flower-machine"] },
  { id: "other", number: "04", label: "その他", projectSlugs: ["matryoshka", "iro-hyohon"] },
  { id: "photography", number: "05", label: "写真・記録", projectSlugs: [], gallery: "photography" },
  { id: "illustration", number: "06", label: "イラストレーション", projectSlugs: [], gallery: "illustration" },
];
