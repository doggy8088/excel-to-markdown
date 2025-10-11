# ✨ Excel to Markdown Table Converter

[![Deploy to GitHub Pages](https://github.com/doggy8088/excel-to-markdown/actions/workflows/deploy.yml/badge.svg)](https://github.com/doggy8088/excel-to-markdown/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

一個簡單、優雅且高效的工具，讓您能夠輕鬆將 Excel 表格資料轉換為 Markdown 格式的表格。只需複製貼上，即可快速產生符合標準的 Markdown 表格語法！

🌐 **線上體驗**: <https://doggy8088.github.io/excel-to-markdown/>

## ✨ 功能特色

### 🎯 核心功能

- **📋 剪貼簿貼上偵測**: 自動識別從 Excel 複製的表格資料 (Tab 分隔格式)
- **🔄 即時轉換**: 貼上資料後立即轉換為 Markdown 表格格式
- **👁️ 即時預覽**: 在右側面板即時顯示 Markdown 表格的渲染結果
- **📝 支援 Markdown 輸入**: 不僅支援 Excel 資料，也可以直接貼上既有的 Markdown 表格進行格式化
- **📋 一鍵複製**: 輕鬆複製產生的 Markdown 語法到剪貼簿
- **⚙️ 手動轉換**: 支援手動編輯後重新轉換
- **🗑️ 快速清除**: 一鍵清除所有輸入與輸出內容

### 🎨 使用者體驗

- **高效**: 單次貼上動作即可完成轉換，無需手動格式化
- **可靠**: 準確解析各種 Excel 資料類型與格式
- **清晰**: 並排預覽顯示精確的 Markdown 輸出結果
- **響應式設計**: 在桌面和行動裝置上都能完美運作
- **優雅的動畫效果**: 流暢的轉場動畫提供即時回饋

### 🛡️ 邊界情況處理

- **空白儲存格**: 妥善處理缺失資料的格式化
- **特殊字元**: 自動跳脫管線符號 (|) 及其他 Markdown 語法字元
- **大型表格**: 高效處理多行多列的大型表格
- **無效資料**: 對非表格剪貼簿內容顯示清晰的錯誤訊息
- **混合資料型別**: 一致處理包含數字、文字、日期等的儲存格

## 🚀 快速開始

### 使用方式

1. **複製 Excel 表格**
   - 在 Excel 中選取您要轉換的表格資料
   - 按下 `Ctrl+C` (Windows) 或 `Cmd+C` (Mac) 複製

2. **貼上資料**
   - 點擊左側「Excel Data Input」區域的文字方塊
   - 按下 `Ctrl+V` (Windows) 或 `Cmd+V` (Mac) 貼上

3. **查看結果**
   - 右側「Markdown Output」會立即顯示轉換後的 Markdown 語法
   - 下方的預覽區域會顯示表格的渲染結果

4. **複製 Markdown**
   - 點擊右上角的「📋 Copy」按鈕
   - Markdown 語法已複製到剪貼簿，可直接貼到任何 Markdown 編輯器中使用

### 支援的輸入格式

- ✅ Excel 表格 (透過剪貼簿的 Tab 分隔格式)
- ✅ 既有的 Markdown 表格 (自動格式化對齊)
- ✅ 包含引號的儲存格內容
- ✅ 多行儲存格內容

## 💻 本地開發

### 環境需求

- Node.js 20.x 或更高版本
- npm 或 yarn 套件管理工具

### 安裝步驟

```bash
# 複製專案
git clone https://github.com/doggy8088/excel-to-markdown.git
cd excel-to-markdown

# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器會在 `http://localhost:5173` 啟動 (若埠號被佔用會自動選擇其他埠號)。

### 可用的腳本指令

```bash
# 啟動開發伺服器(支援熱重載)
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 執行 ESLint 程式碼檢查
npm run lint

# 最佳化相依套件
npm run optimize
```

### 建置專案

```bash
npm run build
```

建置後的檔案會輸出到 `dist` 目錄，可直接部署到任何靜態網站託管服務。

## 🏗️ 技術架構

### 核心技術棧

- **框架**: React 19 + TypeScript
- **建置工具**: Vite 6
- **樣式方案**: Tailwind CSS 4 + @github/spark
- **UI 元件**: Radix UI (Accessible 元件庫)
- **Markdown 渲染**: marked
- **圖示**: Heroicons + Phosphor Icons
- **通知系統**: Sonner (Toast 通知)
- **表單處理**: React Hook Form + Zod

### 專案結構

```
excel-to-markdown/
├── src/
│   ├── components/          # React 元件
│   │   ├── ui/             # 可重用的 UI 元件
│   │   └── MarkdownTablePreview.tsx  # Markdown 預覽元件
│   ├── lib/                # 工具函式庫
│   │   ├── excel-converter.ts      # Excel 資料解析與轉換
│   │   ├── markdown-table.ts       # Markdown 表格處理
│   │   └── utils.ts                # 通用工具函式
│   ├── App.tsx             # 主應用程式元件
│   ├── main.tsx            # 應用程式進入點
│   └── ErrorFallback.tsx   # 錯誤邊界元件
├── public/                  # 靜態資源
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署設定
├── vite.config.ts          # Vite 設定檔
├── tailwind.config.js      # Tailwind CSS 設定
├── tsconfig.json           # TypeScript 設定
└── package.json            # 專案相依套件
```

### 核心演算法

#### Excel 資料解析 (`parseExcelData`)

- 解析 Tab 分隔的剪貼簿資料
- 處理包含引號的儲存格
- 支援多行儲存格內容
- 正確處理特殊字元

#### Markdown 表格生成 (`generateMarkdownTable`)

- 產生標準 Markdown 表格語法
- 自動計算欄位寬度進行對齊
- 處理特殊字元跳脫
- 支援客製化對齊方式

#### Markdown 表格正規化 (`normalizeMarkdownTable`)

- 偵測並解析既有的 Markdown 表格
- 重新格式化對齊表格欄位
- 保持表格結構的一致性

## 🚀 部署說明

### 自動部署到 GitHub Pages

本專案已設定 GitHub Actions 自動部署流程：

1. **自動觸發**: 推送變更到 `main` 分支時自動部署
2. **手動觸發**:
   - 前往專案的「Actions」分頁
   - 選擇「Deploy to GitHub Pages」工作流程
   - 點擊「Run workflow」並選擇 `main` 分支

部署完成後，網站會發佈到: https://doggy8088.github.io/excel-to-markdown/

### 部署到其他平台

本專案是純靜態網站，可輕鬆部署到任何靜態託管服務：

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm run build
# 上傳 dist 目錄到 Netlify
```

#### 其他靜態託管服務

建置後將 `dist` 目錄的內容上傳即可。

## 🛠️ 開發注意事項

### 程式碼風格

- 使用 ESLint 進行程式碼檢查
- 遵循 TypeScript 嚴格模式
- 使用 Prettier 格式化程式碼 (建議設定編輯器自動格式化)
- 元件使用函式式元件 (Function Components)+ Hooks

### 最佳實踐

1. **效能優化**
   - 使用 `useCallback` 避免不必要的函式重建
   - 使用 `useRef` 處理計時器和防抖
   - 善用 React 的記憶化機制

2. **可訪問性 (a11y)**
   - 使用 Radix UI 確保無障礙支援
   - 提供適當的 ARIA 標籤
   - 支援鍵盤導航

3. **錯誤處理**
   - 使用 Error Boundary 捕捉元件錯誤
   - 提供清晰的錯誤訊息
   - Toast 通知提供即時回饋

4. **型別安全**
   - 所有函式和元件都有明確的型別定義
   - 避免使用 `any` 型別
   - 善用 TypeScript 的型別推導

### 新增功能指南

1. **新增 UI 元件**
   - 在 `src/components/ui/` 目錄新增元件
   - 遵循既有的命名慣例
   - 確保元件可重用且具有型別安全

2. **新增工具函式**
   - 在 `src/lib/` 目錄新增相關函式
   - 撰寫清晰的 JSDoc 註解
   - 處理邊界情況和錯誤

3. **修改轉換邏輯**
   - 主要邏輯在 `src/lib/excel-converter.ts`
   - 確保向後相容性
   - 新增適當的錯誤處理

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 提交 Pull Request

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 報告問題

如果您發現任何問題或有功能建議，請[開啟 Issue](https://github.com/doggy8088/excel-to-markdown/issues)。

## 📝 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

Copyright (c) 2025 [Will 保哥](https://www.facebook.com/will.fans/)

## 🙏 致謝

- 使用 [GitHub Spark](https://github.com/features/spark) 作為開發模板
- UI 元件基於 [Radix UI](https://www.radix-ui.com/)
- 圖示來自 [Heroicons](https://heroicons.com/) 和 [Phosphor Icons](https://phosphoricons.com/)
- Markdown 解析使用 [marked](https://marked.js.org/)

## 📧 聯絡資訊

- 作者: Will 保哥
- Facebook: [Will 保哥的技術交流中心](https://www.facebook.com/will.fans/)
- GitHub: [@doggy8088](https://github.com/doggy8088)
- Blog: [The Will Will Web](https://blog.miniasp.com)

---

⭐ 如果這個專案對您有幫助，歡迎給個星星！
