// js/game.js
import { Chicken, Enemy, PowerUp } from './entities.js';
import { RARITY } from './constants.js';

export class Game {
    constructor(canvas, ctx, assetLoader, uiManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assets = assetLoader.assets;
        this.ui = uiManager;
        this.resetGameState();
    }

    resetGameState() {
        this.state = {
            distance: 0,
            paused: false,
            gameOver: false,
            chicken: new Chicken(this),
            enemy: new Enemy(this),
            powerUps: {
                magicPotion: new PowerUp(this, 'magic-potion', RARITY.UNCOMMON),
                healthPotion: new PowerUp(this, 'health-potion', RARITY.RARE),
                shield: new PowerUp(this, 'shield', RARITY.RARE)
            },
            ground: { y: 0, height: 100, speed: 5 },
            backgroundX: 0,
            groundX: 0,
            scale: 1
        };
    }

    start() {
        this.resize();
        this.gameLoop();
    }

    gameLoop() {
        if (!this.state.paused && !this.state.gameOver) {
            this.update();
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.state.distance += this.state.ground.speed / 100;
        this.updateGameSpeed();
        this.state.chicken.update();
        this.state.enemy.update();
        this.updatePowerUps();
        this.checkCollisions();
        this.ui.update(this.state);
    }

    updateGameSpeed() {
        const baseSpeed = 5;
        const maxSpeedIncrease = 10;
        const speedIncreaseRate = 0.0001;
        
        const speedIncrease = Math.min(this.state.distance * speedIncreaseRate, maxSpeedIncrease);
        const currentSpeed = baseSpeed + speedIncrease;
        
        this.state.ground.speed = currentSpeed * this.state.scale;
    }

    updatePowerUps() {
        Object.values(this.state.powerUps).forEach(powerUp => {
            powerUp.update();
            if (powerUp.x < -powerUp.width) {
                powerUp.spawn();
            }
        });
    }

    checkCollisions() {
        Object.values(this.state.powerUps).forEach(powerUp => {
            if (this.state.chicken.collidesWith(powerUp)) {
                powerUp.apply(this.state.chicken);
                powerUp.spawn();
            }
        });

        if (this.state.chicken.collidesWith(this.state.enemy)) {
            this.state.chicken.damage();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawGround();
        this.state.enemy.draw(this.ctx);
        this.state.chicken.draw(this.ctx);
        Object.values(this.state.powerUps).forEach(powerUp => powerUp.draw(this.ctx));
    }

    drawBackground() {
        const img = this.assets.background;
        const scale = this.canvas.height / img.height;
        const scaledWidth = img.width * scale;
        
        this.ctx.drawImage(img, this.state.backgroundX, 0, scaledWidth, this.canvas.height);
        this.ctx.drawImage(img, this.state.backgroundX + scaledWidth, 0, scaledWidth, this.canvas.height);
        
        this.state.backgroundX -= 0.5 * this.state.scale;
        if (this.state.backgroundX <= -scaledWidth) {
            this.state.backgroundX = 0;
        }
    }

    drawGround() {
        const img = this.assets.ground;
        const scale = this.state.ground.height / img.height;
        const scaledWidth = img.width * scale;
        
        this.ctx.drawImage(img, this.state.groundX, this.state.ground.y, scaledWidth, this.state.ground.height);
        this.ctx.drawImage(img, this.state.groundX + scaledWidth, this.state.ground.y, scaledWidth, this.state.ground.height);
        
        this.state.groundX -= this.state.ground.speed;
        if (this.state.groundX <= -scaledWidth) {
            this.state.groundX = 0;
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.state.scale = this.canvas.width / 1080;
        this.state.ground.y = this.canvas.height - this.state.ground.height;
        this.state.chicken.resize();
        this.state.enemy.resize();
        Object.values(this.state.powerUps).forEach(powerUp => powerUp.resize());
    }

    jump() {
        this.state.chicken.jump();
    }

    togglePause() {
        this.state.paused = !this.state.paused;
    }
}
