export class SBBCombatant extends Combatant{

    _getInitiativeFormula() {
        let actorType = this.actor.type;
        let formula = "1d10";

        if(actorType == "Character"){
            let strainMod = 0;
            if("strainMod" in this.actor.flags.sbb){
                strainMod = this.actor.flags.sbb.strainMod;
            }

            formula = "1d10 + @attributes.reflex" +
            "+ @attributes.reflex/10" + // a .value to help with Ties
            "@modifiers.initiative - " + strainMod;
        }

        return formula;
    }
}