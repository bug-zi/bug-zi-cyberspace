// ============================================
// 音乐馆：第二个展厅（30×30米，带左右墙门洞）
// ============================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONFIG } from '../../config.js';
import { createFloor, createWall, createDoorWall, createPainting } from '../../utils.js';

/**
 * 创建音乐馆（展厅2）
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {CollisionSystem} collisionSystem - 碰撞检测系统
 */
export function createMusicHall(scene, collisionSystem) {
  console.log('🎵 开始创建音乐馆...');

  // 创建大理石地板纹理
  function createMarbleFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 基础米白色
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加大理石纹理效果
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 30 + 10;
      const alpha = Math.random() * 0.05;
      ctx.fillStyle = `rgba(200, 180, 160, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制菱形图案
    const diamondSize = 128;
    const diamondCols = canvas.width / diamondSize;
    const diamondRows = canvas.height / diamondSize;

    for (let row = 0; row < diamondRows; row++) {
      for (let col = 0; col < diamondCols; col++) {
        const cx = col * diamondSize + diamondSize / 2;
        const cy = row * diamondSize + diamondSize / 2;

        // 菱形
        ctx.beginPath();
        ctx.moveTo(cx, cy - diamondSize / 2);
        ctx.lineTo(cx + diamondSize / 2, cy);
        ctx.lineTo(cx, cy + diamondSize / 2);
        ctx.lineTo(cx - diamondSize / 2, cy);
        ctx.closePath();

        // 交替颜色
        if ((row + col) % 2 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        } else {
          ctx.fillStyle = 'rgba(230, 220, 210, 0.1)';
        }
        ctx.fill();

        // 金色边框
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 添加金色线条装饰
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 内边框
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    return new THREE.CanvasTexture(canvas);
  }

  // 创建精致墙壁纹理
  function createLuxuryWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 柔和的渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#faf9f6');
    gradient.addColorStop(0.5, '#f5f2eb');
    gradient.addColorStop(1, '#f0ece0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加细腻的纹理
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 15 + 3;
      const alpha = Math.random() * 0.02;
      ctx.fillStyle = `rgba(170, 150, 130, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 简洁的边框
    const margin = 20;

    // 外层细边框
    ctx.strokeStyle = 'rgba(180, 160, 140, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);

    // 内层金色边框
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 6, margin + 6, canvas.width - (margin + 6) * 2, canvas.height - (margin + 6) * 2);

    // 精致的角落装饰
    const cornerSize = 35;
    const cornerOffset = margin;

    // 绘制四个角落的装饰
    function drawCorner(x, y, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // 金色装饰
      ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.fillRect(0, 0, cornerSize, 2);
      ctx.fillRect(0, 0, 2, cornerSize);

      ctx.restore();
    }

    // 四个角落
    drawCorner(cornerOffset, cornerOffset, 0);
    drawCorner(canvas.width - cornerOffset, cornerOffset, Math.PI / 2);
    drawCorner(canvas.width - cornerOffset, canvas.height - cornerOffset, Math.PI);
    drawCorner(cornerOffset, canvas.height - cornerOffset, -Math.PI / 2);

    return new THREE.CanvasTexture(canvas);
  }

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

  const goldFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.3,
    metalness: 0.8
  });

  // ============================================
  // 音乐馆的参数
  // ============================================
  const room2X = 45;        // 音乐馆中心X坐标
  const room2Z = 45;        // 音乐馆中心Z坐标
  const room2Width = CONFIG.ROOM.WIDTH;   // 30米
  const room2Depth = CONFIG.ROOM.DEPTH;   // 30米

  // ============================================
  // 创建地板
  // ============================================
  const floor2 = createFloor(room2Width, room2Depth, floorMaterial);
  floor2.position.set(room2X, -1, room2Z);
  scene.add(floor2);

  // ============================================
  // 创建四面墙（后墙、前墙、右墙带门洞、左墙带门洞）
  // ============================================

  // 后墙（Z轴负方向）
  const backWall = createWall(
    room2Width,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  backWall.position.set(room2X, (CONFIG.ROOM.HEIGHT - 2) / 2, room2Z - room2Depth / 2);
  scene.add(backWall);
  collisionSystem.addObject(backWall);

  // 前墙（Z轴正方向）
  const frontWall = createWall(
    room2Width,
    CONFIG.ROOM.HEIGHT,
    CONFIG.ROOM.WALL_DEPTH,
    wallMaterial
  );
  frontWall.position.set(room2X, (CONFIG.ROOM.HEIGHT - 2) / 2, room2Z + room2Depth / 2);
  scene.add(frontWall);
  collisionSystem.addObject(frontWall);

  // ============================================
  // 创建天花板
  // ============================================
  const ceilingTexture = createLuxuryWallTexture();
  ceilingTexture.wrapS = THREE.RepeatWrapping;
  ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(2, 2);

  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    roughness: 0.5,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const ceilingGeometry = new THREE.PlaneGeometry(room2Width, room2Depth);
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(room2X, CONFIG.ROOM.HEIGHT - 1, room2Z);
  scene.add(ceiling);

  // 门洞和墙壁的通用参数
  const doorWidth = CONFIG.DOOR.WIDTH;
  const doorHeight = CONFIG.DOOR.HEIGHT;
  const wallHeight = CONFIG.ROOM.HEIGHT;
  const wallDepth = CONFIG.ROOM.WALL_DEPTH;

  // 左墙（带门洞）
  const leftWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(room2Depth, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  leftWallTop.position.set(room2X - room2Width / 2, 5 + (wallHeight - doorHeight) / 2, room2Z);
  leftWallTop.rotation.y = Math.PI / 2;
  scene.add(leftWallTop);
  collisionSystem.addObject(leftWallTop);

  const leftWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((room2Depth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  leftWallLeft.position.set(room2X - room2Width / 2, -1 + doorHeight / 2, room2Z - (doorWidth / 2 + (room2Depth - doorWidth) / 4));
  leftWallLeft.rotation.y = Math.PI / 2;
  scene.add(leftWallLeft);
  collisionSystem.addObject(leftWallLeft);

  const leftWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((room2Depth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  leftWallRight.position.set(room2X - room2Width / 2, -1 + doorHeight / 2, room2Z + (doorWidth / 2 + (room2Depth - doorWidth) / 4));
  leftWallRight.rotation.y = Math.PI / 2;
  scene.add(leftWallRight);
  collisionSystem.addObject(leftWallRight);

  // 右墙（带门洞）
  const rightWallTop = new THREE.Mesh(
    new THREE.BoxGeometry(room2Depth, wallHeight - doorHeight, wallDepth),
    wallMaterial
  );
  rightWallTop.position.set(room2X + room2Width / 2, 5 + (wallHeight - doorHeight) / 2, room2Z);
  rightWallTop.rotation.y = Math.PI / 2;
  scene.add(rightWallTop);
  collisionSystem.addObject(rightWallTop);

  const rightWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry((room2Depth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  rightWallLeft.position.set(room2X + room2Width / 2, -1 + doorHeight / 2, room2Z - (doorWidth / 2 + (room2Depth - doorWidth) / 4));
  rightWallLeft.rotation.y = Math.PI / 2;
  scene.add(rightWallLeft);
  collisionSystem.addObject(rightWallLeft);

  const rightWallRight = new THREE.Mesh(
    new THREE.BoxGeometry((room2Depth - doorWidth) / 2, doorHeight, wallDepth),
    wallMaterial
  );
  rightWallRight.position.set(room2X + room2Width / 2, -1 + doorHeight / 2, room2Z + (doorWidth / 2 + (room2Depth - doorWidth) / 4));
  rightWallRight.rotation.y = Math.PI / 2;
  scene.add(rightWallRight);
  collisionSystem.addObject(rightWallRight);

  console.log('✅ 音乐馆左墙和右墙已开凿门洞');

  // ============================================
  // 中央钢琴
  // ============================================
  let piano = null;
  let canonAudio = null;
  let isCanonPlaying = false;
  let isSittingAtPiano = false;
  let standingPosition = new THREE.Vector3();
  let standingRotation = new THREE.Euler();

  // 钢琴座椅位置（钢琴右侧，顺时针旋转90°）
  const pianoSeatPosition = new THREE.Vector3(43.26, 1.6, 44.95);
  const pianoSeatTarget = new THREE.Vector3(43.26, 1.2, 44.95); // 看向钢琴琴键

  const loader = new GLTFLoader();
  loader.load(
    '../../public/glb/三角钢琴.glb',
    (gltf) => {
      console.log('✅ 钢琴模型加载成功！', gltf);
      piano = gltf.scene;
      piano.position.set(room2X, 1, room2Z);
      piano.scale.set(7, 7, 7);
      piano.rotation.y = Math.PI;

      // 为钢琴模型的所有子对象设置name属性
      piano.traverse((child) => {
        if (child.isMesh) {
          child.name = '钢琴';
        }
      });

      scene.add(piano);
      collisionSystem.addObject(piano);
      piano.name = '钢琴';
      console.log('🎹 钢琴已添加到场景');
    },
    (progress) => {
      const percent = (progress.loaded / progress.total * 100).toFixed(2) + '%';
      console.log('钢琴加载进度:', percent);
    },
    (error) => {
      console.error('❌ 钢琴模型加载失败:', error);
    }
  );

  // 钢琴音符音频映射 (A-L 对应 C4-E5)
  const pianoNotes = {
    'a': { note: 'C4', freq: 261.63 },
    's': { note: 'D4', freq: 293.66 },
    'd': { note: 'E4', freq: 329.63 },
    'f': { note: 'F4', freq: 349.23 },
    'g': { note: 'G4', freq: 392.00 },
    'h': { note: 'A4', freq: 440.00 },
    'j': { note: 'B4', freq: 493.88 },
    'k': { note: 'C5', freq: 523.25 },
    'l': { note: 'D5', freq: 587.33 },
    ';': { note: 'E5', freq: 659.25 }
  };

  // 播放钢琴音符
  function playPianoNote(key) {
    const noteData = pianoNotes[key.toLowerCase()];
    if (!noteData) return;

    // 创建音频上下文播放音符
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = noteData.freq;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    console.log(`🎹 弹奏音符: ${noteData.note} (${key})`);

    // 创建音符视觉效果
    createPianoNoteEffect(noteData.note);
  }

  // 创建钢琴音符视觉效果
  function createPianoNoteEffect(noteName) {
    const noteGroup = new THREE.Group();

    // 音符主体（黑色椭圆）
    const noteGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const noteMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.8,
      metalness: 0.1
    });
    const note = new THREE.Mesh(noteGeometry, noteMaterial);
    note.scale.set(1, 0.6, 0.3);
    noteGroup.add(note);

    // 音符杆
    const stemGeometry = new THREE.BoxGeometry(0.05, 0.8, 0.05);
    const stem = new THREE.Mesh(stemGeometry, noteMaterial);
    stem.position.set(0, 0.4, 0);
    noteGroup.add(stem);

    // 随机位置（钢琴上方）
    noteGroup.position.set(
      room2X + (Math.random() - 0.5) * 4,
      2 + Math.random() * 2,
      room2Z + 4 + Math.random() * 2
    );

    // 存储音符数据（2秒后消失，decay = 1.0 / (2s * 60fps) ≈ 0.0083）
    noteGroup.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        0.02 + Math.random() * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      life: 1.0,
      decay: 0.0083
    };

    scene.add(noteGroup);
    pianoNotesArray.push(noteGroup);
  }

  // 更新钢琴音符动画
  const pianoNotesArray = [];
  function updatePianoNotes() {
    for (let i = pianoNotesArray.length - 1; i >= 0; i--) {
      const note = pianoNotesArray[i];
      note.position.add(note.userData.velocity);
      note.userData.life -= note.userData.decay;
      note.scale.setScalar(note.userData.life);

      if (note.userData.life <= 0) {
        scene.remove(note);
        pianoNotesArray.splice(i, 1);
      }
    }
  }

  // 合并更新所有音符（卡农音符 + 钢琴弹奏音符）
  function updateAllNotes() {
    updateNotes();      // 更新卡农自动播放的音符
    updatePianoNotes(); // 更新钢琴弹奏的音符
  }

  function playCanon() {
    if (!isCanonPlaying) {
      isCanonPlaying = true;
      console.log('🎵 开始播放卡农...');
      try {
        if (!canonAudio) {
          canonAudio = new Audio('../../public/voice/canon.mp3');
          canonAudio.loop = true;
          canonAudio.volume = 0.5;
        }
        canonAudio.play().catch(err => {
          console.log('音频播放失败:', err);
          isCanonPlaying = false;
        });
      } catch (err) {
        console.log('音频加载失败:', err);
        isCanonPlaying = false;
      }
    } else {
      console.log('🛑 暂停播放卡农');
      isCanonPlaying = false;
      if (canonAudio) {
        canonAudio.pause();
      }
    }
  }

  function stopCanon() {
    isCanonPlaying = false;
    if (canonAudio) {
      console.log('🎵 停止播放卡农');
      canonAudio.pause();
      canonAudio.currentTime = 0;
    }
  }

  // 坐下弹奏钢琴
  let wasPlayingMusicBeforeSitting = false;
  let playingAlbumIndex = -1;
  let pianoCamera = null;
  let pianoControls = null;
  let pianoPlayer = null;

  function sitAtPiano(camera, controls, player) {
    if (isSittingAtPiano) return;

    console.log('🎹 坐到钢琴前');
    isSittingAtPiano = true;

    // 保存相机、控制和玩家引用
    pianoCamera = camera;
    pianoControls = controls;
    pianoPlayer = player;

    // 保存当前位置和旋转
    standingPosition.copy(camera.position);
    standingRotation.copy(camera.rotation);

    // 移动相机到座椅位置
    camera.position.copy(pianoSeatPosition);
    camera.lookAt(pianoSeatTarget);

    // 禁用玩家控制
    if (player) player.enabled = false;
    if (controls) controls.enabled = false;

    // 记录坐下前是否在播放音乐
    wasPlayingMusicBeforeSitting = false;
    playingAlbumIndex = -1;

    // 停止所有正在播放的专辑音乐
    for (let i = 0; i < 4; i++) {
      if (albumPlaying[i]) {
        wasPlayingMusicBeforeSitting = true;
        playingAlbumIndex = i;
        console.log(`🎵 坐下前正在播放专辑${i + 1}，暂停播放`);
        if (albumAudios[i]) {
          albumAudios[i].pause();
        }
        albumPlaying[i] = false;
        break;
      }
    }

    // 停止正在播放的卡农
    if (isCanonPlaying) {
      if (!wasPlayingMusicBeforeSitting) {
        wasPlayingMusicBeforeSitting = true;
      }
      console.log('🎵 坐下前正在播放卡农，暂停播放');
      stopCanon();
    }

    // 添加键盘事件监听
    document.addEventListener('keydown', handlePianoKeyDown);
    document.addEventListener('keyup', handlePianoKeyUp);

    // 显示键位说明面板
    showPianoGuide();

    console.log('🎹 现在可以弹奏钢琴了！使用键位 A-L 对应 C4-E5');
    console.log('⌨️ 按 E 键离开钢琴');
  }

  // 显示钢琴键位说明面板
  function showPianoGuide() {
    // 如果已存在则先移除
    hidePianoGuide();

    const guideDiv = document.createElement('div');
    guideDiv.id = 'piano-guide';
    guideDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 20px;
      border-radius: 10px;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 14px;
      z-index: 1000;
      min-width: 200px;
      border: 2px solid #d4af37;
    `;

    guideDiv.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #d4af37; font-size: 18px;">🎹 钢琴键位说明</h3>
      <div style="line-height: 1.8;">
        <div><span style="color: #ffd700; font-weight: bold;">A</span> - C4 (Do)</div>
        <div><span style="color: #ffd700; font-weight: bold;">S</span> - D4 (Re)</div>
        <div><span style="color: #ffd700; font-weight: bold;">D</span> - E4 (Mi)</div>
        <div><span style="color: #ffd700; font-weight: bold;">F</span> - F4 (Fa)</div>
        <div><span style="color: #ffd700; font-weight: bold;">G</span> - G4 (Sol)</div>
        <div><span style="color: #ffd700; font-weight: bold;">H</span> - A4 (La)</div>
        <div><span style="color: #ffd700; font-weight: bold;">J</span> - B4 (Si)</div>
        <div><span style="color: #ffd700; font-weight: bold;">K</span> - C5 (Do)</div>
        <div><span style="color: #ffd700; font-weight: bold;">L</span> - D5 (Re)</div>
        <div><span style="color: #ffd700; font-weight: bold;">;</span> - E5 (Mi)</div>
      </div>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #666; color: #aaa; font-size: 12px;">
        按 <span style="color: #ffd700; font-weight: bold;">E</span> 键离开钢琴
      </div>
    `;

    document.body.appendChild(guideDiv);
    console.log('📖 显示钢琴键位说明');
  }

  // 隐藏钢琴键位说明面板
  function hidePianoGuide() {
    const existingGuide = document.getElementById('piano-guide');
    if (existingGuide) {
      existingGuide.remove();
      console.log('📖 隐藏钢琴键位说明');
    }
  }

  // 站起来离开钢琴
  function standUpFromPiano(camera, controls, player) {
    if (!isSittingAtPiano) return;

    console.log('🚶 离开钢琴');
    isSittingAtPiano = false;

    // 隐藏键位说明面板
    hidePianoGuide();

    // 恢复相机位置
    camera.position.copy(standingPosition);
    camera.rotation.copy(standingRotation);

    // 恢复玩家控制
    if (player) player.enabled = true;
    if (controls) controls.enabled = true;

    // 停止播放卡农
    stopCanon();

    // 如果坐下前有音乐播放，恢复播放
    if (wasPlayingMusicBeforeSitting) {
      if (playingAlbumIndex >= 0) {
        console.log(`🎵 恢复播放专辑${playingAlbumIndex + 1}`);
        albumPlaying[playingAlbumIndex] = true;
        if (albumAudios[playingAlbumIndex]) {
          albumAudios[playingAlbumIndex].play().catch(err => {
            console.error('❌ 恢复专辑播放失败:', err);
            albumPlaying[playingAlbumIndex] = false;
          });
        }
      } else {
        console.log('🎵 恢复播放卡农');
        playCanon();
      }
      wasPlayingMusicBeforeSitting = false;
      playingAlbumIndex = -1;
    }

    // 移除键盘事件监听
    document.removeEventListener('keydown', handlePianoKeyDown);
    document.removeEventListener('keyup', handlePianoKeyUp);
  }

  // 处理钢琴键盘按下
  function handlePianoKeyDown(event) {
    if (!isSittingAtPiano) return;

    // 按 E 键离开钢琴
    if (event.key.toLowerCase() === 'e') {
      console.log('⌨️ 按下了 E 键，准备离开钢琴');
      console.log('🎹 pianoCamera:', pianoCamera, 'pianoControls:', pianoControls, 'pianoPlayer:', pianoPlayer);
      standUpFromPiano(pianoCamera, pianoControls, pianoPlayer);
      return;
    }

    playPianoNote(event.key);
  }

  // 处理钢琴键盘释放
  function handlePianoKeyUp(event) {
    // 可以在这里添加音符释放效果
  }

  // ============================================
  // 音符系统
  // ============================================
  const notes = [];
  const maxNotes = 10;
  const noteSpawnInterval = 1000; // 毫秒
  let lastNoteSpawnTime = 0;

  // 创建音符函数
  function createNote() {
    const noteGroup = new THREE.Group();

    // 音符主体（黑色椭圆）
    const noteGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const noteMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.8,
      metalness: 0.1
    });
    const note = new THREE.Mesh(noteGeometry, noteMaterial);
    note.scale.set(1, 0.6, 0.3);
    noteGroup.add(note);

    // 音符杆（黑色细长方体）
    const stemGeometry = new THREE.BoxGeometry(0.05, 0.8, 0.05);
    const stem = new THREE.Mesh(stemGeometry, noteMaterial);
    stem.position.set(0, 0.4, 0);
    noteGroup.add(stem);

    // 音符旗帜（黑色三角形）
    const flagGeometry = new THREE.ConeGeometry(0.15, 0.3, 3);
    const flag = new THREE.Mesh(flagGeometry, noteMaterial);
    flag.position.set(0.05, 0.7, 0);
    flag.rotation.z = Math.PI / 4;
    noteGroup.add(flag);

    // 随机位置（钢琴旁边）
    const angle = Math.random() * Math.PI * 2;
    const distance = 2 + Math.random() * 2;
    noteGroup.position.set(
      room2X + Math.cos(angle) * distance,
      1.5 + Math.random() * 0.5,
      room2Z + Math.sin(angle) * distance
    );

    // 随机旋转
    noteGroup.rotation.y = Math.random() * Math.PI * 2;
    noteGroup.rotation.x = (Math.random() - 0.5) * 0.3;

    // 存储音符数据
    noteGroup.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        0.01 + Math.random() * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      life: 1.0,
      decay: 0.005 + Math.random() * 0.005
    };

    scene.add(noteGroup);
    notes.push(noteGroup);

    return noteGroup;
  }

  // 更新音符动画（卡农自动播放的音符）
  function updateNotes() {
    for (let i = notes.length - 1; i >= 0; i--) {
      const note = notes[i];

      // 应用速度
      note.position.add(note.userData.velocity);

      // 应用旋转
      note.rotation.y += note.userData.rotationSpeed;
      note.rotation.x += note.userData.rotationSpeed * 0.5;

      // 减少生命值
      note.userData.life -= note.userData.decay;

      // 缩放效果
      const scale = note.userData.life;
      note.scale.setScalar(scale);

      // 移除死亡的音符
      if (note.userData.life <= 0) {
        scene.remove(note);
        notes.splice(i, 1);
      }
    }
  }

  // 生成音符（在动画循环中调用）
  function spawnNotes(currentTime) {
    if (!isCanonPlaying) return;

    if (currentTime - lastNoteSpawnTime > noteSpawnInterval) {
      if (notes.length < maxNotes) {
        createNote();
        lastNoteSpawnTime = currentTime;
      }
    }
  }

  // ============================================
  // 四个角落的专辑展台
  // ============================================
  const albumPositions = [
    [room2X - 10, room2Z - 10],
    [room2X + 10, room2Z - 10],
    [room2X - 10, room2Z + 10],
    [room2X + 10, room2Z + 10]
  ];

  const albumTitles = [
    '专辑1\n点击播放曲目1',
    '专辑2\n点击播放曲目2',
    '专辑3\n点击播放曲目3',
    '专辑4\n点击播放曲目4'
  ];

  let albumAudios = [];
  let albumPlaying = [false, false, false, false];

  const albumModels = [];

  for (let i = 0; i < 4; i++) {
    const [x, z] = albumPositions[i];

    const loader = new GLTFLoader();
    loader.load(
      `../../public/glb/album${i + 1}.glb`,
      (gltf) => {
        console.log(`✅ 专辑${i + 1}模型加载成功！`, gltf);
        const album = gltf.scene;
        album.position.set(x, 0.5, z);
        album.scale.set(4, 4, 4);

        if (i === 0 || i === 1) {
          album.rotation.y = -Math.PI / 2;
        } else if (i === 2 || i === 3) {
          album.rotation.y = Math.PI / 2;
        }

        // 先设置专辑本身的属性
        album.name = albumTitles[i];
        album.userData = { index: i };
        console.log(`🎵 专辑${i + 1}根对象名称:`, album.name, 'userData:', album.userData);

        // 为专辑模型的所有子对象设置userData和name属性
        let meshCount = 0;
        album.traverse((child) => {
          if (child.isMesh) {
            child.userData = { index: i };
            child.name = albumTitles[i];
            meshCount++;
            console.log(`  - 子对象${meshCount}:`, child.name, 'userData:', child.userData);
          }
        });
        console.log(`🎵 专辑${i + 1}共找到${meshCount}个Mesh对象`);

        scene.add(album);
        collisionSystem.addObject(album);
        albumModels[i] = album;
        console.log(`🎵 专辑${i + 1}已添加到场景`);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(2) + '%';
        console.log(`专辑${i + 1}加载进度:`, percent);
      },
      (error) => {
        console.error(`❌ 专辑${i + 1}模型加载失败:`, error);
      }
    );
  }

  // ============================================
  // 前墙Vicky宣宣照片（无画框，9:16比例）
  // ============================================
  console.log('🖼️ 开始创建Vicky宣宣照片...');

  const vickyTexture = new THREE.TextureLoader().load(
    '../../public/photo/vicky.jpg',
    () => console.log('✅ Vicky照片纹理加载成功'),
    undefined,
    (error) => console.error('❌ Vicky照片纹理加载失败:', error)
  );
  vickyTexture.wrapS = THREE.RepeatWrapping;
  vickyTexture.repeat.x = -1;

  const vickyMaterial = new THREE.MeshBasicMaterial({
    map: vickyTexture,
    side: THREE.DoubleSide
  });

  const vickyWidth = 3.3;
  const vickyHeight = 4.4;
  const vickyGeometry = new THREE.PlaneGeometry(vickyWidth, vickyHeight);
  const vickyPhoto = new THREE.Mesh(vickyGeometry, vickyMaterial);
  vickyPhoto.position.set(room2X, 3.2, room2Z + room2Depth / 2 - 0.15);
  scene.add(vickyPhoto);
  vickyPhoto.name = 'Vicky宣宣';

  // ============================================
  // Vicky照片左侧长条透明玻璃板（歌曲列表）
  // ============================================
  console.log('🪟 开始创建歌曲列表玻璃板...');

  // 歌曲列表（按指定顺序）
  const songs = [
    'Vicky top10',
    '1.固有引力',
    '2.10831km',
    '3.暗恋是宇宙级遗憾',
    '4.日落人海',
    '5.一屏之念',
    '6.脱水蓝鲸',
    '7.越过狂风暴雨奔向你',
    '8.你那边现在几点',
    '9.女娲',
    '10.我们都在期待那一天'
  ];

  // 玻璃板参数
  const glassWidth = 5;
  const glassHeight = 7.8;
  const glassThickness = 0.1;

  // 创建透明玻璃材质
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    roughness: 0.1,
    metalness: 0.3,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  // 创建玻璃板几何体
  const glassGeometry = new THREE.BoxGeometry(glassWidth, glassHeight, glassThickness);
  const glassPlate = new THREE.Mesh(glassGeometry, glassMaterial);

  // 玻璃板位置（Vicky照片左侧）
  const glassX = room2X - vickyWidth / 2 - glassWidth / 2 + 10;
  const glassY = 3;
  const glassZ = room2Z + room2Depth / 2 - 0.15;
  glassPlate.position.set(glassX, glassY, glassZ);
  scene.add(glassPlate);
  collisionSystem.addObject(glassPlate);
  glassPlate.name = 'Vicky宣宣\n歌曲列表';

  // 添加歌曲名称文字
  for (let i = 0; i < songs.length; i++) {
    // 使用Canvas创建文本纹理
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 80;

    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 设置文字样式
    context.fillStyle = '#ffffff';
    context.font = '56px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    // 绘制文字
    context.fillText(songs[i], 20, canvas.height / 2);

    // 创建纹理
    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.needsUpdate = true;

    // 文字材质
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      side: THREE.DoubleSide
    });

    // 文字几何体
    const textGeometry = new THREE.PlaneGeometry(2.5, 0.4); // 增加宽度以显示更长的文字
    const text = new THREE.Mesh(textGeometry, textMaterial);

    // 文字位置
    const textX = glassX - glassWidth / 2 + 3;
    const textY = glassY + glassHeight / 2 - 0.6 - i * 0.6;
    const textZ = glassZ + glassThickness / 2 + 0.09;

    text.position.set(textX, textY, textZ);
    text.rotation.y = Math.PI;

    scene.add(text);
  }

  console.log('✅ 歌曲列表玻璃板创建完成！');

  // ============================================
  // 后墙照片
  // ============================================
  const photoWidth = 1.6;
  const photoHeight = 1.2;
  const photoSpacing = 1;

  // 照片顺序
  const photos = [
    '../../public/photo/250622许嵩.jpg',
    '../../public/photo/250802上海站.png',
    '../../public/photo/250802Vicky.jpg',
    '../../public/photo/250816张靓颖.jpg',
    '../../public/photo/251122张杰.jpg',
    '../../public/photo/251128郁一凡.jpg',
    '../../public/photo/260110浅影阿.jpg'
  ];

  // 计算总宽度：10个照片 + 9个间距（保持原来的布局）
  const totalWidth = 10 * photoWidth + 9 * photoSpacing;
  // 计算起始位置，使照片居中
  const startX = room2X - totalWidth / 2 + photoWidth / 2;

  for (let i = 0; i < 10; i++) {
    let photoX = startX + i * (photoWidth + photoSpacing);

    // 前五张照片左移1m，后五张照片右移1m
    if (i < 5) {
      photoX -= 1;
    } else {
      photoX += 1;
    }

    // 只加载前7张照片，后面3个位置留空
    if (i < photos.length) {
      const photoTexture = new THREE.TextureLoader().load(photos[i]);
      photoTexture.encoding = THREE.sRGBEncoding;
      photoTexture.flipY = false;

      const photoMaterial = new THREE.MeshStandardMaterial({
        map: photoTexture,
        side: THREE.DoubleSide
      });

      const photoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
      const photo = new THREE.Mesh(photoGeometry, photoMaterial);
      photo.rotation.x = Math.PI; // 反转180度（绕x轴）
      photo.scale.set(-1.1, 1.1, 1); // 放大1.1倍并镜像对称
      photo.position.set(photoX, 3.5, room2Z - room2Depth / 2 + 0.15);

      // 为照片设置name属性
      if (i === 0) {
        photo.name = '250622许嵩\n[呼吸之野]巡回演唱会';
      } else if (i === 1) {
        photo.name = '250802\n与宣总合影';
      } else if (i === 2) {
        photo.name = '250802\nVicky宣宣[SINGER]专场演唱会上海站';
      } else if (i === 3) {
        photo.name = '250816\n张靓颖[追]世界巡回演唱会宁波站';
      } else if (i === 4) {
        photo.name = '251122\n张杰[开往1982]世界巡回演唱会台州站';
      } else if (i === 5) {
        photo.name = '251128\n郁一凡[花期]专场演唱会杭州站';
      } else if (i === 6) {
        photo.name = '260110\n浅影阿[寻影]个人演唱会杭州站';
      }

      scene.add(photo);
    }
    // 后面3个位置留空
  }

  console.log('✅ 音乐馆创建完成！');
  console.log('🎵 功能：');
  console.log('   - 中央钢琴：自动播放卡农，点击停止');
  console.log('   - 四个角落：音乐专辑，点击播放/停止');
  console.log('   - 前墙：Vicky宣宣照片');
  console.log('   - 后墙：10个照片位置（7张照片，3个留空）');

  let wasInRoom2 = false;

  function checkPlayerInRoom2(playerPosition) {
    const halfWidth = room2Width / 2;
    const halfDepth = room2Depth / 2;
    const inRoom2 = playerPosition.x >= room2X - halfWidth &&
      playerPosition.x <= room2X + halfWidth &&
      playerPosition.z >= room2Z - halfDepth &&
      playerPosition.z <= room2Z + halfDepth &&
      playerPosition.y >= 0 &&
      playerPosition.y <= 10;

    if (inRoom2 && !wasInRoom2) {
      // 只有在没有播放专辑且没有弹奏钢琴时才播放卡农
      let isAnyAlbumPlaying = false;
      for (let i = 0; i < 4; i++) {
        if (albumPlaying[i]) {
          isAnyAlbumPlaying = true;
          break;
        }
      }
      
      if (!isAnyAlbumPlaying && !isSittingAtPiano) {
        console.log('🎵 进入音乐馆，开始播放卡农');
        playCanon();
      }
    } else if (!inRoom2 && wasInRoom2) {
      console.log('🛑 离开音乐馆，停止所有音乐');
      // 停止卡农
      stopCanon();
      // 停止所有专辑音乐
      for (let i = 0; i < 4; i++) {
        if (albumPlaying[i] && albumAudios[i]) {
          albumPlaying[i] = false;
          albumAudios[i].pause();
          albumAudios[i].currentTime = 0;
          console.log(`🛑 停止专辑${i + 1}`);
        }
      }
    }

    wasInRoom2 = inRoom2;
    return inRoom2;
  }

  return {
    roomName: '音乐馆',
    playCanon: playCanon,
    stopCanon: stopCanon,
    checkPlayerInRoom2: checkPlayerInRoom2,
    updateNotes: updateAllNotes,
    spawnNotes: spawnNotes,
    sitAtPiano: sitAtPiano,
    standUpFromPiano: standUpFromPiano,
    isSittingAtPiano: () => isSittingAtPiano,
    playAlbum: (index) => {
      console.log('🎵 点击专辑', index + 1, '当前播放状态:', albumPlaying[index]);

      if (!albumPlaying[index]) {
        // 第一次点击：停止卡农，播放专辑
        stopCanon();
        for (let i = 0; i < 4; i++) {
          if (i !== index && albumPlaying[i] && albumAudios[i]) {
            albumPlaying[i] = false;
            albumAudios[i].pause();
            albumAudios[i].currentTime = 0;
            console.log(`🛑 停止专辑${i + 1}`);
          }
        }
        albumPlaying[index] = true;
        try {
          if (!albumAudios[index]) {
            console.log('🎵 创建新的音频对象:', `../../public/voice/track${index + 1}.mp3`);
            albumAudios[index] = new Audio(`../../public/voice/track${index + 1}.mp3`);
            albumAudios[index].volume = 0.5;
          }
          albumAudios[index].play().then(() => {
            console.log('✅ 专辑', index + 1, '开始播放');
          }).catch(err => {
            console.error('❌ 音频播放失败:', err);
            albumPlaying[index] = false;
          });
        } catch (err) {
          console.error('❌ 音频加载失败:', err);
          albumPlaying[index] = false;
        }
      } else {
        // 再次点击：停止专辑，恢复播放卡农
        console.log('🛑 暂停专辑', index + 1, '，恢复播放卡农');
        albumPlaying[index] = false;
        if (albumAudios[index]) {
          albumAudios[index].pause();
          albumAudios[index].currentTime = 0;
        }
        // 恢复播放卡农
        playCanon();
      }
    }
  };
}

console.log('✅ 音乐馆模块已加载');