let avatar = 'img/char-boy.png';
/* allEnemies - array for all enemies created by the createEnemies(); */
let allEnemies = [];
/* gifts - increments each time the player arrives at shop */
let gifts = 0;
/* cars - increments each time gifts % 3 === 0 */
let cars = 1;
/* gameSpeed - the speed of the enemies (will increase with cars) */
let gameSpeed = 1;
/* checkCollision - if true it will check for collision */
let checkCollision = true;
/* gotGift - if true it will check if the player has reached the shop */
let gotGift = true;
/* addingActive - ensures that the touchevent is only added once */
let addingActive = true;
/* disables key input for addEventListener() */
let disableKeys = true;
/* audio - for the evet sounds, audio from sources bellow:
/* https://sites.google.com/site/marioutilities/audio-files-and-music */
/* http://bbcsfx.acropolis.org.uk/ */
let audio = new Audio;
let disableLastAudio = false;
/* modal variables */
const modalstart = document.querySelector('.modalstart');
const modalend = document.querySelector('.modalend');
const modalstartFooter = document.querySelector('.modalstart-footer');
const modalendFooter = document.querySelector('.modalend-footer');
const endscore = document.querySelector('.endscore');

/* game variables */
class gameVariables {
    constructor () {
        this.allEnemies = allEnemies;
        this.speedOfGame = gameSpeed;
        this.gifts = gifts;
        this.cars = cars;
        this.checkCollision = checkCollision;
        this.gotGift = gotGift;
        this.addingActive = addingActive;
    }

    /* creates a number of enemies */ 
    createEnemies(n) {
        for (let i = 0; i < n; i++) {
            this.allEnemies.push( new Enemy(0, [63, 143, 223][Math.floor(Math.random() * 3)], 150 + (this.speedOfGame * (Math.floor(Math.random() * 300)))) );
        }
    }

    /* resets the player position to the starting position */
    resetPlayerPos () {
        player.x = 200;
        player.y = 400;
        this.gotGift = true;
    }

    /* if the player gets hit by a car, she looses a day. If the number of days left becomes 0, a modal will appear with her score */
    gotHit () {
        endscore.innerHTML = `${this.gifts}`;
        const that = this;
        player.daysLeft -= 1;
        
        if (player.daysLeft === 0) {
            disableKeys = true;
            setTimeout(function () {
                modalend.style.display = 'flex';
                that.checkCollision = true;
            }, 200)
        } else {
            setTimeout(function () {
                that.resetPlayerPos();
                that.checkCollision = true;
            }, 200);
        }

        if (player.daysLeft < 0) {
            player.daysLeft = 0;
        } 
        if (player.daysLeft > 0) {
            audio.src = 'sounds/horn.wav';
            audio.play();
        } else {
            if (disableLastAudio === false) {
                audio.src = 'sounds/smw_lost_a_life.wav';
                audio.play();    
                disableLastAudio = true;      
            }
        }
    }

    /* increases gifts and cars when the player reaches the shop */
    reachedShop () {
        this.gifts += 1;

        if (this.gifts % 3 === 0) {
            this.cars += 1;
            setTimeout(this.createEnemies.bind(this), 500, 1);
            this.speed += 0.3;   
            audio.src = 'sounds/smw_1-up.wav';
            audio.play();   
        } else {
            audio.src = 'sounds/smw_coin.wav';
            audio.play();
        }

        setTimeout(this.resetPlayerPos.bind(gameVar), 500);
    }
  
    /* starts the game when the modalstartFooter is clicked */
    startTheGame () {
        /* hide modalstart and modalend */
        modalend.style.display = 'none';
        modalstart.style.display = 'none';
        disableKeys = false;
    
        this.gifts = 0;
        this.cars = 1;
        this.allEnemies = [];
        this.gotGift = true;
        this.checkCollision = true;
        this.addingActive = false;
        /* number of enemies based on number of gifts*/
        this.createEnemies((this.gifts / 3) + 1);

        player = new Player(200, 400, 3);
     /*   new Player(200, 400, 3);*/
    }
}

/* Enemies: x, y - enemy position, speed - enemy speed form random number + cars */
class Enemy {
    constructor (x, y, speed) {
        this.sprite = 'img/enemy-car.png';
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 80;
        this.height = 80;
        this.position = [[this.x - 40, this.x + 40], [this.y - 15, this.y + 15]];
    }

    /* updates the position and the speed of the enemies */
    update (dt) {
        this.x += this.speed * dt;
        this.position = [[this.x - 40, this.x + 40], [this.y - 15, this.y + 15]];

        /* when enemys move off canvas, this resets their position and speed ta  random number */
        if (this.x > 550) {
            this.x = -100;
            this.speed = 150 + (gameVar.speedOfGame * (Math.floor(Math.random() * 300)));
            this.y = [65, 145, 225][Math.floor(Math.random() * 3)]
        }
    }

    /* draws enemy */
    render () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /* check for enemy - player collision, and calls gotHit() method if needed */
    checkCollision (playerPosition) {
        /*
        if (playerPosition[0] > this.position[0][0] && playerPosition[0] < this.position[0][1]) {
            if (playerPosition[1] > this.position[1][0] && playerPosition[1] < this.position[1][1]) {
                gameVar.gotGift = false;
                gameVar.checkCollision = false;
                gameVar.gotHit();
            }
        }
        */

        let er = 0;
        let ec = 0;
        let pr = 0;
        let pc = 0;

        /* player x position */
        if(player.x < 100){ pc = 0; }
        if(player.x >= 100 && player.x < 200){ pc = 1; } 
        if(player.x >= 200 && player.x < 300){ pc = 2; }
        if(player.x >= 300 && player.x < 400){ pc = 3; }
        if(player.x >= 400){ pc = 4; }

        /* player y position */
        if(player.y < 72) { pr = 0; }                        
        if(player.y >= 72 && player.y < 154) { pr = 1; }     
        if(player.y >= 154 && player.y < 236) { pr = 2; }    
        if(player.y >= 236 && player.y < 318) { pr = 3; }    
        if(player.y >= 318 && player.y < 400) { pr = 4; }    
        if(player.y >= 400) { pr = 5; }                      

        /* enemy car x position + 10 buffer for easyer gameplay */
        if(this.x < -100){ ec = -1; }
        if(this.x >= -100 && this.x < 0){ ec = 0; } 
        if(this.x >= 0 && this.x < 100){ ec = 1; } 
        if(this.x >= 100 && this.x < 200){ ec = 2; }
        if(this.x >= 200 && this.x < 300){ ec = 3; }
        if(this.x >= 300 && this.x < 400){ ec = 4; }
        if(this.x >= 400){ ec = 5; }

        /* enemy car y position */
        if(this.y < 63) { er = 0; }                        
        if(this.y >= 63 && this.y < 143) { er = 1; }     
        if(this.y >= 143 && this.y < 223) { er = 2; }    
        if(this.y >= 223 && this.y < 303) { er = 3; }    
        if(this.y >= 303 && this.y < 383) { er = 4; }    
        if(this.y >= 383) { er = 5; }                      
/*
        if (ec == 2) { 
            alert(this.x.toString()); 
        }
*/
        if ((pc == ec) && (pr == er)) {
            gameVar.gotGift = false;
            gameVar.checkCollision = false;
            gameVar.gotHit();
        }
    }
}

/* Player: x, y - player position, daysLeft - displays the number of days the player has left */
class Player {
    constructor (x, y, daysLeft) {
        /*avatar = 'img/char-cat-girl.png';*/
        this.sprite = avatar;
        this.x = x;
        this.y = y;
        this.daysLeft = daysLeft;
        this.width = 10;
        this.height = 10;
        this.position = [this.x, this.y];
    }

    /* updates the position of the player */
    update () {
        this.position = [this.x, this.y];
    }

    /* draws player and score */
    render () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.font = '28px Audiowide';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff006c'; 
        ctx.fillText(`Gift(s): ${gameVar.gifts} Car(s): ${gameVar.cars} Days left: ${player.daysLeft}`, canvas.width / 2, 40);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeText(`Gift(s): ${gameVar.gifts} Car(s): ${gameVar.cars} Days left: ${player.daysLeft}`, canvas.width / 2, 40);
    }

    /* handles the keys or the touch moves entered as param */ 
    handleInput (key) {
        if (key === 'up' && this.y > 0) {
            this.y -= 82;
        } else if (key === 'down' & this.y < 400) {
            this.y += 82;
        } else if (key === 'right' && this.x < 400) {
            this.x += 100;
        } else if (key === 'left' && this.x > 0) {
            this.x -= 100;
        } else {
            console.log('stand');
        }
        if (this.y <= -10) {
            if (gameVar.gotGift === true) {
                console.log('check');
                gameVar.gotGift = false;
                gameVar.reachedShop();
            }
        }
    }
}

/* listens for key presses and sends the keys to the Player.handleInput() method if disableKeys not active */ 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    /* disables key input so that the player can't move when the game is not active */
    if (disableKeys === false) {
        player.handleInput(allowedKeys[e.keyCode]);  
    }
});

/* makes sure that the game resets and the modalend disappears */
modalendFooter.addEventListener('click', function () {
    gameVar.startTheGame();
});

/* makes sure that the game starts and the modalstart disappears */
modalstartFooter.addEventListener('click', function () {
    gameVar.startTheGame();
});

/* avatar selection functions to set te avatar's image */
function setAvatarBo() {
    avatar = 'img/char-boy.png';
}

function setAvatarCg() {
    avatar = 'img/char-cat-girl.png';
}

function setAvatarHg() {
    avatar = 'img/char-horn-girl.png';
}

function setAvatarPg() {
    avatar = 'img/char-pink-girl.png';
}

function setAvatarPr() {
    avatar = 'img/char-princess-girl.png';
}

/* generates the necessary gameVar object and player Object */
const gameVar = new gameVariables();
let player = new Player(0, 0, 0);