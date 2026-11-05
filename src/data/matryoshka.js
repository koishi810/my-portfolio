// Project identity and introduction confirmed by the author.
export const matryoshkaProject = {
  slug: "matryoshka",
  date: "2026",
  title: "マッチ",
  type: "立体構成",
  description: "水平ライン・水玉による構成",
  href: "/works/matryoshka",
  image: "/assets/projects/matryoshka/cover.png",
  imageLabel: "大きさの異なる五つのマトリョーシカを並べた作品写真",
};

export const matryoshkaMetadata = [
  ["展示", "学内の芸術祭にて展示"],
  ["制作時期", "2026"],
  ["課題", "マトリョーシカ\n水平ライン・水玉による構成"],
];

export const matryoshkaParagraphs = [
  "3年次前期の課題で、水平ラインと水玉だけを使ってマトリョーシカを塗装しました。マッチの先端を思わせる頭の形から着想を得て、火がつき、燃え広がり、やがて燃え尽きるまでの移り変わりを、一組のマトリョーシカで表現しました。",
];

export const matryoshkaCover = {
  src: matryoshkaProject.image,
  alt: matryoshkaProject.imageLabel,
  width: 2048,
  height: 1365,
};

const photographs = {
  1: { id: "match-photo-01", src: "/assets/projects/matryoshka/photo-01.jpg", alt: "石の階段に大きさの順で並べた五つのマトリョーシカ", width: 2666, height: 4000 },
  2: { id: "match-photo-02", src: "/assets/projects/matryoshka/photo-02.jpg", alt: "黒、赤茶、白へと色が移るマトリョーシカの接写", width: 2666, height: 4000 },
  3: { id: "match-photo-03", src: "/assets/projects/matryoshka/photo-03.jpg", alt: "下部に赤茶色を残した黒いマトリョーシカの接写", width: 2666, height: 4000 },
  4: { id: "match-photo-04", src: "/assets/projects/matryoshka/photo-04.jpg", alt: "窓からの光の中、斜めに並べた五つのマトリョーシカ", width: 4000, height: 2666 },
  5: { id: "match-photo-05", src: "/assets/projects/matryoshka/photo-05.jpg", alt: "白い背景に前後の奥行きをつけて配置した五つのマトリョーシカ", width: 2666, height: 4000 },
  6: { id: "match-photo-06", src: "/assets/projects/matryoshka/photo-06.jpg", alt: "金属の階段に並べた五つのマトリョーシカを下から見上げた写真", width: 2666, height: 4000 },
};

// Group by photograph content while retaining every complete, uncropped frame.
export const matryoshkaPhotoGroups = [
  { id: "overview", layout: "wide", label: "作品全体", images: [photographs[4]] },
  { id: "details", layout: "pair", label: "色と表面のディテール", images: [photographs[2], photographs[3]] },
  { id: "composition", layout: "portrait", label: "作品の配置", images: [photographs[5]] },
  { id: "stairs", layout: "pair", label: "階段での作品写真", images: [photographs[1], photographs[6]] },
];
