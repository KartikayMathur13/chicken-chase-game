// js/uiManager.js
export class UIManager {
    constructor() {
        this.distanceMeter = document.getElementById('distanceMeter');
        this.healthBar = document.getElementById('healthBar');
        this.powerUpIndicators = document.getElementById('powerUpIndicators');
        this.pauseButton = document.getElementById('pauseButton');
    }

    setupUI(game) {
        this.pauseButton.addEventListener('click', () => game.togglePause());
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') game.jump();
        });
        game.canvas.addEventListener('click', () => game.jump());
    }

    update(gameState) {
        this.distanceMeter.textContent = `Distance: ${Math.floor(gameState.distance)}m`;
        this.updateHealthBar(gameState.chicken.health);
        this.updatePowerUpIndicators(gameState.chicken.powerUpCount);
    }

    updateHealthBar(health) {
        this.healthBar.innerHTML = '❤️'.repeat(health);
    }

    updatePowerUpIndicators(count) {
        this.powerUpIndicators.innerHTML = '⚡'.repeat(count);
    }
}
