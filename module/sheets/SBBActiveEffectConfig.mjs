export class SBBActiveEffectConfig extends ActiveEffectConfig{
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/sbb/templates/sheets/activeEffect/activeEffect.hbs",
        });
    }

    getData(options) {
        const data = super.getData(options);

        data.config = CONFIG.SBB;

        return data;
    }
}