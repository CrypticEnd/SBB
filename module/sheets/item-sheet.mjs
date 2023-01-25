export class SBBItemSheet extends  ItemSheet {

    templateSheets = {
        "Weapon":      "systems/sbb/templates/sheets/items/weapon-sheet.hbs",
        "Armour":      "systems/sbb/templates/sheets/items/armour.hbs",
        "Item":        "systems/sbb/templates/sheets/items/item.hbs",
        "Consumable":  "systems/sbb/templates/sheets/items/item.hbs",
        "Feat":        "systems/sbb/templates/sheets/items/feat-sheet.hbs",
        "Effect": "systems/sbb/templates/sheets/items/effect.hbs",
        // "Starship Fittings":
        // "Starship Defenses":
        // "Starship Weaponry":
        "Skill": "systems/sbb/templates/sheets/items/skill-sheet.hbs",
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

        data.effects = data.item.getEmbeddedCollection("ActiveEffect").contents;

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if(this.isEditable){
            html.find(".effect-control").click(this._onEffectControl.bind(this));
        }
    }

    _onEffectControl(event){
        event.preventDefault();
        const owner = this.item;
        const a = event.currentTarget;
        const tr = a.closest("tr");
        const effect = tr.dataset.effectId ? owner.effects.get(tr.dataset.effectId) : null;

        switch (a.dataset.action){
            case "create":
                return owner.createEmbeddedDocuments("ActiveEffect", [{
                    label: game.i18n.localize("SBB.effects.new"),
                    icon: "icons/svg/aura.svg",
                    origin: owner.uuid,
                    disabled: true
                }]);
            case "edit":
                return effect.sheet.render(true);
            case "delete":
                return effect.delete();
        }

    }
}