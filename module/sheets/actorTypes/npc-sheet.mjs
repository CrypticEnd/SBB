import * as Dice from "../../helpers/dice.mjs";
import * as Helper from "../../helpers/actor-helper.mjs";
import {SBBActorSheet} from "../SBBActorSheet.mjs";

export class SBBNPCSheet extends SBBActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes:  ["NPC"],
            template: "systems/sbb/templates/sheets/actors/NPC-sheet.hbs",
            width:    680,
            height:   800,
            tabs:     [{navSelector: ".main-tabs", contentSelector: ".nav-content", initial: "skills"},
                       {navSelector: ".skills-tabs", contentSelector: ".skills-content", initial: "Body"}]
        });
    }

    getData() {
        const data = super.getData();

        this.actor.setFlag('sbb', 'strainMod', Helper.workOutStrain(this.actor.system.strain));

        Helper.updateArmourValues(this.actor);

        return data;
    }

    activateListeners(html) {
        html.find(".save-button").click(this._makeSave.bind(this));
        html.find(".untrained-button").click(this._rollUntrained.bind(this));

        if (this.isEditable) {
            html.find(".health-input").change(Helper.checkvalBetween.bind(this, 0, this.actor.system.HP.max));
            html.find(".strain-input").change(Helper.checkvalBetween.bind(this, 0, this.actor.system.strain.max));

            html.find(".npc-settings").click(this._showNPCSettings.bind(this));

            new ContextMenu(html,".status-box", [{
                name:     game.i18n.localize("SBB.npcSheet.reset"),
                icon:     '<i class="fas fa-plus"></i>',
                callback: element => {
                    this.actor.update({"system.HP.value": this.actor.system.HP.max});
                    this.actor.update({"system.strain.value": this.actor.system.strain.max});
                }
            }]);
        }

        super.activateListeners(html);
    }

    _makeSave(event) {
        event.preventDefault();

        Dice.makeSaveRoll({
            linkedAttribute: this.actor.system.rank,
            skillName:       game.i18n.localize("SBB.common.saveroll")
        });
    }

    _rollUntrained(event) {
        event.preventDefault();

        Dice.rollSkillFromActorData(this.actor, null,
            game.i18n.localize("SBB.npcSheet.rollUntrained")
        )
    }

    async _showNPCSettings(event) {
        event.preventDefault();
        const template = "systems/sbb/templates/sheets/partials/npc-stat-input-form.hbs";

        let passData = {
            config: CONFIG.SBB,
            actor:  this.actor
        }

        const html = await renderTemplate(template, passData);

        return new Promise(resolve => {
            const data = {
                title:   this.actor.name + game.i18n.localize("SBB.npcSheet.inputDialog"),
                content: html,
                buttons: {
                    normal: {
                        label:    game.i18n.localize("SBB.dialog.confirm"),
                        callback: html => resolve(this._updateNPCValues(html[0].querySelector("form")))
                    },
                    cancel: {
                        label:    game.i18n.localize("SBB.dialog.cancel"),
                        callback: html => resolve({cancelled: true})
                    }
                },
                default: "normal",
                close:   () => resolve({cancelled: true})
            };

            new Dialog(data, null).render(true);
        });
    }

    _updateNPCValues(form) {
        let actor = this.actor;

        let rank = parseInt(form.rank.value);
        let move = parseInt(form.move.value);
        let hpMod = parseInt(form.hp.value);
        let strainMod = parseInt(form.strain.value);
        let initiativeMod = parseInt(form.initiative.value);

        actor.update({"system.rank": rank,
            "system.move": move,
            "system.modifiers.HP": hpMod,
            "system.modifiers.strain": strainMod,
            "system.modifiers.initiative": initiativeMod});
    }
}