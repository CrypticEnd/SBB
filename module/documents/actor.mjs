export class SBBActor extends Actor{


    prepareData() {
        super.prepareData();
    }

    prepareDerivedData() {
        const actorData = this;
        const systemData = actorData.system;
        const config = CONFIG.SBB;

        // Update deprived data values
        systemData.HP.max =config.settings.hpBase +
            systemData.attributes.fortitude * config.settings.hpFortMod;
        systemData.strain.max =config.settings.strainBase +
            systemData.attributes.willpower * config.settings.strainBufferWillMod;

        // check if HP needs to be changed
        if(systemData.HP.value > systemData.HP.max)
            systemData.HP.value = systemData.HP.max;

        if(systemData.strain.value > systemData.strain.max)
            systemData.strain.value = systemData.strain.max;
    }
}