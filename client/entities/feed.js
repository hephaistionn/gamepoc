import common from '../common';
import * as THREE from 'three';
import Entity from '../core/entity';
import material from '../shaders/materialBlock';
import textures from '../shaders/textures';
const colors = [0x009b48,0xb71234,0xffd500, 0x0046ad, 0xff5800 ];
let colorIndex = 0;
function getColor() {
  const color = colors[colorIndex];
  colorIndex++;
  if(colorIndex >= colors.length) colorIndex = 0;
  return color;
}


const geometries = {};
const groups = common.groups;
for(let v=0; v<groups.length; v++) {
  const size = groups[v].size;
  const geo = new THREE.BoxGeometry(size, size, size);
  geo.translate(0, size/2, 0);
  geo.uvsNeedUpdate = true;
  const faceVertexUvs = geo.faceVertexUvs[0];
  for(let i=0;i<faceVertexUvs.length; i++) {
    const uv = faceVertexUvs[i];
    for(let k=0; k<uv.length; k++) {
      uv[k].x *= size; 
      uv[k].y *= size;
    }
  }
  geometries[size] = geo;
}


class Feed extends Entity {

  constructor(config) {
    super(config);
    this.value = config.value;
    this.size = config.size;
    this.temooSize  = 1;
    this.element = new THREE.Mesh(geometries[config.size], material.clone());
    this.element.matrixAutoUpdate = false;
    this.element.castShadow = true;
    this.element.material.uniforms.color.value.setHex(getColor());
    this.element.material.uniforms.map.value =  textures.list.mapCube;

    this.initMatrix(config.x, config.y, config.z); //opti
    this.constructor.elements.push(this.element);
  }

  onPostDismount() {
    const i = this.constructor.elements.indexOf(this.element);
    this.constructor.elements.splice(i, 1);
  }

  onEat() {
    this.dead = true;
    this.constructor.dying.push(this);
  }

  update(dt) { //only called for dying entity
    if (this.temooSize > 0.2) { 
      this.temooSize -= dt * 0.006 * this.temooSize;
      const matrixWorld = this.element.matrixWorld.elements;
      matrixWorld[0] = this.temooSize;
      matrixWorld[5] = this.temooSize;
      matrixWorld[10] = this.temooSize;
    } else {
      const i = this.constructor.dying.indexOf(this);
      this.constructor.dying.splice(i, 1);
      this.onDismount();
    }
  }
}

Feed.update = function update(dt) {
  for (let i = Feed.dying.length - 1; i > -1; i--) {
    const feed = Feed.dying[i];
    feed.update(dt);
  }
}

Feed.elements = [];

export default Feed;