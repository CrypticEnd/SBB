import {SBBActorSheet} from "../SBBActorSheet.mjs";

export class SBBVehicleSheet extends SBBActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["vehicle"],
            template: "systems/sbb/templates/sheets/actors/Vehicle-sheet.hbs",
            tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "sheet" }]
        });
    }


}