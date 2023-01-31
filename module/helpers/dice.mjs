import {SBB} from "./config.mjs"

// Template
const defaultRollTemplate = "systems/sbb/templates/sheets/card/check-roll.hbs";
const defaultDamageTemplate = "systems/sbb/templates/sheets/card/damage-roll.hbs";

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
                                     strainMod = 0,
                                     otherBonus = 0,
                                     skillName = "",
                                 })
{
    let rollFormula = "min(1d10, @limit)";
    let fakeFormula;
    let totalMod = skillMod + otherBonus-strainMod;

    if (useTenet) {
        let tenetBonus = CONFIG.SBB.settings.tenetBonus;
        rollFormula = rollFormula + "+" + tenetBonus;
        fakeFormula = "1d10L" + linkedAttribute + "+" + tenetBonus;
    }
    else {
        rollFormula = rollFormula + "+" + rollFormula;
        fakeFormula = "2d10L" + linkedAttribute;
    }

    // Fake formula is needed for user to see a more nicely written formula
    fakeFormula+= totalMod>=0 ? "+" : "";
    fakeFormula+= totalMod.toString();

    rollFormula = rollFormula + "+@mod";

    let rollData = {
        limit:     linkedAttribute,
        mod:       totalMod
    }

    let roll = new Roll(rollFormula, rollData);
    let rollresult = await roll.roll({
        async: true
    });

    RollToCustomMessage(rollresult, defaultRollTemplate, {
        type: SBB.common.skillCheck,
        checkName: skillName,
        formula: fakeFormula,
    });
}


export async function makeSaveRoll({
                               linkedAttribute = 0,
                               otherMod = 0,
                               skillName = ""
                           })
{
    if (linkedAttribute == null) {
        console.error(game.i18n.localize("SBB.errors.linkedTribeUndefined"));
        return
    }

    let rollFormula = "1d10+@mod";
    let fakeFormula = "1d10<=" + linkedAttribute;

    let rollData = {
        mod:       otherMod
    }
    let messageData = {
        speaker: ChatMessage.getSpeaker()
    }

    let roll = new Roll(rollFormula, rollData);
    let rollresult = await roll.roll({
        async: true
    });

    let passed = rollresult.total <= linkedAttribute;
    let outcome = passed ?
        SBB.common.skillPass : SBB.common.skillFail;

    RollToCustomMessage(rollresult, defaultRollTemplate, {
        type: SBB.common.skillCheck,
        checkName: skillName,
        formula: fakeFormula,
        difficulty: linkedAttribute,
        outcome : outcome,
        passed : passed
    })
}

export async function rollWeaponDamage(weapon){
    if(weapon == null || weapon.system.formula === ""){
        console.error(game.i18n.localize("SBB.errors.weaponFormulaUndefined"));
        return
    }

    let roll = new Roll(weapon.system.formula);
    let rollresult = await roll.roll({
        async: true
    });

    let harmCounter = await countHarmDie(rollresult, weapon.system.harmRange);

    RollToCustomMessage(rollresult, defaultDamageTemplate, {
        weaponName: weapon.name,
        formula: weapon.system.formula,
        harmCounter: (harmCounter>0) ? harmCounter : null
    });
}

export async function countHarmDie(rollresult, harmRange){
    // dont want harm range to be negative
    if(harmRange == null || harmRange<0)
        harmRange = 0;

    let harmDieCounter = 0;

    rollresult?.terms.forEach(element =>{
        if(element.faces != null){
            element.results.forEach(result => {
                if(element.faces-harmRange <= result.result){
                    harmDieCounter++;
                }
            });
        }
    });

    return harmDieCounter;
}

export async function rollSkillFromActorData(actor, skill = null, contentName = null){
    // Setup final values
    let linkedAttributeValue = 1;
    let useTenet = false;
    let otherbonus = 0;
    let strainMod = 0;
    let skillRank = 0;

    // General Error checking
    if(actor == null){
        console.error(game.i18n.localize("SBB.errors.Actor")
            + game.i18n.localize("SBB.errors.notFoundByID")
            + actorID);
        return;
    }
    if(skill != null){
        skillRank = skill.system.rank;

        if(contentName === null)
            contentName = skill.name;
    }

    // Check if strain mod is set
    if("sbb" in actor.flags && "strainMod" in actor.flags.sbb){
        strainMod = actor.flags.sbb.strainMod;
    }

    // Deprive values based on actor type
    if(actor.type == "Character") {
        if(skill== null){
            console.error(game.i18n.localize("SBB.errors.character")
            + game.i18n.localize("SBB.errors.cannotRollLinkedSkill"));
            return;
        }

        const linkedAttributeName = skill.system.attribute;
        // Should never happen, but oh well
        if (!linkedAttributeName.toLowerCase() in CONFIG.SBB.skillTypes
            && !linkedAttributeName in actor.system.attributes)
        {
            console.error(linkedAttributeName
                + game.i18n.localize("SBB.errors.invalidAttribute"));
            return;
        }
        linkedAttributeValue = actor.system.attributes[linkedAttributeName.toLowerCase()];

        // Skill other mod
        otherbonus += actor.system.modifiers.skillMod;

        // Check Tenets and focuses
        useTenet = actor.system.usingTenet;
        if(actor.system.usingFocus){
            otherbonus += CONFIG.SBB.settings.focusBonus;
        }
    }
    else if(actor.type == "NPC"){
        linkedAttributeValue = actor.system.rank;
        otherbonus += actor.system.modifiers.skillMod;
    }

    this.skillCheck({
        skillMod : skillRank,
        linkedAttribute : linkedAttributeValue,
        strainMod : strainMod,
        skillName : contentName,
        useTenet : useTenet,
        otherBonus : otherbonus
    })
}

