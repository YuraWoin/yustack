/* ---- 3D logo fly-in on scroll (Three.js) ----
   v3: solid black cube with pieces poking out of all 4 side faces —
   "Y" glyph on front, cursor bars on right/left/back. Faster fly-in,
   shorter scroll distance, less rotation. */
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

  // YuStack mark v2: a solid black cube with the "Y" glyph poking out of the
  // front face and the two terminal cursor bars poking out of the right face —
  // like the icon is physically carved into / emerging from a block.
  function buildLogo(){
    const brightMat = new THREE.MeshStandardMaterial({color:0x39ff7e, emissive:0x0c3d1a, emissiveIntensity:.9, metalness:.2, roughness:.28});
    const dimMat = new THREE.MeshStandardMaterial({color:0x1a6b38, emissive:0x07200f, emissiveIntensity:.55, metalness:.15, roughness:.45});
    const cubeMat = new THREE.MeshStandardMaterial({color:0x0a0c0f, metalness:.5, roughness:.4});
    const edgeMat = new THREE.LineBasicMaterial({color:0x39ff7e, transparent:true, opacity:.5});

    // the black cube body
    const cubeSize = 2.1;
    const cubeGeo = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    group.add(cube);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeo), edgeMat);
    group.add(edges);

    const half = cubeSize/2;

    // "Y" glyph — arms + stem, half-embedded, poking out of the FRONT face (+z)
    const armGeo = new THREE.BoxGeometry(0.28,0.95,0.5);
    const leftArm = new THREE.Mesh(armGeo, brightMat);
    leftArm.position.set(-0.35,0.42,half+0.1);
    leftArm.rotation.z = 0.62;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, brightMat);
    rightArm.position.set(0.05,0.42,half+0.1);
    rightArm.rotation.z = -0.62;
    group.add(rightArm);

    const stemGeo = new THREE.BoxGeometry(0.26,0.75,0.5);
    const stem = new THREE.Mesh(stemGeo, brightMat);
    stem.position.set(-0.15,-0.28,half+0.1);
    group.add(stem);

    // terminal cursor bars — poking out of the RIGHT face (+x)
    const bar1Geo = new THREE.BoxGeometry(0.55,0.22,0.62);
    const bar1 = new THREE.Mesh(bar1Geo, brightMat);
    bar1.position.set(half+0.14,0.4,0.15);
    group.add(bar1);

    const bar2Geo = new THREE.BoxGeometry(0.4,0.22,0.62);
    const bar2 = new THREE.Mesh(bar2Geo, dimMat);
    bar2.position.set(half+0.06,-0.05,-0.35);
    group.add(bar2);

    // a mirrored bright bar poking out of the LEFT face (-x) — so the mark
    // reads as surrounded from all 4 sides, not just 2
    const bar3Geo = new THREE.BoxGeometry(0.5,0.22,0.62);
    const bar3 = new THREE.Mesh(bar3Geo, brightMat);
    bar3.position.set(-(half+0.12),-0.15,0.1);
    group.add(bar3);

    // a dim bar poking out of the BACK face (-z)
    const bar4Geo = new THREE.BoxGeometry(0.62,0.22,0.4);
    const bar4 = new THREE.Mesh(bar4Geo, dimMat);
    bar4.position.set(0.2,0.05,-(half+0.08));
    group.add(bar4);

    return edges;
  }
  const tileEdges = buildLogo();
  const clock = new THREE.Clock();

  scene.add(new THREE.AmbientLight(0x225533, 1.2));
  const pt = new THREE.PointLight(green, 2.2, 20);
  pt.position.set(3,3,6);
  scene.add(pt);

  group.scale.setScalar(0.001);
  group.rotation.set(0.4,-0.6,0.1);

  function onScroll(){
    const rect = stage.getBoundingClientRect();
    const total = stage.offsetHeight - innerHeight;
    const scrolled = Math.min(Math.max(-rect.top,0), total);
    const p = total>0 ? scrolled/total : 0; // 0 -> 1 progress through the stage

    // fly-in fast, in the first ~25% of the stage, then hold with a small rotation
    const flyIn = Math.min(p/0.25, 1);
    const ease = 1 - Math.pow(1-flyIn,3);
    group.scale.setScalar(0.001 + ease*1.15);
    group.position.z = (1-ease) * -6;
    group.rotation.y = -0.5 + p*Math.PI*0.55;

    caption.classList.toggle('show', flyIn>0.7);
  }
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  (function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.position.y = Math.sin(t*0.6)*0.06;
    tileEdges.material.opacity = 0.4 + Math.sin(t*1.4)*0.15;
    renderer.render(scene, camera);
  })();
})();
