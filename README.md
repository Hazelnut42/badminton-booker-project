# 羽毛球场地预订系统

一个用于管理羽毛球场地预订的网页应用。

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
# 复制 .env.example 到 .env 并更新你的 MongoDB 连接字符串
cp ../.env.example .env
```

3. **前端设置**
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

4. **数据库设置**
- 在 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 创建免费账号
- 创建新的集群
- 创建数据库用户
- 获取 MongoDB Atlas 连接字符串
- 用你的连接字符串更新 .env 文件

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
- 每个人使用自己的 MongoDB 数据库进行开发
- 提交代码前请先测试功能是否正常
- 遇到问题请及时在群里沟通

## 常见问题解决
1. 如果遇到依赖安装问题，尝试删除 node_modules 文件夹后重新安装
2. 确保 .env 文件中的数据库连接字符串格式正确
3. 确保 MongoDB Atlas 允许你的 IP 地址访问
