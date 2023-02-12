export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([

        // Actor partials.
        "systems/sbb/templates/sheets/partials/character-attributes.hbs",
        "systems/sbb/templates/sheets/partials/personal-box.hbs",
        "systems/sbb/templates/sheets/partials/status-box.hbs",
        "systems/sbb/templates/sheets/partials/vehicle-status-box.hbs",
        "systems/sbb/templates/sheets/partials/feat-box.hbs",
        "systems/sbb/templates/sheets/partials/skill-box.hbs",
        "systems/sbb/templates/sheets/partials/equipmant.hbs",
        "systems/sbb/templates/sheets/partials/injuries.hbs",
        "systems/sbb/templates/sheets/partials/enhancements.hbs",
        "systems/sbb/templates/sheets/partials/armourTable.hbs",
        "systems/sbb/templates/sheets/partials/npc-stat-input-form.hbs",

        // Active effects
        "systems/sbb/templates/sheets/activeEffect/activeEffect.hbs",

        // Cards
        "systems/sbb/templates/sheets/card/feat.hbs",
        "systems/sbb/templates/sheets/card/tenet.hbs",
        "systems/sbb/templates/sheets/card/check-roll.hbs",
        "systems/sbb/templates/sheets/card/weapon-roll.hbs",
        "systems/sbb/templates/sheets/card/sheet-item-basic.hbs",
        "systems/sbb/templates/sheets/card/damage-roll.hbs",
        "systems/sbb/templates/sheets/card/effect-table.hbs",
        "systems/sbb/templates/sheets/card/armour.hbs"

    ]);
};