import {SBB} from "../helpers/config.mjs"

export async function RollToCustomMessage(rollResult, template, extraData){
    let templateContext ={
        ...extraData,
        roll: rollResult,
        tooltip: await rollResult.getTooltip()
    };

    let chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        roll: rollResult,
        content: await renderTemplate(template, templateContext),
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
    };
    ChatMessage.create(chatData);
}

export async function skillCheck({
                                     skillMod = 0,
                                     linkedAttribute = 0,
                                     useTenet = false,
                                     currentStrain = 0,
                                     otherBonus = 0,
                                     skillName = ""
                                 })
{

    // tempplate
    const messageTemplate = "systems/sbb/templates/sheets/card/check-roll.hbs";

    if (linkedAttribute == null) {
        console.error("Linked Attribute not defined")
        return
    }

    let rollFormula = "min(1d10, @limit)";
    let fakeFormula;
    let totalMod = skillMod + otherBonus-Math.floor(currentStrain / 2);

    if (useTenet) {
        rollFormula = rollFormula + "+10";
        fakeFormula = "1d10L" + linkedAttribute + "+10";
    }
    else {
        rollFormula = rollFormula + "+" + rollFormula;
        fakeFormula = "2d10L" + linkedAttribute;
    }

    // Fake formula is needed for user to see a more nicely written formula
    fakeFormula+= totalMod>0 ? "+" : "";
    fakeFormula+= totalMod.toString();

    rollFormula = rollFormula + "+@mod";

    let rollData = {
        limit:     linkedAttribute,
        mod:       totalMod
    }
    let messageData = {
        speaker: ChatMessage.getSpeaker()
    }

    let roll = new Roll(rollFormula, rollData);
    let rollresult = await roll.roll({
        async: true
    });

    RollToCustomMessage(rollresult, messageTemplate, {
        type: SBB.common.skillCheck,
        checkName: skillName,
        formula: fakeFormula
    });
}


export async function save({
                               linkedAttribute = 0,
                               otherMod = 0
                           })
{
    if (linkedAttribute == null) {
        console.error("Linked Attribute not defined")
        return
    }

    let rollFormula = "1d10+@mod";//TODO find a way to show pass/fail without counting

    let rollData = {
        mod:       otherMod
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