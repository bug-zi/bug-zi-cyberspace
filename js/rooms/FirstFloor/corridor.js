// ============================================
// 圆弧走廊：连接展厅1和展厅2
// ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建圆弧走廊
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridor(scene, collisionSystem) {
  console.log('🚪 开始创建圆弧走廊...');

  // 材质
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

  // ============================================
  // 圆弧参数（按照旧文件）
  // ============================================
  const arcRadius = 30;        // 圆弧半径（米）
  const arcSegments = 36;       // 分成36段（每10度一段）
  const corridorWidth = 4;       // 走廊宽度（米）- 改为4
  const corridorWallHeight = 6;  // 墙高6米

  // ============================================
  // 创建走廊地板（36个小平面拼成圆弧）
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    // 计算当前段的角度
    const angle = (i / arcSegments) * (Math.PI / 2);

    // 计算该段在圆弧上的位置（圆心在(-30, 15)）
    const x = -30 + Math.cos(angle) * arcRadius;
    const z = 15 + Math.sin(angle) * arcRadius;

    // 创建小平面
    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);

    // 旋转平面到水平
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(-x, -1, z);

    // 旋转平面，让它垂直于圆弧半径方向
    segment.rotation.z = angle;

    scene.add(segment);
  }

  console.log('✅ 圆弧走廊地板已创建（36段，90度）');

  // ============================================
  // 圆弧走廊的外侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = (i / arcSegments) * (Math.PI / 2);
    const outerRadius = arcRadius + 2; // 半径+2米

    const x = -30 + Math.cos(angle) * outerRadius;
    const z = 15 + Math.sin(angle) * outerRadius;

    const outerWallGeometry = new THREE.BoxGeometry(0, corridorWallHeight, outerRadius / arcSegments);
    const outerWall = new THREE.Mesh(outerWallGeometry, wallMaterial);

    outerWall.position.set(-x, 2, z);
    outerWall.rotation.y = angle;

    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  console.log('✅ 圆弧走廊外侧墙已创建');

  // ============================================
  // 圆弧走廊的内侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = (i / arcSegments) * (Math.PI / 2);
    const innerRadius = arcRadius - 2; // 半径-2米

    const innerX = -30 + Math.cos(angle) * innerRadius;
    const innerZ = 15 + Math.sin(angle) * innerRadius;

    // 计算实际x坐标（因为添加到场景时使用了-innerX）
    const actualX = -innerX;
    
    // 检查是否在交接口附近，如果是则跳过创建
    const isNearIntersection = 
      (Math.abs(actualX - 11) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(actualX - 11) < 3 && Math.abs(innerZ - (-34)) < 3) ||
      (Math.abs(actualX - 79) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(actualX - 79) < 3 && Math.abs(innerZ - (-34)) < 3);

    if (isNearIntersection) {
      console.log(`⏭️ 跳过交接口处的内侧墙：(实际X: ${actualX.toFixed(1)}, Z: ${innerZ.toFixed(1)})`);
      continue;
    }

    const innerWallGeometry = new THREE.BoxGeometry(0, corridorWallHeight, innerRadius / arcSegments);
    const innerWall = new THREE.Mesh(innerWallGeometry, wallMaterial);

    innerWall.position.set(-innerX, 2, innerZ);
    innerWall.rotation.y = angle;

    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 圆弧走廊内侧墙已创建（交接口处已移除）');
  console.log('✅ 圆弧走廊全部完成（地板+外侧墙+内侧墙）');
}

/**
 * 创建连接展厅1和展厅4的圆弧走廊
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridorToRoom4(scene, collisionSystem) {
  console.log('🚪 开始创建连接展厅1和展厅4的走廊...');

  // 材质
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

  // ============================================
  // 圆弧参数：按照用户指定
  // 圆心：(30, 0, -15)
  // 圆弧两端：(0, 0, -15) 和 (30, 0, -45)
  // 内半径：28米
  // 外半径：32米
  // 走廊宽度：4米
  // 角度范围：从π（180度）到3π/2（270度），即90度弧
  // ============================================
  const centerX = 30;
  const centerZ = -15;
  const innerRadius = 28;
  const outerRadius = 32;
  const corridorWidth = outerRadius - innerRadius; // 4米
  const arcRadius = (innerRadius + outerRadius) / 2; // 30米（中间半径）
  const arcSegments = 36;       // 分成36段（每10度一段）
  const corridorWallHeight = 6;  // 墙高6米
  const corridorWallDepth = 0.01; // 墙壁厚度
  const startAngle = Math.PI;    // 起始角度：π（180度）
  const endAngle = 3 * Math.PI / 2; // 结束角度：3π/2（270度）

  // ============================================
  // 创建走廊地板（36个小平面拼成圆弧）
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    // 计算当前段的角度（从展厅1后墙到展厅4，顺时针方向）
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    // 计算该段在圆弧上的位置
    const x = centerX + Math.cos(angle) * arcRadius;
    const z = centerZ + Math.sin(angle) * arcRadius;

    // 创建小平面
    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);

    // 旋转平面到水平
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(x, -1, z);

    // 旋转平面，让它垂直于圆弧半径方向
    // 对于角度从π到3π/2的圆弧，地板应该朝向圆弧的切线方向
    segment.rotation.z = -angle;

    scene.add(segment);
  }

  console.log('✅ 展厅1-4走廊地板已创建（36段，90度）');

  // ============================================
  // 圆弧走廊的外侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    const x = centerX + Math.cos(angle) * outerRadius;
    const z = centerZ + Math.sin(angle) * outerRadius;

    const outerWallGeometry = new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, outerRadius / arcSegments);
    const outerWall = new THREE.Mesh(outerWallGeometry, wallMaterial);

    outerWall.position.set(x, 2, z);
    outerWall.rotation.y = angle;

    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  console.log('✅ 展厅1-4走廊外侧墙已创建');

  // ============================================
  // 圆弧走廊的内侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    const innerX = centerX + Math.cos(angle) * innerRadius;
    const innerZ = centerZ + Math.sin(angle) * innerRadius;

    // 检查是否在交接口附近，如果是则跳过创建
    const isNearIntersection = 
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - (-34)) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - (-34)) < 3);

    if (isNearIntersection) {
      console.log(`⏭️ 跳过交接口处的内侧墙：(${innerX.toFixed(1)}, ${innerZ.toFixed(1)})`);
      continue;
    }

    const innerWallGeometry = new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, innerRadius / arcSegments);
    const innerWall = new THREE.Mesh(innerWallGeometry, wallMaterial);

    innerWall.position.set(innerX, 2, innerZ);
    innerWall.rotation.y = angle;

    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 展厅2-3走廊内侧墙已创建（交接口处已移除）');
  console.log('✅ 展厅2-3走廊全部完成（地板+外侧墙+内侧墙）');
}

/**
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridorToRoom2(scene, collisionSystem) {
  console.log('🚪 开始创建连接展厅1和展厅2的直线走廊...');

  // 材质
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

  // ============================================
  // 走廊参数
  // ============================================
  const startX = 11;        // 起点：展厅1后门
  const startZ = 34;
  const endX = 41.414;      // 终点：向电梯方向延长2m
  const endZ = 3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2)); // 走廊长度
  const corridorWidth = 6;     // 走廊宽度改为6m

  // 计算方向向量
  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  // ============================================
  // 创建走廊地板（1段长条形）
  // ============================================
  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, -1, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);

  scene.add(floor);

  // ============================================
  // 创建走廊墙壁
  // ============================================
  const wallHeight = 6;

  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  // 左墙
  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  // 右墙
  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  console.log('✅ 展厅1-2走廊墙壁已创建');
}

/**
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridorFromBottomToRoom2(scene, collisionSystem) {

  // 材质
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

  // 走廊参数
  const startX = 11;
  const startZ = -34;
  const endX = 41.414;      // 终点：向电梯方向延长2m
  const endZ = -3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const corridorWidth = 6;

  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  // 创建地板（6m宽长条形）
  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, -1, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);

  scene.add(floor);

  // ============================================
  // 创建走廊墙壁
  // ============================================
  const wallHeight = 6;

  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  // 左墙
  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  // 右墙
  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  console.log('✅ 走廊(11,-34)->(40,-5)墙壁已创建');
}

/**
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridorFromTopRightToRoom2(scene, collisionSystem) {

  // 材质
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

  // 走廊参数
  const startX = 79;
  const startZ = 34;
  const endX = 48.586;      // 终点：向电梯方向延长2m
  const endZ = 3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const corridorWidth = 6;

  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  // 创建地板（6m宽长条形）
  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, -1, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);

  scene.add(floor);

  // ============================================
  // 创建走廊墙壁
  // ============================================
  const wallHeight = 6;

  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  // 左墙
  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  // 右墙
  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  console.log('✅ 走廊(79,34)->(50,5)墙壁已创建');
}

/**
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridorFromBottomRightToRoom2(scene, collisionSystem) {
  // 材质
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

  // 走廊参数
  const startX = 79;
  const startZ = -34;
  const endX = 48.586;      // 终点：向电梯方向延长2m
  const endZ = -3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const corridorWidth = 6;

  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  // 创建地板（6m宽长条形）
  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, -1, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);

  scene.add(floor);

  // ============================================
  // 创建走廊墙壁
  // ============================================
  const wallHeight = 6;

  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  // 左墙
  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  // 右墙
  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  console.log('✅ 走廊(79,-34)->(50,-5)墙壁已创建');
}

/**
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridorToRoom3(scene, collisionSystem) {


  // 材质
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

  // ============================================
  // 圆弧参数：按照用户指定
  // 圆心：(60, 0, 15)
  // 圆弧两端：(60, 0, 45) 和 (90, 0, 15)
  // 内半径：28米
  // 外半径：32米
  // 走廊宽度：4米
  // 角度范围：从π/2（90度）到0（0度），即-π/2弧（顺时针90度）
  // ============================================
  const centerX = 60;
  const centerZ = 15;
  const innerRadius = 28;
  const outerRadius = 32;
  const corridorWidth = outerRadius - innerRadius; // 4米
  const arcRadius = (innerRadius + outerRadius) / 2; // 30米（中间半径）
  const arcSegments = 36;       // 分成36段（每10度一段）
  const corridorWallHeight = 6;  // 墙高6米
  const corridorWallDepth = 0.01; // 墙壁厚度
  const startAngle = Math.PI / 2; // 起始角度：π/2（90度）
  const endAngle = 0;            // 结束角度：0（0度）

  // ============================================
  // 创建走廊地板（36个小平面拼成圆弧）
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    // 计算当前段的角度（从展厅2到展厅3，顺时针方向）
    const angle = startAngle - (i / arcSegments) * (startAngle - endAngle);

    // 计算该段在圆弧上的位置
    const x = centerX + Math.cos(angle) * arcRadius;
    const z = centerZ + Math.sin(angle) * arcRadius;

    // 创建小平面
    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);

    // 旋转平面到水平
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(x, -1, z);

    // 旋转平面，让它垂直于圆弧半径方向
    segment.rotation.z = -angle;

    scene.add(segment);
  }

  console.log('✅ 展厅2-3走廊地板已创建（36段，90度）');

  // ============================================
  // 圆弧走廊的外侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle - (i / arcSegments) * (startAngle - endAngle);

    const x = centerX + Math.cos(angle) * outerRadius;
    const z = centerZ + Math.sin(angle) * outerRadius;

    const outerWallGeometry = new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, outerRadius / arcSegments);
    const outerWall = new THREE.Mesh(outerWallGeometry, wallMaterial);

    outerWall.position.set(x, 2, z);
    outerWall.rotation.y = angle;

    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  console.log('✅ 展厅2-3走廊外侧墙已创建');

  // ============================================
  // 圆弧走廊的内侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle - (i / arcSegments) * (startAngle - endAngle);

    const innerX = centerX + Math.cos(angle) * innerRadius;
    const innerZ = centerZ + Math.sin(angle) * innerRadius;

    // 检查是否在交接口附近，如果是则跳过创建
    const isNearIntersection = 
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - (-34)) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - (-34)) < 3);

    if (isNearIntersection) {
      console.log(`⏭️ 跳过交接口处的内侧墙：(${innerX.toFixed(1)}, ${innerZ.toFixed(1)})`);
      continue;
    }

    const innerWallGeometry = new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, innerRadius / arcSegments);
    const innerWall = new THREE.Mesh(innerWallGeometry, wallMaterial);

    innerWall.position.set(innerX, 2, innerZ);
    innerWall.rotation.y = angle;

    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 展厅2-3走廊内侧墙已创建（交接口处已移除）');
  console.log('✅ 展厅2-3走廊全部完成（地板+外侧墙+内侧墙）');
}

/**
 * 创建连接展厅3和展厅4的圆弧走廊
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createCorridorToRoom4FromRoom3(scene, collisionSystem) {
  console.log('🚪 开始创建连接展厅3和展厅4的走廊...');

  // 材质
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

  // ============================================
  // 圆弧参数：按照用户指定
  // 圆心：(60, 0, -15)
  // 圆弧两端：(60, 0, -45) 和 (90, 0, -15)
  // 内半径：28米
  // 外半径：32米
  // 走廊宽度：4米
  // 角度范围：从3π/2（270度）到2π（360度），即顺时针90度
  // ============================================
  const centerX = 60;
  const centerZ = -15;
  const innerRadius = 28;
  const outerRadius = 32;
  const corridorWidth = outerRadius - innerRadius; // 4米
  const arcRadius = (innerRadius + outerRadius) / 2; // 30米（中间半径）
  const arcSegments = 36;       // 分成36段（每10度一段）
  const corridorWallHeight = 6;  // 墙高6米
  const corridorWallDepth = 0.01; // 墙壁厚度
  const startAngle = 3 * Math.PI / 2; // 起始角度：3π/2（270度）
  const endAngle = 2 * Math.PI;       // 结束角度：2π（360度）

  // ============================================
  // 创建走廊地板（36个小平面拼成圆弧）
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    // 计算当前段的角度（从展厅4到展厅3，顺时针方向）
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    // 计算该段在圆弧上的位置
    const x = centerX + Math.cos(angle) * arcRadius;
    const z = centerZ + Math.sin(angle) * arcRadius;

    // 创建小平面
    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);

    // 旋转平面到水平
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(x, -1, z);

    // 旋转平面，让它垂直于圆弧半径方向
    segment.rotation.z = -angle;

    scene.add(segment);
  }

  console.log('✅ 展厅3-4走廊地板已创建（36段，90度）');

  // ============================================
  // 圆弧走廊的外侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    const x = centerX + Math.cos(angle) * outerRadius;
    const z = centerZ + Math.sin(angle) * outerRadius;

    const outerWallGeometry = new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, outerRadius / arcSegments);
    const outerWall = new THREE.Mesh(outerWallGeometry, wallMaterial);

    outerWall.position.set(x, 2, z);
    outerWall.rotation.y = angle;

    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  console.log('✅ 展厅3-4走廊外侧墙已创建');

  // ============================================
  // 圆弧走廊的内侧墙
  // ============================================
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    const innerX = centerX + Math.cos(angle) * innerRadius;
    const innerZ = centerZ + Math.sin(angle) * innerRadius;

    // 检查是否在交接口附近，如果是则跳过创建
    const isNearIntersection = 
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - (-34)) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - (-34)) < 3);

    if (isNearIntersection) {
      console.log(`⏭️ 跳过交接口处的内侧墙：(${innerX.toFixed(1)}, ${innerZ.toFixed(1)})`);
      continue;
    }

    const innerWallGeometry = new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, innerRadius / arcSegments);
    const innerWall = new THREE.Mesh(innerWallGeometry, wallMaterial);

    innerWall.position.set(innerX, 2, innerZ);
    innerWall.rotation.y = angle;

    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 展厅3-4走廊内侧墙已创建（交接口处已移除）');
  console.log('✅ 展厅3-4走廊全部完成（地板+外侧墙+内侧墙）');
}
