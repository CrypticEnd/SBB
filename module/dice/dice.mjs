export async function skillCheck({
                                     skillMod = 0,
                                     linkedAttribute = 0,
                                     useTenet = false,
                                     currentStrain = 0,
                                     otherBonus = 0
                                 })
{

    if (linkedAttribute == null) {
        console.error("Linked Attribute not defined")
        return
    }

    let rollFormula = "min(1d10, @limit)";
    if (useTenet)
        rollFormula = rollFormula + "+10"
    else
        rollFormula = rollFormula + "+" + rollFormula;

    rollFormula = rollFormula + "+@mod";

    let rollData = {
        limit:     linkedAttribute,
        mod:       skillMod + otherBonus-Math.floor(currentStrain / 2)
    }
    let messageData = {
        speaker: ChatMessage.getSpeaker()
    }

    let roll = new Roll(rollFormula, rollData);
    await roll.roll({
        async: true
    });
    roll.toMessage(rollData);
}


