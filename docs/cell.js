
function setup() {
    createCanvas(400, 400, WEBGL)
    background(200)
    noLoop()
    normalMaterial()
    cam = createCamera()
    perspective(PI / 10.0, width / height, 0.1, 5000)
}

function draw() {
    background(200)

    cam.lookAt(0,0,0)
    cam.setPosition(0,0,1000)
    setCamera(cam)
    var cell=mclj.cell
    scale(cell[0]*20)
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    stroke(0)
    noFill()
    box(1)
    noStroke()
    // shininess(0)
    fill(100,0,0)
    ambientLight(100,100,100)
    ambientMaterial(255,0,0)
    pointLight(255,255,255,1000,-1000,1000)
    specularMaterial(100)
    for(let i=0; i<mclj.pos.length; i++){
        let p = mclj.pos[i]
        push()
        p[0] -= floor(p[0]+0.5)
        p[1] -= floor(p[1]+0.5)
        p[2] -= floor(p[2]+0.5)
        translate(p[0], p[1], p[2])
        sphere(sig0/cell[0]/10,4,4) //mclj.sig / cell[0])
        pop()
    }
}

function mousePressed(ev){
    console.log(ev)
    console.log(mouseX, mouseY)
}
