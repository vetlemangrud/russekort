class SceneBoot extends Phaser.Scene {
  constructor() {
    super({ key: "SceneBoot" });
  }
  preload(){
    this.load.image("loadPlayer", "content/vetle.png");
    this.load.image("rotateDown", "content/rotateDown.png");
    this.load.image("rotateUp", "content/rotateUp.png");
    this.load.image("arrow", "content/arrow.png");
  }
  create(){
    this.scene.start("ScenePreload");
  }
}
