export class SBBItem extends Item{
    chatTempplate = {
        "Feat" : "systems/sbb/templates/sheets/partials/card/feat.hbs"
        //TODO rest of temps
    }

    iconTempplate = {
        "Feat": "systems/sbb/assets/svg/icons/feat.svg",
        "Weapon": "systems/sbb/assets/svg/icons/weapon.svg",
        "Armour": "systems/sbb/assets/svg/icons/armor.svg",
        "Item": "systems/sbb/assets/svg/icons/gear.svg",
        // "Starship Fittings":
        // "Starship Defenses":
        // "Starship Weaponry:
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        if(this.type in this.iconTempplate) {
            this.updateSource({
                img: this.iconTempplate[this.type]
        })};
    }

    async roll(){
        const item = this;
        const speaker = ChatMessage.getSpeaker({ actor: this.actor });

        ChatMessage.create({
            user: this.user._id,
            speaker: speaker,
            content: await renderTemplate(this.chatTempplate[item.type], item)
        });

        return roll;
        }
}