export class InputBox extends Phaser.GameObjects.Container {
    private readonly INPUT_TEXT_LABEL: string = 'Input a Word!';
    private readonly FONT_SIZE: number = 50;
    private readonly labelConfig: Phaser.Types.GameObjects.Text.TextStyle = { fontSize: this.FONT_SIZE };
    private readonly inputConfig: Phaser.Types.GameObjects.Text.TextStyle = { fontSize: this.FONT_SIZE, fixedWidth: 430, fixedHeight: 60, backgroundColor: 'BLUE' };
    public inputText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.createInputBox();
    }

    private createInputBox() {
        const textHeader = this.scene.add.text(10, 15, this.INPUT_TEXT_LABEL, this.labelConfig);
        this.inputText = this.scene.add.text(10, 80, "", this.inputConfig);        
        this.add(textHeader);
        this.add(this.inputText);
    }

    public clearInputText() {
        this.inputText.text = "";
    }
}