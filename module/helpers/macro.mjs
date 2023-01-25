
export async function createRollItemMacro(data, slot){
    const macroData = { type: "script", scope: "actor" };

    switch ( data.type ) {
        case "Item":
            const itemData = await Item.implementation.fromDropData(data);
            if ( !itemData ) return ui.notifications.warn(game.i18n.localize("SBB.warning.macroUnknown"));
            foundry.utils.mergeObject(macroData, {
                name: itemData.name,
                img: itemData.img,
                command: `game.SBB.macros.rollItem("${itemData.name}")`,
                flags: {"SBB.itemMacro": true}
            });
            break;
            // case "ActiveEffect":
            //     const effectData = await ActiveEffect.implementation.fromDropData(dropData);
            //     if ( !effectData ) return ui.notifications.warn(game.i18n.localize("MACRO.5eUnownedWarn"));
            //     foundry.utils.mergeObject(macroData, {
            //         name: effectData.label,
            //         img: effectData.icon,
            //         command: `dnd5e.documents.macro.toggleEffect("${effectData.label}")`,
            //         flags: {"dnd5e.effectMacro": true}
            //     });
            // break;
        default:
            return;
    }

    // Assign the macro to the hotbar
    const macro = game.macros.find(m => (m.name === macroData.name) && (m.command === macroData.command)
        && m.author.isSelf) || await Macro.create(macroData);
    game.user.assignHotbarMacro(macro, slot);
}


export function rollItem(itemName) {
    return getMacroTarget(itemName, "Item")?.roll();
}

function getMacroTarget(name, documentType) {
    let actor;
    const speaker = ChatMessage.getSpeaker();
    if ( speaker.token ) actor = game.actors.tokens[speaker.token];
    actor ??= game.actors.get(speaker.actor);
    if ( !actor ) return ui.notifications.warn(game.i18n.localize("SBB.warning.noActorSelected"));

    const collection = (documentType === "Item") ? actor.items : actor.effects;
    const nameKeyPath = (documentType === "Item") ? "name" : "label";

    // Find item in collection
    const documents = collection.filter(i => foundry.utils.getProperty(i, nameKeyPath) === name);
    const type = game.i18n.localize(`DOCUMENT.${documentType}`);
    if ( documents.length === 0 ) {
        return ui.notifications.warn(game.i18n.format("SBB.warning.missingTarget", { actor: actor.name, type, name }));
    }
    if ( documents.length > 1 ) {
        ui.notifications.warn(game.i18n.format("SBB.warning.multipleTargets", { actor: actor.name, type, name }));
    }
    return documents[0];
}