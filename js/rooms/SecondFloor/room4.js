// ============================================ 第二层展厅4 ============================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONFIG } from '../../config.js';
import { createMarbleFloorTexture, createLuxuryWallTexture } from '../../utils.js';

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

  // ============================================ 加载乐高模型 ============================================
  
  // 加载乐高MC模型
  function loadLegoMCModel() {
    console.log('🧱 开始加载乐高MC模型...');
    
    const loader = new GLTFLoader();
    loader.load(
      '/glb/乐高-MC.glb',
      (gltf) => {
        const legoMC = gltf.scene;
        
        // 设置模型位置
        legoMC.position.set(roomX - 4, floorY, roomZ + 11);
        legoMC.rotation.y = Math.PI / 2;
        // 缩小2倍
        legoMC.scale.set(0.3, 0.3, 0.3);
        
        // 为模型添加名称和交互数据
        legoMC.name = '乐高MC模型\n测试模型\n放置在第二层乐高小屋';
        legoMC.userData = { type: 'legoMC', interactable: true };
        
        // 遍历模型中的所有mesh，添加到碰撞检测
        legoMC.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.name = '乐高MC模型';
            child.userData = { type: 'legoMC', interactable: true };
            collisionSystem.addObject(child);
          }
        });
        
        // 将模型添加到场景
        scene.add(legoMC);
        console.log('✅ 乐高MC模型加载完成');
        
        // 添加专门的照明
        const mcLight = new THREE.PointLight(0xffffff, 1.5, 15);
        mcLight.position.set(roomX + 5, floorY + 8, roomZ + 5);
        scene.add(mcLight);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(2);
        console.log('🧱 乐高MC模型加载进度:', percent + '%');
      },
      (error) => {
        console.error('❌ 乐高MC模型加载失败:', error);
      }
    );
  }

  // 加载乐高-迪士尼城堡模型
  function loadLegoDisneyCastle() {
    console.log('🧱 开始加载乐高-迪士尼城堡模型...');
    
    const loader = new GLTFLoader();
    loader.load(
      '/glb/乐高-迪士尼城堡.glb',
      (gltf) => {
        const legoCastle = gltf.scene;
        
        // 设置模型位置（调整以适应放大后的大小）
        legoCastle.position.set(roomX - 8, floorY, roomZ + 7 );
                legoCastle.rotation.y = -Math.PI / 4; // 旋转45度朝向房间中心
        // 放大4倍
        legoCastle.scale.set(0.4, 0.4, 0.4);
        
        // 为模型添加名称和交互数据
        legoCastle.name = '乐高-迪士尼城堡\n精致的乐高迪士尼城堡模型\n童话般的城堡设计';
        legoCastle.userData = { type: 'legoCastle', interactable: true };
        
        // 遍历模型中的所有mesh，添加到碰撞检测
        legoCastle.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.name = '乐高-迪士尼城堡';
            child.userData = { type: 'legoCastle', interactable: true };
            collisionSystem.addObject(child);
          }
        });
        
        // 将模型添加到场景
        scene.add(legoCastle);
        console.log('✅ 乐高-迪士尼城堡模型加载完成');
        
        // 添加专门的照明
        const castleLight = new THREE.PointLight(0xffffff, 1.5, 20);
        castleLight.position.set(roomX - 8, floorY + 15, roomZ -6);
        scene.add(castleLight);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(2);
        console.log('🧱 乐高-迪士尼城堡模型加载进度:', percent + '%');
      },
      (error) => {
        console.error('❌ 乐高-迪士尼城堡模型加载失败:', error);
      }
    );
  }

  // 加载乐高-厨房模型
  function loadLegoKitchen() {
    console.log('🧱 开始加载乐高-厨房模型...');
    
    const loader = new GLTFLoader();
    loader.load(
      '/glb/乐高-厨房.glb',
      (gltf) => {
        const legoKitchen = gltf.scene;
        
        // 设置模型位置（放在小商店旁边）
        legoKitchen.position.set(roomX - 11, floorY, roomZ - 11); // 小商店右侧
        legoKitchen.rotation.y = -Math.PI / 2; // 旋转90度朝向房间中心
        
        // 适当缩放
        legoKitchen.scale.set(1.2, 1.2, 1.2);
        
        // 为模型添加名称和交互数据
        legoKitchen.name = '乐高-厨房\n精致的乐高厨房模型\n包含各种厨房用具和设施';
        legoKitchen.userData = { type: 'legoKitchen', interactable: true };
        
        // 遍历模型中的所有mesh，添加到碰撞检测
        legoKitchen.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.name = '乐高-厨房';
            child.userData = { type: 'legoKitchen', interactable: true };
            collisionSystem.addObject(child);
          }
        });
        
        // 将模型添加到场景
        scene.add(legoKitchen);
        console.log('✅ 乐高-厨房模型加载完成');
        
        // 添加专门的照明
        const kitchenLight = new THREE.PointLight(0xffffff, 50, 15);
        kitchenLight.position.set(roomX - 8, floorY + 6, roomZ - 3);
        scene.add(kitchenLight);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(2);
        console.log('🧱 乐高-厨房模型加载进度:', percent + '%');
      },
      (error) => {
        console.error('❌ 乐高-厨房模型加载失败:', error);
      }
    );
  }

  // 加载乐高-泰坦尼克号模型
  function loadLegoTitanic() {
    console.log('🧱 开始加载乐高-泰坦尼克号模型...');
    
    const loader = new GLTFLoader();
    loader.load(
      '/glb/乐高-泰坦尼克号.glb',
      (gltf) => {
        const legoTitanic = gltf.scene;
        
        // 设置模型位置（放在MC模型侧边）
        legoTitanic.position.set(roomX + 11, floorY+1, roomZ + 10); // MC模型右侧
        legoTitanic.rotation.y = -Math.PI / 4;
        // 适当缩放
        legoTitanic.scale.set(1, 1, 1);
        
        // 为模型添加名称和交互数据
        legoTitanic.name = '乐高-泰坦尼克号\n精致的乐高泰坦尼克号模型\n重现经典邮轮的风采';
        legoTitanic.userData = { type: 'legoTitanic', interactable: true };
        
        // 遍历模型中的所有mesh，添加到碰撞检测
        legoTitanic.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.name = '乐高-泰坦尼克号';
            child.userData = { type: 'legoTitanic', interactable: true };
            collisionSystem.addObject(child);
          }
        });
        
        // 将模型添加到场景
        scene.add(legoTitanic);
        console.log('✅ 乐高-泰坦尼克号模型加载完成');
        
        // 添加专门的照明
        const titanicLight = new THREE.PointLight(0xffffff, 2, 20);
        titanicLight.position.set(roomX + 10, floorY + 6, roomZ + 5);
        scene.add(titanicLight);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(2);
        console.log('🧱 乐高-泰坦尼克号模型加载进度:', percent + '%');
      },
      (error) => {
        console.error('❌ 乐高-泰坦尼克号模型加载失败:', error);
      }
    );
  }

  // 加载乐高模型
  loadLegoKitchen(); // 添加厨房模型
  loadLegoMCModel();
  loadLegoTitanic(); // 添加泰坦尼克号模型
  loadLegoDisneyCastle();

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
