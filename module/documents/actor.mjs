export class SBBActor extends Actor {
    prepareBaseData() {
        super.prepareBaseData();

        const config = CONFIG.SBB;
        const type = this.type;

        // Update deprived data values based on actor type
        if (type == "Character") {
            this._updateChar(config);
        } else if (type == "NPC") {
            this._updateNPC(config);
        } else if(type == "Vehicle"){
            this._updateVehicle(config);
        }
    }

    prepareEmbeddedDocuments() {
        if(this.type == "Character" || this.type == "NPC"){
            // If active effects change HP or strain we want to also heal that amount
            // prepareEmbeddedDocuments() is where active effects are applied
            let systemData = this.system;

            let hp = systemData.HP.max;
            let strain = systemData.strain.max;

            super.prepareEmbeddedDocuments();

            let hpChange = systemData.HP.max - hp;
            let strainChange = systemData.strain.max - strain;

            if(hpChange > 0){
                systemData.HP.value+= hpChange;
            }
            if(strainChange > 0){
                systemData.strain.value+= strainChange;
            }
        }
        else {
            super.prepareEmbeddedDocuments();
        }
    }

    _updateChar(config){
        let attributes = this.system.attributes;

        this.setFlag("sbb", "allowedItems", config._allowedItemsCharacter);

        this._updateHPChar(attributes.fortitude.rank, config);
        this._updateStrainChar(attributes.willpower.rank, config);
        this._updateSpeedChar(attributes.move.rank, config);
    }

    _updateNPC(config){
        let rank = this.system.rank;

        this.setFlag("sbb", "allowedItems", config._allowedItemsNPC);

        this._updateHPChar(rank, config);
        this._updateStrainChar(rank, config);
        this._updateSpeedChar(rank, config);
    }

    _updateVehicle(config){
        this.setFlag("sbb", "allowedItems", config._allowedItemsVehicles);
        if(this.flags.sbb?.crew == undefined){
            this.setFlag("sbb", "crew", {});
        }


        let systemData = this.system;

        systemData.HP.max = systemData.HP.base + systemData.modifiers.HP;

        // Work out how much power is being used
        let powerUsage = 0;
        for (const [key, value] of Object.entries(this.items)) {
            powerUsage += value.system?.power;
        }

        systemData.power.remaining = systemData.power.base - powerUsage;
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