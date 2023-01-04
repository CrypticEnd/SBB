export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([

        // Actor partials.
        "systems/sbb/templates/sheets/partials/character-attributes.hbs",
        "systems/sbb/templates/sheets/partials/tenets-box.hbs",
        "systems/sbb/templates/sheets/partials/health-box.hbs",
        "systems/sbb/templates/sheets/partials/feat-box.hbs",

        // Cards
        "systems/sbb/templates/sheets/card/feat.hbs",
        "systems/sbb/templates/sheets/card/tenet.hbs",

    ]);
};