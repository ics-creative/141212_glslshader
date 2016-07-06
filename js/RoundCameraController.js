/**
* Cameraクラスインスタンスをマウス、タッチ入力で制御するクラスです。
* ※threeJS用に調整
* @auther Kentaro Kawakatsu
* @author Nozomi Nohara
*/
var RoundCameraController = (function () {
    function RoundCameraController(camera, stage) {
        //parameter
        this.radiusMin = 80.0;
        this.radiusMax = 1000.0;
 //       this.radiusOffset = 0.1;
        this.radiusOffset = 20.0;
        this.gestureRadiusFactor = 20;
        //camera
        this.radius = 2;
        this._theta = 0;
        this._oldX = 0;
        this._phi = 90;
        this._oldY = 0;
        this.targetTheta = 0;
        this.targetPhi = 90;
        this._camera = camera;
        this._stage = stage;
        this._target = new Float32Array([0, 0, 0]);
        this.enable();
        this._upDateCamera();
    }

    RoundCameraController.prototype.enable = function () {
        var _this = this;
        document.addEventListener("keydown", function (event) {
            _this._keyHandler(event);
        });
        document.addEventListener("mouseup", function (event) {
            _this._upHandler(event);
        });
        this._stage.addEventListener("mousedown", function (event) {
            _this._downHandler(event);
        });
        this._stage.addEventListener("mousemove", function (event) {
            _this._moveHandler(event);
        });
        this._stage.addEventListener("mousewheel", function (event) {
            _this._wheelHandler(event);
        });

        //touch
        if ("ontouchstart" in window) {
            this._stage.addEventListener("touchstart", function (event) {
                _this._touchStartHandler(event);
            });
            this._stage.addEventListener("touchmove", function (event) {
                _this._touchMoveHandler(event);
            });
            document.addEventListener("touchend", function (event) {
                _this._touchEndHandler(event);
            });
        }
        if ("ongesturestart" in window) {
            this._stage.addEventListener("gesturestart", function (event) {
                _this._gestureStartHandler(event);
            });
            this._stage.addEventListener("gesturechange", function (event) {
                _this._gestureChangeHandler(event);
            });
            document.addEventListener("gestureend", function (event) {
                _this._gestureEndHandler(event);
            });
        }
    };

    //
    RoundCameraController.prototype._keyHandler = function (e) {
        switch (e.keyCode) {
            case 38:
                this.radius -= this.radiusOffset;
                this._adjustToRange();
        
                this._upDateCamera();
                break;
            case 40:
                this.radius += this.radiusOffset;
                this._adjustToRange();
        
                this._upDateCamera();
                break;
            default:
                break;
        }
    };

    RoundCameraController.prototype._upHandler = function (e) {
        this.isMouseDown = false;
    };

    RoundCameraController.prototype._downHandler = function (e) {
        this.isMouseDown = true;
        var rect = e.target.getBoundingClientRect();
        this._oldX = e.clientX - rect.left;
        this._oldY = e.clientY - rect.top;
    };

    RoundCameraController.prototype._wheelHandler = function (e) {
        if (e.wheelDelta > 0) {
            this.radius -= this.radiusOffset;
            this._adjustToRange();
        } else {
            this.radius += this.radiusOffset;
            this._adjustToRange();
        
        }
        this._upDateCamera();
    };

    RoundCameraController.prototype._moveHandler = function (e) {
        if (this.isMouseDown) {
            var rect = e.target.getBoundingClientRect();
            var stageX = e.clientX - rect.left;
            var stageY = e.clientY - rect.top;

            this.inputXY(stageX, stageY);
        }
    };

    RoundCameraController.prototype._touchStartHandler = function (e) {
        e.preventDefault();
        if (!this.isMouseDown) {
            var touches = e.changedTouches;
            var touch = touches[0];
            this.isMouseDown = true;
            this._identifier = touch.identifier;
            var target = touch.target;
            this._oldX = touch.pageX - target.offsetLeft;
            this._oldY = touch.pageY - target.offsetTop;
        }
    };

    RoundCameraController.prototype._touchMoveHandler = function (e) {
        e.preventDefault();
        if (this._isGestureChange) {
            return;
        }
        var touches = e.changedTouches;
        var touchLength = touches.length;
        for (var i = 0; i < touchLength; i++) {
            var touch = touches[i];
            if (touch.identifier == this._identifier) {
                var target = touch.target;
                var stageX = touch.pageX - target.offsetLeft;
                var stageY = touch.pageY - target.offsetTop;
                this.inputXY(stageX, stageY);
                break;
            }
        }
    };

    RoundCameraController.prototype._touchEndHandler = function (e) {
        e.preventDefault();
        this.isMouseDown = false;
    };

    RoundCameraController.prototype._gestureStartHandler = function (e) {
        this._isGestureChange = true;
        this.isMouseDown = true;
        this._oldRadius = this.radius;
    };
    RoundCameraController.prototype._adjustToRange = function () {
        if (this.radius < this.radiusMin) {
            this.radius = this.radiusMin;
        }
        if (this.radius > this.radiusMax) {
            this.radius = this.radiusMax;
        }
    }

    RoundCameraController.prototype._gestureChangeHandler = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.radius = this._oldRadius + this.gestureRadiusFactor * this.radiusOffset * (1 - e.scale);
        this._adjustToRange();

        this._upDateCamera();
    };

    RoundCameraController.prototype._gestureEndHandler = function (e) {
        this._isGestureChange = false;
        this.isMouseDown = false;
        this._identifier = -1;
    };

    RoundCameraController.prototype.inputXY = function (newX, newY) {
        this._theta -= (newX - this._oldX) * 0.3;
        this._oldX = newX;
        this._phi -= (newY - this._oldY) * 0.3;
        this._oldY = newY;

        //
        if (this._phi < 20) {
            this._phi = 20;
        } else if (this._phi > 160) {
            this._phi = 160;
        }
        this._upDateCamera();
    };

    RoundCameraController.prototype._upDateCamera = function () {
        //			var t:number = this._theta * RoundCameraController.RAD;
        //			var p:number = this._phi * RoundCameraController.RAD;
        //			var rsin:number = this.radius * Math.sin(p);
        //			this._camera.x = rsin * Math.sin(t) + this._target[0];
        //			this._camera.z = rsin * Math.cos(t) + this._target[2];
        //			this._camera.y = this.radius * Math.cos(p) + this._target[1];
        //
        //			this._camera.lookAt(this._target);
    };

    RoundCameraController.prototype.upDate = function () {
        this.targetTheta += (this._theta - this.targetTheta) * 0.1;
        this.targetPhi += (this._phi - this.targetPhi) * 0.1;
        var t = this.targetTheta * RoundCameraController.RAD;
        var p = this.targetPhi * RoundCameraController.RAD;

        var rsin = this.radius * Math.sin(p);

        //this._camera.x = rsin * Math.sin(t) + this._target[0];
        //this._camera.z = rsin * Math.cos(t) + this._target[2];
        //this._camera.y = this.radius * Math.cos(p) + this._target[1];

        //this._camera.lookAt(this._target);

        //  ThreeJS用に改変
        this._camera.position.x = rsin * Math.sin(t) + this._target[0];
        this._camera.position.z = rsin * Math.cos(t) + this._target[2];
        this._camera.position.y = this.radius * Math.cos(p) + this._target[1];

        this._camera.lookAt({x:this._target[0], y:this._target[1], z:this._target[2] });
    };

    RoundCameraController.prototype.rotate = function (dTheta, dPhi) {
        this._theta += dTheta;
        this._phi += dPhi;
        this._upDateCamera();
    };
    RoundCameraController.RAD = Math.PI / 180;
    return RoundCameraController;
})();
