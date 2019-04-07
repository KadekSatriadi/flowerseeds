function FlowerSeeds(){
    this.n = 500;
    this.turnValue = 0.61803398875;
    this.size = 0.35;
    this.seedRadius = 4;
    this.svg;
    this.centerY = 100;
    this.centerX = 100; 
    this.colorFunction;
    this.seeds;
    this.Update = function(){
        this.seeds = [];

        //clear up canvas
        this.svg.selectAll("circle").remove();
        var lastY = this.centerY;
        var lastX = this.centerX + this.size;

        //turn to radian
        var turnValueRadian = this.turnValue * 2 * Math.PI;

        //create center
        this.svg.append("circle").style("cx", this.centerX).style("cy", this.centerY).style("r",3);

        for(var i = 0; i < n -1; i++){
            //create seed
            this.seeds[i] = this.svg.append("circle");
            this.seeds[i].style("r", this.seedRadius * i * 0.005);
            this.seeds[i].style("cy", lastY);
            this.seeds[i].style("cx", lastX);
            var rotatePoint = RotatePointAround(lastX, lastY, this.centerX, this.centerY, turnValueRadian);
            lastX = rotatePoint[0];
            lastY = rotatePoint[1];

            //shift it away from center
            var direction = new Victor(lastX, lastY).subtract(new Victor(this.centerX, this.centerY));
            var normalisedDirection = direction.normalize();
            var newPosition = new Victor(lastX, lastY)
                                .add(new Victor(normalisedDirection.x * this.size, normalisedDirection.y * this.size));
            lastX = newPosition.x;
            lastY = newPosition.y;

            this.seeds[i].style("fill", this.colorFunction(i));
        }

    }
     //rotate 2D point around 2D point in angle radian
     function RotatePointAround(x, y, cx, cy, angle){
        var rotatedX = Math.cos(angle) * (x - cx) - Math.sin(angle) * (y- cy) + cx;
        var rotatedY = Math.sin(angle) * (x - cx) + Math.cos(angle) * (y - cy) + cy;
        
        return [rotatedX, rotatedY]; 
    }

    this.Animate = function (){
        var radius = [];
        var positionX = [];
        var positionY = [];
        var j = 0;

        this.svg.selectAll("circle").each(function(d,i){
            radius[j] = d3.select(this).style("r");
            positionX[j]  = d3.select(this).style("cx");
            positionY[j]  = d3.select(this).style("cy");
            j++;
        });
        var shrink = this.svg.transition().duration(100);
        var translation = this.svg.transition().delay(100).duration(100);
        var grow = this.svg.transition().delay(300).duration(100);


        shrink.selectAll("circle").style("cx",centerX).style("cy", centerY).style("r",0).ease(d3.easeQuadIn);                        
        
        translation.selectAll("circle")
        .style("cx", function(d,i){
            return positionX[i];
        }).style("cy", function(d,i){
            return positionY[i];
        });
        
        grow.selectAll("circle").delay(function(d,i){
            return i * 10; 
        }).style("r", function(d,i){
            return radius[i];
        }).ease(d3.easeBounceOut);
    }
}