// ============================================
// 展厅3：第三个展厅（30×30米，带左墙门洞）
// ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createFloor, createWall, createDoorWall, createPainting, createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建展厅3
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createRoom3(scene, collisionSystem) {
  console.log('🏛️ 开始创建展厅3...');

  // 材质
  // ============================================
  // 创建可交互星空地板
  // ============================================
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 星星数据
  const stars = [];
  const numStars = 600;

  // 初始化星星
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: Math.random() * canvas.width,
      baseY: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      color: null, // 彩色状态
      colorStartTime: null // 变彩色的开始时间
    });
  }

  // 绘制地板函数
  function drawFloor() {
    // 黑色背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制星星
    for (const star of stars) {
      if (star.color) {
        // 彩色星星
        ctx.fillStyle = star.color;
      } else {
        // 白色星星
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 初始绘制
  drawFloor();

  const floorTexture = new THREE.CanvasTexture(canvas);
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(6, 6);

  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.2,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const wallTexture = (function () {
    // 创建星空墙壁纹理
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 黑色背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加星星
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2.5 + 1;
      const alpha = Math.random() * 0.7 + 0.3;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  })();
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(2, 1);

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.2,
    metalness: 0.1
  });

  const goldFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.3,
    metalness: 0.8
  });

  // ============================================
  // 展厅3的参数
  // ============================================
  const room3X = 90;        // 展厅3中心X坐标
  const room3Z = 0;        // 展厅3中心Z坐标
  const room3Width = CONFIG.ROOM.WIDTH;   // 30米
  const room3Depth = CONFIG.ROOM.DEPTH;   // 30米 

  // ============================================
  // 创建地板
  // ============================================
  const floor3 = createFloor(room3Width, room3Depth, floorMaterial);
  floor3.position.set(room3X, -1, room3Z);
  scene.add(floor3);

  // ============================================
  // 创建四面墙（后墙带门洞、前墙带门洞、右墙、左墙）
  // ============================================

  // 门洞和墙壁的通用参数
  const doorWidth = CONFIG.DOOR.WIDTH;
  const doorHeight = CONFIG.DOOR.HEIGHT;
  const wallWidth = CONFIG.ROOM.WIDTH;
  const wallHeight = CONFIG.ROOM.HEIGHT;
  const wallDepth = CONFIG.ROOM.WALL_DEPTH;

  // 后墙（带门洞：宽4米×高6米）
  // 1. 顶部墙板（横梁）- 跨越整个宽度
  const backWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  backWallTop.position.set(room3X, 5 + (wallHeight - doorHeight) / 2, room3Z - room3Depth / 2);
  scene.add(backWallTop);
  collisionSystem.addObject(backWallTop);

  // 2. 左墙板
  const backWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  backWallLeft.position.set(room3X - (doorWidth / 2 + (wallWidth - doorWidth) / 4), -1 + doorHeight / 2, room3Z - room3Depth / 2);
  scene.add(backWallLeft);
  collisionSystem.addObject(backWallLeft);

  // 3. 右墙板
  const backWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  backWallRight.position.set(room3X + (doorWidth / 2 + (wallWidth - doorWidth) / 4), -1 + doorHeight / 2, room3Z - room3Depth / 2);
  scene.add(backWallRight);
  collisionSystem.addObject(backWallRight);

  console.log('✅ 后墙已开凿门洞（宽4米，高6米）');

  // 前墙（带门洞：宽4米×高6米）
  // 1. 顶部墙板（横梁）- 跨越整个宽度
  const frontWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  frontWallTop.position.set(room3X, 5 + (wallHeight - doorHeight) / 2, room3Z + room3Depth / 2);
  scene.add(frontWallTop);
  collisionSystem.addObject(frontWallTop);

  // 2. 左墙板
  const frontWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  frontWallLeft.position.set(room3X - (doorWidth / 2 + (wallWidth - doorWidth) / 4), -1 + doorHeight / 2, room3Z + room3Depth / 2);
  scene.add(frontWallLeft);
  collisionSystem.addObject(frontWallLeft);

  // 3. 右墙板
  const frontWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  frontWallRight.position.set(room3X + (doorWidth / 2 + (wallWidth - doorWidth) / 4), -1 + doorHeight / 2, room3Z + room3Depth / 2);
  scene.add(frontWallRight);
  collisionSystem.addObject(frontWallRight);

  console.log('✅ 前墙已开凿门洞（宽4米，高6米）');

  // 右墙（X轴正方向）
  const rightWall = createWall(
    room3Depth,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  rightWall.position.set(room3X + room3Width / 2, (CONFIG.ROOM.HEIGHT - 2) / 2, room3Z);
  rightWall.rotation.y = Math.PI / 2;
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  // 左墙（X轴负方向）
  const leftWall = createWall(
    room3Depth,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  leftWall.position.set(room3X - room3Width / 2, (CONFIG.ROOM.HEIGHT - 2) / 2, room3Z);
  leftWall.rotation.y = Math.PI / 2;
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  // ============================================
  // 创建天花板
  // ============================================
  // 黑色天花板带星空效果
  const ceilingGeometry = new THREE.PlaneGeometry(room3Width, room3Depth);

  // 创建星空纹理
  const ceilingCanvas = document.createElement('canvas');
  ceilingCanvas.width = 1024;
  ceilingCanvas.height = 1024;
  const ceilingCtx = ceilingCanvas.getContext('2d');

  // 黑色背景
  ceilingCtx.fillStyle = '#000000';
  ceilingCtx.fillRect(0, 0, ceilingCanvas.width, ceilingCanvas.height);

  // 添加星星
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * ceilingCanvas.width;
    const y = Math.random() * ceilingCanvas.height;
    const size = Math.random() * 2 + 1;
    const alpha = Math.random() * 0.8 + 0.2;

    ceilingCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ceilingCtx.beginPath();
    ceilingCtx.arc(x, y, size, 0, Math.PI * 2);
    ceilingCtx.fill();
  }

  const ceilingTexture = new THREE.CanvasTexture(ceilingCanvas);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    side: THREE.DoubleSide
  });

  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(room3X, CONFIG.ROOM.HEIGHT - 1, room3Z);
  scene.add(ceiling);

  // ============================================
  // 创建垂吊灯牌（影视馆）
  // ============================================
  console.log('💡 开始创建垂吊灯牌...');

  // 创建灯牌主体（放大尺寸）
  const signWidth = 6; // 从4米放大到6米
  const signHeight = 2; // 从1.5米放大到2米
  const signThickness = 0.2;

  // 灯牌正面（带文字和星空背景）
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024;
  signCanvas.height = 512;
  const signCtx = signCanvas.getContext('2d');

  // 星空背景
  signCtx.fillStyle = '#000000';
  signCtx.fillRect(0, 0, signCanvas.width, signCanvas.height);

  // 添加星星
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * signCanvas.width;
    const y = Math.random() * signCanvas.height;
    const size = Math.random() * 3 + 1;
    const alpha = Math.random() * 0.8 + 0.2;

    signCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    signCtx.beginPath();
    signCtx.arc(x, y, size, 0, Math.PI * 2);
    signCtx.fill();
  }

  // 灯牌文字
  signCtx.fillStyle = '#ffffff';
  signCtx.font = '120px Microsoft YaHei';
  signCtx.textAlign = 'center';
  signCtx.textBaseline = 'middle';
  signCtx.fillText('影视馆', signCanvas.width / 2, signCanvas.height / 2);

  const signTexture = new THREE.CanvasTexture(signCanvas);

  // 灯牌材质
  const signMaterial = [
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a }), // 侧面
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a }), // 侧面
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a }), // 顶部
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a }), // 底部
    new THREE.MeshStandardMaterial({ map: signTexture, side: THREE.DoubleSide }), // 正面
    new THREE.MeshStandardMaterial({ map: signTexture, side: THREE.DoubleSide })  // 背面（也使用星空纹理）
  ];

  const signGeometry = new THREE.BoxGeometry(signWidth, signHeight, signThickness);
  const sign = new THREE.Mesh(signGeometry, signMaterial);

  // 灯牌位置（垂吊在天花板下方）
  const signY = CONFIG.ROOM.HEIGHT - 2; // 天花板下方2米
  sign.position.set(room3X, signY, room3Z);

  // 创建链条（垂吊绳）
  const chainGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8); // 稍微加粗链条
  const chainMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });

  // 四个链条
  for (let i = 0; i < 4; i++) {
    const chain = new THREE.Mesh(chainGeometry, chainMaterial);

    // 链条位置（灯牌四个角）
    const chainX = room3X + (i % 2 === 0 ? -signWidth / 2 + 0.4 : signWidth / 2 - 0.4);
    const chainZ = room3Z + (i < 2 ? -signHeight / 2 + 0.4 : signHeight / 2 - 0.4);

    // 链条长度
    const chainLength = CONFIG.ROOM.HEIGHT - 1 - signY - signHeight / 2;
    chain.scale.y = chainLength;
    chain.position.set(chainX, (CONFIG.ROOM.HEIGHT - 1 + signY + signHeight / 2) / 2, chainZ);

    scene.add(chain);
  }

  scene.add(sign);

  // ============================================
  // 创建房间角落立柱
  // ============================================
  console.log('🏛️ 开始创建角落立柱...');

  // 立柱尺寸
  const pillarSize = 1; // 1m×1m
  const pillarHeight = CONFIG.ROOM.HEIGHT; // 与房间高度一致

  // 立柱材质
  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
    metalness: 0.1
  });

  // 四个角落的位置
  const cornerPositions = [
    [room3X - room3Width / 2 + pillarSize / 2, room3Z - room3Depth / 2 + pillarSize / 2], // 左上角
    [room3X + room3Width / 2 - pillarSize / 2, room3Z - room3Depth / 2 + pillarSize / 2], // 右上角
    [room3X - room3Width / 2 + pillarSize / 2, room3Z + room3Depth / 2 - pillarSize / 2], // 左下角
    [room3X + room3Width / 2 - pillarSize / 2, room3Z + room3Depth / 2 - pillarSize / 2]  // 右下角
  ];


  // ============================================
  // 创建投影屏幕（左墙）
  // ============================================
  console.log('📺 开始创建投影屏幕...');
  const screenWidth = 18;
  const screenHeight = 10;

  // 图片数组
  const screenImages = [
    '../../public/photo/声之行2.jpg',
    '../../public/photo/想见你2.jpg',
    '../../public/photo/只有你2.jpg',
    '../../public/photo/最好的我们2.webp'
  ];
  let currentImageIndex = 0;

  // 创建屏幕纹理
  const screenTextureLoader = new THREE.TextureLoader();
  const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
  const screenMaterial = new THREE.MeshStandardMaterial({
    map: screenTextureLoader.load(screenImages[0]),
    side: THREE.DoubleSide
  });

  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(room3X - room3Width / 2 + 0.1, 4, room3Z);
  screen.rotation.y = Math.PI / 2;
  screen.name = '投影屏幕';
  scene.add(screen);

  // 创建左右箭头
  const arrowSize = 1.5;
  const arrowThickness = 0.2;
  const arrowDistance = 12; // 箭头距离屏幕的距离

  // 箭头材质
  const arrowMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.5,
    metalness: 0.3,
    transparent: true,
    opacity: 0.8
  });

  // 创建右箭头函数（切换到上一张）
  function createRightArrow() {
    const arrowGroup = new THREE.Group();

    // 箭头主体（三角形）- 指向Z轴负方向（右）
    const arrowGeometry = new THREE.ConeGeometry(arrowSize, arrowSize * 2, 3);
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    // 圆锥默认指向Y轴正方向，需要旋转指向Z轴负方向
    arrow.rotation.x = -Math.PI / 2;
    arrowGroup.add(arrow);

    // 添加点击区域（不可见的碰撞体）
    const hitGeometry = new THREE.BoxGeometry(arrowSize * 2, arrowSize * 3, arrowSize * 3);
    const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitGeometry, hitMaterial);
    hitBox.name = '右箭头';
    hitBox.userData = { type: 'screenArrow', direction: 'prev' };
    arrowGroup.add(hitBox);

    return arrowGroup;
  }

  // 创建左箭头函数（切换到下一张）
  function createLeftArrow() {
    const arrowGroup = new THREE.Group();

    // 箭头主体（三角形）- 指向Z轴正方向（左）  
    const arrowGeometry = new THREE.ConeGeometry(arrowSize, arrowSize * 2, 3);
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    // 圆锥默认指向Y轴正方向，需要旋转指向Z轴正方向
    arrow.rotation.x = Math.PI / 2;
    arrowGroup.add(arrow);

    // 添加点击区域（不可见的碰撞体）
    const hitGeometry = new THREE.BoxGeometry(arrowSize * 2, arrowSize * 3, arrowSize * 3);
    const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitGeometry, hitMaterial);
    hitBox.name = '左箭头';
    hitBox.userData = { type: 'screenArrow', direction: 'next' };
    arrowGroup.add(hitBox);

    return arrowGroup;
  }

  // 右箭头 - 放在屏幕左侧（Z轴负方向），指向左（切换到上一张）
  const rightArrow = createRightArrow();
  rightArrow.position.set(room3X - room3Width / 2 + 0.2, 4, room3Z - arrowDistance);
  scene.add(rightArrow);

  // 左箭头 - 放在屏幕右侧（Z轴正方向），指向右（切换到下一张）
  const leftArrow = createLeftArrow();
  leftArrow.position.set(room3X - room3Width / 2 + 0.2, 4, room3Z + arrowDistance);
  scene.add(leftArrow); 

  // 切换图片函数
  function switchImage(direction) {
    if (direction === 'next') {
      currentImageIndex = (currentImageIndex + 1) % screenImages.length;
    } else {
      currentImageIndex = (currentImageIndex - 1 + screenImages.length) % screenImages.length;
    }

    // 加载新图片
    screenTextureLoader.load(screenImages[currentImageIndex], (newTexture) => {
      screenMaterial.map = newTexture;
      screenMaterial.needsUpdate = true;
      console.log(`📷 切换到图片 ${currentImageIndex + 1}/${screenImages.length}`);
    });
  }

  // 视频播放相关变量
  let videoElement = null;
  let videoTexture = null;
  let isPlayingVideo = false;
  const videoPath = '../../public/vedio/声之形 中国预告片1：终极版 (中文字幕).mp4';

  // 播放视频函数
  function playVideo() {
    if (isPlayingVideo) return;

    console.log('🎬 开始播放视频...');
    isPlayingVideo = true;

    // 创建视频元素
    videoElement = document.createElement('video');
    videoElement.src = videoPath;
    videoElement.crossOrigin = 'anonymous';
    videoElement.loop = false;
    videoElement.muted = false;
    videoElement.playsInline = true;

    // 创建视频纹理
    videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // 设置屏幕材质为视频纹理
    screenMaterial.map = videoTexture;
    screenMaterial.needsUpdate = true;

    // 播放视频
    videoElement.play().then(() => {
      console.log('✅ 视频播放成功');
    }).catch((error) => {
      console.error('❌ 视频播放失败:', error);
      isPlayingVideo = false;
    });

    // 视频结束事件
    videoElement.addEventListener('ended', () => {
      console.log('🎬 视频播放结束');
      stopVideo();
    });
  }

  // 停止视频函数
  function stopVideo() {
    if (!isPlayingVideo) return;

    console.log('🛑 停止视频播放');
    isPlayingVideo = false;

    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement = null;
    }

    if (videoTexture) {
      videoTexture.dispose();
      videoTexture = null;
    }

    // 恢复显示当前图片
    screenTextureLoader.load(screenImages[currentImageIndex], (newTexture) => {
      screenMaterial.map = newTexture;
      screenMaterial.needsUpdate = true;
    });
  }

  // 检查当前是否是声之形图片（索引0）
  function isSilentVoiceImage() {
    return currentImageIndex === 0;
  }

  // ============================================
  // 星星地板交互效果 - 彩色条纹拖尾
  // ============================================
  const trailWidth = 1; // 条纹宽度（米）
  const segmentLength = 0.5; // 渐变间隔（米）
  const trailDuration = 3000; // 条纹持续时间（毫秒）
  const maxTrailSegments = 100; // 最大条纹段数

  // 存储走过的路径点
  const trailPoints = [];
  let lastSegmentDistance = 0;

  // 生成白色半透明
  function getGradientColor(index) {
    return `rgba(255, 255, 255, 0.6)`;
  }

  // 更新星星地板（在动画循环中调用）
  function updateStarFloor(playerX, playerZ) {
    const currentTime = Date.now();

    // 检查是否需要添加新的路径点
    if (trailPoints.length === 0) {
      // 第一个点
      trailPoints.push({
        x: playerX,
        z: playerZ,
        time: currentTime,
        colorIndex: 0
      });
    } else {
      const lastPoint = trailPoints[trailPoints.length - 1];
      const dx = playerX - lastPoint.x;
      const dz = playerZ - lastPoint.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // 每移动0.5米添加一个新点
      if (distance >= segmentLength) {
        trailPoints.push({
          x: playerX,
          z: playerZ,
          time: currentTime,
          colorIndex: lastPoint.colorIndex + 1
        });

        // 限制路径点数量
        if (trailPoints.length > maxTrailSegments) {
          trailPoints.shift();
        }
      }
    }

    // 移除过期的路径点
    const expiredTime = currentTime - trailDuration;
    while (trailPoints.length > 0 && trailPoints[0].time < expiredTime) {
      trailPoints.shift();
    }

    // 重绘地板
    drawFloorWithTrails();
    floorTexture.needsUpdate = true;
  }

  // 绘制带条纹的地板
  function drawFloorWithTrails() {
    // 黑色背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制星星（保持白色）
    for (const star of stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制彩色条纹
    if (trailPoints.length >= 2) {
      for (let i = 0; i < trailPoints.length - 1; i++) {
        const point1 = trailPoints[i];
        const point2 = trailPoints[i + 1];

        // 转换为canvas坐标
        const x1 = ((point1.x - (room3X - room3Width / 2)) / room3Width) * canvas.width;
        const y1 = ((point1.z - (room3Z - room3Depth / 2)) / room3Depth) * canvas.height;
        const x2 = ((point2.x - (room3X - room3Width / 2)) / room3Width) * canvas.width;
        const y2 = ((point2.z - (room3Z - room3Depth / 2)) / room3Depth) * canvas.height;

        // 计算垂直方向（条纹宽度方向）
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length > 0) {
          // 垂直向量（单位化后旋转90度）
          const perpX = (-dy / length) * (trailWidth / room3Width * canvas.width / 2);
          const perpY = (dx / length) * (trailWidth / room3Depth * canvas.height / 2);

          // 绘制四边形条纹
          ctx.fillStyle = getGradientColor(point1.colorIndex);
          ctx.beginPath();
          ctx.moveTo(x1 + perpX, y1 + perpY);
          ctx.lineTo(x2 + perpX, y2 + perpY);
          ctx.lineTo(x2 - perpX, y2 - perpY);
          ctx.lineTo(x1 - perpX, y1 - perpY);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  // 将切换函数和相关信息暴露到全局，供main-new.js使用
  window.room3ScreenController = {
    switchImage,
    playVideo,
    stopVideo,
    isSilentVoiceImage,
    updateStarFloor,
    screen,
    leftArrow,
    rightArrow,
    getCurrentIndex: () => currentImageIndex,
    getImages: () => screenImages,
    isPlayingVideo: () => isPlayingVideo,
    isPlayerInRoom: (x, z) => {
      return x >= room3X - room3Width / 2 && x <= room3X + room3Width / 2 &&
             z >= room3Z - room3Depth / 2 && z <= room3Z + room3Depth / 2;
    }
  };

  // ============================================
  // 沙发模型已移除（腾讯云部署版本）
  // ============================================

  // ============================================
  // 创建海报照片（前后墙门两旁）
  // ============================================
  console.log('🖼️ 开始创建海报照片...');

  // 照片尺寸（放大1.5倍）
  const photoWidth = 2.7; // 1.8 * 1.5
  const photoHeight = 4.8; // 3.2 * 1.5（9:16比例）

  // 白色画框材质
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1
  });

  // 创建画框函数
  function createFrame(width, height, thickness) {
    const frameGroup = new THREE.Group();
    const frameThickness = thickness || 0.15;
    const frameWidth = width + frameThickness * 2;
    const frameHeight = height + frameThickness * 2;

    // 上边框
    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameThickness),
      frameMaterial
    );
    topFrame.position.set(0, frameHeight / 2 - frameThickness / 2, 0);
    frameGroup.add(topFrame);

    // 下边框
    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, frameThickness, frameThickness),
      frameMaterial
    );
    bottomFrame.position.set(0, -frameHeight / 2 + frameThickness / 2, 0);
    frameGroup.add(bottomFrame);

    // 左边框
    const leftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, height, frameThickness),
      frameMaterial
    );
    leftFrame.position.set(-frameWidth / 2 + frameThickness / 2, 0, 0);
    frameGroup.add(leftFrame);

    // 右边框
    const rightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, height, frameThickness),
      frameMaterial
    );
    rightFrame.position.set(frameWidth / 2 - frameThickness / 2, 0, 0);
    frameGroup.add(rightFrame);

    return frameGroup;
  }

  // 后墙左侧照片（声之形）
  const backLeftPhotoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
  const backLeftPhotoTexture = new THREE.TextureLoader().load('../../public/photo/声之形1.webp');
  backLeftPhotoTexture.encoding = THREE.sRGBEncoding;
  backLeftPhotoTexture.flipY = false;
  const backLeftPhotoMaterial = new THREE.MeshStandardMaterial({ map: backLeftPhotoTexture, side: THREE.DoubleSide });
  const backLeftPhoto = new THREE.Mesh(backLeftPhotoGeometry, backLeftPhotoMaterial);
  backLeftPhoto.position.set(room3X - 8, 4, room3Z - room3Depth / 2 + 0.15);
  backLeftPhoto.rotation.x = Math.PI; // 翻转180°
  scene.add(backLeftPhoto);

  // 后墙左侧照片画框
  const backLeftFrame = createFrame(photoWidth, photoHeight, 0.15);
  backLeftFrame.position.set(room3X - 8, 4, room3Z - room3Depth / 2 + 0.25);
  backLeftFrame.rotation.x = Math.PI;
  scene.add(backLeftFrame);

  // 后墙右侧照片（想见你）
  const backRightPhotoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
  const backRightPhotoTexture = new THREE.TextureLoader().load('../../public/photo/想见你1.webp');
  backRightPhotoTexture.encoding = THREE.sRGBEncoding;
  backRightPhotoTexture.flipY = false;
  const backRightPhotoMaterial = new THREE.MeshStandardMaterial({ map: backRightPhotoTexture, side: THREE.DoubleSide });
  const backRightPhoto = new THREE.Mesh(backRightPhotoGeometry, backRightPhotoMaterial);
  backRightPhoto.position.set(room3X + 8, 4, room3Z - room3Depth / 2 + 0.15);
  backRightPhoto.rotation.x = Math.PI; // 翻转180°
  scene.add(backRightPhoto);

  // 后墙右侧照片画框
  const backRightFrame = createFrame(photoWidth, photoHeight, 0.15);
  backRightFrame.position.set(room3X + 8, 4, room3Z - room3Depth / 2 + 0.25);
  backRightFrame.rotation.x = Math.PI;
  scene.add(backRightFrame);

  // 前墙左侧照片（只有你）
  const frontLeftPhotoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
  const frontLeftPhotoTexture = new THREE.TextureLoader().load('../../public/photo/只有你1.webp');
  frontLeftPhotoTexture.encoding = THREE.sRGBEncoding;
  frontLeftPhotoTexture.flipY = false;
  const frontLeftPhotoMaterial = new THREE.MeshStandardMaterial({ map: frontLeftPhotoTexture, side: THREE.DoubleSide });
  const frontLeftPhoto = new THREE.Mesh(frontLeftPhotoGeometry, frontLeftPhotoMaterial);
  frontLeftPhoto.position.set(room3X - 8, 4, room3Z + room3Depth / 2 - 0.15);
  frontLeftPhoto.rotation.x = Math.PI; // 翻转180°
  frontLeftPhoto.scale.x = -1; 
  scene.add(frontLeftPhoto);

  // 前墙左侧照片画框
  const frontLeftFrame = createFrame(photoWidth, photoHeight, 0.15);
  frontLeftFrame.position.set(room3X - 8, 4, room3Z + room3Depth / 2 - 0.25);
  frontLeftFrame.rotation.x = Math.PI;
  scene.add(frontLeftFrame);

  // 前墙右侧照片（最好的我们）
  const frontRightPhotoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
  const frontRightPhotoTexture = new THREE.TextureLoader().load('../../public/photo/最好的我们1.jpg');
  frontRightPhotoTexture.encoding = THREE.sRGBEncoding;
  frontRightPhotoTexture.flipY = false;
  const frontRightPhotoMaterial = new THREE.MeshStandardMaterial({ map: frontRightPhotoTexture, side: THREE.DoubleSide });
  const frontRightPhoto = new THREE.Mesh(frontRightPhotoGeometry, frontRightPhotoMaterial);
  frontRightPhoto.position.set(room3X + 8, 4, room3Z + room3Depth / 2 - 0.15);
  frontRightPhoto.rotation.x = Math.PI; // 翻转180°
  frontRightPhoto.scale.x = -1;  
  scene.add(frontRightPhoto);

  // 前墙右侧照片画框
  const frontRightFrame = createFrame(photoWidth, photoHeight, 0.15);
  frontRightFrame.position.set(room3X + 8, 4, room3Z + room3Depth / 2 - 0.25);
  frontRightFrame.rotation.x = Math.PI;
  scene.add(frontRightFrame);

  // ============================================
  // 右墙照片（韩孝周、柯佳嬿）
  // ============================================
  // 右墙内侧照片1（韩孝周）- 位于Z轴负方向
  const rightWallPhoto1Geometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
  const rightWallPhoto1Texture = new THREE.TextureLoader().load('../../public/photo/韩孝周1.jpg');
  rightWallPhoto1Texture.encoding = THREE.sRGBEncoding;
  rightWallPhoto1Texture.flipY = false;
  const rightWallPhoto1Material = new THREE.MeshStandardMaterial({ map: rightWallPhoto1Texture, side: THREE.DoubleSide });
  const rightWallPhoto1 = new THREE.Mesh(rightWallPhoto1Geometry, rightWallPhoto1Material);
  rightWallPhoto1.position.set(room3X + room3Width / 2 - 0.15, 4, room3Z - 8);
  rightWallPhoto1.rotation.y = -Math.PI / 2;
  rightWallPhoto1.rotation.x = Math.PI ;
  rightWallPhoto1.scale.x = -1 ;
  rightWallPhoto1.name = '韩孝周\n韩国女演员';
  scene.add(rightWallPhoto1);

  // 右墙内侧照片1画框
  const rightWallFrame1 = createFrame(photoWidth, photoHeight, 0.15);
  rightWallFrame1.position.set(room3X + room3Width / 2 - 0.25, 4, room3Z - 8);
  rightWallFrame1.rotation.y = -Math.PI / 2;
  scene.add(rightWallFrame1);

  // 右墙内侧照片2（柯佳嬿）- 位于Z轴正方向，与照片1对称
  const rightWallPhoto2Geometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
  const rightWallPhoto2Texture = new THREE.TextureLoader().load('../../public/photo/柯佳嬿1.jpg');
  rightWallPhoto2Texture.encoding = THREE.sRGBEncoding;
  rightWallPhoto2Texture.flipY = false;
  const rightWallPhoto2Material = new THREE.MeshStandardMaterial({ map: rightWallPhoto2Texture, side: THREE.DoubleSide });
  const rightWallPhoto2 = new THREE.Mesh(rightWallPhoto2Geometry, rightWallPhoto2Material);
  rightWallPhoto2.position.set(room3X + room3Width / 2 - 0.15, 4, room3Z + 8);
  rightWallPhoto2.rotation.y = -Math.PI / 2;
  rightWallPhoto2.rotation.x = Math.PI ;
  rightWallPhoto2.scale.x = -1 ;
  rightWallPhoto2.name = '柯佳嬿\n中国台湾女演员';
  scene.add(rightWallPhoto2);

  // 右墙内侧照片2画框
  const rightWallFrame2 = createFrame(photoWidth, photoHeight, 0.15);
  rightWallFrame2.position.set(room3X + room3Width / 2 - 0.25, 4, room3Z + 8);
  rightWallFrame2.rotation.y = -Math.PI / 2;
  scene.add(rightWallFrame2);

  console.log('✅ 影视馆创建完成（投影屏幕、沙发、海报框、星空天花板、右墙照片）');
  return { roomName: '影视馆' };
}

console.log('✅ 展厅3模块已加载');
