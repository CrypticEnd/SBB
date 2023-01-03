export class SBBCharacterSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["character", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/Character-sheet.hbs",
            width: 600,
            height: 800,
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "main"}],
        });
    }

    prepareData() {
        // Prepare data for the actor. Calling the super version of this executes
        // the following, in order: data reset (to clear active effects),
        // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
        // prepareDerivedData().
        super.prepareData();
    }
    prepareDerivedData(){
        const actorData = this.system;

        // Work out HP
        //TODO HP value may change in future?
        actorData.HP = actorData.attributes.Fortitude * 10;
    }

    getRollData() {
        const data = super.getRollData();
        //TODO roll values

    }


    // Used for interacting with the sheet while its open!
    activateListeners(html) {
        super.activateListeners(html);

    }
}