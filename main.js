const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1d212d",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  const loadingText = this.add.text(300, 250, "Loading...", {
    fontSize: "20px",
    fill: "#ffffff",
  });

  this.load.image("logo", "assets/plane.png");
  this.load.audio("jump", "assets/jump.mp3");
  this.load.on("progress",(value)=>{
    loadingText.setText(`Loading....${Math.round(value*100)}%`)
  })
  this.load.on("complete",()=>{
    loadingText.setText("Load Complete")
  })
}

function create() {
  this.add.image(Math.random() * 800, Math.random() * 600, "logo");
}

function update() {
  // Called every frame
  console.log("game is updating");
}
