function Simulation(canvas_obj){
	this.canvas_obj = canvas_obj;
	this.ctx = canvas_obj.getContext("2d");
	this.grid_spacing = 20;
	this.animationFrame = null;
	this.particles = [];
	
	this.prev_time = null;
	
	this.mouse_down = false;
	this.start_mouse_x = null;
	this.start_mouse_y = null;
	this.cur_mouse_x = null;
	this.cur_mouse_y = null;
	
	canvas_obj.addEventListener("mousedown", this.canvasMouseDown.bind(this));
	canvas_obj.addEventListener("mousemove", this.canvasMouseMove.bind(this));
	canvas_obj.addEventListener("mouseup", this.canvasMouseUp.bind(this));
}

Simulation.prototype.canvasMouseDown = function(event){
	if(!this.mouse_down){
		this.mouse_down = true;
		this.start_mouse_x = event.clientX;
		this.start_mouse_y = event.clientY;
		this.cur_mouse_x = event.clientX;
		this.cur_mouse_y = event.clientY;
	}
};

Simulation.prototype.canvasMouseMove = function(event){
	if(this.mouse_down){
		this.cur_mouse_x = event.clientX;
		this.cur_mouse_y = event.clientY;
	}
};

Simulation.prototype.canvasMouseUp = function(event){
	if(this.mouse_down){
		var vel_x = this.start_mouse_x - this.cur_mouse_x;
		var vel_y = this.start_mouse_y - this.cur_mouse_y;
	
		this.particles.push(new Particle(this.start_mouse_x, this.start_mouse_y, [vel_x, vel_y], 5, [255, 0, 0])); 
		this.mouse_down = false;
	}
};

Simulation.prototype.animationLoop = function(timestamp){
	if(!this.prev_time){
		this.prev_time = timestamp;
	}
	
	var interval = timestamp-this.prev_time;
	this.prev_time = timestamp;

	for(var i = 0;i<this.particles.length;i++){
		this.particles[i].updatePos(interval);
	}
	
	for(var i = 0;i<this.particles.length;i++){
		for(var j = 0;j<this.particles.length;j++){
			if(i != j){
				var pos1 = this.particles[i].getPos();
				var pos2 = this.particles[j].getPos();
				var rad1 = this.particles[i].getRadius();
				var rad2 = this.particles[j].getRadius();
				
				var dist = Math.sqrt(Math.pow(pos1[0]-pos2[0],2.0)+Math.pow(pos1[1]-pos2[1],2.0));
				
				if(dist <= rad1+rad2){
					var angle = Math.atan((pos2[1]-pos1[1])/(pos2[0]-pos1[0]));

					if(pos2[0]-pos1[0] < 0){
						angle += Math.PI;
					}
					
					var vel1 = this.particles[i].getVelocity();
					var vel2 = this.particles[j].getVelocity();
				
					this.particles[i].setPos(pos2[0]-Math.cos(angle)*(rad1+rad2), pos2[1]-Math.sin(angle)*(rad1+rad2));
					this.particles[i].setVelocity(vel2[0], vel2[1]);
					this.particles[j].setVelocity(vel1[0], vel1[1]);
				}
			}
		}
	}
	
	this.resolveCollisions();
	this.draw();

	this.animationFrame = window.requestAnimationFrame(this.animationLoop.bind(this));
};

Simulation.prototype.stopAnimation = function(){
	if(this.animationFrame){
		window.cancelAnimationFrame(this.animationFrame);
		this.animationFrame = null;
		this.prev_time = null;
	}
};

Simulation.prototype.startAnimation = function(){
	if(!this.animationFrame){
		this.animationFrame = window.requestAnimationFrame(this.animationLoop.bind(this));
	}
};

Simulation.prototype.resolveCollisions = function(){
	for(var i = 0;i<this.particles.length;i++){
		var pos = this.particles[i].getPos();
		var rad = this.particles[i].getRadius();
		var angle = this.particles[i].getVelAngle();
		
		if((pos[0]+rad) >= this.canvas_obj.width){
			var x = this.canvas_obj.width-rad;
			var y = pos[1]-(Math.tan(angle)*(pos[0]-x));
			
			this.particles[i].setPos(x, y);
			this.particles[i].setVelX(this.particles[i].getVelX()*-1);
		}
		else if((pos[1]+rad) >= this.canvas_obj.height){
			var y = this.canvas_obj.height-rad;
			var x = pos[0]-((pos[1]-y)/Math.tan(angle));
		
			this.particles[i].setPos(x, y);
			this.particles[i].setVelY(this.particles[i].getVelY()*-1);
		}
		else if((pos[0]-rad) <= 0){
			var x = rad;
			var y = pos[1]+(Math.tan(angle)*(pos[0]-x));
			
			this.particles[i].setPos(x, y);
			this.particles[i].setVelX(this.particles[i].getVelX()*-1);
		}
		else if((pos[1]-rad) <= 0){
			var y = rad;
			var x = pos[0]+((pos[1]-y)/Math.tan(angle));
		
			this.particles[i].setPos(x, y);
			this.particles[i].setVelY(this.particles[i].getVelY()*-1);
		}    
	}
};

Simulation.prototype.draw = function(){
	this.ctx.clearRect(0, 0, this.canvas_obj.width, this.canvas_obj.height);
	
	this.drawGridLines();
	this.drawParticles();
	
	if(this.mouse_down){
		this.drawNewParticle();
	}
};

Simulation.prototype.drawNewParticle = function(){
	this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
	this.ctx.beginPath();
	this.ctx.arc(this.start_mouse_x, this.start_mouse_y, 5, 0, 2*Math.PI);
	this.ctx.fill();
	this.ctx.closePath();
	
	var dist = Math.sqrt(Math.pow(this.cur_mouse_x-this.start_mouse_x,2.0)+Math.pow(this.cur_mouse_y-this.start_mouse_y,2.0));
	var angle = Math.atan((this.cur_mouse_y-this.start_mouse_y)/(this.cur_mouse_x-this.start_mouse_x));
	var x_diff = (this.cur_mouse_x-this.start_mouse_x);
	
	this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
	for(var i = 10;i<dist;i+=10){
		var x = this.start_mouse_x+i*Math.cos(angle)*(x_diff >= 0)-i*Math.cos(angle)*(x_diff < 0);
		var y = this.start_mouse_y+i*Math.sin(angle)*(x_diff >= 0)-i*Math.sin(angle)*(x_diff < 0);
	
		this.ctx.beginPath();
		this.ctx.arc(x, y, 3, 0, 2*Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}
	
	var x = this.start_mouse_x-dist*Math.cos(angle)*(x_diff >= 0)+dist*Math.cos(angle)*(x_diff < 0);
	var y = this.start_mouse_y-dist*Math.sin(angle)*(x_diff >= 0)+dist*Math.sin(angle)*(x_diff < 0);
	
	this.ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
	this.ctx.lineWidth = 3;
	this.ctx.beginPath();
	this.ctx.moveTo(this.start_mouse_x, this.start_mouse_y);
	this.ctx.lineTo(x, y);
	this.ctx.stroke();
	this.ctx.closePath();
};

Simulation.prototype.drawGridLines = function(){
	this.ctx.strokeStyle = "#AAAAAA";
	this.ctx.lineWidth = 1;
	for(var i = this.grid_spacing;i<this.canvas_obj.width;i+=this.grid_spacing){
		this.ctx.beginPath();
		this.ctx.moveTo(i, 0);
		this.ctx.lineTo(i, this.canvas_obj.height);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	for(var i = this.grid_spacing;i<this.canvas_obj.height;i+=this.grid_spacing){
		this.ctx.beginPath();
		this.ctx.moveTo(0, i);
		this.ctx.lineTo(this.canvas_obj.width, i);
		this.ctx.stroke();
		this.ctx.closePath();
	}
};

Simulation.prototype.drawParticles = function(){
	for(var i = 0;i<this.particles.length;i++){
		this.particles[i].draw(this.ctx);
    }
};