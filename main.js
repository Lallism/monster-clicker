class Monster {
    constructor(name, sprite, eggXpRequired, baseXpRequired, xpRequiredMultiplier, baseGold, id) {
        this._name = name;
        this._sprite = sprite;
        this._lv = 0;
        this._xp = 0;
        this._currentXpRequired = eggXpRequired;
        this._baseXpRequired = baseXpRequired;
        this._xpRequiredMultiplier = xpRequiredMultiplier;
        this._baseGold = baseGold;
        this._currentGold = 0;
        this._eggSprite = "egg.png";
        this._id = id;
    }

    get name() {
        if (this._lv == 0) {
            return "Egg";
        }
        return this._name;
    }

    get lv() {
        return this._lv;
    }

    get xp() {
        return this._xp;
    }

    get xpRequired() {
        return this._currentXpRequired;
    }

    get currentGold() {
        return this._currentGold;
    }

    get sprite() {
        if (this._lv == 0) {
            return this._eggSprite;
        }
        return this._sprite;
    }

    get id() {
        return this._id;
    }

    gainXP(amount) {
        let lvUp = false;
        this._xp += amount;
        if (this._xp >= this._currentXpRequired) {
            this._lv++;
            this._currentGold = this._baseGold * this._lv;
            this._xp = this._xp - this._currentXpRequired;
            if (this._lv == 1) {
                this._currentXpRequired = this._baseXpRequired;
            }
            else {
                this._currentXpRequired *= this._xpRequiredMultiplier;
            }
            lvUp = true;
            this.updateMonsterBox(this._id);
        }
        return lvUp;
    }

    updateMonsterBox(id) {
        let monsterBox = document.getElementById("monster" + id);
        monsterBox.children[0].src = "gfx/" + this._sprite;
        monsterBox.children[1].innerText = this._name + ", Lv " + this._lv;
    }
}

// Monster data here

const commonMonsters = [
    {name: "Flambirdy", sprite: "flamebird.png", xpReq: 100, xpReqMult: 1.5, baseGold: 1},
    {name: "Sparkitty", sprite: "sparkit.png", xpReq: 80, xpReqMult: 1.8, baseGold: 1.5},
];
const uncommonMonsters = [
    {name: "Magmurm", sprite: "magmurm.png", xpReq: 300, xpReqMult: 1.75, baseGold: 3},
    {name: "Slugflora", sprite: "slugflora.png", xpReq: 500, xpReqMult: 1.25, baseGold: 2}
];
const rareMonsters = [
    {name: "Emerald Drake", sprite: "drake_emerald.png", xpReq: 1000, xpReqMult: 2, baseGold: 10},
    {name: "Goldshell", sprite: "goldshell.png", xpReq: 500, xpReqMult: 2.4, baseGold: 15}
];

// Main code

const xpText = document.getElementById("xp-text");
const monsterList = document.getElementById("monster-list");
const itemStore = document.getElementById("store")
const goldCurrentText = document.getElementById("gold-current");
const goldIncomeText = document.getElementById("gold-income");

const clicker = document.getElementById("clicker");
clicker.addEventListener("click", clickerClick);

const monsters = [];
let activeMonster = 0;
let gold = 0;
let goldIncome = 0;
let goldIncomeMultiplier = 1;
let totalGoldIncome = 0;
let goldIncomePerClick = 0;
let clickpower = 1;
let passiveXp = 0;
let xpGainMultiplier = 1;

getEgg(0);
activateMonster(0);
updateXpText();
setInterval(onTick, 100);

function clickerClick() {
    let monster = monsters[activeMonster]
    let lvUp = monster.gainXP(clickpower * xpGainMultiplier);
    if (lvUp) {
        updateClickerSprite();
    }
    if (goldIncomePerClick > 0) {
        gold += totalGoldIncome * goldIncomePerClick;
    }
    updateXpText();
    updateIncome();
}

function updateIncome() {
    let newIncome = 0;
    for (const monster of monsters) {
        newIncome += monster.currentGold;
    }
    goldIncome = newIncome;
    totalGoldIncome = goldIncome * goldIncomeMultiplier;
    updateGold();
}

function updateClickerSprite() {
    clicker.src = "gfx/" + monsters[activeMonster].sprite;
}

function updateXpText() {
    xpText.innerText = monsters[activeMonster].xp.toFixed(0) + "/" + monsters[activeMonster].xpRequired.toFixed(0);
}

function updateGold() {
    goldIncomeText.innerText = totalGoldIncome.toFixed(1)
    goldCurrentText.innerText = gold.toFixed(0);
}

function activateMonster(monsterId) {
    let oldActiveBox = document.getElementById("monster" + activeMonster);
    oldActiveBox.setAttribute("class", "list-item");
    activeMonster = monsterId;
    let newActiveBox = document.getElementById("monster" + activeMonster);
    newActiveBox.setAttribute("class", "list-item active-item");
    updateXpText();
    updateClickerSprite();
}

function getEgg(maxRarity) {
    let monster = generateMonster(maxRarity);
    monsters.push(monster);
    addToMonsterList(monster);
}

function addToMonsterList(monster) {
    let newLi = document.createElement("li");
    let newImg = document.createElement("img");
    let newP = document.createElement("p");
    newLi.setAttribute("id", "monster" + monster.id);
    newLi.setAttribute("class", "list-item");
    newImg.setAttribute("src", "gfx/" + monster.sprite);
    newImg.setAttribute("class", "item-sprite");
    newP.setAttribute("class", "item-name")
    newP.innerText = monster.name + ", Lv " + monster.lv;
    newLi.appendChild(newImg);
    newLi.appendChild(newP);
    monsterList.appendChild(newLi);
    newLi.addEventListener("click", function(){
        activateMonster(monster.id);
    })
}

function onTick() {
    gold += totalGoldIncome / 10;
    updateGold();
    for (const monster of monsters) {
        if (monster.lv > 0) {
            monster.gainXP(passiveXp * xpGainMultiplier / 10);
        }
    }
    updateXpText();
}

// Shop stuff (could absolutely be a class)

const storeEgg = document.getElementById("store-egg");
const storeClickpower = document.getElementById("store-clickpower");
const storeTraining = document.getElementById("store-training");
const storeGoldBonus = document.getElementById("store-goldbonus");
const storeXpBonus = document.getElementById("store-xpbonus");
const storeGoldClick = document.getElementById("store-goldclick");

storeEgg.addEventListener("click", buyEgg);
storeClickpower.addEventListener("click", buyClickpower);
storeTraining.addEventListener("click", buyTraining);
storeGoldBonus.addEventListener("click", buyGoldBonus);
storeXpBonus.addEventListener("click", buyXpBonus);
storeGoldClick.addEventListener("click", buyGoldClick);

let eggCost = 100;
let clickpowerCost = 10;
let trainingCost = 30;
let goldBonusCost = 100;
let xpBonusCost = 500;
let goldClickCost = 2000;

function buyEgg() {
    if (gold > eggCost) {
        gold -= eggCost;
        eggCost += 100;
        eggCost *= 2;
        getEgg();
        storeEgg.children[1].children[0].innerText = "Egg | " + eggCost;
    }
}

function buyClickpower() {
    if (gold > clickpowerCost) {
        gold -= clickpowerCost;
        clickpowerCost *= 1.1;
        clickpower += 1;
        storeClickpower.children[1].children[0].innerText = "Click Power | " + clickpowerCost.toFixed(0);
    }
}

function buyTraining() {
    if (gold > trainingCost) {
        gold -= trainingCost;
        trainingCost *= 1.15;
        passiveXp += 2;
        storeTraining.children[1].children[0].innerText = "Training | " + trainingCost.toFixed(0);
    }
}

function buyGoldBonus() {
    if (gold > goldBonusCost) {
        gold -= goldBonusCost;
        goldBonusCost *= 1.2;
        goldIncomeMultiplier += 0.1;
        storeGoldBonus.children[1].children[0].innerText = "Gold Bonus | " + goldBonusCost.toFixed(0);
        updateIncome();
    }
}

function buyXpBonus() {
    if (gold > xpBonusCost) {
        gold -= xpBonusCost;
        xpBonusCost *= 1.25;
        xpGainMultiplier += 0.2;
        storeXpBonus.children[1].children[0].innerText = "XP Bonus | " + xpBonusCost.toFixed(0);
        updateIncome();
    }
}

function buyGoldClick() {
    if (gold > goldClickCost) {
        gold -= goldClickCost;
        goldClickCost *= 2;
        goldIncomePerClick += 0.01;
        storeGoldClick.children[1].children[0].innerText = "Golden Clicks | " + goldClickCost.toFixed(0);
    }
}

// Monster generating code monster

function generateMonster(maxRarity) {
    const uncommonChance = 0.3;
    const rareChance = 0.1;
    let randomRarity = Math.random();
    let rarity = 0;
    let targetMonster = "";
    
    switch (maxRarity) {
        case 0:
            break;
        case 1:
            if (randomRarity < uncommonChance) {
                rarity = 1;
            }
            break;
        default:
            if (randomRarity < rareChance) {
                rarity = 2;
            }
            else if (randomRarity < (uncommonChance + rareChance)) {
                rarity = 1;
            }
    }

    let randomMonster = 0;

    switch (rarity) {
        case 0:
            randomMonster = Math.floor(Math.random() * commonMonsters.length);
            targetMonster = commonMonsters[randomMonster];
            break;
        case 1:
            randomMonster = Math.floor(Math.random() * uncommonMonsters.length);
            targetMonster = uncommonMonsters[randomMonster];
            break;
        case 2:
            randomMonster = Math.floor(Math.random() * rareMonsters.length);
            targetMonster = rareMonsters[randomMonster];
            break;
    }

    let id = monsters.length;
    let eggXpReq = (50 + 50 * monsters.length) * (monsters.length + 1); // random maths to make eggs need more xp with more monsters
    let resultMonster = new Monster(targetMonster.name, targetMonster.sprite, eggXpReq, targetMonster.xpReq, targetMonster.xpReqMult, targetMonster.baseGold, id)
    return resultMonster;
}