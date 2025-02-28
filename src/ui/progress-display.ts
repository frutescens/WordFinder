import { Scene } from "phaser";
import { PlayerProgress } from "../types/player-data";
import { DICTIONARY_SIZE, TOTAL_UPGRADES_COUNT } from "../utils";

export class ProgressDisplay extends Phaser.GameObjects.Container {
  private textConfig: Phaser.Types.GameObjects.Text.TextStyle;
  private wordsFoundText: Phaser.GameObjects.Text;
  private upgradesFoundText: Phaser.GameObjects.Text;
  private WORDS_FOUND_LABEL: string = "Words Found: ";
  private UPGRADES_FOUND_LABEL: string = "Upgrades Found: ";
  
  constructor(scene: Scene, x: number, y: number, startingPlayerProgress: PlayerProgress) {
    super(scene, x, y);
    this.textConfig = {fontSize: 50};
    this.createDisplay();
    this.updateDisplay(startingPlayerProgress);
  }

  private createDisplay() {
    this.setPosition(0, 850);
    this.wordsFoundText = this.scene.add.text(10, 0.5, this.WORDS_FOUND_LABEL, this.textConfig);
    this.upgradesFoundText = this.scene.add.text(10, 105, this.UPGRADES_FOUND_LABEL, this.textConfig);
    this.add(this.wordsFoundText);
    this.add(this.upgradesFoundText);
  }

  updateDisplay(playerProgress: PlayerProgress) {
    const wordsFoundCount =
      playerProgress.wordsFound.length.toString() +
      "/" +
      DICTIONARY_SIZE.toString();
    this.wordsFoundText.text = this.WORDS_FOUND_LABEL + "\n" + wordsFoundCount;
    const upgradesCount = (playerProgress.inputUpgrades.length).toString() + "/" + TOTAL_UPGRADES_COUNT.toString();
    this.upgradesFoundText.text = this.UPGRADES_FOUND_LABEL + "\n" + upgradesCount;
  }
}
