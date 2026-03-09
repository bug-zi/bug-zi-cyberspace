// ============================================ 第二层主文件 ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createMarbleFloorTexture, createLuxuryWallTexture, createLegoTexture, createLegoFloorTexture, createLegoCeilingTexture } from '../../utils.js';
import { createSecondFloorRoom1 } from './room1.js';
import { createSecondFloorRoom2 } from './room2.js';
import { createSecondFloorRoom3 } from './room3.js';
import { createSecondFloorRoom4 } from './room4.js';
import { 
  createSecondFloorCorridor1, 
  createSecondFloorCorridor2, 
  createSecondFloorCorridor3, 
  createSecondFloorCorridor4,
  createSecondFloorCenterCorridor1,
  createSecondFloorCenterCorridor2,
  createSecondFloorCenterCorridor3,
  createSecondFloorCenterCorridor4
} from './corridor.js';
import { createSecondFloorElevatorHall } from './elevator.js';

/**
 * 创建第二层
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createSecondFloor(scene, collisionSystem) {
  console.log('🏢 开始创建第二层（与第一层布局相同）...');

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

  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  // 乐高风格材质（用于room2和room4）
  const legoTexture = createLegoTexture();
  legoTexture.wrapS = THREE.RepeatWrapping;
  legoTexture.wrapT = THREE.RepeatWrapping;
  legoTexture.repeat.set(2, 2);

  const legoMaterial = new THREE.MeshStandardMaterial({
    map: legoTexture,
    roughness: 0.3,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  // 乐高风格地板材质
  const legoFloorTexture = createLegoFloorTexture();
  legoFloorTexture.wrapS = THREE.RepeatWrapping;
  legoFloorTexture.wrapT = THREE.RepeatWrapping;
  legoFloorTexture.repeat.set(2, 2);

  const legoFloorMaterial = new THREE.MeshStandardMaterial({
    map: legoFloorTexture,
    roughness: 0.3,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  // 乐高风格天花板材质
  const legoCeilingTexture = createLegoCeilingTexture();
  legoCeilingTexture.wrapS = THREE.RepeatWrapping;
  legoCeilingTexture.wrapT = THREE.RepeatWrapping;
  legoCeilingTexture.repeat.set(2, 2);

  const legoCeilingMaterial = new THREE.MeshStandardMaterial({
    map: legoCeilingTexture,
    roughness: 0.3,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  // ============================================ 第二层参数 ============================================
  const floor2Y = 19; // 第二层地板Y坐标
  const wallHeight = 10;
  const roomSize = 30;

  // ============================================ 创建第二层四个房间 ============================================

  // 展厅1（第二层）- 对应第一层展厅1位置 (45, 0)
  createSecondFloorRoom1(scene, collisionSystem, wallMaterial, floorMaterial, ceilingMaterial, floor2Y, wallHeight, roomSize);

  // 展厅2（第二层）- 对应第一层音乐馆位置 (45, 30)
  createSecondFloorRoom2(scene, collisionSystem, wallMaterial, floorMaterial, ceilingMaterial, floor2Y, wallHeight, roomSize);

  // 展厅3（第二层）- 对应第一层展厅3位置 (45, -30)
  createSecondFloorRoom3(scene, collisionSystem, wallMaterial, floorMaterial, ceilingMaterial, floor2Y, wallHeight, roomSize);

  // 展厅4（第二层）- 乐高小屋
  createSecondFloorRoom4(scene, collisionSystem, legoMaterial, legoFloorMaterial, legoCeilingMaterial, floor2Y, wallHeight, roomSize);

  // ============================================ 创建第二层四个圆弧走廊 ============================================

  // 走廊1：连接展厅1和展厅2
  createSecondFloorCorridor1(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // 走廊2：连接展厅1和展厅4
  createSecondFloorCorridor2(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // 走廊3：连接展厅2和展厅3
  createSecondFloorCorridor3(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // 走廊4：连接展厅3和展厅4
  createSecondFloorCorridor4(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // ============================================ 创建第二层四条通往中心的走廊 ============================================

  // 走廊1：(11, 34) -> (40, 5)
  createSecondFloorCenterCorridor1(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // 走廊2：(11, -34) -> (40, -5)
  createSecondFloorCenterCorridor2(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // 走廊3：(79, 34) -> (50, 5)
  createSecondFloorCenterCorridor3(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // 走廊4：(79, -34) -> (50, -5)
  createSecondFloorCenterCorridor4(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // ============================================ 创建第二层电梯厅 ============================================
  const secondFloorElevatorInfo = createSecondFloorElevatorHall(scene, collisionSystem, wallMaterial, floorMaterial, floor2Y);

  // ============================================ 创建第二层照明 ============================================
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 50);
  pointLight.position.set(45, floor2Y + 2, 0);
  scene.add(pointLight);

  console.log('✅ 第二层照明已创建');
  console.log('✅ 第二层创建完成（与第一层布局相同）！');
  console.log('📊 第二层统计：');
  console.log('   - 展厅1：位于(0, 0)');
  console.log('   - 展厅2：位于(45, 45)');
  console.log('   - 展厅3：位于(90, 0)');
  console.log('   - 展厅4：位于(45, -45)');
  console.log('   - 四个圆弧走廊连接各展厅');
  console.log('   - 电梯位于(45, 0)');

  return {
    floor2Y: floor2Y,
    wallHeight: wallHeight,
    elevatorGroup: secondFloorElevatorInfo.elevatorGroup
  };
}
