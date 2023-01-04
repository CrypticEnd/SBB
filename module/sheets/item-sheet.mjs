export class SBBItemSheet extends  ItemSheet {

    templateSheets = {
        "Weapon": "systems/sbb/templates/sheets/items/weapon-sheet.hbs",
        // "Armour":
        // "Item":
        // "Ammunition":
         "Feat":"systems/sbb/templates/sheets/items/feat-sheet.hbs",
        // "Starship Fittings":
        // "Starship Defenses":
        // "Starship Weaponry":
        // "Skill":
         "Tenet":"systems/sbb/templates/sheets/items/tenet-sheet.hbs",
         "Focus":"systems/sbb/templates/sheets/items/tenet-sheet.hbs",
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 340,
            classes: ["SBB", "sheet", "item"]
        })
    }

    get template(){
        return this.templateSheets[this.item.type];
    }

    getData() {
        const data = super.getData();

        data.config = CONFIG.SBB;

        return data;
    }
}