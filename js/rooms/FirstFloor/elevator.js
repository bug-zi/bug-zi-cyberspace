// ============================================
// 电梯厅：连接第一层和第二层
// ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建电梯厅
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createElevatorHall(scene, collisionSystem) {
  console.log('🛗 开始创建电梯厅...');

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

  const elevatorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.3
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaccff,
    transparent: true,
    opacity: 0.4,
    roughness: 0.05,
    metalness: 0.1
  });

  // ============================================
  // 电梯厅参数
  // ============================================
  const centerX = 45;
  const centerZ = 0;
  const radius = 5;
  const wallHeight = 6;
  const segments = 32;

  // ============================================
  // 创建圆形地板
  // ============================================
  const floorGeometry = new THREE.CircleGeometry(radius, segments);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(centerX, -1, centerZ);
  scene.add(floor);

  console.log('✅ 电梯厅地板已创建');

  // ============================================
  // 创建电梯模型
  // ============================================
  const elevatorGroup = new THREE.Group();

  // 电梯主体
  const elevatorBodyGeometry = new THREE.BoxGeometry(3, 4, 3);
  const elevatorBody = new THREE.Mesh(elevatorBodyGeometry, elevatorMaterial);
  elevatorBody.position.set(0, 2, 0);
  elevatorGroup.add(elevatorBody);

  // 电梯门框（金属边框）
  const doorFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    roughness: 0.3,
    metalness: 0.7
  });

  const doorFrameTop = new THREE.BoxGeometry(2.6, 0.1, 0.1);
  const topFrame = new THREE.Mesh(doorFrameTop, doorFrameMaterial);
  topFrame.position.set(0, 3.8, 1.51);
  elevatorGroup.add(topFrame);

  const doorFrameBottom = new THREE.BoxGeometry(2.6, 0.1, 0.1);
  const bottomFrame = new THREE.Mesh(doorFrameBottom, doorFrameMaterial);
  bottomFrame.position.set(0, 0.2, 1.51);
  elevatorGroup.add(bottomFrame);

  const doorFrameLeft = new THREE.BoxGeometry(0.1, 3.6, 0.1);
  const leftFrame = new THREE.Mesh(doorFrameLeft, doorFrameMaterial);
  leftFrame.position.set(-1.25, 2, 1.51);
  elevatorGroup.add(leftFrame);

  const doorFrameRight = new THREE.BoxGeometry(0.1, 3.6, 0.1);
  const rightFrame = new THREE.Mesh(doorFrameRight, doorFrameMaterial);
  rightFrame.position.set(1.25, 2, 1.51);
  elevatorGroup.add(rightFrame);

  // 电梯门（玻璃）
  const elevatorDoorGeometry = new THREE.PlaneGeometry(2.5, 3.5);
  const elevatorDoor = new THREE.Mesh(elevatorDoorGeometry, glassMaterial);
  elevatorDoor.position.set(0, 2, 1.52);
  elevatorGroup.add(elevatorDoor);

  // 电梯顶部装饰
  const topDecorationGeometry = new THREE.BoxGeometry(3.2, 0.2, 3.2);
  const topDecoration = new THREE.Mesh(topDecorationGeometry, doorFrameMaterial);
  topDecoration.position.set(0, 4.1, 0);
  elevatorGroup.add(topDecoration);

  // 电梯顶部指示灯
  const lightGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.8
  });
  const light = new THREE.Mesh(lightGeometry, lightMaterial);
  light.position.set(0, 4.35, 0);
  elevatorGroup.add(light);

  // 添加点光源（让指示灯发光）
  const pointLight = new THREE.PointLight(0x00ff00, 0.5, 3);
  pointLight.position.set(0, 4.35, 0);
  elevatorGroup.add(pointLight);

  // 电梯位置
  elevatorGroup.position.set(centerX, 0, centerZ);
  elevatorGroup.name = '电梯\n点击前往第二层';
  elevatorGroup.userData = { 
    type: 'elevator',
    floor: 1,
    targetFloor: 2
  };

  scene.add(elevatorGroup);
  collisionSystem.addObject(elevatorGroup);

  console.log('✅ 电梯模型已创建（带装饰细节）');

  // ============================================
  // 创建电梯控制面板
  // ============================================
  const panelGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.1);
  const panel = new THREE.Mesh(panelGeometry, elevatorMaterial);
  panel.position.set(centerX - 1.8, 1.5, centerZ + 1.8);
  panel.name = '电梯控制面板\n1层：当前楼层\n2层：点击前往';
  scene.add(panel);
  collisionSystem.addObject(panel);

  console.log('✅ 电梯控制面板已创建');
  console.log('✅ 电梯厅创建完成！');
  console.log('📊 电梯厅统计：');
  console.log('   - 圆形大厅：半径5米');
  console.log('   - 电梯：3×4×3米');
  console.log('   - 功能：连接第一层和第二层');

  return {
    elevatorGroup: elevatorGroup,
    currentFloor: 1
  };
}

console.log('✅ 电梯厅模块已加载');
