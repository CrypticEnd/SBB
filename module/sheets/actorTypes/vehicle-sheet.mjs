import {SBBActorSheet} from "../SBBActorSheet.mjs";
import * as Helper from "../../helpers/actor-helper.mjs";

export class SBBVehicleSheet extends SBBActorSheet{

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["vehicle"],
            template: "systems/sbb/templates/sheets/actors/Vehicle-sheet.hbs",
            width: 670,
            tabs: [{ navSelector: ".main-tabs", contentSelector: ".nav-content-box", initial: "action" }],
            dragDrop:[
                {dragSelector: ".actor-list .actor", dropSelector: null},
                {dragSelector: ".item-list .item", dropSelector: null}
            ]
        });
    }

    async getData() {
        let data = super.getData();
        let config = CONFIG.SBB;
        let systemData = this.actor.system;

        // Gets a list of crew members with all the info we want
        let crew = this.actor.flags.sbb.crew;
        let crewDataList = [];
        let crewRoleDataList = [];

        // Loop backwards since we are editing the array during the loop
        for(let i=crew.list.length-1; i>=0; --i) {
            let actor = await fromUuid(crew.list[i].uuid);

            // If a crew actor is deleted (cannot be found) we remove it
            if (actor == null) {
                crew.list.splice(i, 1);
            }
            else{
                let crewData = {
                    uuid: actor.uuid,
                    id: actor.uuid.replace('Actor.', ''),
                    img: actor.img,
                    name: actor.name,
                    hp: actor.system.HP,
                    strain: actor.system.strain
                }
                crewDataList.push(crewData);
            }
        }

        // Get list of roles with all the role info we need
        for(let i=0; i<config.vehicleRoles.length; i++){
            let actor = (crew.roles.length > i) ?
                await fromUuid(crew.roles[i]) : null
            let roleData = {
                title: config.vehicleRoles[i],
                amount: (crew.amount.length > i) ?
                            crew.amount[i] : 0
            }

            if(actor == null) {
                roleData.name = "SBB.common.unknown";
            }
            else {
                roleData.name = actor.name;
            }

            crewRoleDataList.push(roleData);
        }

        // Update crew list
        this.actor.update({"flags.sbb.crew": crew});

        data.crew = {
            namedCrew: crewDataList.reverse(),
            roleList: crewRoleDataList,
        };

        return data;
    }

    activateListeners(html) {
        if (this.isEditable) {
            html.find(".fuel-input").change(Helper.checkvalBetween.bind(this, 0, this.actor.system.fuel.max));
            html.find(".commandPoint-input").change(Helper.checkvalBetween.bind(this, 0, 20));
            html.find(".crew-input").change(this._crewInput.bind(this));

            html.find(".vehicle-settings").click(this._showVehicleSettings.bind(this));
        }
        super.activateListeners(html);
    }

    // To create list of NPC/player crew
    async _onDropActor(event, data) {
        let actorData = await fromUuid(data.uuid)

        if(actorData.type == "NPC" || actorData.type == "Character"){
            let crew = this.actor.flags.sbb.crew.list;

            // Check if already a member of the crew
            if(!crew.find(key => key.uuid === data.uuid)){
                crew.push({uuid: data.uuid})

                await this.actor.update({
                    "flags.sbb.crew.list": crew
                });
            }
        }

        return super._onDropActor(event, data);
    }

    async _showVehicleSettings(event){
        event.preventDefault();
        const template = "systems/sbb/templates/sheets/partials/vehicle-hull-input-form.hbs";

        let passData = {
            config: CONFIG.SBB,
            actor:  this.actor
        }

        const html = await renderTemplate(template, passData);

        return new Promise(resolve => {
            const data = {
                title:   this.actor.name + " : " + game.i18n.localize("SBB.vehicle.statusLabels.settings"),
                content: html,
                buttons: {
                    normal: {
                        label:    game.i18n.localize("SBB.dialog.confirm"),
                        callback: html => resolve(this._updateVehicleValues(html[0].querySelector("form")))
                    },
                    cancel: {
                        label:    game.i18n.localize("SBB.dialog.cancel"),
                        callback: html => resolve({cancelled: true})
                    }
                },
                default: "normal",
                close:   () => resolve({cancelled: true})
            };

            new Dialog(data, null).render(true);
        });
    }

    _updateVehicleValues(form) {
        let actor = this.actor;

        let type = form.type.value;
        let vClass = form.class.value;
        let check = form.check.value;
        let hp = parseInt(form.hp.value);
        let speed = parseInt(form.speed.value);
        let armour = parseInt(form.armour.value);
        let fuel = parseInt(form.fuel.value);
        let crewMin = parseInt(form.crewMin.value);
        let crewMax = parseInt(form.crewMax.value);
        let power = parseInt(form.powerBase.value);
        let mass = form.mass.value;
        let mounts = parseInt(form.mounts.value);
        let tl = parseInt(form.tl.value);

        if(crewMin> crewMax){
            crewMin = crewMax;
        }

        actor.update({
            "system.type": type,
            "system.class": vClass,
            "system.check": check,
            "system.HP.base": hp,
            "system.speed": speed,
            "system.armour": armour,
            "system.fuel.max": fuel,
            "system.crew.min": crewMin,
            "system.crew.max": crewMax,
            "system.power.base": power,
            "system.mass": mass,
            "system.mounts": mounts,
            "system.tl": tl,
        });
    }

    _crewInput(event){
        event.preventDefault();
        let config = CONFIG.SBB;
        let element = event.currentTarget;
        let dataType =  parseInt(event.currentTarget.dataset.type);

        element.value = Math.floor(element.value);

        if(element.value<0){
            element.value = 0;
        }

        // check if datatype is in range
        if(config.vehicleRoles.length> dataType){
            let crew = this.actor.flags.sbb.crew;
            let crewAmount = crew.amount;
            crewAmount[dataType] = element.value;

            let crewsum = crewAmount.reduce((a,b) => parseInt(a)+parseInt(b),0) + crew.list.length;

            this.actor.update({
                "flags.sbb.crew.amount": crewAmount,
                "system.crew.value": crewsum
            });
        }
        else{
            console.error(game.i18n.localize("SBB/errors.outOfRange"));
        }
    }
}