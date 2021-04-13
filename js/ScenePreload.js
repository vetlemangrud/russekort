class ScenePreload extends Phaser.Scene {
  constructor() {
    super({ key: "ScenePreload" });
  }
  preload() {
    this.load.image("sprBg0", "content/sprBg0.png");
    this.load.image("sprBg1", "content/sprBg1.png");
    this.load.image("nebulaBg", "content/nebula.png");
    this.load.spritesheet("sprPlayer", "content/playerss.png", {
      frameWidth: 329,
      frameHeight: 374
    });
    this.load.spritesheet("sprExplosion", "content/sprExplosion.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("sprEnemy0", "content/sprEnemy0.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprEnemy1", "content/sprEnemy1.png");
    this.load.spritesheet("sprEnemy2", "content/sprEnemy2.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprLaserEnemy0", "content/sprLaserEnemy0.png");
    this.load.image("sprLaserPlayer", "content/sprLaserPlayer.png");
    this.load.spritesheet("sprLaserPlayer2", "content/laser.png", {
      frameWidth: 5,
      frameHeight: 13
    });


    this.load.audio("sndExplode0", "content/sndExplode0.wav");
    this.load.audio("sndExplode1", "content/sndExplode1.wav");
    this.load.audio("sndLaser", "content/newLaser3.wav");
    this.load.audio("sndHit", "content/hit.wav");

    this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "content/sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "content/sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "content/sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "content/sprBtnRestartDown.png");
    this.load.audio("sndBtnOver", "content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "content/sndBtnDown.wav");
    this.load.audio("gameOverMusic","content/gameOverMusic.mp3");
    this.load.audio("menuMusic", "content/menuMusic.mp3");
    this.load.audio("bgMusic", "content/bgMusic.mp3");

    this.playerUnder = this.add.image(game.config.width/2,game.config.height/2,"loadPlayer");
    this.playerUnder.setAlpha(0.2);
    this.playerOver = this.add.image(game.config.width/2,game.config.height/2,"loadPlayer");
    this.maskGraphics = this.make.graphics();
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.beginPath();
    this.maskGraphics.fillRect(200, 300, 0, 400);
    var mask = this.maskGraphics.createGeometryMask();
    this.playerOver.setMask(mask);

    this.title = this.add.text(this.game.config.width * 0.5, 200, "LOADING...", {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);

    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (iOS) {
      this.iPhoneBug = this.add.text(this.game.config.width * 0.5, this.game.config.height / 2 + 220, "MIDELRTIDIG PROBLEM \nHvis du har iPhone/iPad/iPod, må du rotere skjermen til liggende og tilbake til stående for at knappene i spillet skal virke", {
        fontFamily: 'monospace',
        fontSize: 30,
        color: '#ffffff',
        align: 'center',
        wordWrap: {width:this.game.config.width * 0.8},
      });
      this.iPhoneBug.setOrigin(0.5);

      this.rotateDown = this.add.image(game.config.width/4,game.config.height-100,"rotateDown");
      this.arrow = this.add.image(game.config.width/2,game.config.height-100,"arrow");
      this.rotateUp = this.add.image(game.config.width*0.75,game.config.height-100,"rotateUp");
    }

    this.load.on('progress', function (value) {
        this.scene.maskGraphics.clear();
        this.scene.maskGraphics.fillRect(200, 300, value*210, 400);
    });

    this.load.on('fileprogress', function (file) {
    });

    this.load.on('complete', function () {
        console.log('complete');
    });

  }
  create(){

    this.scene.start("SceneMainMenu");
  }
}
