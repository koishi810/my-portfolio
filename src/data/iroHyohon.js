const asset = (file, alt, width, height) => ({ src: `/assets/projects/iro-hyohon/${file}.jpg`, alt, width, height });

// Author-confirmed artwork title and assignment description.
export const iroHyohonProject = {
  slug: "iro-hyohon",
  title: "遊具の色標本",
  date: "",
  type: "色・質感の研究",
  description: "学校から半径500m以内で見つけた、興味深い素材の色や質感を観察し、再現する課題です。",
  href: "/works/iro-hyohon",
  image: "/assets/projects/iro-hyohon/overview.jpg",
  imageLabel: "赤・黄・緑の色と質感を再現した三つの標本",
};
export const iroHyohonCover = asset("overview", iroHyohonProject.imageLabel, 2048, 1202);
export const iroHyohonStudies = [
  { id: "red", title: "赤", images: [asset("reference-red", "採集した赤い塗装面の参考写真", 1152, 1536), asset("study-red", "赤い塗装面を再現した標本の細部", 1152, 2048)] },
  { id: "yellow", title: "黄", images: [asset("reference-yellow", "採集した黄色い塗装面の参考写真", 1152, 1536), asset("study-yellow", "黄色い塗装面を再現した標本の細部", 1152, 2048), asset("detail-yellow", "黄色い標本の展示写真", 1536, 1024)] },
  { id: "green", title: "緑", images: [asset("reference-green", "採集した緑の塗装面の参考写真", 1152, 1536), asset("study-green", "緑の塗装面を再現した標本の正面", 1536, 1024), asset("detail-green", "緑の標本を斜めから見た細部", 1536, 1024)] },
];
export const iroHyohonDisplay = [asset("display-red-yellow", "赤と黄の標本の展示写真", 1536, 1024), asset("display-green-yellow", "緑と黄の標本の展示写真", 1536, 1024)];

export const iroHyohonProcess = {
  description: "金属色の黒い塗料で下地を作り、その上に白いアクリル絵具を数層重ねて、中間の白い塗膜を再現しました。ドライヤーで絵具を急速に乾燥させてひび割れを作り、最後に元の塗装を模した色を重ねました。仕上げに、サンドペーパーで下地の層まで削っています。",
  images: [
    { src: "/assets/projects/iro-hyohon/img_2835.jpeg", alt: "制作過程：彩色した三つの標本と表面のひび割れ", width: 1152, height: 1536 },
    { src: "/assets/projects/iro-hyohon/img_2836.jpeg", alt: "制作過程：緑の標本に現れた白と黒の層", width: 1152, height: 1536 },
    { src: "/assets/projects/iro-hyohon/img_2838.jpeg", alt: "制作過程：研磨後の三色の標本", width: 1152, height: 1536 },
  ],
};
