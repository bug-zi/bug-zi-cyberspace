// ============================================ 第二层展厅4 ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createFloor, createWall, createDoorWall, createPainting } from '../../utils.js';

/**
 * 创建第二层展厅4
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {THREE.Material} ceilingMaterial - 天花板材质
 * @param {number} floorY - 第二层地板Y坐标
 * @param {number} wallHeight - 墙壁高度
 * @param {number} roomSize - 房间大小
 */
export function createSecondFloorRoom4(scene, collisionSystem, wallMaterial, floorMaterial, ceilingMaterial, floorY, wallHeight, roomSize) {
  const roomX = 45;
  const roomZ = -45;

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

  // 后墙（完整墙）
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallHeight, wallThickness), wallMaterial);
  backWall.position.set(roomX, floorY + wallHeight / 2, roomZ - halfSize);
  scene.add(backWall);
  collisionSystem.addObject(backWall);

  // 前墙（完整墙）
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallHeight, wallThickness), wallMaterial);
  frontWall.position.set(roomX, floorY + wallHeight / 2, roomZ + halfSize);
  scene.add(frontWall);
  collisionSystem.addObject(frontWall);

  // 左墙（带门洞）
  const leftWallTop = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight - doorHeight, roomSize), wallMaterial);
  leftWallTop.position.set(roomX - halfSize, floorY + doorHeight + (wallHeight - doorHeight) / 2, roomZ);
  scene.add(leftWallTop);
  collisionSystem.addObject(leftWallTop);

  const leftWallBack = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, doorHeight, (roomSize - doorWidth) / 2), wallMaterial);
  leftWallBack.position.set(roomX - halfSize, floorY + doorHeight / 2, roomZ - (doorWidth / 2 + (roomSize - doorWidth) / 4));
  scene.add(leftWallBack);
  collisionSystem.addObject(leftWallBack);

  const leftWallFront = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, doorHeight, (roomSize - doorWidth) / 2), wallMaterial);
  leftWallFront.position.set(roomX - halfSize, floorY + doorHeight / 2, roomZ + (doorWidth / 2 + (roomSize - doorWidth) / 4));
  scene.add(leftWallFront);
  collisionSystem.addObject(leftWallFront);

  // 右墙（带门洞）
  const rightWallTop = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight - doorHeight, roomSize), wallMaterial);
  rightWallTop.position.set(roomX + halfSize, floorY + doorHeight + (wallHeight - doorHeight) / 2, roomZ);
  scene.add(rightWallTop);
  collisionSystem.addObject(rightWallTop);

  const rightWallBack = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, doorHeight, (roomSize - doorWidth) / 2), wallMaterial);
  rightWallBack.position.set(roomX + halfSize, floorY + doorHeight / 2, roomZ - (doorWidth / 2 + (roomSize - doorWidth) / 4));
  scene.add(rightWallBack);
  collisionSystem.addObject(rightWallBack);

  const rightWallFront = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, doorHeight, (roomSize - doorWidth) / 2), wallMaterial);
  rightWallFront.position.set(roomX + halfSize, floorY + doorHeight / 2, roomZ + (doorWidth / 2 + (roomSize - doorWidth) / 4));
  scene.add(rightWallFront);
  collisionSystem.addObject(rightWallFront);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(roomX, floorY + wallHeight, roomZ);
  scene.add(ceiling);

  // ============================================ 乐高凸起 ============================================
  
  // 创建乐高凸起材质
  const legoStudMaterial = new THREE.MeshStandardMaterial({
    color: 0x9E9E9E,
    roughness: 0.3,
    metalness: 0.0
  });

  // 添加地板乐高凸起
  function addLegoStudsOnFloor() {
    const studSize = 0.5; // 凸起大小
    const studHeight = 0.2; // 凸起高度
    const spacing = 2; // 凸起间距
    const startX = roomX - roomSize / 2 + spacing;
    const startZ = roomZ - roomSize / 2 + spacing;
    
    for (let x = startX; x < roomX + roomSize / 2; x += spacing) {
      for (let z = startZ; z < roomZ + roomSize / 2; z += spacing) {
        // 凸起底座
        const studGeometry = new THREE.CylinderGeometry(studSize, studSize, studHeight, 32);
        const stud = new THREE.Mesh(studGeometry, legoStudMaterial);
        stud.position.set(x, floorY + studHeight / 2, z);
        scene.add(stud);
        
        // 凸起顶部
        const topGeometry = new THREE.CylinderGeometry(studSize * 0.8, studSize * 0.8, studHeight * 0.3, 32);
        const top = new THREE.Mesh(topGeometry, legoStudMaterial);
        top.position.set(x, floorY + studHeight + studHeight * 0.15, z);
        scene.add(top);
      }
    }
  }

  // 添加天花板乐高凸起
  function addLegoStudsOnCeiling() {
    const studSize = 0.5; // 凸起大小
    const studHeight = 0.2; // 凸起高度
    const spacing = 2; // 凸起间距
    const startX = roomX - roomSize / 2 + spacing;
    const startZ = roomZ - roomSize / 2 + spacing;
    
    for (let x = startX; x < roomX + roomSize / 2; x += spacing) {
      for (let z = startZ; z < roomZ + roomSize / 2; z += spacing) {
        // 凸起底座
        const studGeometry = new THREE.CylinderGeometry(studSize, studSize, studHeight, 32);
        const stud = new THREE.Mesh(studGeometry, legoStudMaterial);
        stud.position.set(x, floorY + wallHeight - studHeight / 2, z);
        scene.add(stud);
        
        // 凸起顶部
        const topGeometry = new THREE.CylinderGeometry(studSize * 0.8, studSize * 0.8, studHeight * 0.3, 32);
        const top = new THREE.Mesh(topGeometry, legoStudMaterial);
        top.position.set(x, floorY + wallHeight - studHeight - studHeight * 0.15, z);
        scene.add(top);
      }
    }
  }

  // 生成乐高凸起（只保留天花板）
  // addLegoStudsOnFloor(); // 移除地板凸起
  addLegoStudsOnCeiling();

  // ============================================ 乐高模型已移除 ============================================
  
  // 所有乐高模型已从第二层展厅4中移除

  const invisiblePlatform = new THREE.Mesh(
    new THREE.PlaneGeometry(roomSize, roomSize),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  invisiblePlatform.rotation.x = -Math.PI / 2;
  invisiblePlatform.position.set(roomX, floorY + 0.01, roomZ);
  invisiblePlatform.name = '第二层展厅4地面';
  scene.add(invisiblePlatform);
  collisionSystem.addObject(invisiblePlatform);

  console.log('✅ 第二层展厅4已创建（左右墙带门洞）');
}
