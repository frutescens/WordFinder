import { Scene } from "phaser";

export class BaseScene extends Scene {
  constructor() {
    super({ key: "BaseScene" });
  }

  preload() {
    this.scene.launch("SaveManager");
  }

  update() {
    this.scene.start("MainGame");
  }
}
