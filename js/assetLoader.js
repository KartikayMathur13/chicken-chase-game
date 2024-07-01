// js/assetLoader.js
export class AssetLoader {
    constructor() {
        this.assets = {};
    }

    async loadAssets() {
        const imageNames = ['background', 'chicken', 'chicken_powered', 'enemy', 'magic-potion', 'health-potion', 'shield', 'ground'];
        const loadPromises = imageNames.map(name => this.loadImage(name));
        await Promise.all(loadPromises);
    }

    loadImage(name) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets[name] = img;
                resolve();
            };
            img.onerror = reject;
            img.src = `assets/${name}.png`;
        });
    }
}
