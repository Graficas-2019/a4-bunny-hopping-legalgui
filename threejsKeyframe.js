var renderer = null,
scene = null,
camera = null,
root = null,
group = null,
cube = null,
waves = null,
directionalLight = null;

var duration = 10, // sec

// CHANGE TO OTHER ANIMATOR AND ANIMATION
crateAnimator = null,
waveAnimator = null,
lightAnimator = null,
waterAnimator = null,
animateCrate = true,
animateWaves = true,
animateLight = true,
animateWater = true,
loopAnimation = true;

// CHANGE TO OTHER OBJECT
animateBunny = true;
bunnyAnimator = null;


// CHANGE TO OTHER SURFACE URL
var waterMapUrl = "./images/water_texture.jpg";
var createMapUrl = "./images/eye_texture.jpg";
var surfaceMapUrl = "./images/surface_texture.jpg";

// SAME FUNCTION
function run()
{
    requestAnimationFrame(function() { run(); });

        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();

        // Update the camera controller
        orbitControls.update();
}

// SAME FUNCTION
function createScene(canvas)
{

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.TextureLoader().load("./images/farm.jpg");

    const { width, height } = getWidthAndHeight();
    const ratio = width / height;

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 100, ratio, 1, 4000 );
    camera.position.set(0, 2, 8); // ATTENTION
    // Add the orbit control
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map

    var waterMap = new THREE.TextureLoader().load(waterMapUrl);
    waterMap.wrapS = waterMap.wrapT = THREE.RepeatWrapping;
    waterMap.repeat.set(4, 4);

    // CHANGE TO OTHER SURFACE
    var surfaceMap = new THREE.TextureLoader().load(surfaceMapUrl);
    surfaceMap.wrapS = surfaceMap.wrapT = THREE.RepeatWrapping;
    surfaceMap.repeat.set(5,5);

    var color = 0xffffff;
    var ambient = 0x888888;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);

    waves = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:waterMap, side:THREE.DoubleSide}));
    waves.rotation.x = -Math.PI / 2;
    waves.position.y = -1.02;

    // CHANGE TO OTHER SURFACE
    surface = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:surfaceMap, side:THREE.DoubleSide}));
    surface.rotation.x = -Math.PI / 2;

    // Add the waves to our group
    // root.add( waves );

    // // CHANGE TO OTHER SURFACE
    root.add( surface );

    // Create the cube geometry
    map = new THREE.TextureLoader().load(createMapUrl);
    geometry = new THREE.CubeGeometry(2, 2, 2);

    // And put the geometry and material together into a mesh
    var color = 0xffffff;
    ambient = 0x888888;
    cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color,
        map:map,
        transparent:true}));

    cube.position.z = 0
    cube.position.y = 3
    cube.position.x = 0
    // EL OJO DE LA PERDICIÓN
    // Add the mesh to our group
    // group.add( cube );

    // CODE FROM THREE.JS ORG
    // instantiate a loader
    var loader = new THREE.OBJLoader();

    // load a resource
    loader.load(
      // resource URL
      './Stanford_Bunny_OBJ-JPG/20180310_KickAir8P_UVUnwrapped_Stanford_Bunny.obj',
      // called when resource is loaded
      function ( object ) {

        // CREATE MESH WITH ATTRIBUTES
        var texture = new THREE.TextureLoader().load('./Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_g005c.jpg')
        object.scale.set(4,4,4);
        object.castShadow = true;
        // TRAVERSE THROUGH OBJECT
        object.traverse((next) => {
          if(!(next instanceof THREE.Mesh)){
            console.log('Error defining mesh for non-mesh object.');
          }else{
            next.material.map = texture;
            if(!next.recieveShadow){
              next.receiveShadow = true;
            }
            if(!next.castShadow){
              next.castShadow = true;
            }
          }
        });
        group.add( object );

      },
      // called when loading is in progresses
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log( 'An error happened' );

      }
    );

    // Now add the group to our scene
    scene.add( root );


}

// FUNCTION YO CONFIGURE STEPS AND DIRECTION
function configureAnimation(){
  // BASE POSITION AND JUMP INTERVAL
  let pos = 0, rightCount = 0, leftCount = 0, leftStep = 3, rightStep = 8;

  // CREATE LEFT AND RIGHT MOVEMENT OBJECT
  let moves = { left: [], right: []};

  // MOVE WHILE THERE'S RIGHT STEP
  while (rightCount < rightStep){
    leftCount = 0
    // MOVE WHILE THER'S LEFT STEP
    while (leftCount < leftStep){
      // PUSH THE NEW POSITION
      moves.left.push(pos);
      // UPDATE POSITION
      pos += (1/rightStep)/leftStep;
      leftCount++;
    }
    // PUSH THE NEW POSITION
    moves.right.push(pos);
    rightCount++;
  }

  var jumpVal = .5
  //       0 1 2  3  4  5  6  7  8
  var x = [6,4.5,3, 1.5, 0,-1.5,-3,-4.5,-6];
  var y = [0, .5]
  var z = [3,1.5,0,-1.5,-3];

  // TRAYECTORIES DEFINED BY VECTOR
  moves.trayectories = [
    {x: x[4],y: y[0], z: z[2]}, {x: x[5], y: y[1], z: z[3]}, {x: x[6], y: y[0], z: z[4]},
    {x: x[7],y: y[1], z: z[3]}, {x: x[8], y: y[0], z: z[3]}, {x: x[7], y: y[1], z: z[1]},
    {x: x[6],y: y[0], z: z[0]}, {x: x[5], y: y[1], z: z[1]}, {x: x[4], y: y[0], z: z[2]},
    {x: x[3],y: y[1], z: z[3]}, {x: x[2], y: y[0], z: z[4]}, {x: x[1], y: y[1], z: z[3]},
    {x: x[0],y: y[0], z: z[2]}, {x: x[1], y: y[1], z: z[1]}, {x: x[2], y: y[0], z: z[0]},
    {x: x[3],y: y[1], z: z[1]}, {x: x[4], y: y[0], z: z[2]}];

  // ROTATIONS DEFINED BY VECTOR AND TRANSFORM MATRIX
  var rotations = [0, 3, 4, 3, -1];
  moves.angles = [
    {y: rotations[0]}, {y: rotations[1]}, {y: rotations[2]},
    {y: rotations[3]}, {y: rotations[4]}, {y: rotations[3]},
    {y: rotations[2]}, {y: rotations[1]}, {y: rotations[0]}];

  return {moves};
}

function playAnimations()
{
    // position animation
    if (crateAnimator)
        crateAnimator.stop();

    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);


    // color animation
    if (lightAnimator)
        lightAnimator.stop();

    directionalLight.color.setRGB(1, 1, 1);

    if (animateLight)
    {
        lightAnimator = new KF.KeyFrameAnimator;
        lightAnimator.init({
            interps:
                [
                    {
                        keys:[0, .4, .6, .7, .8, 1],
                        values:[
                                { r: 1, g : 1, b: 1 },
                                { r: 0.66, g : 0.66, b: 0.66 },
                                { r: .333, g : .333, b: .333 },
                                { r: 0, g : 0, b: 0 },
                                { r: .667, g : .667, b: .667 },
                                { r: 1, g : 1, b: 1 },
                                ],
                        target:directionalLight.color
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000,
        });
        lightAnimator.start();
    }

    // INITIATE ANIMATION
    if (animateBunny){
      // GET THE MOVES INFORMATION
      moves = configureAnimation()['moves']
      bunnyAnimator = new KF.KeyFrameAnimator;
      bunnyAnimator.init({
          interps:
              [
                  {
                      keys:moves.left,
                      values:moves.trayectories,
                      target:group.position
                  },
                  {
                      keys:moves.right,
                      values:moves.angles,
                      target:group.rotation
                  },
              ],
          loop: loopAnimation,
          duration:duration * 1000,
      });
      bunnyAnimator.start();
    }

}

// GET WIDTH AND HEIGHT
function getWidthAndHeight() {
  const width = $(window).width();
  const height = $(window).height();
  return { width, height };
}

// UPDATE THE VIEWPORT
function updateViewport() {
  const { width, height } = getWidthAndHeight();

  // FOV WILL GET RID OF BOUNDARY LENSING
  const fov = Math.atan2(height, width) * 100;
  // UPDATE ASPECT RATIO AND UPDATE PROJECTION
  camera.aspect = width / height;
  camera.fov = fov;
  camera.updateProjectionMatrix();
  // SET NEW SIZE
  renderer.setSize(width, height);
}

// RESIZING FUNCTION ON WINDOW
$(window).on(
  "resize",
  updateViewport
);
