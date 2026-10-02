// Decorative canvas artwork, rendered locally without dependencies or tracking.
(() => {
  const canvas = document.querySelector('#neural-canvas');
  const context = canvas.getContext('2d');
  const panel = canvas.closest('.neural-panel');
  const toggle = document.querySelector('#neural-toggle');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!context) { toggle.hidden = true; return; }

  const tau = Math.PI * 2;
  const nodeCount = 112;
  const nodes = Array.from({ length: nodeCount }, (_, index) => {
    const y = 1 - (index + .5) * 2 / nodeCount;
    const ring = Math.sqrt(1 - y * y);
    const angle = index * 2.399963;
    return { x: Math.cos(angle) * ring, y, z: Math.sin(angle) * ring };
  });
  const connections = [];
  nodes.forEach((node, index) => {
    for (let next = index + 1; next < nodeCount; next++) {
      const other = nodes[next];
      if (Math.hypot(node.x - other.x, node.y - other.y, node.z - other.z) < .46) {
        connections.push([index, next]);
      }
    }
  });
  const orbitPlanes = [
    { tilt: .38, turn: -.28, size: 1.30, speed: .34, color: '255,117,83' },
    { tilt: 1.10, turn: .77, size: 1.43, speed: -.24, color: '251,183,136' },
    { tilt: -.78, turn: -.85, size: 1.22, speed: .28, color: '243,79,71' }
  ];
  let width = 0, height = 0, radius = 0, animationId = 0;
  let visible = true, paused = motionPreference.matches;
  let previousTime = 0, elapsed = 0;
  let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;

  function rotate(point, aroundY, aroundX) {
    const x = point.x * Math.cos(aroundY) + point.z * Math.sin(aroundY);
    const z = -point.x * Math.sin(aroundY) + point.z * Math.cos(aroundY);
    return { x, y: point.y * Math.cos(aroundX) - z * Math.sin(aroundX), z: point.y * Math.sin(aroundX) + z * Math.cos(aroundX) };
  }
  function project(point) {
    const perspective = 3.7 / (3.7 - point.z);
    return { x: width / 2 + point.x * radius * perspective, y: height / 2 + point.y * radius * perspective, depth: (point.z + 1.5) / 3, scale: perspective };
  }
  function orbitPoint(plane, angle) {
    return project(rotate({ x: Math.cos(angle) * plane.size, y: Math.sin(angle) * plane.size, z: 0 }, plane.turn + tiltX * .4, plane.tilt + tiltY * .4));
  }
  function dot(point, size, color, opacity, glow = 0) {
    context.beginPath(); context.arc(point.x, point.y, size, 0, tau);
    context.fillStyle = `rgba(${color},${opacity})`;
    context.shadowBlur = glow; context.shadowColor = `rgba(${color},.9)`;
    context.fill(); context.shadowBlur = 0;
  }
  function updateToggle() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play canvas animation' : 'Pause canvas animation');
    toggle.querySelector('.toggle-label').textContent = paused ? 'PLAY' : 'PAUSE';
    toggle.querySelector('.toggle-glyph').textContent = paused ? '▷' : 'Ⅱ';
    panel.classList.toggle('animation-paused', paused);
  }
  function draw(time) {
    animationId = 0;
    if (!width || !height) return;
    const running = !paused && visible && !document.hidden;
    if (running && previousTime) elapsed += Math.min((time - previousTime) / 1000, .05);
    previousTime = running ? time : 0;
    if (!paused) { tiltX += (pointerX - tiltX) * .035; tiltY += (pointerY - tiltY) * .035; }
    context.clearRect(0, 0, width, height);

    // A subtle star field and atmosphere give the globe a sense of space.
    for (let star = 0; star < 48; star++) {
      const x = ((star * 137.508 + 29) % 997) / 997 * width;
      const y = 48 + ((star * 83.231 + 19) % 541) / 541 * (height - 100);
      dot({x,y}, star % 7 === 0 ? 1 : .55, '226,182,165', .12 + .08 * Math.sin(elapsed * .5 + star));
    }
    const atmosphere = context.createRadialGradient(width / 2, height / 2, radius * .15, width / 2, height / 2, radius * 1.6);
    atmosphere.addColorStop(0, 'rgba(241,81,51,.09)');
    atmosphere.addColorStop(.45, 'rgba(206,51,31,.12)');
    atmosphere.addColorStop(.7, 'rgba(225,63,32,.025)');
    atmosphere.addColorStop(1, 'rgba(225,63,32,0)');
    context.fillStyle = atmosphere; context.fillRect(0, 0, width, height);

    const points = nodes.map(node => project(rotate(node, elapsed * .095 + tiltX + .3, -.23 + tiltY)));
    connections.forEach(([start, end], index) => {
      const a = points[start], b = points[end];
      const depth = (a.depth + b.depth) / 2;
      context.strokeStyle = `rgba(244,113,86,${.05 + depth * .25})`;
      context.lineWidth = depth > .65 ? .8 : .5;
      context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
      if (index % 17 === 0) {
        const progress = (elapsed * .18 + index * .173) % 1;
        dot({x: a.x + (b.x - a.x) * progress, y: a.y + (b.y - a.y) * progress}, 1.3, '255,193,145', depth * .7, 7);
      }
    });
    points.forEach((point, index) => {
      const bright = index % 9 === 0;
      dot(point, (bright ? 1.9 : 1) * point.scale, bright ? '255,180,128' : '244,116,88', .12 + point.depth * .7, bright ? 9 : 0);
      if (bright) {
        context.beginPath(); context.arc(point.x, point.y, 4.5 * point.scale, 0, tau);
        context.strokeStyle = `rgba(251,128,88,${point.depth * .3})`; context.lineWidth = .5; context.stroke();
      }
    });
    orbitPlanes.forEach((plane, index) => {
      context.beginPath();
      for (let step = 0; step <= 160; step++) {
        const point = orbitPoint(plane, step / 160 * tau);
        if (!step) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y);
      }
      context.strokeStyle = `rgba(${plane.color},.23)`; context.lineWidth = .7;
      context.stroke();
      const angle = elapsed * plane.speed + index * 2.1;
      // A fading trail follows each particle around its orbital plane.
      for (let trail = 18; trail >= 0; trail--) {
        const point = orbitPoint(plane, angle - trail * .023 * Math.sign(plane.speed));
        dot(point, (trail === 0 ? 3 : 1.4) * point.scale, plane.color, (1 - trail / 19) * .8, trail === 0 ? 15 : 0);
      }
    });
    if (running) animationId = requestAnimationFrame(draw);
  }
  function restart() {
    cancelAnimationFrame(animationId); previousTime = 0;
    draw(performance.now());
  }
  toggle.addEventListener('click', () => { paused = !paused; updateToggle(); restart(); });
  panel.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || paused) return;
    const bounds = panel.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left - width / 2) / width * .6;
    pointerY = (event.clientY - bounds.top - height / 2) / height * .45;
  });
  panel.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  new ResizeObserver(() => {
    const bounds = canvas.getBoundingClientRect(); width = bounds.width; height = bounds.height;
    radius = Math.min(width * .265, height * .29);
    const density = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * density); canvas.height = Math.round(height * density);
    context.setTransform(density, 0, 0, density, 0, 0); restart();
  }).observe(canvas);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; restart(); }).observe(canvas);
  document.addEventListener('visibilitychange', restart);
  motionPreference.addEventListener('change', () => { paused = motionPreference.matches; updateToggle(); restart(); });
  updateToggle();
})();
