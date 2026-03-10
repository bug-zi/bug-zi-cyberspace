#  bug子的赛博空间

一个基于 Three.js 开发的沉浸式 3D 虚拟空间，支持第一人称漫游、多楼层探索、展品交互等功能。

![项目截图](.\public\photo\项目展示图1.png)

![Three.js](https://img.shields.io/badge/Three.js-r160-blue)
![Vite](https://img.shields.io/badge/Vite-v5.0-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

### 🎮 核心玩法
- **第一人称视角控制** - WASD 移动，鼠标控制视角
- **PointerLock 锁定** - 沉浸式体验，按 ESC 退出锁定
- **跳跃与冲刺** - SPACE 跳跃，SHIFT 切换行走/跑步模式
- **碰撞检测系统** - 基于边界框的完整碰撞检测

### 🏛️ 空间结构
- **一楼展厅**
  - 展厅1：像素馆：在输入框中输入物品会有中间的粒子团生成相应的图形像素；
  - 展厅2：音乐馆：三角钢琴会自动播放卡农，四周的专辑柜台摆放着本人最喜欢的四张专辑，点击专辑自动播放音乐，墙上是本人最喜欢的歌手和观看的音乐演出的纪念照；
  - 展厅3：影视馆：中间沙发可点击，坐下观看投屏上的影视作品，点击箭头可切换，墙上展示本人最喜欢的几部影视作品以及最喜欢的演员；
  - 展厅4：壁纸馆：展示个人收藏和正在使用的壁纸；
  - 走廊系统：连接各展厅的圆弧走廊
  - 电梯大厅：通往二楼的电梯

- **二楼展厅**
  - 展厅1：开发中...
  - 展厅2：开发中...
  - 展厅3：开发中...
  - 展厅4：乐高小屋：展示本人收藏的乐高模型

### 🎯 交互功能
- **点击交互** - Raycaster 射线检测，点击展品查看详情
- **全息投影** - 部分展品支持全息投影展示
- **视频播放** - 支持展厅内视频播放
- **音乐播放** - 展厅背景音乐和交互音效

### 🖼️ 展品类型
- GLB 3D 模型（乐高、Minecraft 风格模型等）
- 图片画作（照片、壁纸、海报等）
- 视频展示
- 音频播放

## 🚀 快速开始

### 环境要求
- Node.js 18.x 或更高版本
- 现代浏览器（支持 WebGL）

### 安装与运行

```bash
# 1. 克隆项目
git clone <repository-url>
cd bug_zi_cyberspace

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开
# 默认地址：http://localhost:8080/
```

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录。

## 🎮 操作指南

| 按键 | 功能 |
|------|------|
| `W` `A` `S` `D` | 前后左右移动 |
| `鼠标移动` | 控制视角方向 |
| `鼠标点击` | 锁定视角 / 与展品交互 |
| `SHIFT` | 切换行走/跑步模式 |
| `SPACE` | 跳跃 |
| `ESC` | 退出鼠标锁定 |

## 📁 项目结构

```
bug_zi_cyberspace/
├── index.html                 # 入口 HTML 文件
├── package.json               # 项目配置
├── vite.config.js             # Vite 配置
├── js/                        # JavaScript 源码
│   ├── main-new.js           # 主入口文件
│   ├── config.js             # 全局配置
│   ├── player.js             # 玩家控制器
│   ├── renderer.js           # 渲染器管理
│   ├── collision.js          # 碰撞检测系统
│   ├── utils.js              # 工具函数
│   └── rooms/                # 房间模块
│       ├── FirstFloor/       # 一楼房间
│       │   ├── room1.js      # 展厅1
│       │   ├── room2.js      # 展厅2（音乐厅）
│       │   ├── room3.js      # 展厅3
│       │   ├── room4.js      # 展厅4
│       │   ├── corridor.js   # 走廊系统
│       │   └── elevator.js   # 电梯
│       └── SecondFloor/      # 二楼房间
│           ├── room1.js      # 二楼展厅1
│           ├── room2.js      # 二楼展厅2
│           ├── room3.js      # 二楼展厅3
│           ├── room4.js      # 二楼展厅4
│           ├── corridor.js   # 二楼走廊
│           ├── elevator.js   # 二楼电梯
│           └── secondFloor.js # 二楼主模块
└── public/                    # 静态资源
    ├── glb/                  # 3D 模型文件
    ├── photo/                # 图片资源
    ├── vedio/                # 视频资源
    └── voice/                # 音频资源
```

## 🛠️ 技术栈

- **[Three.js](https://threejs.org/)** - 3D 渲染引擎
- **[Vite](https://vitejs.dev/)** - 前端构建工具
- **ES6 Modules** - 模块化 JavaScript

## ⚙️ 配置说明

主要配置位于 `js/config.js`：

```javascript
export const CONFIG = {
  PLAYER: {
    HEIGHT: 1.6,          // 玩家眼睛高度
    MOVE_SPEED: 0.225,    // 移动速度
    SPRINT_MULTIPLIER: 2.0, // 冲刺倍数
    JUMP_FORCE: 0.15,     // 跳跃力度
    GRAVITY: -0.008,      // 重力
  },
  ROOM: {
    WIDTH: 30,            // 房间宽度
    DEPTH: 30,            // 房间深度
    HEIGHT: 10,           // 房间高度
  }
};
```

## 📝 开发日志

### 已完成
- ✅ 第一人称视角控制系统
- ✅ 碰撞检测系统（边界框检测）
- ✅ 一楼4个展厅 + 走廊 + 电梯
- ✅ 二楼展厅系统
- ✅ 点击交互系统（Raycaster）
- ✅ GLB 模型加载与展示
- ✅ 图片/视频/音频展示
- ✅ 聚光灯照明系统

### 计划中
- 🚧 更多交互式展品
- � 多人在线功能
- 🚧 VR 支持
- 🚧 移动端适配优化

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**欢迎来到 bug子的赛博空间！** �✨
