/* Test para el API de Audio creado por Josep Antoni Bover Comas el 29-10-2016
   http://devildrey33.es/Lab/Ejemplos/BannerTest/EspectroAudible.html
   
        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Preview;

        Ultima modificación el 23/02/2017 
        
   Songs : 
    LevenRain         - ActionMan Versus The CyberParasites -> https://www.jamendo.com/track/1349290/actionman-versus-the-cyberparasites
    Fallen to Flux    - One Chance                          -> https://www.jamendo.com/track/1155241/one-chance
    From Sky to Abyss - Quantum Ocean                       -> https://www.jamendo.com/track/1284951/quantum-ocean
    In Camera         - Nothing's Over                      -> https://www.jamendo.com/track/1397271/nothing-s-over
    Convergence       - Six Feet Under                      -> https://www.jamendo.com/track/80122/six-feet-under
    JT Bruce          - Battle Trance                       -> https://www.jamendo.com/track/1237162/battle-trance 
    
    Code its a bit messy... and because in codepen previews audio api seems blocked, i have to made a few extra modifications to prevent errors before the first render...
    */

var EspectroAudible = function() {
    // Llamo al constructor del ObjetoBanner
    if (ObjetoCanvas.call(this, { 
        Tipo          : 'THREE',
        Ancho         : 'Auto',
        Alto          : 'Auto',
        Entorno       : 'Normal',
        Idioma        : 'en',
        MostrarFPS    : true,
        ElementoRaiz  : '',
        Pausar        : false,             // Pausa el canvas si la pestaña no tiene el foco del teclado
        ColorFondo    : 0x000000,
        CapturaEjemplo: "EspectroAudible.png",

    }) === false) { return false; }
    
};

EspectroAudible.prototype = Object.assign( Object.create(ObjetoCanvas.prototype) , {
    constructor     : EspectroAudible, 
    // Función que se llama al redimensionar el documento
    Redimensionar   : function() {    },
    // Función que se llama al hacer scroll en el documento    
    Scroll          : function() {    },
    // Función que se llama al mover el mouse por el canvas
    MouseMove       : function(Evento) { 
        this.MouseMovido = true;
        this.PosMouse.x = ( Evento.clientX / window.innerWidth ) * 2 - 1;
	this.PosMouse.y = - ( Evento.clientY / window.innerHeight ) * 2 + 1;
        
        if (this.Pantalla.Hover === true || this.Pantalla2.Hover === true || this.Pantalla3.Hover === true ||
            this.C_Atras.Hover === true || this.C_Play.Hover === true || this.C_Adelante.Hover === true ||
            this.BarrasAnalizador.Hover === true || this.C_BarraTiempo.Hover === true || this.C_SliderTiempo.Hover === true || this.DatosCancion.Hover === true) { 
            document.body.style.cursor = "pointer";             
        }
        else { 
            document.body.style.cursor = "default"; 
        }        
    },
    // Función que se llama al presionar un botón del mouse por el canvas
    MousePresionado : function(Evento) { },
    // Función que se llama al soltar un botón del mouse por el canvas
    MouseSoltado    : function(Evento) { 
        if (this.Pantalla.Hover === true) {
            this.TipoPantalla ++; 
            if (this.TipoPantalla > this.FuncionesPintarPantalla.length -1) { this.TipoPantalla = 0; }
        }
        if (this.Pantalla2.Hover === true) {
            this.TipoPantalla2 ++; 
            if (this.TipoPantalla2 > this.FuncionesPintarPantalla.length -1) { this.TipoPantalla2 = 0; }
        }
        if (this.Pantalla3.Hover === true) {
            this.TipoPantalla3 ++; 
            if (this.TipoPantalla3 > this.FuncionesPintarPantalla.length -1) { this.TipoPantalla3 = 0; }
        }
        
        if (this.C_Play.Hover === true) {
            this.PlayPausa();
        }
        
        if (this.C_Adelante.Hover === true) {
            this.Adelante();
        }
        
        if (this.C_Atras.Hover === true) {
            this.Atras();
        }
        
        if (this.BarrasAnalizador.Hover === true) {
            this.PrecisionAnalizador ++;
            if (this.PrecisionAnalizador > 2) this.PrecisionAnalizador = 0;
            if (this.PrecisionAnalizador === 0) { this.ReIniciarCubos(32); }
            if (this.PrecisionAnalizador === 1) { this.ReIniciarCubos(16); }
            if (this.PrecisionAnalizador === 2) { this.ReIniciarCubos(8); }
        }
        
        if (this.C_BarraTiempo.Hover === true) {
            var ct = (this.Audio.Cancion.duration / this.AnchoBarraTiempo) * this.C_BarraTiempo.PosHover;
            this.Audio.Cancion.currentTime = ct;             
        }
        
        if (this.DatosCancion.Hover === true) {
            window.open(this.Audio.Canciones[this.Audio.CancionActual].Web);
        }
    },
    // Función que se llama al entrar con el mouse en el canvas
    MouseEnter      : function(Evento) { },
    // Función que se llama al salir con el mouse del canvas
    MouseLeave      : function(Evento) { },
    // Función que se llama al presionar una tecla
    TeclaPresionada : function(Evento) { },
    // Función que se llama al soltar una tecla
    TeclaSoltada    : function(Evento) { },
    // Función que se llama al presionar la pantalla
    TouchStart      : function(Evento) { 
        this.MouseMovido = true;
        this.PosMouse.x = ( Evento.touches[0].clientX / window.innerWidth ) * 2 - 1;
	      this.PosMouse.y = - ( Evento.touches[0].clientY / window.innerHeight ) * 2 + 1;        
        this.ActualizarObjetoHover();
    },
    // Función que se llama al mover la presión sobre la pantalla
    TouchMove      : function(Evento) { 
        this.MouseMovido = true;
        this.PosMouse.x = ( Evento.touches[0].clientX / window.innerWidth ) * 2 - 1;
	      this.PosMouse.y = - ( Evento.touches[0].clientY / window.innerHeight ) * 2 + 1;        
    },
    // Función que se llama al soltar el dedo de la pantalla
    TouchEnd        : function(Evento) { 
        this.MouseSoltado();
    },    
    // Función que se llama al pausar el banner
    Pausa           : function() { this.Cancion.pause(); },
    // Función que se llama al reanudar el banner
    Reanudar        : function() { this.Cancion.play(); },
    
    Cubos           : [],    
    
    Animaciones     : new ObjetoAnimacion(),
    
    Colores         : { 
        Suelo       : new THREE.Color(0x232323), // 0x718BA4
        Barras      : new THREE.Color(0x333333), // 0x718395
        Texto       : new THREE.Color(0xffffff), // 0xffffff
        SombraTexto : new THREE.Color(0x000000), // 0xffffff
        Controles   : new THREE.Color(0x313132), // 0x6788A0
        Icos        : new THREE.Color(0x191900)  // 
    },
    
    Volumen         : 1,
    RayCaster       : new THREE.Raycaster(),
    PosMouse        : new THREE.Vector2(),
    MouseMovido     : false,
    
    
    CancionActual   : [],    
    //UltimaCancion   : "",
    
    // Función que inicia el ejemplo
    Iniciar         : function() {           
        this.PirmerPlay = true; // parche par que no se active el play al iniciar...
        this.Context.shadowMap.enabled = true;
        this.Escena = new THREE.Scene();
        window.scene = this.Escena; // Three.js inspector plugin for chrome
        this.Camara = new THREE.PerspectiveCamera(75, this.Ancho / this.Alto, 0.5, 2000);
        this.Camara.Rotacion = { Grados : 97 * this.Constantes.Radiant, Avance : this.Constantes.Radiant / 5, Distancia : 40, MirarHacia : new THREE.Vector3(0, 5, 0) };
        this.Camara.position.set(this.Camara.Rotacion.Distancia * Math.cos(this.Camara.Rotacion.Grados), 
                                 30, 
                                 this.Camara.Rotacion.Distancia * Math.sin(this.Camara.Rotacion.Grados));        
        this.Escena.add(this.Camara);
        this.Camara.lookAt(this.Camara.Rotacion.MirarHacia);
        
        this.IniciarPantalla();
        
        this.IniciarDatosCancion();
                
        // Creo el suelo 
        this.Suelo = new THREE.Mesh(new THREE.BoxGeometry(160, 40, 130), new THREE.MeshPhongMaterial({ color: this.Colores.Suelo, specular : 0xeeeeee }) );
        this.Suelo.position.y = -20;
        this.Suelo.castShadow = false;
        this.Suelo.receiveShadow = true;
        this.Escena.add(this.Suelo);
        
        // Grupo para las barras del analizador
        this.BarrasAnalizador = new THREE.Group(); 
        this.Escena.add(this.BarrasAnalizador); 
        
        // Creo un cubo con el area que pueden ocupar todas las barras del analizador de frequencias
        // Es necesario para detectar en el hover los espacios vacios entre las barras 
        this.SueloAnalizador = new THREE.Mesh(new THREE.BoxGeometry(32, 0.6, 32), new THREE.MeshPhongMaterial({ color: this.Colores.Suelo, specular : 0xeeeeee }) );
        this.BarrasAnalizador.add(this.SueloAnalizador);

        
        // Controles del reproductor
        var Geo = new THREE.BoxGeometry(35, 1, 8);
        Geo.translate(0, 0, -4); // Muevo el eje para la rotación
        this.Controles = new THREE.Mesh(Geo, new THREE.MeshPhongMaterial({ color: this.Colores.Suelo, specular : 0xeeeeee }) );
        this.Controles.rotation.x -= Math.PI / 2;
        this.Controles.position.z = 26;
        this.Controles.position.y = -0.4;
        this.Controles.castShadow = true;
        this.Controles.receiveShadow = true;
        this.Controles.Angulo = 0;
               
        // Controles : Atras, Play / Pausa, Stop, Adelante
        this.C_Atras = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), new THREE.MeshPhongMaterial({ color: this.Colores.Controles, specular : 0xeeeeee }));
        this.C_Atras.position.set(-4, 0.2, -2.5);
        this.Controles.add(this.C_Atras);
        this.C_Play = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), new THREE.MeshPhongMaterial({ color: this.Colores.Controles, specular : 0xeeeeee }));
        this.C_Play.position.set(-0, 0.2, -2.5);
        this.Controles.add(this.C_Play);
        this.C_Adelante = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), new THREE.MeshPhongMaterial({ color: this.Colores.Controles, specular : 0xeeeeee }));
        this.C_Adelante.position.set(4, 0.2, -2.5);
        this.Controles.add(this.C_Adelante);
        // Slider del tiempo (el mismo slider sirve como display para el tiempo
        this.AnchoBarraTiempo = 28;
        this.C_BarraTiempo = new THREE.Mesh(new THREE.BoxGeometry(this.AnchoBarraTiempo, 1, 1), new THREE.MeshPhongMaterial({ color: this.Colores.Controles, specular : 0xeeeeee }));
        this.C_BarraTiempo.position.set(0, 0.2, -6);
        this.Controles.add(this.C_BarraTiempo);
        this.C_SliderTiempo = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 2.2), new THREE.MeshPhongMaterial({ color: this.Colores.Controles, specular : 0xeeeeee }));
        this.C_SliderTiempo.position.set(-(this.AnchoBarraTiempo / 2 ), 0.3, -6);
        this.Controles.add(this.C_SliderTiempo);
        
        this.Escena.add(this.Controles);
        
        this.CrearTexturasBotones();
        
        // Niebla
//        this.Escena.fog = new THREE.Fog(0x888888, 10.1, 150);
        
        this.IniciarLuces();
        
        // Array de funciones de pintado para las pantallas
        this.FuncionesPintarPantalla = [ 
            this.PintarPantalla_OndaSin.bind(this), 
            this.PintarPantalla_Circular.bind(this),
            this.PintarPantalla_Circular8.bind(this), 
            this.PintarPantalla_Solar.bind(this) 
        ];

        this.IniciarTransiciones();
        this.ReIniciarCubos(32);    
        this.MediaAudio = [ 0, 0, 0, 0, 0 ];
        this.Audio = new EspectroAudible_Audio();
        this.PrecisionAnalizador = this.Audio.Iniciar(ObjetoNavegador.EsMovil(), this, 
                                    function() { this.CancionCargada();  }.bind(this), // Función CanPlay
                                    this.CancionTerminada.bind(this) );                // Función Ended
        
        this.Audio.CargarCancion(RandInt(this.Audio.Canciones.length - 1));
      
        this.ReIniciarCubos(Math.sqrt(this.Audio.Analizador.fftSize / 2));    
      
    },
    
    CancionCargada : function() {
        this.Cargando(false);

        if (this.Audio.CancionActual !== -1) {
            var c = this.Audio.Canciones[this.Audio.CancionActual];
            this.PintarDatosCancion(c.Grupo, c.Titulo, c.Año );        
        }
        else {
            this.PintarDatosCancion("Drag & Drop", "", "");                    
        }
    },
    
    CancionTerminada : function() {
        this.PlanoTextura[1].visible = true;                    
        this.PlanoTextura[2].visible = false;
    },
    
    PlayPausa : function() {
//        if (this.PrimerPlay === true) { this.PrimerPlay = false; return; } // Parche para que no se ejecute el play al iniciar
        var p = this.Audio.PlayPausa(); // play : true, pausa : false
        this.PlanoTextura[1].visible = !p;
        this.PlanoTextura[2].visible = p;
    },
    
    Adelante : function() {
        this.Cargando(true);
        this.Audio.Adelante();
        this.PlayPausa();
    },
    
    Atras : function() {
        this.Cargando(true);
        this.Audio.Atras();
        this.PlayPausa();
    },
    
    CrearTexturasBotones : function() {
        // Creo los buffers para los 4 iconos
        this.BufferIcos = [];
        this.PlanoTextura = [];

        this.BufferIcosTextura = [];
        for (var i = 0; i < 4; i++) { 
            this.BufferIcos[i] = new BufferCanvas(128, 128); 
            this.BufferIcos[i].fillStyle = "#FFFFFF";
            this.BufferIcosTextura[i] = new THREE.Texture(this.BufferIcos[i].Canvas);
        }

        // Icono Atras
        this.PintarTrianguloRedondeado(this.BufferIcos[0].Context, 92, 64, 38, 270, 25);
        this.PintarRectanguloRedondeado(this.BufferIcos[0].Context, 14, 30, 22, 30, 22, 99, 14, 99, 25);
//        this.BufferIcos[0].Context.fillRect(0, 0, this.BufferIcos[0].Ancho, this.BufferIcos[0].Alto);
        
        // Icono Play
        this.PintarTrianguloRedondeado(this.BufferIcos[1].Context, 60, 64, 50, 90, 25);
        
        // Icono Pausa
        this.PintarRectanguloRedondeado(this.BufferIcos[2].Context, 30, 30, 38, 30, 38, 99, 30, 99, 25);
        this.PintarRectanguloRedondeado(this.BufferIcos[2].Context, 92, 30, 100, 30, 100, 99, 92, 99, 25);
        
        // Icono Adelante
        this.PintarTrianguloRedondeado(this.BufferIcos[3].Context, 34, 64, 38, 90, 25);
        this.PintarRectanguloRedondeado(this.BufferIcos[3].Context, 106, 30, 114, 30, 114, 99, 106, 99, 25);
        
        for (var i = 0; i < 4; i++) { 
            this.PlanoTextura[i] = new THREE.Mesh(
                new THREE.PlaneGeometry( 2, 2 ),
                new THREE.MeshBasicMaterial({ 
                    color: this.Colores.Icos,
                    map: this.BufferIcosTextura[i],
                    transparent:true
                })
                //new THREE.MeshPhongMaterial({ color: this.Colores.Texto, specular : 0xeeeeee })                
            );
            this.PlanoTextura[i].rotation.x = -Math.PI / 2;
            this.PlanoTextura[i].position.y = .55;
        }
        this.C_Atras.add(this.PlanoTextura[0]); 
        this.C_Play.add(this.PlanoTextura[1]); // play
        this.C_Play.add(this.PlanoTextura[2]);  
        this.PlanoTextura[2].visible = false; // pausa
        this.C_Adelante.add(this.PlanoTextura[3]);
        
        this.BufferIcosTextura[0].needsUpdate = true;        
        this.BufferIcosTextura[1].needsUpdate = true;        
        this.BufferIcosTextura[2].needsUpdate = true;        
        this.BufferIcosTextura[3].needsUpdate = true;        

        this.IniciarTransicionesBotones();
        
        // Creo el buffer para el tiempo actual / total del slider
        this.BufferSlider = new BufferCanvas(256, 256); 
        this.BufferSlider.fillStyle = "#FFFFFF";
        this.BufferSliderTextura = new THREE.Texture(this.BufferSlider.Canvas);
                
        this.BufferSliderPlanoTextura = new THREE.Mesh(
            new THREE.PlaneGeometry( 4, 3 ),
            new THREE.MeshBasicMaterial({ 
                map: this.BufferSliderTextura,
                transparent:true
            })
        );
        this.BufferSliderPlanoTextura.rotation.x = -Math.PI / 2;
        this.BufferSliderPlanoTextura.position.y = 0.75;
        this.C_SliderTiempo.add(this.BufferSliderPlanoTextura);
        this.BufferSlider.Context.font = "56px monospace";
        this.BufferSlider.Context.fillStyle = "#000000";
    },
    
    ActualizarTiempoSlider : function() {
        var TMins = Math.round(Math.floor(this.Audio.Cancion.duration / 60));
        var TSecs = (this.Audio.Cancion.duration - (TMins * 60)).toFixed(0);
        var T = TMins + ((TSecs < 10) ? ':0' : ':') + TSecs;
        var AMins = Math.round(Math.floor(this.Audio.Cancion.currentTime / 60));
        var ASecs = Math.round(this.Audio.Cancion.currentTime - (AMins * 60));
        var A = AMins + ((ASecs < 10) ? ':0' : ':') + ASecs;
        if (this.ActualizarTiempoSlider_T < 100) {
            this.ActualizarTiempoSlider_T += this.Tick;
            return;
        }
        this.ActualizarTiempoSlider_T = 0;
        var Parte = this.AnchoBarraTiempo / this.Audio.Cancion.duration;
        // Posición del slider
        this.C_SliderTiempo.position.x = -(this.AnchoBarraTiempo / 2) + (this.Audio.Cancion.currentTime * Parte);
              
        this.BufferSlider.Context.clearRect(0, 0, this.BufferSlider.Ancho, this.BufferSlider.Alto);
        this.BufferSlider.Context.fillText(A, 71, 110);
        this.BufferSlider.Context.fillText(T, 71, 210);
        this.BufferSliderTextura.needsUpdate = true;
    },
    
    // Para las texturas de los botones atras, adelante y play
    PintarTrianguloRedondeado : function(Context, PosX, PosY, Tam, Angulo, RadioPunta) {
        Context.beginPath();
        var x1 = PosX + ((Math.sin(this.Constantes.Radiant * Angulo) * Tam));
        var y1 = PosY + ((Math.cos(this.Constantes.Radiant * Angulo) * Tam));
        var x2 = PosX + ((Math.sin(this.Constantes.Radiant * (Angulo + 120)) * Tam));
        var y2 = PosY + ((Math.cos(this.Constantes.Radiant * (Angulo + 120)) * Tam));
        var x3 = PosX + ((Math.sin(this.Constantes.Radiant * (Angulo + 240)) * Tam));
        var y3 = PosY + ((Math.cos(this.Constantes.Radiant * (Angulo + 240)) * Tam));

        Context.fillStyle = "rgb(2550,255,255)";
        Context.strokeStyle = "rgb(255,255,255)";
        Context.lineJoin = "round";
        Context.lineWidth = RadioPunta;

        Context.moveTo(x1, y1);
        Context.lineTo(x2, y2);
        Context.lineTo(x3, y3);
        Context.lineTo(x1, y1);
        Context.closePath();
        Context.stroke();
        Context.fill();
    },
    
    // Para la textura del boton pausa
    PintarRectanguloRedondeado : function(Context, PosX1, PosY1, PosX2, PosY2, PosX3, PosY3, PosX4, PosY4, RadioPunta) {
        Context.beginPath();
        Context.fillStyle = "rgb(2550,255,255)";
        Context.strokeStyle = "rgb(255,255,255)";
        Context.lineJoin = "round";
        Context.lineWidth = RadioPunta;
        Context.moveTo(PosX1, PosY1);
        Context.lineTo(PosX2, PosY2);
        Context.lineTo(PosX3, PosY3);
        Context.lineTo(PosX4, PosY4);
        Context.closePath();
        Context.stroke();
        Context.fill();
    },           
    
    // Reinicia la parrilla de cubos con el tamaño especificado
    ReIniciarCubos    : function(TamLado) {
        var TamBuffer = TamLado * TamLado;
        if (this.Audio) {
            this.Audio.Analizador.fftSize = TamBuffer * 2;
        }
        this.DatosAnalizador = new Uint8Array(TamBuffer);
        this.DatosAnalizadorSin = new Uint8Array(TamBuffer);
                
        // Elimino los cubos de la escena anterior
        for (var i = 0; i < this.Cubos.length; i++) { this.BarrasAnalizador.remove(this.Cubos[i]); }
               
        this.Cubos = [];
        var Tam = 0.8;
        if (TamLado === 32) { Tam = 1;  }
        if (TamLado === 16) { Tam = 2;  }
        if (TamLado === 8)  { Tam = 4;  }
        if (TamLado === 4)  { Tam = 8;  }
        if (TamLado === 2)  { Tam = 16; }
        
        // Creo una parrilla de cubos del tamaño especificado        
        var CuboGeo = new THREE.BoxGeometry(Tam * 0.7, 1, Tam * 0.7);
        var CuboMat = new THREE.MeshPhongMaterial({ color: this.Colores.Barras, specular : 0x888888 }); //
        var Contador = 0;
        for (var z = 0; z < TamLado; z++) {
            for (var x = 0; x < TamLado; x++) {
                this.Cubos[Contador] = new THREE.Mesh(CuboGeo, CuboMat);
                var nx = (x - (TamLado / 2) + 0.5) * Tam;
                var nz = (z - (TamLado / 2) + 0.5) * Tam;
                this.Cubos[Contador].position.set(nx, 0, nz);
                this.Cubos[Contador].castShadow = true;
                this.Cubos[Contador].receiveShadow = false;
                this.BarrasAnalizador.add(this.Cubos[Contador++]);                
            }
        }
    },   
    
    // Inicia las luces de la escena
    IniciarLuces    : function() {
        this.Context.setClearColor("#fdfdfd");
        
        this.SpotLight = new THREE.SpotLight( 0xffdddd, 1);
        this.SpotLight.position.set(40,20,100);
        this.SpotLight.target.position.set(0, 15, -70); // = this.Pantalla;
        this.Escena.add(this.SpotLight);
        this.Splhelper = new THREE.CameraHelper(this.SpotLight.shadow.camera);
        this.Splhelper.visible = false; 
        this.Escena.add(this.Splhelper);               
        
        this.SpotLight2 = new THREE.SpotLight( 0xffdddd, 1);
        this.SpotLight2.position.set(-90,20,-100);
        this.SpotLight2.target.position.set(0, 15, 50); // = this.Pantalla2;
        this.Escena.add(this.SpotLight2);
        this.Splhelper2 = new THREE.CameraHelper(this.SpotLight2.shadow.camera);
        this.Splhelper2.visible = false; 
        this.Escena.add(this.Splhelper2);
        
        this.SpotLight3 = new THREE.SpotLight( 0xffdddd, 1);
        this.SpotLight3.position.set(90,20,-100);
        this.SpotLight3.target.position.set(0, 15, 50); // = this.Pantalla2;
        this.Escena.add(this.SpotLight3);
        this.Splhelper3 = new THREE.CameraHelper(this.SpotLight3.shadow.camera);
        this.Splhelper3.visible = false; 
        this.Escena.add(this.Splhelper2);
               
        // DirectionalLight
        this.DirLight = new THREE.DirectionalLight( 0xffdddd, 0.9 );
        this.DirLight.color.setHSL( 0.1, 1, 0.95 );
        this.DirLight.position.set( 25, 15, 20 ).normalize();
        this.DirLight.position.multiplyScalar( 50 );
        this.Escena.add( this.DirLight );
        this.DirLight.castShadow = true;
        this.DirLight.shadow.mapSize.width = 2048;
        this.DirLight.shadow.mapSize.height = 2048;
        var d = 80;
        this.DirLight.shadow.camera.left = -d;
        this.DirLight.shadow.camera.right = d;
        this.DirLight.shadow.camera.top = d;
        this.DirLight.shadow.camera.bottom = -d;
        this.DirLight.shadow.camera.far = 3500;
        this.Dlhelper = new THREE.CameraHelper(this.DirLight.shadow.camera);
        this.Escena.add(this.Dlhelper);
        this.Dlhelper.visible = false;
                
        // HemisphereLight  
        this.HemiLight = new THREE.HemisphereLight( 0xeeeeee, 0xffffff, 0.4 );
        this.HemiLight.color.setHSL( 0.6, 0.6, 0.6 );
        this.HemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        this.HemiLight.position.set( 0, 0, 0 );
        this.Escena.add( this.HemiLight );         
    },        

    // Obtiene los valores medios para los sonidos graves, medios, agudos, inaudibles, y el total.
    MediaFrequenciasAudio : function() {
        // greus  de 0hz a 256hz
        // mitjos de 257hz a 2000hz
        // aguts  de 2001hz a 16000hz
        var HzPorBarra = this.Audio.AudioContext.sampleRate / this.Audio.Analizador.fftSize;
        var Divisiones = [ 256, 2000, 16000, 50000 ];
        var Total      = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        var Valores    = [ 0, 0, 0, 0, 0 ];// Graves, Medios, Agudos, Agudos inaudibles, Media de todo
        var Pos        = 0;        
        var TotalFreq = this.Audio.Analizador.fftSize / 2;
        for (var i = 0; i < TotalFreq; i++) {
            if (i * HzPorBarra > Divisiones[Pos]) {
                Pos++;
            }
            Total[Pos] ++;
            Valores[Pos] += this.DatosAnalizador[i];
            
            Valores[4] += this.DatosAnalizador[i];
        }
        
        return [ Valores[0] / Total[0], Valores[1] / Total[1], Valores[2] / Total[2], Valores[3] / Total[3], Valores[4] / TotalFreq ];
    },
           
    // Actualiza la escala de los cubos        
    ActualizarCubos : function() {        
        for (var i = 0; i < this.Cubos.length; i++) {
            this.Cubos[i].scale.y = 1 + (this.DatosAnalizador[i] / 20);
            this.Cubos[i].position.y = this.Cubos[i].scale.y / 2;
        }
    },    
    
    
    IniciarTransicionesBotones : function() {
        // Transición hover para el boton cancion anterior
        this.C_Atras.Hover = false;
        this.C_Atras.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { RG : 0.1 }},
            { Paso : { RG : 1 },  Tiempo : 400 }],
            { FuncionActualizar : function(Valores) {                     
                this.PlanoTextura[0].material.color.setRGB(Valores.RG, Valores.RG, 0);
            }.bind(this) 
        });        
        // Transición hover para el boton play / pausa
        this.C_Play.Hover = false;
        this.C_Play.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { RG : 0.1 }},
            { Paso : { RG : 1 },  Tiempo : 400 }],
            { FuncionActualizar : function(Valores) {                     
                this.PlanoTextura[1].material.color.setRGB(Valores.RG, Valores.RG, 0);
                this.PlanoTextura[2].material.color.setRGB(Valores.RG, Valores.RG, 0);
            }.bind(this) 
        });        
        // Transición hover para el boton cancion siguiente
        this.C_Adelante.Hover = false;
        this.C_Adelante.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { RG : 0.1 }},
            { Paso : { RG : 1 },  Tiempo : 400 }],
            { FuncionActualizar : function(Valores) {                     
                this.PlanoTextura[3].material.color.setRGB(Valores.RG, Valores.RG, 0);
            }.bind(this) 
        });            
    },
    
    IniciarTransiciones : function() {
        // Transición hover del marco para los controles        
        this.Controles.Hover = false;
        this.Controles.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { Angulo : this.Controles.Angulo }},
            { Paso : { Angulo : (this.Constantes.Radiant) * 15 },  Tiempo : 300 }],
            { FuncionActualizar : function(Valores) { 
                this.Controles.Angulo = Valores.Angulo;
                this.Controles.rotation.x = Valores.Angulo;
            }.bind(this) 
        });                
        this.Controles.Ani.AsignarValoresIniciales();
        // Transición hover para la pantalla central
        this.Pantalla.Hover = false;
        this.Pantalla.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { Escala : 1,   Opacidad : 0.7 }},
            { Paso : { Escala : 1.1, Opacidad : 0.9 }, Tiempo : 300 }],
            { FuncionActualizar : function(Valores) {
                this.Pantalla.scale.set(Valores.Escala, Valores.Escala, 1);
                this.Pantalla.material.opacity = Valores.Opacidad;
            }.bind(this)
        });        
        // Transición hover para la pantalla derecha
        this.Pantalla2.Hover = false;
        this.Pantalla2.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { Escala : 1,   Opacidad : 0.7 }},
            { Paso : { Escala : 1.1, Opacidad : 0.9 }, Tiempo : 300 }],
            { FuncionActualizar : function(Valores) {
                this.Pantalla2.scale.set(Valores.Escala, Valores.Escala, 1);
                this.Pantalla2.material.opacity = Valores.Opacidad;
            }.bind(this)
        });        
        // Transición hover para la pantalla izquierda
        this.Pantalla3.Hover = false;
        this.Pantalla3.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { Escala : 1,   Opacidad : 0.7 }},
            { Paso : { Escala : 1.1, Opacidad : 0.9 }, Tiempo : 300 }],
            { FuncionActualizar : function(Valores) {
                this.Pantalla3.scale.set(Valores.Escala, Valores.Escala, 1);
                this.Pantalla3.material.opacity = Valores.Opacidad;
            }.bind(this)
        });        
        
        // Transición hover para las barras del analizador
        this.BarrasAnalizador.Hover = false;
        this.BarrasAnalizador.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { Escala : 1,   Opacidad : 0.7 }},
            { Paso : { Escala : 1.1, Opacidad : 0.9 }, Tiempo : 300 }],
            { FuncionActualizar : function(Valores) {
                this.BarrasAnalizador.scale.set(Valores.Escala, Valores.Escala, Valores.Escala);
            }.bind(this)
        });        
        
        // Transición hover para los datos de la canción
        this.DatosCancion.Hover = false;
        this.DatosCancion.Ani = this.Animaciones.CrearTransicion([ 
            { Paso : { PosY : 0.1,   Opacidad : 0.5 }},
            { Paso : { PosY : 0.9,   Opacidad : 1 }, Tiempo : 300 }],
            { FuncionActualizar : function(Valores) {
                this.DatosCancion.position.y = Valores.PosY;
                this.DatosCancion.material.opacity = Valores.Opacidad;
            }.bind(this)
        });        
        
    },
    
    // Inicia el plano donde se mostraran los datos de la canción
    IniciarDatosCancion : function() {
        this.BufferDatosCancion = new BufferCanvas(1024, 256);
        
        this.TexturaDatosCancion = new THREE.Texture(this.BufferDatosCancion.Canvas);
        this.DatosCancion = new THREE.Mesh(  new THREE.PlaneGeometry(64, 16), 
                                             new THREE.MeshStandardMaterial( { map: this.TexturaDatosCancion, transparent : true, roughness: 0.5  } ));
        this.DatosCancion.position.set(-30, 0.01, -10);
        this.DatosCancion.receiveShadow = true;
        this.DatosCancion.rotation.x = -Math.PI / 2;
        this.DatosCancion.rotation.z = Math.PI / 2;
        this.Escena.add(this.DatosCancion);
    },

    PintarDatosCancion : function(Grupo, Nombre, Año) {
        this.BufferDatosCancion.Context.clearRect(0, 0, this.BufferDatosCancion.Ancho, this.BufferDatosCancion.Alto);
        this.BufferDatosCancion.Context.font = "64px Georgia";
        this.BufferDatosCancion.Context.fillStyle = "#" + this.Colores.SombraTexto.getHexString();
        this.BufferDatosCancion.Context.fillText(Grupo, 5, 50);
        this.BufferDatosCancion.Context.fillText(Nombre, 5, 140);
        this.BufferDatosCancion.Context.fillText(Año, 5, 230);
        this.BufferDatosCancion.Context.fillStyle = "#" + this.Colores.Texto.getHexString();
        this.BufferDatosCancion.Context.fillText(Grupo, 0, 55);
        this.BufferDatosCancion.Context.fillText(Nombre, 0, 145);
        this.BufferDatosCancion.Context.fillText(Año, 0, 235);
        
        this.TexturaDatosCancion.needsUpdate = true;        
    },

    // Inicia las pantallas y el backbuffer que se utilizará para pintar las visualizaciones (onda, circular, circular8 y solar)
    IniciarPantalla : function() {
        // Pantalla 1
        this.BufferPantalla = new BufferCanvas(1024,512);
        this.BufferPantalla.Context.strokeStyle = '#ffffff';
        this.TipoPantalla = 3; // onda = 0, circular = 1, 8 circulos = 2, solar 3        
        this.BufferPantalla.Textura = new THREE.Texture(this.BufferPantalla.Canvas);
        this.Pantalla = new THREE.Mesh(  new THREE.PlaneGeometry(64, 32), 
                                         new THREE.MeshStandardMaterial( { map: this.BufferPantalla.Textura, roughness: .5, metalness: .73, transparent : true, opacity:0.7  } ));
        this.Pantalla.position.set(0, 20, -45);
        this.Escena.add(this.Pantalla);                
        // Pantalla 2
        this.BufferPantalla2 = new BufferCanvas(1024,512);
        this.BufferPantalla2.Context.strokeStyle = '#ffffff';
        this.TipoPantalla2 = 2; // onda = 0, circular = 1, 8 circulos = 2, solar 3        
        this.BufferPantalla2.Textura = new THREE.Texture(this.BufferPantalla2.Canvas);        
        this.Pantalla2 = new THREE.Mesh( new THREE.PlaneGeometry(64, 32), 
                                         new THREE.MeshStandardMaterial( { map: this.BufferPantalla2.Textura, roughness: 0.5, metalness: 1.0, transparent : true, opacity:0.7  } ));
        this.Pantalla2.position.set(50, 20, -13);
        this.Pantalla2.rotation.y -= Math.PI / 2;
        this.Escena.add(this.Pantalla2);
        // Pantalla 3
        this.BufferPantalla3 = new BufferCanvas(1024,512);
        this.BufferPantalla3.Context.strokeStyle = '#ffffff';
        this.TipoPantalla3 = 1; // onda = 0, circular = 1, 8 circulos = 2, solar 3        
        this.BufferPantalla3.Textura = new THREE.Texture(this.BufferPantalla3.Canvas);
        this.Pantalla3 = new THREE.Mesh( new THREE.PlaneGeometry(64, 32), 
                                         new THREE.MeshStandardMaterial( { map: this.BufferPantalla3.Textura, roughness: 0.5, metalness: 1.0, transparent : true, opacity:0.7  } ));
        this.Pantalla3.position.set(-50, 20, -13);
        this.Pantalla3.rotation.y += Math.PI / 2;
        this.Escena.add(this.Pantalla3);
    },           
    
    
    // Función que pinta en la pantalla la onda
    PintarPantalla_OndaSin : function(Buffer, Tick) {
        Buffer.Context.fillStyle = "rgba(0, 0, 0, 0.5)";
        Buffer.Context.strokeStyle = 'rgb(' + Math.round(128 + this.MediaAudio[4]) + ',' + Math.round(255 - this.MediaAudio[4]) +  ', 0)';
        var Tam = 1024;
        if (this.Audio.Analizador)  { Tam = this.Audio.Analizador.fftSize / 2; }
        Buffer.Context.fillRect(0, 0, Buffer.Ancho, Buffer.Alto);
        var Avance = 1024 / Tam;
        Buffer.Context.beginPath();        
        Buffer.Context.moveTo(0, Buffer.Alto / 2);
        var x = 0, y = 0;
        for (var i = 0; i < Tam; i++) {
            y = (Buffer.Alto / 4) + this.DatosAnalizadorSin[i];
            Buffer.Context.lineTo(x, y);
            x += Avance;
        }
        // Parche para bajas precisiones que no terminan la onda al final del canvas
        Buffer.Context.lineTo(this.Ancho, y);
        // Pinto la onda
        Buffer.Context.stroke();
        // Actualizo la textura
        Buffer.Textura.needsUpdate = true;
    },

    // Inspirado en el pen de Noel Delgado : https://codepen.io/noeldelgado/pen/EaNjBy?editors=0010
    PintarPantalla_Solar : function(Buffer, Tick) {        
        var mx = (Buffer.Ancho / 2);
        var my = (Buffer.Alto / 2);
        Buffer.Context.fillStyle = "rgba(0, 0, 0, 0.5)";
        Buffer.Context.fillRect(0, 0, Buffer.Ancho, Buffer.Alto);
        var TamBuffer = 1024;
        if (this.Audio.Analizador)  { TamBuffer = this.Audio.Analizador.fftSize / 2; }
        var Avance = this.Constantes.TAU / TamBuffer;
        var Angulo = Tick;
        var Valor = this.DatosAnalizadorSin[0];
        
        // Pinto el circulo con la media de los graves
        var ColG = 'rgb(' + Math.round(120 + this.MediaAudio[0]) + ',' + Math.round(255 - this.MediaAudio[0]) +  ', 0)';
        Buffer.Context.strokeStyle = ColG;
        Buffer.Context.beginPath();        
        Buffer.Context.arc(mx, my, 30 + this.MediaAudio[0], 0, this.Constantes.TAU, false);
        Buffer.Context.stroke();

        // Pinto el circulo con la media de los medios        
        var Gris = 32 + Math.round(this.MediaAudio[1]);
        var ColM = 'rgb(' + Gris + ',' + Gris + ',' + Gris + ')';
        Buffer.Context.strokeStyle = ColM;
        Buffer.Context.beginPath();        
        Buffer.Context.arc(mx, my, 38 + this.MediaAudio[1], 0, this.Constantes.TAU, false);
        Buffer.Context.stroke();
        
        // Pinto el circulo con la media de los agudos        
        var ColA = 'rgb(0, ' + Math.round(120 + this.MediaAudio[2]) + ',' + Math.round(128 - this.MediaAudio[2]) +  ')';
        Buffer.Context.strokeStyle = ColA;
        Buffer.Context.beginPath();        
        Buffer.Context.arc(mx, my, 46 + this.MediaAudio[2], 0, this.Constantes.TAU, false);
        Buffer.Context.stroke();
        
        // Pinto la onda sinusoidal alrededor del circulo con la media total
        Buffer.Context.beginPath();        
        var ColT = 'rgb(' + Math.round(128 + this.MediaAudio[4]) + ',' + Math.round(255 - this.MediaAudio[4]) +  ', 0)';
        Buffer.Context.strokeStyle = ColT;

        var i = 0;
        for (var i = 0; i < TamBuffer; i++) {
            Valor = this.DatosAnalizadorSin[i] * 0.75;
            var x = mx + (Math.cos(Angulo) * (90 + Valor));
            var y = my + (Math.sin(Angulo) * (90 + Valor));
            
            Buffer.Context.lineTo(x, y);            
            Angulo += Avance;
        }
        Valor = this.DatosAnalizadorSin[0] * 0.75;
        Buffer.Context.lineTo(mx + (Math.cos(Tick) * (90 + Valor)), my + (Math.sin(Tick) * (90 + Valor)));            
        Buffer.Context.closePath();
        Buffer.Context.stroke();        
        
        // Descomentar para imprimir valores medios
        Buffer.Context.font = "32px monospace";
        Buffer.Context.fillStyle = "#000000";
        Buffer.Context.fillText("G " + Math.round(this.MediaAudio[0]), 930, 35);    // Graves
        Buffer.Context.fillText("M " + Math.round(this.MediaAudio[1]), 930, 65);    // Medios
        Buffer.Context.fillText("A " + Math.round(this.MediaAudio[2]), 930, 95);    // Agudos
        Buffer.Context.fillText("I " + Math.round(this.MediaAudio[3]), 930, 135);   // Inaudibles agudos
        Buffer.Context.fillText("T " + Math.round(this.MediaAudio[4]), 930, 165);   // media Total
        
        Buffer.Context.fillStyle = ColG;
        Buffer.Context.fillText("G " + Math.round(this.MediaAudio[0]), 928, 33);
        Buffer.Context.fillStyle = ColM;
        Buffer.Context.fillText("M " + Math.round(this.MediaAudio[1]), 928, 63);
        Buffer.Context.fillStyle = ColA;
        Buffer.Context.fillText("A " + Math.round(this.MediaAudio[2]), 928, 93);
        Buffer.Context.fillStyle = "#ffffff";
        Buffer.Context.fillText("I " + Math.round(this.MediaAudio[3]), 928, 133);
        Buffer.Context.fillStyle = ColT;
        Buffer.Context.fillText("T " + Math.round(this.MediaAudio[4]), 928, 163);
        
        Buffer.Textura.needsUpdate = true;
    },
    
    // Pinta los datos del analizador dividido en 8 partes / circulos    
    PintarPantalla_Circular8 : function(Buffer, Tick) {
        Buffer.Context.fillStyle = "rgba(0, 0, 0, 0.5)";
        var ColG = 'rgb(' + Math.round(120 + this.MediaAudio[0]) + ',' + Math.round(255 - this.MediaAudio[0]) +  ', 0)';
        var ColT = 'rgb(' + Math.round(128 + this.MediaAudio[4]) + ',' + Math.round(255 - this.MediaAudio[4]) +  ', 0)';
        var ColA = 'rgb(0, ' + Math.round(120 + this.MediaAudio[2]) + ',' + Math.round(128 - this.MediaAudio[2]) +  ')';
        
        var Cols = [ ColG, ColT, ColT, ColA, ColA, ColA, ColA, ColA ];

        Buffer.Context.fillRect(0, 0, Buffer.Ancho, Buffer.Alto);

        var TamBuffer = 1024;
        if (this.Audio.Analizador)  { TamBuffer = this.Audio.Analizador.fftSize / 2; }
        var Porcion = (TamBuffer / 8);
        var RadAvance = (this.Constantes.TAU) / Porcion;
        var Rad = -Math.PI / 2, x = 0, y = 0;
        var i = 0;
        for (var p = 0; p < 8; p++) {
            Buffer.Context.strokeStyle = Cols[p];

            Buffer.Context.beginPath();
            var cx = (p > 3) ? (p -3) * 204 : (p + 1) * 204;
            var cy = (p > 3) ? 356 : 164;
            var Valor = this.DatosAnalizador[p * Porcion] / 3.5;
            var ix = cx + (24 + (Valor)) * Math.cos(Rad);
            var iy = cy + (24 + (Valor)) * Math.sin(Rad);
            for (; i < (p + 1) * Porcion; i++) {
                Valor = this.DatosAnalizador[i] / 3.5;
                x = cx + (24 + (Valor)) * Math.cos(Rad);
                y = cy + (24 + (Valor)) * Math.sin(Rad);
                Buffer.Context.lineTo(x, y);
                Rad += RadAvance;            
            }
            Buffer.Context.lineTo(ix, iy);
            Buffer.Context.stroke();
            
        }
        Buffer.Textura.needsUpdate = true;
    },
    
    // Pinta un circulo utilizando los datos del analizador de forma que queda reflejado el lado derecho en el izquierdo
    PintarPantalla_Circular : function(Buffer, Tick) { 
        Buffer.Context.fillStyle = "rgba(0, 0, 0, 0.5)";
        Buffer.Context.strokeStyle = 'rgb(' + Math.round(128 + this.MediaAudio[4]) + ',' + Math.round(255 - this.MediaAudio[4]) +  ', 0)';
        Buffer.Context.fillRect(0, 0, Buffer.Ancho, Buffer.Alto);
        var TamBuffer = 1024;
        if (this.Audio.Analizador)  { TamBuffer = this.Audio.Analizador.fftSize / 2; }
        var RadAvance = this.Constantes.TAU / (TamBuffer * 2);
        var Rad = -Math.PI / 2, x = 0, y = 0;       
        var mx = (Buffer.Ancho / 2);
        var my = (Buffer.Alto / 2);
        var Valor = this.DatosAnalizador[0] / 1.5;
        Buffer.Context.beginPath();        
        var ix = mx + (130 + Valor) * Math.cos(Rad);
        var iy = (my + 70) + (130 + Valor) * Math.sin(Rad);
        Buffer.Context.moveTo(ix, iy);

        for (var i = 0; i < TamBuffer; i++) {            
            Valor = this.DatosAnalizador[i] / 1.5;
            x = mx + (150 + Valor) * Math.cos(Rad);
            y = (my + 70) + (130 + Valor) * Math.sin(Rad);
            Buffer.Context.lineTo(x, y);
            Rad += RadAvance;
        }
        
        for (var i = TamBuffer; i > 0; i--) {
            Valor = this.DatosAnalizador[i] / 1.5;
            x = mx + (130 + Valor) * Math.cos(Rad);
            y = (my + 70) + (130 + Valor) * Math.sin(Rad);
            Buffer.Context.lineTo(x, y);
            Rad += RadAvance;
        }

        Buffer.Context.lineTo(ix, iy);
        Buffer.Context.stroke();
        // Actualizo la textura
        Buffer.Textura.needsUpdate = true;
    },
    
    // Actualiza las transiciones para los objetos que pueden ser resaltados
    ActualizarObjetoHover : function() {
        if (this.MouseMovido === true) {
            this.RayCaster.setFromCamera(this.PosMouse, this.Camara);

            // Calculo los objetos que hacen intersección desde el punto de la camara al punto donde está el mouse
            var intersects = this.RayCaster.intersectObjects( this.Escena.children, true );        

            var HoverP  = false;        // Pantalla central
            var HoverP2 = false;        // Pantalla derecha
            var HoverP3 = false;        // Pantalla izquierda
            var HoverC  = false;        // Panel de controles
            
            var HoverCAtras    = false; // Botón Atras
            var HoverCPlay     = false; // Botón Play / Pausa
            var HoverCStop     = false; // Botón Stop
            var HoverCAdelante = false; // Botón Adelante
            
            var HoverBarraTiempo = false;
            var HoverSliderTiempo = false;
            
            var HoverDatosCancion = false; 
           
            var HoverBarras    = false; // Barras del analizador de frequencias

            for (var i = 0; i < intersects.length; i++ ) {
//                console.log(intersects[i].point);
                if (intersects[i].object === this.Pantalla)                { HoverP            = true; break; }
                if (intersects[i].object === this.Pantalla2)               { HoverP2           = true; break; }                
                if (intersects[i].object === this.Pantalla3)               { HoverP3           = true; break; }                
                if (intersects[i].object === this.SueloAnalizador)         { HoverBarras       = true; break; }   
                if (intersects[i].object.parent === this.BarrasAnalizador) { HoverBarras       = true; break; }   
                if (intersects[i].object === this.Controles)               { HoverC            = true; } // El panel de controles tiene botones dentro..
                if (intersects[i].object === this.C_Atras)                 { HoverCAtras       = true; }   
                if (intersects[i].object === this.C_Play)                  { HoverCPlay        = true; }   
                if (intersects[i].object === this.C_Adelante)              { HoverCAdelante    = true; }   
                if (intersects[i].object === this.DatosCancion)            { HoverDatosCancion = true; }
                
                if (intersects[i].object === this.C_BarraTiempo)           { 
                    HoverBarraTiempo  = true; 
//                    console.log(intersects[i].point);
                    this.C_BarraTiempo.PosHover = intersects[i].point.x + (this.AnchoBarraTiempo / 2);
                }   
            }        

            // Transiciones si hay un cambio de estado
            if (this.BarrasAnalizador.Hover !== HoverBarras) {
                this.BarrasAnalizador.Hover = HoverBarras;
                this.BarrasAnalizador.Ani.Transicion();
            }

            if (this.Pantalla.Hover !== HoverP) {
                this.Pantalla.Hover = HoverP;
                this.Pantalla.Ani.Transicion();
            }

            if (this.Pantalla2.Hover !== HoverP2) {
                this.Pantalla2.Hover = HoverP2;
                this.Pantalla2.Ani.Transicion();
            }

            if (this.Pantalla3.Hover !== HoverP3) {
                this.Pantalla3.Hover = HoverP3;
                this.Pantalla3.Ani.Transicion();
            }

            if (this.Controles.Hover !== HoverC) {
                this.Controles.Hover = HoverC;
                this.Controles.Ani.Transicion();
            }
                        
            if (this.C_Atras.Hover !== HoverCAtras) {
                this.C_Atras.Hover = HoverCAtras;
                if (this.C_Atras.Ani) { this.C_Atras.Ani.Transicion(); }
            }
            
            if (this.C_Play.Hover !== HoverCPlay) {
                this.C_Play.Hover = HoverCPlay;
                if (this.C_Play.Ani) { this.C_Play.Ani.Transicion(); }
            }
            
            if (this.C_Adelante.Hover !== HoverCAdelante) {
                this.C_Adelante.Hover = HoverCAdelante;
                if (this.C_Adelante.Ani) { this.C_Adelante.Ani.Transicion(); }
            }
            
            if (this.C_BarraTiempo.Hover !== HoverBarraTiempo) {
                this.C_BarraTiempo.Hover = HoverBarraTiempo;
            }
            
            if (this.DatosCancion.Hover !== HoverDatosCancion) {
                this.DatosCancion.Hover = HoverDatosCancion;
                this.DatosCancion.Ani.Transicion();
            }            
            
            this.MouseMovido = false;
        }
    },

    // Función que pinta cada frame de la animación
    Pintar          : function() {                  
        this.ActualizarObjetoHover();
        // Actualizo todas las animaciones en curso
        this.Animaciones.Actualizar();        
        if (this.Audio.Analizador) {
          // Obtengo los bufers con la frequencia y la onda
          this.Audio.Analizador.getByteFrequencyData(this.DatosAnalizador);
          this.Audio.Analizador.getByteTimeDomainData(this.DatosAnalizadorSin);
          // Obtengo el valor medio dentro del buffer de frequencias
          this.MediaAudio = this.MediaFrequenciasAudio();
          // Tiempo de la canción
          this.ActualizarTiempoSlider();
        }
        // Actualizo las escalas de los cubos
        this.ActualizarCubos();
        // Funciones que pintan las pantallas
        this.FuncionesPintarPantalla[this.TipoPantalla](this.BufferPantalla, this.Tick);
        this.FuncionesPintarPantalla[this.TipoPantalla2](this.BufferPantalla2, this.Tick + 6000);
        this.FuncionesPintarPantalla[this.TipoPantalla3](this.BufferPantalla3, this.Tick + 12000);
        
        this.Context.render(this.Escena, this.Camara);  
    }    
});



var EspectroAudible_Audio = function() {
    this.Iniciar = function(EsMovil, Padre, FuncionCanPlay, FuncionEnded) {
        this.CancionCargada = true;
//        var Compatibilidad = window.AudioContext || window.webkitAudioContext;
        this.AudioContext = new window.AudioContext();       
//        if (typeof (this.AudioContext.createAnalyser) === "undefined") return;
        this.Analizador = this.AudioContext.createAnalyser();
        var R = 0; // this.PrecisionAnalizador
        if (EsMovil === true) { this.Analizador.fftSize = 512;   R = 1; } // Para movil la verión de 256 columnas
        else                  { this.Analizador.fftSize = 2048;  R = 0; } // Para PC la versión de 1024 columnas
        this.Analizador.smoothingTimeConstant = 0.8; // 
        this.FuncionCanPlay = FuncionCanPlay;
        this.FuncionEnded = FuncionEnded;
        this.Padre = Padre;
        this.Canciones =[            
            { Grupo : "JT Bruce",            Titulo : "Battle Trance",                         Año : "2015",    Path : "BattleTrance.mp3",                                      Web : "https://www.jamendo.com/track/1237162/battle-trance" },
            { Grupo : "Fallen to Flux",      Titulo : "One Chance",                            Año : "2014",    Path : "OneChance.mp3",                                         Web : "https://www.jamendo.com/track/1155241/one-chance" },
            { Grupo : "From Sky to Abyss",   Titulo : "Quantum Ocean",                         Año : "2016",    Path : "QuantumOcean.mp3",                                      Web : "https://www.jamendo.com/track/1284951/quantum-ocean" }, 
            { Grupo : "In Camera",           Titulo : "Nothing's Over",                        Año : "2016",    Path : "In_Camera_-_Nothing_s_Over.mp3",                        Web : "https://www.jamendo.com/track/1397271/nothing-s-over" },
            { Grupo : "LevenRain",           Titulo : "ActionMan Versus The CyberParasites",   Año : "2016",    Path : "LevenRain_-_ActionMan_Versus_The_CyberParasites.mp3",   Web : "https://www.jamendo.com/track/1349290/actionman-versus-the-cyberparasites" },
            { Grupo : "Convergence",         Titulo : "Six Feet Under",                        Año : "2007",    Path : "Convergence_-_Six_feet_under.mp3",                      Web : "https://www.jamendo.com/track/80122/six-feet-under" }
        ];
        
        // Enlazo el evento drop del body para poder arrastrar y soltar canciones.
        Padre.Canvas.addEventListener("dragenter", function(e) { return false; });
        Padre.Canvas.addEventListener("dragover", function(e) { return e.preventDefault(); });
        
        Padre.Canvas.addEventListener("drop", function(e) {
            this.CargarCancionDrop(e.dataTransfer.files);
            e.stopPropagation();  
            e.preventDefault();         
        }.bind(this));        
        
        return R;
    };
    

    this.CargarCancion = function(PosCancion) {        
        if (PosCancion === this.CancionActual && this.CancionCargada === true) {
            return;
        }
        this.CancionActual = PosCancion;
        this.Padre.Cargando(true);
        this.CancionCargada = false;
        if (this.Cancion) { this.Cancion.pause(); }
        this.Cancion = new Audio();
        this.Cancion.controls = true;
        this.Cancion.crossOrigin = "anonymous";
        this.Cancion.src = "https://cdn.rawgit.com/devildrey33/devildrey33/ddb01d71/Ejemplos/BannerTest/Canciones/" + this.Canciones[PosCancion].Path;
        this.Cancion.addEventListener('canplay', this.CanPlay.bind(this));        
        this.Cancion.addEventListener('ended', function() { 
            this.FuncionEnded();
        }.bind(this) );        
    };    
    
    // BUG BUG BUG... en chrome cuelga la ventana de debug.. xd
    this.CargarCancionDrop = function(Archivos) {
/*        if (this.CancionCargada === false) { return; }
        this.Padre.Cargando(true);
        this.CancionCargada = false;
        this.CancionActual = -1;
        if (this.Cancion) { this.Cancion.pause(); }
        var Lector = new FileReader();
        Lector.onload = function(Archivo) { 
            var Buffer = Archivo.target.result;
            this.Cancion = new Audio();
            this.Cancion.controls = false;
            this.Cancion.src = Archivo.target.result;                
            this.Cancion.addEventListener('canplaythrough', this.CanPlay.bind(this));            
            this.Cancion.addEventListener('ended', function() { 
                this.FuncionEnded();
            }.bind(this));
            
        }.bind(this);
        Lector.readAsDataURL(Archivos[0]);*/
    }; 
    
    this.CanPlay = function() {
        if (this.CancionCargada !== true) {
            this.CancionCargada = true;

            this.AudioSource = this.AudioContext.createMediaElementSource(this.Cancion);
            this.AudioSource.connect(this.Analizador);
            this.Analizador.connect(this.AudioContext.destination);
            this.FuncionCanPlay();
        }        
    };
    
    // devuelve true si se ha hecho play, false si se ha hecho pausa
    this.PlayPausa = function() {        
        if (this.CancionActual !== -1) {
            this.AudioContext.resume();
            // El autoplay en dispositivos moviles no funciona, por lo que hay que comprobar si está realmente en play o en pausa.
            if (this.Cancion.duration > 0 && !this.Cancion.paused) { 
              this.Cancion.pause(); 
              return false;  
            } 
            else {
              this.Cancion.play();  
              return true;
            }
        }
        else { // Drag & drop
            return false;
        }
    };
    
    this.Adelante = function() {
        this.Cancion.pause(); 
        var p = 0;
        (this.CancionActual + 1 < this.Canciones.length)    ? p = this.CancionActual + 1 :      p = 0;
        this.CargarCancion(p);
    };
    
    this.Atras = function(FuncionCanPlay, FuncionEnded) {
        this.Cancion.pause(); 
        var p = 0;
        (this.CancionActual - 1 > -1)                       ? p = this.CancionActual - 1 :      p = this.Canciones.length - 1;
        this.CargarCancion(p);        
    };
        
};

var Canvas = new EspectroAudible;