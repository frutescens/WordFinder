import { Scene } from "phaser";
import { BasicChildData, MainGame } from "./main-game";
import { ProgressDisplay } from "../ui/progress-display";
import eventsCenter from "../events-center";
import { PlayerProgress } from "../types/player-data";

export class ProgressDisplayManager extends Scene {
  private scope: MainGame;
  private progressDisplayContainer: ProgressDisplay;

  constructor() {
    super({ key: "ProgressDisplay" });
  }

  init(data: BasicChildData) {
    this.scope = data.scope;
    eventsCenter.on('UPDATE_PROGRESS_DISPLAY', (playerProgress: PlayerProgress) => {
      this.progressDisplayContainer.updateDisplay(playerProgress);
  });
  }

  create() {
    this.progressDisplayContainer = new ProgressDisplay(this.scope, 0, 0, this.scope.PLAYER_PROGRESS);
    this.scope.add.existing(this.progressDisplayContainer);
  }
}
