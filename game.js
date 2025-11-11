// Конфигурация игровых констант
const gameConfig = {
    // Размеры игры
    game: {
        width: 800,
        height: 600
    },
    // Настройки игрока
    player: {
        width: 32,
        height: 48,
        color: 0xff0000,
        x: 400,
        y: 300,
        gravity: 300,
        moveSpeed: 160,
        jumpSpeed: 330,
        wallJumpSpeed: 250,
        wallJumpHorizontal: 200
    },
    // Настройки платформы
    platform: {
        x: 400,
        y: 580,
        width: 800,
        height: 40,
        color: 0x00ff00
    },
    // Настройки стен
    walls: {
        left: {
            x: 50,
            y: 300,
            width: 20,
            height: 600,
            color: 0xffffff
        },
        right: {
            x: 750,
            y: 300,
            width: 20,
            height: 600,
            color: 0xffffff
        }
    }
};

// Базовая конфигурация Phaser 3
const config = {
    type: Phaser.AUTO,
    width: gameConfig.game.width,
    height: gameConfig.game.height,
    parent: 'game-container',
    input: {
        keyboard: {
            target: window
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let platform;
let leftWall;
let rightWall;
let cursors;

// Функция preload - ничего не делаем
function preload() {
}

// Функция create
function create() {
    // 1. Создаем статичную платформу (прямоугольник) внизу экрана
    platform = this.add.rectangle(
        gameConfig.platform.x,
        gameConfig.platform.y,
        gameConfig.platform.width,
        gameConfig.platform.height,
        gameConfig.platform.color
    );
    this.physics.add.existing(platform, true); // true = статичное тело

    // Создаем левую стену (белая)
    leftWall = this.add.rectangle(
        gameConfig.walls.left.x,
        gameConfig.walls.left.y,
        gameConfig.walls.left.width,
        gameConfig.walls.left.height,
        gameConfig.walls.left.color
    );
    this.physics.add.existing(leftWall, true);

    // Создаем правую стену (белая)
    rightWall = this.add.rectangle(
        gameConfig.walls.right.x,
        gameConfig.walls.right.y,
        gameConfig.walls.right.width,
        gameConfig.walls.right.height,
        gameConfig.walls.right.color
    );
    this.physics.add.existing(rightWall, true);

    // 2. Создаем игрока (прямоугольник) в центре экрана
    player = this.add.rectangle(
        gameConfig.player.x,
        gameConfig.player.y,
        gameConfig.player.width,
        gameConfig.player.height,
        gameConfig.player.color
    );
    
    // 3. Включаем 'arcade' физику для игрока
    this.physics.add.existing(player);
    
    // 4. Устанавливаем гравитацию для игрока
    player.body.setGravityY(gameConfig.player.gravity);
    
    // 5. Делаем так, чтобы игрок сталкивался с платформой
    this.physics.add.collider(player, platform);
    
    // Добавляем коллайдеры для стен
    this.physics.add.collider(player, leftWall);
    this.physics.add.collider(player, rightWall);
    
    // 6. Создаем управление (cursors) с помощью клавиатуры
    cursors = this.input.keyboard.createCursorKeys();
}

// Функция update
function update() {
    // 1. Если нажата стрелка влево, устанавливаем velocity.x игрока
    if (cursors.left.isDown) {
        player.body.setVelocityX(-gameConfig.player.moveSpeed);
    }
    // 2. Если нажата стрелка вправо, устанавливаем velocity.x игрока
    else if (cursors.right.isDown) {
        player.body.setVelocityX(gameConfig.player.moveSpeed);
    }
    // 3. Если не нажаты ни влево, ни вправо, устанавливаем velocity.x игрока 0
    else {
        player.body.setVelocityX(0);
    }
    
    // 4. Если нажата стрелка вверх И игрок 'touching.down' (стоит на земле), устанавливаем velocity.y игрока
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-gameConfig.player.jumpSpeed);
    }
    // Прыжок от левой стены
    else if (cursors.up.isDown && player.body.touching.left) {
        player.body.setVelocityY(-gameConfig.player.wallJumpSpeed);
        player.body.setVelocityX(gameConfig.player.wallJumpHorizontal);
    }
    // Прыжок от правой стены
    else if (cursors.up.isDown && player.body.touching.right) {
        player.body.setVelocityY(-gameConfig.player.wallJumpSpeed);
        player.body.setVelocityX(-gameConfig.player.wallJumpHorizontal);
    }
}
