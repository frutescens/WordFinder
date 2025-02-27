
export class StreakTrackerDisplay extends Phaser.GameObjects.Container {
    private startingLetter: string;
    private streakCount: number;
    private streakTrackerText: Phaser.GameObjects.Text;
    private streakTrackerTextStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontSize: 70, strokeThickness: 10, wordWrap: {width: 680}};

    constructor(scene: Phaser.Scene, x: number, y: number, startingLetter: string, streakCount: number) {
        super(scene, x, y);
        this.startingLetter = startingLetter;
        this.streakCount = streakCount;
        this.createTracker()
    }

    private createTracker() {
        this.setPosition(800, 750);
        
    }

    public updateStreakCount(newCount: number) {
        this.streakCount = newCount;
        this.streakTrackerText.text = "";
    }
}