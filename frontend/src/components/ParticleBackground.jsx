import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticleBackground(){
  const particlesInit = async (main) => { await loadFull(main); }

  return (
    <div className="particle-overlay">
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 120, duration: 0.4 } }
          },
          particles: {
            color: { value: ["#2dd4bf","#60a5fa","#7c3aed"] },
            links: { color: "#60a5fa", distance: 160, enable: true, opacity: 0.25, width: 1 },
            move: { enable: true, speed: 1.1, outModes: { default: "bounce" } },
            number: { density: { enable: true, area: 900 }, value: 80 },
            opacity: { value: 0.6 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } }
          },
          detectRetina: true
        }}
      />
    </div>
  )
}
