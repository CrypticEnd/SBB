export class SBBActor extends Actor{


    prepareData() {
        super.prepareData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        
        const actorData = this;
        const config = CONFIG.SBB;

        // Update deprived data values based on actor type
        if(actorData.type == "Character"){
            this._prepareCharacterData(actorData, config);
        }
        else if(actorData.type == "NPC"){
            this._prepareNPCData(actorData, config);
        }
    }

    _prepareCharacterData(actorData, config) {
        const systemData = actorData.system;

        this._updateHPOnAttribute(systemData, config, systemData.attributes.fortitude);
        this._updateStrainOnAttribute(systemData, config, systemData.attributes.willpower);
    }

    _prepareNPCData(actorData, config) {
        const systemData = actorData.system;
        const rank = systemData.rank;

        this._updateHPOnAttribute(systemData, config, rank);
        this._updateStrainOnAttribute(systemData, config, rank);
    }

    _updateHPOnAttribute(systemData, config, attribute){
        systemData.HP.max =config.settings.hpBase +
            attribute * config.settings.hpFortMod
            + systemData.modifiers.HP;

        // check if HP needs to be changed
        if(systemData.HP.value > systemData.HP.max)
            systemData.HP.value = systemData.HP.max;
    }

    _updateStrainOnAttribute(systemData, config, attribute){
        systemData.strain.max =config.settings.strainBase +
            attribute * config.settings.strainBufferWillMod
            + systemData.modifiers.strain;

        // check if strain max needs to be changed
        if(systemData.strain.value > systemData.strain.max)
            systemData.strain.value = systemData.strain.max;
    }

}