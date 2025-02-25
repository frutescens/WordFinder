import { Scene } from "phaser";
import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";
import { MainGameData } from "./main-game";


export class BaseScene extends Scene {
  public WORDS_FOUND: string[];
  public INPUT_UPGRADES: InputUpgrades[];
  public OTHER_UPGRADES: OtherUpgrades[];

  constructor() {
    super({ key: "BaseScene" });
  }

  create() {
    this.scene.sendToBack('LoadPlayer');
    this.scene.launch('LoadPlayer');
  }

  update() {
    if (this.WORDS_FOUND && this.INPUT_UPGRADES) {
      this.scene.stop('LoadPlayer');
      this.scene.start('MainGame', { wordsFound: this.WORDS_FOUND, inputUpgrades: this.INPUT_UPGRADES, otherUpgrades: this.OTHER_UPGRADES } as MainGameData);
    }
  }
}
