export class SBBMeasuredTemplate extends MeasuredTemplate{

    _getRectShape(direction,distance) {
        let d = canvas.dimensions;
        let canvasScale = (d.size / d.distance);

        distance = distance*2 + canvasScale;

        let x = 0-distance/2;
        let y = 0-distance/2;

        return new PIXI.Rectangle(x,y, distance, distance);
    }

    _refreshRulerText() {
        if(this.document.t === "rect"){
            // Changing rectangle to be more of a square
            // So don't want to see height/width just need a distance

            let u = canvas.scene.grid.units;
            let d = Math.round(this.document.distance * 10) / 10;
            let text = `${d}${u}`;

            this.ruler.text = text;
            this.ruler.visible = this.layer.active && this.isVisible;
        }
        else{
            super._refreshRulerText();
        }

        // Puts text position just above the image template
        this.ruler.position.set(-30, -25);
    }

    _refreshTemplate(){
        // Moves the small dot to be at the point of origin rather than at end of the template
        this.ray.dx = 0;
        this.ray.dy = 0;
        super._refreshTemplate();
    }
}