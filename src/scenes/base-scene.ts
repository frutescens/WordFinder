import { Scene } from "phaser";
import { PlayerProgress } from "../types/player-data";

export class BaseScene extends Scene {
  public PLAYER_PROGRESS: PlayerProgress;

  constructor() {
    super({ key: "BaseScene" });
  }

  preload() {
    this.scene.launch("SaveManager");
  }

  update() {
    this.PLAYER_PROGRESS = this.registry.get("playerProgress");
    if (!!this.PLAYER_PROGRESS) {
      this.scene.start("MainGame", this.PLAYER_PROGRESS);
    }
  }
}
