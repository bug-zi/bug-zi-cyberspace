// ============================================ 第二层电梯厅 ============================================

import * as THREE from 'three';
import { CONFIG } from '../../config.js';
import { createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

/**
 * 创建第二层电梯厅
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 * @param {THREE.Material} wallMaterial - 墙壁材质
 * @param {THREE.Material} floorMaterial - 地板材质
 * @param {number} floorY - 第二层地板Y坐标
 * @returns {object} 电梯信息
 */
export function createSecondFloorElevatorHall(scene, collisionSystem, wallMaterial, floorMaterial, floorY) {
  const centerX = 45;
  const centerZ = 0;
  const radius = 5;
  const wallHeight = 10;
  const segments = 32;

  const floorGeometry = new THREE.CircleGeometry(radius, segments);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(centerX, floorY, centerZ);
  scene.add(floor);

  const invisiblePlatform = new THREE.Mesh(
    new THREE.CircleGeometry(radius, segments),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  invisiblePlatform.rotation.x = -Math.PI / 2;
  invisiblePlatform.position.set(centerX, floorY + 0.01, centerZ);
  invisiblePlatform.name = '第二层电梯厅地面';
  scene.add(invisiblePlatform);
  collisionSystem.addObject(invisiblePlatform);

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

  const elevatorGroup = new THREE.Group();

  const elevatorBodyGeometry = new THREE.BoxGeometry(3, 4, 3);
  const elevatorBody = new THREE.Mesh(elevatorBodyGeometry, elevatorMaterial);
  elevatorBody.position.set(0, 2, 0);
  elevatorGroup.add(elevatorBody);

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
  leftFrame.position.set(-1.2, 2, 1.51);
  elevatorGroup.add(leftFrame);

  const doorFrameRight = new THREE.BoxGeometry(0.1, 3.6, 0.1);
  const rightFrame = new THREE.Mesh(doorFrameRight, doorFrameMaterial);
  rightFrame.position.set(1.2, 2, 1.51);
  elevatorGroup.add(rightFrame);

  const elevatorDoor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.05), elevatorMaterial);
  elevatorDoor.position.set(0, 2, 1.52);
  elevatorGroup.add(elevatorDoor);

  const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.8), doorFrameMaterial);
  controlPanel.position.set(1.3, 2, 0.5);
  elevatorGroup.add(controlPanel);

  const buttonGeometry = new THREE.CircleGeometry(0.1, 16);
  const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  
  const button1 = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button1.position.set(1.35, 2.2, 0.5);
  elevatorGroup.add(button1);

  const button2 = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button2.position.set(1.35, 1.8, 0.5);
  elevatorGroup.add(button2);

  elevatorGroup.position.set(centerX, floorY, centerZ);
  elevatorGroup.name = '第二层电梯\n点击返回第一层';
  elevatorGroup.userData = { 
    type: 'elevator',
    floor: 2,
    targetFloor: 1
  };
  scene.add(elevatorGroup);

  console.log('✅ 第二层电梯厅已创建');
  return {
    elevatorGroup: elevatorGroup
  };
}
