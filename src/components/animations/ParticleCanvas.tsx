import React, { useRef, useEffect } from "react";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    const colors = [
      "rgba(0, 142, 150, 0.7)",
      "rgba(66, 167, 213, 0.7)",
      "rgba(19, 122, 136, 0.7)",
    ];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 3, // Was 3 + 1, now 5 + 3 for bigger dots
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: colors[Math.floor(Math.random() * colors.length)] ?? "",
      });
    }

    function animate() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p!.x += p!.speedX;
        p!.y += p!.speedY;

        if (p!.x < 0 || p!.x > canvas.width) p!.speedX *= -1;
        if (p!.y < 0 || p!.y > canvas.height) p!.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p!.x, p!.y, p!.size, 0, Math.PI * 2);
        ctx.fillStyle = p!.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p!.x - p2!.x;
          const dy = p!.y - p2!.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(126, 181, 212, ${0.1 - distance * 0.001})`;
            ctx.lineWidth = 5; // Previously 0.5, now thicker
            ctx.moveTo(p!.x, p!.y);
            ctx.lineTo(p2!.x, p2!.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full max-h-[100vh] w-full max-w-[100vw] sm:max-h-[600px] sm:max-w-[600px]"
    />
  );
}

export default ParticleCanvas;
