interface Point {
    x: number;
    y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

class Snake {
    private readonly ctx : CanvasRenderingContext2D;
    private readonly canvasSize : number;
    private readonly blockSize : number;
    private readonly moveInterval : number;

    private direction : Direction = 'right';
    private snake : Point[] = [];
    private food : Point = {
        x: 0,
        y: 0
    };
    private moveTimeout : NodeJS.Timeout | null = null;

    constructor(ctx : CanvasRenderingContext2D, canvasSize : number, blockSize : number, moveInterval : number) {
        this.ctx = ctx;
        this.canvasSize = canvasSize;
        this.blockSize = blockSize;
        this.moveInterval = moveInterval;

        this.reset();
    }

    private reset(): void { // Initialize the snake with three segments
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
    }

    private generateFood(): void { // Generate a random point within the canvas bounds
        this.food = {
            x: Math.floor(Math.random() * (this.canvasSize / this.blockSize)),
            y: Math.floor(Math.random() * (this.canvasSize / this.blockSize))
        };
    }

    private drawBlock(point : Point, color : string): void {
        const x = point.x * this.blockSize;
        const y = point.y * this.blockSize;
        this.drawRect(x, y, this.blockSize, this.blockSize, color);
    }

    private drawRect(x : number, y : number, width : number, height : number, color : string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    private move(): void { // Move the snake by adding a new head segment and removing the tail segment
        const head = {
            ...this.snake[0]
        };
        switch (this.direction) {
            case 'up': head.y -= 1;
                break;
            case 'down': head.y += 1;
                break;
            case 'left': head.x -= 1;
                break;
            case 'right': head.x += 1;
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
        const [headX, headY] = [
            this.snake[0].x,
            this.snake[0].y
        ];
        if (headX < 0 || headX >= this.canvasSize / this.blockSize || headY < 0 || headY >= this.canvasSize / this.blockSize) {
            this.reset();
            return;
        }
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === headX && this.snake[i].y === headY) {
                this.reset();
                return;
            }
        }

        // Draw
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawBlock(this.food, 'red');
        this.snake.forEach((point, i) => {
            const color = i === 0 ? 'black' : 'green';
            this.drawBlock(point, color);
        });
    }

    private handleKeyDown(event : KeyboardEvent): void { // Update the direction based on the arrow key pressed
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
    }
    public start(): void {
        this.moveTimeout = setInterval(() => this.move(), this.moveInterval);
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    public stop(): void {
        if (this.moveTimeout) {
            clearInterval(this.moveTimeout);
        }
        window.removeEventListener('keydown', (event) => this.handleKeyDown(event));
    }
}

// Initialize the canvas and snake objects
const canvas = document.getElementById('canvas')as HTMLCanvasElement;
const ctx = canvas.getContext('2d')as CanvasRenderingContext2D;
const canvasSize = 400;
const blockSize = 10;
const moveInterval = 100;

canvas.width = canvasSize;
canvas.height = canvasSize;

const snake = new Snake(ctx, canvasSize, blockSize, moveInterval);

// Start the game
snake.start();
