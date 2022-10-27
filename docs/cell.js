var pause=false

function setup() {
    createCanvas(400, 400, WEBGL)
    background(255,255,255)
    noLoop()
}

function draw() {
    clear(255,255,255)
    if ( pause )
        return;

    var cell=mclj.cell
    noStroke()
    shininess(1)
    fill(100,0,0)
    ambientMaterial(255,0,0)
    pointLight(255,255,255,1000,-1000,1000)
    specularMaterial(120)
    scale(cell[0]*25)
    for(let i=0; i<mclj.pos.length; i++){
        let p = mclj.pos[i]
        push()
        translate(p[0]-0.5, p[1]-0.5, p[2]-0.5)
        sphere(sig0/cell[0]/10,4,4) //mclj.sig / cell[0])
        pop()
    }
}

function mousePressed(){
    console.log(mouseX, mouseY)
}
