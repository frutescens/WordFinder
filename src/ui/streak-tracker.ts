
export class StreakTrackerDisplay extends Phaser.GameObjects.Container {
    private streakCount: number;
    private streakTrackerText: Phaser.GameObjects.Text;
    private streakTrackerTextStyle: Phaser.Types.GameObjects.Text.TextStyle = { stroke: 'RED', align: 'center', fontSize: 60, strokeThickness: 10, wordWrap: {width: 680}};

    constructor(scene: Phaser.Scene, x: number, y: number, startingLetter: string, streakCount: number) {
        super(scene, x, y);
        this.streakCount = streakCount;
        this.createTracker()
    }

    private createTracker() {
        this.setPosition(1450, 950);
        const trackerBox = new Phaser.GameObjects.Rectangle(this.scene, 0.5, 0.5, 600, 200, 0xff2374);
        this.streakTrackerText = new Phaser.GameObjects.Text(this.scene, 0.5, 0.5, '', this.streakTrackerTextStyle)
        this.streakTrackerText.setPosition(-250, -100);
        this.add(trackerBox);
        this.add(this.streakTrackerText);
    }

    public updateStreakCount(newCount: number) {
        this.streakCount = newCount;
        this.streakTrackerText.text = `Bonus Word ${this.streakCount.toString()}%! Same Letter Streak!`;
    }
}