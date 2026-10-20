import React from "react";

const particleDots = [
  { x: 44.7, y: 12.9 }, { x: 72.5, y: 92.2 }, { x: 87.8, y: 84.9 },
  { x: 80.8, y: 77.6 }, { x: 90.6, y: 65.4 }, { x: 97.5, y: 55.6 },
  { x: 96.8, y: 94.6 }, { x: 66.9, y: 73.9 }, { x: 50.3, y: 89.8 },
  { x: 85.0, y: 50.7 }, { x: 91.9, y: 34.9 }, { x: 45.4, y: 72.7 },
  { x: 37.1, y: 92.2 }, { x: 32.9, y: 78.8 }, { x: 12.1, y: 71.5 },
  { x: 21.8, y: 87.3 }, { x: 86.4, y: 21.5 }, { x: 75.3, y: 23.9 },
  { x: 69.0, y: 31.2 }, { x: 61.4, y: 20.2 }, { x: 49.6, y: 25.1 },
  { x: 96.1, y: 15.4 }, { x: 37.8, y: 17.8 }, { x: 39.2, y: 59.3 },
  { x: 3.8, y: 52.0 }, { x: 2.4, y: 89.8 }, { x: 14.2, y: 52.0 },
  { x: 24.6, y: 26.3 }, { x: 27.4, y: 9.3 }, { x: 4.4, y: 31.2 },
];

export default function StaticBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-[#05070d] overflow-hidden">
      {/* Ellipse glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "38.9%",
          top: "30.5%",
          width: "22.2%",
          height: "39%",
          background: "rgba(83,234,253,0.2)",
          filter: "blur(300px)",
          borderRadius: "50%",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "49px 49px",
        }}
      />

      {/* Particle dots */}
      {particleDots.map((dot, i) => {
        // Generate pseudo-random delay and duration based on index to avoid hydration mismatch
        const delay = (i * 0.73) % 3;
        const duration = 1.5 + ((i * 0.31) % 2);

        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none animate-twinkle"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: "4px",
              height: "4px",
              background: "rgba(162,244,253,0.7)",
              boxShadow: "0 0 4px rgba(34,211,238,0.9)",
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
