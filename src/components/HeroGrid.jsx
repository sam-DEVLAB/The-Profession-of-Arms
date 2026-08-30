import { useRef, useEffect } from 'react';

/**
 * HeroGrid — Subtle interactive vector grid canvas behind the hero section.
 * Features:
 * - Wireframe grid with radial vignette falloff
 * - Dynamic elastic warp & illumination on mouse hover
 * - Click shockwave ripples
 */
export default function HeroGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false,
      radius: 165,
    };

    let warpX = 0, warpY = 0;
    let targetWarpX = 0, targetWarpY = 0;
    let warpVx = 0, warpVy = 0;

    const CELL_SIZE = 40;
    let cols = 0, rows = 0, points = [];
    const ripples = [];

    function setupGrid() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);
      if (newWidth === 0 || newHeight === 0) return;

      const targetCanvasW = Math.floor(newWidth * dpr);
      const targetCanvasH = Math.floor(newHeight * dpr);

      if (canvas.width !== targetCanvasW || canvas.height !== targetCanvasH) {
        canvas.width = targetCanvasW;
        canvas.height = targetCanvasH;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (width === newWidth && height === newHeight && points.length > 0) {
        return;
      }

      width = newWidth;
      height = newHeight;

      cols = Math.ceil(width / CELL_SIZE) + 2;
      rows = Math.ceil(height / CELL_SIZE) + 2;
      const offsetX = (width - (cols - 1) * CELL_SIZE) / 2;
      const offsetY = (height - (rows - 1) * CELL_SIZE) / 2;

      points = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
          const bx = offsetX + c * CELL_SIZE;
          const by = offsetY + r * CELL_SIZE;
          row.push({ baseX: bx, baseY: by, x: bx, y: by, vx: 0, vy: 0, energy: 0 });
        }
        points.push(row);
      }
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (clientX >= rect.left - 40 && clientX <= rect.right + 40 &&
          clientY >= rect.top - 40 && clientY <= rect.bottom + 40) {
        const localX = clientX - rect.left;
        const localY = clientY - rect.top;
        mouse.targetX = localX;
        mouse.targetY = localY;
        mouse.isHovered = true;
        const normX = (localX - width / 2) / (width / 2);
        const normY = (localY - height / 2) / (height / 2);
        targetWarpX = normX * 10;
        targetWarpY = normY * 8;
      } else {
        mouse.isHovered = false;
        mouse.targetX = -1000;
        mouse.targetY = -1000;
        targetWarpX = 0;
        targetWarpY = 0;
      }
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 420,
        speed: 13,
        strength: 1.0,
      });
    }

    function onMouseLeave() {
      mouse.isHovered = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      targetWarpX = 0;
      targetWarpY = 0;
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      const mouseSmooth = 0.12;
      mouse.x += (mouse.targetX - mouse.x) * mouseSmooth;
      mouse.y += (mouse.targetY - mouse.y) * mouseSmooth;

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += ripples[i].speed;
        if (ripples[i].radius > ripples[i].maxRadius) ripples.splice(i, 1);
      }

      const SPRING = 0.045;
      const DAMPING = 0.76;
      const MOUSE_STRENGTH = 52;
      const RIPPLE_STRENGTH = 28;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          let fx = (p.baseX - p.x) * SPRING;
          let fy = (p.baseY - p.y) * SPRING;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const falloff = 1 - dist / mouse.radius;
            const force = MOUSE_STRENGTH * falloff * falloff;
            fx += (dx / dist) * force * 0.016;
            fy += (dy / dist) * force * 0.016;
            p.energy = Math.max(p.energy, falloff);
          }

          for (const ripple of ripples) {
            const rdx = p.x - ripple.x;
            const rdy = p.y - ripple.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const waveFront = ripple.radius;
            const waveDelta = Math.abs(rdist - waveFront);
            if (waveDelta < 40 && rdist > 0) {
              const rippleFalloff = 1 - waveDelta / 40;
              const rippleForce = RIPPLE_STRENGTH * rippleFalloff * ripple.strength;
              const norm = 1 - Math.min(ripple.radius / ripple.maxRadius, 1);
              fx += (rdx / rdist) * rippleForce * norm * 0.016;
              fy += (rdy / rdist) * rippleForce * norm * 0.016;
            }
          }

          p.vx = (p.vx + fx) * DAMPING;
          p.vy = (p.vy + fy) * DAMPING;
          p.x += p.vx;
          p.y += p.vy;
          p.energy *= 0.94;
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          const cx = p.x - width / 2;
          const cy = p.y - height / 2;
          const vigDist = Math.sqrt(cx * cx + cy * cy);
          const vigMax = Math.sqrt(width * width + height * height) / 2;
          const vignette = Math.max(0, 1 - vigDist / (vigMax * 0.72));
          const energyGlow = p.energy;
          const baseAlpha = 0.07 * vignette;
          const glowAlpha = energyGlow * 0.55 * vignette;
          const alpha = Math.min(baseAlpha + glowAlpha, 0.65);

          const rv = Math.round(74 + energyGlow * 60);
          const gv = Math.round(120 + energyGlow * 80);
          const bv = Math.round(230 + energyGlow * 25);
          const color = `rgba(${rv}, ${gv}, ${bv}, ${alpha})`;

          if (c < cols - 1) {
            const next = points[r][c + 1];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = energyGlow > 0.1 ? 1.2 : 0.7;
            ctx.stroke();
          }
          if (r < rows - 1) {
            const below = points[r + 1][c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(below.x, below.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = energyGlow > 0.1 ? 1.2 : 0.7;
            ctx.stroke();
          }
        }
      }
    }

    setupGrid();
    animate();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    window.addEventListener('resize', setupGrid, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      setupGrid();
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', setupGrid);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-grid-canvas"
      aria-hidden="true"
    />
  );
}
