import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {loadDefaultFonts, FONT_FAMILIES} from "../presets/fonts";

// ─── Brand palette ───────────────────────────────────────────────────────────
const C = {
  crema:     "#F8F3ED",
  pergamino: "#EDE4D4",
  arena:     "#C9A97A",
  oro:       "#B8936A",
  amaranth:  "#6d213c",
  olive:     "#2A2018",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const useFadeSlideUp = (delay = 0, duration = 20) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({fps, frame: f, config: {damping: 14, stiffness: 100}});
  const opacity = interpolate(f, [0, duration * 0.7], [0, 1], {extrapolateRight: "clamp"});
  const translateY = interpolate(progress, [0, 1], [50, 0]);
  return {opacity, transform: `translateY(${translateY}px)`};
};

const useFadeSlideRight = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({fps, frame: f, config: {damping: 13, stiffness: 90}});
  const opacity = interpolate(f, [0, 12], [0, 1], {extrapolateRight: "clamp"});
  const translateX = interpolate(progress, [0, 1], [-70, 0]);
  return {opacity, transform: `translateX(${translateX}px)`};
};

const useScaleIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({fps, frame: f, config: {damping: 10, stiffness: 120}});
  const opacity = interpolate(f, [0, 8], [0, 1], {extrapolateRight: "clamp"});
  const scale = interpolate(progress, [0, 1], [0.4, 1]);
  return {opacity, transform: `scale(${scale})`};
};

// ─── Decorative line ─────────────────────────────────────────────────────────
const GoldenLine: React.FC<{delay?: number; width?: number}> = ({delay = 0, width = 200}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = Math.max(0, frame - delay);
  const progress = spring({fps, frame: f, config: {damping: 20, stiffness: 80}});
  const scaleX = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{
      width,
      height: 3,
      background: `linear-gradient(90deg, ${C.arena}, ${C.oro})`,
      borderRadius: 2,
      transformOrigin: "center",
      transform: `scaleX(${scaleX})`,
      opacity: interpolate(f, [0, 5], [0, 1], {extrapolateRight: "clamp"}),
    }} />
  );
};

// ─── Scene 1: Brand Intro (0 – 120f) ─────────────────────────────────────────
const SceneBrandIntro: React.FC = () => {
  const titleAnim  = useFadeSlideUp(5, 25);
  const lineAnim   = useScaleIn(30);
  const tagAnim    = useFadeSlideUp(45, 20);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${C.amaranth} 0%, ${C.olive} 100%)`,
      justifyContent: "center",
      alignItems: "center",
    }}>
      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: -120, right: -120,
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.oro}22 0%, transparent 70%)`,
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 300, height: 300, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.arena}18 0%, transparent 70%)`,
      }} />

      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 20,
        padding: "0 80px",
      }}>
        {/* Brand name */}
        <div style={{...titleAnim, textAlign: "center"}}>
          <div style={{
            fontSize: 88,
            fontFamily: FONT_FAMILIES.heading,
            fontWeight: 900,
            color: C.crema,
            lineHeight: 1.05,
            letterSpacing: -2,
            textShadow: `0 4px 40px ${C.oro}60`,
          }}>
            REDES{"\n"}CON VALOR
          </div>
        </div>

        {/* Golden line */}
        <div style={{...lineAnim, display: "flex", justifyContent: "center"}}>
          <GoldenLine width={220} />
        </div>

        {/* Tagline */}
        <div style={{...tagAnim, textAlign: "center"}}>
          <div style={{
            fontSize: 28,
            fontFamily: FONT_FAMILIES.body,
            fontWeight: 400,
            color: C.arena,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}>
            Conexiones que transforman
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Hook (120 – 310f) ──────────────────────────────────────────────
const SceneHook: React.FC = () => {
  const line1 = useFadeSlideUp(5, 20);
  const line2 = useFadeSlideUp(25, 20);
  const dot    = useScaleIn(50);

  return (
    <AbsoluteFill style={{
      background: C.pergamino,
      justifyContent: "center",
      alignItems: "center",
      padding: "0 80px",
    }}>
      {/* Texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 50%, ${C.arena}15 0%, transparent 60%)`,
      }} />

      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 24}}>
        {/* Accent dot */}
        <div style={{...dot, width: 14, height: 14, borderRadius: "50%", background: C.amaranth}} />

        <div style={{...line1, textAlign: "center"}}>
          <div style={{
            fontSize: 64,
            fontFamily: FONT_FAMILIES.heading,
            fontWeight: 900,
            color: C.olive,
            lineHeight: 1.1,
          }}>
            Tu red dice mucho
          </div>
        </div>

        <div style={{...line2, textAlign: "center"}}>
          <div style={{
            fontSize: 64,
            fontFamily: FONT_FAMILIES.heading,
            fontWeight: 900,
            color: C.amaranth,
            lineHeight: 1.1,
          }}>
            de quién eres.
          </div>
        </div>

        <GoldenLine delay={55} width={160} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Feature Card ─────────────────────────────────────────────────────────────
interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  accent?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  emoji, title, description, accent = C.amaranth, delay = 0,
}) => {
  const iconAnim  = useScaleIn(delay);
  const titleAnim = useFadeSlideRight(delay + 8);
  const descAnim  = useFadeSlideUp(delay + 18, 15);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 18,
      padding: "48px 60px",
      background: C.crema,
      borderRadius: 32,
      borderLeft: `6px solid ${accent}`,
      boxShadow: `0 12px 48px ${C.olive}18`,
      width: "100%",
    }}>
      {/* Emoji icon */}
      <div style={{...iconAnim, fontSize: 72, lineHeight: 1}}>
        {emoji}
      </div>

      {/* Title */}
      <div style={{...titleAnim, textAlign: "center"}}>
        <div style={{
          fontSize: 46,
          fontFamily: FONT_FAMILIES.heading,
          fontWeight: 800,
          color: C.olive,
          lineHeight: 1.1,
        }}>
          {title}
        </div>
      </div>

      {/* Description */}
      <div style={{...descAnim, textAlign: "center"}}>
        <div style={{
          fontSize: 28,
          fontFamily: FONT_FAMILIES.body,
          fontWeight: 400,
          color: C.oro,
          lineHeight: 1.4,
        }}>
          {description}
        </div>
      </div>
    </div>
  );
};

// ─── Scene 3: Features (310 – 710f) ──────────────────────────────────────────
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();

  const features = [
    {
      emoji: "🔥",
      title: "Conexiones\nAuténticas",
      description: "Personas reales con propósito genuino",
      accent: C.amaranth,
      from: 0,
    },
    {
      emoji: "🌿",
      title: "Crecimiento\nReal",
      description: "Aprende de quienes ya recorrieron el camino",
      accent: C.oro,
      from: 120,
    },
    {
      emoji: "✨",
      title: "Comunidad\nque Sostiene",
      description: "No camines sola. Camina acompañada.",
      accent: C.olive,
      from: 240,
    },
  ];

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${C.pergamino} 0%, ${C.crema} 100%)`,
      padding: "80px 60px",
      justifyContent: "center",
    }}>
      {/* Section label */}
      <Sequence from={0} durationInFrames={400}>
        <div style={{
          position: "absolute", top: 80, left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}>
          <div style={{
            fontSize: 22,
            fontFamily: FONT_FAMILIES.body,
            fontWeight: 600,
            color: C.arena,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"}),
          }}>
            ¿Qué encontrarás?
          </div>
        </div>
      </Sequence>

      <div style={{
        display: "flex", flexDirection: "column",
        gap: 32, marginTop: 60,
      }}>
        {features.map((f) => (
          <Sequence key={f.title} from={f.from} durationInFrames={400 - f.from}>
            <FeatureCard {...f} delay={0} />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (710 – 900f) ───────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bgProgress = spring({fps, frame, config: {damping: 20, stiffness: 60}});
  const titleAnim  = useFadeSlideUp(10, 25);
  const btnAnim    = useScaleIn(40);
  const handleAnim = useFadeSlideUp(65, 20);

  // Pulsing effect on button
  const pulse = Math.sin((frame / 8) * Math.PI) * 0.04 + 1;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${C.amaranth} 0%, ${C.olive} 100%)`,
      justifyContent: "center",
      alignItems: "center",
    }}>
      {/* Glow circles */}
      <div style={{
        position: "absolute",
        top: "20%", left: "50%",
        transform: `translate(-50%, -50%) scale(${interpolate(bgProgress, [0, 1], [0, 1])})`,
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.oro}25 0%, transparent 65%)`,
        opacity: interpolate(frame, [0, 15], [0, 1], {extrapolateRight: "clamp"}),
      }} />

      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 36,
        padding: "0 80px",
      }}>
        {/* Main message */}
        <div style={{...titleAnim, textAlign: "center"}}>
          <div style={{
            fontSize: 58,
            fontFamily: FONT_FAMILIES.heading,
            fontWeight: 900,
            color: C.crema,
            lineHeight: 1.1,
            textShadow: `0 4px 30px ${C.amaranth}80`,
          }}>
            Únete a la comunidad que te impulsa
          </div>
        </div>

        <GoldenLine delay={35} width={180} />

        {/* CTA Button */}
        <div style={{
          ...btnAnim,
          transform: `${btnAnim.transform} scale(${pulse})`,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.arena}, ${C.oro})`,
            padding: "24px 64px",
            borderRadius: 60,
            textAlign: "center",
            boxShadow: `0 8px 40px ${C.oro}50`,
          }}>
            <div style={{
              fontSize: 36,
              fontFamily: FONT_FAMILIES.heading,
              fontWeight: 800,
              color: C.olive,
              letterSpacing: 0.5,
            }}>
              Síguenos ahora 🔥
            </div>
          </div>
        </div>

        {/* Handle */}
        <div style={{...handleAnim, textAlign: "center"}}>
          <div style={{
            fontSize: 28,
            fontFamily: FONT_FAMILIES.body,
            fontWeight: 500,
            color: C.arena,
            letterSpacing: 2,
          }}>
            @redesconvalor
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = frame / durationInFrames;
  return (
    <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `${C.olive}40`}}>
      <div style={{
        height: "100%",
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${C.arena}, ${C.oro})`,
        borderRadius: "0 2px 2px 0",
      }} />
    </div>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────
export const RedesConValor: React.FC = () => {
  loadDefaultFonts();

  return (
    <AbsoluteFill style={{background: C.olive, overflow: "hidden"}}>
      {/* Scene 1: Brand Intro */}
      <Sequence from={0} durationInFrames={130}>
        <SceneBrandIntro />
      </Sequence>

      {/* Scene 2: Hook */}
      <Sequence from={120} durationInFrames={200}>
        <SceneHook />
      </Sequence>

      {/* Scene 3: 3 Features */}
      <Sequence from={310} durationInFrames={410}>
        <SceneFeatures />
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence from={700} durationInFrames={200}>
        <SceneCTA />
      </Sequence>

      {/* Global progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};
