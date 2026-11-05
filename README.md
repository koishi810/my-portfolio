# LUYUFAN Portfolio

LUYUFAN 的个人作品集网页。当前版本重点是首页连续滚动原型：全局背景、模糊遮罩、固定顶栏、Hero / About / Works / Contact 四段内容，以及 Works 区域的 sticky 标题和作品停顿滚动。

## 运行

```bash
npm install
npm run dev
```

开发地址默认是：

```text
http://localhost:5173/
```

构建检查：

```bash
npm run build
```

## 上线

推荐使用 Vercel 部署当前 Vite 静态站点。

Vercel 配置：

- Build Command：`npm run build`
- Output Directory：`dist`
- SPA fallback：`vercel.json` 中已配置所有路由回退到 `index.html`

部署流程：

1. 打开 Vercel。
2. 使用 GitHub 登录。
3. Import `koishi810/my-portfolio`。
4. 保持 Vite 默认构建配置。
5. Deploy。

之后每次执行：

```bash
git add .
git commit -m "Update portfolio"
git push
```

Vercel 会自动重新部署。

## 页面结构

- `/`：首页，当前主要实现页面。
- `/works`：作品目录，分类索引和当前四项作品（首页精选保留三项）。
- `/about`：个人页，使用已确认的自我介绍及联系方式。
- `/works/koko`：正式 KOKO 详情及 14 页作品图。
- `/works/flower-machine`：正式花朵机器详情、展示视频及生成规则。
- `/works/arctic-lab`：ARCTICLAB 系列详情、已确认元信息、「迴声-Narcissus」专辑介绍、四幅原比例展示（含两张并列实拍）及月面高斯模糊背景。系列首屏横向，专辑介绍起纵向阅读。
- `/works/matryoshka`：「マッチ」マトリョーシカ课题页，2026，选定封面及六张成图按原比例彩色展示，六图按全景、单体细节、错落群像与楼梯场景编排；背景使用与封面原背景一致的中性浅灰 #d5dcdc，保留差分文字，前景作品原色不变；桌面首屏保持左右列和字体，仅上移内容组以平衡留白。Works 归入「その他」，卡片默认黑白，hover / 键盘 focus 恢复原色。未确认的介绍、职责、技法和摄影署名暂不增写。
- `/works/world-skin`：作品详情模板占位页。
- `/works/sn`：作品详情模板占位页。
- `/works/emotion-bloom`：作品详情模板占位页。

## 首页结构

首页不是独立静态屏幕，而是一个连续滚动页面：

1. `HeroSection`
2. `AboutSection`
3. `WorksSection`
4. `ContactSection`

共享全局层：

- `GlobalBackground`：全站背景图。
- `GlobalMask`：黑色 / 亮色 / 模糊遮罩状态。
- `GlobalChrome`：固定顶栏。

顶栏内容：

- 左上：`Portfolio ver0.2`
- 中上：`作品の更新とページの追加・整備を行いました。`
- 右上：`TOP / WORKS / ABOUT ME / CONTACT`

## 交互原则

当前首页采用统一的 section scroll progress 逻辑：

- 每个重点 section 由外层滚动高度控制时间。
- 内层视觉舞台使用 sticky 固定在视窗中。
- 滚动推进该 section 内部的透明度、位置、图片序列或遮罩状态。
- 当前 section 的内部状态完成后，才进入下一段内容。
- 不使用 GSAP，优先使用 React state、CSS sticky、CSS transition、requestAnimationFrame。

## Works 规则

Works 区域延续全局背景，只是进入浅色 / 反相视觉状态：

- 背景仍然来自全局背景图。
- Works 阶段通过图片反相和亮色模糊遮罩形成浅色状态。
- 文字视觉需要保持类似 Figma 的差分效果。
- `Works` 标题滑到顶栏下方后固定。
- 作品内容从 `Works` 标题下方经过，并在标题下缘被直接裁切消失。
- 每个作品滚动到指定位置后会保留一段停顿滚动时间，再进入下一个作品。
- 作品图片区域保持固定比例，不拉伸变形。

## 测试页面

### `/test/yezi-scroll`

`yezi scroll image sequence prototype`

用于验证 Figma layout + scroll-driven canvas sequence。这个页面是测试页，不是正式首页。

### `/test/about-scroll`

About section 滚动测试页。

用于验证 About section 的 sticky 舞台、48 帧图片序列、竖排文字逐字出现和 MORE 按钮状态。

### `/test/home-flow`

首页段落衔接测试页。

用于验证 Hero section 和 About section 之间的连续滚动切换，以及多个 section 共用同一套背景、遮罩和顶栏的实现方式。

## 代码结构

- `src/App.jsx`：集中定义路由和页面布局类型。
- `src/components/home/`：首页容器及 Hero / About / Works / Contact 分区。
- `src/components/motion/`：已经进入正式页面的通用动态组件。
- `src/components/tests/`：保留用于验证交互的原型组件。
- `src/components/PortfolioChrome.jsx`：首页和沉浸式作品页共享的顶栏结构。
- `src/data/projects.js`：首页作品卡片和预留作品的统一数据入口。
- `src/hooks/useScrollProgress.js`：共享滚动进度与视口计算。
- `src/styles/`：全局样式、正式页面样式和原型页面样式。

## 资源

- 首页背景：`public/assets/test/about-scroll/bg.png`
- Hero 叶片：`public/assets/sequences/yezi/`，48 帧 PNG 序列
- Works 图像：`public/assets/home/`
- About 石头序列：`public/assets/sequences/shitou/`
- yezi 测试序列：`public/assets/sequences/yezi/`

## 约束

- 显示名统一使用 `LUYUFAN`。
- 不在占位页添加真实作品详情。
- 不使用 GSAP。
- 不把测试页改成正式页面。
- 不删除 `/test/yezi-scroll` 和 `/test/home-flow`，它们用于记录已经验证过的交互原型。

## 作品目录与个人页

- Figma：`nXqj46MP1HFN9UU3alWTGK`；Works `278:1830`，About `352:8`。
- `src/components/directory/`：新页面共享背景、导航、联系区及作品行。
- `src/data/workDirectory.js`：复用 `projects.js` 的事实与文案，仅配置目录图像和入口。
- `src/data/profile.js`：从现存 Yezi 原型提取的自我介绍。
- `src/styles/directory.css`：所有选择器限定在目录页面，不修改首页或作品详情样式。
- `PortfolioChrome` 新增可选导航配置；不传配置的既有页面保持原来的链接。
- 分类索引定位到相应作品；「その他」收录已确认的マトリョーシカ课题；照片/记录尚无已确认内容，所以不创建虚构项目。
- ARCTIC LAB 目录和首页卡片进入 `/works/arctic-lab`；详情图片及背景配置在 `src/data/arcticLab.js`，新增文案由作者补充。
- 新资源位于 `public/assets/directory/`；保留 Figma 原始资源，不使用临时 URL。
- 当前仓库没有 lint、类型检查或单元测试脚本；可用检查是构建、静态引用和实际浏览器验证。

## マッチ图片

- 网页使用`public/assets/projects/matryoshka/`内的轻量副本；封面637KB，六张照片约0.58–1.03MB。
- 六张照片保留4000px长边与原始方向，不裁切；已小于约1MB的4张不重复压缩，另2张使用优化渐进JPEG。
- 图片延迟加载，预留原始宽高比；图组在手机上转为单列。
- 原始20MB以上照片不放入网站，Mac原图不修改。
