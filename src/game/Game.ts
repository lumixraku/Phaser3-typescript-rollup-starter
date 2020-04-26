import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;

import Food from '@game/food'

const distanceAngle = 60
const tableSize = 360 / distanceAngle;

const angle2Rad = (angle: number) => {
    return (Math.PI / 180 ) * angle
}
export default class Demo extends Phaser.Scene {
    public spSpin: Sprite;
    public circle: Circle;
    public point: Point;
    public light: Image;


    public foodList: Food[] = [...Array(tableSize)].map(_ => null);
    public mouth: Rectagle = new Rectagle(0, 0, 0, 0);
    private mouthColor: Graphics;


    // 旋转圆心
    public circleCenter: Phaser.Geom.Point;
    constructor() {
        super('demo');
    }

    preload() {

        // yarn run dev 的时候 这个资源也还是从 dist 中读取的
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('light', 'assets/light.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {
        this.circleCenter = new Point(300, 300)
        // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);




        // this.tweens.add({
        //     targets: logo,
        //     y: 350,
        //     duration: 1500,
        //     ease: 'Sine.inOut',
        //     yoyo: true,
        //     repeat: -1
        // })


        this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, 200);

        this.spSpin = this.add.sprite(this.circleCenter.x, this.circleCenter.y, 'logo');

        // this.light = this.add.image(0, 0, 'light');
        // this.point = new Phaser.Geom.Point(this.light.x, this.light.y)
        this.refreshMouth([])
        this.messageListener()
    }


    private frameCounter = 0
    update(time, delta) {

        this.rotateTable()
        this.movingFoodOnTable()
        this.checkIfCouldEat()

        // Phaser.Geom.Circle.CircumferencePoint(this.circle, this.spSpin.rotation,  this.point);
        // this.light.x = this.point.x
        // this.light.y = this.point.y

        this.frameCounter += 1

        if (this.frameCounter >= 60) {
            this.frameCounter = 0
            this.update60Frame()
        }

    }

    update60Frame() {

    }

    rotateTable() {
        // 右手顺时针
        this.spSpin.angle += 0.4;
        // rotate 是使用的弧度
        this.addFoodIfNeed()

    }


    addCounter = 0
    addFoodIfNeed() {
        for(let i =0; i < this.foodList.length; i++) {
            // i = 0 angle 0
            // i = 1 angle 60
            // 盘子是空的, 且恰好转到合适的位置. 就添加食物
            if (!this.foodList[i]) {
                let mathAngle = this.spSpin.angle < 0 ? 360 + this.spSpin.angle : this.spSpin.angle

                if ( Math.abs(mathAngle - i *  distanceAngle)  < 1) {

                    let food = this.add.image(0, 0, 'light') as Food
                    food.name = `Food${i}`
                    this.foodList[i] = food
                    console.log("angle add", this.spSpin.angle, food.name)
                    // this.foodList.push(food)
                }
            }
        }
    }

    movingFoodOnTable() {

        for (let i = 0; i < this.foodList.length; i++) {
            let food = this.foodList[i];
            if (!food) {
                continue
            }

            let point = new Phaser.Geom.Point(0, 0)

            let angle = this.spSpin.angle + distanceAngle *  (tableSize  - i)



            Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle) , point);

            food.x = point.x
            food.y = point.y
        }



    }


    refreshMouth(points: Point[]) {
        let xVals = points.map(p => {
            return p.x
        })
        let yVals = points.map(p => {
            return p.y
        })

        let minX = Math.min(...xVals)
        let maxX = Math.max(...xVals)
        let minY = Math.min(...yVals)
        let maxY = Math.max(...yVals)

        this.mouth.setPosition(minX, minY);
        this.mouth.setSize(maxX - minX, maxY - minY)
        if (!this.mouthColor) {
            this.mouthColor = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        }
        this.mouthColor.clear()
        this.mouthColor.fillStyle(0x0000ff)
        this.mouthColor.fillRectShape(this.mouth)

    }

    messageListener() {
        window.addEventListener("message", (event) => {

            this.refreshMouth(event.data)
        }, false)
    }

    checkIfCouldEat() {
        let mouthCenterX = this.mouth.x + this.mouth.width / 2;
        let mouthCenterY = this.mouth.y + this.mouth.width / 2;

        let destPos = new Point(mouthCenterX, mouthCenterY)
        for (let i = 0; i < this.foodList.length; i++) {


            let food = this.foodList[i]
            if (!food) {
                continue
            }

            if (food.eating) {
                continue
            }

            let foodx = food.x
            let foody = food.y

            if (
                (this.mouth.x < foodx && foodx < this.mouth.x + this.mouth.width) &&
                (this.mouth.y < food.y && foody < this.mouth.y + this.mouth.height) &&
                !food.eating
            ) {
                // this.foodList.splice(i--, 1)
                this.foodList[i] = null
                this.eatingAnimation(food, destPos)
                break
            }
        }
    }

    eatingAnimation(food: Food, dest: Point) {
        food.eating = true
        var tween = this.tweens.add({
            targets: food,
            x: dest.x,
            y: dest.y,
            duration: 400,
            ease: 'Power3',
            onComplete: () => {
                food.destroy()
            }
        })
    }

}
