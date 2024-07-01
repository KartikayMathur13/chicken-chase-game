// js/main.js
import { Game } from './game.js';
import { AssetLoader } from './assetLoader.js';
import { UIManager } from './uiManager.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const assetLoader = new AssetLoader();
const uiManager = new UIManager();
const game = new Game(canvas, ctx, assetLoader, uiManager);

async function init() {
    await assetLoader.loadAssets();
    uiManager.setupUI(game);
    game.start();
}

init();
