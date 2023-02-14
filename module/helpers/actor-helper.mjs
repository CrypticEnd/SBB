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

    if(itemType == "Skill") {
        itemData = Object.assign({
            system: {
                attribute: event.currentTarget.dataset.category
            }
        }, itemData);
    }

    Item.create(itemData, {parent: this.actor});
}

export function arrayMove(array, oldIndex, newIndex){
    if (newIndex >= array.length) {
        let k = newIndex - array.length + 1;
        while (k--) {
            array.push(undefined);
        }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
}

export function editItem(event){
    event.preventDefault();
    const itemID = event.currentTarget.dataset.itemId;
    const item = (this.actor.items.get(itemID));

    item.sheet.render(true);
}

export function itemRoll(event){
    event.preventDefault();

    const itemID = event.currentTarget.dataset.itemId;
    const item = (this.actor.items.get(itemID));

    // Depending on the item we want to do something else
    if(item.type == "Skill"){
        Dice.rollSkillFromActorData(this.actor, item, null);
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
    let itemID = element.parentElement.dataset.itemId;
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

export function updateArmourValues(actor){
    const config = CONFIG.SBB;
    const armourList =  actor.items.filter(function (item) {
        return item.type == "Armour"});

    // Damage defense types
    let KnD_body = config.settings.defaultArmourValues.kinetic;
    let EnD_body = config.settings.defaultArmourValues.energy;
    let ExD_body = config.settings.defaultArmourValues.explosive;
    let TlD_body = config.settings.defaultArmourValues.tl;

    let KnD_head = KnD_body;
    let EnD_head = EnD_body;
    let ExD_head = ExD_body;
    let TlD_head = TlD_body;

    Object.keys(armourList).forEach(key => {
        let item = armourList[key];
        if(item.system.equipped){
            // Check gearType
            if(item.system.type == config.armourTypes.head){
                KnD_head = item.system.kinetic;
                EnD_head = item.system.energy;
                ExD_head = item.system.explosive;
                TlD_head = item.system.techLevel;
            }
            else if(item.system.type == config.armourTypes.body){
                KnD_body = item.system.kinetic;
                EnD_body = item.system.energy;
                ExD_body = item.system.explosive;
                TlD_body = item.system.techLevel;
            }
        }
    });

    // Updates
    actor.update({"system.armour.body.kinetic": KnD_body})
    actor.update({"system.armour.body.energy": EnD_body})
    actor.update({"system.armour.body.explosive": ExD_body})
    actor.update({"system.armour.body.techlevel": TlD_body})

    actor.update({"system.armour.head.kinetic": KnD_head})
    actor.update({"system.armour.head.energy": EnD_head})
    actor.update({"system.armour.head.explosive": ExD_head})
    actor.update({"system.armour.head.techlevel": TlD_head})
}

export function effectToggle(event){
    event.preventDefault();

    const itemId = event.currentTarget.dataset.itemId;
    const effectItem = this.actor.items.get(itemId);
    const actorEffects = this.actor.getEmbeddedCollection("ActiveEffect").contents;

    const relevantEffects = actorEffects.filter(effect => effect.origin.endsWith(itemId))

    if(relevantEffects.length == 0 ) return;

    const newStatus = !effectItem.system.active;

    Object.keys(relevantEffects).forEach(key =>{
        relevantEffects[key].update({disabled : !newStatus});
    });
    effectItem.update({"system.active": newStatus});

}

export function toggleLastFamily(event){
    event.preventDefault();

    let greatParentNode = event.currentTarget.parentNode.parentNode.parentNode;
    let toggleHideNode = greatParentNode.getElementsByClassName("hide-on-click");

    if(toggleHideNode.length === 1){
        let toggleNode = toggleHideNode[0];
        $(toggleNode).toggle("hidden");

        // Toggle item flag
        let item = this.actor.items.get(greatParentNode.dataset.itemId);

        if(item == null) return;
        if(item.flags.sbb != null && "shown" in item.flags.sbb){
            item.setFlag("sbb", "shown", !item.flags.sbb.shown);
        }
        else{
            item.setFlag("sbb", "shown", true);
        }
    }
}

export function armourEquipped(event){
    event.preventDefault();
    const actor = this.actor;
    const itemID = event.currentTarget.dataset.itemId;
    const item = actor.items.get(itemID);
    const armourSlot = item.system.type;
    const armourList =  actor.items.filter(function (item) {
        return item.type == "Armour" && item.system.type == armourSlot});


    if(!item.system.equipped){
        // Search though all other armor of type and de-equipped it
        Object.keys(armourList).forEach(key =>{
            if(armourList[key].system.equipped)
                armourList[key].update({"system.equipped" : false});
        });
    }

    item.update({"system.equipped" : !item.system.equipped});
}

export function workOutStrain(strain){
    let strainValue = strain.max - strain.value;
    let config = CONFIG.SBB.settings;

    // work out the buffer
    let strainBuffer = strain.max - config.strainBase;

    let strainOverflow =  strainValue - strainBuffer;

    if(strainOverflow<=0)
        return 0;

    return Math.floor(strainOverflow* config.strainPenaltyMod);
}