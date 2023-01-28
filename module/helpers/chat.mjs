import * as Dice from "./dice.mjs"

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

    // Only for "token" attackers
    let tokenId = card.dataset.tokenId;
    if(tokenId != null){
        onTokenAttack(tokenId, card.dataset.itemId);
        return;
    }

    let attacker = game.actors.get(card.dataset.ownerId);
    let weapon = attacker.items.get(card.dataset.itemId);

    rollAttackGivenAttacker(attacker, weapon);
}

function onTokenAttack(tokenId, weaponId){
    // Token ID includes both a scene and a token ID
    let tokenSplit = tokenId.split("-");
    let sceneId;
    tokenId = null;

    // Search the array for the key values we need
    for (const [key, value] of Object.entries(tokenSplit)) {


        if(value.toLowerCase() == "scene"){
            sceneId = tokenSplit[parseInt(key)+1];
        }
        else if(value.toLowerCase() == "token"){
            tokenId = tokenSplit[parseInt(key)+1];
        }
    }

    // Check we have the values we need
    if(tokenId == null || sceneId == null){
        console.error(game.i18n.localize("SBB.errors.cannotFindForWeaponRoll"));
        return;
    }

    let scene = game.scenes.get(sceneId);
    let tokenActor = scene.tokens.get(tokenId);

    let weapon = tokenActor._actor.items.get(weaponId);

    rollAttackGivenAttacker(tokenActor._actor, weapon);
}

function rollAttackGivenAttacker(attacker, weapon){
    if(attacker==null || weapon == null){
        console.error(game.i18n.localize("SBB.errors.weaponOrAttackerUndefined"));
        return;
    }

    // make sure attacker has relevant skill
    const linkedSkill= weapon.system.skill;
    let skill = attacker.items.filter(function (skill) {
        return skill.type === "Skill" &&
            skill.name.toUpperCase() === game.i18n.localize(linkedSkill).toUpperCase()});

    if(skill.length === 0) {
        console.error(game.i18n.localize("SBB.errors.unfoundedSkill") + linkedSkill.toUpperCase());
        return;
    }

    Dice.rollSkillFromActorData(attacker, skill[0], weapon.name);
}

function onDamage(event){
    const card = event.currentTarget.parentNode;
    let attacker = game.actors.get(card.dataset.ownerId);
    let weapon = attacker.items.get(card.dataset.itemId);

    Dice.rollWeaponDamage(weapon);
}