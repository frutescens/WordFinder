import eventsCenter from "../events-center";
import { StreakTrackerDisplay } from "../ui/streak-tracker";
import { MainGame, BasicChildData } from "./main-game";
export class StreakTracker extends Phaser.Scene {
  private scope: MainGame;
  private startingLetter: string;
  private streakCount: number = 0;
  private streakTrackerDisplay: StreakTrackerDisplay;

  constructor() {
    super({ key: "StreakTracker" });
  }

  init(data: BasicChildData) {
    this.scope = data.scope;
  }

  create() {
    eventsCenter.addListener('TRACK_STREAK', (newestInput: string) => {
      if (newestInput[0] !== this.startingLetter) {
        this.resetStreak(newestInput[0]);
      } else {
        this.updateStreak()
      }
    });
  }

  private updateStreak() {
    this.streakCount++;
    if (this.streakCount > 1) {
      if (!this.streakTrackerDisplay) {
        this.streakTrackerDisplay = new StreakTrackerDisplay(this.scope, 0, 0, this.startingLetter, this.streakCount);
        this.scope.add.existing(this.streakTrackerDisplay);
      } else {
        this.streakTrackerDisplay.updateStreakCount(this.streakCount);
      }
    }
    
  }

  private resetStreak(newStartingLetter: string) {
    this.streakCount = 0;
    this.startingLetter = newStartingLetter;
    this.streakTrackerDisplay.destroy();
    // destroy streak text container
  }
}
