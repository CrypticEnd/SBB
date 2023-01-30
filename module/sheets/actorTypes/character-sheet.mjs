import * as Dice from "../../helpers/dice.mjs";
import * as Helper from "../../helpers/actor-helper.mjs";
import {SBBActorSheet} from "../SBBActorSheet.mjs";

export class SBBCharacterSheet extends SBBActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes:  ["character"],
            template: "systems/sbb/templates/sheets/actors/Character-sheet.hbs",
            tabs:     [{navSelector: ".main-tabs", contentSelector: ".nav-context-box", initial: "personal"},
                       {navSelector: ".skills-tabs", contentSelector: ".skills-content", initial: "Body"}
            ],
        });
    }

    getData() {
        const data = super.getData();

        this.actor.setFlag('sbb', 'strainMod', Helper.workOutStrain(this.actor.system.strain));
        this.actor.setFlag('sbb', 'attributeCount', this._countAttributes())

        Helper.updateArmourValues(this.actor);

        return data;
    }

    // Used for interacting with the sheet while its open!
    activateListeners(html) {
        // non editors
        html.find(".tenet-focus-card").click(this._tenetSwitch.bind(this));
        html.find(".save-roll").click(this._rollSave.bind(this));

        //Edit Listeners
        if (this.isEditable) {
            html.find(".attributes-input").change(Helper.checkvalBetween.bind(
                this, CONFIG.SBB.settings.attributesRanks.min, CONFIG.SBB.settings.attributesRanks.max));
            html.find(".xp-input").change(Helper.forceRoundDown.bind(this));
            html.find(".resolve-input").change(Helper.checkvalBetween.bind(this, 0, 10));
            html.find(".strain-marker").click(this._onStrainChange.bind(this));
            html.find(".toggle-tenet").click(this._toggleTenet.bind(this));
            html.find(".toggle-focus").click(this._toggleFocus.bind(this));

            // strain reset context menu
            new ContextMenu(html, ".strain-marker", [{
                name:     game.i18n.localize("SBB.common.clear_strain"),
                icon:     '<i class="fas fa-edit"></i>',
                callback: element => {
                    this.actor.update({"system.strain.value": this.actor.system.strain.max});
                }
            }]);

            // Skill add/take away rank context menu
            new ContextMenu(html, ".skill-item", this._skillContextMenu);

            // item add/edit menu
            new ContextMenu(html, ".tenet-focus-card", this._itemContextMenu)

        }
        super.activateListeners(html);
    }

    _countAttributes() {
        let counter = 0;

        for (const [key, value] of Object.entries(this.actor.system.attributes)) {
            counter += value;
        }

        return counter;
    }

    _toggleTenet() {
        let actor = this.actor;
        let current = actor.system.usingTenet;
        actor.update({"system.usingTenet": !current})
    }

    _toggleFocus() {
        let actor = this.actor;
        let current = actor.system.usingFocus;
        actor.update({"system.usingFocus": !current})
    }

    _onStrainChange(event) {
        event.preventDefault();
        let strainCount = this.actor.system.strain;
        let index = event.currentTarget.dataset.type;
        let newValue = index - 1;

        if (newValue == strainCount.value) {
            newValue++;
        }

        this.actor.update({"system.strain.value": newValue});
    }

    _tenetSwitch(event) {
        event.preventDefault();
        const itemID = event.currentTarget.dataset.itemId;
        const item = (this.actor.items.get(itemID));

        // check if type is a tent else return
        if (item.type !== "Tenet") return;

        item.update({"system.used": !item.system.used});
    }

    _rollSave(event) {
        event.preventDefault();
        const saveType = event.currentTarget.dataset.type;

        let saveTypes = this.getData().config.saveTypes;

        if (!saveType.toLowerCase() in saveTypes
            && !saveType in this.actor.system.attributes)
        {
            console.error(saveTypes + game.i18n.localize("SBB.errors.invalidAttribute"));
            return;
        }
        let linkedAttribute = this.actor.system.attributes[saveType.toLowerCase()];

        Dice.makeSaveRoll({
            linkedAttribute: linkedAttribute,
            skillName:       saveTypes[saveType.toLowerCase()]
        });
    }
}