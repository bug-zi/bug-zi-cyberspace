// ============================================ 第二层展厅1 ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建第二层展厅1
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {THREE.Material} ceilingMaterial - 天花板材质
 * @param {number} floorY - 第二层地板Y坐标
 * @param {number} wallHeight - 墙壁高度
 * @param {number} roomSize - 房间大小
 */
export function createSecondFloorRoom1(scene, collisionSystem, wallMaterial, floorMaterial, ceilingMaterial, floorY, wallHeight, roomSize) {
  const roomX = 0;
  const roomZ = 0;

  // 地板
  const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(roomX, floorY, roomZ);
  scene.add(floor);

  // 门洞参数
  const doorWidth = 4;
  const doorHeight = 6;
  const wallThickness = 0.5;
  const halfSize = roomSize / 2;

  // 后墙（带门洞）
  const backWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(roomSize, wallHeight - doorHeight, wallThickness),
    wallMaterial
  );
  backWallTop.position.set(roomX, floorY + doorHeight + (wallHeight - doorHeight) / 2, roomZ - halfSize);
  scene.add(backWallTop);
  collisionSystem.addObject(backWallTop);

  const backWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((roomSize - doorWidth) / 2, doorHeight, wallThickness),
    wallMaterial
  );
  backWallLeft.position.set(roomX - (doorWidth / 2 + (roomSize - doorWidth) / 4), floorY + doorHeight / 2, roomZ - halfSize);
  scene.add(backWallLeft);
  collisionSystem.addObject(backWallLeft);

  const backWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((roomSize - doorWidth) / 2, doorHeight, wallThickness),
    wallMaterial
  );
  backWallRight.position.set(roomX + (doorWidth / 2 + (roomSize - doorWidth) / 4), floorY + doorHeight / 2, roomZ - halfSize);
  scene.add(backWallRight);
  collisionSystem.addObject(backWallRight);

  // 前墙（带门洞）
  const frontWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(roomSize, wallHeight - doorHeight, wallThickness),
    wallMaterial
  );
  frontWallTop.position.set(roomX, floorY + doorHeight + (wallHeight - doorHeight) / 2, roomZ + halfSize);
  scene.add(frontWallTop);
  collisionSystem.addObject(frontWallTop);

  const frontWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((roomSize - doorWidth) / 2, doorHeight, wallThickness),
    wallMaterial
  );
  frontWallLeft.position.set(roomX - (doorWidth / 2 + (roomSize - doorWidth) / 4), floorY + doorHeight / 2, roomZ + halfSize);
  scene.add(frontWallLeft);
  collisionSystem.addObject(frontWallLeft);

  const frontWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((roomSize - doorWidth) / 2, doorHeight, wallThickness),
    wallMaterial
  );
  frontWallRight.position.set(roomX + (doorWidth / 2 + (roomSize - doorWidth) / 4), floorY + doorHeight / 2, roomZ + halfSize);
  scene.add(frontWallRight);
  collisionSystem.addObject(frontWallRight);

  // 左墙
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, roomSize),
    wallMaterial
  );
  leftWall.position.set(roomX - halfSize, floorY + wallHeight / 2, roomZ);
  scene.add(leftWall);
  collisionSystem.addObject(leftWall);

  // 右墙
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, roomSize),
    wallMaterial
  );
  rightWall.position.set(roomX + halfSize, floorY + wallHeight / 2, roomZ);
  scene.add(rightWall);
  collisionSystem.addObject(rightWall);

  // 天花板
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(roomSize, roomSize),
    ceilingMaterial
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(roomX, floorY + wallHeight, roomZ);
  scene.add(ceiling);

  // 不可见平台（防止掉落）
  const invisiblePlatform = new THREE.Mesh(
    new THREE.PlaneGeometry(roomSize, roomSize),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  invisiblePlatform.rotation.x = -Math.PI / 2;
  invisiblePlatform.position.set(roomX, floorY + 0.01, roomZ);
  invisiblePlatform.name = '第二层展厅1地面';
  scene.add(invisiblePlatform);
  collisionSystem.addObject(invisiblePlatform);

  console.log('✅ 第二层展厅1已创建（前后墙带门洞）');
}
