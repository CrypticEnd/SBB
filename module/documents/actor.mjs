export class SBBActor extends Actor{

    _allowedItemsCharacter = [
        "Weapon", "Armour", "Item", "Consumable", "Feat", "Effect", "Skill", "Tenet", "Focus"
    ]

    _allowedItemsNPC = [
        "Weapon", "Armour", "Item", "Consumable", "Feat", "Effect", "Skill"
    ]

    prepareData() {
        super.prepareData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        
        const actorData = this;
        const config = CONFIG.SBB;
        const type = actorData.type;

        // Update deprived data values based on actor type
        if(type == "NPC" || type == "Character") {
            if (type == "Character") {
                actorData.allowedItems = this._allowedItemsCharacter;
            }
            else{
                actorData.allowedItems = this._allowedItemsNPC;
            }

            this._updateHPChar(actorData.system, config);
            this._updateStrainChar(actorData.system, config);
            this._updateSpeedChar(actorData.system, config);
        }

    }

    _updateHPChar(systemData, config){
        const attribute = systemData.attributes.fortitude.rank;

        systemData.HP.max =config.settings.hpBase +
            attribute * config.settings.hpFortMod
            + systemData.modifiers.HP;

        // check if HP needs to be changed
        if(systemData.HP.value > systemData.HP.max)
            systemData.HP.value = systemData.HP.max;
    }

    _updateStrainChar(systemData, config){
        const attribute = systemData.attributes.willpower.rank;

        systemData.strain.max =config.settings.strainBase +
            attribute * config.settings.strainBufferWillMod
            + systemData.modifiers.strain;

        // check if strain max needs to be changed
        if(systemData.strain.value > systemData.strain.max)
            systemData.strain.value = systemData.strain.max;
    }

    _updateSpeedChar(systemData, config){
        const attribute = systemData.attributes.move.rank;

        systemData.speed =config.settings.speedBase +
            attribute * config.settings.speedMoveMod
            + systemData.modifiers.speedBonus;
    }
}