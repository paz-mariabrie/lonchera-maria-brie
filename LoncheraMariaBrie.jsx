import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
  Sparkles,
  Clock,
  MessageCircle,
  CreditCard,
  Users,
  Plus,
  Minus,
} from "lucide-react";

/* =========================================================
   LONCHERA MARÍA BRIE — Configurador
   ========================================================= */

const PLANES = [
  {
    id: "semanal",
    nombre: "Semanal",
    precio: 530,
    subtitulo: "5 días de lonchera",
    bullets: ["Ideal para probar", "Cambias menú cada semana", "Sin compromiso"],
    highlight: false,
    esHermanos: false,
    periodicidad: "semanal",
  },
  {
    id: "mensual",
    nombre: "Mensual",
    precio: 2000,
    subtitulo: "4 semanas · ahorras envío",
    bullets: [
      "Beneficio en costo de envío",
      "Menú flexible cada semana",
      "El plan favorito de las mamás",
    ],
    highlight: true,
    esHermanos: false,
    periodicidad: "mensual",
  },
  {
    id: "hermanos-s",
    nombre: "Hermanos · Semanal",
    precio: 500,
    precioDetalle: "por niño/semana",
    subtitulo: "Mismo esquema de entrega",
    bullets: ["Para 2 o más niños", "Ahorro por niño", "Menú coordinado o personalizado"],
    highlight: false,
    esHermanos: true,
    periodicidad: "semanal",
  },
  {
    id: "hermanos-m",
    nombre: "Hermanos · Mensual",
    precio: 3700,
    precioDetalle: "por 2 niños/mes",
    subtitulo: "Plan mensual compartido",
    bullets: ["Para 2 niños desde $3,700", "Niño extra: $1,850", "Ahorro máximo"],
    highlight: false,
    esHermanos: true,
    periodicidad: "mensual",
    precioPaqueteBase: 3700, // precio para 2 niños
    precioNinoExtra: 1850, // cada niño adicional
  },
];

const SALADOS = [
  { id: "taquitos", nombre: "Mini Taquitos", desc: "Queso o papa", emoji: "🌮" },
  { id: "pizzas", nombre: "Mini Pizzas", desc: "Masa casera", emoji: "🍕" },
  { id: "arepas", nombre: "Mini Arepas", desc: "Rellenas", emoji: "🫓" },
  { id: "pasta", nombre: "Pasta con Levadura", desc: "Nutritiva", emoji: "🍝" },
  { id: "huevo", nombre: "Bites de Huevo", desc: "Con verduras", emoji: "🥚" },
  { id: "tots", nombre: "Tater Tots", desc: "Brócoli y queso", emoji: "🥦" },
  { id: "deditos", nombre: "Deditos de Queso", desc: "Empanizados en quinoa", emoji: "🧀" },
];

const DULCES = [
  { id: "muffin-datil", nombre: "Muffins de Dátil", desc: "Sin azúcar", emoji: "🧁" },
  { id: "waffles", nombre: "Mini Waffles", desc: "Suavecitos", emoji: "🧇" },
  { id: "pancakes", nombre: "Mini Pancakes", desc: "Esponjosos", emoji: "🥞" },
  { id: "sandwich", nombre: "Sandwich Prensado", desc: "Cacahuate y mermelada", emoji: "🥜" },
  { id: "granola", nombre: "Granola", desc: "Casera", emoji: "🌾" },
  { id: "muffin-moras", nombre: "Muffins de Moras", desc: "Con frutos rojos", emoji: "🫐" },
  { id: "bites", nombre: "Mini Bites", desc: "Energéticos", emoji: "🍪" },
  { id: "donuts", nombre: "Mini Donuts", desc: "Horneadas", emoji: "🍩" },
];

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const HERMANO_VACIO = () => ({
  nombre: "",
  edad: "",
  alergias: "",
  menu: {},
});

/* ============= Componente principal ============= */

export default function LoncheraMariaBrie() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    plan: null,
    nombreNino: "",
    edad: "",
    alergias: "",
    menu: {},
    cantidadHermanos: 2,
    hermanos: [HERMANO_VACIO(), HERMANO_VACIO()],
    menuPersonalizado: false,
    direccion: "",
    fechaInicio: null,
    notas: "",
    cierre: null,
  });

  const plan = PLANES.find((p) => p.id === data.plan);
  const esHermanos = !!plan?.esHermanos;
  const totalSteps = 5;

  const canAdvance = useMemo(() => {
    if (step === 0) return !!data.plan;
    if (step === 1) {
      if (esHermanos) {
        return data.hermanos.every((h) => h.nombre.trim().length > 0);
      }
      return data.nombreNino.trim().length > 0;
    }
    if (step === 2) {
      if (esHermanos && data.menuPersonalizado) {
        return data.hermanos.every((h) => {
          const completos = DIAS.filter(
            (d) => h.menu[d]?.salado && h.menu[d]?.dulce
          ).length;
          return completos >= 3;
        });
      }
      const completos = DIAS.filter(
        (d) => data.menu[d]?.salado && data.menu[d]?.dulce
      ).length;
      return completos >= 3;
    }
    if (step === 3) return data.direccion.trim().length > 0 && !!data.fechaInicio;
    return true;
  }, [step, data, esHermanos]);

  const next = () => canAdvance && setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen w-full" style={styles.root}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
      />

      <div className="relative mx-auto max-w-[1100px] px-5 py-8 md:px-10 md:py-12">
        <Header />
        <ProgressBar step={step} total={totalSteps} />

        <div className="mt-8 md:mt-12">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Step key="plan" id="plan">
                <StepPlan data={data} setData={setData} />
              </Step>
            )}
            {step === 1 && (
              <Step key="nino" id="nino">
                <StepNino data={data} setData={setData} esHermanos={esHermanos} />
              </Step>
            )}
            {step === 2 && (
              <Step key="menu" id="menu">
                <StepMenu data={data} setData={setData} esHermanos={esHermanos} />
              </Step>
            )}
            {step === 3 && (
              <Step key="entrega" id="entrega">
                <StepEntrega data={data} setData={setData} />
              </Step>
            )}
            {step === 4 && (
              <Step key="confirm" id="confirm">
                <StepConfirmacion
                  data={data}
                  setData={setData}
                  onBack={back}
                  esHermanos={esHermanos}
                />
              </Step>
            )}
          </AnimatePresence>
        </div>

        {step < 4 && (
          <NavButtons
            step={step}
            total={totalSteps}
            canAdvance={canAdvance}
            onBack={back}
            onNext={next}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}

/* ============= Header ============= */

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-col">
        <div
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(22px, 3vw, 28px)",
            letterSpacing: "0.32em",
            color: "var(--brand)",
            lineHeight: 1,
          }}
        >
          MARIA BRIE
        </div>
        <div
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: "0.4em",
            color: "var(--brand-soft)",
            marginTop: 4,
          }}
        >
          BAKED GOODS
        </div>
      </div>
      <div
        className="hidden md:flex items-center gap-2 rounded-full border px-4 py-2 text-xs"
        style={{
          borderColor: "var(--line)",
          color: "var(--ink-soft)",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Heart size={12} style={{ color: "var(--warm)" }} />
        Hecho con cariño en CDMX
      </div>
    </header>
  );
}

/* ============= Progress ============= */

function ProgressBar({ step, total }) {
  const labels = ["Plan", "Tu peque", "Menú", "Entrega", "Listo"];
  return (
    <div className="mt-10 md:mt-14">
      <div className="flex items-center justify-between gap-2">
        {labels.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div
                  className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border transition-all duration-500"
                  style={{
                    background: done
                      ? "var(--brand)"
                      : active
                      ? "var(--brand-pale)"
                      : "transparent",
                    borderColor: done || active ? "var(--brand)" : "var(--line)",
                    color: done ? "#fff" : active ? "var(--brand)" : "var(--ink-soft)",
                  }}
                >
                  {done ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : (
                    <span className="text-[13px] font-medium">{i + 1}</span>
                  )}
                </div>
                <span
                  className="text-[10px] md:text-[11px] uppercase tracking-wider text-center"
                  style={{
                    color: active || done ? "var(--ink)" : "var(--ink-soft)",
                    fontWeight: active ? 600 : 400,
                    letterSpacing: "0.15em",
                  }}
                >
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <div
                  className="h-px flex-1 transition-all duration-700 mb-5"
                  style={{
                    background: i < step ? "var(--brand)" : "var(--line)",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function Step({ children, id }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============= PASO 0: Plan ============= */

function StepPlan({ data, setData }) {
  return (
    <section>
      <StepHeading
        eyebrow="Paso 1 · Plan"
        title={
          <>
            Elige el ritmo que
            <br />
            le acomoda a tu familia
          </>
        }
        subtitle="Puedes cambiar de plan en cualquier momento. Sin letras chiquitas."
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {PLANES.map((p, idx) => {
          const selected = data.plan === p.id;
          return (
            <motion.button
              key={p.id}
              onClick={() => setData({ ...data, plan: p.id })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="relative text-left rounded-2xl p-7 md:p-8 transition-all duration-300"
              style={{
                background: selected ? "var(--brand-pale)" : "#FFFFFF",
                border: `1.5px solid ${selected ? "var(--brand)" : "var(--line)"}`,
                boxShadow: selected
                  ? "0 20px 40px -20px rgba(122, 145, 168, 0.45)"
                  : "0 1px 2px rgba(0,0,0,0.02)",
              }}
            >
              {p.highlight && (
                <div
                  className="absolute -top-3 left-7 rounded-full px-3 py-1 text-[10px] uppercase"
                  style={{
                    background: "var(--brand)",
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                  }}
                >
                  Más elegido
                </div>
              )}
              {p.esHermanos && (
                <div
                  className="absolute -top-3 right-7 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] uppercase"
                  style={{
                    background: "var(--warm)",
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                  }}
                >
                  <Users size={10} /> Hermanos
                </div>
              )}
              {selected && (
                <div
                  className="absolute top-5 right-5 flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ background: "var(--brand)", color: "#fff" }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
              <div
                className="mb-2"
                style={{
                  color: "var(--brand)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {p.nombre}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 42,
                    fontWeight: 300,
                    color: "var(--ink)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  ${p.precio.toLocaleString()}
                </span>
                <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  {p.precioDetalle || "MXN"}
                </span>
              </div>
              <div className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                {p.subtitulo}
              </div>
              <div className="my-5 h-px w-full" style={{ background: "var(--line)" }} />
              <ul className="space-y-2.5">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm"
                    style={{ color: "var(--ink)" }}
                  >
                    <Sparkles
                      size={13}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: "var(--brand)" }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ============= PASO 1: Niño(s) ============= */

function StepNino({ data, setData, esHermanos }) {
  if (!esHermanos) return <StepNinoIndividual data={data} setData={setData} />;
  return <StepNinoHermanos data={data} setData={setData} />;
}

function StepNinoIndividual({ data, setData }) {
  return (
    <section>
      <StepHeading
        eyebrow="Paso 2 · Para quién"
        title={
          <>
            Cuéntanos sobre
            <br />
            tu peque
          </>
        }
        subtitle="Personalizamos el menú con su nombre y cuidamos cualquier alergia."
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Nombre del niño o niña" hint="Así nos referiremos a su lonchera">
          <input
            value={data.nombreNino}
            onChange={(e) => setData({ ...data, nombreNino: e.target.value })}
            placeholder="Ej. Mateo"
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
          />
        </Field>

        <Field label="Edad" hint="Opcional, nos ayuda con las porciones">
          <input
            value={data.edad}
            onChange={(e) => setData({ ...data, edad: e.target.value })}
            placeholder="Ej. 7 años"
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
          />
        </Field>

        <div className="md:col-span-2">
          <Field
            label="Alergias o restricciones"
            hint="Trabajamos en una cocina donde se manejan distintos alérgenos. Cuéntanos todo lo que debamos saber."
          >
            <textarea
              value={data.alergias}
              onChange={(e) => setData({ ...data, alergias: e.target.value })}
              placeholder="Ej. Alergia a nueces · Intolerancia a la lactosa"
              rows={3}
              style={{ ...styles.input, resize: "none", fontFamily: "inherit" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </Field>
        </div>
      </div>

      {data.nombreNino.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-xl p-5"
          style={{
            background: "var(--brand-pale)",
            border: "1px dashed var(--brand-soft)",
          }}
        >
          <div
            className="mb-1"
            style={{
              color: "var(--brand)",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
            }}
          >
            Vista previa
          </div>
          <div
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 22,
              fontWeight: 300,
              color: "var(--ink)",
              letterSpacing: "0.04em",
            }}
          >
            La lonchera de {data.nombreNino} 🧺
          </div>
        </motion.div>
      )}
    </section>
  );
}

function StepNinoHermanos({ data, setData }) {
  const setCantidad = (n) => {
    const clamped = Math.max(2, Math.min(6, n));
    const current = data.hermanos;
    const newHermanos = Array.from(
      { length: clamped },
      (_, i) => current[i] || HERMANO_VACIO()
    );
    setData({ ...data, cantidadHermanos: clamped, hermanos: newHermanos });
  };

  const updateHermano = (idx, field, value) => {
    const hermanos = [...data.hermanos];
    hermanos[idx] = { ...hermanos[idx], [field]: value };
    setData({ ...data, hermanos });
  };

  return (
    <section>
      <StepHeading
        eyebrow="Paso 2 · Tus peques"
        title={
          <>
            Cuéntanos de
            <br />
            tus niños
          </>
        }
        subtitle="Elige cuántos hermanos son y llena la info de cada uno."
      />

      {/* Selector cantidad */}
      <div
        className="mt-10 rounded-2xl p-6"
        style={{
          background: "var(--brand-pale)",
          border: "1px solid var(--brand-soft)",
        }}
      >
        <div
          className="mb-4"
          style={{
            color: "var(--brand)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
          }}
        >
          ¿Cuántos hermanos?
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCantidad(data.cantidadHermanos - 1)}
              disabled={data.cantidadHermanos <= 2}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-all"
              style={{
                background: data.cantidadHermanos > 2 ? "var(--brand)" : "var(--line)",
                color: data.cantidadHermanos > 2 ? "#FFFFFF" : "var(--ink-ghost)",
                cursor: data.cantidadHermanos > 2 ? "pointer" : "not-allowed",
              }}
            >
              <Minus size={18} />
            </button>
            <div
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 42,
                fontWeight: 300,
                color: "var(--ink)",
                minWidth: 60,
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              {data.cantidadHermanos}
            </div>
            <button
              onClick={() => setCantidad(data.cantidadHermanos + 1)}
              disabled={data.cantidadHermanos >= 6}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-all"
              style={{
                background: data.cantidadHermanos < 6 ? "var(--brand)" : "var(--line)",
                color: data.cantidadHermanos < 6 ? "#FFFFFF" : "var(--ink-ghost)",
                cursor: data.cantidadHermanos < 6 ? "pointer" : "not-allowed",
              }}
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
              Mínimo 2 · Máximo 6
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
              Si son más, contáctanos directo
            </div>
          </div>
        </div>
      </div>

      {/* Forms por hermano */}
      <div className="mt-8 space-y-5">
        {data.hermanos.map((h, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl p-6"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--line)",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
                style={{
                  background: "var(--brand)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {idx + 1}
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                }}
              >
                Hermano {idx + 1}
                {h.nombre && (
                  <span
                    style={{
                      color: "var(--ink-soft)",
                      marginLeft: 8,
                      letterSpacing: "0.02em",
                      textTransform: "none",
                    }}
                  >
                    · {h.nombre}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre" hint="">
                <input
                  value={h.nombre}
                  onChange={(e) => updateHermano(idx, "nombre", e.target.value)}
                  placeholder="Ej. Mateo"
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                />
              </Field>
              <Field label="Edad" hint="">
                <input
                  value={h.edad}
                  onChange={(e) => updateHermano(idx, "edad", e.target.value)}
                  placeholder="Ej. 5 años"
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Alergias o restricciones" hint="Opcional">
                  <textarea
                    value={h.alergias}
                    onChange={(e) => updateHermano(idx, "alergias", e.target.value)}
                    placeholder="Ej. Alergia a nueces"
                    rows={2}
                    style={{ ...styles.input, resize: "none", fontFamily: "inherit" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                  />
                </Field>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============= PASO 2: Menú ============= */

function StepMenu({ data, setData, esHermanos }) {
  if (!esHermanos) {
    return (
      <section>
        <StepHeading
          eyebrow="Paso 3 · Menú"
          title={<>Arma la semana de {data.nombreNino || "tu peque"}</>}
          subtitle="Para cada día: una opción salada y una dulce. Mínimo 3 días configurados."
        />
        <MenuBuilder
          menu={data.menu}
          setMenu={(menu) => setData({ ...data, menu })}
        />
      </section>
    );
  }
  return <StepMenuHermanos data={data} setData={setData} />;
}

function StepMenuHermanos({ data, setData }) {
  const [hermanoActivo, setHermanoActivo] = useState(0);

  const updateMenuHermano = (idx, menu) => {
    const hermanos = [...data.hermanos];
    hermanos[idx] = { ...hermanos[idx], menu };
    setData({ ...data, hermanos });
  };

  return (
    <section>
      <StepHeading
        eyebrow="Paso 3 · Menú"
        title={<>Arma el menú de la semana</>}
        subtitle="¿Todos los hermanos comen lo mismo o cada uno elige su propio menú?"
      />

      {/* Toggle */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => setData({ ...data, menuPersonalizado: false })}
          className="text-left rounded-2xl p-5 transition-all"
          style={{
            background: !data.menuPersonalizado ? "var(--brand-pale)" : "#FFFFFF",
            border: `1.5px solid ${!data.menuPersonalizado ? "var(--brand)" : "var(--line)"}`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                }}
              >
                Mismo menú
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                Todos los hermanos reciben el mismo menú cada día
              </div>
            </div>
            {!data.menuPersonalizado && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() => setData({ ...data, menuPersonalizado: true })}
          className="text-left rounded-2xl p-5 transition-all"
          style={{
            background: data.menuPersonalizado ? "var(--brand-pale)" : "#FFFFFF",
            border: `1.5px solid ${data.menuPersonalizado ? "var(--brand)" : "var(--line)"}`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                }}
              >
                Personalizado
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                Cada hermano arma su propio menú
              </div>
            </div>
            {data.menuPersonalizado && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0"
                style={{ background: "var(--brand)", color: "#fff" }}
              >
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Tabs de hermanos si es personalizado */}
      {data.menuPersonalizado && (
        <div className="mt-8 flex flex-wrap gap-2">
          {data.hermanos.map((h, idx) => {
            const activo = hermanoActivo === idx;
            const completos = DIAS.filter(
              (d) => h.menu[d]?.salado && h.menu[d]?.dulce
            ).length;
            const listo = completos >= 3;
            return (
              <button
                key={idx}
                onClick={() => setHermanoActivo(idx)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all"
                style={{
                  background: activo ? "var(--brand)" : "transparent",
                  color: activo ? "#FFFFFF" : "var(--ink)",
                  border: `1px solid ${activo ? "var(--brand)" : "var(--line)"}`,
                  fontWeight: activo ? 600 : 400,
                }}
              >
                {h.nombre || `Hermano ${idx + 1}`}
                {listo && (
                  <Check
                    size={13}
                    strokeWidth={3}
                    style={{ color: activo ? "#FFFFFF" : "var(--brand)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Menu builder */}
      <div className="mt-8">
        {data.menuPersonalizado ? (
          <div>
            <div
              className="mb-5"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              Menú de{" "}
              {data.hermanos[hermanoActivo]?.nombre ||
                `Hermano ${hermanoActivo + 1}`}
            </div>
            <MenuBuilder
              key={hermanoActivo}
              menu={data.hermanos[hermanoActivo]?.menu || {}}
              setMenu={(menu) => updateMenuHermano(hermanoActivo, menu)}
            />
          </div>
        ) : (
          <div>
            <div
              className="mb-5"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              Menú compartido
            </div>
            <MenuBuilder
              menu={data.menu}
              setMenu={(menu) => setData({ ...data, menu })}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function MenuBuilder({ menu, setMenu }) {
  const [diaActivo, setDiaActivo] = useState("Lunes");

  const seleccionar = (dia, tipo, id) => {
    const newMenu = { ...menu };
    newMenu[dia] = { ...newMenu[dia], [tipo]: id };
    setMenu(newMenu);
  };

  const diasCompletos = DIAS.filter(
    (d) => menu[d]?.salado && menu[d]?.dulce
  ).length;

  return (
    <div>
      {/* Tabs días */}
      <div className="flex flex-wrap gap-2">
        {DIAS.map((dia) => {
          const activo = diaActivo === dia;
          const completo = menu[dia]?.salado && menu[dia]?.dulce;
          return (
            <button
              key={dia}
              onClick={() => setDiaActivo(dia)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all"
              style={{
                background: activo ? "var(--brand)" : "transparent",
                color: activo ? "#FFFFFF" : "var(--ink)",
                border: `1px solid ${activo ? "var(--brand)" : "var(--line)"}`,
                fontWeight: activo ? 600 : 400,
              }}
            >
              {dia}
              {completo && (
                <Check
                  size={13}
                  strokeWidth={3}
                  style={{ color: activo ? "#FFFFFF" : "var(--brand)" }}
                />
              )}
            </button>
          );
        })}
        <div
          className="ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-xs"
          style={{
            color: "var(--ink-soft)",
            background: "var(--brand-pale)",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--brand)" }}>
            {diasCompletos}/5
          </span>
          días listos
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoriaBlock
          titulo="Opción salada"
          subtitulo="Elige una"
          opciones={SALADOS}
          seleccion={menu[diaActivo]?.salado}
          onSelect={(id) => seleccionar(diaActivo, "salado", id)}
        />
        <CategoriaBlock
          titulo="Opción dulce"
          subtitulo="Elige una"
          opciones={DULCES}
          seleccion={menu[diaActivo]?.dulce}
          onSelect={(id) => seleccionar(diaActivo, "dulce", id)}
        />
      </div>

      <div
        className="mt-10 rounded-2xl p-6"
        style={{
          background: "var(--brand-pale)",
          border: "1px solid var(--line)",
        }}
      >
        <div
          className="mb-4"
          style={{
            color: "var(--brand)",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
          }}
        >
          La semana hasta ahora
        </div>
        <div className="grid grid-cols-5 gap-3">
          {DIAS.map((dia) => {
            const m = menu[dia];
            const salado = SALADOS.find((s) => s.id === m?.salado);
            const dulce = DULCES.find((d) => d.id === m?.dulce);
            return (
              <div
                key={dia}
                className="rounded-xl p-3"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--line)",
                  minHeight: 110,
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-wider mb-2"
                  style={{ color: "var(--brand)", fontWeight: 600 }}
                >
                  {dia.slice(0, 3)}
                </div>
                {salado ? (
                  <div
                    className="text-[11px] leading-tight mb-1"
                    style={{ color: "var(--ink)" }}
                  >
                    <span className="mr-1">{salado.emoji}</span>
                    <span className="hidden md:inline">{salado.nombre}</span>
                  </div>
                ) : (
                  <div className="text-[11px]" style={{ color: "var(--ink-ghost)" }}>
                    —
                  </div>
                )}
                {dulce ? (
                  <div className="text-[11px] leading-tight" style={{ color: "var(--ink)" }}>
                    <span className="mr-1">{dulce.emoji}</span>
                    <span className="hidden md:inline">{dulce.nombre}</span>
                  </div>
                ) : (
                  <div className="text-[11px]" style={{ color: "var(--ink-ghost)" }}>
                    —
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CategoriaBlock({ titulo, subtitulo, opciones, seleccion, onSelect }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h3
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {titulo}
        </h3>
        <span
          className="text-[11px] uppercase tracking-wider"
          style={{ color: "var(--ink-soft)" }}
        >
          {subtitulo}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {opciones.map((o) => {
          const selected = seleccion === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onSelect(o.id)}
              className="relative text-left rounded-xl p-4 transition-all"
              style={{
                background: selected ? "var(--brand)" : "#FFFFFF",
                border: `1.5px solid ${selected ? "var(--brand)" : "var(--line)"}`,
                color: selected ? "#FFFFFF" : "var(--ink)",
                transform: selected ? "translateY(-2px)" : "none",
                boxShadow: selected
                  ? "0 10px 25px -10px rgba(122,145,168,0.5)"
                  : "none",
              }}
            >
              <div className="text-2xl mb-2">{o.emoji}</div>
              <div
                className="text-sm leading-tight"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {o.nombre}
              </div>
              <div
                className="text-[11px] mt-1"
                style={{
                  color: selected ? "rgba(255,255,255,0.85)" : "var(--ink-soft)",
                }}
              >
                {o.desc}
              </div>
              {selected && (
                <div
                  className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: "#fff", color: "var(--brand)" }}
                >
                  <Check size={11} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============= PASO 3: Entrega ============= */

function StepEntrega({ data, setData }) {
  return (
    <section>
      <StepHeading
        eyebrow="Paso 4 · Entrega"
        title={
          <>
            ¿Dónde y cuándo
            <br />
            empezamos?
          </>
        }
        subtitle="Entregamos cada domingo para que tengas todo listo al arrancar la semana. Elige el domingo en que quieres empezar."
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field
            label="Dirección de entrega"
            hint="Calle, número, colonia, CP. Indica también referencias si es edificio."
          >
            <textarea
              value={data.direccion}
              onChange={(e) => setData({ ...data, direccion: e.target.value })}
              placeholder="Ej. Av. Revolución 1234, Col. San Ángel, CDMX 01000"
              rows={2}
              style={{ ...styles.input, resize: "none", fontFamily: "inherit" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label="¿Qué domingo quieres empezar?"
            hint="Solo puedes seleccionar domingos. Tu primera entrega será ese día."
          >
            <SundayCalendar
              selected={data.fechaInicio}
              onSelect={(fecha) => setData({ ...data, fechaInicio: fecha })}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Notas adicionales" hint="Horario preferido, instrucciones al repartidor, etc.">
            <textarea
              value={data.notas}
              onChange={(e) => setData({ ...data, notas: e.target.value })}
              placeholder="Ej. Entregar antes de 9am · Tocar en el departamento 4B"
              rows={3}
              style={{ ...styles.input, resize: "none", fontFamily: "inherit" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </Field>
        </div>
      </div>

      <div
        className="mt-8 rounded-xl p-5 text-sm flex gap-3"
        style={{
          background: "var(--brand-pale)",
          border: "1px solid var(--line)",
          color: "var(--ink-soft)",
        }}
      >
        <Clock size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
        <div>
          <div style={{ color: "var(--ink)", fontWeight: 600, marginBottom: 2 }}>
            Importante
          </div>
          El costo de envío no está incluido y se calcula según tu zona. Te
          confirmamos el total en el siguiente paso.
        </div>
      </div>
    </section>
  );
}

/* ============= Calendario solo domingos ============= */

function SundayCalendar({ selected, onSelect }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(today);
    d.setDate(1);
    return d;
  });

  const monthLabel = viewMonth.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const cells = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSameDate = (a, b) =>
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const selectedDate = selected ? new Date(selected) : null;

  const goPrev = () => {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() - 1);
    const endOfTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    if (endOfTargetMonth < today) return;
    setViewMonth(d);
  };
  const goNext = () => {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() + 1);
    setViewMonth(d);
  };

  const diasSemana = ["D", "L", "M", "M", "J", "V", "S"];

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "#FFFFFF",
        border: "1.5px solid var(--line)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--brand)", background: "var(--brand-pale)" }}
        >
          <ChevronLeft size={16} />
        </button>
        <div
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: 15,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          {monthLabel}
        </div>
        <button
          onClick={goNext}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--brand)", background: "var(--brand-pale)" }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {diasSemana.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] uppercase tracking-wider py-1"
            style={{
              color: i === 0 ? "var(--brand)" : "var(--ink-ghost)",
              fontWeight: i === 0 ? 700 : 500,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((dayNum, idx) => {
          if (dayNum === null) return <div key={`empty-${idx}`} />;
          const cellDate = new Date(year, month, dayNum);
          const dayOfWeek = cellDate.getDay();
          const isSunday = dayOfWeek === 0;
          const isPast = cellDate < today;
          const isSelectable = isSunday && !isPast;
          const isSelected = isSameDate(cellDate, selectedDate);

          return (
            <button
              key={dayNum}
              onClick={() => isSelectable && onSelect(cellDate.toISOString())}
              disabled={!isSelectable}
              className="relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all"
              style={{
                background: isSelected
                  ? "var(--brand)"
                  : isSelectable
                  ? "var(--brand-pale)"
                  : "transparent",
                color: isSelected
                  ? "#FFFFFF"
                  : isSelectable
                  ? "var(--brand)"
                  : "var(--ink-ghost)",
                border: isSelected ? "1.5px solid var(--brand)" : "1.5px solid transparent",
                fontWeight: isSelectable ? 600 : 400,
                cursor: isSelectable ? "pointer" : "default",
                opacity: !isSunday ? 0.45 : 1,
              }}
            >
              {dayNum}
              {isSelectable && !isSelected && (
                <div
                  className="absolute bottom-1 h-1 w-1 rounded-full"
                  style={{ background: "var(--brand)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div
          className="mt-4 rounded-lg p-3 text-center"
          style={{
            background: "var(--brand)",
            color: "#FFFFFF",
          }}
        >
          <div
            className="text-[10px] uppercase mb-0.5"
            style={{ letterSpacing: "0.25em", opacity: 0.8 }}
          >
            Primera entrega
          </div>
          <div
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: "0.05em",
            }}
          >
            {selectedDate.toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============= PASO 4: Confirmación ============= */

function StepConfirmacion({ data, setData, onBack, esHermanos }) {
  const plan = PLANES.find((p) => p.id === data.plan);

  const cantidad = esHermanos ? Number(data.cantidadHermanos) : 1;
  const precioUnitario = plan?.precio || 0;

  // Cálculo del total según el plan
  let precioTotal = 0;
  let desgloseTexto = "";

  if (esHermanos && plan?.id === "hermanos-s") {
    // Semanal: $500 × número de niños (siempre)
    precioTotal = 500 * cantidad;
    desgloseTexto = `$500 × ${cantidad} niños`;
  } else if (esHermanos && plan?.id === "hermanos-m") {
    // Mensual: 2 niños = $3,700 fijo. 3+ niños = $1,850 × cantidad
    if (cantidad <= 2) {
      precioTotal = 3700;
      desgloseTexto = `Paquete base · 2 niños`;
    } else {
      precioTotal = 1850 * cantidad;
      desgloseTexto = `$1,850 × ${cantidad} niños`;
    }
  } else {
    // Plan individual (semanal o mensual)
    precioTotal = precioUnitario;
  }

  const periodicidad = plan?.periodicidad || "";

  const fechaInicioFormateada = data.fechaInicio
    ? new Date(data.fechaInicio).toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const mensajeWhatsApp = useMemo(() => {
    const lines = [`¡Hola! Quiero suscribirme a la *Lonchera María Brie* 🧺`, ``];

    lines.push(`*Plan:* ${plan?.nombre}`);
    if (esHermanos) {
      lines.push(
        `*Precio:* ${desgloseTexto} = *$${precioTotal.toLocaleString()} MXN* (${periodicidad})`
      );
    } else {
      lines.push(`*Precio:* $${precioUnitario.toLocaleString()} MXN (${periodicidad})`);
    }
    lines.push(``);

    if (esHermanos) {
      lines.push(`*Hermanos (${cantidad}):*`);
      data.hermanos.forEach((h, i) => {
        lines.push(
          `${i + 1}. ${h.nombre}${h.edad ? ` (${h.edad})` : ""}${
            h.alergias ? ` — alergias: ${h.alergias}` : ""
          }`
        );
      });
      lines.push(``);

      if (data.menuPersonalizado) {
        lines.push(`*Menú personalizado:*`);
        data.hermanos.forEach((h) => {
          const diasH = DIAS.filter(
            (d) => h.menu[d]?.salado && h.menu[d]?.dulce
          );
          lines.push(``);
          lines.push(`_${h.nombre}:_`);
          diasH.forEach((d) => {
            const s = SALADOS.find((x) => x.id === h.menu[d].salado);
            const du = DULCES.find((x) => x.id === h.menu[d].dulce);
            lines.push(`• ${d}: ${s.nombre} + ${du.nombre}`);
          });
        });
      } else {
        lines.push(`*Menú compartido:*`);
        const diasC = DIAS.filter(
          (d) => data.menu[d]?.salado && data.menu[d]?.dulce
        );
        diasC.forEach((d) => {
          const s = SALADOS.find((x) => x.id === data.menu[d].salado);
          const du = DULCES.find((x) => x.id === data.menu[d].dulce);
          lines.push(`• ${d}: ${s.nombre} + ${du.nombre}`);
        });
      }
    } else {
      lines.push(`*Para:* ${data.nombreNino}${data.edad ? ` (${data.edad})` : ""}`);
      if (data.alergias) lines.push(`*Alergias:* ${data.alergias}`);
      lines.push(``);
      lines.push(`*Menú de la semana:*`);
      const diasC = DIAS.filter(
        (d) => data.menu[d]?.salado && data.menu[d]?.dulce
      );
      diasC.forEach((d) => {
        const s = SALADOS.find((x) => x.id === data.menu[d].salado);
        const du = DULCES.find((x) => x.id === data.menu[d].dulce);
        lines.push(`• ${d}: ${s.nombre} + ${du.nombre}`);
      });
    }

    lines.push(``);
    lines.push(`*Primera entrega:* ${fechaInicioFormateada}`);
    lines.push(`*Dirección:* ${data.direccion}`);
    if (data.notas) lines.push(`*Notas:* ${data.notas}`);

    return lines.join("\n");
  }, [
    data,
    plan,
    esHermanos,
    cantidad,
    precioUnitario,
    precioTotal,
    desgloseTexto,
    periodicidad,
    fechaInicioFormateada,
  ]);

  const telefono = "525619959596";
  const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(
    mensajeWhatsApp
  )}`;

  const nombresHermanos = data.hermanos
    .map((h) => h.nombre)
    .filter(Boolean)
    .join(", ");
  const tituloFinal = esHermanos
    ? `Las loncheras de ${nombresHermanos}`
    : `La lonchera de ${data.nombreNino}`;

  // Estado de envío al webhook
  const [enviandoWebhook, setEnviandoWebhook] = useState(false);
  const [webhookEnviado, setWebhookEnviado] = useState(false);

  const WEBHOOK_URL = "https://hook.us2.make.com/vhphwq2t7h21867ox114x9uhc5gdojz9";

  // Construir el payload plano y útil para Notion
  const construirPayload = () => {
    const fechaPedido = new Date().toISOString();

    const nombreParaTitulo = esHermanos
      ? `Hermanos ${nombresHermanos}`
      : data.nombreNino;

    // Info de niños en formato legible
    const ninosInfo = esHermanos
      ? data.hermanos
          .map((h, i) => {
            const partes = [`${i + 1}. ${h.nombre}`];
            if (h.edad) partes.push(`(${h.edad})`);
            if (h.alergias) partes.push(`— alergias: ${h.alergias}`);
            return partes.join(" ");
          })
          .join("\n")
      : `${data.nombreNino}${data.edad ? ` (${data.edad})` : ""}${
          data.alergias ? ` — alergias: ${data.alergias}` : ""
        }`;

    // Menú en formato legible
    let menuTexto = "";
    if (esHermanos && data.menuPersonalizado) {
      menuTexto = data.hermanos
        .map((h) => {
          const diasH = DIAS.filter(
            (d) => h.menu[d]?.salado && h.menu[d]?.dulce
          );
          const lineas = [`${h.nombre}:`];
          diasH.forEach((d) => {
            const s = SALADOS.find((x) => x.id === h.menu[d].salado);
            const du = DULCES.find((x) => x.id === h.menu[d].dulce);
            lineas.push(`  ${d}: ${s.nombre} + ${du.nombre}`);
          });
          return lineas.join("\n");
        })
        .join("\n\n");
    } else {
      const diasC = DIAS.filter(
        (d) => data.menu[d]?.salado && data.menu[d]?.dulce
      );
      menuTexto = diasC
        .map((d) => {
          const s = SALADOS.find((x) => x.id === data.menu[d].salado);
          const du = DULCES.find((x) => x.id === data.menu[d].dulce);
          return `${d}: ${s.nombre} + ${du.nombre}`;
        })
        .join("\n");
    }

    return {
      // Identificadores
      nombrePedido: nombreParaTitulo,
      fechaPedido: fechaPedido,

      // Plan y precio
      plan: plan?.nombre || "",
      planId: plan?.id || "",
      periodicidad: periodicidad,
      precioTotal: precioTotal,
      desglosePrecio: desgloseTexto || `$${precioTotal} MXN`,

      // Niños
      cantidadNinos: cantidad,
      esHermanos: esHermanos,
      ninosInfo: ninosInfo,
      // Array estructurado por si lo quieres mapear en Notion
      hermanosEstructurado: esHermanos
        ? data.hermanos.map((h) => ({
            nombre: h.nombre,
            edad: h.edad,
            alergias: h.alergias,
          }))
        : [
            {
              nombre: data.nombreNino,
              edad: data.edad,
              alergias: data.alergias,
            },
          ],

      // Menú
      menuTipo: esHermanos
        ? data.menuPersonalizado
          ? "personalizado"
          : "compartido"
        : "individual",
      menu: menuTexto,

      // Entrega
      primeraEntrega: fechaInicioFormateada,
      primeraEntregaISO: data.fechaInicio,
      direccion: data.direccion,
      notas: data.notas || "",

      // Estado inicial
      estado: "Nuevo",
      metodoCierre: "", // se llena al dar clic en WhatsApp o Pagar
    };
  };

  const enviarAWebhook = async (metodoCierre) => {
    if (webhookEnviado) return true; // ya se envió, no duplicar
    setEnviandoWebhook(true);
    try {
      const payload = {
        ...construirPayload(),
        metodoCierre: metodoCierre,
      };
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors", // Make acepta webhook sin CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setWebhookEnviado(true);
      return true;
    } catch (err) {
      console.error("Error enviando al webhook:", err);
      return false;
    } finally {
      setEnviandoWebhook(false);
    }
  };

  const handleWhatsApp = async (e) => {
    e.preventDefault();
    setData({ ...data, cierre: "whatsapp" });
    await enviarAWebhook("whatsapp");
    // Abrir WhatsApp después de guardar en Notion
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handlePago = async () => {
    setData({ ...data, cierre: "pago" });
    await enviarAWebhook("pago");
  };

  return (
    <section>
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          <Check size={28} strokeWidth={2.5} />
        </motion.div>
        <div
          className="mb-3"
          style={{
            color: "var(--brand)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
          }}
        >
          Paso 5 · Todo listo
        </div>
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 300,
            color: "var(--ink)",
            letterSpacing: "0.05em",
            lineHeight: 1.2,
          }}
        >
          {tituloFinal}
          <br />
          {esHermanos ? "están" : "está"} casi en el horno
        </h2>
        <p
          className="mt-4 max-w-md mx-auto"
          style={{ color: "var(--ink-soft)", fontSize: 15 }}
        >
          Revisa los detalles y elige cómo cerrar. Te confirmamos la primera
          entrega en menos de 24 horas.
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid var(--line)",
        }}
      >
        <div
          className="p-6 md:p-8"
          style={{
            background: "var(--brand-pale)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div
                className="mb-1"
                style={{
                  color: "var(--brand)",
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                }}
              >
                Plan seleccionado
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: "0.06em",
                }}
              >
                {plan?.nombre}
              </div>
              {esHermanos && (
                <div
                  className="mt-1 text-sm"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {desgloseTexto}
                </div>
              )}
            </div>
            <div className="text-right">
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 30,
                  fontWeight: 300,
                  color: "var(--ink)",
                }}
              >
                ${precioTotal.toLocaleString()}
              </div>
              <div className="text-[11px]" style={{ color: "var(--ink-soft)" }}>
                MXN · {periodicidad} · envío no incluido
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-5">
          {esHermanos ? (
            <SummaryRow
              label={`Hermanos (${cantidad})`}
              value={
                <div className="space-y-1">
                  {data.hermanos.map((h, i) => (
                    <div key={i}>
                      {h.nombre}
                      {h.edad && (
                        <span style={{ color: "var(--ink-soft)" }}>
                          {" "}
                          · {h.edad}
                        </span>
                      )}
                      {h.alergias && (
                        <div
                          className="text-xs italic"
                          style={{ color: "var(--ink-soft)" }}
                        >
                          Alergias: {h.alergias}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              }
            />
          ) : (
            <>
              <SummaryRow
                label="Para"
                value={`${data.nombreNino}${data.edad ? ` · ${data.edad}` : ""}`}
              />
              {data.alergias && <SummaryRow label="Alergias" value={data.alergias} />}
            </>
          )}
          <SummaryRow label="Primera entrega" value={fechaInicioFormateada} />
          <SummaryRow label="Dirección" value={data.direccion} />
          {data.notas && <SummaryRow label="Notas" value={data.notas} />}

          <div className="h-px w-full my-2" style={{ background: "var(--line)" }} />

          {esHermanos && data.menuPersonalizado ? (
            <div>
              <div
                className="mb-3"
                style={{
                  color: "var(--brand)",
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                }}
              >
                Menú personalizado
              </div>
              <div className="space-y-5">
                {data.hermanos.map((h, i) => {
                  const diasH = DIAS.filter(
                    (d) => h.menu[d]?.salado && h.menu[d]?.dulce
                  );
                  return (
                    <div key={i}>
                      <div
                        className="text-sm mb-2"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          color: "var(--ink)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {h.nombre}
                      </div>
                      <div className="space-y-1">
                        {diasH.map((d) => {
                          const s = SALADOS.find((x) => x.id === h.menu[d].salado);
                          const du = DULCES.find((x) => x.id === h.menu[d].dulce);
                          return (
                            <div
                              key={d}
                              className="flex items-center justify-between gap-4 text-sm py-0.5"
                            >
                              <span
                                style={{
                                  fontFamily: "Montserrat, sans-serif",
                                  fontSize: 12,
                                  fontWeight: 500,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  color: "var(--ink)",
                                  minWidth: 90,
                                }}
                              >
                                {d}
                              </span>
                              <span
                                className="flex-1 text-right"
                                style={{ color: "var(--ink-soft)" }}
                              >
                                {s.emoji} {s.nombre}{" "}
                                <span style={{ color: "var(--ink-ghost)" }}>·</span>{" "}
                                {du.emoji} {du.nombre}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div
                className="mb-3"
                style={{
                  color: "var(--brand)",
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                }}
              >
                Menú {esHermanos ? "compartido " : ""}(
                {
                  DIAS.filter(
                    (d) => data.menu[d]?.salado && data.menu[d]?.dulce
                  ).length
                }{" "}
                días)
              </div>
              <div className="space-y-2">
                {DIAS.filter(
                  (d) => data.menu[d]?.salado && data.menu[d]?.dulce
                ).map((d) => {
                  const s = SALADOS.find((x) => x.id === data.menu[d].salado);
                  const du = DULCES.find((x) => x.id === data.menu[d].dulce);
                  return (
                    <div
                      key={d}
                      className="flex items-center justify-between gap-4 text-sm py-1"
                    >
                      <span
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: 13,
                          fontWeight: 500,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--ink)",
                          minWidth: 90,
                        }}
                      >
                        {d}
                      </span>
                      <span
                        className="flex-1 text-right"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {s.emoji} {s.nombre}{" "}
                        <span style={{ color: "var(--ink-ghost)" }}>·</span>{" "}
                        {du.emoji} {du.nombre}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div
          className="mb-4 text-center"
          style={{
            color: "var(--brand)",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
          }}
        >
          ¿Cómo prefieres cerrar?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={whatsappUrl}
            onClick={handleWhatsApp}
            className="group flex items-center justify-between gap-4 rounded-2xl p-6 transition-all"
            style={{
              background: "#25D366",
              color: "#fff",
              boxShadow: "0 10px 30px -10px rgba(37, 211, 102, 0.5)",
              opacity: enviandoWebhook ? 0.7 : 1,
              pointerEvents: enviandoWebhook ? "none" : "auto",
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle size={18} />
                <span
                  className="text-[11px] uppercase"
                  style={{ fontWeight: 600, letterSpacing: "0.22em" }}
                >
                  {webhookEnviado ? "Guardado ✓" : "Recomendado"}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 20,
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                }}
              >
                {enviandoWebhook
                  ? "Guardando..."
                  : "Confirmar por WhatsApp"}
              </div>
              <div className="text-sm mt-1" style={{ opacity: 0.9 }}>
                Hablas directo con María. Pago al confirmar.
              </div>
            </div>
            <ChevronRight
              size={24}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>

          <button
            onClick={handlePago}
            disabled={enviandoWebhook}
            className="group flex items-center justify-between gap-4 rounded-2xl p-6 transition-all text-left"
            style={{
              background: "var(--brand)",
              color: "#FFFFFF",
              opacity: enviandoWebhook ? 0.7 : 1,
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={18} />
                <span
                  className="text-[11px] uppercase"
                  style={{
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    opacity: 0.8,
                  }}
                >
                  Rápido
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 20,
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                }}
              >
                Pagar ahora
              </div>
              <div className="text-sm mt-1" style={{ opacity: 0.85 }}>
                Tarjeta o transferencia. Listo en 2 min.
              </div>
            </div>
            <ChevronRight
              size={24}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        <button
          onClick={onBack}
          className="mt-6 mx-auto flex items-center gap-1 text-sm"
          style={{ color: "var(--ink-soft)" }}
        >
          <ChevronLeft size={14} />
          Quiero ajustar algo
        </button>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div
        className="flex-shrink-0"
        style={{
          color: "var(--brand)",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          minWidth: 120,
          paddingTop: 2,
        }}
      >
        {label}
      </div>
      <div className="text-sm text-right" style={{ color: "var(--ink)" }}>
        {value}
      </div>
    </div>
  );
}

function StepHeading({ eyebrow, title, subtitle }) {
  return (
    <div>
      <div
        className="mb-4"
        style={{
          color: "var(--brand)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "clamp(30px, 5vw, 48px)",
          fontWeight: 300,
          color: "var(--ink)",
          letterSpacing: "0.04em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 max-w-xl"
          style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.6 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div
        className="mb-2"
        style={{
          color: "var(--brand)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {label}
      </div>
      {children}
      {hint && (
        <div className="text-xs mt-1.5" style={{ color: "var(--ink-soft)" }}>
          {hint}
        </div>
      )}
    </label>
  );
}

function NavButtons({ step, total, canAdvance, onBack, onNext }) {
  return (
    <div className="mt-12 flex items-center justify-between">
      {step > 0 ? (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm py-3 px-4 rounded-full transition-colors"
          style={{ color: "var(--ink-soft)" }}
        >
          <ChevronLeft size={16} />
          Atrás
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        disabled={!canAdvance}
        className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm transition-all"
        style={{
          background: canAdvance ? "var(--brand)" : "var(--line)",
          color: canAdvance ? "#FFFFFF" : "var(--ink-ghost)",
          cursor: canAdvance ? "pointer" : "not-allowed",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          boxShadow: canAdvance
            ? "0 10px 25px -10px rgba(122, 145, 168, 0.5)"
            : "none",
        }}
      >
        Continuar
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer
      className="mt-16 pt-8 text-center text-xs"
      style={{
        color: "var(--ink-ghost)",
        borderTop: "1px solid var(--line)",
      }}
    >
      maria-brie.mx · +52 56 1995 9596 · paz@maria-brie.com
    </footer>
  );
}

const styles = {
  root: {
    background: "var(--bg)",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "var(--ink)",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    background: "#FFFFFF",
    border: "1.5px solid var(--line)",
    borderRadius: 10,
    fontSize: 15,
    color: "var(--ink)",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
};

if (typeof document !== "undefined" && !document.getElementById("mb-vars")) {
  const s = document.createElement("style");
  s.id = "mb-vars";
  s.innerHTML = `:root {
    --bg: #FAFBFC;
    --brand: #7A91A8;
    --brand-soft: #A8B8C8;
    --brand-pale: #EDF1F5;
    --warm: #D4A574;
    --ink: #2C3844;
    --ink-soft: #6B7A8A;
    --ink-ghost: #B5BFC9;
    --line: #E4E9EE;
  }
  body { background: var(--bg); }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; }
  *::selection { background: var(--brand); color: #FFFFFF; }`;
  document.head.appendChild(s);
}
