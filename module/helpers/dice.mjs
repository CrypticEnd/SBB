import {SBB} from "./config.mjs"

// Template
const defaultRollTemplate = "systems/sbb/templates/sheets/card/check-roll.hbs";
const defualtDamageTemplate = "systems/sbb/templates/sheets/card/damage-roll.hbs";

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
                                     skillName = "",
                                 })
{
    let rollFormula = "min(1d10, @limit)";
    let fakeFormula;
    let totalMod = skillMod + otherBonus-Math.floor(currentStrain * CONFIG.SBB.settings.strainPenaltyMod);

    if (useTenet) {
        rollFormula = rollFormula + "+10";
        fakeFormula = "1d10L" + linkedAttribute + "+10";
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
    let messageData = {
        speaker: ChatMessage.getSpeaker()
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
        console.error("Linked Attribute not defined")
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
        console.error("Weapon or weapon formula undefined");
        return
    }

    let roll = new Roll(weapon.system.formula);
    let rollresult = await roll.roll({
        async: true
    });

    let harmCounter = await countHarmDie(rollresult, weapon.system.harmRange);

    //TODO if cant do critical though chat can do it here
    RollToCustomMessage(rollresult, defualtDamageTemplate, {
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

export function rollSkillFromID(actorID, skillID, contentName = null){
    // Get actor and item
    let actor = game.actors.get(actorID);
    let skill = actor.items.get(skillID);

    if(actor == null || skill == null){
        console.error("Skill roll called with improper values");
        return;
    }

    const linkedAttributeName = skill.system.Attribute;

    // Should never happen, but oh well
    if( !linkedAttributeName.toLowerCase() in CONFIG.SBB.skillTypes
        && !linkedAttributeName in actor.system.attributes)
    {
        console.error("'${saveType}' is not a valid attribute for a skill");
        return;
    }

    if(contentName === null)
        contentName = skill.name;

    let linkedAttributeValue = actor.system.attributes[linkedAttributeName];

    let strain = actor.system.Strain.max - actor.system.Strain.value;

    this.skillCheck({
        skillMod : skill.system.Rank,
        linkedAttribute : linkedAttributeValue,
        currentStrain : strain,
        skillName : contentName,
        //TODO setup Tenet
    })
}