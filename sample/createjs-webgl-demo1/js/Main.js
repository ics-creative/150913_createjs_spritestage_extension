/*
 * Name: TypeScript Color Utilities
 * Author: Donald Jones (pwdonald)
 * Date: June 8, 2014
 *
 * Contains useful code for dealing with colors in hex/rgb/hsv representations.
 */
var ColorUtils;
(function (ColorUtils) {
    /*
     * Object representation of RGB (red/green/blue) values for a color.
     */
    var RGB = (function () {
        function RGB() {
        }
        return RGB;
    })();
    ColorUtils.RGB = RGB;
    /*
     * Object representation of HSV (hue/saturation/value) values for a color.
     */
    var HSV = (function () {
        function HSV() {
        }
        return HSV;
    })();
    ColorUtils.HSV = HSV;
    /*
     * Contains methods to manipulate colors both in RGB and HSV form.
     */
    var ColorHelper = (function () {
        function ColorHelper() {
        }
        /*
         * Returns a HSV value given a RGB value.
         *
         * @param rgb Object containing red, green, blue values.
         */
        ColorHelper.rgbToHsv = function (rgb) {
            var hsv = new HSV();
            var min = Math.min(rgb.red, rgb.green, rgb.blue);
            var max = Math.max(rgb.red, rgb.green, rgb.blue);
            hsv.value = max;
            var delta = max - min;
            if (max != 0) {
                hsv.saturation = delta / max;
            }
            else {
                // r = g = b = 0
                hsv.saturation = 0;
                hsv.hue = -1;
                return hsv;
            }
            if (rgb.red === max) {
                // between yellow & magenta
                hsv.hue = (rgb.green - rgb.blue) / delta;
            }
            else if (rgb.green === max) {
                // between cyan & yellow
                hsv.hue = 2 + (rgb.blue - rgb.red) / delta;
            }
            else {
                // between magenta & cyan
                hsv.hue = 4 + (rgb.red - rgb.green) / delta;
            }
            // degrees
            hsv.hue *= 60;
            if (hsv.hue < 0) {
                hsv.hue += 360;
            }
            return hsv;
        };
        /*
         * Returns a RGB value give a HSV value.
         *
         * @param hsv Object containing hue, saturation, value.
         */
        ColorHelper.hsvToRgb = function (hsv) {
            var i, f, p, q, t;
            var rgb = new RGB();
            if (hsv.saturation === 0) {
                // schromatic (grey)
                rgb.red = rgb.green = rgb.blue = hsv.value;
                return rgb;
            }
            hsv.hue /= 60;
            i = Math.floor(hsv.hue);
            // factorial part of h
            f = hsv.hue - i;
            p = hsv.value * (1 - hsv.saturation);
            q = hsv.value * (1 - hsv.saturation * f);
            t = hsv.value * (1 - hsv.saturation * (1 - f));
            switch (i) {
                case 0:
                    {
                        rgb.red = hsv.value;
                        rgb.green = t;
                        rgb.blue = p;
                        break;
                    }
                case 1:
                    {
                        rgb.red = q;
                        rgb.green = hsv.value;
                        rgb.blue = p;
                        break;
                    }
                case 2:
                    {
                        rgb.red = p;
                        rgb.green = hsv.value;
                        rgb.blue = t;
                        break;
                    }
                case 3:
                    {
                        rgb.red = p;
                        rgb.green = q;
                        rgb.blue = hsv.value;
                        break;
                    }
                case 4:
                    {
                        rgb.red = t;
                        rgb.green = p;
                        rgb.blue = hsv.value;
                        break;
                    }
                default:
                    {
                        rgb.red = hsv.value;
                        rgb.green = p;
                        rgb.blue = q;
                        break;
                    }
            }
            return rgb;
        };
        /*
         * Returns the hexadecimal representation of a RGB valu.e
         *
         * @param rgb Object containing red, green, blue values of a color.
         */
        ColorHelper.rgbToHex = function (rgb) {
            // source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
            return "#" + ((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1);
        };
        /*
         * Returns the RGB representation given a hexadecimal number.
         *
         * @param hex String containing a valid hexadecimal color.
         */
        ColorHelper.hexToRgb = function (hex) {
            // source: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
            // Expand shorthand form (e.g."03F") to full form (e.g."0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return {
                red: parseInt(result[1], 16),
                green: parseInt(result[2], 16),
                blue: parseInt(result[3], 16)
            };
        };
        /*
         * Returns true if the colors match within the tolerance range.
         *
         * @param color RGB representation of a color to compare with the target.
         * @param targetcolor RGB representation of the target color for comparison.
         * @param tolerance Allowed difference between the color and targetcolor to consider a match.
         */
        ColorHelper.colorMatch = function (color, targetcolor, tolerance) {
            // calculate the eucledian distance between the two colors
            var distance;
            var r1 = Math.max(color.red, targetcolor.red) - Math.min(color.red, targetcolor.red) ^ 2;
            var g1 = Math.max(color.green, targetcolor.green) - Math.min(color.green, targetcolor.green) ^ 2;
            var b1 = Math.max(color.blue, targetcolor.blue) - Math.min(color.blue, targetcolor.blue) ^ 2;
            distance = Math.sqrt(r1 + g1 + b1);
            return (distance < tolerance) ? true : false;
        };
        return ColorHelper;
    })();
    ColorUtils.ColorHelper = ColorHelper;
})(ColorUtils || (ColorUtils = {}));
/// <reference path="../libs/Stats.d.ts" />
/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/ts-color-util.ts" />
var project;
(function (project) {
    var Main = (function () {
        function Main() {
            var _this = this;
            this.canvas = document.getElementById("myCanvas");
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.stage = new createjs.SpriteStage(this.canvas);
            this.particleImage = new Image();
            this.particleImage.onload = function () { return _this.handleLoaded(); };
            this.particleImage.src = "assets/particles.png";
        }
        Main.initializeContent = function () {
            var isWebGLEnabled;
            try {
                isWebGLEnabled = !!WebGLRenderingContext && (!!document.createElement("canvas").getContext("webgl") || !!document.createElement("canvas").getContext("experimental-webgl"));
            }
            catch (e) {
                isWebGLEnabled = false;
            }
            if (isWebGLEnabled) {
                new Main();
            }
            else {
                alert("WebGLが動作する環境で閲覧して下さい");
            }
        };
        Main.prototype.handleLoaded = function () {
            var _this = this;
            // SpriteSheet
            var data = {};
            data.images = [this.particleImage];
            data.frames = { width: 128, height: 128, regX: 128, regY: 128 };
            this.particleSpriteSheet = new createjs.SpriteSheet(data);
            // Container
            this.particleContainer = new createjs.SpriteContainer(this.particleSpriteSheet);
            this.stage.addChild(this.particleContainer);
            // Blend
            //this.particleContainer.compositeOperation = "lighter";
            // Color
            //this.particleFilter = new createjs.ColorFilter(0.0, 0.0, 0.0, 1.0, 0, 0, 0, 0);
            //this.particleContainer.filters = [this.particleFilter];
            //this.hue = 0;
            //this.hsv = new ColorUtils.HSV();
            //this.hsv.hue = this.hue;
            //this.hsv.saturation = 0.8;
            //this.hsv.value = 0.8;
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
            createjs.Ticker.addEventListener("tick", function () { return _this.tick(); });
            // Stats
            this.stats = new Stats();
            this.stats.setMode(1);
            document.getElementById("containerStats").appendChild(this.stats.domElement);
        };
        Main.prototype.tick = function () {
            for (var n = 0; n < 40; n++) {
                this.emitParticle(this.stage.mouseX, this.stage.mouseY);
            }
            // Update particle
            var length = this.particles.length;
            for (var i = 0; i < length; i++) {
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
                    }
                    else {
                        this.particles[particle.id] = null;
                        this.particleContainer.removeChild(particle.sprite);
                        particle.sprite = null;
                        particle = null;
                    }
                }
            }
            // Color
            //this.hue += 0.5;
            //this.hue = this.hue % 360;
            //this.hsv.hue = this.hue;
            //this.hsv.saturation = 0.8;
            //this.hsv.value = 0.8;
            //var rgb:ColorUtils.RGB = ColorUtils.ColorHelper.hsvToRgb(this.hsv);
            //this.particleFilter.redMultiplier = rgb.red;
            //this.particleFilter.greenMultiplier = rgb.green;
            //this.particleFilter.blueMultiplier = rgb.blue;
            // Mask
            //this.maskScaleTheta += 0.05;
            //this.particleMask.rotation += 1;
            //this.particleMask.scaleX = this.particleMask.scaleY = 2.5 + 2 * Math.sin(this.maskScaleTheta);
            // Update Stage
            this.stage.update();
            this.stats.update();
        };
        Main.prototype.emitParticle = function (posX, posY) {
            var sprite = new createjs.Sprite(this.particleSpriteSheet, Math.random() * 3 >> 0);
            sprite.stop();
            sprite.scaleX = sprite.scaleY = 0.2 + Math.random() * 0.3;
            sprite.rotation = Math.random() * 360;
            sprite.alpha = 0.8;
            var particle = { id: 0, sprite: null, x: 0, y: 0, rot: 0, speed: 0, gravity: 0, rotSpeed: 0, life: 100 };
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
        };
        Main.CANVAS_WIDTH = 960;
        Main.CANVAS_HEIGHT = 540;
        return Main;
    })();
    project.Main = Main;
})(project || (project = {}));
window.addEventListener("load", function () {
    project.Main.initializeContent();
});
//# sourceMappingURL=Main.js.map