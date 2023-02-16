export class SBBActiveEffectConfig extends ActiveEffectConfig{
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/sbb/templates/sheets/activeEffect/activeEffect.hbs",
        });
    }

    getData(options) {
        const data = super.getData(options);
        const config = CONFIG.SBB;
        const itemType = this.object.parent.type;

        data.config = config;

        if(itemType == "Effect"){
            data.effectTypes =config.activeEffectValuesDefualt;
        }

        return data;
    }
}