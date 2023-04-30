var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Snake = /** @class */ (function () {
    function Snake(ctx, canvasSize, blockSize, moveInterval) {
        this.direction = 'right';
        this.snake = [];
        this.food = {
            x: 0,
            y: 0
        };
        this.moveTimeout = null;
        this.ctx = ctx;
        this.canvasSize = canvasSize;
        this.blockSize = blockSize;
        this.moveInterval = moveInterval;
        this.reset();
    }
    Snake.prototype.reset = function () {
        this.snake = [
            {
                x: 2,
                y: 0
            }, {
                x: 1,
                y: 0
            }, {
                x: 0,
                y: 0
            },
        ];
        // Generate the first food location
        this.generateFood();
        // Set the initial direction to right
        this.direction = 'right';
    };
    Snake.prototype.generateFood = function () {
        this.food = {
            x: Math.floor(Math.random() * (this.canvasSize / this.blockSize)),
            y: Math.floor(Math.random() * (this.canvasSize / this.blockSize))
        };
    };
    Snake.prototype.drawBlock = function (point, color) {
        var x = point.x * this.blockSize;
        var y = point.y * this.blockSize;
        this.drawRect(x, y, this.blockSize, this.blockSize, color);
    };
    Snake.prototype.drawRect = function (x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    };
    Snake.prototype.move = function () {
        var _this = this;
        var head = __assign({}, this.snake[0]);
        switch (this.direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        this.snake.unshift(head);
        this.snake.pop();
        // Check for collision with the food
        if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
            this.snake.push(this.snake[this.snake.length - 1]);
            this.generateFood();
        }
        // Check for collision with the walls or snake body
        var _a = [
            this.snake[0].x,
            this.snake[0].y
        ], headX = _a[0], headY = _a[1];
        if (headX < 0 || headX >= this.canvasSize / this.blockSize || headY < 0 || headY >= this.canvasSize / this.blockSize) {
            this.reset();
            return;
        }
        for (var i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === headX && this.snake[i].y === headY) {
                this.reset();
                return;
            }
        }
        // Draw
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawBlock(this.food, 'red');
        this.snake.forEach(function (point, i) {
            var color = i === 0 ? 'black' : 'green';
            _this.drawBlock(point, color);
        });
    };
    Snake.prototype.handleKeyDown = function (event) {
        switch (event.key) {
            case 'ArrowUp':
                if (this.direction !== 'down') {
                    this.direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') {
                    this.direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') {
                    this.direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') {
                    this.direction = 'right';
                }
                break;
        }
    };
    Snake.prototype.start = function () {
        var _this = this;
        this.moveTimeout = setInterval(function () { return _this.move(); }, this.moveInterval);
        window.addEventListener('keydown', function (event) { return _this.handleKeyDown(event); });
    };
    Snake.prototype.stop = function () {
        var _this = this;
        if (this.moveTimeout) {
            clearInterval(this.moveTimeout);
        }
        window.removeEventListener('keydown', function (event) { return _this.handleKeyDown(event); });
    };
    return Snake;
}());
// Initialize the canvas and snake objects
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasSize = 400;
var blockSize = 10;
var moveInterval = 100;
canvas.width = canvasSize;
canvas.height = canvasSize;
var snake = new Snake(ctx, canvasSize, blockSize, moveInterval);
// Start the game
snake.start();
