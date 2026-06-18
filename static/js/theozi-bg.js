// ꨄ︎𝐓𝐇𝐄𝐎𝐙𝐈 𝐀𝐈ꨄ︎ — Animation 3D Particules
(function() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('theozi-canvas-container');
  if (!container) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Particules
  const count     = 2200;
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const c1 = new THREE.Color('#00f2fe');
  const c2 = new THREE.Color('#9b51e0');
  const c3 = new THREE.Color('#4facfe');

  for (let i = 0; i < count * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 22;
    positions[i + 1] = (Math.random() - 0.5) * 16;
    positions[i + 2] = (Math.random() - 0.5) * 16;
    const t    = Math.random();
    const mixed = t < 0.5 ? c1.clone().lerp(c3, t * 2) : c3.clone().lerp(c2, (t - 0.5) * 2);
    colors[i]     = mixed.r;
    colors[i + 1] = mixed.g;
    colors[i + 2] = mixed.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.052,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Anneau lumineux
  const ringGeo = new THREE.TorusGeometry(4, 0.01, 16, 200);
  const ringMat = new THREE.MeshBasicMaterial({ color: '#00f2fe', transparent: true, opacity: 0.1 });
  const ring    = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth)  - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.022;
    particles.rotation.x = t * 0.007;
    ring.rotation.z      = t * 0.035;
    ring.material.opacity = 0.07 + Math.sin(t * 0.5) * 0.04;
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.035;
    camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.035;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
})();
