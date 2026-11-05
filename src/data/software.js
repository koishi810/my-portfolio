// Levels are supplied by the author on a 1–5 scale. null means not yet rated.
// A missing icon intentionally uses the application name, never a substitute logo.
export const softwareGroups = [
  {
    title: "スキル",
    items: [
      { id: "photoshop", name: "Photoshop", icon: "photoshop", level: null },
      { id: "illustrator", name: "Illustrator", icon: "illustrator", level: null },
      { id: "procreate", name: "Procreate", icon: "procreate", monochromeBrush: true, extension: "png", level: null },
      { id: "lightroom", name: "Adobe Lightroom", icon: "lightroom-simple", level: null },
      { id: "premierepro", name: "Premiere Pro", icon: "premierepro-plain", level: null },
      { id: "aftereffects", name: "After Effects", icon: "aftereffects-plain", level: null },
      { id: "blender", name: "Blender", icon: "blender", level: null },
      { id: "rhinoceros", name: "Rhino / Grasshopper", icon: "rhinoceros", level: null },
      { id: "figma", name: "Figma", icon: "figma", level: null },
      { id: "processing", name: "Processing", icon: "processing", level: null },
      { id: "godotengine", name: "Godot", icon: "godotengine", level: null },
    ],
  },
  {
    title: "AI補助",
    items: [
      { id: "chatgpt", name: "ChatGPT", icon: "chatgpt", level: null },
      { id: "googlegemini", name: "Gemini", icon: "googlegemini", level: null },
    ],
  },
];
