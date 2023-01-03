export class SBBCharacterSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["character", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/Character-sheet.hbs",
            width: 600,
            height: 800,
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "main"}],
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.SBB;

        return data;
    }

    prepareDerivedData(){
        const actorData = this.system;

        // Work out HP
        //TODO HP value may change in future?
        actorData.HP = actorData.attributes.Fortitude * 10;
    }

    getRollData() {
        const data = super.getRollData();
        //TODO roll values

    }


    // Used for interacting with the sheet while its open!
    activateListeners(html) {
        html.find("#attributes-input").change(this._attributeScrollChange.bind(this))

        super.activateListeners(html);

    }

    _attributeScrollChange(event){
        event.preventDefault();
        let element = event.currentTarget;
        const decressValue = event.shiftKey;

        console.log(element.value);

        if(element.value>10){
            element.value = 10;
        }
        else if (element.value<1){
            element.value = 1;
        }
    }
}