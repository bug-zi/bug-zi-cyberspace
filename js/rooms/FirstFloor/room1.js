// ============================================
// 展厅1：第一个展厅（包含玻璃金字塔、5幅画作）
// ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createFloor, createWall, createDoorWall, createPainting, createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建展厅1
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createRoom1(scene, collisionSystem) {
  console.log('🏛️ 开始创建展厅1...');

  // ============================================
  // 材质创建
  // ============================================
  const wallTexture = createLuxuryWallTexture();
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(2, 1);

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.5,
    metalness: 0.1
  });

  const floorTexture = createMarbleFloorTexture();
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(3, 3);

  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.2,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const goldFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.3,
    metalness: 0.8
  });

  // ============================================
  // 门洞和墙壁的通用参数
  // ============================================
  const doorWidth = CONFIG.DOOR.WIDTH;
  const doorHeight = CONFIG.DOOR.HEIGHT;
  const wallWidth = CONFIG.ROOM.WIDTH;
  const wallHeight = CONFIG.ROOM.HEIGHT;
  const wallDepth = CONFIG.ROOM.WALL_DEPTH;

  // ============================================
  // 创建地板
  // ============================================
  const floor = createFloor(
    CONFIG.ROOM.WIDTH,
    CONFIG.ROOM.DEPTH,
    floorMaterial
  );
  floor.position.set(45, -1, -45);
  scene.add(floor);

  // ============================================
  // 创建墙壁（后墙、左墙、右墙、前墙带门洞）
  // ============================================

  // 后墙（现在变成左墙，带门洞：宽4米×高6米）
  // 1. 顶部墙板（横梁）- 跨越整个深度
  const backWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  backWallTop.position.set(45 - 15, 5 + (wallHeight - doorHeight) / 2, -45);
  backWallTop.rotation.y = Math.PI / 2;
  scene.add(backWallTop);
  collisionSystem.addObject(backWallTop);

  // 2. 左墙板
  const backWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  backWallLeft.position.set(45 - 15, -1 + doorHeight / 2, -45 - (doorWidth / 2 + (wallWidth - doorWidth) / 4));
  backWallLeft.rotation.y = Math.PI / 2;
  scene.add(backWallLeft);
  collisionSystem.addObject(backWallLeft);

  // 3. 右墙板
  const backWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  backWallRight.position.set(45 - 15, -1 + doorHeight / 2, -45 + (doorWidth / 2 + (wallWidth - doorWidth) / 4));
  backWallRight.rotation.y = Math.PI / 2;
  scene.add(backWallRight);
  collisionSystem.addObject(backWallRight);

  console.log('✅ 后墙（现在变成左墙）已开凿门洞（宽4米，高6米）');

  // 左墙（现在变成后墙，Z轴负方向）
  const leftWall = createWall(
    CONFIG.ROOM.WIDTH,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  leftWall.position.set(45, (CONFIG.ROOM.HEIGHT - 2) / 2, -45 - CONFIG.ROOM.DEPTH / 2);
  leftWall.rotation.y = 0;
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  // 右墙（现在变成前墙，Z轴正方向）
  const rightWall = createWall(
    CONFIG.ROOM.WIDTH,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  rightWall.position.set(45, (CONFIG.ROOM.HEIGHT - 2) / 2, -45 + CONFIG.ROOM.DEPTH / 2);
  rightWall.rotation.y = 0;
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  // 前墙（现在变成右墙，带门洞：宽4米×高6米）
  // 1. 顶部墙板（横梁）- 跨越整个深度
  const frontWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  frontWallTop.position.set(45 + 15, 5 + (wallHeight - doorHeight) / 2, -45);
  frontWallTop.rotation.y = Math.PI / 2;
  scene.add(frontWallTop);
  collisionSystem.addObject(frontWallTop);

  // 2. 左墙板
  const frontWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  frontWallLeft.position.set(45 + 15, -1 + doorHeight / 2, -45 - (doorWidth / 2 + (wallWidth - doorWidth) / 4));
  frontWallLeft.rotation.y = Math.PI / 2;
  scene.add(frontWallLeft);
  collisionSystem.addObject(frontWallLeft);

  // 3. 右墙板
  const frontWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((wallWidth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  frontWallRight.position.set(45 + 15, -1 + doorHeight / 2, -45 + (doorWidth / 2 + (wallWidth - doorWidth) / 4));
  frontWallRight.rotation.y = Math.PI / 2;
  scene.add(frontWallRight);
  collisionSystem.addObject(frontWallRight);

  console.log('✅ 前墙（现在变成右墙）已开凿门洞（宽4米，高6米）');

  // ============================================
  // 创建天花板
  // ============================================
  const ceilingTexture = createLuxuryWallTexture();
  ceilingTexture.wrapS = THREE.RepeatWrapping;
  ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(2, 2);

  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const ceilingGeometry = new THREE.PlaneGeometry(CONFIG.ROOM.WIDTH, CONFIG.ROOM.DEPTH);
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(45, CONFIG.ROOM.HEIGHT - 1, -45);
  scene.add(ceiling);

  
  // 画作2（后墙前部）：自然奇观
  const painting2 = createPainting(
    5, 3.5, 0.15,
    './photo/壁纸3.jpg',
    '自然奇观',
    '捕捉大自然的壮丽\n展现自然界的神秘力量',
    goldFrameMaterial
  );
  painting2.position.set(45 - 5, 3.5, -45 - 14.7);
  painting2.rotation.y = 0;
  scene.add(painting2);
  collisionSystem.addObject(painting2);

  // 画作2的聚光灯
  const paintingLight2 = new THREE.SpotLight(0xffffff, 1.8);
  paintingLight2.position.set(45 - 5, 6, -45 - 12);
  paintingLight2.target = painting2;
  paintingLight2.angle = Math.PI / 6;
  scene.add(paintingLight2);

  // 画作3（后墙后部）：城市印象
  const painting3 = createPainting(
    5, 3.5, 0.15,
    './photo/壁纸4.jpg',
    '城市印象',
    '现代都市的艺术表达\n探索城市生活的美学',
    goldFrameMaterial
  );
  painting3.position.set(45 + 5, 3.5, -45 - 14.7);
  painting3.rotation.y = 0;
  scene.add(painting3);
  collisionSystem.addObject(painting3);

  // 画作3的聚光灯
  const paintingLight3 = new THREE.SpotLight(0xffffff, 1.8);
  paintingLight3.position.set(45 + 5, 6, -45 - 12);
  paintingLight3.target = painting3;
  paintingLight3.angle = Math.PI / 6;
  scene.add(paintingLight3);

  // 画作4（前墙前部）：梦幻色彩
  const painting4 = createPainting(
    5, 3.5, 0.15,
    './photo/壁纸5.jpg',
    '梦幻色彩',
    '抽象艺术的色彩探索\n表达内心情感世界',
    goldFrameMaterial
  );
  painting4.position.set(45 - 5, 3.5, -45 + 14.7);
  painting4.rotation.y = Math.PI;
  scene.add(painting4);
  collisionSystem.addObject(painting4);

  // 画作4的聚光灯
  const paintingLight4 = new THREE.SpotLight(0xffffff, 1.8);
  paintingLight4.position.set(45 - 5, 6, -45 + 12);
  paintingLight4.target = painting4;
  paintingLight4.angle = Math.PI / 6;
  scene.add(paintingLight4);

  // 画作5（前墙后部）：艺术新纪元
  const painting5 = createPainting(
    5, 3.5, 0.15,
    './photo/壁纸6.jpg',
    '艺术新纪元',
    '当代艺术的创新表达\n突破传统的艺术边界',
    goldFrameMaterial
  );
  painting5.position.set(45 + 5, 3.5, -45 + 14.7);
  painting5.rotation.y = Math.PI;
  scene.add(painting5);
  collisionSystem.addObject(painting5);

  // 画作5的聚光灯
  const paintingLight5 = new THREE.SpotLight(0xffffff, 1.8);
  paintingLight5.position.set(45 + 5, 6, -45 + 12);
  paintingLight5.target = painting5;
  paintingLight5.angle = Math.PI / 6;
  scene.add(paintingLight5);

  console.log('✅ 展厅1创建完成（地板、4面墙、5幅画作）');

  // ⚠️ 重要：返回展厅对象引用，供其他系统使用
  return {
    roomName: '展厅1'
  };
}
