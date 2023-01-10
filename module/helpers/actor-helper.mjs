import * as Dice from "./dice.mjs";

export function checkvalBetween(minVal, maxVal, event){
    event.preventDefault();
    let element = event.currentTarget;

    element.value = Math.floor(element.value);

    if(element.value>maxVal){
        element.value = maxVal;
    }
    else if (element.value<minVal){
        element.value = minVal;
    }
}

export function addItem(event){
    event.preventDefault();
    let itemType = event.currentTarget.dataset.type;

    let itemData ={
        name:game.i18n.localize("SBB.common.newItem"),
        type: itemType
    };

    if(itemType == "Skill"){
        itemData =  Object.assign({
            system: {
                attribute: event.currentTarget.dataset.category
            }}, itemData);
        }

    Item.create(itemData, {parent: this.actor});
}

export function editItem(event){
    event.preventDefault();
    const itemID = event.currentTarget.dataset.type;
    const item = (this.actor.items.get(itemID));

    item.sheet.render(true);
}

export function itemRoll(event){
    event.preventDefault();
    const itemID = event.currentTarget.dataset.type;
    const item = (this.actor.items.get(itemID));

    // Depending on the item we want to do something else
    if(item.type == "Skill"){
        Dice.rollSkillFromID(this.actor._id, itemID);
        return;
    }

    item.roll();
}

export function checkSkillRank(skillRank){
    skillRank = Math.floor(skillRank);
    let maxRank = CONFIG.SBB.settings.skillRank.max;
    let minRank = CONFIG.SBB.settings.skillRank.min;

    if(skillRank > maxRank) return maxRank;
    if(skillRank<minRank) return minRank;
    return skillRank;
}

export function forceRoundDown(event){
    event.preventDefault();
    let element = event.currentTarget;

    element.value = Math.floor(element.value);
}

export function updateItem(event){
    event.preventDefault();
    let element = event.currentTarget;
    let itemID = element.parentElement.dataset.type;
    let item = this.actor.items.get(itemID);
    let field = element.dataset.field;
    let newValue = element.value;

    if(newValue<0)
        newValue=0;

    // if a weapon check value
    if(item.type == "Weapon" && newValue > item.system.magazine.max){
        newValue = item.system.magazine.max;
    }

    item.update({[field]: Math.floor(newValue)});
}