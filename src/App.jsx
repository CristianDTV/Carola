import { useEffect, useMemo, useState } from "react";
// Asegúrate de que la ruta de la imagen sea correcta en tu proyecto real
import foto1 from "./images/foto3.jpg";

// ==========================================
// CONFIGURACIÓN Y CONSTANTES
// ==========================================
const CONFIG = {
  name: "Carolina",
  // Fecha fija de inicio: 30 de Enero de 2026
  startDate: new Date("2026-01-30T00:00:00"), 
  // Fecha meta: 1 de Mayo de 2026
  targetDate: new Date("2026-05-01T00:00:00"),
};

const LOVE_MESSAGES = [
  `Un día menos para verte, ${CONFIG.name}.`,
  `Te extraño, pero ya falta menos ✨`,
  `Cada segundo es un paso hacia tu abrazo.`,
  `Estamos más cerca de nuestro reencuentro 💗`,
  `Si pudiera, adelantaría el reloj para verte.`,
  `Guardo todos mis abrazos para ti.`,
  `Pronto estaremos juntos, mi amor.`,
  `Cuento los días para tenerte cerca.`,
];

// ==========================================
// UTILIDADES & HELPERS
// ==========================================

// Generador de números pseudo-aleatorios (Determinista basado en semilla)
const seededRandom = (seed) => {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

const formatters = {
  pad: (n) => String(n).padStart(2, "0"),
  dateFull: (d) => new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d),
  dateShort: (d) => new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "long", year: "numeric" }).format(d),
};

// ==========================================
// CUSTOM HOOK: Lógica del Tiempo
// ==========================================
function useCountdown(startDate, targetDate) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Actualizamos cada segundo para el reloj, o más rápido si queremos suavidad en la barra
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDuration = targetDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const remaining = Math.max(0, targetDate.getTime() - now.getTime());

  // Cálculo del porcentaje corregido y limitado entre 0 y 1
  const progressRaw = elapsed / totalDuration;
  const progress = Math.min(1, Math.max(0, progressRaw));

  // Desglose de tiempo restante
  const parts = {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / 1000 / 60) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };

  return { now, progress, remaining, parts, isFinished: remaining <= 0 };
}

// ==========================================
// COMPONENTES VISUALES
// ==========================================

const FloatingHearts = () => {
  // Memoizamos para que los corazones no se recalculen en cada render
  const hearts = useMemo(() => {
    const seed = Math.floor(Date.now() / 86400000); // Semilla diaria
    const rng = () => seededRandom(seed + Math.random()); // Pequeña variación
    
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: `${(Math.random() * 5).toFixed(2)}s`,
      duration: `${(6 + Math.random() * 4).toFixed(2)}s`,
      size: `${10 + Math.floor(Math.random() * 20)}px`,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="float-heart absolute bottom-[-50px] text-rose-500/40 animate-float"
          style={{
            left: h.left,
            animationDelay: h.delay,
            animationDuration: h.duration,
            fontSize: h.size,
            opacity: h.opacity,
          }}
        >
          💗
        </span>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

const Hourglass = ({ progress }) => {
  // Lógica visual de la arena
  const sandTopHeight = `${Math.max(0, (1 - progress) * 100)}%`;
  const sandBottomHeight = `${Math.min(100, progress * 100)}%`;
  const isFlowing = progress < 1;

  return (
    <div className="relative w-32 h-60 flex flex-col items-center drop-shadow-2xl mx-auto">
      {/* Estilos inyectados para la animación de la arena */}
      <style>{`
        @keyframes sandStream {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
        .animate-sand-stream {
          background-size: 10px 20px;
          background-image: linear-gradient(to bottom, rgba(251, 113, 133, 0.8) 50%, rgba(244, 63, 94, 0.8) 50%);
          animation: sandStream 0.5s linear infinite;
        }
      `}</style>

      {/* Tapa Superior */}
      <div className="w-28 h-4 bg-rose-900 rounded-t-lg shadow-lg z-20 border-b border-rose-400/30" />

      {/* Contenedor de Vidrio */}
      <div className="relative w-full flex-1 backdrop-blur-sm bg-white/5 border-x border-white/10 rounded-lg overflow-hidden flex flex-col">
        
        {/* Cámara Superior */}
        <div className="flex-1 relative border-b border-white/10 overflow-hidden">
             {/* Arena restante arriba */}
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-rose-400 to-rose-300 transition-all duration-1000 ease-linear rounded-b-xl opacity-90"
              style={{ height: sandTopHeight }} 
            />
        </div>

        {/* Cuello del reloj (Chorro de arena) */}
        <div className="relative h-0 z-10 flex justify-center items-center">
            {isFlowing && (
                <div className="absolute top-0 w-1 h-32 bg-rose-400 animate-sand-stream opacity-90" />
            )}
        </div>

        {/* Cámara Inferior */}
        <div className="flex-1 relative border-t border-white/10 overflow-hidden flex items-end">
            {/* Arena acumulada abajo */}
            <div 
                className="w-full bg-gradient-to-t from-rose-500 to-rose-400 transition-all duration-1000 ease-linear rounded-t-xl opacity-90 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                style={{ height: sandBottomHeight }} 
            />
        </div>

        {/* Brillo del vidrio */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Base Inferior */}
      <div className="w-28 h-4 bg-rose-900 rounded-b-lg shadow-lg z-20 border-t border-rose-400/30" />
    </div>
  );
};

const TimeChip = ({ label, value }) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-md min-w-[70px] md:min-w-[90px]">
    <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">{value}</span>
    <span className="text-[10px] uppercase tracking-widest text-rose-300/80 mt-1">{label}</span>
  </div>
);

const ProgressBar = ({ percent }) => (
  <div className="w-full space-y-2">
    <div className="flex justify-between text-xs font-medium text-rose-200/70 uppercase tracking-wider">
      <span>Inicio</span>
      <span>{percent.toFixed(1)}% Completado</span>
      <span>Meta</span>
    </div>
    <div className="h-4 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
      <div 
        className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-fuchsia-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all duration-1000 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  const { now, progress, parts, isFinished } = useCountdown(CONFIG.startDate, CONFIG.targetDate);

  // Mensaje diario aleatorio (Memoizado para que no cambie al re-renderizar)
  const dailyMessage = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return LOVE_MESSAGES[dayIndex % LOVE_MESSAGES.length];
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0a1a] text-white selection:bg-rose-500/30">
      {/* Fondos Ambientales */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-[#130820] to-slate-950" />
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(244,63,94,0.15),transparent_50%)]" />
      
      <FloatingHearts />

      <main className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-5xl">
          
          {/* SECCIÓN IZQUIERDA: Textos y Contadores */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold tracking-wider uppercase">
                <span className="animate-pulse">●</span> Cuenta Regresiva
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {isFinished ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-400">
                    ¡Es hoy! 🎉
                  </span>
                ) : (
                  <>
                    Faltan <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-400">{parts.days} días</span><br />
                    para verte
                  </>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 font-light max-w-md border-l-2 border-rose-500/50 pl-4">
                "{dailyMessage}"
              </p>
            </div>

            {/* Contadores */}
            <div className="flex flex-wrap gap-4">
              <TimeChip label="Días" value={parts.days} />
              <TimeChip label="Horas" value={formatters.pad(parts.hours)} />
              <TimeChip label="Min" value={formatters.pad(parts.minutes)} />
              <TimeChip label="Seg" value={formatters.pad(parts.seconds)} />
            </div>

            {/* Barra de Progreso y Fechas */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
              <ProgressBar percent={progress * 100} />
              
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="text-left">
                  <p className="text-slate-400 text-xs">Fecha Actual</p>
                  <p className="font-medium text-white">{formatters.dateFull(now)}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Gran Día</p>
                  <p className="font-medium text-rose-300">{formatters.dateShort(CONFIG.targetDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN DERECHA: Visuales (Reloj + Foto) */}
          <div className="flex flex-col items-center gap-8 relative">
            {/* Efecto Glow de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />

            <Hourglass progress={progress} />
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative aspect-[4/3] w-full max-w-xs rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
                <img 
                  src={foto1} 
                  alt="Nosotros" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white font-medium text-sm">Contigo todo es mejor 💗</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}