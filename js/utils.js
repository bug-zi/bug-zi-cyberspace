// ============================================
// 工具函数库：创建地板、墙壁、画作等通用函数
// ============================================

import * as THREE from 'three';
import { CONFIG } from './config.js';

// ============================================
// 纹理创建函数
// ============================================

/**
 * 创建大理石地板纹理
 * @returns {THREE.CanvasTexture} 大理石地板纹理
 */
export function createMarbleFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 基础米白色
  ctx.fillStyle = '#f8f6f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 添加大理石纹理效果
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 30 + 10;
    const alpha = Math.random() * 0.05;
    ctx.fillStyle = `rgba(200, 180, 160, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // 绘制菱形图案
  const diamondSize = 128;
  const diamondCols = canvas.width / diamondSize;
  const diamondRows = canvas.height / diamondSize;

  for (let row = 0; row < diamondRows; row++) {
    for (let col = 0; col < diamondCols; col++) {
      const cx = col * diamondSize + diamondSize / 2;
      const cy = row * diamondSize + diamondSize / 2;

      // 菱形
      ctx.beginPath();
      ctx.moveTo(cx, cy - diamondSize / 2);
      ctx.lineTo(cx + diamondSize / 2, cy);
      ctx.lineTo(cx, cy + diamondSize / 2);
      ctx.lineTo(cx - diamondSize / 2, cy);
      ctx.closePath();

      // 交替颜色
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      } else {
        ctx.fillStyle = 'rgba(230, 220, 210, 0.1)';
      }
      ctx.fill();

      // 金色边框
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // 添加金色线条装饰
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // 内边框
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  return new THREE.CanvasTexture(canvas);
}

/**
 * 创建精致墙壁纹理
 * @returns {THREE.CanvasTexture} 精致墙壁纹理
 */
export function createLuxuryWallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 柔和的渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#faf9f6');
  gradient.addColorStop(0.5, '#f5f2eb');
  gradient.addColorStop(1, '#f0ece0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 添加细腻的纹理
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 15 + 3;
    const alpha = Math.random() * 0.02;
    ctx.fillStyle = `rgba(170, 150, 130, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // 简洁的边框
  const margin = 20;

  // 外层细边框
  ctx.strokeStyle = 'rgba(180, 160, 140, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);

  // 内层金色边框
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(margin + 6, margin + 6, canvas.width - (margin + 6) * 2, canvas.height - (margin + 6) * 2);

  // 精致的角落装饰
  const cornerSize = 35;
  const cornerOffset = margin;

  // 绘制四个角落的装饰
  function drawCorner(x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // 金色装饰
    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.fillRect(0, 0, cornerSize, 2);
    ctx.fillRect(0, 0, 2, cornerSize);

    ctx.restore();
  }

  // 四个角落
  drawCorner(cornerOffset, cornerOffset, 0);
  drawCorner(canvas.width - cornerOffset, cornerOffset, Math.PI / 2);
  drawCorner(canvas.width - cornerOffset, canvas.height - cornerOffset, Math.PI);
  drawCorner(cornerOffset, canvas.height - cornerOffset, -Math.PI / 2);

  return new THREE.CanvasTexture(canvas);
}

/**
 * 创建乐高风格纹理
 * @returns {THREE.CanvasTexture} 乐高风格纹理
 */
export function createLegoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 单一的灰色乐高积木
  const legoColor = '#9E9E9E'; // 乐高灰色
  const darkShadow = 'rgba(0, 0, 0, 0.3)';
  const lightHighlight = 'rgba(255, 255, 255, 0.4)';

  // 绘制乐高积木块（4x2的标准积木）
  const blockLength = 256; // 4个凸起的长度
  const blockWidth = 128;  // 2个凸起的宽度
  const blockHeight = 64;  // 积木高度

  // 计算画布中心
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // 积木位置
  const blockX = centerX - blockLength / 2;
  const blockY = centerY - blockHeight / 2;

  // 绘制积木主体
  ctx.fillStyle = legoColor;
  ctx.fillRect(blockX, blockY, blockLength, blockHeight);

  // 绘制积木侧面阴影
  const shadowWidth = 8;
  
  // 右侧阴影
  ctx.fillStyle = darkShadow;
  ctx.fillRect(blockX + blockLength - shadowWidth, blockY, shadowWidth, blockHeight);
  
  // 底部阴影
  ctx.fillStyle = darkShadow;
  ctx.fillRect(blockX, blockY + blockHeight - shadowWidth, blockLength, shadowWidth);

  // 绘制积木顶部的凸起（studs）
  const studDiameter = 32;
  const studHeight = 8;
  const studsPerRow = 4;
  const studsPerCol = 2;
  const studSpacingX = (blockLength - studDiameter * studsPerRow) / (studsPerRow + 1) + studDiameter;
  const studSpacingY = (blockWidth - studDiameter * studsPerCol) / (studsPerCol + 1) + studDiameter;

  for (let row = 0; row < studsPerCol; row++) {
    for (let col = 0; col < studsPerRow; col++) {
      const studX = blockX + studSpacingX * (col + 0.5);
      const studY = blockY + studSpacingY * (row + 0.5);
      
      // 绘制凸起底座
      ctx.fillStyle = legoColor;
      ctx.beginPath();
      ctx.arc(studX, studY, studDiameter / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制凸起顶部
      ctx.fillStyle = legoColor;
      ctx.beginPath();
      ctx.arc(studX, studY, studDiameter / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 凸起顶部高光
      ctx.fillStyle = lightHighlight;
      ctx.beginPath();
      ctx.arc(studX - studDiameter * 0.15, studY - studDiameter * 0.15, studDiameter * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 绘制积木边缘高光
  ctx.strokeStyle = lightHighlight;
  ctx.lineWidth = 2;
  ctx.strokeRect(blockX + 1, blockY + 1, blockLength - 2, blockHeight - 2);

  return new THREE.CanvasTexture(canvas);
}

/**
 * 创建乐高风格地板纹理
 * @returns {THREE.CanvasTexture} 乐高风格地板纹理
 */
export function createLegoFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 乐高灰色
  const legoColor = '#9E9E9E';
  const darkShadow = 'rgba(0, 0, 0, 0.3)';
  const lightHighlight = 'rgba(255, 255, 255, 0.4)';

  // 绘制乐高地板（带凸起）
  const blockSize = 128;
  const blockRows = 4;
  const blockCols = 4;

  for (let row = 0; row < blockRows; row++) {
    for (let col = 0; col < blockCols; col++) {
      const blockX = col * blockSize;
      const blockY = row * blockSize;

      // 绘制积木主体
      ctx.fillStyle = legoColor;
      ctx.fillRect(blockX, blockY, blockSize, blockSize);

      // 绘制积木侧面阴影
      const shadowWidth = 8;
      ctx.fillStyle = darkShadow;
      ctx.fillRect(blockX + blockSize - shadowWidth, blockY, shadowWidth, blockSize);
      ctx.fillRect(blockX, blockY + blockSize - shadowWidth, blockSize, shadowWidth);

      // 绘制积木顶部的凸起（studs）
      const studDiameter = 32;
      const studsPerRow = 2;
      const studsPerCol = 2;
      const studSpacing = blockSize / (studsPerRow + 1);

      for (let r = 0; r < studsPerRow; r++) {
        for (let c = 0; c < studsPerCol; c++) {
          const studX = blockX + studSpacing * (c + 1);
          const studY = blockY + studSpacing * (r + 1);
          
          // 凸起底座
          ctx.fillStyle = legoColor;
          ctx.beginPath();
          ctx.arc(studX, studY, studDiameter / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // 凸起顶部
          ctx.fillStyle = legoColor;
          ctx.beginPath();
          ctx.arc(studX, studY, studDiameter / 2 - 2, 0, Math.PI * 2);
          ctx.fill();
          
          // 凸起顶部高光
          ctx.fillStyle = lightHighlight;
          ctx.beginPath();
          ctx.arc(studX - studDiameter * 0.15, studY - studDiameter * 0.15, studDiameter * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 绘制积木边缘高光
      ctx.strokeStyle = lightHighlight;
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX + 1, blockY + 1, blockSize - 2, blockSize - 2);
    }
  }

  return new THREE.CanvasTexture(canvas);
}

/**
 * 创建乐高风格天花板纹理
 * @returns {THREE.CanvasTexture} 乐高风格天花板纹理
 */
export function createLegoCeilingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 乐高灰色
  const legoColor = '#9E9E9E';
  const darkShadow = 'rgba(0, 0, 0, 0.3)';
  const lightHighlight = 'rgba(255, 255, 255, 0.4)';

  // 绘制乐高天花板（带凸起）
  const blockSize = 128;
  const blockRows = 4;
  const blockCols = 4;

  for (let row = 0; row < blockRows; row++) {
    for (let col = 0; col < blockCols; col++) {
      const blockX = col * blockSize;
      const blockY = row * blockSize;

      // 绘制积木主体
      ctx.fillStyle = legoColor;
      ctx.fillRect(blockX, blockY, blockSize, blockSize);

      // 绘制积木侧面阴影
      const shadowWidth = 8;
      ctx.fillStyle = darkShadow;
      ctx.fillRect(blockX + blockSize - shadowWidth, blockY, shadowWidth, blockSize);
      ctx.fillRect(blockX, blockY + blockSize - shadowWidth, blockSize, shadowWidth);

      // 绘制积木顶部的凸起（studs）
      const studDiameter = 32;
      const studsPerRow = 2;
      const studsPerCol = 2;
      const studSpacing = blockSize / (studsPerRow + 1);

      for (let r = 0; r < studsPerRow; r++) {
        for (let c = 0; c < studsPerCol; c++) {
          const studX = blockX + studSpacing * (c + 1);
          const studY = blockY + studSpacing * (r + 1);
          
          // 凸起底座
          ctx.fillStyle = legoColor;
          ctx.beginPath();
          ctx.arc(studX, studY, studDiameter / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // 凸起顶部
          ctx.fillStyle = legoColor;
          ctx.beginPath();
          ctx.arc(studX, studY, studDiameter / 2 - 2, 0, Math.PI * 2);
          ctx.fill();
          
          // 凸起顶部高光
          ctx.fillStyle = lightHighlight;
          ctx.beginPath();
          ctx.arc(studX - studDiameter * 0.15, studY - studDiameter * 0.15, studDiameter * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 绘制积木边缘高光
      ctx.strokeStyle = lightHighlight;
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX + 1, blockY + 1, blockSize - 2, blockSize - 2);
    }
  }

  return new THREE.CanvasTexture(canvas);
}

/**
 * 创建地板
 * @param {number} width - 地板宽度
 * @param {number} depth - 地板深度
 * @param {THREE.Material} material - 地板材质
 * @returns {THREE.Mesh} 地板网格
 */
export function createFloor(width, depth, material) {
  const geometry = new THREE.PlaneGeometry(width, depth);
  const floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1; // 对齐地板高度
  return floor;
}

/**
 * 创建墙壁
 * @param {number} width - 墙壁宽度
 * @param {number} height - 墙壁高度
 * @param {number} depth - 墙壁厚度
 * @param {THREE.Material} material - 墙壁材质
 * @returns {THREE.Mesh} 墙壁网格
 */
export function createWall(width, height, depth, material) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  return new THREE.Mesh(geometry, material);
}

/**
 * 创建带门洞的墙壁（三部分：左墙板、右墙板、顶部横梁）
 * @param {number} wallX - 墙的X坐标中心
 * @param {number} wallY - 墙的Y坐标中心
 * @param {number} wallZ - 墙的Z坐标
 * @param {number} doorWidth - 门洞宽度
 * @param {number} doorHeight - 门洞高度
 * @param {THREE.Material} material - 墙壁材质
 * @returns {THREE.Group} 墙壁组（包含3个部分）
 */
export function createDoorWall(wallX, wallY, wallZ, doorWidth, doorHeight, material) {
  const wallWidth = CONFIG.ROOM.WIDTH;
  const wallHeight = CONFIG.ROOM.HEIGHT;
  const wallDepth = CONFIG.ROOM.WALL_DEPTH;

  const wallGroup = new THREE.Group();

  // 1. 顶部横梁（跨越整个宽度）
  const topHeight = wallHeight - doorHeight;
  const topWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, topHeight, wallDepth),
    material
  );
  topWall.position.set(wallX, doorHeight + topHeight / 2, wallZ);
  wallGroup.add(topWall);

  // 2. 左墙板（门洞左侧）
  const leftWidth = (wallWidth - doorWidth) / 2;
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(leftWidth, doorHeight, wallDepth),
    material
  );
  leftWall.position.set(wallX - leftWidth / 2, -1 + doorHeight / 2, wallZ);
  wallGroup.add(leftWall);

  // 3. 右墙板（门洞右侧）
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(leftWidth, doorHeight, wallDepth),
    material
  );
  rightWall.position.set(wallX + leftWidth / 2, -1 + doorHeight / 2, wallZ);
  wallGroup.add(rightWall);

  // 设置整个墙的位置
  wallGroup.position.set(wallX, wallY, wallZ);

  return wallGroup;
}

/**
 * 创建画作
 * @param {number} width - 画作宽度
 * @param {number} height - 画作高度
 * @param {number} depth - 画作厚度
 * @param {string} texturePath - 纹理图片路径
 * @param {string} title - 画作标题
 * @param {string} description - 画作描述
 * @param {THREE.Material} frameMaterial - 画框材质
 * @returns {THREE.Mesh} 画作网格
 */
export function createPainting(width, height, depth, texturePath, title, description, frameMaterial) {
  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(
    texturePath,
    () => console.log(`✅ ${title} 纹理加载成功`),
    undefined,
    (error) => console.error(`❌ ${title} 纹理加载失败:`, error)
  );

  // 画芯材质
  const paintingMaterial = new THREE.MeshStandardMaterial({
    map: paintingTexture,
    roughness: 0.5,
    metalness: 0.0
  });

  // 创建画框（6个面）
  const painting = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    [
      frameMaterial,  // 右面
      frameMaterial,  // 左面
      frameMaterial,  // 上面
      frameMaterial,  // 下面
      paintingMaterial,  // 前面（画芯）
      frameMaterial   // 后面
    ]
  );

  painting.name = `${title}\n${description}`;

  return painting;
}

console.log('✅ 工具函数库已加载');
