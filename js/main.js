import { Game } from './game.js';
   import { AssetLoader } from './assetLoader.js';
   import { UIManager } from './uiManager.js';
   import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

   const canvas = document.getElementById('gameCanvas');
   const ctx = canvas.getContext('2d');

   canvas.width = CANVAS_WIDTH;
   canvas.height = CANVAS_HEIGHT;

   const assetLoader = new AssetLoader();
   const uiManager = new UIManager();
   const game = new Game(ctx, assetLoader, uiManager);

   async function init() {
       await assetLoader.loadAssets();
       uiManager.init();
       game.start();
   }

   init();
