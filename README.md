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

## 页面结构

- `/`：首页，当前主要实现页面。
- `/works`：作品总览占位页。
- `/about`：About 占位页。
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

- 左上：`Portfolio ver0.1`
- 中上：`2026.06.09 更新しました`
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

## 主要文件

- `src/components/home/PortfolioHome.jsx`
- `src/styles/portfolio-home.css`
- `src/components/tests/ScrollImageSequence.jsx`
- `src/hooks/useScrollProgress.js`
- `src/App.jsx`

## 资源

- 首页背景：`public/assets/test/about-scroll/bg.png`
- Hero 叶片：`public/assets/home/hero-leaf.png`
- Works 图像：`public/assets/home/`
- About 石头序列：`public/assets/sequences/shitou/`
- yezi 测试序列：`public/assets/sequences/yezi/`

## 约束

- 显示名统一使用 `LUYUFAN`。
- 不在占位页添加真实作品详情。
- 不使用 GSAP。
- 不把测试页改成正式页面。
- 不删除 `/test/yezi-scroll` 和 `/test/home-flow`，它们用于记录已经验证过的交互原型。
