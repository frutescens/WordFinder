import eventsCenter from "../events-center";
import { StreakTrackerDisplay } from "../ui/streak-tracker";
import { DICTIONARY_KEYS, randInt, randItem } from "../utils";
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
    eventsCenter.addListener('UPDATE_STREAK_TRACKER', (newestInput: string) => {
      if (newestInput[0] !== this.startingLetter) {
        this.resetStreak(newestInput[0]);
      } else {
        this.updateStreak();
      }
    });
    this.events.addListener('GIVE_STREAK_REWARD', () => {
      if (this.streakCount > 0 && randInt(100) < this.streakCount) {
        const streakReward = randItem(DICTIONARY_KEYS.filter(m => !this.scope.PLAYER_PROGRESS.wordsFound.includes(m) && m[0] === this.startingLetter));
        if (streakReward) {
          eventsCenter.emit('ADD_TO_BUS', streakReward);
        } 
      }
    });
  }

  private updateStreak() {
    this.streakCount++;
    if (this.streakCount > 0) {
      if (!this.streakTrackerDisplay || !this.streakTrackerDisplay.active) {
        this.streakTrackerDisplay = new StreakTrackerDisplay(this.scope, 0, 0, this.startingLetter, this.streakCount);
        this.scope.add.existing(this.streakTrackerDisplay);
      } 
      this.streakTrackerDisplay.updateStreakCount(this.streakCount);
      this.events.emit('GIVE_STREAK_REWARD');
    }
    
  }

  private resetStreak(newStartingLetter: string) {
    this.streakCount = 0;
    this.startingLetter = newStartingLetter;
    if (this.streakTrackerDisplay) {
      this.streakTrackerDisplay.destroy(true);
    }
    // destroy streak text container
  }
}
