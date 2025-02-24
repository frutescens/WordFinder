import { Scene } from "phaser";
import WordDict from "../word_list.json" assert {type: 'json'};
import { Unlocks } from "../enums/unlocks";


export class BaseScene extends Scene {
  public WORDS_FOUND: string[];
  public UNLOCKS: Unlocks[];

  constructor() {
    super({ key: "BaseScene" });
  }

  create() {
    this.scene.sendToBack('LoadPlayer');
    this.scene.start('LoadPlayer');
  }

  update() {
    if (this.WORDS_FOUND && this.UNLOCKS) {
      this.scene.stop('LoadPlayer');
      this.scene.start('MainGame', { dictionary: WordDict, wordsFound: this.WORDS_FOUND, unlocks: this.UNLOCKS });
    }
  }
}
