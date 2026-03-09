// ============================================
// 玩家控制器：处理键盘输入、移动、跳跃
// ============================================

import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * 玩家控制器类
 */
export class PlayerController {
  /**
   * 构造函数
   * @param {THREE.Camera} camera - Three.js相机对象
   * @param {THREE.Scene} scene - Three.js场景对象
   * @param {CollisionSystem} collisionSystem - 碰撞检测系统
   */
  constructor(camera, scene, collisionSystem) {
    this.camera = camera;
    this.scene = scene;
    this.collisionSystem = collisionSystem;

    // 玩家状态
    this.velocity = new THREE.Vector3();
    this.onGround = true;
    this.isSprintMode = false; // 冲刺模式（切换开关）
    this.enabled = true; // 控制器启用状态

    // 键盘状态
    this.keyState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };

    // 碰撞边界
    this.bounds = {
      minX: -100,
      maxX: 100,
      minZ: -100,
      maxZ: 100
    };

    // 设置键盘事件监听
    this.setupKeyboardControls();
  }

  /**
   * 设置键盘控制
   */
  setupKeyboardControls() {
    // 键盘按下
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event.code);
    });

    // 键盘抬起
    document.addEventListener('keyup', (event) => {
      this.handleKeyUp(event.code);
    });

    // 冲刺模式切换（Shift键）
    document.addEventListener('keydown', (event) => {
      if (event.code === 'ShiftLeft') {
        this.isSprintMode = !this.isSprintMode;
        this.updateModeIndicator();
        console.log(this.isSprintMode ? '🏃 跑步模式' : '🚶 行走模式');
      }
    });
  }

  /**
   * 处理键盘按下
   */
  handleKeyDown(code) {
    switch (code) {
      case 'KeyW': this.keyState.forward = true; break;
      case 'KeyS': this.keyState.backward = true; break;
      case 'KeyA': this.keyState.left = true; break;
      case 'KeyD': this.keyState.right = true; break;
      case 'Space': this.keyState.jump = true; break;
    }
  }

  /**
   * 处理键盘抬起
   */
  handleKeyUp(code) {
    switch (code) {
      case 'KeyW': this.keyState.forward = false; break;
      case 'KeyS': this.keyState.backward = false; break;
      case 'KeyA': this.keyState.left = false; break;
      case 'KeyD': this.keyState.right = false; break;
      case 'Space': this.keyState.jump = false; break;
    }
  }

  /**
   * 更新模式指示器UI
   */
  updateModeIndicator() {
    const modeIndicator = document.getElementById('mode-indicator');
    const modeIcon = document.getElementById('mode-icon');
    const modeText = document.getElementById('mode-text');

    if (this.isSprintMode) {
      modeIndicator.classList.add('sprint');
      modeIcon.textContent = '🏃';
      modeText.textContent = '跑步模式';
    } else {
      modeIndicator.classList.remove('sprint');
      modeIcon.textContent = '🚶';
      modeText.textContent = '行走模式';
    }
  }

  /**
   * 更新玩家移动
   * @param {number} delta - 时间增量
   */
  update(delta) {
    // 如果控制器被禁用，不处理移动
    if (this.enabled === false) {
      return;
    }

    // 获取相机朝向
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    // 计算侧向
    const sideways = new THREE.Vector3();
    sideways.crossVectors(direction, this.camera.up).normalize();

    // 计算移动速度（根据时间增量调整）
    const currentSpeed = this.isSprintMode
      ? CONFIG.PLAYER.MOVE_SPEED * CONFIG.PLAYER.SPRINT_MULTIPLIER
      : CONFIG.PLAYER.MOVE_SPEED;

    // 计算移动向量
    const moveVector = new THREE.Vector3(0, 0, 0);

    if (this.keyState.forward) {
      moveVector.addScaledVector(direction, currentSpeed);
    }
    if (this.keyState.backward) {
      moveVector.addScaledVector(direction, -currentSpeed);
    }
    if (this.keyState.left) {
      moveVector.addScaledVector(sideways, -currentSpeed);
    }
    if (this.keyState.right) {
      moveVector.addScaledVector(sideways, currentSpeed);
    }

    // 处理跳跃
    if (this.keyState.jump && this.onGround) {
      this.velocity.y = CONFIG.PLAYER.JUMP_FORCE;
      this.onGround = false;
    }

    // 应用重力
    this.velocity.y += CONFIG.PLAYER.GRAVITY;

    // 更新垂直位置
    this.camera.position.y += this.velocity.y;

    // 地面碰撞检测（根据当前高度动态调整）
    const groundLevel = this.camera.position.y > 15 ? 20.6 : CONFIG.PLAYER.HEIGHT;
    if (this.camera.position.y <= groundLevel) {
      this.camera.position.y = groundLevel;
      this.velocity.y = 0;
      this.onGround = true;
    }

    // 天花板碰撞检测（根据当前楼层动态调整）
    const ceilingLevel = this.camera.position.y > 15 ? 30 : 6;
    if (this.camera.position.y >= ceilingLevel) {
      this.camera.position.y = ceilingLevel;
      this.velocity.y = 0;
    }

    // 更新玩家边界框
    this.collisionSystem.updatePlayerBox(this.camera.position);

    // 分轴碰撞检测（允许沿墙滑动）
    const newX = this.camera.position.x + moveVector.x;
    const newZ = this.camera.position.z + moveVector.z;

    // X轴碰撞检测
    const testPosX = new THREE.Vector3(newX, this.camera.position.y, this.camera.position.z);
    if (!this.collisionSystem.checkCollision(testPosX)) {
      this.camera.position.x = newX;
    } else {
      this.camera.position.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.camera.position.x));
    }

    // Z轴碰撞检测
    const testPosZ = new THREE.Vector3(this.camera.position.x, this.camera.position.y, newZ);
    if (!this.collisionSystem.checkCollision(testPosZ)) {
      this.camera.position.z = newZ;
    } else {
      this.camera.position.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, this.camera.position.z));
    }
  }
}

console.log('✅ 玩家控制器已加载');
