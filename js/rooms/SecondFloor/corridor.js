// ============================================ 第二层走廊 ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建第二层走廊1（连接展厅1和展厅2）
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCorridor1(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const arcRadius = 30;
  const arcSegments = 36;
  const corridorWidth = 4;
  const corridorWallHeight = 10;

  for (let i = 0; i < arcSegments; i++) {
    const angle = (i / arcSegments) * (Math.PI / 2);
    const x = -30 + Math.cos(angle) * arcRadius;
    const z = 15 + Math.sin(angle) * arcRadius;

    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(-x, floorY, z);
    segment.rotation.z = angle;
    scene.add(segment);

    const outerRadius = arcRadius + 2;
    const outerX = -30 + Math.cos(angle) * outerRadius;
    const outerZ = 15 + Math.sin(angle) * outerRadius;
    const outerWall = new THREE.Mesh(new THREE.BoxGeometry(0, corridorWallHeight, outerRadius / arcSegments), wallMaterial);
    outerWall.position.set(-outerX, floorY + 2, outerZ);
    outerWall.rotation.y = angle;
    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  // 创建内侧墙壁（跳过与通往电梯走廊相连的部分）
  for (let i = 0; i < arcSegments; i++) {
    const angle = (i / arcSegments) * (Math.PI / 2);
    const innerRadius = arcRadius - 2;

    const innerX = -30 + Math.cos(angle) * innerRadius;
    const innerZ = 15 + Math.sin(angle) * innerRadius;

    // 检查是否在交接口附近（与通往电梯走廊相连的部分），如果是则跳过创建
    const isNearIntersection =
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - 34) < 3);

    if (isNearIntersection) {
      continue;
    }

    const innerWall = new THREE.Mesh(new THREE.BoxGeometry(0, corridorWallHeight, innerRadius / arcSegments), wallMaterial);
    innerWall.position.set(-innerX, floorY + 2, innerZ);
    innerWall.rotation.y = angle;
    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 第二层走廊1已创建（连接展厅1和展厅2，交接口处内侧墙已移除）');
}

/**
 * 创建第二层走廊2（连接展厅1和展厅4）
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCorridor2(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const centerX = 30;
  const centerZ = -15;
  const innerRadius = 28;
  const outerRadius = 32;
  const corridorWidth = outerRadius - innerRadius;
  const arcRadius = (innerRadius + outerRadius) / 2;
  const arcSegments = 36;
  const corridorWallHeight = 10;
  const corridorWallDepth = 0.01;
  const startAngle = Math.PI;
  const endAngle = 3 * Math.PI / 2;

  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);
    const x = centerX + Math.cos(angle) * arcRadius;
    const z = centerZ + Math.sin(angle) * arcRadius;

    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(x, floorY, z);
    segment.rotation.z = -angle;
    scene.add(segment);

    const outerX = centerX + Math.cos(angle) * outerRadius;
    const outerZ = centerZ + Math.sin(angle) * outerRadius;
    const outerWall = new THREE.Mesh(new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, outerRadius / arcSegments), wallMaterial);
    outerWall.position.set(outerX, floorY + 2, outerZ);
    outerWall.rotation.y = angle;
    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  // 创建内侧墙壁（跳过与通往电梯走廊相连的部分）
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    const innerX = centerX + Math.cos(angle) * innerRadius;
    const innerZ = centerZ + Math.sin(angle) * innerRadius;

    // 检查是否在交接口附近（与通往电梯走廊相连的部分），如果是则跳过创建
    const isNearIntersection =
      (Math.abs(innerX - 11) < 3 && Math.abs(innerZ - (-34)) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - (-34)) < 3);

    if (isNearIntersection) {
      continue;
    }

    const innerWall = new THREE.Mesh(new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, arcRadius / arcSegments), wallMaterial);
    innerWall.position.set(innerX, floorY + 2, innerZ);
    innerWall.rotation.y = angle;
    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 第二层走廊2已创建（连接展厅1和展厅4，交接口处内侧墙已移除）');
}

/**
 * 创建第二层走廊3（连接展厅2和展厅3）
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCorridor3(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const centerX = 60;
  const centerZ = 15;
  const innerRadius = 28;
  const outerRadius = 32;
  const corridorWidth = outerRadius - innerRadius;
  const arcRadius = (innerRadius + outerRadius) / 2;
  const arcSegments = 36;
  const corridorWallHeight = 10;
  const corridorWallDepth = 0.01;
  const startAngle = Math.PI / 2;
  const endAngle = 0;

  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle - (i / arcSegments) * (startAngle - endAngle);
    const x = centerX + Math.cos(angle) * arcRadius;
    const z = centerZ + Math.sin(angle) * arcRadius;

    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(x, floorY, z);
    segment.rotation.z = -angle;
    scene.add(segment);

    const outerX = centerX + Math.cos(angle) * outerRadius;
    const outerZ = centerZ + Math.sin(angle) * outerRadius;
    const outerWall = new THREE.Mesh(new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, outerRadius / arcSegments), wallMaterial);
    outerWall.position.set(outerX, floorY + 2, outerZ);
    outerWall.rotation.y = angle;
    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  // 创建内侧墙壁（跳过与通往电梯走廊相连的部分）
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle - (i / arcSegments) * (startAngle - endAngle);

    const innerX = centerX + Math.cos(angle) * innerRadius;
    const innerZ = centerZ + Math.sin(angle) * innerRadius;

    // 检查是否在交接口附近（与通往电梯走廊相连的部分），如果是则跳过创建
    const isNearIntersection =
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - (-34)) < 3);

    if (isNearIntersection) {
      continue;
    }

    const innerWall = new THREE.Mesh(new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, arcRadius / arcSegments), wallMaterial);
    innerWall.position.set(innerX, floorY + 2, innerZ);
    innerWall.rotation.y = angle;
    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 第二层走廊3已创建（连接展厅2和展厅3，交接口处内侧墙已移除）');
}

/**
 * 创建第二层走廊4（连接展厅3和展厅4）
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCorridor4(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const centerX = 60;
  const centerZ = -15;
  const innerRadius = 28;
  const outerRadius = 32;
  const corridorWidth = outerRadius - innerRadius;
  const arcRadius = (innerRadius + outerRadius) / 2;
  const arcSegments = 36;
  const corridorWallHeight = 10;
  const corridorWallDepth = 0.01;
  const startAngle = 3 * Math.PI / 2;
  const endAngle = 2 * Math.PI;

  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);
    const x = centerX + Math.cos(angle) * arcRadius;
    const z = centerZ + Math.sin(angle) * arcRadius;

    const segmentGeometry = new THREE.PlaneGeometry(corridorWidth, arcRadius / arcSegments);
    const segment = new THREE.Mesh(segmentGeometry, floorMaterial);
    segment.rotation.x = -Math.PI / 2;
    segment.position.set(x, floorY, z);
    segment.rotation.z = -angle;
    scene.add(segment);

    const outerX = centerX + Math.cos(angle) * outerRadius;
    const outerZ = centerZ + Math.sin(angle) * outerRadius;
    const outerWall = new THREE.Mesh(new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, outerRadius / arcSegments), wallMaterial);
    outerWall.position.set(outerX, floorY + 2, outerZ);
    outerWall.rotation.y = angle;
    scene.add(outerWall);
    collisionSystem.addObject(outerWall);
  }

  // 创建内侧墙壁（跳过与通往电梯走廊相连的部分）
  for (let i = 0; i < arcSegments; i++) {
    const angle = startAngle + (i / arcSegments) * (endAngle - startAngle);

    const innerX = centerX + Math.cos(angle) * innerRadius;
    const innerZ = centerZ + Math.sin(angle) * innerRadius;

    // 检查是否在交接口附近（与通往电梯走廊相连的部分），如果是则跳过创建
    const isNearIntersection =
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - 34) < 3) ||
      (Math.abs(innerX - 79) < 3 && Math.abs(innerZ - (-34)) < 3);

    if (isNearIntersection) {
      continue;
    }

    const innerWall = new THREE.Mesh(new THREE.BoxGeometry(corridorWallDepth, corridorWallHeight, arcRadius / arcSegments), wallMaterial);
    innerWall.position.set(innerX, floorY + 2, innerZ);
    innerWall.rotation.y = angle;
    scene.add(innerWall);
    collisionSystem.addObject(innerWall);
  }

  console.log('✅ 第二层走廊4已创建（连接展厅3和展厅4，交接口处内侧墙已移除）');
}

/**
 * 创建第二层通往中心走廊1
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCenterCorridor1(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const startX = 11;
  const startZ = 34;
  const endX = 41.414;      // 终点：向电梯方向延长2m
  const endZ = 3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const corridorWidth = 6;

  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, floorY, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);
  scene.add(floor);

  const wallHeight = 10;
  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, floorY + 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, floorY + 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  const invisiblePlatform = new THREE.Mesh(
    new THREE.PlaneGeometry(corridorWidth, corridorLength),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  invisiblePlatform.rotation.x = -Math.PI / 2;
  invisiblePlatform.position.set(midX, floorY + 0.01, midZ);
  invisiblePlatform.rotation.z = Math.atan2(directionX, directionZ);
  invisiblePlatform.name = '第二层走廊1地面';
  scene.add(invisiblePlatform);
  collisionSystem.addObject(invisiblePlatform);

  console.log('✅ 第二层通往中心走廊1已创建');
}

/**
 * 创建第二层通往中心走廊2
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCenterCorridor2(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const startX = 11;
  const startZ = -34;
  const endX = 41.414;      // 终点：向电梯方向延长2m
  const endZ = -3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const corridorWidth = 6;

  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, floorY, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);
  scene.add(floor);

  const wallHeight = 10;
  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, floorY + 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, floorY + 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  const invisiblePlatform = new THREE.Mesh(
    new THREE.PlaneGeometry(corridorWidth, corridorLength),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  invisiblePlatform.rotation.x = -Math.PI / 2;
  invisiblePlatform.position.set(midX, floorY + 0.01, midZ);
  invisiblePlatform.rotation.z = Math.atan2(directionX, directionZ);
  invisiblePlatform.name = '第二层走廊2地面';
  scene.add(invisiblePlatform);
  collisionSystem.addObject(invisiblePlatform);

  console.log('✅ 第二层通往中心走廊2已创建');
}

/**
 * 创建第二层通往中心走廊3
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCenterCorridor3(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const startX = 79;
  const startZ = 34;
  const endX = 48.586;      // 终点：向电梯方向延长2m
  const endZ = 3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const corridorWidth = 6;

  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, floorY, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);
  scene.add(floor);

  const wallHeight = 10;
  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, floorY + 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, floorY + 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  const invisiblePlatform = new THREE.Mesh(
    new THREE.PlaneGeometry(corridorWidth, corridorLength),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  invisiblePlatform.rotation.x = -Math.PI / 2;
  invisiblePlatform.position.set(midX, floorY + 0.01, midZ);
  invisiblePlatform.rotation.z = Math.atan2(directionX, directionZ);
  invisiblePlatform.name = '第二层走廊3地面';
  scene.add(invisiblePlatform);
  collisionSystem.addObject(invisiblePlatform);

  console.log('✅ 第二层通往中心走廊3已创建');
}

/**
 * 创建第二层通往中心走廊4
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 */
export function createSecondFloorCenterCorridor4(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const startX = 79;
  const startZ = -34;
  const endX = 48.586;      // 终点：向电梯方向延长2m
  const endZ = -3.586;
  const corridorLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const corridorWidth = 6;

  const directionX = (endX - startX) / corridorLength;
  const directionZ = (endZ - startZ) / corridorLength;

  const midX = (startX + endX) / 2;
  const midZ = (startZ + endZ) / 2;

  const floorGeometry = new THREE.PlaneGeometry(corridorWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(midX, floorY, midZ);
  floor.rotation.z = Math.atan2(directionX, directionZ);
  scene.add(floor);

  const wallHeight = 10;
  const perpX = -directionZ * (corridorWidth / 2 + 0.05);
  const perpZ = directionX * (corridorWidth / 2 + 0.05);

  const leftWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(midX + perpX, floorY + 2, midZ + perpZ);
  leftWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  const rightWallGeometry = new THREE.BoxGeometry(0.1, wallHeight, corridorLength);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(midX - perpX, floorY + 2, midZ - perpZ);
  rightWall.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  const invisiblePlatform = new THREE.Mesh(
    new THREE.PlaneGeometry(corridorWidth, corridorLength),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  invisiblePlatform.rotation.x = -Math.PI / 2;
  invisiblePlatform.position.set(midX, floorY + 0.01, midZ);
  invisiblePlatform.rotation.z = Math.atan2(directionX, directionZ);
  invisiblePlatform.name = '第二层走廊4地面';
  scene.add(invisiblePlatform);
  collisionSystem.addObject(invisiblePlatform);

  console.log('✅ 第二层通往中心走廊4已创建');
}
