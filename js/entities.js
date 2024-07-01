// js/entities.js
import { collision } from './utils.js';

export class Chicken {
    constructor(game) {
        this.game = game;
        this.width = 80;
        this.height = 80;
        this.x = game.canvas.width * 0.2;
        this.y = game.state.ground.y - this.height;
        this.speed = 5;
        this.jumping = false;
        this.yVelocity = 0;
        this.poweredUp = false;
        this.powerUpCount = 0;
        this.health = 3;
    }

    update() {
        if (this.jumping) {
            this.yVelocity += 0.5 * this.game.state.scale;
            this.y += this.yVelocity;
            if (this.y > this.game.state.ground.y - this.height) {
                this.y = this.game.state.ground.y - this.height;
                this.jumping = false;
                this.yVelocity = 0;
            }
        }
    }

    draw(ctx) {
        const image = this.poweredUp ? this.game.assets.chicken_powered : this.game.assets.chicken;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            this.yVelocity = -15 * this.game.state.scale;
        }
    }

    damage() {
        this.health--;
        if (this.health <= 0) {
            this.game.state.gameOver = true;
        }
    }

    collidesWith(other) {
        return collision(this, other);
    }

    resize() {
        this.width = 80 * this.game.state.scale;
        this.height = 80 * this.game.state.scale;
        this.y = this.game.state.ground.y - this.height;
    }
}

export class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = game.canvas.width * 0.8;
        this.y = game.state.ground.y - this.height;
    }

    update() {
        const targetX = this.game.canvas.width * 0.6;
        this.x += (targetX - this.x) * 0.05;
    }

    draw(ctx) {
        ctx.drawImage(this.game.assets.enemy, this.x, this.y, this.width, this.height);
    }

    resize() {
        this.width = 100 * this.game.state.scale;
        this.height = 100 * this.game.state.scale;
        this.y = this.game.state.ground.y - this.height;
    }
}

export class PowerUp {
    constructor(game, type, rarity) {
        this.game = game;
        this.type = type;
        this.rarity = rarity;
        this.width = 60;
        this.height = 60;
        this.spawn();
    }

    update() {
        this.x -= this.game.state.ground.speed;
    }

    draw(ctx) {
        ctx.drawImage(this.game.assets[this.type], this.x, this.y, this.width, this.height);
    }

    spawn() {
        if (Math.random() < this.rarity) {
            this.x = this.game.canvas.width;
            this.y = this.game.state.ground.y - this.height - Math.random() * 100 * this.game.state.scale;
        } else {
            this.x = this.game.canvas.width * 2; // Move off-screen if not spawning
        }
    }

    apply(chicken) {
        switch(this.type) {
            case 'magic-potion':
                chicken.poweredUp = true;
                chicken.powerUpCount++;
                break;
            case 'health-potion':
                chicken.health = Math.min(chicken.health + 1, 3);
                break;
            case 'shield':
                // Implement shield logic
                break;
        }
    }

    resize() {
        this.width = 60 * this.game.state.scale;
        this.height = 60 * this.game.state.scale;
    }
}
