import * as THREE from 'three';
import Entity from '../core/entity';
import material from '../shaders/materialGround';

export default class Ground extends Entity {

  constructor(config) {
    super(config);
    const geometry = new THREE.PlaneBufferGeometry(80, 80, 10, 10);
    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    this.element = new THREE.Mesh(geometry, material);
    this.element.matrixAutoUpdate = false;
    this.element.matrixWorldNeedsUpdate = false;
    this.element.receiveShadow = true;
    this.move(this.x, this.y, this.z);
  }

}
