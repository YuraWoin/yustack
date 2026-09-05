/* ---- 3D logo fly-in on scroll (Three.js) ----
   v5: solid black cube; the "Y" glyph and the 2 cursor bars start flush/
   embedded in the SAME front face of the cube, then slide straight out
   of that one face together (staggered, eased). The cube starts turned
   slightly away and straightens up as you scroll so the logo ends up
   facing the viewer dead-on. Motion is frame-smoothed (exponential
   damping every rAF tick) instead of snapping to raw scroll values, so
   it stays buttery even with janky/inertial scroll events. */
(function(){
  const canvas = document.getElementById('logo-canvas');
  const stage = document.getElementById('logoStage');
  const caption = document.getElementById('logoCaption');
  if(!window.THREE || matchMedia('(prefers-reduced-motion: reduce)').matches){
    canvas.style.display='none';
    caption.classList.add('show');
    return;
  }

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0,0,9);

  function resize(){
    const w = stage.clientWidth, h = innerHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  const green = 0x39ff6a;
  const group = new THREE.Group();
  scene.add(group);

  // smoothstep easing between a scroll-progress window [start,end]
  function smoothstep(t){ t = Math.min(Math.max(t,0),1); return t*t*(3-2*t); }
  function windowed(p, start, end){ return smoothstep((p-start)/(end-start)); }
  function lerp(a,b,t){ return a+(b-a)*t; }

  const pieces = []; // {mesh, embed, extend, start, end} — all slide on local Z only

  function buildLogo(){
    const brightMat = new THREE.MeshStandardMaterial({color:0x39ff7e, emissive:0x0c3d1a, emissiveIntensity:.9, metalness:.2, roughness:.28});
    const dimMat = new THREE.MeshStandardMaterial({color:0x1a6b38, emissive:0x07200f, emissiveIntensity:.55, metalness:.15, roughness:.45});
    const cubeMat = new THREE.MeshStandardMaterial({color:0x0a0c0f, metalness:.5, roughness:.4});
    const edgeMat = new THREE.LineBasicMaterial({color:green, transparent:true, opacity:.5});

    const cubeSize = 2.1;
    const cubeGeo = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    group.add(cube);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeo), edgeMat);
    group.add(edges);

    const half = cubeSize/2;
    const embedZ = half - 0.34;  // resting depth: swallowed by the FRONT face
    const outZ   = half + 0.12;  // fully emerged, sitting proud of that face

    // "Y" glyph — left half of the front face (matches the flat logo)
    const armGeo = new THREE.BoxGeometry(0.26,0.9,0.44);
    const leftArm = new THREE.Mesh(armGeo, brightMat);
    leftArm.position.set(-0.66,0.42,embedZ);
    leftArm.rotation.z = 0.62;
    group.add(leftArm);
    pieces.push({mesh:leftArm, embed:embedZ, extend:outZ, start:0.05, end:0.40});

    const rightArm = new THREE.Mesh(armGeo, brightMat);
    rightArm.position.set(-0.26,0.42,embedZ);
    rightArm.rotation.z = -0.62;
    group.add(rightArm);
    pieces.push({mesh:rightArm, embed:embedZ, extend:outZ, start:0.09, end:0.44});

    const stemGeo = new THREE.BoxGeometry(0.24,0.68,0.44);
    const stem = new THREE.Mesh(stemGeo, brightMat);
    stem.position.set(-0.46,-0.30,embedZ);
    group.add(stem);
    pieces.push({mesh:stem, embed:embedZ, extend:outZ, start:0.13, end:0.48});

    // cursor bars — right half, stacked, left-aligned with each other
    const bar1Geo = new THREE.BoxGeometry(0.58,0.20,0.44);
    const bar1 = new THREE.Mesh(bar1Geo, brightMat); // wider, bright — top
    bar1.position.set(0.38,0.20,embedZ);
    group.add(bar1);
    pieces.push({mesh:bar1, embed:embedZ, extend:outZ, start:0.24, end:0.60});

    const bar2Geo = new THREE.BoxGeometry(0.40,0.20,0.44);
    const bar2 = new THREE.Mesh(bar2Geo, dimMat); // shorter, dim — bottom
    bar2.position.set(0.29,-0.20,embedZ);
    group.add(bar2);
    pieces.push({mesh:bar2, embed:embedZ, extend:outZ, start:0.30, end:0.66});

    return edges;
  }
  const tileEdges = buildLogo();
  const clock = new THREE.Clock();

  scene.add(new THREE.AmbientLight(0x225533, 1.2));
  const pt = new THREE.PointLight(green, 2.2, 20);
  pt.position.set(3,3,6);
  scene.add(pt);

  // starting attitude: small & turned away — it straightens to face the
  // camera dead-on as the reveal completes, so the finished logo "looks at you"
  const startRot = {x:0.32, y:-0.8, z:0.08};
  group.scale.setScalar(0.001);
  group.rotation.set(startRot.x, startRot.y, startRot.z);
  group.position.z = -5;

  // damped "current" values — every one of these eases toward its scroll
  // target each frame instead of snapping, which is what removes the jitter
  let curScale = 0.001, curRotX = startRot.x, curRotY = startRot.y, curRotZ = startRot.z, curPosZ = -5;
  const curPieceZ = pieces.map(pc => pc.embed);
  let captionOn = false;

  function getProgress(){
    const rect = stage.getBoundingClientRect();
    const total = stage.offsetHeight - innerHeight;
    const scrolled = Math.min(Math.max(-rect.top,0), total);
    return total>0 ? scrolled/total : 0;
  }

  (function animate(){
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05); // clamp for tab-switch spikes
    const t = clock.getElapsedTime();
    const p = getProgress();

    // targets, purely a function of scroll — never touched directly
    const bodyIn = windowed(p, 0, 0.28);
    const targetScale = 0.001 + bodyIn*1.15;
    const targetPosZ = (1-bodyIn) * -5;
    const faceUp = windowed(p, 0.05, 0.72); // cube straightens to face the viewer
    const targetRotX = lerp(startRot.x, 0, faceUp);
    const targetRotY = lerp(startRot.y, 0, faceUp);
    const targetRotZ = lerp(startRot.z, 0, faceUp);

    // frame-rate independent exponential smoothing — this is the "very smooth" bit
    const k = 1 - Math.pow(0.0008, dt);
    curScale += (targetScale - curScale) * k;
    curPosZ  += (targetPosZ  - curPosZ ) * k;
    curRotX  += (targetRotX  - curRotX ) * k;
    curRotY  += (targetRotY  - curRotY ) * k;
    curRotZ  += (targetRotZ  - curRotZ ) * k;

    group.scale.setScalar(curScale);
    group.position.z = curPosZ;
    group.position.y = Math.sin(t*0.6)*0.05*bodyIn; // gentle idle bob, fades in with the cube
    group.rotation.set(curRotX, curRotY, curRotZ);

    pieces.forEach((pc,i)=>{
      const tt = windowed(p, pc.start, pc.end);
      const target = pc.embed + tt*(pc.extend - pc.embed);
      curPieceZ[i] += (target - curPieceZ[i]) * k;
      pc.mesh.position.z = curPieceZ[i];
    });

    tileEdges.material.opacity = 0.4 + Math.sin(t*1.4)*0.15;

    const wantsCaption = p > 0.9;
    if(wantsCaption !== captionOn){ captionOn = wantsCaption; caption.classList.toggle('show', captionOn); }

    renderer.render(scene, camera);
  })();
})();
