// ============================================
// 渲染器管理：初始化和管理WebGL渲染器
// ============================================

import * as THREE from 'three';

/**
 * 渲染器管理类
 */
export class Renderer {
  /**
   * 构造函数
   * @param {HTMLElement} container - 渲染容器元素
   */
  constructor(container) {
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
      alpha: true      // 允许透明背景
    });

    // 启用阴影
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 设置渲染器大小
    this.resize(window.innerWidth, window.innerHeight);

    // 添加到DOM
    container.appendChild(this.renderer.domElement);
  }

  /**
   * 调整渲染器大小
   * @param {number} width - 新宽度
   * @param {number} height - 新高度
   */
  resize(width, height) {
    this.renderer.setSize(width, height);
  }

  /**
   * 渲染场景
   * @param {THREE.Scene} scene - Three.js场景对象
   * @param {THREE.Camera} camera - Three.js相机对象
   */
  render(scene, camera) {
    this.renderer.render(scene, camera);
  }
}

console.log('✅ 渲染器管理已加载');
