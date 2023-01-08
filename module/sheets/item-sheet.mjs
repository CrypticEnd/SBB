export class SBBItemSheet extends  ItemSheet {

    templateSheets = {
        "Weapon": "systems/sbb/templates/sheets/items/weapon-sheet.hbs",
        // "Armour":
        // "Item":
         "Ammunition": "systems/sbb/templates/sheets/items/ammo.hbs",
        "Feat": "systems/sbb/templates/sheets/items/feat-sheet.hbs",
        // "Starship Fittings":
        // "Starship Defenses":
        // "Starship Weaponry":
        "Skill": "systems/sbb/templates/sheets/items/basic-item-sheet.hbs",
        "Tenet": "systems/sbb/templates/sheets/items/basic-item-sheet.hbs",
        "Focus": "systems/sbb/templates/sheets/items/basic-item-sheet.hbs",
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