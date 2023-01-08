export class SBBActor extends Actor{
    prepareDerivedData() {
        const actorData = this;
        const systemData = actorData.system;
        const config = CONFIG.SBB;

        // Update deprived data values
        systemData.HP.max = systemData.attributes.Fortitude * config.settings.hpFortMod;
        systemData.Strain.max = systemData.attributes.Willpower * config.settings.strainWillMod;

        // check if HP needs to be changed
        if(systemData.HP.value > systemData.HP.max)
            systemData.HP.value = systemData.HP.max;

        console.log(config);
        console.log(systemData);
    }
}