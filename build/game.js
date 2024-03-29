(function () {
    'use strict';

    var global = window;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var Point = Phaser.Geom.Point;
    var Rectagle = Phaser.Geom.Rectangle;
    var distanceAngle = 60;
    var tableSize = 360 / distanceAngle;
    var angle2Rad = function (angle) {
        return (Math.PI / 180) * angle;
    };
    var Demo = /** @class */ (function (_super) {
        __extends(Demo, _super);
        function Demo() {
            var _this = _super.call(this, 'demo') || this;
            _this.foodList = __spreadArrays(Array(tableSize)).map(function (_) { return null; });
            _this.mouth = new Rectagle(0, 0, 0, 0);
            _this.frameCounter = 0;
            _this.addCounter = 0;
            return _this;
        }
        Demo.prototype.preload = function () {
            // yarn run dev 的时候 这个资源也还是从 dist 中读取的
            this.load.image('logo', 'assets/phaser3-logo.png');
            this.load.image('light', 'assets/light.png');
            this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
            this.load.glsl('stars', 'assets/starfields.glsl.js');
        };
        Demo.prototype.create = function () {
            this.circleCenter = new Point(300, 300);
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
            this.refreshMouth([]);
            this.messageListener();
        };
        Demo.prototype.update = function (time, delta) {
            this.rotateTable();
            this.movingFoodOnTable();
            this.checkIfCouldEat();
            // Phaser.Geom.Circle.CircumferencePoint(this.circle, this.spSpin.rotation,  this.point);
            // this.light.x = this.point.x
            // this.light.y = this.point.y
            this.frameCounter += 1;
            if (this.frameCounter >= 60) {
                this.frameCounter = 0;
                this.update60Frame();
            }
        };
        Demo.prototype.update60Frame = function () {
        };
        Demo.prototype.rotateTable = function () {
            // 右手顺时针
            this.spSpin.angle += 0.4;
            // rotate 是使用的弧度
            this.addFoodIfNeed();
        };
        Demo.prototype.addFoodIfNeed = function () {
            for (var i = 0; i < this.foodList.length; i++) {
                // i = 0 angle 0
                // i = 1 angle 60
                // 盘子是空的, 且恰好转到合适的位置. 就添加食物
                if (!this.foodList[i]) {
                    var mathAngle = this.spSpin.angle < 0 ? 360 + this.spSpin.angle : this.spSpin.angle;
                    if (Math.abs(mathAngle - i * distanceAngle) < 1) {
                        var food = this.add.image(0, 0, 'light');
                        food.name = "Food" + i;
                        this.foodList[i] = food;
                        console.log("angle add", this.spSpin.angle, food.name);
                        // this.foodList.push(food)
                    }
                }
            }
        };
        Demo.prototype.movingFoodOnTable = function () {
            for (var i = 0; i < this.foodList.length; i++) {
                var food = this.foodList[i];
                if (!food) {
                    continue;
                }
                var point = new Phaser.Geom.Point(0, 0);
                var angle = this.spSpin.angle + distanceAngle * (tableSize - i);
                Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle), point);
                food.x = point.x;
                food.y = point.y;
            }
        };
        Demo.prototype.refreshMouth = function (points) {
            var xVals = points.map(function (p) {
                return p.x;
            });
            var yVals = points.map(function (p) {
                return p.y;
            });
            var minX = Math.min.apply(Math, xVals);
            var maxX = Math.max.apply(Math, xVals);
            var minY = Math.min.apply(Math, yVals);
            var maxY = Math.max.apply(Math, yVals);
            this.mouth.setPosition(minX, minY);
            this.mouth.setSize(maxX - minX, maxY - minY);
            if (!this.mouthColor) {
                this.mouthColor = this.add.graphics({ fillStyle: { color: 0x0000ff } });
            }
            this.mouthColor.clear();
            this.mouthColor.fillStyle(0x0000ff);
            this.mouthColor.fillRectShape(this.mouth);
        };
        Demo.prototype.messageListener = function () {
            var _this = this;
            window.addEventListener("message", function (event) {
                _this.refreshMouth(event.data);
            }, false);
        };
        Demo.prototype.checkIfCouldEat = function () {
            var mouthCenterX = this.mouth.x + this.mouth.width / 2;
            var mouthCenterY = this.mouth.y + this.mouth.width / 2;
            var destPos = new Point(mouthCenterX, mouthCenterY);
            for (var i = 0; i < this.foodList.length; i++) {
                var food = this.foodList[i];
                if (!food) {
                    continue;
                }
                if (food.eating) {
                    continue;
                }
                var foodx = food.x;
                var foody = food.y;
                if ((this.mouth.x < foodx && foodx < this.mouth.x + this.mouth.width) &&
                    (this.mouth.y < food.y && foody < this.mouth.y + this.mouth.height) &&
                    !food.eating) {
                    // this.foodList.splice(i--, 1)
                    this.foodList[i] = null;
                    this.eatingAnimation(food, destPos);
                    break;
                }
            }
        };
        Demo.prototype.eatingAnimation = function (food, dest) {
            food.eating = true;
            var tween = this.tweens.add({
                targets: food,
                x: dest.x,
                y: dest.y,
                duration: 400,
                ease: 'Power3',
                onComplete: function () {
                    food.destroy();
                }
            });
        };
        return Demo;
    }(Phaser.Scene));

    // 测试嘴巴位置
    function changeMouth(game) {
        var points = [{ x: 100, y: 200 }, { x: 200, y: 200 }, { x: 100, y: 300 }, { x: 200, y: 300 }];
        var movingFnX = function (val) {
            points[0].x = points[0].x + val;
            points[1].x = points[1].x + val;
            points[2].x = points[2].x + val;
            points[3].x = points[3].x + val;
        };
        setInterval(function () {
            movingFnX(1);
            window.postMessage(points, "*");
        }, 100);
    }

    console.log(Phaser.AUTO);
    console.log(Phaser.AUTO);
    console.log('.................');
    var stageWidth = document.body.clientWidth;
    var stageHeight = document.body.clientHeight;
    var config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        scene: Demo,
        transparent: true,
        physics: {
            "default": 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
    };
    console.log("...............");
    var game = new Phaser.Game(config);
    changeMouth();

}());
//# sourceMappingURL=game.js.map
