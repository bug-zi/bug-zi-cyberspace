// ============================================
// 展厅4：全息投影馆（30×30米，带左墙门洞）
// ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createFloor, createWall, createDoorWall, createPainting, createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建展厅4
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createRoom4(scene, collisionSystem) {
  console.log('🏛️ 开始创建全息投影馆...');

  // 材质
  // ============================================
  // 创建星空地板
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
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  // 绘制地板函数
  function drawFloor() {
    // 黑色背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制星星
    for (const star of stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
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

  // ============================================
  // 创建星空墙壁
  // ============================================
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
  // 展厅4的参数
  // ============================================
  const room4X = 0;        // 展厅4中心X坐标
  const room4Z = 0;        // 展厅4中心Z坐标
  const room4Width = CONFIG.ROOM.WIDTH;   // 30米
  const room4Depth = CONFIG.ROOM.DEPTH;   // 30米

  // ============================================
  // 创建地板
  // ============================================
  const floor4 = createFloor(room4Width, room4Depth, floorMaterial);
  floor4.position.set(room4X, -1, room4Z);
  scene.add(floor4);

  // ============================================
  // 创建四面墙（后墙、前墙、右墙、左墙带门洞）
  // ============================================

  // 后墙（现在变成右墙，X轴正方向）
  const backWall = createWall(
    room4Depth,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  backWall.position.set(room4X + room4Width / 2, (CONFIG.ROOM.HEIGHT - 2) / 2, room4Z);
  backWall.rotation.y = Math.PI / 2;
  scene.add(backWall);
  collisionSystem.addObject(backWall);

  // 前墙（现在变成左墙，X轴负方向）
  const frontWall = createWall(
    room4Depth,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  frontWall.position.set(room4X - room4Width / 2, (CONFIG.ROOM.HEIGHT - 2) / 2, room4Z);
  frontWall.rotation.y = Math.PI / 2;
  scene.add(frontWall);
  collisionSystem.addObject(frontWall);

  // 门洞和墙壁的通用参数
  const doorWidth = CONFIG.DOOR.WIDTH;
  const doorHeight = CONFIG.DOOR.HEIGHT;
  const wallHeight = CONFIG.ROOM.HEIGHT;
  const wallDepth = CONFIG.ROOM.WALL_DEPTH;

  // 左墙（现在变成后墙，带门洞：宽4米×高6米）
  // 后墙位于Z轴负方向，门洞中心在X=0
  // 1. 顶部横梁
  const leftWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(room4Width, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  leftWallTop.position.set(room4X, 5 + (wallHeight - doorHeight) / 2, room4Z - room4Depth / 2);
  leftWallTop.rotation.y = 0;
  scene.add(leftWallTop);
  collisionSystem.addObject(leftWallTop);

  // 2. 左墙板
  const leftWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((room4Width - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  leftWallLeft.position.set(room4X - (doorWidth / 2 + (room4Width - doorWidth) / 4), -1 + doorHeight / 2, room4Z - room4Depth / 2);
  leftWallLeft.rotation.y = 0;
  scene.add(leftWallLeft);
  collisionSystem.addObject(leftWallLeft);

  // 3. 右墙板
  const leftWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((room4Width - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  leftWallRight.position.set(room4X + (doorWidth / 2 + (room4Width - doorWidth) / 4), -1 + doorHeight / 2, room4Z - room4Depth / 2);
  leftWallRight.rotation.y = 0;
  scene.add(leftWallRight);
  collisionSystem.addObject(leftWallRight);

  console.log('✅ 展厅4左墙（现在变成后墙）已开凿门洞（宽4米，高6米）');

  // 右墙（现在变成前墙，带门洞：宽4米×高6米）
  // 前墙位于Z轴正方向，门洞中心在X=0
  // 1. 顶部横梁
  const rightWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(room4Width, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  rightWallTop.position.set(room4X, 5 + (wallHeight - doorHeight) / 2, room4Z + room4Depth / 2);
  rightWallTop.rotation.y = 0;
  scene.add(rightWallTop);
  collisionSystem.addObject(rightWallTop);

  // 2. 左墙板
  const rightWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((room4Width - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  rightWallLeft.position.set(room4X - (doorWidth / 2 + (room4Width - doorWidth) / 4), -1 + doorHeight / 2, room4Z + room4Depth / 2);
  rightWallLeft.rotation.y = 0;
  scene.add(rightWallLeft);
  collisionSystem.addObject(rightWallLeft);

  // 3. 右墙板
  const rightWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((room4Width - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  rightWallRight.position.set(room4X + (doorWidth / 2 + (room4Width - doorWidth) / 4), -1 + doorHeight / 2, room4Z + room4Depth / 2);
  rightWallRight.rotation.y = 0;
  scene.add(rightWallRight);
  collisionSystem.addObject(rightWallRight);

  console.log('✅ 展厅4右墙（现在变成前墙）已开凿门洞（宽4米，高6米）');

  // ============================================
  // 创建天花板
  // ============================================
  // 黑色天花板带星空效果
  const ceilingGeometry = new THREE.PlaneGeometry(room4Width, room4Depth);

  // 创建星空天花板纹理
  const ceilingCanvas = document.createElement('canvas');
  ceilingCanvas.width = 1024;
  ceilingCanvas.height = 1024;
  const ceilingCtx = ceilingCanvas.getContext('2d');

  // 黑色背景
  ceilingCtx.fillStyle = '#000000';
  ceilingCtx.fillRect(0, 0, ceilingCanvas.width, ceilingCanvas.height);

  // 添加星星
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * ceilingCanvas.width;
    const y = Math.random() * ceilingCanvas.height;
    const size = Math.random() * 2.5 + 1;
    const alpha = Math.random() * 0.7 + 0.3;

    ceilingCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ceilingCtx.beginPath();
    ceilingCtx.arc(x, y, size, 0, Math.PI * 2);
    ceilingCtx.fill();
  }

  const ceilingTexture = new THREE.CanvasTexture(ceilingCanvas);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    roughness: 0.2,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(room4X, CONFIG.ROOM.HEIGHT - 1, room4Z);
  scene.add(ceiling);

  // ============================================
  // 创建粒子构成的人物雕像模型
  // ============================================
  function createParticleStatue() {
    console.log('✨ 开始创建粒子人物雕像...');

    // 人物雕像粒子数量
    const particleCount = 3000;
    
    // 创建粒子几何体
    const particlesGeometry = new THREE.BufferGeometry();
    
    // 粒子位置数组
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // 定义球形的粒子分布
    function createSphereShape() {
      const particles = [];
      
      // 球体粒子
      for (let i = 0; i < 3000; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.5 + Math.random() * 0.5;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        particles.push([x, y, z]);
      }
      
      return particles;
    }
    
    const particlePositions = createSphereShape();
    
    // 填充粒子位置和颜色
    for (let i = 0; i < particleCount; i++) {
      if (particlePositions[i]) {
        const [x, y, z] = particlePositions[i];
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // 白色粒子
        colors[i * 3] = 1.0; // 红
        colors[i * 3 + 1] = 1.0; // 绿
        colors[i * 3 + 2] = 1.0; // 蓝
      } else {
        // 填充剩余粒子
        positions[i * 3] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 1] = -2 + Math.random() * 7;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 创建粒子材质
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    // 创建粒子系统
    const particleStatue = new THREE.Points(particlesGeometry, particleMaterial);
    particleStatue.position.set(room4X, 3, room4Z);
    
    // 添加到场景
    scene.add(particleStatue);
    
    // 添加动画
    function animateParticles() {
      requestAnimationFrame(animateParticles);
      
      // 轻微旋转
      particleStatue.rotation.y += 0.002;
      
      // 粒子位置动画
      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        // 轻微上下浮动
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.005;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
    }
    
    animateParticles();
    
    console.log('✨ 粒子球体创建完成');
    console.log('📍 粒子球体位置:', particleStatue.position);
    return particleStatue;
  }

  // 存储粒子球体引用
  let particleStatue = null;

  // 创建粒子球体
  particleStatue = createParticleStatue();

  // ============================================
  // 创建全息投影输入框
  // ============================================
  function createHolographicInput() {
    console.log('📝 开始创建全息投影输入框...');

    // 创建输入框背景（白色）
    const inputWidth = 6;
    const inputHeight = 3;
    const inputGeometry = new THREE.PlaneGeometry(inputWidth, inputHeight);
    const inputMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });

    const inputBox = new THREE.Mesh(inputGeometry, inputMaterial);
    inputBox.position.set(room4X + room4Width / 2 - 0.5, 3, room4Z);
    inputBox.rotation.y = Math.PI / 2;
    inputBox.name = '全息投影输入框';
    inputBox.userData = { type: 'holographicInput', interactable: true };
    scene.add(inputBox);

    // 创建输入框边框
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });

    const borderGeometry = new THREE.EdgesGeometry(inputGeometry);
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    border.position.copy(inputBox.position);
    border.rotation.copy(inputBox.rotation);
    scene.add(border);

    // 创建输入框文字提示
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 256;
    const textCtx = textCanvas.getContext('2d');

    textCtx.fillStyle = '#ffffff';
    textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

    // 左右镜像对称
    textCtx.save();
    textCtx.translate(textCanvas.width / 2, 0);
    textCtx.scale(-1, 1);
    textCtx.translate(-textCanvas.width / 2, 0);

    textCtx.fillStyle = '#000000';
    textCtx.font = 'bold 32px Arial';
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';
    textCtx.fillText('点击输入物体名称', textCanvas.width / 2, textCanvas.height / 2);
    
    textCtx.restore();

    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      side: THREE.DoubleSide
    });

    const textMesh = new THREE.Mesh(inputGeometry, textMaterial);
    textMesh.position.set(room4X + room4Width / 2 - 0.4, 3, room4Z);
    textMesh.rotation.y = Math.PI / 2;
    textMesh.name = '全息投影输入框文字';
    textMesh.userData = { type: 'holographicInput', interactable: true };
    scene.add(textMesh);

    console.log('✅ 全息投影输入框创建完成，位置:', inputBox.position);
    return { inputBox, textMesh };
  }

  // 创建输入框
  const holographicInput = createHolographicInput();

  // ============================================
  // 全息投影系统
  // ============================================
  let currentParticleObject = null;

  function handleHolographicInput() {
    console.log('📝 开始处理全息投影输入...');
    
    try {
      const userInput = prompt('请输入要生成的物体名称（如：猫、狗、鸟、心、星等）：');
      console.log('🎨 用户输入:', userInput);
      
      if (userInput && userInput.trim()) {
        console.log('✅ 用户输入有效:', userInput.trim());
        createParticleObject(userInput.trim());
      } else {
        console.log('⚠️ 用户取消输入或输入为空');
      }
      
      // 输入完成后，重新锁定鼠标（如果需要的话）
      console.log('🔄 输入处理完成');
    } catch (error) {
      console.error('❌ 处理输入时出错:', error);
    }
  }

  // 渐变过渡函数
  function fadeOutObject(object, duration = 1000, callback) {
    if (!object) return;
    
    const startOpacity = object.material.opacity || 1;
    const startTime = Date.now();
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const opacity = startOpacity * (1 - progress);
      
      object.material.opacity = opacity;
      object.material.needsUpdate = true;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    }
    
    animate();
  }

  function fadeInObject(object, duration = 1000) {
    if (!object) return;
    
    object.material.opacity = 0;
    object.material.needsUpdate = true;
    
    const startTime = Date.now();
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const opacity = 0.9 * progress;
      
      object.material.opacity = opacity;
      object.material.needsUpdate = true;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    animate();
  }

  function createParticleObject(objectName) {
    console.log('✨ 开始创建粒子物体:', objectName);

    // 如果已有粒子物体，先移除
    if (currentParticleObject) {
      scene.remove(currentParticleObject);
      currentParticleObject = null;
    }

    // 渐变淡出粒子雕像
    if (particleStatue) {
      fadeOutObject(particleStatue, 1000, () => {
        scene.remove(particleStatue);
        particleStatue = null;
        createNewObject();
      });
    } else {
      createNewObject();
    }

    function createNewObject() {
      // 根据输入的物体名称生成粒子形状
      const particleCount = 2000;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      // 根据物体名称生成不同的形状
      const objectPositions = generateObjectShape(objectName, particleCount);

      for (let i = 0; i < particleCount; i++) {
        if (objectPositions[i]) {
          const [x, y, z] = objectPositions[i];
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          // 白色粒子
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 1.0;
          colors[i * 3 + 2] = 1.0;
        } else {
          // 默认球形分布
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const radius = 2 + Math.random() * 1;

          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.cos(phi);
          positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 1.0;
          colors[i * 3 + 2] = 1.0;
        }
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });

      currentParticleObject = new THREE.Points(particlesGeometry, particleMaterial);
      currentParticleObject.position.set(room4X, 2, room4Z);
      scene.add(currentParticleObject);

      // 渐变淡入新物体
      fadeInObject(currentParticleObject, 1000);

      console.log('✅ 粒子物体创建完成:', objectName);
    }
  }

  function generateObjectShape(objectName, count) {
    const particles = [];
    const name = objectName.toLowerCase();

    if (name.includes('猫') || name.includes('cat')) {
      return generateCatShape(count);
    } else if (name.includes('狗') || name.includes('dog')) {
      return generateDogShape(count);
    } else if (name.includes('鸟') || name.includes('bird')) {
      return generateBirdShape(count);
    } else if (name.includes('心') || name.includes('heart')) {
      return generateHeartShape(count);
    } else if (name.includes('星') || name.includes('star')) {
      return generateStarShape(count);
    } else {
      return generateSphereShape(count);
    }
  }

  function generateCatShape(count) {
    const particles = [];
    
    // 头部
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 0.8 + Math.random() * 0.3;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = 3 + radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      particles.push([x, y, z]);
    }

    // 耳朵
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 0.8;
      const y = 3.5 + Math.random() * 0.8;
      const z = (Math.random() - 0.5) * 0.8;
      particles.push([x, y, z]);
    }

    // 身体
    for (let i = 0; i < 600; i++) {
      const x = (Math.random() - 0.5) * 1.2;
      const y = 1.5 + Math.random() * 1.5;
      const z = (Math.random() - 0.5) * 1.5;
      particles.push([x, y, z]);
    }

    // 尾巴
    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 2;
      const x = 0.6 + Math.cos(angle) * 0.3;
      const y = 2 + Math.sin(angle) * 0.3;
      const z = (Math.random() - 0.5) * 0.3;
      particles.push([x, y, z]);
    }

    // 腿
    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * 1.2;
      const y = -1 + Math.random() * 2.5;
      const z = (Math.random() - 0.5) * 1.2;
      particles.push([x, y, z]);
    }

    return particles;
  }

  function generateDogShape(count) {
    const particles = [];
    
    // 头部
    for (let i = 0; i < 350; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 0.9 + Math.random() * 0.3;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = 3.2 + radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      particles.push([x, y, z]);
    }

    // 耳朵（垂耳）
    for (let i = 0; i < 150; i++) {
      const x = (Math.random() - 0.5) * 1.5;
      const y = 3 + Math.random() * 0.8;
      const z = (Math.random() - 0.5) * 1.0;
      particles.push([x, y, z]);
    }

    // 身体
    for (let i = 0; i < 700; i++) {
      const x = (Math.random() - 0.5) * 1.5;
      const y = 1.2 + Math.random() * 2;
      const z = (Math.random() - 0.5) * 1.8;
      particles.push([x, y, z]);
    }

    // 尾巴
    for (let i = 0; i < 150; i++) {
      const angle = (i / 150) * Math.PI * 2;
      const x = 0.7 + Math.cos(angle) * 0.4;
      const y = 2.2 + Math.sin(angle) * 0.4;
      const z = (Math.random() - 0.5) * 0.4;
      particles.push([x, y, z]);
    }

    // 腿
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 1.4;
      const y = -1 + Math.random() * 2.2;
      const z = (Math.random() - 0.5) * 1.4;
      particles.push([x, y, z]);
    }

    return particles;
  }

  function generateBirdShape(count) {
    const particles = [];
    
    // 头部
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 0.5 + Math.random() * 0.2;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = 3.5 + radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      particles.push([x, y, z]);
    }

    // 身体
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 0.8;
      const y = 2.5 + Math.random() * 1;
      const z = (Math.random() - 0.5) * 1.2;
      particles.push([x, y, z]);
    }

    // 翅膀
    for (let i = 0; i < 600; i++) {
      const side = i < 300 ? -1 : 1;
      const x = side * (0.5 + Math.random() * 1.5);
      const y = 2.8 + Math.random() * 0.4;
      const z = (Math.random() - 0.5) * 1.0;
      particles.push([x, y, z]);
    }

    // 尾巴
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 0.6;
      const y = 2.2 + Math.random() * 0.5;
      const z = 0.8 + Math.random() * 0.5;
      particles.push([x, y, z]);
    }

    // 腿
    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 0.4;
      const y = 1.5 + Math.random() * 1;
      const z = (Math.random() - 0.5) * 0.4;
      particles.push([x, y, z]);
    }

    return particles;
  }

  function generateHeartShape(count) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const scale = 2 + Math.random() * 0.5;
      
      const x = 16 * Math.pow(Math.sin(t), 3) / scale;
      const y = 2 + (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) / scale;
      const z = (Math.random() - 0.5) * 0.5;
      
      particles.push([x, y, z]);
    }

    return particles;
  }

  function generateStarShape(count) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2 + Math.random() * 0.5;
      
      // 五角星形状
      const starAngle = angle * 5;
      const r = (i % 2 === 0) ? radius : radius * 0.4;
      
      const x = r * Math.cos(starAngle);
      const y = 2 + r * Math.sin(starAngle);
      const z = (Math.random() - 0.5) * 0.5;
      
      particles.push([x, y, z]);
    }

    return particles;
  }

  function generateSphereShape(count) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 2 + Math.random() * 0.5;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = 2 + radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      particles.push([x, y, z]);
    }

    return particles;
  }

  console.log('✅ 全息投影馆右墙已开凿门洞（宽4米，高6米）');
  console.log('✅ 全息投影馆创建完成（星空地板、墙壁、天花板、粒子人物雕像、全息投影输入框）');
  return { 
    roomName: '全息投影馆', 
    holographicInput,
    createParticleObject
  };
}

console.log('✅ 全息投影馆模块已加载');
