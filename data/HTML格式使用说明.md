# 知行录 - HTML内容格式使用指南

## 概述

从 2026-03-23 起,**书籍摘要**、**历史人物**、**山海经**三个模块的正文内容**全部采用 HTML 格式**,不再使用 JSON 中的结构化字段。

## 为什么使用 HTML 格式?

1. **丰富的排版能力**:支持表格、列表、引用、图片、复杂布局等
2. **灵活的样式控制**:可嵌入 CSS,实现统一的视觉风格
3. **易于维护**:内容集中管理,不需要维护复杂的 JSON 结构
4. **可扩展性强**:未来可以轻松添加新的内容模块

## 数据架构

采用**混合架构**:
- **JSON 文件**:仅存储元数据(标题、副标题、标签、日期、封面图、摘要、contentFile 路径)
- **HTML 文件**:存储完整的正文内容

## 文件结构

```
知行录/
├ data/
│   ├── books.json              # 书籍摘要元数据
│   ├── history.json            # 历史人物元数据
│   ├── shanhaijing.json        # 山海经元数据
│   ├── book-template.html      # 书籍摘要 HTML 模板
│   ├── history-template.html   # 历史人物 HTML 模板
│   ├── qiongqi.html            # 山海经示例(穷奇)
│  └ [其他 HTML 内容文件]
└ index.html                  # 主页面(已优化支持 HTML 加载)
```

## JSON 标准结构

### 书籍摘要 (books.json)

```json
[
    {
        "id": 1,
        "title": "书名",
        "subtitle": "一句话概括",
        "tag": "类别标签",
        "year": 2024,
        "category": "分类",
        "icon": "
        "coverImage": "./data/book-cover.jpg",
        "summary": "书籍简介(100字以内)",
        "contentFile": "./data/book-content.html"
    }
]
```

### 历史人物 (history.json)

```json
[
    {
        "id": 1,
        "title": "人物姓名",
        "subtitle": "一句话概括其历史地位",
        "tag": "身份标签",
        "date": "生卒年份",
        "icon": "
        "coverImage": "./data/portrait.jpg",
        "summary": "人物简介(100字以内)",
        "contentFile": "./data/person-content.html"
    }
]
```

### 山海经 (shanhaijing.json)

```json
[
    {
        "id": 1,
        "title": "异兽名称",
        "subtitle": "一句话特点描述",
        "tag": "分类标签",
        "date": "2026-03",
        "icon": "
        "coverImage": "./data/creature-cover.jpg",
        "summary": "简介(100字以内)",
        "contentFile": "./data/creature-content.html"
    }
]
```

## HTML 文件要求

### 1. 基本结构

HTML 文件应包含完整的文章内容,建议结构:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* 内嵌 CSS 样式 */
    </style>
</head>
<body>
    <article>
        <!-- 文章内容 -->
    </article>
</body>
</html>
```

### 2. 样式规范

推荐使用以下 CSS 变量(与主页面保持一致):

```css
:root {
    --bg-primary: #faf8f5;          /* 主背景色 */
    --bg-secondary: #f5f2ed;        /* 次要背景色 */
    --bg-card: #ffffff;             /* 卡片背景 */
    --text-primary: #1a1a2e;        /* 主文字色 */
    --text-secondary: #4a4a5a;      /* 次要文字色 */
    --text-muted: #8a8a9a;          /* 弱化文字色 */
    --accent-primary: #1a1a2e;      /* 主强调色 */
    --accent-secondary: #8b7355;    /* 次要强调色 */
    --border: #e8e4df;              /* 边框色 */
    --shadow: 0 4px 12px -2px rgba(26, 26, 46, 0.08);
    --shadow-lg: 0 12px 40px -8px rgba(26, 26, 46, 0.12);
}
```

### 3. 内容模块建议

#### 书籍摘要推荐结构:
- 书籍基本信息(作者、出版社、出版年份等)
- 核心观点/一句话总结
- 章节梳理/内容概要
- 金句摘录
- 实践指南/行动建议
- 延伸阅读

#### 历史人物推荐结构:
- 基本信息(朝代、字号、籍贯、成就)
- 生平事迹(时间线)
- 主要贡献
- 经典言论/著作
- 历史评价
- 相关图片
- 延伸阅读

#### 山海经推荐结构:
- 基本信息(出处、属性、特征)
- 原典记载(古籍原文)
- 形象描绘(外貌特征)
- 神异之处(特殊能力)
- 关联传说(相关故事)
- 文化流变(后世影响)
- 趣味解读(现代视角)

### 4. 图片要求

**所有 HTML 内容文件必须包含至少一张配图**,可以是:

1. **封面图**:在 HTML 顶部使用
   ```html
   <img src="./data/cover-image.jpg" alt="描述" class="cover-image">
   ```

2. **内容配图**:在正文中适当位置插入
   ```html
   <div class="image-gallery">
       <div class="gallery-item">
           <img src="./data/image1.jpg" alt="说明">
           <div class="gallery-caption">图注说明</div>
       </div>
   </div>
   ```

3. **装饰性图片**:用于增强视觉效果

**图片来源**:
- 本地文件(推荐):放在 `./data/` 目录下
- 网络图片:使用完整 URL
- Base64 编码:适合小图标

### 5. 示例参考

- **山海经示例**:`qiongqi.html` - 包含完整的七段式结构和丰富的排版元素
- **书籍模板**:`book-template.html` - 提供书籍摘要的标准结构
- **历史人物模板**:`history-template.html` - 提供历史人物的标准结构

## 创建新内容的步骤

### 1. 准备内容
- 收集相关资料和图片
- 规划文章结构
- 撰写正文内容

### 2. 创建 HTML 文件
- 复制对应模板文件
- 修改文件名为有意义的名称(如 `sun-tzu.html`、`dream-of-red-chamber.html`)
- 替换内容,保持结构完整

### 3. 更新 JSON 元数据
- 在对应的 JSON 文件中添加新条目
- 确保 `contentFile` 字段指向正确的 HTML 文件路径
- 填写必要的元数据(标题、副标题、标签等)

### 4. 测试
- 在浏览器中打开 `index.html`
- 点击新创建的条目,检查内容是否正确加载
- 确认图片显示正常,样式无误

## 常见问题

### Q1: 为什么不直接用 JSON 存储所有内容?

A: JSON 适合结构化数据,但不适合富文本内容。HTML 提供更强的排版能力,支持表格、列表、引用、图片等复杂元素,且易于维护。

### Q2: HTML 文件必须内嵌 CSS 吗?

A: 推荐内嵌 CSS,这样可以保证样式独立,不依赖外部文件。但也可以引用外部样式表,只要能正常加载即可。

### Q3: 图片路径怎么写?

A: 推荐使用相对路径,如 `./data/image.jpg`。这样在 GitHub Pages 部署后也能正常工作。

### Q4: 内容加载失败怎么办?

A: 检查以下几点:
- `contentFile` 路径是否正确
- HTML 文件是否存在于指定位置
- 浏览器控制台是否有错误信息
- 文件权限是否正确

### Q5: 如何添加新的样式?

A: 直接在 HTML 文件的 `<style>` 标签中添加 CSS。如果多个文件需要共享样式,可以创建公共样式文件并在每个 HTML 中引用。

## 技术支持

如有问题,请查看:
- 浏览器开发者工具的控制台(Console)
- 网络(Network)标签页,检查文件加载情况
- 参考已有的示例文件(`qiongqi.html`)

---

**最后更新**:2026-03-23
**维护者**:知行录项目组
