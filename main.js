import { generateMonster } from "./modules/monster.js";

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
let eggXpReq = 50;

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
    let monster = generateMonster(maxRarity, monsters.length, eggXpReq);
    monsters.push(monster);
    addToMonsterList(monster);
    eggXpReq = (50 + 50 * monsters.length) * (monsters.length + 1);
}

function addToMonsterList(monster) {
    let newLi = document.createElement("li");
    let newImg = document.createElement("img");
    let newP = document.createElement("p");
    newLi.setAttribute("id", "monster" + monster.id);
    newLi.setAttribute("class", "list-item");
    newImg.setAttribute("src", "gfx/" + monster.sprite);
    newImg.setAttribute("class", "item-sprite");
    newP.setAttribute("class", "item-name");
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

// Mobile

const leftColumn = document.getElementById("left-column");
const midColumn = document.getElementById("mid-column");
const rightColumn = document.getElementById("right-column");
const menuShop = document.getElementById("menu-shop");
const menuMonsters = document.getElementById("menu-monsters");

menuShop.addEventListener("click", openShop);
menuMonsters.addEventListener("click", openMonsters);

function openShop() {
  menuShop.setAttribute("class", "menu-button menu-active");
  menuMonsters.setAttribute("class", "menu-button");
  leftColumn.setAttribute("class", "flex left-column mobile-active");
  midColumn.setAttribute("class", "flex mid-column");
  rightColumn.setAttribute("class", "flex right-column");
}

function openMonsters() {
  menuMonsters.setAttribute("class", "menu-button menu-active");
  menuShop.setAttribute("class", "menu-button");
  leftColumn.setAttribute("class", "flex left-column");
  midColumn.setAttribute("class", "flex mid-column mobile-active");
  rightColumn.setAttribute("class", "flex right-column mobile-active");
}
