const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl')
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1
        const image = new Image();
        image.src = './spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        )
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            if (mouse.x !== undefined) {
                this.position.x = mouse.x - this.width / 2
                if (this.position.x < 0) this.position.x = 0
                if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width
            }

        }
    }
}

class Invader {
    constructor({ position }) {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image();
        image.src = './invader.png'
        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        //grid of invaders
        this.invaders = []

        const rows = Math.floor(Math.random() * 10 + 5)



        const cols = Math.floor(
            Math.random() * 5 + 2
        )

        //full width of the grid

        this.width = cols * 30

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        //30 is the w of the img
                        x: x * 30,
                        y: y * 30
                    }
                }))
            }
        } console.log(this.invaders)
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0

        if (this.position.x + this.width > canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10
    }
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle{
    constructor({ position, velocity, radius, color }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
    }

   draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y - this.radius > canvas.height){
            this.position.y = -this.radius
            this.position.x = Math.random() * canvas.width
        }
    }
}
const player = new Player()
const projectiles = [new Projectile({
    position: {
        x: 300,
        y: 300
    },
    velocity: {
        x: 0,
        y: -5,
    }
})]
const grids = []
const keys = {
    space: {
        pressed: false 
    }
}
const mouse = {
    x: undefined
}
let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)

const particles = []
for (let i = 0; i < 100; i++) {
    particles.push(
        new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 1
            },
            radius: Math.random() * 3,
            color: 'white'
        })
    )
}

let game = {
    over: false,
    active: true
}
let score = 0
console.log(randomInterval)
const invaderProjectiles = []

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
        particle.update()
    })

    player.update()

    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update()
        }

        if (
            invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width
        ) {
            console.log("you lose")
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 2000)

        }
    })

    projectiles.forEach((projectile, index) => {

        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)

        } else {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()

        //spawn proj//

        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }


        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                ) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 => invader2 === invader)
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)

                        if (invaderFound && projectileFound) {
                            score += 100
                            scoreEl.innerHTML = score
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]
                                grid.width =
                                    lastInvader.position.x -
                                    firstInvader.position.x +
                                    lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })



    console.log(frames)
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }
    frames++
}

animate()

addEventListener('keydown', ({ key }) => {
    if (game.over) return

    if (key === ' ') {
        projectiles.push(new Projectile({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y
            },
            velocity: {
                x: 0,
                y: -5
            }
        }))
        keys.space.pressed = true;
    }
})
addEventListener('keyup', ({ key }) => {
    if (key === ' ') {
        keys.space.pressed = false
    }
})

addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
})