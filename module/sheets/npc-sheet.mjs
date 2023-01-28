export class SBBNPCSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["NPC", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/actors/NPC-sheet.hbs",
            width: 680,
            height: 800,
            tabs: [{ navSelector: ".main-tabs", contentSelector: ".nav-content", initial: "skills" },
                {navSelector: ".skills-tabs", contentSelector: ".skills-content", initial: "Body"}]
        });
    }

    getData(options) {
        const data = super.getData();
        data.config = CONFIG.SBB;

        return data;
    }

}