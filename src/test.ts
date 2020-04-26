import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;


// 测试嘴巴位置
export default function changeMouth(game: Phaser.Game) {
  let points = [{x:100, y:200}, {x:200, y:200}, {x:100, y:300}, {x:200, y:300}]

  let i = 1;

  let movingFnX = (val) => {
    points[0].x = points[0].x + val;
    points[1].x = points[1].x + val;
    points[2].x = points[2].x + val;
    points[3].x = points[3].x + val;
  }

  setInterval(() => {
    // movingFnX(1)
    window.postMessage(points, "*")

  }, 500);
}