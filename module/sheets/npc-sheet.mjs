import * as Dice from "../helpers/dice.mjs";
import * as Helper from "../helpers/actor-helper.mjs";
import {toggleLastFamily} from "../helpers/actor-helper.mjs";
import {rollSkillFromID} from "../helpers/dice.mjs";

export class SBBNPCSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes:  ["NPC", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/actors/NPC-sheet.hbs",
            width:    680,
            height:   800,
            tabs:     [{navSelector: ".main-tabs", contentSelector: ".nav-content", initial: "skills"},
                       {navSelector: ".skills-tabs", contentSelector: ".skills-content", initial: "Body"}]
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
            icon:     '<i class="fas fa-plus"></i>',
            callback: element => {
                const itemID = element[0].dataset.itemId;
                const item = (this.actor.items.get(itemID));
                const newRank = Helper.checkSkillRank(item.system.rank - 1)
                item.update({"system.rank": newRank})
            }
        }
        ].concat(this._itemContextMenu);

    getData(options) {
        const data = super.getData();
        data.config = CONFIG.SBB;

        // Item filters
        data.filteredItems = {
            feats:       data.items.filter(function (item) {
                return item.type == "Feat"
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
            })
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

        Helper.updateArmourValues(this.actor);

        return data;
    }

    activateListeners(html) {
        html.find(".item-rollable").click(Helper.itemRoll.bind(this));
        html.find(".toggle-description").click(Helper.toggleLastFamily.bind(this));


        if (this.isEditable) {
            html.find(".health-input").change(Helper.checkvalBetween.bind(this, 0, this.actor.system.HP.max));
            html.find(".strain-input").change(Helper.checkvalBetween.bind(this, 0, this.actor.system.strain.max));
            html.find(".add-item-button").click(Helper.addItem.bind(this));
            html.find(".inline-edit").change(Helper.updateItem.bind(this));
            html.find(".fa-pen-to-square").click(Helper.editItem.bind(this));
            html.find(".armour-equipped-button").click(Helper.armourEquipped.bind(this));
            html.find(".effect-equipped-button").click(Helper.effectToggle.bind(this));
            html.find(".save-button").click(this._makeSave.bind(this));
            html.find(".untrained-button").click(this._rollUntrained.bind(this));

            new ContextMenu(html, ".skill-item", this._skillContextMenu);

            // item add/edit menu
            new ContextMenu(html, ".feat-card", this._itemContextMenu)
            new ContextMenu(html, ".equipment", this._itemContextMenu)
        }
    }

    _makeSave(event){
        event.preventDefault();

        Dice.makeSaveRoll({
            linkedAttribute : this.actor.system.rank,
            skillName: game.i18n.localize("SBB.common.saveroll")
        });
    }

    _rollUntrained(event){
        event.preventDefault();

        Dice.rollSkillFromID(this.actor._id, null,
            game.i18n.localize("SBB.npcSheet.rollUntrained")
        )
    }

}