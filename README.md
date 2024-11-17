
## 项目结构
```
badmintonbooker/
├── backend/           # 后端代码
│   ├── config/       # 配置文件目录
│   │   └── db.js    # MongoDB 连接配置
│   ├── models/      # 数据模型目录
│   │   └── User.js  # 用户模型定义
│   ├── routes/      # 路由目录
│   │   └── authRoutes.js # 认证相关路由
│   └── server.js    # 主服务器文件
│
├── frontend/          # 前端代码
│   ├── node_modules/ # 依赖包
│   ├── public/      # 静态资源
│   ├── src/         # 源代码
│   │   ├── components/ # React 组件
│   │   ├── pages/   # 页面组件
│   │   ├── styles/  # CSS 样式
│   │   ├── App.js  
│   │   └── index.js
│   └── package.json # 项目依赖配置
│
├── .env.example      # 环境变量示例文件
├── .gitignore       # Git 忽略文件
└── README.md        # 项目说明文档
```

## 项目设置

### 前置要求
- Node.js (v14 或更高版本)
- npm 或 yarn
- MongoDB Atlas 账号

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/Hazelnut42/badminton-booker-project.git
cd badminton-booker-project
```

2. **后端设置**
```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建 .env 文件
# 将 .env.example 重命名为 .env 并更新MongoDB 连接字符串（使用Hazel的密钥）
mv ../.env.example .env  # 或手动重命名
```

3. **前端设置**
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

⚠️ 重要提示：必须将 `.env.example` 文件重命名为 `.env`，然后更新其中的数据库连接信息！

.env 文件结构示例:
```
MONGO_URI=mongodb+srv://<用户名>:<密码>@cluster0.xxxxx.mongodb.net/<数据库名>
```

### 运行应用

1. **启动后端服务器**
```bash
# 在 backend 目录下
node server.js
```

2. **启动前端开发服务器**
```bash
# 在 frontend 目录下
npm start
```

应用将在以下地址运行:
- 前端: http://localhost:3000
- 后端: http://localhost:5001

## 参与贡献

1. 为你的功能创建新分支
```bash
git checkout -b feature/你的功能名称
```

2. 提交你的修改
```bash
git add .
git commit -m "修改描述"
git push origin feature/你的功能名称
```

3. 在 GitHub 上创建 Pull Request

## 当前功能
- 用户认证（注册/登录）
- 更多功能开发中...

## 项目开发说明
- 使用共享的 MongoDB 数据库进行开发
- 提交代码前请先测试功能是否正常

## 常见问题解决
1. 如果遇到依赖安装问题，尝试删除 node_modules 文件夹后重新安装
2. 确保 .env 文件（不是 .env.example）存在且数据库连接字符串格式正确
3. 确保 MongoDB Atlas 允许你的 IP 地址访问
