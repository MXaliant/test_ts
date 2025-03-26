class Character {
    name: string;
    health: number;
    private maxHealth: number;
    attack: number;
    constructor(name: string, health: number, attack: number, level: number = 1) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.maxHealth = health;
        this.level = level;
    }
    level: number = 1;
    private xp: number = 0;
    private reqXp: number = 100;

    attackTarget(target: Character): void {
        if (target instanceof Archer) {
            if ((target as Archer).dodge()) {
                console.log(`${target.name} dodged ${this.name}'s attack!`);
                return;
            }
        }

        target.health -= this.attack;
        console.log(`${this.name} attacked ${target.name} for ${this.attack} damage.`);
        console.log(`${target.name} has ${target.health} health remaining.`);
    }

    levelUp() {
        this.level++;
        this.xp -= this.reqXp;
        this.reqXp *= 1.5;
        this.reqXp = Math.ceil(this.reqXp);
        this.maxHealth += 20;
        this.attack += 5;
        console.log(`${this.name} has leveled up to level ${this.level}! Atk: ${this.attack}, HP: ${this.maxHealth}`);
    }

    victory(enemy: Character) {
        let xp = randomIntFromInterval(50, 100);
        if (enemy instanceof Monster) {
            xp -= 30;
        }
        this.xp += xp;
        console.log(`${this.name} has gained ${xp} xp!`);
        if (this.xp >= this.reqXp) {
            this.levelUp();
        }
        this.health = this.maxHealth;
        console.log(`Remaining xp to level up: ${this.reqXp - this.xp}`);
    }
}

class Warrior extends Character {
    constructor(name: string, level: number = 1) {
        super(name, 120 + (20 * (level - 1)), 25 + (5 * (level - 1)), level);
    }
}

class Archer extends Character {
    constructor(name: string, level: number = 1) {
        super(name, 90 + (20 * (level - 1)), 15 + (5 * (level - 1)), level);
    }

    dodge() {
        if (randomIntFromInterval(1, 100) > 20) {
            return false;
        } else {
            return true;
        }
    }
}

class Monster extends Character {
    constructor() {
        super('Monster', randomIntFromInterval(50, 100), randomIntFromInterval(10, 20));
    }
}

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function battle(player1: Character, player2: Character) {
    console.log(`${player1.name} (LV. ${player1.level}) vs ${player2.name} (LV. ${player2.level})`);
    while (player1.health > 0 && player2.health > 0) {
        player1.attackTarget(player2);
        if (player2.health <= 0) {
            console.log(`${player1.name} wins the battle!`);
            player1.victory(player2);
            break;
        }
        player2.attackTarget(player1);
        if (player1.health <= 0) {
            console.log(`${player2.name} wins the battle!`);
            player2.victory(player1);
            break;
        }
    }
}

function journey(player: Character) {
    let count = 0;
    let rivalCount = Math.round(Math.random() * 5);
    while (player.health > 0) {
        const monster = new Monster();
        console.log(`Encountered a monster! ${monster.health} HP, ${monster.attack} ATK`);
        battle(player, monster);
        count++;
        if (count === rivalCount) {
            const rival = new Archer('Robin', player.level);
            console.log(`Encountered a rival, ${rival.name}! ${rival.health} HP, ${rival.attack} ATK`);
            battle(player, rival);
            rivalCount = Math.round(Math.random() * 5);
            count = 0;
        }
    }
    console.log(`${player.name} has fallen in battle...`);
}

function main() {
    const player1 = new Warrior('Thorin');
    journey(player1);
}

main();