import * as Dice from "../helpers/dice.mjs";
import * as Helper from "../helpers/actor-helper.mjs";

export class SBBCharacterSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["character", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/actors/Character-sheet.hbs",
            width: 600,
            height: 800,
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}],
            tabs: [{navSelector: ".main-tabs", contentSelector: ".nav-context-box", initial: "personal"},
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
                    const itemID = element[0].dataset.itemId;
                    const item = (this.actor.items.get(itemID));
                    item.sheet.render(true);
                }},
            {
                name: game.i18n.localize("SBB.common.delete"),
                icon : '<i class="fas fa-trash"></i>',
                callback: element =>{
                    const itemID = element[0].dataset.itemId;
                    const item = (this.actor.items.get(itemID));
                    item.delete();
                }}
        ];

    _skillContextMenu=
        [
            {
        name: game.i18n.localize("SBB.skills.add_rank"),
        icon: '<i class="fas fa-plus"></i>',
        callback: element => {
            const itemID = element[0].dataset.itemId;
            const item = (this.actor.items.get(itemID));
            const newRank = Helper.checkSkillRank(item.system.rank+1)
            item.update({"system.rank": newRank})
        }},{
        name: game.i18n.localize("SBB.skills.sub_rank"),
        icon: '<i class="fas fa-plus"></i>',
        callback: element => {
            const itemID = element[0].dataset.itemId;
            const item = (this.actor.items.get(itemID));
            const newRank = Helper.checkSkillRank(item.system.rank-1)
            item.update({"system.rank": newRank})
        }}
        ].concat(this._itemContextMenu);

    getData() {
        const data = super.getData();
        data.config = CONFIG.SBB;

        // Item filters
        data.filteredItems = {
            feats:  data.items.filter(function (item) {return item.type == "Feat"}),
            tenets:  data.items.filter(function (item) {return item.type == "Tenet"}),
            focuses:  data.items.filter(function (item) {return item.type == "Focus"}),
            attacks:  data.items.filter(function (item) {return item.type == "Weapon"}),
            consumables:  data.items.filter(function (item) {return item.type == "Consumable"}),
            armour:  data.items.filter(function (item) {return item.type == "Armour"}),
            otherItems:  data.items.filter(function (item) {return item.type == "Item"}),

            enhancementDrug: data.items.filter(function (item) {return item.type == "Effect"
            && item.system.type == "SBB.effects.drug"}),
            enhancementImplant: data.items.filter(function (item) {return item.type == "Effect"
                && item.system.type == "SBB.effects.implant"}),
            injury: data.items.filter(function (item) {return item.type == "Effect"
                && item.system.type == "SBB.effects.injury"})
        }

        let skills = data.items.filter(function (item) {return item.type == "Skill"});
        data.filteredItems.skills = {};

        for (const [key,value] of Object.entries(data.config.skillTypes)){
            data.filteredItems.skills[key] = skills.filter(function (item) {return item.system.attribute==key});
        }

        this.actor.setFlag('sbb', 'strainMod', this._workOutStrain());
        this.actor.setFlag('sbb', 'attributeCount', this._countAttributes())

        Helper.updateArmourValues(this.actor);

        return data;
    }

    // Used for interacting with the sheet while its open!
    activateListeners(html) {
        // non editors
        html.find(".toggle-description").click(this._toggleLastFamily.bind(this));
        html.find(".tenet-focus-card").click(this._tenetSwitch.bind(this));
        html.find(".item-rollable").click(Helper.itemRoll.bind(this));
        html.find(".save-roll").click(this._rollSave.bind(this));

        //Edit Listeners
        if(this.isEditable) {
            html.find(".attributes-input").change(Helper.checkvalBetween.bind(
                this, CONFIG.SBB.settings.attributesRanks.min, CONFIG.SBB.settings.attributesRanks.max));
            html.find(".xp-input").change(Helper.forceRoundDown.bind(this));
            html.find(".health-input").change(Helper.checkvalBetween.bind(this, 0, this.actor.system.HP.max));
            html.find(".resolve-input").change(Helper.checkvalBetween.bind(this, 0, 10));
            html.find(".strain-marker").click(this._onStrainChange.bind(this));
            html.find(".add-item-button").click(Helper.addItem.bind(this));
            html.find(".inline-edit").change(Helper.updateItem.bind(this));
            html.find(".fa-pen-to-square").click(Helper.editItem.bind(this));
            html.find(".toggle-tenet").click(this._toggleTenet.bind(this));
            html.find(".toggle-focus").click(this._toggleFocus.bind(this));
            html.find(".armour-equipped-button").click(this._armourEquipped.bind(this));
            html.find(".effect-equipped-button").click(Helper.effectToggle.bind(this));

            // strain reset context menu
            new ContextMenu(html, ".strain-marker", [{
                name:  game.i18n.localize("SBB.common.clear_strain"),
                icon:     '<i class="fas fa-edit"></i>',
                callback: element => {
                    this.actor.update({"system.strain.value": this.actor.system.strain.max});
                }
            }]);

            // Skill add/take away rank context menu
            new ContextMenu(html, ".skill-item", this._skillContextMenu);

            // item add/edit menu
            new ContextMenu(html, ".feat-card", this._itemContextMenu)
            new ContextMenu(html, ".equipment", this._itemContextMenu)
            new ContextMenu(html, ".tenet-focus-card", this._itemContextMenu)

        }
        super.activateListeners(html);

    }

    _workOutStrain(){
        let strain = this.actor.system.strain;
        let strainValue = strain.max - strain.value;
        let config = CONFIG.SBB.settings;

        // work out the buffer
        let strainBuffer = strain.max - config.strainBase;

        let strainOverflow =  strainValue - strainBuffer;

        if(strainOverflow<=0)
            return 0;

        return Math.floor(strainOverflow* config.strainPenaltyMod);
    }

    _countAttributes(){
        let counter = 0;

        for(const [key,value] of Object.entries(this.actor.system.attributes)){
            counter += value;
        }

        return counter;
    }

    _toggleTenet(){
        let actor = this.actor;
        let current = actor.system.usingTenet;
        actor.update({"system.usingTenet" : !current})
    }

    _toggleFocus(){
        let actor = this.actor;
        let current = actor.system.usingFocus;
        actor.update({"system.usingFocus" : !current})
    }

    _onStrainChange(event){
        event.preventDefault();
        let strainCount = this.actor.system.strain;
        let index = event.currentTarget.dataset.type;
        let newValue = index-1;

        if(newValue==strainCount.value){
            newValue++;
        }

        this.actor.update({"system.strain.value" : newValue});
    }

    _tenetSwitch(event){
        event.preventDefault();
        const itemID = event.currentTarget.dataset.itemId;
        const item = (this.actor.items.get(itemID));

        // check if type is a tent else return
        if(item.type !== "Tenet") return;

        item.update({"system.used" : !item.system.used});
    }

    _toggleLastFamily(event){
        event.preventDefault();

        let greatParentNode = event.currentTarget.parentNode.parentNode.parentNode;
        let toggleHideNode = greatParentNode.getElementsByClassName("hide-on-click");

        if(toggleHideNode.length === 1){
            let toggleNode = toggleHideNode[0];
            $(toggleNode).toggle("hidden");

            // Toggle item flag
            let item = this.actor.items.get(greatParentNode.dataset.itemId);

            if(item == null) return;
            if(item.flags.sbb != null && "shown" in item.flags.sbb){
                item.setFlag("sbb", "shown", !item.flags.sbb.shown);
            }
            else{
                item.setFlag("sbb", "shown", true);
            }
        }
    }

    _rollSave(event){
        event.preventDefault();
        const saveType = event.currentTarget.dataset.type;

        let saveTypes = this.getData().config.saveTypes;

        if(!saveType.toLowerCase() in saveTypes
        && !saveType in this.actor.system.attributes)
        {
            console.warn("'${saveType}' is not a valid attribute for a save");
            return;
        }
        let linkedAttribute = this.actor.system.attributes[saveType.toLowerCase()];

        Dice.makeSaveRoll({
            linkedAttribute : linkedAttribute,
            skillName: saveTypes[saveType.toLowerCase()]
        });
    }

    _armourEquipped(event){
        event.preventDefault();
        const actor = this.actor;
        const itemID = event.currentTarget.dataset.itemId;
        const item = actor.items.get(itemID);
        const armourSlot = item.system.type;
        const armourList =  actor.items.filter(function (item) {
            return item.type == "Armour" && item.system.type == armourSlot});


        if(!item.system.equipped){
            // Search though all other armor of type and de-equipped it
            Object.keys(armourList).forEach(key =>{
                if(armourList[key].system.equipped)
                    armourList[key].update({"system.equipped" : false});
            });
        }

        item.update({"system.equipped" : !item.system.equipped});
    }
}