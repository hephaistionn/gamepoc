import * as THREE from 'three';
import ee from './eventemitter';
import nipplejs from 'nipplejs';

export default class Scene {

  constructor() {
    this.requestAnimation = null;
    this.canvas = document.getElementById('D3');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.element = new THREE.Scene();
    this.element.matrixAutoUpdate = false;
    this.events = {};

    this.initEvents();
    this.initJoystick();
    this.init();
  }

  initEvents() {
    this._resize = this.resize.bind(this);
    window.addEventListener('resize', this._resize, false);
  }

  initJoystick() {
    const options = {
      zone: document.getElementById('zone_joystick'),
      mode: 'dynamic',
      color: 'blue',
      multitouch: false
    };
    this.joystick = nipplejs.create(options);
    this.joystick.on('move', (evt, data) => {
      if(this.onTouchMouve)
        this.onTouchMouve(data.force, data.angle.radian);
    });

    this.joystick.on('end', () => {
      if(this.onTouchEnd)
        this.onTouchEnd();
    });
  }

  start() {
    let time;
    const update = () => {
      this.requestAnimation = requestAnimationFrame(update);
      const now = new Date().getTime();
      let dt = now - (time || now);
      time = now;
      dt = Math.min(dt, 100);
      this.renderer.render(this.element, this.camera.element);
      this.update(dt);
    };
    update();
  }

  stop() {
    this.closeEvents();
    this.closeJoystick();
    cancelAnimationFrame(requestAnimation);
  }

  resize() {
    this.canvas.style = '';
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.resize(width, height);
    this.renderer.setSize(width, height);
  }

  add(child) {
    child.onMount(this);
  }

  remove(child) {s
    child.onDismount();
  }

  closeEvents() {
    window.removeEventListener('resize', this._resize);
  }

  closeJoystick() {
    this.joystick.destroy();
  }
}