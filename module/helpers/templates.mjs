export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([

        // Actor partials.
        "systems/sbb/templates/sheets/partials/actor-focuses.hbs",
        "systems/sbb/templates/sheets/partials/actor-values.hbs",
        "systems/sbb/templates/sheets/partials/feat-focuses.hbs",
    ]);
};