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
        const type = this.Actor.type;

        // Check is a Character sheet
        if(type == "Character"){

        }
    }

    get template(){
        return 'systems/sbb/templates/sheets/' + this.Actor.type  + '-sheet.hbs';
    }
}