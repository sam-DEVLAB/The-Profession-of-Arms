import { useRef, useEffect } from 'react';

/**
 * WorldMapGrid — Interactive canvas featuring the user's exact world map outline image
 * dynamically processed with neon blue/cyan luminescence, spring-based vector grid,
 * mouse repulsion, and click shockwave ripples.
 */
export default function WorldMapGrid({ showMap = true }) {
  const canvasRef = useRef(null);
  const showMapRef = useRef(showMap);

  useEffect(() => {
    showMapRef.current = showMap;
  }, [showMap]);

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
      radius: 175,
    };

    let warpX = 0, warpY = 0;
    let targetWarpX = 0, targetWarpY = 0;
    let warpVx = 0, warpVy = 0;

    const CELL_SIZE = 36;
    let cols = 0, rows = 0, points = [];
    const ripples = [];
    let mapReferenceWidth = 0;
    let mapReferenceHeight = 0;

    // Load and prepare user's exact world map image
    let mapImage = null;
    let mapProcessedCanvas = null;
    let mapLoaded = false;
    let mapOpacity = showMapRef.current ? 1.0 : 0.0;

    const basePath = import.meta.env.BASE_URL || '/';
    const img = new Image();
    img.src = `${basePath.endsWith('/') ? basePath : basePath + '/'}world-map.png`;
    if (img.complete && img.naturalWidth > 0) {
      mapImage = img;
      processMapImage();
      mapLoaded = true;
    } else {
      img.onload = () => {
        mapImage = img;
        processMapImage();
        mapLoaded = true;
      };
    }

    function processMapImage() {
      if (!mapImage) return;
      const offscreen = document.createElement('canvas');
      const octx = offscreen.getContext('2d');
      const natW = mapImage.naturalWidth || mapImage.width;
      const natH = mapImage.naturalHeight || mapImage.height;
      if (!natW || !natH) return;
      offscreen.width = natW;
      offscreen.height = natH;

      octx.drawImage(mapImage, 0, 0);

      try {
        const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Compute line darkness: if pixel is dark/grey on white or transparent
          const brightness = (r + g + b) / 3;
          let opacity = (255 - brightness) / 255;
          if (a < 255) {
            opacity = (a / 255) * ((255 - brightness) / 255 || 1);
          }

          if (opacity > 0.04) {
            // Tint line with electric cyan-blue glow
            data[i] = 110;     // R
            data[i + 1] = 195; // G
            data[i + 2] = 255; // B
            data[i + 3] = Math.min(255, Math.round(opacity * 235));
          } else {
            data[i + 3] = 0;
          }
        }
        octx.putImageData(imgData, 0, 0);
        mapProcessedCanvas = offscreen;
      } catch (e) {
        // Fallback to original image if getImageData is restricted
        mapProcessedCanvas = mapImage;
      }
    }

    function setupGrid() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);
      if (newWidth === 0 || newHeight === 0) return;

      const targetCanvasW = Math.floor(newWidth * dpr);
      const targetCanvasH = Math.floor(newHeight * dpr);

      // Resize canvas bitmap if pixel dimensions changed
      if (canvas.width !== targetCanvasW || canvas.height !== targetCanvasH) {
        canvas.width = targetCanvasW;
        canvas.height = targetCanvasH;
      }

      // Explicitly guarantee context scaling matches DPR at all times
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Avoid reallocating grid points if logical layout dimensions haven't changed
      if (width === newWidth && height === newHeight && points.length > 0) {
        return;
      }

      width = newWidth;
      height = newHeight;
      if (mapReferenceWidth === 0 || mapReferenceWidth !== newWidth) {
        mapReferenceWidth = newWidth;
        mapReferenceHeight = newHeight;
      }

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
      if (
        clientX >= rect.left - 40 &&
        clientX <= rect.right + 40 &&
        clientY >= rect.top - 40 &&
        clientY <= rect.bottom + 40
      ) {
        const localX = clientX - rect.left;
        const localY = clientY - rect.top;
        mouse.targetX = localX;
        mouse.targetY = localY;
        mouse.isHovered = true;
        const normX = (localX - width / 2) / (width / 2);
        const normY = (localY - height / 2) / (height / 2);
        targetWarpX = normX * 12;
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
        maxRadius: 480,
        speed: 14,
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
      if (width === 0 || height === 0) {
        setupGrid();
        if (width === 0 || height === 0) return;
      }
      ctx.clearRect(0, 0, width, height);

      // Smooth warp spring physics
      const warpStiffness = 0.045;
      const warpDamping = 0.72;
      const ax = (targetWarpX - warpX) * warpStiffness;
      const ay = (targetWarpY - warpY) * warpStiffness;
      warpVx = warpVx * warpDamping + ax;
      warpVy = warpVy * warpDamping + ay;
      warpX += warpVx;
      warpY += warpVy;

      // Mouse position smoothing
      const mouseSmooth = 0.12;
      mouse.x += (mouse.targetX - mouse.x) * mouseSmooth;
      mouse.y += (mouse.targetY - mouse.y) * mouseSmooth;

      // Advance shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += ripples[i].speed;
        if (ripples[i].radius > ripples[i].maxRadius) ripples.splice(i, 1);
      }

      const SPRING = 0.048;
      const DAMPING = 0.76;
      const MOUSE_STRENGTH = 54;
      const RIPPLE_STRENGTH = 30;

      // 1. Update Grid Points Physics
      let totalEnergy = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          let fx = (p.baseX - p.x) * SPRING;
          let fy = (p.baseY - p.y) * SPRING;

          // Mouse repulsion
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

          // Ripple forces
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
          totalEnergy += p.energy;
        }
      }

      // 2. Draw Vector Grid Lines connecting spring points
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          const cx = p.x - width / 2;
          const cy = p.y - height / 2;
          const vigDist = Math.sqrt(cx * cx + cy * cy);
          const vigMax = Math.sqrt(width * width + height * height) / 2;
          const vignette = Math.max(0, 1 - vigDist / (vigMax * 0.72));
          const energyGlow = p.energy;
          const baseAlpha = 0.065 * vignette;
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

      // 3. Draw User's Exact World Map Outline Image with Dynamic Glow & Elastic Tilt
      const targetOpacity = showMapRef.current ? 1.0 : 0.0;
      mapOpacity += (targetOpacity - mapOpacity) * 0.08;

      const mapDrawable = mapProcessedCanvas || mapImage;
      if (mapLoaded && mapDrawable && mapOpacity > 0.005) {
        ctx.save();

        // Preserve the natural aspect ratio of the world map image
        const srcW = mapDrawable.width || mapDrawable.naturalWidth || 2;
        const srcH = mapDrawable.height || mapDrawable.naturalHeight || 1;
        const imgAspect = srcW / srcH;

        // Keep the map anchored to its initial hero position while the flip view grows.
        const mapAreaWidth = mapReferenceWidth || width;
        const mapAreaHeight = mapReferenceHeight || height;
        const availW = mapAreaWidth * 0.96;
        const availH = mapAreaHeight * 0.96;
        const canvasAspect = availW / availH;

        let mapW, mapH;
        if (imgAspect > canvasAspect) {
          // Image is wider than canvas area — fit by width
          mapW = availW;
          mapH = availW / imgAspect;
        } else {
          // Image is taller than canvas area — fit by height
          mapH = availH;
          mapW = availH * imgAspect;
        }
        const offsetX = (mapAreaWidth - mapW) / 2;
        const offsetY = (mapAreaHeight - mapH) / 2;

        // Apply interactive elastic warp tilt
        ctx.translate(offsetX, offsetY);

        const avgEnergy = Math.min(totalEnergy / Math.max(rows * cols * 0.15, 1), 1.0);
        const mapAlpha = (0.55 + avgEnergy * 0.45) * mapOpacity;

        ctx.globalAlpha = mapAlpha;
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = (10 + avgEnergy * 16) * mapOpacity;
        ctx.drawImage(mapDrawable, 0, 0, mapW, mapH);

        // Extra crisp stroke pass
        ctx.shadowBlur = 0;
        ctx.globalAlpha = mapAlpha * 0.85;
        ctx.drawImage(mapDrawable, 0, 0, mapW, mapH);

        ctx.restore();
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

  return <canvas ref={canvasRef} className="hero-grid-canvas" aria-hidden="true" />;
}
