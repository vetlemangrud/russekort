var game;
window.onload = function() {
  let width = 640;
  let height = 960;
  let windowRatio = window.innerWidth / window.innerHeight;
  if(windowRatio < width / height){
      height = width / windowRatio;
  }
  var config = {
    type: Phaser.WEBGL,
    width: width,
    height: height,
    backgroundColor: "black",
    physics: {
      default: "arcade",
      arcade: {
        //debug: true,
        gravity: { x: 0, y: 0 }
      }
    },
    scene: [
      SceneBoot,
      ScenePreload,
      SceneMainMenu,
      SceneMain,
      SceneGameOver
    ],
    pixelArt: true,
    roundPixels: true
  };
  game = new Phaser.Game(config);
  resize();
  window.addEventListener("resize", resize, false);
}
function resize() {

    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
