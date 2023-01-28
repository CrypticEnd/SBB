import * as Dice from "../helpers/dice.mjs";
import * as Helper from "../helpers/actor-helper.mjs";

export class SBBNPCSheet extends ActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["NPC", "sheet", "actor"],
            template: "systems/sbb/templates/sheets/actors/NPC-sheet.hbs",
            width: 680,
            height: 800,
            tabs: [{ navSelector: ".main-tabs", contentSelector: ".nav-content", initial: "skills" },
                {navSelector: ".skills-tabs", contentSelector: ".skills-content", initial: "Body"}]
        });
    }

    getData(options) {
        const data = super.getData();
        data.config = CONFIG.SBB;

        // Item filters
        data.filteredItems = {
            feats:  data.items.filter(function (item) {return item.type == "Feat"}),
            attacks:  data.items.filter(function (item) {return item.type == "Weapon"}),
            consumables:  data.items.filter(function (item) {return item.type == "Consumable"}),
            armour:  data.items.filter(function (item) {return item.type == "Armour"}),
            otherItems:  data.items.filter(function (item) {return item.type == "Item"}),

            enhancementDrug: data.items.filter(function (item) {return item.type == "Effect"
                && item.system.type == "SBB.effects.drug"}),
            enhancementImplant: data.items.filter(function (item) {return item.type == "Effect"
                && item.system.type == "SBB.effects.implant"}),
            injury: data.items.filter(function (item) {return item.type == "Effect"
                && item.system.type == "SBB.effects.injury"})
        }

        let skills = data.items.filter(function (item) {return item.type == "Skill"});
        data.filteredItems.skills = {};

        for (const [key,value] of Object.entries(data.config.skillTypes)){
            data.filteredItems.skills[key] = skills.filter(function (item) {return item.system.attribute==key});
        }


        return data;
    }

}