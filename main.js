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
let platforms;

function preload() {
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  // Optional: load a ground image (or use a colored rectangle)
  this.load.image("ground", "assets/ground.png");
}

function create() {
  // Create platforms group as static physics group
  platforms = this.physics.add.staticGroup();

  // Create a ground platform at bottom
  platforms.create(400, 580, "ground").setScale(2).refreshBody();
  // Ground platform (at bottom)
  platforms.create(400, 580, 'ground').setScale(2).refreshBody();

  // Floating platforms
  platforms.create(600, 450, 'ground');
  platforms.create(50, 350, 'ground');
  platforms.create(750, 220, 'ground');
  // Create player sprite
  player = this.physics.add.sprite(400, 450, "dude");

  player.setCollideWorldBounds(true);

  // Enable collision between player and platforms
  this.physics.add.collider(player, platforms);

  // Create animations (same as before)
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

  cursors = this.input.keyboard.createCursorKeys();

  this.input.on("pointerdown", () => {
    if (player.body.touching.down) {
      player.setVelocityY(-350);
    }
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
