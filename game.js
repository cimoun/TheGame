// Базовая конфигурация Phaser 3 с размером 800x600
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
let cursors;

// Функция preload - ничего не делаем
function preload() {
}

// Функция create
function create() {
    // 1. Создаем статичную платформу (прямоугольник) внизу экрана
    platform = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    this.physics.add.existing(platform, true); // true = статичное тело

    // 2. Создаем игрока (прямоугольник) в центре экрана
    player = this.add.rectangle(400, 300, 32, 48, 0xff0000);
    
    // 3. Включаем 'arcade' физику для игрока
    this.physics.add.existing(player);
    
    // 4. Устанавливаем гравитацию для игрока (например, 300)
    player.body.setGravityY(300);
    
    // 5. Делаем так, чтобы игрок сталкивался с платформой
    this.physics.add.collider(player, platform);
    
    // 6. Создаем управление (cursors) с помощью клавиатуры
    cursors = this.input.keyboard.createCursorKeys();
}

// Функция update
function update() {
    // 1. Если нажата стрелка влево, устанавливаем velocity.x игрока -160
    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
    }
    // 2. Если нажата стрелка вправо, устанавливаем velocity.x игрока 160
    else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
    }
    // 3. Если не нажаты ни влево, ни вправо, устанавливаем velocity.x игрока 0
    else {
        player.body.setVelocityX(0);
    }
    
    // 4. Если нажата стрелка вверх И игрок 'touching.down' (стоит на земле), устанавливаем velocity.y игрока -330
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-330);
    }
}
