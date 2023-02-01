export class SBBActor extends Actor {

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

        const config = CONFIG.SBB;
        const type = this.type;

        // Update deprived data values based on actor type
        if (type == "Character") {
            this._updateChar(config)
        } else if (type == "NPC") {
            this._updateNPC(config)
        }

        console.log(this);
    }



    _updateChar(config){
        let attributes = this.system.attributes;

        this.allowedItems = this._allowedItemsCharacter;

        this._updateHPChar(attributes.fortitude.rank, config);
        this._updateStrainChar(attributes.willpower.rank, config);
        this._updateSpeedChar(attributes.move.rank, config);
    }

    _updateNPC(config){
        let rank = this.system.rank;

        this.allowedItems = this._allowedItemsNPC;

        this._updateHPChar(rank, config);
        this._updateStrainChar(rank, config);
        this._updateSpeedChar(rank, config);
    }

    _updateHPChar(attribute, config){
        let systemData = this.system;

        systemData.HP.max =config.settings.hpBase +
            attribute * config.settings.hpFortMod
            + systemData.modifiers.HP;

        // check if HP needs to be changed
        if(systemData.HP.value > systemData.HP.max)
            systemData.HP.value = systemData.HP.max;
    }

    _updateStrainChar(attribute, config){
        let systemData = this.system;

        systemData.strain.max =config.settings.strainBase +
            attribute * config.settings.strainBufferWillMod
            + systemData.modifiers.strain;

        // check if strain max needs to be changed
        if(systemData.strain.value > systemData.strain.max)
            systemData.strain.value = systemData.strain.max;
    }

    _updateSpeedChar(attribute, config){
        let systemData = this.system;

        systemData.speed =config.settings.speedBase +
            attribute * config.settings.speedMoveMod
            + systemData.modifiers.speedBonus;
    }
}