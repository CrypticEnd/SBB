export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([

        // Actor partials.
        "systems/sbb/templates/sheets/partials/character-attributes.hbs",
        "systems/sbb/templates/sheets/partials/health-box.hbs",

    ]);
};