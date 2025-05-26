const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1d212d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

let player, cursors;
let platforms, stars;
let score = 0;
let scoreText;

function preload() {
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  this.load.image("star", "https://labs.phaser.io/assets/sprites/star.png");
  this.load.image("ground", "assets/ground.png");
}

function create() {
  // Platforms group (static)
  platforms = this.physics.add.staticGroup();

  // Ground platform (only once)
  platforms.create(400, 580, "ground").setScale(2).refreshBody();

  // Floating platforms
  platforms.create(600, 450, "ground");
  platforms.create(50, 350, "ground");
  platforms.create(750, 220, "ground");

  // Player sprite
  player = this.physics.add.sprite(300, 450, "dude");
  player.setCollideWorldBounds(true);

  // Collide player with platforms
  this.physics.add.collider(player, platforms);

  // Stars group (collectibles)
  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  // Add bounce to stars
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Collide stars with platforms so they land on them
  this.physics.add.collider(stars, platforms);

  // Overlap player with stars (collect)
  this.physics.add.overlap(player, stars, collectStar, null, this);

  // Animations
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // Keyboard cursors
  cursors = this.input.keyboard.createCursorKeys();

  // Jump with mouse/touch
  this.input.on("pointerdown", () => {
    if (player.body.touching.down) {
      player.setVelocityY(-350);
    }
  });

  // Score text (create once)
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#fff",
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-350);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true); // Hide star

  score += 10;
  scoreText.setText("Score: " + score);
}
