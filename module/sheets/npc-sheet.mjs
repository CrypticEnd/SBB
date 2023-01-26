export class SBBNPCSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["NPC", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/actors/NPC-sheet.hbs",
            width: 600,
            height: 800,
            tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "sheet" }]
        });
    }

}