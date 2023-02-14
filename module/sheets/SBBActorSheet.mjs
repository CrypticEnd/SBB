import * as Helper from "../helpers/actor-helper.mjs";

export class SBBActorSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes:  ["sheet", "actor"],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    _itemContextMenu =
        [
            {
                name:     game.i18n.localize("SBB.common.edit"),
                icon:     '<i class="fas fa-edit"></i>',
                callback: element => {
                    const itemID = element[0].dataset.itemId;
                    const item = (this.actor.items.get(itemID));
                    item.sheet.render(true);
                }
            },
            {
                name:     game.i18n.localize("SBB.common.delete"),
                icon:     '<i class="fas fa-trash"></i>',
                callback: element => {
                    const itemID = element[0].dataset.itemId;
                    const item = (this.actor.items.get(itemID));
                    item.delete();
                }
            }
        ];

    _skillContextMenu =
        [
            {
                name:     game.i18n.localize("SBB.skills.add_rank"),
                icon:     '<i class="fas fa-plus"></i>',
                callback: element => {
                    const itemID = element[0].dataset.itemId;
                    const item = (this.actor.items.get(itemID));
                    const newRank = Helper.checkSkillRank(item.system.rank + 1)
                    item.update({"system.rank": newRank})
                }
            }, {
            name:     game.i18n.localize("SBB.skills.sub_rank"),
            icon:     '<i class="fas fa-minus"></i>',
            callback: element => {
                const itemID = element[0].dataset.itemId;
                const item = (this.actor.items.get(itemID));
                const newRank = Helper.checkSkillRank(item.system.rank - 1)
                item.update({"system.rank": newRank})
            }
        }
        ].concat(this._itemContextMenu);

    getData() {
        const data = super.getData();
        data.config = CONFIG.SBB;

        // Item filters
        data.filteredItems = {
            feats:       data.items.filter(function (item) {
                return item.type == "Feat"
            }),
            tenets:      data.items.filter(function (item) {
                return item.type == "Tenet"
            }),
            focuses:     data.items.filter(function (item) {
                return item.type == "Focus"
            }),
            attacks:     data.items.filter(function (item) {
                return item.type == "Weapon"
            }),
            consumables: data.items.filter(function (item) {
                return item.type == "Consumable"
            }),
            armour:      data.items.filter(function (item) {
                return item.type == "Armour"
            }),
            otherItems:  data.items.filter(function (item) {
                return item.type == "Item"
            }),

            enhancementDrug:    data.items.filter(function (item) {
                return item.type == "Effect"
                    && item.system.type == "SBB.effects.drug"
            }),
            enhancementImplant: data.items.filter(function (item) {
                return item.type == "Effect"
                    && item.system.type == "SBB.effects.implant"
            }),
            injury:             data.items.filter(function (item) {
                return item.type == "Effect"
                    && item.system.type == "SBB.effects.injury"
            }),

            starShipFitting:data.items.filter(function (item) {
                return item.type == "Vehicle Fittings"
            }),
            starShipDefense:data.items.filter(function (item) {
                return item.type == "Vehicle Defenses"
            }),
            starShipWeapon:data.items.filter(function (item) {
                return item.type == "Vehicle Weaponry"
            }),
        }

        let skills = data.items.filter(function (item) {
            return item.type == "Skill"
        });
        data.filteredItems.skills = {};

        for (const [key, value] of Object.entries(data.config.skillTypes)) {
            data.filteredItems.skills[key] = skills.filter(function (item) {
                return item.system.attribute == key
            });
        }

        return data;
    }

    activateListeners(html) {
        // non editors
        html.find(".toggle-description").click(Helper.toggleLastFamily.bind(this));
        html.find(".item-rollable").click(Helper.itemRoll.bind(this));

        //Edit Listeners
        if (this.isEditable) {
            html.find(".health-input").change(Helper.checkvalBetween.bind(this, 0, this.actor.system.HP.max));
            html.find(".add-item-button").click(Helper.addItem.bind(this));
            html.find(".inline-edit").change(Helper.updateItem.bind(this));
            html.find(".fa-pen-to-square").click(Helper.editItem.bind(this));
            html.find(".armour-equipped-button").click(Helper.armourEquipped.bind(this));
            html.find(".effect-equipped-button").click(Helper.effectToggle.bind(this));

            // Skill add/take away rank context menu
            new ContextMenu(html, ".skill-item", this._skillContextMenu);

            // item add/edit menu
            new ContextMenu(html, ".feat-card", this._itemContextMenu)
            new ContextMenu(html, ".equipment", this._itemContextMenu)
        }
        super.activateListeners(html);
    }

    // Override
    async _onDropItemCreate(itemData) {
        let config = CONFIG.SBB;
        let type = this.actor.type;
        let allowedItems = [];

        if (type == "Character") {
            allowedItems = config._allowedItemsCharacter;
        } else if (type == "NPC") {
            allowedItems = config._allowedItemsNPC;
        } else if(type == "Vehicle"){
            allowedItems = config._allowedItemsVehicles;
        }

        if(allowedItems.includes(itemData.type)){
            await super._onDropItemCreate(itemData);
        }
        else{
            console.warn(game.i18n.localize("SBB.warning.disallowedItem"))
        }
    }
}