# 🚀 快速開始指南 | Getting Started Guide

## 目錄 | Table of Contents
1. [系統要求](#系統要求--system-requirements)
2. [安裝步驟](#安裝步驟--installation-steps)
3. [項目結構](#項目結構--project-structure)
4. [首次運行](#首次運行--first-run)
5. [常見問題](#常見問題--faq)

---

## 系統要求 | System Requirements

### 硬體需求 (Hardware)
- 處理器: Intel i5 或更高
- RAM: 8GB 最少，16GB 推薦
- 存儲: 5GB 可用空間
- 網絡: 高速互聯網連接
- 攝像頭: 1080p 或更高（用於動作捕捉）
- 麥克風: 降噪麥克風（用於聲樂訓練）

### 軟體需求 (Software)

#### Windows 10/11
```
✓ Node.js 16 LTS 或更高
✓ .NET Core 6 Runtime
✓ Python 3.8+
✓ Git
✓ Visual Studio Code (推薦)
```

#### macOS 11+
```
✓ Node.js 16 LTS 或更高
✓ .NET Core 6 Runtime
✓ Python 3.8+
✓ Git
✓ Xcode Command Line Tools
```

#### Linux (Ubuntu 20.04+)
```
✓ Node.js 16 LTS 或更高
✓ .NET Core 6 Runtime
✓ Python 3.8+
✓ Git
✓ Build essentials
```

---

## 安裝步驟 | Installation Steps

### 步驟 1: 克隆項目 (Clone Repository)

```bash
# 使用 HTTPS
git clone https://github.com/qqcatchan/Chinese-s-opera-.git

# 或使用 SSH
git clone git@github.com:qqcatchan/Chinese-s-opera-.git

# 進入項目目錄
cd Chinese-s-opera-
```

### 步驟 2: 安裝前端依賴 (Frontend Dependencies)

```bash
# 安裝 npm 套件
npm install

# 或使用 yarn
yarn install
```

### 步驟 3: 安裝後端依賴 (Backend Dependencies)

```bash
# 安裝 Python 依賴
pip install -r requirements.txt

# 或使用 conda
conda create -n chinese-opera python=3.9
conda activate chinese-opera
conda install -r requirements.txt
```

### 步驟 4: 配置環境變數 (Environment Configuration)

```bash
# 複製環境配置文件
cp .env.example .env

# 編輯 .env 文件，設置以下變數：
# DATABASE_URL=postgresql://user:password@localhost:5432/chinese_opera
# API_PORT=3000
# AI_MODEL_PATH=./models/
# JWT_SECRET=your_secret_key_here
```

### 步驟 5: 設置數據庫 (Database Setup)

```bash
# 創建數據庫
npm run setup:db

# 運行遷移
npm run migrate

# 初始化示例數據
npm run seed:db
```

### 步驟 6: 下載 AI 模型 (Download AI Models)

```bash
# 下載姿態檢測模型
npm run download:models

# 下載語音識別模型
python scripts/download_models.py
```

---

## 項目結構 | Project Structure

```
chinese-opera/
├── frontend/                    # 前端代碼
│   ├── src/
│   │   ├── components/         # React 組件
│   │   ├── pages/              # 頁面
│   │   ├── services/           # API 服務
│   │   ├── hooks/              # 自定義 hooks
│   │   └── styles/             # 樣式文件
│   ├── public/                 # 靜態文件
│   └── package.json
│
├── backend/                     # 後端代碼
│   ├── src/
│   │   ├── api/                # API 路由
│   │   ├── services/           # 業務邏輯
│   │   ├── models/             # 數據模型
│   │   ├── middleware/         # 中間件
│   │   └── utils/              # 工具函數
│   ├── tests/                  # 測試文件
│   └── requirements.txt
│
├── ai-models/                   # AI 模型
│   ├── pose-detection/         # 姿態檢測模型
│   ├── speech-recognition/     # 語音識別模型
│   └── pitch-detection/        # 音高檢測模型
│
├── database/                    # 數據庫相關
│   ├── migrations/             # 數據庫遷移
│   ├── seeds/                  # 初始化數據
│   └── schema.sql
│
├── docs/                        # 文檔
│   ├── API.md                  # API 文檔
│   ├── FEATURES.md             # 功能說明
│   └── ARCHITECTURE.md         # 架構設計
│
├── scripts/                     # 輔助腳本
│   ├── setup.sh               # 設置腳本
│   ├── start.sh               # 啟動腳本
│   └── download_models.py     # 下載模型
│
├── .env.example               # 環境配置示例
├── .gitignore                 # Git 忽略列表
├── package.json               # npm 配置
├── README.md                  # 項目說明
└── LICENSE                    # 許可證
```

---

## 首次運行 | First Run

### 方式 1: 使用自動化腳本 (Using Setup Script)

```bash
# 在項目根目錄運行
./scripts/setup.sh

# 或在 Windows 上
scripts\setup.bat
```

### 方式 2: 手動啟動 (Manual Start)

```bash
# 終端 1: 啟動後端服務器
npm run start:backend

# 終端 2: 啟動前端開發服務器
npm run start:frontend

# 應用應在 http://localhost:3000 開啟
```

### 方式 3: 使用 Docker (Using Docker)

```bash
# 構建 Docker 鏡像
docker-compose build

# 啟動服務
docker-compose up

# 應用在 http://localhost:3000
```

---

## 首次登錄 | First Login

### 測試賬戶 (Test Accounts)

```
用戶名: demo@example.com
密碼: Demo123!@#

用戶名: teacher@example.com
密碼: Teacher123!@#
```

### 創建新賬戶 (Create New Account)

1. 點擊「註冊」按鈕
2. 填寫電子郵件和密碼
3. 驗證電子郵件
4. 完成個人信息設置

---

## 常見問題 | FAQ

### Q1: 無法連接到數據庫？
**A:** 檢查以下項目：
- PostgreSQL 是否正在運行
- `.env` 中的連接字符串是否正確
- 數據庫用戶名和密碼是否正確
- 防火牆是否阻止了連接

```bash
# 測試連接
psql -h localhost -U postgres -d chinese_opera
```

### Q2: AI 模型下載失敗？
**A:** 使用替代方法下載：
```bash
# 手動下載模型
wget https://models.example.com/pose-detection-model.pb
# 放在 ai-models/pose-detection/ 目錄

# 或配置代理
npm config set https-proxy http://proxy.example.com:8080
npm run download:models
```

### Q3: 攝像頭不工作？
**A:** 檢查權限和驅動程序：
```bash
# Linux: 檢查攝像頭權限
ls -la /dev/video*
sudo usermod -a -G video $USER

# macOS: 允許應用訪問攝像頭
# 系統偏好設置 > 安全性與隱私 > 攝像頭
```

### Q4: 性能緩慢？
**A:** 嘗試以下優化：
- 增加 Node.js 堆內存: `NODE_OPTIONS=--max-old-space-size=4096`
- 禁用不必要的實時功能
- 使用 GPU 加速: 確保已安裝 CUDA/TensorRT
- 減少視頻分辨率

### Q5: 如何重置密碼？
**A:** 在登錄頁面點擊「忘記密碼」並按照說明操作

---

## 下一步 | Next Steps

✅ 安裝完成後，建議：

1. **閱讀文檔**
   - [API 文檔](./docs/API.md)
   - [功能介紹](./docs/FEATURES.md)

2. **瀏覽示例**
   - 查看 `examples/` 目錄
   - 運行示例代碼

3. **配置個性化設置**
   - 調整語言和地區
   - 設置学習偏好

4. **開始學習**
   - 選擇課程
   - 完成第一堂課

---

## 需要幫助？ | Need Help?

- 📖 查看 [完整文檔](./docs/)
- 🐛 提交 [Issue](https://github.com/qqcatchan/Chinese-s-opera-/issues)
- 💬 加入 [社群討論](https://github.com/qqcatchan/Chinese-s-opera-/discussions)
- 📧 聯絡我們: [support@example.com]

---

祝你使用愉快！Happy Learning! 🎭✨
