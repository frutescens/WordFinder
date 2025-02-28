import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import { InputBox } from "../ui/input-box";
import { BasicChildData, MainGame } from "./main-game";
import WordDict from "../word_list.json" assert { type: "json" };
import eventsCenter from "../events-center";

export class InputManager extends Phaser.Scene {
  private scope: MainGame;
  private inputBox: InputBox;
  private newWordsFound: string[];

  constructor() {
    super({ key: "InputManager" });
  }

  init(data: BasicChildData) {
    this.scope = data.scope;
  }

  create() {
    this.newWordsFound = [];
    this.inputBox = new InputBox(this.scope, 0, 0);
    this.inputBox.inputText.setInteractive().on("pointerdown", () => {
      this.scope.rexUI.edit(this.inputBox.inputText);
    });
    this.input.keyboard?.on("keyup-ENTER", () => {
      this.newWordsFound = [];
      this.processInput(encodeURIComponent(this.inputBox.inputText.text));
      this.inputBox.clearInputText();
    });
    this.events.addListener('ADD_NEW_WORD', (word: string) => {
        this.newWordsFound.push(word);
        eventsCenter.emit('NEW_INPUT_RECEIVED', this.newWordsFound);
    });
    this.scope.add.existing(this.inputBox);
  }

  private getDictionaryWords(): string[] {
    return Object.keys(WordDict);
  }

  private processInput(playerInput: string) {
    playerInput = encodeURIComponent(playerInput).toUpperCase();
    const dictionaryWords = this.getDictionaryWords();
    if (
      !dictionaryWords.includes(playerInput) ||
      this.scope.PLAYER_PROGRESS.wordsFound.includes(playerInput)
    ) {
      return;
    }
    this.events.emit('ADD_NEW_WORD', playerInput);
  }
}
