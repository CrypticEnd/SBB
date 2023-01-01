// Import document classes.
import { SBBActor } from "./documents/actor.mjs";
import { SBBItem } from "./documents/item.mjs";
// Import sheet classes.
import { SBBActorSheet } from "./sheets/actor-sheet.mjs";
import { SBBItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { SBB } from "./helpers/config.mjs";


Hooks.once("init", function (){
    console.log("SBB | Loading Stars but Butter");

    game.SBB = {
        SBBActor,
        SBBItem
    };

    // Add custom constants for configuration.
    CONFIG.SBB = SBB;

    /**
     * TODO
     * Set an initiative formula for the system
     * @type {String}
     */
    CONFIG.Combat.initiative = {
        formula: "1d20",
        decimals: 2
    };

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("boilerplate", SBBActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("boilerplate", SBBItemSheet, { makeDefault: true });

    // Preload Handlebars templates.
    return preloadHandlebarsTemplates();
});