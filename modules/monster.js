class Monster {
  constructor(name, sprite, rarity, eggXpRequired, baseXpRequired, xpRequiredMultiplier, baseGold, id) {
    this._name = name;
    this._sprite = sprite;
    this._rarity = rarity;
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

const monsterData = [
  {name: "Flambirdy", rarity: 1, sprite: "flamebird.png", xpReq: 100, xpReqMult: 1.5, baseGold: 1},
  {name: "Sparkitty", rarity: 1, sprite: "sparkit.png", xpReq: 80, xpReqMult: 1.8, baseGold: 1.5},
  {name: "Glacifly", rarity: 1, sprite: "frostfly.png", xpReq: 150, xpReqMult: 1.3, baseGold: 1},
  {name: "Sheeberry", rarity: 1, sprite: "sheeberry.png", xpReq: 120, xpReqMult: 1.6, baseGold: 1.5},
  {name: "Magmurm", rarity: 2, sprite: "magmurm.png", xpReq: 300, xpReqMult: 1.75, baseGold: 3},
  {name: "Slugflora", rarity: 2, sprite: "slugflora.png", xpReq: 500, xpReqMult: 1.25, baseGold: 2},
  {name: "Emerald Drake", rarity: 3, sprite: "drake_emerald.png", xpReq: 1000, xpReqMult: 2, baseGold: 10},
  {name: "Goldshell", rarity: 3, sprite: "goldshell.png", xpReq: 500, xpReqMult: 2.4, baseGold: 15}
];


// Monster generating code monster

function generateMonster(maxRarity, id, eggXpReq) {
  const uncommonChance = 0.3;
  const rareChance = 0.1;
  let randomRarity = Math.random();
  let rarity = 0;
  let targetMonster = "";
  let monstersData;
    
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
      monstersData = monsterData.filter(({rarity}) => rarity === 1);
      randomMonster = Math.floor(Math.random() * monstersData.length);
      targetMonster = monstersData[randomMonster];
      break;
    case 1:
      monstersData = monsterData.filter(({rarity}) => rarity === 2);
      randomMonster = Math.floor(Math.random() * monstersData.length);
      targetMonster = monstersData[randomMonster];
      break;
    case 2:
      monstersData = monsterData.filter(({rarity}) => rarity === 3);
      randomMonster = Math.floor(Math.random() * monstersData.length);
      targetMonster = monstersData[randomMonster];
      break;
  }

  let resultMonster = new Monster(targetMonster.name, targetMonster.sprite, targetMonster.rarity, eggXpReq, targetMonster.xpReq, targetMonster.xpReqMult, targetMonster.baseGold, id)
  return resultMonster;
}

export { Monster, monsterData, generateMonster };
