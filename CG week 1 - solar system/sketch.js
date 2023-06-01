var speed;

var sun_spin;

var earth_orbit_speed;
var earth_spin_speed;

var moon1_orbit_speed;
var moon2_orbit_speed;

var asteroid_orbit_speed;
// var moon1_spin_speed   -- always show same face to earth

function setup() {
    createCanvas(900, 900);
}

function draw() {
    get_speeds_and_background ()

    /// SOLAR SYSTEM ///
    sun_influence_area(sun_spin)
    
}

function sun_influence_area(rot_speed)
{
    push(); //1

        translate(width / 2, height / 2); // Initial translation to center of canvas
        sunRotation(rot_speed); // Sun spin speed

        // EARTH INFLUENCE AREA
        earth_influence_area(earth_spin_speed, earth_orbit_speed);

    pop() //1
}

function earth_influence_area(e_spin, e_orb) {
    push()
        
        // EARTH
        rotate(radians(e_orb)); // Earth orbit speed
        translate(0, 300);      // Earth Orbit radius

        earth(e_spin); // EARTH creation and spin speed
        shadow(80, 100) // EARTH shadow

        // MOONS INFLUENCE AREAS
        moon1_influence_area(e_spin, e_orb, moon1_orbit_speed)
        moon2_influence_area(e_spin, e_orb, moon2_orbit_speed)
        
    pop()
}

function moon1_influence_area(e_spin, e_orbit, orbit_speed) {
    push()
        // MOON 1 
        
        spin_orbit_totals = orbit_speed-(e_spin + e_orbit)
        
        rotate(radians(spin_orbit_totals)); // Moon1 orbit speed
        translate(0, 100);                  // Moon1 orbit radius
        
        moon1(0) // Moon1 creation and adding spin speed
        moon_shadow_rotation(-spin_orbit_totals) // Moon1 shadow

        // ASTEROID
        asteroid_influence_area(spin_orbit_totals)
    pop()
}

function moon2_influence_area(e_spin, e_orbit, orbit_speed) {
   
    push()
        // MOON
        rotate(radians(orbit_speed-e_spin- e_orbit)); // Orbit
        translate(0, 50);
        moon2(0)
        moon_shadow_rotation(-orbit_speed+e_orbit+e_spin)
        
    pop()
}

function asteroid_influence_area(spin_orbit_totals) 
{
    push()
        spin_orbit_totals = -spin_orbit_totals+asteroid_orbit_speed
        rotate(radians(spin_orbit_totals)); // Orbit
        translate(0, 30);       // Orbit radius
        celestialObj(color(255, 255, 0), 20); // ASTEROID

        asteroid_shadow(-asteroid_orbit_speed)
    pop()
}

//////////////// HELPER FUNCTIONS //////////////////////
function shadow(size, opacity) 
{
    push()
        fill(0, 0, 0, opacity)
        arc(0, 0, size, size, 0, PI)
        stroke(200);
        // line(0, 0, 00, -50)
    pop()
}

function asteroid_shadow(totals)
{
    push()
        push()
        rotate(radians(0))
        marker_line() // Line poiniting to moon
        pop()
        
        rotate(radians(totals)); // Orbit
        shadow(30, 255)
    pop()
}

function moon_shadow_rotation(rot_speed)
{
    push()
        rotate(radians(rot_speed))
        shadow(30, 240)
    pop()
}

function moon1(rot_speed)
{
    push()
        rotate(radians(rot_speed)); // Spin
        marker_line() // Line poiniting to earth
        
        celestialObj(color("white"), 30);
    pop()
}

function moon2(rot_speed)
{
    push()
        rotate(radians(rot_speed)); // Spin
        marker_line() // Line poiniting to earth

        celestialObj(color("white"), 30);
    pop()
}

function marker_line()
{
    push()
        stroke("red")
        strokeWeight(2)
        line(0,0,0,-30)
    pop()
}


function earth(rot_speed){
    push()
        rotate(radians(rot_speed)); // Spin
        celestialObj(color("blue"), 80);
    pop()

}
function sunRotation(rot_speed) {
    push()  //2
        rotate(radians(rot_speed)); // Spin
        celestialObj(color(255, 150, 0), 200); // SUN
    pop()   //2
}

function celestialObj(c, size) {
    push()
        
        strokeWeight(5);
        fill(c);
        stroke(0);
        ellipse(0, 0, size, size);
        line(0, 0, size / 2, 0);
    pop();
}

function get_speeds_and_background()
{
    background(0);

    speed = frameCount;

    sun_spin = speed/3

    earth_orbit_speed = speed
    earth_spin_speed = speed

    moon1_orbit_speed = -2*speed
    moon2_orbit_speed =4.2*speed

    asteroid_orbit_speed = speed*2
}