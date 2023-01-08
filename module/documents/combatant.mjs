export class SBBCombatant extends Combatant{

    _getInitiativeFormula() {
        let actorType = this.actor.type;
        let formula = "1d10";

        console.log(actorType)

        if(actorType == "Character"){
            let strainMod = 0;
            if("StrainMod" in this.actor.flags.sbb){
                strainMod = this.actor.flags.sbb.StrainMod;
            }

            formula = "min(1d10, @attributes.Reflex)+min(1d10, @attributes.Reflex) " +
            "+ @attributes.Reflex/10" + // a .value to help with Ties
            "@modifiers.Initiative - " + strainMod;
        }

        return formula;
    }
}