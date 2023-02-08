export class SBBSceneControls extends SceneControls{

    _getControlButtons() {
        let controls = super._getControlButtons();
        let measureKey = 0;
        let rectKey = 0;

        // We could hard set this but if foundry updates and adds new stuff to the menu it will break
        // So this loops and looks for the key for measure and rectatnagle to update
        for(let i = 0; i<controls.length; i++){
            if(controls[i].name == "measure"){
                measureKey = i;
                for(let j = 0; j<controls[i].tools.length; j++){
                    if(controls[i].tools[j].name == "rect"){
                        rectKey=j;
                        break;
                    }
                }
                break;
            }
        }
        console.log(controls[measureKey].tools[rectKey]);

        controls[measureKey].tools[rectKey].icon = "fa-regular fa-burst";
        controls[measureKey].tools[rectKey].title = "SBB.controls.burst";

        return controls;
    }
}