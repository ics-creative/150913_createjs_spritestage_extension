/// <reference path="../libs/Stats.d.ts" />
/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/ts-color-util.ts" />
module project{
    export class Main {
        static initializeContent():void {
            var isWebGLEnabled:boolean;
            try {
                isWebGLEnabled = !!WebGLRenderingContext && (!!document.createElement("canvas").getContext("webgl") || !!document.createElement("canvas").getContext("experimental-webgl"));
            } catch (e) {
                isWebGLEnabled = false;
            }
            if (isWebGLEnabled) {
                new Main();
            } else {
                alert("WebGLが動作する環境で閲覧して下さい");
            }
        }

        static CANVAS_WIDTH:number = 960;
        static CANVAS_HEIGHT:number = 540;

        stats:Stats;

        canvas:HTMLCanvasElement;
        context:WebGLRenderingContext;

        stage:createjs.SpriteStage;

        particleContainer:createjs.SpriteContainer;
        particleImage:HTMLImageElement;
        particleSpriteSheet:createjs.SpriteSheet;

        particleFilter:createjs.ColorFilter;
        hsv:ColorUtils.HSV;
        hue:number;

        particleMask:createjs.Shape;
        maskScaleTheta:number;

        particles:any[];

        constructor() {
            this.canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.stage = new createjs.SpriteStage(this.canvas);

            this.particleImage = new Image();
            this.particleImage.onload = () => this.handleLoaded();
            this.particleImage.src = "assets/particles.png";
        }

        handleLoaded():void
        {
            // SpriteSheet
            var data:any = {};
            data.images = [this.particleImage];
            data.frames = {width:128, height:128, regX:128, regY:128};
            this.particleSpriteSheet = new createjs.SpriteSheet(data);

            // Container
            this.particleContainer = new createjs.SpriteContainer(this.particleSpriteSheet);
            this.stage.addChild(this.particleContainer);

            // Blend
            this.particleContainer.compositeOperation = "lighter";

            // Color
            this.particleFilter = new createjs.ColorFilter(0.0, 0.0, 0.0, 1.0, 0, 0, 0, 0);
            this.particleContainer.filters = [this.particleFilter];
            this.hue = 0;
            this.hsv = new ColorUtils.HSV();
            this.hsv.hue = this.hue;
            this.hsv.saturation = 0.8;
            this.hsv.value = 0.8;

            // Mask
            //var particleMask:createjs.Shape = new createjs.Shape();
            //particleMask.graphics.beginFill("#000000");
            //particleMask.graphics.drawPolyStar(0, 0, 200, 5, 0.5, 0);
            //particleMask.graphics.endFill();
            //particleMask.setBounds(-200,-200, 400, 400);
            //particleMask.x = this.canvas.width / 2;
            //particleMask.y = this.canvas.height / 2;;
            //this.particleMask = particleMask;
            //
            //this.maskScaleTheta = 0.0;
            //this.particleContainer.mask = particleMask;

            this.particles = [];

            //Ticker
            createjs.Ticker.setFPS(60);
            createjs.Ticker.addEventListener("tick", () => this.tick());
            // Stats
            this.stats = new Stats();
            this.stats.setMode(1);
            document.getElementById("containerStats").appendChild(this.stats.domElement);
        }

        tick()
        {
            for (var n = 0; n < 40; n++) {
                this.emitParticle(this.stage.mouseX, this.stage.mouseY);
            }

            // Update particle
            var length:number = this.particles.length;
            for (var i:number = 0; i < length; i++) {
                var particle = this.particles[i];
                if (particle) {
                    //particle.sprite.alpha = Math.random();
                    particle.sprite.rotation += particle.rotSpeed;
                    particle.speed += particle.gravity;
                    particle.x += particle.speed * Math.cos(particle.rot);
                    particle.y += particle.speed * Math.sin(particle.rot);
                    particle.life -= 1;
                    if (particle.life > 0) {
                        particle.sprite.x = particle.x;
                        particle.sprite.y = particle.y;
                    } else {
                        this.particles[particle.id] = null;
                        this.particleContainer.removeChild(particle.sprite);
                        particle.sprite = null;
                        particle = null;
                    }
                }
            }

            // Color
            this.hue += 0.5;
            this.hue = this.hue % 360;
            this.hsv.hue = this.hue;
            this.hsv.saturation = 0.8;
            this.hsv.value = 0.8;
            var rgb:ColorUtils.RGB = ColorUtils.ColorHelper.hsvToRgb(this.hsv);
            this.particleFilter.redMultiplier = rgb.red;
            this.particleFilter.greenMultiplier = rgb.green;
            this.particleFilter.blueMultiplier = rgb.blue;

            // Mask
            //this.maskScaleTheta += 0.05;
            //this.particleMask.rotation += 1;
            //this.particleMask.scaleX = this.particleMask.scaleY = 2.5 + 2 * Math.sin(this.maskScaleTheta);

            // Update Stage
            this.stage.update();
            this.stats.update();
        }

        private emitParticle(posX:number, posY:number):void {
            var sprite:createjs.Sprite = new createjs.Sprite(this.particleSpriteSheet, Math.random() * 3 >> 0);
            sprite.stop();
            sprite.scaleX = sprite.scaleY = 0.2 + Math.random() * 0.3;
            sprite.rotation = Math.random() * 360;
            sprite.alpha = 0.8;

            var particle:any = {id: 0, sprite: null, x: 0, y: 0, rot:0, speed: 0, gravity: 0, rotSpeed:0, life:100};
            particle.sprite = sprite;
            particle.x = posX;
            particle.y = posY;
            particle.rot = Math.random() * 2 * Math.PI;
            particle.rotSpeed = (Math.random() - 0.5) * 10;
            particle.speed = 10;
            //particle.gravity = 0.05 + Math.random() * 0.02;
            this.particles.push(particle);
            particle.id = this.particles.length - 1;

            particle.sprite.x = particle.x;
            particle.sprite.y = particle.y;

            this.particleContainer.addChild(sprite);
        }
    }
}
window.addEventListener("load", ()=> {
    project.Main.initializeContent();
});
