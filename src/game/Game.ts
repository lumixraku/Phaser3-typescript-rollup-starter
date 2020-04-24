// import 'phaser';

import * as Phaser from 'phaser';


const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;



function preload() {
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create() {
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);

}

class A {
    haha: number
    constructor(){
        console.log("A", this.haha)
    }
}
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    },
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};        


class Game {

    constructor() {
        new Phaser.Game(config)
        

    }
}

export default Game;