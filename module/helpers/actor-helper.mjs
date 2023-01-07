export function checkvalBetween(minVal, maxVal, event){
    event.preventDefault();
    let element = event.currentTarget;

    element.value = Math.floor(element.value);

    if(element.value>maxVal){
        element.value = maxVal;
    }
    else if (element.value<minVal){
        element.value = minVal;
    }
}

export function addItem(event){
    event.preventDefault();
    let itemType = event.currentTarget.dataset.type;

    let itemData ={
        name:game.i18n.localize("SBB.common.newItem"),
        type: itemType
    };

    if(itemType == "Skill"){
        itemData =  Object.assign({
            system: {
                Attribute: event.currentTarget.dataset.category
            }}, itemData);
        }

    Item.create(itemData, {parent: this.actor});
}