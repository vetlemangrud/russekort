class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData("type", type);
    this.setData("isDead", false);
    this.setData("health",0);
    this.setData("bounty",0);
  }
  explode(canDestroy){
    if (!this.getData("isDead")) {
      // Set the texture to the explosion image, then play the animation
      this.setTexture("sprExplosion");  // this refers to the same animation key we used when we added this.anims.create previously
      this.play("sprExplosion"); // play the animation
      // pick a random explosion sound within the array we defined in this.sfx in SceneMain
      this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }
      this.setAngle(0);
      this.body.setVelocity(0, 0);
      this.on('animationcomplete', function() {
        if (canDestroy) {
          this.destroy();
        }
        else {
          this.setVisible(false);
        }
      }, this);
      this.setData("isDead", true);
    }
  }
  damage(amt, canDestroy){
    this.setTintFill(0xffffff);
    this.scene.time.addEvent({ // go to game over scene
      delay: 50,
      callback: this.setTint,
      callbackScope: this,
      loop: false
    });
    this.scene.sfx.hit.play();
    this.setData("health",this.getData("health")-amt);
    if (this.getData("health")<=0) {
      this.explode(canDestroy);
      this.onDestroy();
    }
  }
  onDestroy(){
    this.scene.score += this.getData("bounty");
  }
}

class Player extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, "Player");

    this.setScale(0.5);
    this.body.setSize(120,200,false);
    this.body.setOffset(90,90);
    this.setData("speed", 200);
    this.setData("isShooting", true);
    this.setData("timerShootDelay", 4);
    this.setData("maxAmmo", 4);
    this.setData("currentAmmo",this.getData("maxAmmo"));
    this.setData("reloadTime", 6);
    this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
    this.setData("maxHealth", 100);
    this.setData("health", 100);
    this.laserSource = new Phaser.Geom.Point(-10,-70);
    this.play("sprPlayer");

  }
  moveUp() {
    this.body.velocity.y = -this.getData("speed");
  }
  moveDown() {
    this.body.velocity.y = this.getData("speed");
  }
  moveLeft() {
    this.body.velocity.x = -this.getData("speed");
  }
  moveRight() {
    this.body.velocity.x = this.getData("speed");
  }
  update(){
    this.body.setVelocity(0, 0);
    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    if (this.getData("isShooting")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      }
      else if (this.getData("currentAmmo") <= 0) {
        this.setData("currentAmmo",this.getData("maxAmmo"));
        this.setData("timerShootTick", this.getData("timerShootDelay", 5)-this.getData("reloadTime"));
      }
      else { // when the "manual timer" is triggered:
        var laser = new PlayerLaser(this.scene, this.x+this.laserSource.x, this.y+this.laserSource.y);
        this.scene.playerLasers.add(laser);
        this.scene.sfx.laser.play(); // play the laser sound effect
        this.setData("timerShootTick", 0);
        this.setData("currentAmmo", this.getData("currentAmmo") - 1);
      }
    }
  }

  onDestroy(){
    super.onDestroy();
    this.scene.time.addEvent({ // go to game over scene
      delay: 1000,
      callback: function() {
        this.scene.bgMusic.stop();
        this.scene.scene.start("SceneGameOver",this.scene.score);
      },
      callbackScope: this,
      loop: false
    });
  }
}

class ChaserShip extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy1", "ChaserShip");
    this.body.velocity.y = Phaser.Math.Between(50, 100);
    this.states = {
      MOVE_DOWN: "MOVE_DOWN",
      CHASE: "CHASE"
    };
    this.state = this.states.MOVE_DOWN;
    this.setData("health", 600);
    this.setData("bounty",1);
  }
  update(){
    if (!this.getData("isDead") && this.scene.player) {
      if (Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.player.x,
        this.scene.player.y
      ) < 320) {
        this.state = this.states.CHASE;
      }
      if (this.state == this.states.CHASE) {
        var dx = this.scene.player.x - this.x;
        var dy = this.scene.player.y - this.y;
        var angle = Math.atan2(dy, dx);
        var speed = 100;
        this.body.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      }
      if (this.x < this.scene.player.x) {
        this.angle -= 5;
      }
      else {
        this.angle += 5;
      }
    }
  }
}

class GunShip extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy0", "GunShip");
    this.play("sprEnemy0");
    this.body.velocity.y = Phaser.Math.Between(50, 100);
    this.setData("health", 200);
    this.setData("bounty",1);
    this.shootTimer = this.scene.time.addEvent({
      delay: 1300,
      callback: function() {
        var laser = new EnemyLaser(
          this.scene,
          this.x,
          this.y
        );
        laser.setScale(this.scaleX);
        this.scene.enemyLasers.add(laser);
      },
      callbackScope: this,
      loop: true
    });
  }
  onDestroy(){
    super.onDestroy();
    if (this.shootTimer !== undefined) {
     if (this.shootTimer) {
       this.shootTimer.remove(false);
     }
   }
  }
}

class CarrierShip extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy2", "CarrierShip");
    this.play("sprEnemy2");
    this.body.velocity.y = Phaser.Math.Between(50, 100);
    this.setData("health", 300);
    this.setData("bounty",1);
  }
}

class EnemyLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserEnemy0");
    this.body.velocity.y = 200;
  }

}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserPlayer2");
    this.play("sprLaser");
    this.body.velocity.y = -600;
    // this.setScale(2);
    this.setDepth(-1);
  }
}

class ScrollingBackground {
  constructor(scene, key, velocityY) {
    this.scene = scene;
    this.key = key;
    this.velocityY = velocityY;
    this.layers = this.scene.add.group();
    this.createLayers();

  }
  createLayers(){
    for (var i = 0; i < 2; i++) {
      // creating two backgrounds will allow a continuous scroll
      var layer = this.scene.add.sprite(0, 0, this.key);
      layer.y = (layer.displayHeight * i);
      layer.x = this.key == "layerNo" ? 0 : Phaser.Math.Between(0,game.config.width);
      layer.setDepth(-5 - (i - 1));
      this.scene.physics.world.enableBody(layer, 0);
      layer.body.velocity.y = this.velocityY;
      this.layers.add(layer);
    }
  }
  update(){
    if (this.layers.getChildren()[0].y > 0) {
      for (var i = 0; i < this.layers.getChildren().length; i++) {
        var layer = this.layers.getChildren()[i];
        layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
      }
    }
  }
}
