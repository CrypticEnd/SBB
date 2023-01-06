export class SBBItem extends Item{
    chatTemplate = {
        "Feat" : "systems/sbb/templates/sheets/card/feat.hbs",
        "Weapon" : "systems/sbb/templates/sheets/card/weapon-roll.hbs"
        //TODO rest of temps
    }

    iconTemplate = {
        "Weapon": "systems/sbb/assets/svg/icons/weapon.svg",
        "Armour": "systems/sbb/assets/svg/icons/armor.svg",
        "Item": "systems/sbb/assets/svg/icons/gear.svg",
        //"Ammunition": "systems/sbb/assets/svg/icons/gear.svg",
        "Feat": "systems/sbb/assets/svg/icons/feat.svg",
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
        const item = this;
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });
        const content = this.type in this.chatTemplate ?
            await renderTemplate(this.chatTemplate[item.type], item)
            : "Roll function not set for this item"

        console.log(this.chatTemplate[item.type]);

        ChatMessage.create({
            user: game.user._id,
            speaker: speaker,
            content: content
        });
        }
}