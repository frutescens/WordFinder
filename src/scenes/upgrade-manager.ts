import { InputUpgrades } from "../enums/input-upgrades";
import eventsCenter from "../events-center";
import { DICTIONARY_KEYS, processDictionaryEntry, randItem } from "../utils";
import { BasicChildData, MainGame } from "./main-game";

export class UpgradeManager extends Phaser.Scene {
  private scope: MainGame;
  private tempWordBus: string[];

  constructor() {
    super({ key: "UpgradeManager" });
  }

  init(data: BasicChildData) {
    this.scope = data.scope;
    this.tempWordBus = [];
  }

  create() {
    eventsCenter.addListener("APPLY_UPGRADES", (inputString: string) => {
      this.scope.PLAYER_PROGRESS.inputUpgrades.forEach((x) => {
        console.log(InputUpgrades[x]);
        this.tempWordBus = this.tempWordBus.concat(
          ...this.applyUpgrade(x, inputString)
        );
      });
      eventsCenter.emit("ADD_TO_BUS", this.tempWordBus);
    });
    eventsCenter.addListener("PLAYER_DATA_CHANGED", () => {
      this.tempWordBus = [];
    });
  }

  private applyUpgrade(upgrade: InputUpgrades, inputString: string): string[] {
    const output: string[] = [];
    const dictionaryEntry = processDictionaryEntry(inputString);
    switch (upgrade) {
      case InputUpgrades.ALPHABET_SOUP:
        output.push(randItem(DICTIONARY_KEYS));
        break;
      case InputUpgrades.ALPHABET_CITY:
      case InputUpgrades.CAT:
        for (let i = 0; i < inputString.length; i++ ) {
          output.push(
            randItem(DICTIONARY_KEYS.filter((x) => x[0] === inputString[i]))
          );
        }
        break;
      case InputUpgrades.FOUR_LETTERS:
        output.push(randItem(DICTIONARY_KEYS.filter((x) => x.length === 4)));
        break;
      case InputUpgrades.FIVE_LETTERS:
        output.push(randItem(DICTIONARY_KEYS.filter((x) => x.length === 5)));
        break;
      case InputUpgrades.SIX_LETTERS:
        output.push(randItem(DICTIONARY_KEYS.filter((x) => x.length === 6)));
        break;
      case InputUpgrades.SEVEN_LETTERS:
        output.push(randItem(DICTIONARY_KEYS.filter((x) => x.length === 7)));
        break;
      case InputUpgrades.SYNONYMS:
        dictionaryEntry.synonynms.forEach((x) => {
          output.push(x.toUpperCase());
        });
        break;
      case InputUpgrades.ANTONYMS:
        dictionaryEntry.antonyms.forEach((x) => {
          output.push(x.toUpperCase());
        });
        break;
    }
    return output;
  }
}
