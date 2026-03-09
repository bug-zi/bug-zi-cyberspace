// ============================================
// 主入口文件：导入所有模块并初始化3D应用
// ============================================

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONFIG } from './config.js';
import { PlayerController } from './player.js';
import { Renderer } from './renderer.js';
import { CollisionSystem } from './collision.js';
import { createRoom1 } from './rooms/FirstFloor/room1.js';
import { createCorridor } from './rooms/FirstFloor/corridor.js';
import { createCorridorToRoom4 } from './rooms/FirstFloor/corridor.js';
import { createCorridorToRoom2 } from './rooms/FirstFloor/corridor.js';
import { createCorridorFromBottomToRoom2 } from './rooms/FirstFloor/corridor.js';
import { createCorridorFromTopRightToRoom2 } from './rooms/FirstFloor/corridor.js';
import { createCorridorFromBottomRightToRoom2 } from './rooms/FirstFloor/corridor.js';
import { createCorridorToRoom3 } from './rooms/FirstFloor/corridor.js';
import { createCorridorToRoom4FromRoom3 } from './rooms/FirstFloor/corridor.js';
import { createElevatorHall } from './rooms/FirstFloor/elevator.js';
import { createSecondFloor } from './rooms/SecondFloor/secondFloor.js';
import { createMusicHall } from './rooms/FirstFloor/room2.js';
import { createRoom3 } from './rooms/FirstFloor/room3.js';
import { createRoom4 } from './rooms/FirstFloor/room4.js';

// 全局变量
let scene, camera, renderer, player, collisionSystem, clock, musicHallInfo, elevatorInfo, controls, room4Info;

// 全息投影输入框UI元素
let holographicInputContainer, holographicInput, holographicInputCallback = null;

// 坐标显示元素
let coordinatesElement;

// 坐下状态管理
let isSittingOnSofa = false;
let sittingPosition = new THREE.Vector3(90, 1.5, 0); // 沙发位置
let sittingTarget = new THREE.Vector3(75, 4, 0); // 投影屏幕位置
let standingPosition = new THREE.Vector3(); // 站立时的位置（用于恢复）

/**
 * 初始化应用
 */
function init() {
  console.log('🚀 开始初始化3D应用...');

  // 1. 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2c2c2c);

  // 2. 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(45, 20, -50); // 初始位置：新位置（45，20，-50）

  // 3. 创建渲染器
  const container = document.getElementById('canvas-container');
  renderer = new Renderer(container);
  renderer.resize(window.innerWidth, window.innerHeight);

  // 4. 添加光源（按照旧文件的强度和位置）
  // 环境光：基础照明（强度0.4）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // 主光源：从天花板向下照射（强度0.8）
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(0, 8, 0);
  scene.add(mainLight);

  // 补光：从侧面照射（暖白色，强度0.3）
  // const sideLight = new THREE.DirectionalLight(0xffeedd, 0.3);
  // sideLight.position.set(-5, 3, 5);
  // scene.add(sideLight);

  // 聚光灯：专门照亮玻璃金字塔（强度2.0）
  const spotLight = new THREE.SpotLight(0xffffff, 2.0);
  spotLight.position.set(0, 7, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.3;
  scene.add(spotLight);

  // 5. 创建时钟（用于计算时间增量）
  clock = new THREE.Clock();

  // 6. 创建碰撞检测系统
  collisionSystem = new CollisionSystem();

  // 7. 创建玩家控制器（传入碰撞检测系统）
  player = new PlayerController(camera, scene, collisionSystem);

  // 8. 添加用户界面事件（指针锁定）
  setupControls();

  // 9. 初始化全息投影输入框
  initHolographicInput();

  // 10. 初始化坐标显示
  initCoordinatesDisplay();

  console.log('✅ 3D应用初始化完成');
}

/**
 * 初始化全息投影输入框
 */
function initHolographicInput() {
  holographicInputContainer = document.getElementById('holographic-input-container');
  holographicInput = document.getElementById('holographic-input');

  if (!holographicInputContainer || !holographicInput) {
    console.error('❌ 全息投影输入框UI元素未找到');
    return;
  }

  // 输入框回车事件
  holographicInput.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
      const value = holographicInput.value.trim();
      if (value && holographicInputCallback) {
        holographicInputCallback(value);
      }
      hideHolographicInput();
    } else if (event.code === 'Escape') {
      hideHolographicInput();
    }
  });

  // 点击容器外部关闭输入框
  holographicInputContainer.addEventListener('click', (event) => {
    if (event.target === holographicInputContainer) {
      hideHolographicInput();
    }
  });

  console.log('✅ 全息投影输入框初始化完成');
}

/**
 * 显示全息投影输入框
 * @param {Function} callback - 输入完成后的回调函数
 */
function showHolographicInput(callback) {
  if (!holographicInputContainer || !holographicInput) {
    console.error('❌ 全息投影输入框未初始化');
    return;
  }

  holographicInputCallback = callback;
  holographicInput.value = '';
  holographicInputContainer.classList.add('show');
  
  // 延迟聚焦，确保鼠标已解锁
  setTimeout(() => {
    holographicInput.focus();
  }, 100);

  console.log('📝 显示全息投影输入框');
}

/**
 * 隐藏全息投影输入框
 */
function hideHolographicInput() {
  if (!holographicInputContainer) return;

  holographicInputContainer.classList.remove('show');
  holographicInputCallback = null;

  // 重新锁定鼠标
  if (controls) {
    controls.lock();
  }

  console.log('📝 隐藏全息投影输入框');
}

/**
 * 初始化坐标显示
 */
function initCoordinatesDisplay() {
  coordinatesElement = document.getElementById('coordinates');
  if (!coordinatesElement) {
    console.error('❌ 坐标显示元素未找到');
    return;
  }
  console.log('✅ 坐标显示初始化完成');
}

/**
 * 更新坐标显示
 */
function updateCoordinatesDisplay() {
  if (!coordinatesElement || !camera) return;

  const position = camera.position;
  const x = position.x.toFixed(2);
  const y = position.y.toFixed(2);
  const z = position.z.toFixed(2);

  coordinatesElement.textContent = `坐标: X: ${x}, Y: ${y}, Z: ${z}`;
}

/**
 * 设置用户界面和控制器
 */
function setupControls() {
  controls = new PointerLockControls(camera, document.body);
  let isLocked = false;

  // 获取UI元素
  const instructions = document.getElementById('instructions');
  const modeIndicator = document.getElementById('mode-indicator');
  const crosshair = document.getElementById('crosshair');

  // 点击页面锁定鼠标
  document.addEventListener('click', (event) => {
    // 如果点击的是UI元素，不锁定鼠标
    // 注意：当输入框容器隐藏时，event.target.closest('#holographic-input-container')会返回null
    // 但这不影响鼠标锁定，因为我们只关心点击UI元素时跳过锁定
    const isClickingUI = event.target.closest('#exhibit-info') || 
                         event.target.closest('#instructions') || 
                         (holographicInputContainer && holographicInputContainer.classList.contains('show') && event.target.closest('#holographic-input-container'));
    
    if (isClickingUI) {
      console.log('🖱️ 点击了UI元素，跳过鼠标锁定');
      return;
    }
    if (!isLocked) {
      controls.lock();
    }
  });

  // 锁定事件
  controls.addEventListener('lock', () => {
    isLocked = true;
    instructions.classList.add('hidden');
    crosshair.classList.add('visible');
    console.log('✅ 鼠标已锁定，开始控制视角');
  });

  // 解锁事件
  controls.addEventListener('unlock', () => {
    isLocked = false;
    instructions.classList.remove('hidden');
    crosshair.classList.remove('visible');
    console.log('❌ 鼠标已释放，停止控制视角');
  });
}

/**
 * 动画循环
 */
function animate() {
  requestAnimationFrame(animate);

  // 计算时间增量
  const delta = clock.getDelta();

  // 更新玩家移动
  player.update(delta);

  // 检测玩家是否在room2内，自动播放/停止canon
  if (musicHallInfo && musicHallInfo.checkPlayerInRoom2) {
    musicHallInfo.checkPlayerInRoom2(camera.position);
  }

  // 更新room2音符动画
  if (musicHallInfo && musicHallInfo.updateNotes) {
    musicHallInfo.updateNotes();
  }

  // 生成room2音符
  if (musicHallInfo && musicHallInfo.spawnNotes) {
    musicHallInfo.spawnNotes(Date.now());
  }

  // 更新room3星星地板交互效果
  if (window.room3ScreenController && window.room3ScreenController.updateStarFloor) {
    const playerX = camera.position.x;
    const playerZ = camera.position.z;
    
    // 检查玩家是否在room3内
    if (window.room3ScreenController.isPlayerInRoom(playerX, playerZ)) {
      window.room3ScreenController.updateStarFloor(playerX, playerZ);
    }
  }

  // 更新坐标显示
  updateCoordinatesDisplay();

  // 渲染场景
  renderer.render(scene, camera);
}

// ============================================
// 点击交互系统（Raycaster射线检测）
// ============================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 获取UI元素
const exhibitInfo = document.getElementById('exhibit-info');
const exhibitTitle = document.getElementById('exhibit-title');
const exhibitDescription = document.getElementById('exhibit-description');
const closeBtn = document.querySelector('.close-btn');

// 鼠标移动事件（悬停检测）
document.addEventListener('mousemove', (event) => {
  // 计算鼠标位置（归一化到-1到+1）
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 从相机发射射线
  raycaster.setFromCamera(mouse, camera);

  // 检测射线与场景中物体的交叉
  const intersects = raycaster.intersectObjects(scene.children, true);

  // 重置鼠标样式
  document.body.style.cursor = 'default';

  if (intersects.length > 0) {
    // 找到第一个被鼠标悬停的物体
    const hoveredObject = intersects[0].object;

    // 向上查找，直到找到有name属性的对象
    let target = hoveredObject;
    while (target && !target.name) {
      target = target.parent;
    }

    // 如果找到了有name属性的对象，显示悬停信息
    if (target && target.name) {
      // 改变鼠标样式为指针
      document.body.style.cursor = 'pointer';
    }
  }
});

// 鼠标点击事件
document.addEventListener('click', (event) => {
  // 如果点击的是UI元素，不处理3D场景的点击
  // 注意：当输入框容器隐藏时，event.target.closest('#holographic-input-container')会返回null
  // 但这不影响3D场景的点击检测，因为我们只关心点击UI元素时跳过3D处理
  const isClickingUI = event.target.closest('#exhibit-info') || 
                       event.target.closest('#instructions') || 
                       (holographicInputContainer && holographicInputContainer.classList.contains('show') && event.target.closest('#holographic-input-container'));
  
  if (isClickingUI) {
    console.log('🖱️ 点击了UI元素，跳过3D场景处理');
    return;
  }

  // 计算鼠标位置（归一化到-1到+1）
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 从相机发射射线
  raycaster.setFromCamera(mouse, camera);

  // 检测射线与场景中物体的交叉
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    // 找到第一个被点击的物体
    const clickedObject = intersects[0].object;
    console.log('🖱️ 点击对象:', clickedObject.name, 'userData:', clickedObject.userData);

    // 向上查找，直到找到有name属性的对象
    let target = clickedObject;
    while (target && !target.name) {
      target = target.parent;
    }

    console.log('🎯 目标对象:', target ? target.name : '未找到', 'userData:', target ? target.userData : null);

    // 如果找到了有信息的展品
    if (target && target.name) {
      // 处理钢琴点击
      if (target.name.includes('钢琴')) {
        console.log('🎹 点击了钢琴');
        if (musicHallInfo && musicHallInfo.playCanon) {
          musicHallInfo.playCanon();
        }
      }

      // 处理专辑点击
      if (target.name.includes('专辑')) {
        console.log('💿 点击了专辑，索引:', target.userData ? target.userData.index : '未定义');
        if (target.userData && target.userData.index !== undefined) {
          console.log('🎵 musicHallInfo:', musicHallInfo, 'playAlbum函数:', musicHallInfo ? musicHallInfo.playAlbum : '未定义');
          if (musicHallInfo && musicHallInfo.playAlbum) {
            musicHallInfo.playAlbum(target.userData.index);
          } else {
            console.error('❌ musicHallInfo或playAlbum函数未定义');
          }
        } else {
          console.error('❌ 专辑userData或index未定义');
        }
      }

      // 处理投影屏幕箭头点击
      if (target.name.includes('左箭头') || target.name.includes('右箭头')) {
        console.log('🖱️ 点击了屏幕箭头:', target.name);
        if (target.userData && target.userData.direction) {
          if (window.room3ScreenController && window.room3ScreenController.switchImage) {
            window.room3ScreenController.switchImage(target.userData.direction);
          } else {
            console.error('❌ room3ScreenController未定义');
          }
        }
      }

      // 处理投影屏幕点击（播放视频）
      if (target.name === '投影屏幕') {
        console.log('🖱️ 点击了投影屏幕');
        if (window.room3ScreenController) {
          // 如果正在播放视频，点击停止
          if (window.room3ScreenController.isPlayingVideo && window.room3ScreenController.isPlayingVideo()) {
            console.log('🛑 停止视频播放');
            window.room3ScreenController.stopVideo();
          } else if (window.room3ScreenController.isSilentVoiceImage && window.room3ScreenController.isSilentVoiceImage()) {
            // 如果当前是声之形图片，播放视频
            console.log('🎬 开始播放声之形预告片');
            window.room3ScreenController.playVideo();
          } else {
            console.log('ℹ️ 当前不是声之形图片，无法播放视频');
          }
        } else {
          console.error('❌ room3ScreenController未定义');
        }
      }

      // 处理电梯点击
      if (target.name.includes('电梯')) {
        console.log('🛗 点击了电梯');
        if (elevatorInfo) {
          const currentFloor = elevatorInfo.currentFloor;
          const targetFloor = target.userData.targetFloor;

          if (currentFloor === 1 && targetFloor === 2) {
            console.log('🚀 从第一层前往第二层');
            camera.position.set(45, 20.6, 0);
            elevatorInfo.currentFloor = 2;
            console.log('✅ 已到达第二层');
          } else if (currentFloor === 2 && targetFloor === 1) {
            console.log('🔽 从第二层返回第一层');
            camera.position.set(45, 1.6, 0);
            elevatorInfo.currentFloor = 1;
            console.log('✅ 已返回第一层');
          }
        }
      }

      // 处理沙发点击（坐下/站起来）
      if (target.name === '沙发' || (target.userData && target.userData.type === 'sofa')) {
        console.log('🛋️ 点击了沙发');
        if (isSittingOnSofa) {
          // 站起来
          console.log('🚶 从沙发上站起来');
          camera.position.copy(standingPosition);
          isSittingOnSofa = false;
          // 恢复玩家控制
          if (player) {
            player.enabled = true;
          }
          // 恢复鼠标控制
          if (controls) {
            controls.enabled = true;
          }
        } else {
          // 保存当前位置
          standingPosition.copy(camera.position);
          // 坐下
          console.log('🪑 坐到沙发上');
          camera.position.copy(sittingPosition);
          // 看向投影屏幕
          camera.lookAt(sittingTarget);
          isSittingOnSofa = true;
          // 禁用玩家移动控制
          if (player) {
            player.enabled = false;
          }
          // 禁用鼠标控制视角
          if (controls) {
            controls.enabled = false;
          }
        }
      }

      // 处理第二层电梯点击
      if (target.name.includes('第二层电梯')) {
        console.log('🛗 点击了第二层电梯');
        if (elevatorInfo) {
          const currentFloor = elevatorInfo.currentFloor;
          const targetFloor = target.userData.targetFloor;

          if (currentFloor === 2 && targetFloor === 1) {
            console.log('🔽 从第二层返回第一层');
            camera.position.set(45, 1.6, 0);
            elevatorInfo.currentFloor = 1;
            console.log('✅ 已返回第一层');
          }
        }
      }

      // 处理全息投影输入框点击
      console.log('🔍 检查输入框点击 - target.name:', target.name, 'target.userData:', target.userData);
      if (target.name === '全息投影输入框' || (target.userData && target.userData.type === 'holographicInput')) {
        console.log('📝 点击了全息投影输入框，准备弹出输入对话框');
        
        // 先解锁鼠标，以便能够输入文字
        if (controls) {
          console.log('🔓 解锁鼠标');
          controls.unlock();
        }
        
        // 使用标准的浏览器prompt对话框
        setTimeout(() => {
          const userInput = prompt('请输入要生成的物体名称（如：猫、狗、鸟、心、星...）');
          console.log('🎨 用户输入:', userInput);
          
          if (userInput && userInput.trim()) {
            if (room4Info && room4Info.createParticleObject) {
              room4Info.createParticleObject(userInput.trim());
            } else {
              console.error('❌ room4Info或createParticleObject函数未定义, room4Info:', room4Info);
            }
          }
          
          // 重新锁定鼠标
          setTimeout(() => {
            if (controls) {
              controls.lock();
            }
          }, 100);
        }, 100);
        
        // 不显示展品信息
        return;
      }

      showExhibitInfo(target.name);
    }
  }
});

// 显示展品信息
function showExhibitInfo(info) {
  const lines = info.split('\n');
  exhibitTitle.textContent = lines[0];
  exhibitDescription.textContent = lines.slice(1).join('\n');
  exhibitInfo.classList.add('show');
}

// 关闭信息面板
closeBtn.addEventListener('click', () => {
  exhibitInfo.classList.remove('show');
});

// 按ESC也可以关闭信息面板
document.addEventListener('keydown', (event) => {
  if (event.code === 'Escape' && exhibitInfo.classList.contains('show')) {
    exhibitInfo.classList.remove('show');
  }

  // 按E键从沙发上站起来
  if (event.code === 'KeyE' && isSittingOnSofa) {
    console.log('🚶 按E键从沙发上站起来');
    camera.position.copy(standingPosition);
    isSittingOnSofa = false;
    // 恢复玩家控制
    if (player) {
      player.enabled = true;
    }
    // 恢复鼠标控制
    if (controls) {
      controls.enabled = true;
    }
  }
});

console.log('✅ 点击交互系统已就绪');

/**
 * 窗口大小改变时自适应
 */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.resize(window.innerWidth, window.innerHeight);
});

/**
 * 启动应用
 */
async function startApp() {
  console.log('🎯 开始启动应用...');

  // 初始化核心系统
  init();

  // ============================================
  // 创建各个房间
  // ============================================

  // 创建展厅1
  const room1Info = createRoom1(scene, collisionSystem);
  // 注意：金字塔是异步加载的，会在加载完成后自动添加到碰撞系统

  // 创建走廊
  createCorridor(scene, collisionSystem); // 走廊不添加碰撞（让玩家自由通过）
  
  // 创建展厅1到展厅2的走廊（从(15,30)到(45,0)）
  createCorridorToRoom2(scene, collisionSystem);
  
  // 创建从(15,-30)到(45,0)的走廊
  createCorridorFromBottomToRoom2(scene, collisionSystem);
  
  // 创建从(75,30)到(45,0)的走廊
  createCorridorFromTopRightToRoom2(scene, collisionSystem);
  
  // 创建从(75,-30)到(45,0)的走廊
  createCorridorFromBottomRightToRoom2(scene, collisionSystem);
  
  // 创建展厅1到展厅4的走廊
  createCorridorToRoom4(scene, collisionSystem);

  // 创建电梯厅（在(45,0)位置）
  elevatorInfo = createElevatorHall(scene, collisionSystem);

  // 创建音乐馆（原展厅2）
  musicHallInfo = createMusicHall(scene, collisionSystem);

  // 创建展厅3
  createRoom3(scene, collisionSystem);

  // 创建展厅4
  room4Info = createRoom4(scene, collisionSystem);

  // 创建走廊2-3
  createCorridorToRoom3(scene, collisionSystem);

  // 创建走廊3-4
  createCorridorToRoom4FromRoom3(scene, collisionSystem);

  // 创建第二层
  const secondFloorInfo = createSecondFloor(scene, collisionSystem);

  console.log('🎉 所有房间创建完成！');
  console.log('📊 场景统计：');
  console.log('   - 展厅1：玻璃金字塔 + 5幅画作');
  console.log('   - 圆弧走廊：36段平面拼接');
  console.log('   - 音乐馆：钢琴 + 4张专辑 + Vicky宣宣照片 + 10个画框');
  console.log('   - 展厅3：30×30米，4面墙（前墙和后墙门洞）');
  console.log('   - 展厅4：30×30米，4面墙（左墙和右墙门洞）');




  // 开始动画循环
  animate();
}

// 启动应用
startApp();
