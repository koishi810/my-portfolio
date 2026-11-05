import { featuredProjects } from "./projects.js";

// Shared portfolio facts plus the author's confirmed series metadata.
export const arcticLabProject = featuredProjects.find((project) => project.slug === "arctic-lab");
export const arcticLabBackground = "/assets/projects/arctic-lab/background.jpg";

// New album supplied by the author. Keep the cover before the lyric spread;
// reserve introduction space until the author supplies the copy.
export const arcticLabLeaveAlbum = {
  title: "生息-Leave in breath",
  paragraphs: [],
  images: [
    { id: "arctic-leave-cover", src: "/assets/projects/arctic-lab/leave-cover.webp", alt: "生息-Leave in breath：表紙・裏表紙の見開きデザイン", width: 2048, height: 1066, caption: "" },
    { id: "arctic-leave-lyrics", src: "/assets/projects/arctic-lab/leave-lyrics.webp", alt: "生息-Leave in breath：歌詞の見開きデザイン", width: 2048, height: 1065, caption: "" },
  ],
};

// Attachment order is authoritative. The fourth card is the reverse;
// no association between a front and a specific album is inferred.
export const arcticLabMaterials = {
  title: "特典",
  description: "各アルバムのCDに同封する特典として制作した、タロットカードのシリーズです。",
  photographs: [
    { id: "arctic-tarot-photo-01", src: "/assets/projects/arctic-lab/tarot-photo-01.jpg", alt: "ARCTICLAB：タロットカードの表面と裏面の実物写真 1", width: 1024, height: 768, caption: "" },
    { id: "arctic-tarot-photo-02", src: "/assets/projects/arctic-lab/tarot-photo-02.jpg", alt: "ARCTICLAB：タロットカードの表面と裏面の実物写真 2", width: 1024, height: 768, caption: "" },
  ],
};

export const arcticLabTarot = [
  { id: "arctic-tarot-front-01", src: "/assets/projects/arctic-lab/tarot-front-01.webp", alt: "ARCTICLAB：アルバム付属のタロットカード、表面 1", width: 1024, height: 2048, caption: "" },
  { id: "arctic-tarot-front-02", src: "/assets/projects/arctic-lab/tarot-front-02.webp", alt: "ARCTICLAB：アルバム付属のタロットカード、表面 2", width: 1024, height: 2048, caption: "" },
  { id: "arctic-tarot-front-03", src: "/assets/projects/arctic-lab/tarot-front-03.webp", alt: "ARCTICLAB：アルバム付属のタロットカード、表面 3", width: 1024, height: 2048, caption: "" },
  { id: "arctic-tarot-back", src: "/assets/projects/arctic-lab/tarot-back.webp", alt: "ARCTICLAB：アルバム付属のタロットカード、裏面", width: 1024, height: 2048, caption: "" },
];

export const arcticLabMetadata = [
  ["制作形式", "個人制作"],
  ["制作時期", arcticLabProject.date],
  ["制作内容", "アルバムアートワーク\nロゴタイプ"],
  ["担当範囲", "グラフィックデザイン・\nコンセプトデザイン・\nロゴデザイン"],
  ["使用ツール", "Adobe Photoshop /\nAdobe Illustrator /\nBlender"],
];

// The author requested the cover before the lyrics. Keep original proportions.
// Caption is optional; no album names, dates or credits are assumed here.
export const arcticLabImages = [
  { id: "arctic-cover", label: "IMAGE 01", src: "/assets/projects/arctic-lab/echo-01.png", alt: "迴声-Narcissus：クレジットとイラストの見開き表紙", width: 2048, height: 1065, caption: "" },
  { id: "arctic-lyrics", label: "IMAGE 02", src: "/assets/projects/arctic-lab/echo-02.png", alt: "迴声-Narcissus：歌詞と花の見開きデザイン", width: 2048, height: 1065, caption: "" },
];

// Approved album copy. The series has three albums; these four images all
// present this one album, rather than representing four separate releases.
export const arcticLabAlbum = {
  title: "迴声-Narcissus",
  photographTitle: "実物イメージ",
  paragraphs: [
    "声を発し、その反響を受け取るたびに、人は自分と向き合い、これまでの認識や束縛を乗り越えていく。その繰り返しをテーマに、水面の自分に心を奪われたナルキッソスの姿を重ねた。自分への執着を貫き、自らを燃やして進む存在として、その美しさと強さを表現した。",
    "ソ連の未来主義を手がかりに、ブルータリズムを思わせるコンクリートの3Dモデルと、生命を象徴する水仙を組み合わせた。無機質な構造と花の対比を、アルバム全体のビジュアルに展開している。",
  ],
  photographs: [
    { id: "arctic-photo-01", label: "PHOTO 01", src: "/assets/projects/arctic-lab/narcissus-photo-01.jpg", alt: "迴声-Narcissus：CDと歌詞冊子の実物写真", width: 2048, height: 1365, caption: "" },
    { id: "arctic-photo-02", label: "PHOTO 02", src: "/assets/projects/arctic-lab/narcissus-photo-02.jpg", alt: "迴声-Narcissus：CDとブックレットの実物写真", width: 2048, height: 1365, caption: "" },
  ],
};
