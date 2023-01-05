export const highlightSkillCheckResults = function (message, html, data){
    if(!message.isRoll || !message.isContentVisible)
        return;

    const skillCheck = html.find(".skill-roll");
    if(!skillCheck)
        return;

    const roll = message.rolls[0];
    let criticalSuccess = false;
    let criticalFail = false;



    if(roll._dice.length === 1){
        criticalSuccess = roll._dice[0].results.result === 10;
        criticalFail = roll._dice[0].results.result === 1;
    }
    else if (roll._dice.length ===2){
        criticalSuccess = roll._dice[0].results.result === 10
        && roll._dice[1].results.result == 10;

        criticalFail = roll._dice[0].results.result === 1
            && roll._dice[1].results.result === 1;
    }

    if(criticalSuccess){
        skillCheck.find(".dice-total").addClass("critical-success")
    }

    if(criticalFail){
        skillCheck.find(".dice-total").addClass("critical-fail")
    }
}