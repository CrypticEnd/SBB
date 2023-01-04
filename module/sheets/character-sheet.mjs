export class SBBCharacterSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["character", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/actors/Character-sheet.hbs",
            width: 600,
            height: 800,
            tabs: [{navSelector: ".main-tabs", contentSelector: ".sheet-body", initial: "main"},
                {navSelector: ".tenet-focus-tabs", contentSelector: ".tenet-content", initial: "tenet"},
                {navSelector: ".skills-tabs", contentSelector: ".skills-content", initial: "Body"}
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

    _skillContexMenu=
        [{
        name: game.i18n.localize("SBB.sills.add_rank"),
        icon: '<i class="fas fa-plus"></i>',
        callback: element => {
            const itemID = element[0].dataset.type;
            const item = (this.actor.items.get(itemID));
            const newRank = this._checkSkillRank(item.system.Rank+1)
            item.update({"system.Rank": newRank})
        }},{
        name: game.i18n.localize("SBB.sills.sub_rank"),
        icon: '<i class="fas fa-plus"></i>',
        callback: element => {
            const itemID = element[0].dataset.type;
            const item = (this.actor.items.get(itemID));
            const newRank = this._checkSkillRank(item.system.Rank-1)
            item.update({"system.Rank": newRank})
        }}
        ].concat(this._itemContextMenu);

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

        let skills = data.items.filter(function (item) {return item.type == "Skill"});

        data.skills =  {
            "Body" : skills.filter(function (item) {return item.system.Attribute=="Body"}),
            "Control" : skills.filter(function (item) {return item.system.Attribute=="Control"}),
            "Intelligence" : skills.filter(function (item) {return item.system.Attribute=="Intelligence"}),
            "Presence" : skills.filter(function (item) {return item.system.Attribute=="Presence"}),
            "Technique" : skills.filter(function (item) {return item.system.Attribute=="Technique"})
        };

        return data;
    }


    // Used for interacting with the sheet while its open!
    activateListeners(html) {
        // non editors
        html.find(".feat-card").click(this._itemRoll.bind(this))
        html.find(".tenet-focus-card").click(this._tenetSwitch.bind(this))

        //Edit listers
        if(this.isEditable) {
            html.find(".attributes-input").change(this._checkvalBetween.bind(this, 1, 10))
            html.find(".health-input").change(this._checkvalBetween.bind(this, 0, this.actor.system.HP.max))
            html.find(".strain-marker").click(this._onStrainChange.bind(this));
            html.find(".add-item-button").click(this._addItem.bind(this))
            html.find(".add-skill-button").click(this._addSkill.bind(this));

            // strain reset context menu
            new ContextMenu(html, ".strain-marker", [{
                name:  game.i18n.localize("SBB.common.clear_strain"),
                icon:     '<i class="fas fa-edit"></i>',
                callback: element => {
                    this.actor.update({"system.Strain.value": 0});
                }
            }]);

            // Skill add/take away rank context menu
            new ContextMenu(html, ".skill-item", this._skillContexMenu);

            // item add/edit menu
            new ContextMenu(html, ".feat-card", this._itemContextMenu)
            new ContextMenu(html, ".tenet-focus-card", this._itemContextMenu)

        }
        super.activateListeners(html);

    }

    _checkvalBetween(minVal, maxVal, event){
        event.preventDefault();
        let element = event.currentTarget;

        element.value = Math.floor(element.value);

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

    _addSkill(event){
        event.preventDefault();
        let itemCategory = event.currentTarget.dataset.category;

        let itemData ={
            name:game.i18n.localize("SBB.common.newSkill"),
            type: "Skill",
            system:{
                Attribute: itemCategory
            }
        };

        Item.create(itemData, {parent: this.actor});
    }

    _itemRoll(event){
        const itemID = event.currentTarget.dataset.type;
        const item = (this.actor.items.get(itemID));

        item.roll();
    }

    _tenetSwitch(event){
        const itemID = event.currentTarget.dataset.type;
        const item = (this.actor.items.get(itemID));

        // check if type is a tent else return
        if(item.type != "Tenet") return;

        item.update({"system.Used" : !item.system.Used});
    }

    _checkSkillRank(skillRank){
        skillRank = Math.floor(skillRank);
        if(skillRank >10) return 10;
        if(skillRank<0) return 0;
        return skillRank;
    }

}