function fcc(N)
/*
 FCC 4 N N N lattice ( fractional coordinate )
 math.jsを使おうとおもったが、読めなくなりそうだったのでやめた。
*/
{
    var NN=4*N*N*N
    var h=0.5/N
    var pos=new Array()
    var i=0
    for (var x=0; x<N; x++){
        for (var y=0; y<N; y++){
            for (var z=0; z<N; z++){
                pos.push([x/N, y/N, z/N])
                pos.push([x/N+h, y/N+h, z/N])
                pos.push([x/N, y/N+h, z/N+h])
                pos.push([x/N+h, y/N, z/N+h])
            }
        }
    }
    return pos
}



function abs(x)
{
    return x<0?-x:x
}



function wrap(x)
{
    if (x<-0.5)
        x += 1.0
    else if (x>0.5)
        x -= 1.0
    return x
}



function energy1(m, pos, cell, rc)
/*
  分子mとそれ以外との間の相互作用の総和を返す。
*/
{
    var N=pos.length
    var epb = new Array(N)
    var vrb = new Array(N)
    var rc2 = rc*rc
    for (var j=0; j<N; j++){
        epb[j] = 0.0
        vrb[j] = 0.0
        if (j != m){
            var rdx = wrap(pos[m][0] - pos[j][0])
            var dx = rdx*cell[0]
            if (abs(dx) < rc){
                var rdy = wrap(pos[m][1] - pos[j][1])
                var dy = rdy*cell[1]
                if (abs(dy) < rc){
                    var rdz = wrap(pos[m][2] - pos[j][2])
                    var dz = rdz*cell[2]
                    if (abs(dz) < rc){
                        var rs = dx*dx+dy*dy+dz*dz
                        if (rs<rc2){
                            var rsi = 1/rs
                            var rh  = rsi*rsi*rsi
                            var rdc = rh*rh
                            var ep  = rdc - rh
                            var vr  = 2*rdc - rh
                            epb[j] = ep
                            vrb[j] = vr
                        }
                    }
                }
            }
        }
    }
    return [epb, vrb]
}



function two_d_array(N,M)
{
    var e = new Array(N)
    for(var m=0; m<N; m++){
        e[m] = new Array(M)
    }
    return e
}


//parameters for CO2
var wm=44.0
var anum=6.02205e23
var bk  =1.38066e-16
var etemp=231.0
var sig  =3.63

var NCL=4  //lattice size
var densr = 0.5 //g/cm3
var tempr = 300 // K
var temp = tempr/etemp
var dens = sig*sig*sig*densr*anum/(wm*1e24)

pos = fcc(NCL)

var N = pos.length
var vol = N/dens
var bxl = Math.pow(vol, 1./3.)
var cell = [bxl,bxl,bxl]
var rc   = bxl/2
var emu  = anum*bk*etemp*1e-10
var emup = emu*1e-3/Math.pow(sig*1e-10, 3)/anum
var pi   = 3.1415926
var ecc  = pi*dens*(8./9.*Math.pow(rc,-9)-8./3.*Math.pow(rc,-3))
var vcc  = pi*dens*dens*(32./9.*Math.pow(rc,-9)-16./3.*Math.pow(rc,-3))
var ul   = bxl/(2*NCL)
var dtmaxx= ul/2.0 / cell[0]
var dtmaxy= ul/2.0 / cell[1]
var dtmaxz= ul/2.0 / cell[2]
var nstop= 15 //outer loop
const NV = 100
var nav  = NV*N //inner loop

var tempi = 4.0 / temp

console.log("Computer Simulation")
console.log("Monatomic molecules interacting")
console.log("with Lennard-Jones potential")
console.log("Particle number=",N)
console.log("Steps to be simulated=",nstop)
console.log("Temperature=",temp)
console.log("Number density=",dens)
console.log("Cell length=",bxl)
console.log("Potential truncation=",rc)
console.log("Volume of basic cell=",vol)
console.log("Maximum translation=", ul/2.0)



// preset energy and virial
var e  = two_d_array(N,N)
var v  = two_d_array(N,N)
var ep = 0.0
var vr = 0.0

for(var m=0; m<N; m++){
    var ev = energy1(m, pos, cell, rc)
    var epb = ev[0]
    var vrb = ev[1]
    for (var j=0; j<N; j++){
        ep += epb[j]
        vr += vrb[j]
        e[j][m] = epb[j]
        v[j][m] = vrb[j]
    }
}
ep /= 2
vr /= 2
var epi = ep/N     // it is not correct. ecc must be added.
console.log(epi*4) //line number 604


//outer loop
for(var loop=0; loop<2; loop++){
    var ept = 0.0
    var vrt = 0.0
    
    // main loop
    for(var iss=0; iss<nstop; iss++){
        var eps = 0.0
        var vrs = 0.0
        
        var nreject = 0
        
        // sub loop
        for(var jss=0; jss<nav; jss++){
            var m = Math.floor(Math.random() * N)
            var pos0 = pos[m] //is it a copy? or a reference? It's a reference!
            var pos0 = pos[m].slice() // It copies.
            /*test
              pos[m][0] = 99
              console.log(pos0)
            */
            var dx = (Math.random()*2 - 1)*dtmaxx
            var dy = (Math.random()*2 - 1)*dtmaxy
            var dz = (Math.random()*2 - 1)*dtmaxz
            pos[m][0] += dx
            pos[m][1] += dy
            pos[m][2] += dz
            var epbb = 0.0
            var vrbb = 0.0
            for (var i=0; i<N; i++){
                epbb += e[i][m]
                vrbb += v[i][m]
            }
            var ev = energy1(m, pos, cell, rc)
            var epb = ev[0]
            var vrb = ev[1]
            var epaa = 0.0
            var vraa = 0.0
            for (var i=0; i<N; i++){
                epaa += epb[i]
                vraa += vrb[i]
            }
            var de = (epbb-epaa)*tempi
            if ( (de >= 0.0) || ( de > Math.log(Math.random()) ) ) {
                //accept
                ep += (epaa-epbb)
                eps += ep
                vr += (vraa-vrbb)
                vrs += vr
                for(var d=0; d<3; d++){
                    if ( pos[m][d] > 1.0 )
                        pos[m][d] -= 1.0
                    else if ( pos[m][d] < 0.0 )
                        pos[m][d] += 1.0
                }
                for(var i=0; i<N; i++){
                    e[i][m] = epb[i]
                    e[m][i] = epb[i]
                    v[i][m] = vrb[i]
                    v[m][i] = vrb[i]
                } //120
            } else {
                //reject
                nreject ++
                pos[m] = pos0
                eps += ep
                vrs += vr
            }
        } //80
        ept += eps
        vrt += vrs
        
        // adjust the magnitude of displacements
        var rejectratio = nreject / nav
        var dispratio   = (1.0 + (0.5 - rejectratio)*0.2)
        dtmaxx *= dispratio
        dtmaxy *= dispratio
        dtmaxz *= dispratio
        
        //average of the inner loop
        var avg_e = eps*4 / (nav*N)  + ecc 
        var avg_v = dens*(temp + vrs*24 / (nav*N*3) ) + vcc
        
        console.log(iss, avg_e*emu, avg_v*emup, dispratio)
    }
    var avg_e = ept*4 / (nav*N*nstop)  + ecc 
    var avg_v = dens*(temp + vrt*24 / (nav*N*nstop*3) ) + vcc
    
    console.log("                     Loop", nstop*NV)
    console.log("         Density [g /cm3]", densr)
    console.log("          Temperature [K]", tempr)
    console.log("Potential Energy [kJ/mol]", avg_e*emu)
    console.log("           Pressure [MPa]", avg_v*emup)
}
