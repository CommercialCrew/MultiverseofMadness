// Player
let flightShootDelayCount = 0;
const PLAYER_SHOOT_DELAY = 30;
var mode;
var score = 0;
let hitDelay = 0;
let countShoot = 0;
let flight;
let enemy;
let enemyBullet = [];
let flightShoot = [];
// Item
let countItemEffectTime = 0;
const ITEM_SPEED_UP = 0;
const ITEM_DAMAGE_UP = 1;
const ITEM_BULLET_STOP = 2;
// Game
const SPACEBAR = 32;
const MODE_GAME_TITLE = 0;
const MODE_IN_GAME = 1;
const MODE_GAME_OVER = 2;
const ENEMY_DIE = 0;
const ENEMY_SURVIVE = 1;
const MODE_GAME_WIN = 3;



function preload() {
}


function setup() {
    mode = MODE_GAME_TITLE; //initialy the game has not started
    background(127);
    createCanvas(600, 600, WEBGL);
    noStroke();

    flight = new Flight();
    enemy = new EnemyShooter();

    let itemVector = createVector(4, 3);
    item = new PlayerItem(itemVector);

    for (let i = 0; i < 10; i++) {
        flightShoot[i] = new FlightShoot();
    }

    for (let i = 0; i < 200; i++) {
        enemyBullet[i] = new EnemyBullet();
    }
}


function draw() {
    clear();
    if (keyCode === ENTER) {
        mode = MODE_IN_GAME;
        flight.life = 5;
        flight.x = 0;
        flight.y = 0;
        enemy.life = 10;
        enemy.state = ENEMY_SURVIVE;
        score = 0;
        enemy.x = 0;
        enemy.y = -180;
        hitDelay = 0;
        flightShootDelay = 0;

        for (let i = 0; i < 200; i++) {
            enemyBullet[i].x = 10000;
            enemyBullet[i].y = 0;
        }

        for (let i = 0; i < 10; i++) {
            flightShoot[i].x = 10000;
            flightShoot[i].y = 0;
        }
    }

    /* 타이틀 */
    if (mode == MODE_GAME_TITLE) {
        background(0);
    }

    /* 게임 오버 */
    if (mode == MODE_GAME_OVER) {
        background(127);
    }

    /* 게임 승리 */
    if (mode == MODE_GAME_WIN) {
        background(255);
    }

    /* 인 게임 */
    if (mode == MODE_IN_GAME) {
        score++;
        background(80, 188, 223);

        /* 스페이스 바를 누를 시 총알이 발사 */
        if (keyIsDown(SPACEBAR)) {
            if (flightShootDelayCount <= 0) {
                flightShootDelayCount = PLAYER_SHOOT_DELAY;
                flightShoot[countShoot % 10].x = flight.x;
                flightShoot[countShoot % 10].y = flight.y;
                countShoot++;
            }
        }

        /* 적이 살아 있을 시 */
        if (enemy.state != 0) {
            for (let j = 0; j < 200; j++) {
                enemyBullet[j].delay = j;
                enemyBullet[j].movePerTime();
                enemyBullet[j].display();
                flight.flightHitBox(enemyBullet[j]);
            }
            enemy.display();
        }

        /* 비행기 */
        if(flight.isFlightDead()){
            mode = MODE_GAME_OVER;
        }
        flight.display();

        /* 비행기 총알 출력 */
        for (let i = 0; i < 10; i++) {
            flightShoot[i].move();
            flightShoot[i].display();
            enemy.enemyHitBox(flightShoot[i]);
            if(enemy.isEnemyDead() == true){
                mode = MODE_GAME_WIN;
            }
        }

        /* 비행기와 아이템 상호작용 */
        switch (item.itemListener(flight.x, flight.y)) {
            case ITEM_SPEED_UP:
                flight.speed = 5;
                break;
            case ITEM_DAMAGE_UP:
                break;
            case ITEM_BULLET_STOP:
                break;
        }

        /* 아이템 출력 및 아이템 효과 시간 측정 리스너 */
        item.displayPlayerItem();
        flight.checkItemEffectListener();

        /* delay 감소 */
        flightShootDelayCount--;
        hitDelay--;
    }
}
