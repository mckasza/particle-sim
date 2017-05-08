function Particle(init_x, init_y, init_vel, init_rad, init_color){
    this.x = init_x;
    this.y = init_y;
    this.vel = init_vel;
    this.rad = init_rad;
    this.color = init_color;
}

Particle.prototype.draw = function(ctx){
    ctx.fillStyle = "rgb("+this.color[0].toString()+","+this.color[1].toString()+","+this.color[2].toString()+")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rad, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
};

Particle.prototype.updatePos = function(interval){
    this.x += (this.getVelX()/1000)*interval;
    this.y += (this.getVelY()/1000)*interval;
};

Particle.prototype.getVelMag = function(){
    return this.vel[0];
};

Particle.prototype.getVelAngle = function(){
    return Math.atan(this.vel[1]/this.vel[0]);
};

Particle.prototype.getVelX = function(){
    return this.vel[0];
};

Particle.prototype.setVelX = function(new_vel_x){
    this.vel[0] = new_vel_x;
};

Particle.prototype.getVelY = function(){
    return this.vel[1];
};

Particle.prototype.setVelY = function(new_vel_y){
    this.vel[1] = new_vel_y;
};

Particle.prototype.getVelocity = function(){
	return this.vel.slice(0);
};

Particle.prototype.setVelocity = function(vel_x, vel_y){
	this.vel[0] = vel_x;
	this.vel[1] = vel_y;
};

Particle.prototype.getPos = function(){
    return [this.x, this.y];
};

Particle.prototype.setPos = function(new_x, new_y){
    this.x = new_x;
    this.y = new_y;
};

Particle.prototype.getRadius = function(){
    return this.rad;
};
