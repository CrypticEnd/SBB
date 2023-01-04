export class SBBCharacterSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["character", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/Character-sheet.hbs",
            width: 600,
            height: 800,
            tabs: [{navSelector: ".main-tabs", contentSelector: ".sheet-body", initial: "main"},
                {navSelector: ".tabs", contentSelector: ".tenet-content", initial: "tenet"}
            ],
        });
    }

    _itemContextMenu =
        [
            {
                name: game.i18n.localize("SBB.common.edit"),
                icon : '<i class="fas fa-edit"></i>',
                callback: element=>{
                    const itemID = element[0].dataset.type;
                    const item = (this.actor.items.get(itemID));
                    item.sheet.render(true);
                }},
            {
                name: game.i18n.localize("SBB.common.delete"),
                icon : '<i class="fas fa-trash"></i>',
                callback: element =>{
                    const itemID = element[0].dataset.type;
                    const item = (this.actor.items.get(itemID));
                    item.delete();
                }}
        ];

    getData() {
        const data = super.getData();
        const actorData = this.actor.system;
        data.config = CONFIG.SBB;

        // Update deprived data values
        actorData.HP.max = actorData.attributes.Fortitude * 10;
        actorData.Strain.max = actorData.attributes.Willpower * 2;

        // Item filters
        data.feats =  data.items.filter(function (item) {return item.type == "Feat"});
        data.tenets =  data.items.filter(function (item) {return item.type == "Tenet"});
        data.focuses =  data.items.filter(function (item) {return item.type == "Focus"});

        return data;
    }


    // Used for interacting with the sheet while its open!
    activateListeners(html) {
        // non editors
        html.find(".feat-card").click(this._itemRoll.bind(this))

        //Edit listers
        if(this.isEditable) {
            html.find(".attributes-input").change(this._checkvalBetween.bind(this, 1, 10))
            html.find(".health-input").change(this._checkvalBetween.bind(this, 0, this.actor.system.HP.max))
            html.find(".strain-marker").click(this._onStrainChange.bind(this));
            html.find(".feat-add-button").click(this._addItem.bind(this))

            // strain reset context menu
            new ContextMenu(html, ".strain-marker", [{
                name:  game.i18n.localize("SBB.common.clear_strain"),
                icon:     '<i class="fas fa-edit"></i>',
                callback: element => {
                    this.actor.update({"system.Strain.value": 0});
                }
            }]);

            // item add/edit menu
            new ContextMenu(html, ".feat-card", this._itemContextMenu)

        }
        super.activateListeners(html);

    }

    _checkvalBetween(minVal, maxVal, event){
        event.preventDefault();
        let element = event.currentTarget;

        if(element.value>maxVal){
            element.value = maxVal;
        }
        else if (element.value<minVal){
            element.value = minVal;
        }
    }

    _onStrainChange(event){
        event.preventDefault();
        let strainCount = this.actor.system.Strain;
        let index = event.currentTarget.dataset.type;
        let newValue = index;

        if(newValue==strainCount.value){
            newValue =0;
        }

        this.actor.update({"system.Strain.value" : newValue});
    }

    _addItem(event){
        event.preventDefault();
        let itemType = event.currentTarget.dataset.type;

        let itemData ={
            name:game.i18n.localize("SBB.common.newItem"),
            type: itemType
        };

        Item.create(itemData, {parent: this.actor});
    }

    _itemRoll(event){
        const itemID = event.currentTarget.dataset.type;
        const item = (this.actor.items.get(itemID));

        item.roll();
    }

}