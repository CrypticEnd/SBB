import {SBBActorSheet} from "../SBBActorSheet.mjs";

export class SBBVehicleSheet extends SBBActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["vehicle"],
            template: "systems/sbb/templates/sheets/actors/Vehicle-sheet.hbs",
            tabs: [{ navSelector: ".main-tabs", contentSelector: ".nav-content-box", initial: "action" }]
        });
    }


    // To create list of NPC/player crew
    async _onDropActor(event, data) {
        let actorData = await fromUuid(data.uuid)

        if(actorData.type == "NPC" || actorData.type == "Character"){
            // Check if already a member of the crew
            if(this.actor.flags.sbb.crew[data.uuid] == undefined){
                this.actor.flags.sbb.crew[data.uuid]=[];
            }
        }

        return super._onDropActor(event, data);
    }
}