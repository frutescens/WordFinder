import { Scene } from "phaser";
import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";
import { BasicChildData, MainGame } from "./main-game";
import eventsCenter from "../events-center";
import { UnlockBanner } from "../ui/unlock-banner";
import { ALL_INPUT_UPGRADES } from "../enums/input-upgrades";
import { ALL_OTHER_UPGRADES } from "../enums/other-upgrades";
import { UpgradeCategories } from "../enums/upgrade-categories";
import { PlayerProgress } from "../types/player-data";
import { INPUT_UPGRADES_CONDITIONS, OTHER_UPGRADES_CONDITIONS, UnlockConditionFunc } from "../upgrades/unlock-conditions";

export type UnlockManagerData = {
  scope: MainGame;
};

export class UnlockManager extends Scene {
  private scope: MainGame; 
  private bannerContainer: UnlockBanner;

  constructor() {
    super({ key: "UnlockManager" });
  }

  init(data: BasicChildData) {
    this.scope = data.scope;
  }

  create() {
    eventsCenter.on("CHECK_FOR_UNLOCKS", (currentPlayerProgress: PlayerProgress) => {
      ALL_INPUT_UPGRADES.filter(
        (x) => !currentPlayerProgress.inputUpgrades.includes(x)
      ).forEach((upgrade) => {
        const unlockCondition = INPUT_UPGRADES_CONDITIONS[
          upgrade
        ] as UnlockConditionFunc;
        if (unlockCondition(currentPlayerProgress.wordsFound)) {
          eventsCenter.emit("UNLOCK_UPGRADE", upgrade, UpgradeCategories.INPUT);
          eventsCenter.emit('SHOW_UNLOCK_BANNER', upgrade, UpgradeCategories.INPUT);
        }
      });
      ALL_OTHER_UPGRADES.filter(
        (x) => !currentPlayerProgress.otherUpgrades.includes(x)
      ).forEach((upgrade) => {
        const unlockCondition = OTHER_UPGRADES_CONDITIONS[
          upgrade
        ] as UnlockConditionFunc;
        if (unlockCondition(currentPlayerProgress.wordsFound)) {
          eventsCenter.emit("UNLOCK_UPGRADE", upgrade, UpgradeCategories.OTHER);
          eventsCenter.emit('SHOW_UNLOCK_BANNER', upgrade, UpgradeCategories.OTHER);
        }
      });
    });
    eventsCenter.on(
      "UNLOCK_INPUT_UPGRADE",
      (upgrade: InputUpgrades | OtherUpgrades, upgradeCategory: UpgradeCategories) => {
        this.bannerContainer = new UnlockBanner(
          this.scope,
          0,
          0,
          upgrade,
          upgradeCategory
        );
        this.scope.add.existing(this.bannerContainer);
      },
      this
    );
    eventsCenter.on("DESTROY_EVENT_BANNER", () => {
      if (this.bannerContainer) {
        this.bannerContainer.destroy();
      }
    });
  }
}
