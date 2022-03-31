// setting gyroscope update frequency
gyro.frequency = 1000;
// start gyroscope detection
gyro.startTracking((o)=>{g=o.gamma*1;N = parseInt(g)})

var config = {
    type: Phaser.AUTO,
    scale:{mode: Phaser.Scale.ENVOLVED,},
    width: 800, height: 600,
    parent: 'container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics:{default:"arcade"}
};
var N;
var g;
var bg;
var alien;
var bullets;
var ship;
var speed;
var lastFired = 0;

var game = new Phaser.Game(config);

function preload (){
    this.load.image('ship','http://examples.phaser.io/assets/sprites/thrust_ship2.png');
    this.load.image('enemy','http://examples.phaser.io/assets/sprites/ufo.png');
    this.load.image('bullet','http://examples.phaser.io/assets/misc/bullet0.png');
    this.load.image('bg','https://phaser.io/images/bg-body4.jpg');
}
function create(){

bg=this.add.tileSprite(400,300,0,0,'bg').setScrollFactor(0).setDisplaySize(800,600);
    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene){
            Phaser.GameObjects.Image.call(this, scene, 0, -4, 'bullet');

            this.speed = Phaser.Math.GetSpeed(450, 1);
        },

        fire: function (x, y){
            this.setPosition(x, y - 10);

            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta){
            this.y -= this.speed * delta;
            
            if (this.y < -25){
                this.setActive(false);
                this.setVisible(false);
            }}

    });
    bullets = this.add.group({
        classType: Bullet,
        maxSize: 20,
        runChildUpdate: true
    });
    //  Create the objects in advance, so they're ready and waiting in the pool
bullets.createMultiple({ quantity: 20, active: false });

    ship = this.physics.add.sprite(400, 580,'ship').setDepth(1).setCollideWorldBounds(true);
   
    cursors = this.input.keyboard.createCursorKeys();   
    speed = Phaser.Math.GetSpeed(450,1);
    
    this.time.addEvent({ delay: 1000, callback: enemy, callbackScope: this, loop: true });

    function enemy(){
        var group = this.physics.add.group({
        key: 'enemy',
        frameQuantity: 8,
        gridAlign: {
        x: 25, y: 25,
        width: 1, height: 12,
        cellWidth: 50,cellHeight: 50
        },
        bounceX: 1,
        collideWorldBounds: true
    });
    group.setVelocityX(200, 10);}
}
function update (time,delta){ 
    bg.tilePositionY -= +5;
    
    if (cursors.left.isDown||N<-20){
        ship.x -= speed * delta;
    }
    else if (cursors.right.isDown||N>20){
        ship.x += speed * delta;
    }
    if(cursors.space.isDown&&time>lastFired||this.input.activePointer.isDown&&time>lastFired){
    
    var bullet = bullets.get();
    if (bullet){
    
    bullet.fire(ship.x, ship.y);
    lastFired = time + 50;
    }
    }else if(N >-20 && N<20){
    ship.setVelocityX(0);
    }}