(function () {
  var canvas = document.getElementById('logo-canvas');
  if (!canvas || !window.THREE) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.remove(); return; }

  var hero = canvas.parentElement;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 9;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  scene.environment = makeEnvironment();

  function makeEnvironment() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    var ctx = c.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#06130a');
    g.addColorStop(0.5, '#0f2414');
    g.addColorStop(1, '#041008');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
    var soft = ctx.createLinearGradient(0, 90, 0, 150);
    soft.addColorStop(0, 'rgba(57,255,106,0)');
    soft.addColorStop(0.5, 'rgba(57,255,106,0.95)');
    soft.addColorStop(1, 'rgba(57,255,106,0)');
    ctx.fillStyle = soft; ctx.fillRect(0, 90, 512, 60);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    var pmrem = new THREE.PMREMGenerator(renderer);
    var rt = pmrem.fromEquirectangular(tex);
    pmrem.dispose();
    return rt.texture;
  }

  var group = new THREE.Group();
  scene.add(group);
  var spinner = new THREE.Group();
  group.add(spinner);

  var CUBE_H = 2.3;
  var HALF = CUBE_H / 2;

  var cubeMat = new THREE.MeshStandardMaterial({
    color: 0x0b0f0c,
    metalness: 0.9,
    roughness: 0.28,
    envMapIntensity: 1.5
  });

  function box(x, y, w, h, depth, mat) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth), mat);
    m.position.set(x, y, HALF - depth * 0.5 + 0.06);
    return m;
  }

  var armMat = new THREE.MeshStandardMaterial({
    color: 0x39ff6a,
    emissive: 0x0e3d1a,
    emissiveIntensity: 0.5,
    metalness: 0.35,
    roughness: 0.35,
    envMapIntensity: 1.0
  });
  var dimMat = new THREE.MeshStandardMaterial({
    color: 0x1a6b38,
    emissive: 0x0a2a12,
    emissiveIntensity: 0.6,
    metalness: 0.25,
    roughness: 0.5,
    envMapIntensity: 0.7
  });

  var cube = new THREE.Mesh(new THREE.BoxGeometry(CUBE_H, CUBE_H, CUBE_H), cubeMat);
  spinner.add(cube);

  var ED = 0.16;
  var arm = function (cx, cy, rot, mat) {
    var m = box(cx, cy, ED, 0.92, ED, mat);
    m.rotation.z = rot;
    return m;
  };
  var stem = box(0.02, -0.46, ED, 0.92, ED, armMat);
  spinner.add(
    arm(-0.47, 0.30, -0.72, armMat),
    arm(0.50, 0.30, 0.72, armMat),
    stem
  );
  var barA = box(0.72, 0.36, 0.44, 0.20, ED, armMat);
  var barB = box(0.72, -0.02, 0.32, 0.20, ED, dimMat);
  spinner.add(barA, barB);

  var edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(CUBE_H + 0.001, CUBE_H + 0.001, CUBE_H + 0.001)),
    new THREE.LineBasicMaterial({ color: 0x39ff6a, transparent: true, opacity: 0.35 })
  );
  spinner.add(edges);

  var glowTex = makeGlow();
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex,
    color: 0x39ff6a,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  glow.scale.set(6.2, 6.2, 1);
  group.add(glow);

  var particles = makeParticles();
  scene.add(particles);

  function makeGlow() {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(57,255,106,1)');
    g.addColorStop(0.4, 'rgba(57,255,106,0.35)');
    g.addColorStop(1, 'rgba(57,255,106,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  function makeParticles() {
    var N = 130;
    var pos = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      var r = 5.5 + Math.random() * 4.5;
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 1.5;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x39ff6a,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
  }

  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var canParallax = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canParallax) {
    window.addEventListener('mousemove', function (e) {
      mouse.tx = (e.clientX / Math.max(1, hero.offsetWidth)) * 2 - 1;
      mouse.ty = (e.clientY / Math.max(1, hero.offsetHeight)) * 2 - 1;
    });
  }

  function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

  var TIME = 0;
  var clock = new THREE.Clock();

  function easeOut(t) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }

  function tick() {
    var dt = Math.min(clock.getDelta(), 0.05);
    TIME += dt;

    var y = window.scrollY;
    var h = hero.offsetHeight || window.innerHeight;
    var fro = easeOut(Math.max(0, Math.min(1, y / (h * 0.55))));
    var isMobile = (hero.offsetWidth || 1) < 640;

    var spin = smoothstep(fro) * TIME * 0.09;
    spinner.rotation.y = spin;

    group.position.x = (1 - fro) * (isMobile ? 0 : 2.3);
    group.position.y = (isMobile ? -0.9 : -0.15) + Math.sin(TIME * 0.7) * 0.06 * fro;
    var s = (isMobile ? 0.38 : 0.5) + 0.5 * fro;
    group.scale.setScalar(Math.max(0.01, s));
    group.rotation.y = (1 - fro) * -2.4;
    group.rotation.x = (1 - fro) * 0.35;

    if (canParallax) {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      cube.rotation.x = mouse.y * 0.14;
      cube.rotation.y = mouse.x * 0.14;
    } else {
      cube.rotation.x = Math.sin(TIME * 0.4) * 0.05;
      cube.rotation.z = Math.cos(TIME * 0.3) * 0.04;
    }

    particles.rotation.y = TIME * 0.03;
    glow.material.opacity = 0.12 + Math.sin(TIME * 1.2) * 0.04;

    canvas.style.opacity = (1 - fro * 0.9).toFixed(3);

    requestAnimationFrame(tick);
  }

  function resize() {
    var w = hero.offsetWidth || 1;
    var h = hero.offsetHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) clock.getDelta();
  });

  window.addEventListener('resize', resize);
  resize();
  tick();
})();