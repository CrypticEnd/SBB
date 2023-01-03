// Import sheet classes.
import { SBBCharacterSheet } from "./sheets/character-sheet.mjs";
import { SBBItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { SBB } from "./helpers/config.mjs";

Hooks.once("init", function (){
    console.log("SBB | Loading Stars but Butter");

    // Add custom constants for configuration.
    CONFIG.SBB = SBB;

    /**
     * TODO
     * Set an initiative formula for the system
     * @type {String}
     */
    CONFIG.Combat.initiative = {
        formula: "min(1d10, @attributes.Reflex)+min(1d10, @attributes.Reflex) " +
                     "+ @attributes.Reflex/10", // a .value to help with Ties
        decimals: 1
    };

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("SBBCharacter", SBBCharacterSheet, {
        types:["Character"],
        makeDefault: true,
        label: "SBB.SheetCharacter"
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("SBBItem", SBBItemSheet, {
        makeDefault: true ,
        label: "SBB.SheetItem"
    });

    Handlebars.registerHelper("repeat", function (n, content){
       let result = "";
       for (let i = 0; i < n; i++){
           //counts index so can acess while using helper
           content.data.index = i+1;
           result += content.fn(i);
       }
        return result;
    });

    // Preload Handlebars templates.
    return preloadHandlebarsTemplates();
});