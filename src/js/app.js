import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { gsap } from 'gsap';

export default function () {
    /** 변수 */

  //** const */
  const group = new THREE.Group()
  const meshes = [],
        materials = []
  //** let */
  let cubeCount  = 0;
  let geometry, material
  
  //** param */
  const gridCount = {
    x:10,
    y:20
  }
  const girdSize = {
    x: 0.5,
    y: 0.5,
  }

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias : true,
  });
  renderer.setClearColor(0x0a1245, 1);

  const container = document.querySelector('#container');
  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );

  /** library */
  /** texture */
  const loader = new THREE.TextureLoader()
  const texture = loader.load('./public/assets/img1.jpg')


  /** light */
  const light = new THREE.DirectionalLight( 0xffffff, 7 );
  light.position.set( 0.5, 1, 1 ).normalize();
  scene.add( light );

  /** Camera */
  camera.position.set(0, 0, 7);


  /** Controls */
  const orbitControls = () => {
    const controls = new OrbitControls(camera, renderer.domElement);
    return controls;
  }
  



  /** create */
  const create = () => {
    //create mesh
    const ux = 1/ gridCount.x
    const uy = 1/ gridCount.y
    
    for(let i  = 0 ; i < gridCount.y ; i++) {
      for(let j = 0 ; j < gridCount.x ; j++){
        geometry = new THREE.BoxGeometry(girdSize.x,girdSize.y)  ;
        change_uvs(geometry, ux, uy,j,i)  //geometry buffer

        materials[cubeCount] = new THREE.MeshPhongMaterial({
          color: 'white',
          map : texture
        });//material 생성
        material = materials[cubeCount]// 메트리얼 할당

        const mesh = new THREE.Mesh(
          geometry,
          material
        )//매쉬 생성

        let x = j * girdSize.x - ((gridCount.x * girdSize.x) / 2) + girdSize.x/2 + 0.1*j
        let y = i * girdSize.y - ((gridCount.y * girdSize.y) / 2) + girdSize.y/2 + 0.1*i
        mesh.position.set(x, y, 0);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
        
        group.add(mesh)
        cubeCount++;
      }///inner for end
    }//out for end
    scene.add(group);
  }//create end

  /**
   *  uv mapping
   */
  const change_uvs = (geo, unitx, unity, offsetx, offsety) => {
    const uvs = geo.attributes.uv.array;
    for(let i = 0; i < uvs.length; i += 2){
      uvs[i] = (uvs[i] + offsetx) * unitx
      uvs[i + 1] = (uvs[i + 1] + offsety) * unity
    }
  }






  //resize
  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  //addEvent
  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  //draw
  const draw = ( orbitControl) => {
    orbitControl.update();
    renderer.render(scene, camera);

    requestAnimationFrame(() => {
      draw(orbitControl);
    });
  };




  const initialize = () => {
    create();
    const orbitControl = orbitControls()
    addEvent();
    resize();
    draw(orbitControl);
  };

  initialize();
}