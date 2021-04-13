class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }
  create() {
    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sprEnemy2",
      frames: this.anims.generateFrameNumbers("sprEnemy2"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: "sprPlayer",
      frames: this.anims.generateFrameNumbers("sprPlayer"),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "sprLaser",
      frames: this.anims.generateFrameNumbers("sprLaserPlayer2"),
      frameRate: 20,
      repeat: -1
    });

    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1")
      ],
      laser: this.sound.add("sndLaser"),
      hit: this.sound.add("sndHit")
    };
    this.bgMusic = this.sound.add("bgMusic");
    this.bgMusic.setLoop(true);
    this.bgMusic.play();

    this.backgrounds = [];
    this.backgrounds.push(new ScrollingBackground(this, "nebulaBg", 25));
    for (var i = 0; i < 3; i++) {
      var bg = new ScrollingBackground(this, "sprBg0", i * 10);
      this.backgrounds.push(bg);
    }


    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprPlayer"
    );
    this.healthBar = this.add.graphics();

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointermove', function(pointer, currentlyOver){
      if (!this.scene.player.getData("isDead")) {
        this.scene.player.body.velocity.y = (pointer.y-pointer.prevPosition.y) * 100;
        this.scene.player.body.velocity.x = (pointer.x-pointer.prevPosition.x) * 100;
      }
    });

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.enemyTimer = this.time.addEvent({
      delay: 1500,
      callback: function() {
        var enemy = null;
        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new GunShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }
        else if (Phaser.Math.Between(0, 10) >= 5) {
          if (this.getEnemiesByType("ChaserShip").length < 5) {
            enemy = new ChaserShip(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        }
        else {
          enemy = new CarrierShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }
        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(20, 30) * 0.1);
          this.enemies.add(enemy);
        }
      },
      callbackScope: this,
      loop: true
    });
    this.physics.add.overlap(this.playerLasers, this.enemies, function(playerLaser, enemy) {
      if (!playerLaser.getData("isDead") &&
          !enemy.getData("isDead")) {
        enemy.damage(40,true);
        playerLaser.destroy();
      }
    });

    this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
      if (!player.getData("isDead") &&
          !enemy.getData("isDead")) {
        player.damage(35, false);
        enemy.damage(100,true);
      }
    });

    this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
      if (!player.getData("isDead") &&
          !laser.getData("isDead")) {
        player.damage(20, false);
        laser.destroy();
      }
    });

    this.score = 0;
    this.scoreText = this.add.text(5, 5, "score: 0", {
      fontFamily: 'monospace',
      fontSize: 30,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.scoreText.setDepth(2);
  }
  update(){

    if (!this.player.getData("isDead")) {
      this.player.update();
      if (this.keyW.isDown) {
        this.player.moveUp();
      }
      else if (this.keyS.isDown) {
        this.player.moveDown();
      }
      if (this.keyA.isDown) {
        this.player.moveLeft();
      }
      else if (this.keyD.isDown) {
        this.player.moveRight();
      }
      // if (this.keySpace.isDown) {
      //   this.player.setData("isShooting", true);
      // }
      // else {
      //   this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
      //   this.player.setData("isShooting", false);
      // }
    }
    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];
      enemy.update();
      if (enemy.x < -enemy.displayWidth ||
        enemy.x > this.game.config.width + enemy.displayWidth ||
        enemy.y < -enemy.displayHeight * 4 ||
        enemy.y > this.game.config.height + enemy.displayHeight) {

          if (enemy) {

            if (enemy.onDestroy !== undefined) {
              enemy.onDestroy();
            }
            enemy.destroy();
          }
      }
    }
    for (var i = 0; i < this.enemyLasers.getChildren().length; i++) {
      var laser = this.enemyLasers.getChildren()[i];
      laser.update();
      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }
    for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
      var laser = this.playerLasers.getChildren()[i];
      laser.update();
      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }


    for (var i = 0; i < this.backgrounds.length; i++) {
        this.backgrounds[i].update();
    }
    this.scoreText.text = "score: " + this.score;

    this.enemyTimer.delay -= 0.05;

    this.healthBar.clear();
    this.healthBar.fillStyle(0xff0000, 1);
    this.healthBar.fillRect(0, this.game.config.height-20, this.game.config.width * this.player.getData("health")/this.player.getData("maxHealth"), 20);
  }

  stop() {
    console.log("r");
    this.bgMusic.stop();
  }

  getEnemiesByType(type) {
    var arr = [];
    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];
      if (enemy.getData("type") == type) {
        arr.push(enemy);
      }
    }
    return arr;
  }

}
