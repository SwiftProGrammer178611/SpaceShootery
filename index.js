const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player{
    constructor() {
        this.position = {
            x:200,
            y:200
        }

        this.velocity = {
            x:0,
            y:0
        }

        const image = new Image();
        image.src = './spaceship.png'
        image.onload = () => {
            this.image = image
            this.width = image.width
            this.height = image.height
        }
    }

    draw() {
        if(this.image)
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const player = new Player()


function animate() {
    requestAnimationFrame(animate)
        c.fillRect(0,0,canvas.width,canvas.height)
        player.draw()
    
}

animate()