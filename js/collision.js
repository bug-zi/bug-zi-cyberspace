// ============================================
// 碰撞检测系统：使用边界框检测玩家是否与物体重叠
// ============================================

import * as THREE from 'three';
import { CONFIG } from './config.js';

/**
 * 碰撞检测系统类
 */
export class CollisionSystem {
  constructor() {
    // 存储所有可碰撞的物体
    this.collidableObjects = [];
    // 玩家尺寸（宽、高、深）
    this.playerSize = new THREE.Vector3(0.6, 1.8, 0.6);
    // 玩家边界框
    this.playerBox = new THREE.Box3();
  }

  /**
   * 添加可碰撞物体到检测列表
   * @param {THREE.Object3D} object - 可碰撞的物体
   */
  addObject(object) {
    this.collidableObjects.push(object);
  }

  /**
   * 更新玩家边界框的位置
   * @param {THREE.Vector3} position - 玩家位置
   */
  updatePlayerBox(position) {
    this.playerBox.setFromCenterAndSize(position, this.playerSize);
  }

  /**
   * 检测玩家是否与任何可碰撞物体重叠
   * @param {THREE.Vector3} newPosition - 玩家尝试移动到的新位置
   * @returns {boolean} - true表示有碰撞，false表示无碰撞
   */
  checkCollision(newPosition) {
    // 暂时禁用碰撞检测，允许穿墙
    return false;
    
    // 创建玩家在新位置的边界框
    const testBox = new THREE.Box3();
    testBox.setFromCenterAndSize(newPosition, this.playerSize);

    // 检测与所有可碰撞物体的交叉
    for (const obj of this.collidableObjects) {
      const objBox = new THREE.Box3().setFromObject(obj);
      if (testBox.intersectsBox(objBox)) {
        return true; // 发生碰撞
      }
    }

    return false; // 无碰撞
  }

  /**
   * 清空所有可碰撞物体
   */
  clear() {
    this.collidableObjects = [];
  }

  /**
   * 获取所有可碰撞物体
   */
  getObjects() {
    return this.collidableObjects;
  }
}

console.log('✅ 碰撞检测系统已加载');
