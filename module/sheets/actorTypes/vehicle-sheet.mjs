export class SBBVehicleSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["boilerplate", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/Character-sheet.hbs",
            width: 600,
            height: 800,
            tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "sheet" }]
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

    }
}