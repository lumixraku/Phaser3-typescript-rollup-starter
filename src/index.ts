import 'phaser';

import GameScene from 'game/game'


console.log('.................')
const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;



const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: GameScene,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};
console.log("...............")
const game = new Phaser.Game(config);

