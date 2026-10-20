interface DecorativeDotsProps {
  className?: string;
}

export default function DecorativeDots({ className = "" }: DecorativeDotsProps) {
  const dots = [
    { x: 80, y: 40 },
    { x: 200, y: 80 },
    { x: 350, y: 30 },
    { x: 500, y: 70 },
    { x: 650, y: 45 },
    { x: 800, y: 85 },
    { x: 950, y: 25 },
    { x: 1100, y: 65 },
    { x: 1250, y: 35 },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none opacity-20 ${className}`}>
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan"
          style={{
            left: dot.x,
            top: dot.y,
            width: 4,
            height: 4,
            boxShadow: "0 0 8px 2px rgba(34,211,238,0.9)",
          }}
        />
      ))}
    </div>
  );
}
