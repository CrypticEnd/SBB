export class SBBActorSheet extends Actorsheet{

    prepareData() {
        // Prepare data for the actor. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }
    prepareDerivedData(){
        const actorData = this.data;

        this._prepareCharacterData(actorData);
        this._prepareNPCData(actorData);
        this._prepareVehicleData(actorData);
        this._prepareStarshipData(actorData);
        this._prepareDroneData(actorData);
    }

    get template(){
        return 'systems/sbb/templates/sheets/' + this.Actor.type  + '-sheet.hbs';
    }

    _prepareCharacterData(actorData){
        if (actorData.type !== 'Character') return;
    }

    _prepareNPCData(actorData){
        if (actorData.type !== 'NPC') return;
    }

    _prepareVehicleData(actorData){
        if (actorData.type !== 'Vehicle') return;
    }

    _prepareStarshipData(actorData){
        if (actorData.type !== 'Starship') return;
    }

    _prepareDroneData(actorData){
        if (actorData.type !== 'Drone') return;
    }
}