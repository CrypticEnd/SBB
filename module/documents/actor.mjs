export class SBBActor extends Actor{


    prepareData() {
        super.prepareData();
    }

    prepareDerivedData() {
        const actorData = this;
        const systemData = actorData.system;
        const config = CONFIG.SBB;

        console.log(this);

        // Update deprived data values
        systemData.HP.max = systemData.attributes.Fortitude * config.settings.hpFortMod;
        systemData.Strain.max =config.settings.strainBase + systemData.attributes.Willpower * config.settings.strainBufferWillMod;

        actorData.setFlag('sbb', 'StrainMod', this._workOutStrain());

        // check if HP needs to be changed
        if(systemData.HP.value > systemData.HP.max)
            systemData.HP.value = systemData.HP.max;

        if(systemData.Strain.value > systemData.Strain.max)
            systemData.Strain.value = systemData.Strain.max;
    }


    _workOutStrain(){
        let strain = this.system.Strain;
        let strainValue = strain.max - strain.value;
        let config = CONFIG.SBB.settings;

        // work out the buffer
        let strainBuffer = strain.max - config.strainBase;

        let strainOverflow =  strainValue - strainBuffer;

        if(strainOverflow<=0)
            return 0;

        return Math.floor(strainOverflow* config.strainPenaltyMod);
    }
}