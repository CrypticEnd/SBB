export class SBBNPCSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["NPC", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/actors/NPC-sheet.hbs",
            width: 600,
            height: 800,
            tabs: [{ navSelector: ".main-tabs", contentSelector: ".nav-content", initial: "skills" }]
        });
    }

    getData(options) {
        const data = super.getData();
        data.config = CONFIG.SBB;

        return data;
    }

}