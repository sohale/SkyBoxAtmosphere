/* ------------------------------------------------- CLOUDY SKY -------------------------------------------------*/
// See skydome.js from mp5-private for more information on format of a plugin.
// Also see https://github.com/8adam95/cloudySky
// Customisable Skybox
var SkyBox = function()
{
    this.preprefix = 'plugins/SkyBoxAtmosphere/';

    const POSXYZ = ['posx.jpg', 'posy.jpg', 'posz.jpg', 'negx.jpg', 'negy.jpg', 'negz.jpg' ];
    const PXYZ = ['px.jpg', 'py.jpg', 'pz.jpg', 'nx.jpg', 'ny.jpg', 'nz.jpg' ];
    // enum:
    this.TYPE_SEPARATE6 = "separate 6 skybox sides";
    this.TYPE_EQUIRECT = "Equirectangular";
    this.TYPE_RICOH_THETA = "Ricoh Equirectangular"; // By Ricoh. Need to skip one pixel.

    this.availableSkyboxes = [
      {
        displayName: 'MilkyWay',
        type: this.TYPE_SEPARATE6,
        prefix: 'skyboxes/MilkyWay/',
        sides: ['dark-s_ny.jpg', 'dark-s_py.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg','dark-s_px.jpg', 'dark-s_nx.jpg'],
        credits: `Unknown. See https://github.com/mrdoob/three.js/`
      },

      {
	displayName: 'Bridge (Paul Debevec)',
        type: this.TYPE_SEPARATE6,
        prefix: 'skyboxes/Bridge2/',
        sides: POSXYZ,
        credits: `Equirectangular Map by <a href="http://gl.ict.usc.edu/Data/HighResProbes/">University of Southern California</a><br/>Spherical Map by <a href="http://www.pauldebevec.com/Probes/">Paul Debevec</a>`
      },

      {
	displayName: 'Park2 (Emil Persson)',
        type: this.TYPE_SEPARATE6,
        prefix: 'skyboxes/Park2/',
        sides: POSXYZ,
        credits=`This is the work of Emil Persson, aka Humus. http://www.humus.name humus@comhem.se`
      },

      {
	displayName: 'Park3 (Emil Persson)',
        type: this.TYPE_SEPARATE6,
        prefix: 'skyboxes/Park3Med/',
        sides: PXYZ,
        credits=`This is the work of Emil Persson, aka Humus. http://www.humus.name humus@comhem.se`
      },

      {
	displayName: 'Swedish Royal Castle (Emil Persson)',
        type: this.TYPE_SEPARATE6,
        prefix: 'skyboxes/SwedishRoyalCastle/',
        sides: PXYZ,
        credits=`This is the work of Emil Persson, aka Humus. http://www.humus.name humus@comhem.se`
      },

	/*
	MilkyWay
	Bridge2
	Park2
	Park3Med
	SwedishRoyalCastle

	orange-sky
	pisa
	*/

eqrec/R0011312_20151110181801298.jpg 

      {
	displayName: 'Table in room',
        type: this.TYPE_RICOH_THETA,
        prefix: 'eqrec/',
        image: 'R0011312_20151110181801298.jpg',
        credits=`Taken by SS`
      },

      {
	displayName: 'Inside Ultimaker',
        type: this.TYPE_RICOH_THETA,
        prefix: 'eqrec/',
        image: 'R0011314_20151110181154665.jpg',
        credits=`By SS`
      },

      {
	displayName: 'Wrecked hut',
        type: this.TYPE_EQUIRECT,
        prefix: 'eqrec/',
        image: '2294472375_24a3b8ef46_o.jpg',
        credits=`Unknown. See https://github.com/mrdoob/three.js/`
      },

/2294472375_24a3b8ef46_o.jpg 

    ];
};

SkyBox.prototype = Object.create(AtmospherPlugin.prototype);
SkyBox.prototype.constructor = SkyBox;


SkyBox.initLoadtime = function (){
    //initStatic
    availablePlugins.push("SkyBox");
};

SkyBox.prototype.init = function (SHADOW_MAP_WIDTH, SHADOW_MAP_HEIGHT){
    this.shown=false;
    assert(SHADOW_MAP_WIDTH);
    assert(SHADOW_MAP_HEIGHT);
    this.SHADOW_MAP_WIDTH = SHADOW_MAP_WIDTH;
    this.SHADOW_MAP_HEIGHT = SHADOW_MAP_HEIGHT;
};

SkyBox.prototype.initLights = function (x,y,z, color, intensity, SHADOW_MAP_WIDTH, SHADOW_MAP_HEIGHT)
{
    // mainlight is removed later.
    assert(SHADOW_MAP_WIDTH);
    assert(SHADOW_MAP_HEIGHT);
    // LIGHTS
    //THREE.DirectionalLight (ray are parallel, source seems very far => sun) or THREE.SpotLight (ray seems coming from a unique source) can handle shadows
    light = new THREE.SpotLight(color, intensity);
    light.position.set(x,y,z);
    light.visible= true;
    light.castShadow = true; //Enable shadow casting
    console.warn("light.shadowDarkness")
    light.shadowDarkness = 0.5; //0 means no shadows,1 means pure black shadow
    //light.shadowCameraVisible = true; //Show the shadow camera (debugging)
    light.shadow.mapSize.width = SHADOW_MAP_WIDTH; //2048; // default is 512
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT; //2048; // default is 512
    light.name="mainlight";
    if(!light)
        console.error("light not initialized");
    else
        scene.add(light);
};

SkyBox.prototype._makeSkybox = function (cskyobj, urls, size ) {
    // todo: cskyobj === this, so it is not needed.
    var hemiLight = new THREE.HemisphereLight(0xffbbaa, 0x040404, 1);
	hemiLight.name = "hemiLight";
   	hemiLight.position.z = 500;
    if(!hemiLight)
        console.error("hemiLight not initialized");
    else
        scene.add(hemiLight);

	/* new version 
		textureCube = new THREE.CubeTextureLoader().load( urls );
		textureCube.format = THREE.RGBFormat;
		textureCube.mapping = THREE.CubeReflectionMapping;

		var textureLoader = new THREE.TextureLoader();

		...
		var cubeShader = THREE.ShaderLib[ "cube" ];
		var cubeMaterial = new THREE.ShaderMaterial( {
			fragmentShader: cubeShader.fragmentShader,
			vertexShader: cubeShader.vertexShader,
			uniforms: cubeShader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
		} );

		cubeMaterial.uniforms[ "tCube" ].value = textureCube;

		cubeMesh.material = cubeMaterial;
		cubeMesh.visible = true;
		sphereMaterial.envMap = textureCube;
		sphereMaterial.needsUpdate = true;


				textureEquirec = textureLoader.load( eqrect );
				textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
				textureEquirec.magFilter = THREE.LinearFilter;
				textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;

				var equirectShader = THREE.ShaderLib[ "equirect" ];
				...
				var equirectMaterial = new THREE.ShaderMaterial( {
					fragmentShader: equirectShader.fragmentShader,
					vertexShader: equirectShader.vertexShader,
					uniforms: equirectShader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );

				equirectMaterial.uniforms[ "tEquirect" ].value = textureEquirec;

						cubeMesh.material = equirectMaterial;
						cubeMesh.visible = true;
						sphereMaterial.envMap = textureEquirec;
						sphereMaterial.needsUpdate = true;

	*/
	// todo: use a callback in  loadTextureCube()
	cskyobj.skyboxCubemap = THREE.ImageUtils.loadTextureCube( urls );
	cskyobj.skyboxCubemap.format = THREE.RGBFormat;
	cskyobj.skyboxShader = THREE.ShaderLib.cube;
	cskyobj.skyboxShader.uniforms.tCube.value = cskyobj.skyboxCubemap;
	cskyobj.skymesh = new THREE.Mesh(
		new THREE.BoxGeometry( size, size, size ),
		new THREE.ShaderMaterial({
			fragmentShader : cskyobj.skyboxShader.fragmentShader, vertexShader : cskyobj.skyboxShader.vertexShader,
			uniforms : cskyobj.skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
		})
	);
	scene.add( cskyobj.skymesh );
    //return cskyobj.skymesh;
}

SkyBox.prototype.show = function (){
    assert(!this.shown);
    this.shown = true;

        console.warn("get_default_shadowmap_size() is called inside atmosphere.show()")
        var shmz = this.get_default_shadowmap_size();
        var SHADOW_MAP_WIDTH = shmz[0];
        var SHADOW_MAP_HEIGHT = shmz[1];
        var mainlight = scene.getObjectByName( "mainlight" );
        if(mainlight) {
            //mainlight.position.set(x,y,z);
            scene.remove(mainlight);
        }
        this.initLights(-110*5, -90*5, 126*5, 0xff4444, 1.5, this.SHADOW_MAP_WIDTH, this.SHADOW_MAP_HEIGHT);

	var chosen_idx = 1;
	var chosen = this.availableSkyboxes[chosen_idx];

	if (chosen.type == this.TYPE_SEPARATE6) {
	var prefix = this.preprefix + chosen.prefix;
	assert(chosen.prefix[chosen.prefix.length-2] == '/');
        var sidesimagepaths = [];
        for ( var i=0; i< 6; ++i) {
	    sidesimagepaths.push( prefix + chosen.sides[i] );
	}
	this._makeSkybox(this, sidesimagepaths, 8000 );  // 8 meters!
	} else if (chosen.type === this.TYPE_EQUIRECT || chosen.type === this.TYPE_RICOH_THETA ) {
	    if (chosen.type == this.TYPE_RICOH_THETA) {
		// By Ricoh. Need to skip one pixel if it's a 360 image using Ricoh Theta.
	    }
	    console.error("Not implemented.");
	    throw "Not implemented";
	} else {
	    console.error("Unknown Skybox type.");
	}

    //Customising the bed grid
    var g=scene.getObjectByName("grid");
    if(g){
        g.material.color.setRGB(0,0,1);
        //scene.remove(g)
    }

    //Customising the bed surface
    var bed=scene.getObjectByName("bed");
    if(bed){
        //bed.material.color.setRGB(0.3,0.3,0.3)
    }

    renderer.setClearColor(0xffffff); // why?
    this.status = "SkyBoxAtmospher up and running";
    console.info("ENV MAP CREDITS: ", chosen.credits);
};

SkyBox.prototype.hide = function(){
    assert(this.shown);
    this.shown=false;
    var hl = scene.getObjectByName( "hemiLight" );
    if(hl) scene.remove(hl); //never tested

    var ml = scene.getObjectByName( "mainlight" );
    _expect(ml);
    if(ml) scene.remove(ml); //never tested

    /*
                fixme:
                DOES NOT REMOVE THE PLUGIN
    */

    scene.remove(this.skymesh);
    //this.skymesh.dispose();
    this.skymesh = null;
    this.skyboxCubemap=null;
    this.skyboxShader=null;
    renderer.setClearColor(0x999999);

};

SkyBox.prototype.goPerspective = function(){
};
SkyBox.prototype.goOrthographic = function(){
};

SkyBox.prototype.setShadowQuality = function(shadowMapWidth, shadowMapHeight){
    if(!CONFIG.performance.useShadow) return;
    //this.light is ambient ==> irrelevant
    this.light.shadow.mapSize.width = shadowMapWidth; // default is 512
    this.light.shadow.mapSize.hight = shadowMapHeight; // default is 512
    this.light.shadowMap.dispose(); // important
    this.light.shadowMap = null;
};

SkyBox.prototype.getInfo = function(){ return "SkyBox plugin. (c) 2015. " + this.status;}; //Download or clone from github.com/8adam95/cloudySky.git into DesignSoftware/plugins.

SkyBox.initLoadtime();



//todo: Plugin (Unit) Tests by mp5

var __a = PatternMatchClass(SkyBox, Patterns.classMethods.atmospher_plugin);
assert(__a);

