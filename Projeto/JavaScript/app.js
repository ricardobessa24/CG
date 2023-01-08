
document.addEventListener('DOMContentLoaded', Start);

//////////////////////////////////////
//          CAMARA                  //
//////////////////////////////////////
var cena;
var camara;
var renderer;
var renderer2;  
var geometria = new THREE.BoxGeometry(1,1,1);
var starGeometry;

//////////////////////////////////////
//              LUZ                 //
//////////////////////////////////////
var ambientLight; 
var pointlight;
var directionalLight;


//////////////////////////////////////
//        VELOCIDADE OBJETOS        //
//////////////////////////////////////
var velocidadeAndar;


//////////////////////////////////////
//        OBJETOS IMPORTADOS        //
//////////////////////////////////////
var objetoImportado;
var et;
var objetoImportado2;

//////////////////////////////////////
//           ANIMAÇÕES              //
//////////////////////////////////////
var mixerAnimacao;
var naveAnimacao;

//////////////////////////////////////
//        TEMPO APLICAÇÃO           //
//////////////////////////////////////
var relogio = new THREE.Clock();
var relogio2 = new THREE.Clock();

//////////////////////////////////////
//         IMPORTAR FBX             //
//////////////////////////////////////
var importer = new THREE.FBXLoader();


//////////////////////////////////////
//         VARIAVEIS TIRO           //
//////////////////////////////////////
var tiro;
var existetiro = 1;

//////////////////////////////////////
//            TEXTURAS              //
//////////////////////////////////////
var textureLoader = new THREE.TextureLoader();
texture = textureLoader.load( "./textures/po.png" );
textura = textureLoader.load( "./textures/textura.jpg" );
 

//////////////////////////////////////
//          Molde Meteoro           //
//////////////////////////////////////
const loader = new THREE.TextureLoader();
var material = new THREE.MeshBasicMaterial({
    map: loader.load('textures/texture.jpg'),
  });
const radius = 1;  // ui: radius
const detail = 8;  // ui: detail
const geometry = new THREE.IcosahedronGeometry(radius, detail);

//////////////////////////////////////
//        VARIAVEIS METEORO         //
//////////////////////////////////////
var guardarasteroide;
var AsteroideCoordRotation;
var x = (500)/(window.innerWidth - 0)*(1-(-1))+ -1;
var y = (10)/(window.innerHeight - 0)*(1-(-1))+ -1;
var velocidadeAsteroide = 0.35;
var guardarasteroideX;
var guardarasteroideY;
var guardarasteroideZ;


//////////////////////////////////////
//             Saturno              //
//////////////////////////////////////
var objetocomplexo = Saturno();


//////////////////////////////////////
//         ESCOLHER A CAMARA        //
//////////////////////////////////////
var cameraselecionada = 0;


//////////////////////////////////////
//           CRIAR CENA             //
//////////////////////////////////////
function Criarcena(){
    cena = new THREE.Scene();

    camaraperspetiva();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);  

    ambientLight = new THREE.AmbientLight(0xffffff , 0.5);  
    cena.add(ambientLight);  

    pointlight = new THREE.PointLight(0xff0000, 3, 500);
	pointlight.position.set(0,150,0);
	pointlight.castShadow = true;
	pointlight.shadow.camera.near = 0.1;
	pointlight.shadow.camera.far = 1000;
	cena.add(pointlight);

    directionalLight = new THREE.DirectionalLight( 0x4dff4d, 2 );
    cena.add( directionalLight );

}




//////////////////////////////////////
//        PERSPETIVA CAM            //
//////////////////////////////////////
function camaraperspetiva()
{
    camara = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    //Posição câmara
    camara.position.x = 0; 
    camara.position.z = 100;
    camara.position.y = 0;
}
//////////////////////////////////////////
////        ORTOGRAFICA CAM           ////
//////////////////////////////////////////
function camaraOrtografica()
{
    camara = new THREE.OrthographicCamera(window.innerWidth / -3, window.innerWidth / 3, window.innerHeight / 3, window.innerHeight / -3,0.5, 300);
        camara.position.x = 0; 
        camara.position.z = 100;
        camara.position.y = 150;
            camara.lookAt(new THREE.Vector3(0,-30,10));
}



//////////////////////////////////////////
////       CONTROLAR LUZES            ////
//////////////////////////////////////////
//Ambient light
function turnAmbientLightOff(){
        ambientLight.visible = !ambientLight.visible;
}
//Point light
function turnPointLightOff(){
    pointlight.visible = !pointlight.visible;
}
//Directional light
function turnDirectionalLightOff(){
    directionalLight.visible = !directionalLight.visible;
}




//////////////////////////////////////////
////         CRIAR ASTEROIDES         ////
//////////////////////////////////////////
function asteroides(){

    var asteroide = new THREE.Mesh(geometry, material);
    asteroide.scale.x = 8;
    asteroide.scale.y = 8;
    asteroide.scale.z = 8;
    asteroide.position.set(-50 + Math.random() * 100, -30, -200)
    guardarasteroideX = asteroide.position.x;
    guardarasteroideY = asteroide.position.y;
    guardarasteroideZ = asteroide.position.z;

    AsteroideCoordRotation = {
        x:x,
        y:y
    }
    asteroide.velocity =  2;

    
 // asteroide.rotation = new THREE.Vector3(Math.random(), Math.random(), Math.random());
 
    guardarasteroide = asteroide;
    cena.add(asteroide);
}




//////////////////////////////////////////
////        CRIAR FUNDO ESPAÇO        ////
//////////////////////////////////////////
function espaco(){
    starGeometry = new THREE.Geometry();
            for(let i = 0; i < 2000; i++) {
                star = new THREE.Vector3(
                    Math.random() * 600 - 300,
                    Math.random() * 600 - 300,
                    Math.random() * 600- 300
                );
                star.velocity = 0;
                star.acceleration = 0.02;
                starGeometry.vertices.push(star);
            }

    let sprite = new THREE.TextureLoader().load('images/estrela.png');
    let starMaterial = new THREE.PointsMaterial({
        size: 2,
        map: sprite
    });
    stars = new THREE.Points(starGeometry,starMaterial);

 
    cena.add(objetocomplexo)
    objetocomplexo.position.set(100, -5, -30);  
    objetocomplexo.rotation.x = Math.PI/8;   
    cena.add(stars);
    animate();
}


function animate() {
            objetocomplexo.rotateY(0.09);
            starGeometry.vertices.forEach(p=>{
                p.velocity += p.acceleration;
                p.y -= p.velocity;
                if( p.y < -200) {
                    p.y = 200;
                    p.velocity = 0
                }
            });
            starGeometry.verticesNeedUpdate = true;
            stars.rotation.y += 0.002;
            stars.rotation.x = -1.5;
        
           
            renderer.render(cena,camara);
            requestAnimationFrame(animate);
}


//////////////////////////////////////////
////            CRIAR NAVE            ////
//////////////////////////////////////////
function nave(){
    importer.load('./Objetos/Teste.fbx', function (object){

    naveAnimacao = new THREE.AnimationMixer(object);

    action = naveAnimacao.clipAction(object.animations[0]);
    action.play();

    object.traverse(function (child){
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
            //child.material.color.setHex(0x0099ff);
            child.material = new THREE.MeshStandardMaterial({
                map:       texture,
        });
        }
    });
    
  //Escala Objeto;
    object.scale.x = 0.05;
    object.scale.z = 0.05;
    object.scale.y = 0.05;

  //Posição do objeto;
    object.position.x = 0;
    object.position.y = -30;
    object.position.z = 10;
    object.rotation.y=Math.PI;

//Variaveis a guardar o Objeto
    objetoImportado = object;
    boneco = object;

    cena.add(objetoImportado);
});
}
//////////////////////////////////////////
////            Saturno               ////
//////////////////////////////////////////
function Saturno(){
    const saturno = new THREE.Group(); //Definir objeto complexo pretendido

    const esfera =   new THREE.Mesh( //criaçã da esfera do planeta
        new THREE.SphereGeometry(10,30,30),
        new THREE.MeshBasicMaterial({
            map: loader.load('textures/Saturno.jpg'),
          })
    );

    const saturnoObj = new THREE.Object3D(); //variavel para guardar objeto 3d
    saturnoObj.add(esfera); //Adiciona a esfera ao saturno 3D


    const anel =  new THREE.Mesh( //definição anel do planeta
        new THREE.RingGeometry(10,20,30),
        new THREE.MeshBasicMaterial({
            map: loader.load('textures/Ring.png'),
            side: THREE.DoubleSide
          })
    );
    
    anel.rotation.x = 0.5 * Math.PI;
    
    saturnoObj.add(anel); //adicionar anel ao saturno 3d

    bandeira = new THREE.Mesh( //criar bandeira
        new THREE.BoxGeometry(5, 4, 0.2),
        new THREE.MeshBasicMaterial(
            {color:0xff0000,

            })
    );

    bandeira.position.y +=20; //mexer com a posição em relação ao objeto composto
    bandeira.position.x +=2;  
    bandeira.receiveShadow = true;
    bandeira.castShadow = true;

    saturnoObj.add(bandeira);//adicionar ao saturno 3d a bandeira 

    var suporte = new THREE.Mesh(//criar suporte da bandeira
        new THREE.CylinderGeometry(0.3,0.3,12,10),
        new THREE.MeshPhongMaterial({color: 0x000000})
    );
    suporte.position.y += 16;
    saturnoObj.add(suporte);//adicionar suporte ao saturno 3d


    //const anel = new THREE.Mesh(
       // new THREE.RingGeometry;
    //);

    saturno.add(saturnoObj);//passar os Objetos armazenados 3d para saturno 
    return saturno; //retornar o objeto complexo
}


//////////////////////////////////////////
////          CRIAR ALIENS            ////
//////////////////////////////////////////
function aliens(){
    importer.load('./Objetos/Falling.fbx', function (object){

        mixerAnimacao = new THREE.AnimationMixer(object);
    
        action = mixerAnimacao.clipAction(object.animations[0]);
        action.play();
      
        object.traverse(function (child){
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
               // child.material = new THREE.MeshStandardMaterial({
                    //color:     0x99ff33,
                    //specular:  0x050505,
                    //shininess: my_shine_value,
                  //  map:       textura,
                    //side:      THREE.DoubleSide   
          //  });        
            }      
        });
      //Escala Objeto;
        object.scale.x = 0.05;
        object.scale.z = 0.05;
        object.scale.y = 0.05;
    
      //Posição do objeto;
        object.position.x = 20;
        object.position.y = -8;
        object.position.z = 7;
 
        object.rotation.y=Math.PI;
    
    //Variaveis a guardar o Objeto
        objetoImportado2 = object;
        cena.add(objetoImportado2);
    });
}


//////////////////////////////////////////
////      INTERAÇAO NAVE E TIROS      ////
//////////////////////////////////////////
document.addEventListener('keydown', ev=>{
    var coords = {
        x:0,
        y:0,
        z:0
    };

    if(ev.keyCode == 65){
        coords.x -= velocidadeAndar;
        if(boneco!= null)
        {
            boneco.position.x -= 0.8;
        }
    }

    if(ev.keyCode == 68){
        coords.x += velocidadeAndar;
        if(boneco!= null)
        {
            boneco.position.x += 0.8;
        }
    }
    
    // Seta para Esquerda
    if(ev.keyCode == 37 ){
        coords.x -= velocidadeAndar;
        if(objetocomplexo!= null)
        {
            objetocomplexo.position.x -= 0.8;
        }
    }

    //Seta para Cima
    if(ev.keyCode == 38 ){
        coords.x -= velocidadeAndar;
        if(objetocomplexo!= null)
        {
            objetocomplexo.position.y += 0.8;
        }
    }
    // Seta para Direita
    if(ev.keyCode == 39 ){
        coords.x -= velocidadeAndar;
        if(objetocomplexo!= null)
        {
            objetocomplexo.position.x += 0.8;
        }
    }
    // Seta para Baixo
    if(ev.keyCode == 40 ){
        coords.x -= velocidadeAndar;
        if(objetocomplexo!= null)
        {
            objetocomplexo.position.y -= 0.8;
        }
    }
    
    if(ev.keyCode == 32 && existetiro == 1)
    {
            existetiro = 0;
            Tiro();
            var speed = 80;
            var delta = 0.04;

        (function render() {
          requestAnimationFrame(render);
          tiro.translateZ(-speed * delta); // move along the local z-axis

          if(ObterDistancia(tiro.position.x, tiro.position.y, tiro.position.z, guardarasteroideX, guardarasteroideY, guardarasteroideZ) < 8 )
          {
            cena.remove(tiro);
            cena.remove(guardarasteroide);
            cena.add(guardarasteroide);
            guardarasteroide.position.set(-50 + Math.random() * 100, -30, -200);
            guardarasteroideX = guardarasteroide.position.x;
            guardarasteroideY = guardarasteroide.position.y;
            guardarasteroideZ = guardarasteroide.position.z;

            existetiro = 1; 
          }
          
          
          if(tiro.position.z <= -300)
          {
              cena.remove(tiro);
              existetiro = 1;
          }
          renderer.render(cena, camara);
        })()
       
        
    }

    objetoImportado = coords;
});

function Tiro(){
    let plasmaBall = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 8), new THREE.MeshBasicMaterial({
        color: "aqua"
      }));
    plasmaBall.position.x = boneco.position.x;
    plasmaBall.position.y = boneco.position.y;
    plasmaBall.position.z = boneco.position.z;
    tiro = plasmaBall;
    cena.add(plasmaBall);
}

function ObterDistancia(x1, y1, z1, x2, y2, z2){
    let xDistancia = x2 - x1;
    let yDistancia = y2 - y1;
    let zDistancia = z2 - z1;

    return Math.sqrt(Math.pow(xDistancia, 2) + Math.pow(yDistancia, 2) + Math.pow(zDistancia, 2));
}
 
//////////////////////////////////////////
////         ALTERNAR CAMARA          ////
//////////////////////////////////////////
function alternarCamara()
    {
        if(cameraselecionada==0)
        {
            camaraOrtografica();
            cameraselecionada++;
        }
        else
        {
            camaraperspetiva();
            cameraselecionada--;
        }
    }


//////////////////////////////////////////
////               START              ////
//////////////////////////////////////////
function Start(){
    Criarcena();
    espaco();   
    nave();
   //  aliens();
    asteroides();

    requestAnimationFrame(update);
}


//////////////////////////////////////////
////              UPDATE              ////
//////////////////////////////////////////
function update(){
    if(AsteroideCoordRotation != null)
    {
        guardarasteroide.rotation.x += AsteroideCoordRotation.y * 0.1;
        guardarasteroide.rotation.y += AsteroideCoordRotation.x * 0.1;
    }

    if(mixerAnimacao){
        mixerAnimacao.update(relogio.getDelta());
    }
    if(mixerAnimacao){
        mixerAnimacao.update(relogio.getDelta());
    }

    if(naveAnimacao){
        naveAnimacao.update(relogio2.getDelta());
    }
    if(naveAnimacao){
        naveAnimacao.update(relogio2.getDelta());
    }

    guardarasteroide.position.z += velocidadeAsteroide;
    guardarasteroideZ = guardarasteroide.position.z; // move along the local z-axis
    if(guardarasteroideZ >= 15)
          {
            cena.remove(guardarasteroide);
            cena.add(guardarasteroide);
            guardarasteroide.position.set(-50 + Math.random() * 100, -30, -200);
            guardarasteroideX = guardarasteroide.position.x;
            guardarasteroideY = guardarasteroide.position.y;
            guardarasteroideZ = guardarasteroide.position.z;
          } 

    camaraAndar = {x:0, y:0, z:0}; 
 
    renderer.render(cena, camara);

    requestAnimationFrame(update);
}
