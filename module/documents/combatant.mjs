export class SBBCombatant extends Combatant{

    _getInitiativeFormula() {
        let actorData = this.actor;
        let actorType = actorData.type;
        let baseformula = "1d10";
        let attribute = 0;
        let allMods = 0;

        if(actorType == "Character" || actorType == "NPC"){
            if(actorType=="Character"){
                attribute = this.actor.system.attributes.reflex.rank;
            }
            else{
                attribute = this.actor.system.rank;
            }
            let strainMod = this.actor.flags?.sbb?.strainMod ?
                this.actor.flags.sbb.strainMod : 0;

            allMods = (attribute/10)
                + actorData.system.modifiers.initiative
                - strainMod;
        }

        return baseformula + "+"
                    + attribute + "+"
                    + allMods;
    }
}