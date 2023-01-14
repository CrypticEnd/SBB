import * as Dice from "../helpers/dice.mjs";

export class SBBItem extends Item{
    chatTemplate = {
        "Weapon" : "systems/sbb/templates/sheets/card/weapon-roll.hbs",
        "default" : "systems/sbb/templates/sheets/card/default.hbs"
    }

    iconTemplate = {
        "Weapon": "systems/sbb/assets/svg/icons/weapon.svg",
        "Armour": "systems/sbb/assets/svg/icons/armor.svg",
        "Item": "systems/sbb/assets/svg/icons/gear.svg",
        "Consumable": "systems/sbb/assets/svg/icons/crosshair.svg",
        "Feat": "systems/sbb/assets/svg/icons/feat.svg",
        "Enhancement": "systems/sbb/assets/svg/icons/focus.svg",
        // "Starship Fittings":
        // "Starship Defenses":
        // "Starship Weaponry:
        "Skill": "systems/sbb/assets/svg/icons/skill.svg",
        "Tenet": "systems/sbb/assets/svg/icons/tenet.svg",
        "Focus": "systems/sbb/assets/svg/icons/focus.svg"
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        if(this.type in this.iconTemplate) {
            this.updateSource({
                img: this.iconTemplate[this.type]
        })};
    }

    async roll(){
        let item = this;
        item.config = CONFIG.SBB;

        if(item.type == "Skill"){
            let actor;
            const speaker = ChatMessage.getSpeaker();
            if ( speaker.token ) actor = game.actors.tokens[speaker.token];
            actor ??= game.actors.get(speaker.actor);
            if ( !actor ) return ui.notifications.warn(game.i18n.localize("SBB.warning.noActorSelected"));

            return Dice.rollSkillFromID(actor._id, item._id);
        }

        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        const content = this.type in this.chatTemplate ?
            await renderTemplate(this.chatTemplate[item.type], item)
            : await renderTemplate(this.chatTemplate["default"], item)

        ChatMessage.create({
            user: game.user._id,
            speaker: speaker,
            content: content
        });
        }
}