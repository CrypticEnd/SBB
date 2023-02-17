export class SBBItemSheet extends  ItemSheet {

    templateSheets = {
        "Weapon":       "systems/sbb/templates/sheets/items/weapon-sheet.hbs",
        "Armour":       "systems/sbb/templates/sheets/items/armour.hbs",
        "Item":         "systems/sbb/templates/sheets/items/item.hbs",
        "Consumable":   "systems/sbb/templates/sheets/items/item.hbs",
        "Feat":         "systems/sbb/templates/sheets/items/feat-sheet.hbs",
        "Effect":       "systems/sbb/templates/sheets/items/effect.hbs",
        "Vehicle Part": "systems/sbb/templates/sheets/items/Vehicle-part.hbs",
        // "Vehicle Actions":
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

        if(this.item.type == "Vehicle Part"){
            if(this.item.system.type ==  data.config.vehicleParts.weapon){
                data.weapon = this.item.flags.sbb.weapon;
            }
        }

        return data;
    }

    activateListeners(html) {
        if(this.isEditable){
            html.find(".effect-control").click(this._onEffectControl.bind(this));
            html.find(".vehicle-type-input").change(this._vehicleTypeChange.bind(this));
            html.find(".weapon-value-input").change(this._vehicleWeaponValueChange.bind(this));
        }
        super.activateListeners(html);
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

    async _vehicleTypeChange(event){
        event.preventDefault();

        const config = CONFIG.SBB;
        let currentTarget = event.currentTarget;

        if(currentTarget.value == config.vehicleParts.weapon){
            let weaponValues = this.item.flags?.sbb?.weapon;

            if(weaponValues == undefined || weaponValues.range.length != config.vehicleRangeHeader.length){
                await this._makeVehicleWeaponDefaults();
            }
        }

        this.render(true);
    }

    async _makeVehicleWeaponDefaults(){
        const config = CONFIG.SBB;

        let defaultValues = {
            range:[],
            formula: "0d0"
        }

        Object.keys(config.vehicleRangeHeader).forEach(key =>{
            defaultValues.range.push({
                name: config.vehicleRangeHeader[key],
                value: 0
            });
        });

        await this.item.update({
            "flags.sbb.weapon":defaultValues
        });
    }

    _vehicleWeaponValueChange(event){
        event.preventDefault();

        let currentTarget = event.currentTarget;
        let dataset = currentTarget.dataset;
        let weaponData = this.item.flags.sbb.weapon;

        if(dataset.type == "formula"){
            weaponData.formula = currentTarget.value;
        }
        else if(dataset.type == "range"){
            let index = dataset?.range;

            if(index == undefined){
                console.error(game.i18n.localize("SBB.errors.valuesUndefined"));
                return
            }

            weaponData.range[index].value = currentTarget.value;
        }

        this.item.update({
            "flags.sbb.weapon":weaponData
        })
    }
}