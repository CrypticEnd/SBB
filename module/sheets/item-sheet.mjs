import {mergeObject} from "../../ref/common/utils/helpers.mjs";

export class SBBItemSheet extends  ItemSheet {

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 340,
            classes: ["SBB", "sheet", "item"]
        })
    }

    get template(){
        return 'systems/sbb/templates/' + this.item.type + '-sheet.html';
    }

    getData() {
        const data = super.getData();

        data.config = CONFIG.SBB;

        return data;
    }
}