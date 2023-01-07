import * as Helper from "../helpers/actor-helper.mjs";

export const contextMenus = {}

contextMenus.itemContextMenu =
    [
        {
            name: game.i18n.localize("SBB.common.edit"),
            icon : '<i class="fas fa-edit"></i>',
            callback: element=>{
                const itemID = element[0].dataset.type;
                const item = (this.actor.items.get(itemID));
                item.sheet.render(true);
            }},
        {
            name: game.i18n.localize("SBB.common.delete"),
            icon : '<i class="fas fa-trash"></i>',
            callback: element =>{
                const itemID = element[0].dataset.type;
                const item = (this.actor.items.get(itemID));
                item.delete();
            }}
    ];

contextMenus.skillContextMenu=
    [
        {
            name: game.i18n.localize("SBB.sills.add_rank"),
            icon: '<i class="fas fa-plus"></i>',
            callback: element => {
                const itemID = element[0].dataset.type;
                const item = (this.actor.items.get(itemID));
                const newRank = Helper.checkSkillRank(item.system.Rank+1)
                item.update({"system.Rank": newRank})
            }},{
        name: game.i18n.localize("SBB.sills.sub_rank"),
        icon: '<i class="fas fa-plus"></i>',
        callback: element => {
            const itemID = element[0].dataset.type;
            const item = (this.actor.items.get(itemID));
            const newRank = Helper.checkSkillRank(item.system.Rank-1)
            item.update({"system.Rank": newRank})
        }}
    ].concat(this._itemContextMenu);