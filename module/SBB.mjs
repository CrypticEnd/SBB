import {SBBItem} from "./documents/item.mjs";
import {SBBActor} from "./documents/actor.mjs";
import {SBBCombatant} from "./documents/combatant.mjs";
import {SBBMeasuredTemplate} from "./documents/scence objects/SBBMeasuredTemplate.mjs"
import {SBBSceneControls} from "./documents/scence objects/SBBSceneControls.mjs";
// Import sheet classes.
import { SBBCharacterSheet } from "./sheets/actorTypes/character-sheet.mjs";
import {SBBNPCSheet} from "./sheets/actorTypes/npc-sheet.mjs";
import {SBBVehicleSheet} from "./sheets/actorTypes/vehicle-sheet.mjs";
import { SBBItemSheet } from "./sheets/item-sheet.mjs";
import {SBBActiveEffectConfig} from "./sheets/SBBActiveEffectConfig.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { SBB } from "./helpers/config.mjs";
import * as Chat from "./helpers/chat.mjs";
import * as Macros from "./helpers/macro.mjs";

Hooks.once("init", function (){
    console.log("SBB | Loading Stars but Butter");

    // Add custom constants for configuration.
    CONFIG.SBB = SBB;
    CONFIG.Item.documentClass = SBBItem;
    CONFIG.Actor.documentClass = SBBActor;
    CONFIG.Combatant.documentClass = SBBCombatant;
    CONFIG.ActiveEffect.sheetClass = SBBActiveEffectConfig;
    CONFIG.MeasuredTemplate.objectClass = SBBMeasuredTemplate;
    CONFIG.ui.controls = SBBSceneControls;



    CONFIG.Combat.initiative = {
        formula: "1d10",
        decimals: 2
    };

    game.SBB = {
        macros: Macros
    };

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("SBBCharacter", SBBCharacterSheet, {
        types:["Character"],
        makeDefault: true,
        label: "SBB.SheetCharacter"
    });
    Actors.registerSheet("SBBNPC", SBBNPCSheet, {
        types:["NPC"],
        makeDefault: true,
        label: "SBB.SheetNPC"
    });
    Actors.registerSheet("SBBVehicleSheet", SBBVehicleSheet, {
        types:["Vehicle"],
        makeDefault: true,
        label: "SBB.SheetVehicle"
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("SBBItem", SBBItemSheet, {
        makeDefault: true ,
        label: "SBB.SheetItem"
    });

    DocumentSheetConfig.registerSheet(ActiveEffect, "SBB", SBBActiveEffectConfig, {
        makeDefault: true
    })


    Handlebars.registerHelper("repeat", function (n, content){
       let result = "";
       for (let i = 0; i < n; i++){
           //counts index so can acess while using helper
           content.data.index = i+1;
           result += content.fn(i);
       }
        return result;
    });

    Handlebars.registerHelper("multiply", function (item1, item2, content){
        return item1 * item2;
    });

    Handlebars.registerHelper("percent", function (current, max, content){
        return current/max*100;
    });

    // Preload Handlebars templates.
    return preloadHandlebarsTemplates();
});

Hooks.once("ready", function () {
    Hooks.on("hotbarDrop", (bar, data, slot) => {
        if ( ["Item"].includes(data.type) ) {
            Macros.createRollItemMacro(data, slot);
            return false;
        }

    });
});

Hooks.on("renderChatLog",  (app, html, data) =>{
    Chat.addChatListeners(html);
});

Hooks.on("renderChatMessage", (app, html, data) => {
    Chat.hideChatActionButtons(app,html,data);
});