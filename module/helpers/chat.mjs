import * as Dice from "./dice.mjs"

export const highlightSkillCheckResults = function (message, html, data){
    if(!message.isRoll || !message.isContentVisible)
        return;

    const skillCheck = html.find(".skill-roll");
    if(!skillCheck)
        return;

    const roll = message.rolls[0];
    let criticalSuccess = false;
    let criticalFail = false;



    if(roll._dice.length === 1){
        criticalSuccess = roll._dice[0].results.result === 10;
        criticalFail = roll._dice[0].results.result === 1;
    }
    else if (roll._dice.length ===2){
        criticalSuccess = roll._dice[0].results.result === 10
        && roll._dice[1].results.result == 10;

        criticalFail = roll._dice[0].results.result === 1
            && roll._dice[1].results.result === 1;
    }

    if(criticalSuccess){
        skillCheck.find(".dice-total").addClass("true")
    }

    if(criticalFail){
        skillCheck.find(".dice-total").addClass("false")
    }
}

export function hideChatActionButtons(message, html, data){
    const chatCard = html.find(".SBB.weapon-roll");
    if(chatCard.length == 0){
        return;
    }

    // Get actor
    let actor = game.actors.get(chatCard.attr("data-owner-id"));

    if(!actor?.isOwner){
        const buttonsOwners = chatCard.find(".weapon-buttons");
        buttonsOwners[0].style.display = "none";
    }
}


//~~~~~~~~~~~~~~~~~~~~~ Chat Listeners ~~~~~~~~~~~~~~~~~~~~~~~~~~\\
export function addChatListeners(html){
    html.on('click', 'button.attack', onAttack);
    html.on('click', 'button.damage', onDamage);
}

function onAttack(event){
    const card = event.currentTarget.parentNode;
    let attacker = game.actors.get(card.dataset.ownerId);
    let weapon = attacker.items.get(card.dataset.itemId);

    // make sure attacker has relevant skill
    const linkedSkill= weapon.system.skill;
    let skill = attacker.items.filter(function (skill) {
        return skill.type === "Skill" &&
                skill.name.toUpperCase() === game.i18n.localize(linkedSkill).toUpperCase()});

    if(skill.length === 0) {
        console.error("No skill found with name of: " + linkedSkill.toUpperCase());
        return;
    }

    Dice.rollSkillFromID(attacker._id, skill[0].id, weapon.name);
}

function onDamage(event){
    const card = event.currentTarget.parentNode;
    let attacker = game.actors.get(card.dataset.ownerId);
    let weapon = attacker.items.get(card.dataset.itemId);

    Dice.rollWeaponDamage(weapon);
}