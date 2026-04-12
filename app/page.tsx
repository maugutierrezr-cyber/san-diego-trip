"use client";

import { useMemo, useState } from "react";

type Place = {
  name: string;
  category: string;
  image: string;
  fallback?: string;
  description: string;
  effort: string;
  duration: string;
  adult: string;
  child: string;
  address: string;
  maps: string;
  site: string;
};

type ShoppingPlace = {
  name: string;
  category: "outlet" | "mall" | "souvenirs" | "premium" | "discount";
  image: string;
  description: string;
  address: string;
  maps: string;
  distance: number; // minutos aprox desde 1625 Via Madrina
  priceLevel: "barato" | "medio" | "caro";
  priority: "alta" | "media" | "baja";
};

type ShoppingState = Record<
  string,
  {
    interested?: boolean;
    wantToGo?: boolean;
    visited?: boolean;
  }
>;

const places: Place[] = [
  // 🏆 IMPERDIBLES
  {
    name: "San Diego Zoo",
    category: "Imperdible",
    image: "/images/san-diego-zoo.jpg",
    description:
      "Zoológico de clase mundial con hábitats abiertos, gran biodiversidad y teleférico interno. Ideal para recorrer en familia, aunque exige caminata constante.",
    effort: "Alto",
    duration: "4–6 h",
    adult: "$70–80",
    child: "$60–70",
    address: "2920 Zoo Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=San+Diego+Zoo",
    site: "https://zoo.sandiegozoo.org",
  },
  {
    name: "SeaWorld San Diego",
    category: "Imperdible",
    image: "/images/seaworld-san-diego.jpg",
    description:
      "Parque marino con shows de animales, montañas rusas y áreas infantiles. Muy equilibrado entre entretenimiento y educación.",
    effort: "Medio",
    duration: "4–6 h",
    adult: "$80–100",
    child: "$70–90",
    address: "500 Sea World Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=SeaWorld+San+Diego",
    site: "https://seaworld.com/san-diego",
  },
  {
    name: "USS Midway Museum",
    category: "Imperdible",
    image: "/images/uss-midway-museum.jpg",
    description:
      "Portaaviones histórico convertido en museo interactivo. Permite explorar cabinas, cubierta y aviones reales. Muy atractivo para adultos y niños curiosos.",
    effort: "Medio",
    duration: "2–3 h",
    adult: "$30",
    child: "$20",
    address: "910 N Harbor Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=USS+Midway+Museum",
    site: "https://midway.org",
  },
  {
    name: "Balboa Park",
    category: "Imperdible",
    image: "/images/balboa-park.jpg",
    description:
      "Complejo cultural con jardines, arquitectura histórica y múltiples museos. Ideal para paseos tranquilos o visitas parciales.",
    effort: "Bajo",
    duration: "2–5 h",
    adult: "Gratis",
    child: "Gratis",
    address: "1549 El Prado, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Balboa+Park",
    site: "https://balboapark.org",
  },

  // 👨‍👩‍👧‍👦 FAMILIA / NIÑOS
  {
    name: "LEGOLAND California",
    category: "Familia / Niños",
    image: "/images/legoland-california.jpg",
    description:
      "Parque temático diseñado para niños, con atracciones LEGO, shows y áreas acuáticas. Muy recomendado para el niño de 6 años.",
    effort: "Medio",
    duration: "4–6 h",
    adult: "$90–120",
    child: "$90–110",
    address: "1 Legoland Dr, Carlsbad, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=LEGOLAND+California",
    site: "https://legoland.com/california",
  },
  {
    name: "Birch Aquarium",
    category: "Familia / Niños",
    image: "/images/birch-aquarium.jpg",
    description:
      "Acuario pequeño y educativo con enfoque en ciencia marina. Muy manejable y cómodo con bebé.",
    effort: "Bajo",
    duration: "1–2 h",
    adult: "$20–30",
    child: "$15–25",
    address: "2300 Expedition Way, La Jolla, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Birch+Aquarium",
    site: "https://aquarium.ucsd.edu",
  },
  {
    name: "Belmont Park",
    category: "Familia / Niños",
    image: "/images/belmont-park.jpg",
    description:
      "Parque de diversiones frente al mar con ambiente relajado. Ideal para combinar con playa.",
    effort: "Bajo",
    duration: "1–3 h",
    adult: "Gratis",
    child: "Gratis",
    address: "3146 Mission Blvd, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Belmont+Park+San+Diego",
    site: "https://belmontpark.com",
  },

  // 🌊 PLAYAS Y NATURALEZA
  {
    name: "La Jolla Cove",
    category: "Playas y Naturaleza",
    image: "/images/la-jolla-cove.jpg",
    description:
      "Zona costera con acantilados, aguas claras y lobos marinos. Uno de los paisajes más icónicos de San Diego.",
    effort: "Bajo",
    duration: "1–3 h",
    adult: "Gratis",
    child: "Gratis",
    address: "1100 Coast Blvd, La Jolla, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=La+Jolla+Cove",
    site: "https://lajolla.com",
  },
  {
    name: "Coronado Beach",
    category: "Playas y Naturaleza",
    image: "/images/coronado-beach.jpg",
    description:
      "Playa amplia, limpia y elegante frente al Hotel del Coronado. Perfecta para relajarse en familia.",
    effort: "Bajo",
    duration: "2–4 h",
    adult: "Gratis",
    child: "Gratis",
    address: "1500 Orange Ave, Coronado, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Coronado+Beach",
    site: "https://coronado.ca.us",
  },
  {
    name: "Sunset Cliffs",
    category: "Playas y Naturaleza",
    image: "/images/sunset-cliffs.jpg",
    description:
      "Acantilados con vistas espectaculares del océano, especialmente al atardecer. Experiencia corta pero muy impactante.",
    effort: "Bajo",
    duration: "1–2 h",
    adult: "Gratis",
    child: "Gratis",
    address: "680 Ladera St, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Sunset+Cliffs",
    site: "https://sandiego.gov",
  },
  {
    name: "Torrey Pines",
    category: "Playas y Naturaleza",
    image: "/images/torrey-pines.jpg",
    description:
      "Reserva natural con senderos y vistas panorámicas del océano. Ideal para quienes disfrutan caminar en naturaleza.",
    effort: "Medio/Alto",
    duration: "2–4 h",
    adult: "$15 parking",
    child: "-",
    address: "12600 N Torrey Pines Rd, La Jolla, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Torrey+Pines",
    site: "https://torreypines.org",
  },

  // 🏙 EXPERIENCIAS URBANAS
  {
    name: "Old Town San Diego",
    category: "Experiencias Urbanas",
    image: "/images/old-town-san-diego.jpg",
    description:
      "Centro histórico con fuerte influencia mexicana, tiendas, restaurantes y ambiente cultural. Muy auténtico.",
    effort: "Bajo",
    duration: "1–3 h",
    adult: "Gratis",
    child: "Gratis",
    address: "4002 Wallace St, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Old+Town+San+Diego",
    site: "https://oldtownsandiego.org",
  },
  {
    name: "Little Italy",
    category: "Experiencias Urbanas",
    image: "/images/little-italy.jpg",
    description:
      "Zona moderna con restaurantes, cafés y excelente ambiente. Ideal para cenas.",
    effort: "Bajo",
    duration: "2–3 h",
    adult: "Variable",
    child: "Variable",
    address: "India St & W Date St, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Little+Italy+San+Diego",
    site: "https://littleitalysd.com",
  },
  {
    name: "Seaport Village",
    category: "Experiencias Urbanas",
    image: "/images/seaport-village.jpg",
    description:
      "Paseo frente al mar con tiendas, restaurantes y ambiente relajado. Muy agradable para caminar.",
    effort: "Bajo",
    duration: "1–2 h",
    adult: "Gratis",
    child: "Gratis",
    address: "849 W Harbor Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Seaport+Village",
    site: "https://seaportvillage.com",
  },
  {
    name: "Gaslamp Quarter",
    category: "Experiencias Urbanas",
    image: "/images/gaslamp-quarter.jpg",
    description:
      "Zona histórica con restaurantes y vida nocturna. Más orientado a adultos.",
    effort: "Bajo",
    duration: "2–4 h",
    adult: "Gratis",
    child: "-",
    address: "614 5th Ave, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Gaslamp+Quarter",
    site: "https://gaslamp.org",
  },

  // 🚗 ALREDEDORES
  {
    name: "Carlsbad Flower Fields",
    category: "Alrededores",
    image: "/images/carlsbad-flower-fields.jpg",
    description:
      "Campos de flores en temporada, muy coloridos y fotogénicos.",
    effort: "Bajo",
    duration: "1–2 h",
    adult: "$20–30",
    child: "$20–30",
    address: "5704 Paseo Del Norte, Carlsbad, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Carlsbad+Flower+Fields",
    site: "https://theflowerfields.com",
  },
  {
    name: "Laguna Beach",
    category: "Alrededores",
    image: "/images/laguna-beach.jpg",
    description:
      "Playa de alto nivel con calas, arte y paisajes espectaculares. Ideal para paseo premium.",
    effort: "Bajo",
    duration: "Medio día",
    adult: "Gratis",
    child: "Gratis",
    address: "Laguna Beach, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Laguna+Beach",
    site: "https://visitlagunabeach.com",
  },
  {
    name: "Anza-Borrego Desert",
    category: "Alrededores",
    image: "/images/anza-borrego-desert.jpg",
    description:
      "Desierto con esculturas y paisajes únicos. Experiencia diferente, pero más exigente.",
    effort: "Alto",
    duration: "Día completo",
    adult: "Gratis",
    child: "Gratis",
    address: "Borrego Springs, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Anza+Borrego",
    site: "https://parks.ca.gov",
  },
];

const people = ["Mauricio", "Rosario", "Eric", "Erika", "Adrián", "Felipe"];

const getEffortColor = (level: string) => {
  if (level.includes("Bajo")) return "#22c55e";
  if (level.includes("Medio/Alto")) return "#f97316";
  if (level.includes("Medio")) return "#eab308";
  if (level.includes("Alto")) return "#ef4444";
  return "#6b7280";
};

function PlaceImage({ place }: { place: Place }) {
  const [src, setSrc] = useState(place.image);

  return (
    <img
      src={src}
      alt={place.name}
      onError={() => setSrc(place.fallback || "/images/placeholder.jpg")}
      style={{
        width: "100%",
        height: "240px",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

const shoppingPlaces: ShoppingPlace[] = [
  {
    name: "One Paseo",
    category: "mall",
    image: "/images/shopping/one-paseo.jpg",
    description:
      "Muy cerca del hospedaje. Ideal para paseo, tiendas selectas, cafés y compras cómodas sin alejarse.",
    address: "3725 Paseo Pl, San Diego, CA 92130",
    maps: "https://www.google.com/maps/search/?api=1&query=3725+Paseo+Pl+San+Diego+CA+92130",
    distance: 5,
    priceLevel: "medio",
    priority: "alta",
  },
  {
    name: "Westfield UTC",
    category: "mall",
    image: "/images/shopping/westfield-utc.jpg",
    description:
      "La mejor combinación de cercanía, variedad y conveniencia. Muy buena opción base para compras del grupo.",
    address: "4545 La Jolla Village Dr, San Diego, CA 92122",
    maps: "https://www.google.com/maps/search/?api=1&query=4545+La+Jolla+Village+Dr+San+Diego+CA+92122",
    distance: 12,
    priceLevel: "medio",
    priority: "alta",
  },
  {
    name: "Del Mar Highlands Town Center",
    category: "mall",
    image: "/images/shopping/del-mar-highlands.jpg",
    description:
      "Muy conveniente por ubicación. Más útil para compras rápidas, farmacia, básicos y paradas prácticas.",
    address: "12925 El Camino Real, San Diego, CA 92130",
    maps: "https://www.google.com/maps/search/?api=1&query=12925+El+Camino+Real+San+Diego+CA+92130",
    distance: 6,
    priceLevel: "medio",
    priority: "alta",
  },
  {
    name: "Fashion Valley",
    category: "premium",
    image: "/images/shopping/fashion-valley.jpg",
    description:
      "Centro comercial fuerte en marcas premium y experiencia. Más atractivo para ver y comparar que para ahorro.",
    address: "7007 Friars Rd, San Diego, CA 92108",
    maps: "https://www.google.com/maps/search/?api=1&query=7007+Friars+Rd+San+Diego+CA+92108",
    distance: 22,
    priceLevel: "caro",
    priority: "media",
  },
  {
    name: "Nordstrom Rack – Carmel Mountain",
    category: "outlet",
    image: "/images/shopping/nordstrom-rack.jpg",
    description:
      "A solo 8 minutos del hospedaje. Descuentos en ropa, zapatos y accesorios de Nordstrom. El outlet más cercano y práctico para el grupo.",
    address: "11940 Carmel Mountain Rd, San Diego, CA 92128",
    maps: "https://www.google.com/maps/search/?api=1&query=11940+Carmel+Mountain+Rd+San+Diego+CA+92128",
    distance: 8,
    priceLevel: "medio",
    priority: "alta",
  },
  {
    name: "Carlsbad Premium Outlets",
    category: "outlet",
    image: "/images/shopping/carlsbad-premium-outlets.jpg",
    description:
      "Muy buena relación precio para ropa y marcas conocidas. Nike, Gap, Coach, Levi's y más. Vale la pena si quieren compras con ahorro real.",
    address: "5620 Paseo Del Norte, Carlsbad, CA 92008",
    maps: "https://www.google.com/maps/search/?api=1&query=5620+Paseo+Del+Norte+Carlsbad+CA+92008",
    distance: 28,
    priceLevel: "barato",
    priority: "alta",
  },
  {
    name: "Outlets at San Clemente",
    category: "outlet",
    image: "/images/shopping/san-clemente-outlets.jpg",
    description:
      "60+ marcas con vistas al océano Pacífico. Tommy Hilfiger, Calvin Klein, Under Armour, H&M, New Balance y más. Perfecto si van hacia LA o Disneyland.",
    address: "101 W Avenida Vista Hermosa, San Clemente, CA 92672",
    maps: "https://www.google.com/maps/search/?api=1&query=101+W+Avenida+Vista+Hermosa+San+Clemente+CA+92672",
    distance: 45,
    priceLevel: "barato",
    priority: "alta",
  },
  {
    name: "Las Americas Premium Outlets",
    category: "outlet",
    image: "/images/shopping/las-americas-premium-outlets.jpg",
    description:
      "125 tiendas cerca de la frontera con México. BCBG, Kate Spade, Polo Ralph Lauren, Banana Republic, Calvin Klein. Mejor para un día de compras dedicado.",
    address: "4211 Camino De La Plaza, San Diego, CA 92173",
    maps: "https://www.google.com/maps/search/?api=1&query=4211+Camino+De+La+Plaza+San+Diego+CA+92173",
    distance: 40,
    priceLevel: "barato",
    priority: "media",
  },
  {
    name: "Seaport Village",
    category: "souvenirs",
    image: "/images/shopping/seaport-village.jpg",
    description:
      "Bueno para regalos, recuerdos y tiendas locales. Más experiencia turística que compras por ahorro.",
    address: "849 W Harbor Dr, San Diego, CA 92101",
    maps: "https://www.google.com/maps/search/?api=1&query=849+W+Harbor+Dr+San+Diego+CA+92101",
    distance: 28,
    priceLevel: "medio",
    priority: "media",
  },
  {
    name: "Bazaar del Mundo",
    category: "souvenirs",
    image: "/images/shopping/bazaar-del-mundo.jpg",
    description:
      "Muy buena opción para artesanías, decoración y souvenirs con personalidad. Ideal si visitan Old Town.",
    address: "4133 Taylor St, San Diego, CA 92110",
    maps: "https://www.google.com/maps/search/?api=1&query=4133+Taylor+St+San+Diego+CA+92110",
    distance: 24,
    priceLevel: "medio",
    priority: "media",
  },
  {
    name: "Target (Carmel Mountain / UTC según ruta)",
    category: "discount",
    image: "/images/shopping/target.jpg",
    description:
      "Muy útil para compras prácticas, snacks, básicos, ropa casual y artículos más baratos que en Costa Rica.",
    address: "San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Target+near+San+Diego+CA",
    distance: 12,
    priceLevel: "barato",
    priority: "alta",
  },
  {
    name: "Ross Dress for Less",
    category: "discount",
    image: "/images/shopping/ross.jpg",
    description:
      "Excelente relación precio si quieren ropa, accesorios y oportunidades. De las mejores paradas por ahorro.",
    address: "San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Ross+Dress+for+Less+near+San+Diego+CA",
    distance: 15,
    priceLevel: "barato",
    priority: "alta",
  },
  {
    name: "Marshalls",
    category: "discount",
    image: "/images/shopping/marshalls.jpg",
    description:
      "Muy buena opción de descuentos en ropa, hogar y accesorios. Conveniente para compras espontáneas.",
    address: "San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Marshalls+near+San+Diego+CA",
    distance: 15,
    priceLevel: "barato",
    priority: "alta",
  },
];

type Comment = { person: string; text: string; reactions: Record<string, string[]>; timestamp: string; };

export default function Page() {
  const [currentPerson, setCurrentPerson] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [votes, setVotes] = useState<Record<string, Record<string, boolean>>>({});
  const [finalSelection, setFinalSelection] = useState<Record<string, boolean>>({});
  const [section, setSection] = useState<"atracciones" | "compras">("atracciones");
  const [shoppingQuery, setShoppingQuery] = useState("");
  const [shoppingFilter, setShoppingFilter] = useState<"all" | "nearby" | "cheap" | "recommended">("recommended");
  const [shoppingState, setShoppingState] = useState<ShoppingState>({});
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [tentativeDates, setTentativeDates] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const WHATSAPP_GROUP = "https://chat.whatsapp.com/Goi6jhXNz9nH9OkOkPkKQD?mode=gi_t";
  const REACTIONS = ["👍","❤️","😂","😮","🔥"];

  const playSound = (type: "vote" | "submit" | "section") => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      if (type === "vote") { o.frequency.setValueAtTime(660, ctx.currentTime); o.frequency.setValueAtTime(880, ctx.currentTime + 0.1); g.gain.setValueAtTime(0.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); }
      if (type === "submit") { o.frequency.setValueAtTime(523, ctx.currentTime); o.frequency.setValueAtTime(659, ctx.currentTime + 0.1); o.frequency.setValueAtTime(784, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); }
      if (type === "section") { o.frequency.setValueAtTime(440, ctx.currentTime); o.frequency.setValueAtTime(550, ctx.currentTime + 0.08); g.gain.setValueAtTime(0.1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25); }
      o.start(); o.stop(ctx.currentTime + 0.5);
    } catch(e) {}
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCalendar = (placeName: string, date: string) => {
    if (!date) return;
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (dt: Date) => `${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}T100000`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("🌊 " + placeName + " - San Diego Trip")}&dates=${fmt(d)}/${fmt(d)}&details=${encodeURIComponent("Lugar votado por el grupo para el viaje familiar a San Diego")}&location=${encodeURIComponent(placeName + ", San Diego, CA")}`;
    window.open(url, "_blank");
  };

  const addComment = (placeName: string) => {
    const text = (commentDraft[placeName] || "").trim();
    if (!text || !currentPerson) return;
    const newComment: Comment = { person: currentPerson, text, reactions: {}, timestamp: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) };
    setComments(prev => ({ ...prev, [placeName]: [...(prev[placeName] || []), newComment] }));
    setCommentDraft(prev => ({ ...prev, [placeName]: "" }));
    playSound("vote");
  };

  const addReaction = (placeName: string, commentIdx: number, emoji: string) => {
    if (!currentPerson) return;
    setComments(prev => {
      const updated = [...(prev[placeName] || [])];
      const c = { ...updated[commentIdx] };
      const arr = c.reactions[emoji] ? [...c.reactions[emoji]] : [];
      const i = arr.indexOf(currentPerson);
      if (i >= 0) arr.splice(i, 1); else arr.push(currentPerson);
      c.reactions = { ...c.reactions, [emoji]: arr };
      updated[commentIdx] = c;
      return { ...prev, [placeName]: updated };
    });
  };

const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();

  const base = !q
    ? places
    : places.filter(
        (place) =>
          place.name.toLowerCase().includes(q) ||
          place.category.toLowerCase().includes(q) ||
          place.description.toLowerCase().includes(q)
      );

  return [...base].sort((a, b) => {
    const votesA = Object.values(votes[a.name] || {}).filter(Boolean).length;
    const votesB = Object.values(votes[b.name] || {}).filter(Boolean).length;
    return votesB - votesA;
  });
}, [query, votes]);

  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzGD3_66bqe2JILU-72Q9_MJX6UoIIE66jQHoKIoyTi9kAqz1a0ZHwWdhO6uWDF6NMu7w/exec";

  const toggleVote = (placeName: string) => {
    if (!currentPerson) return;
    const newValue = !(votes[placeName] || {})[currentPerson];
    setVotes((prev) => ({
      ...prev,
      [placeName]: { ...(prev[placeName] || {}), [currentPerson]: newValue },
    }));
    playSound("vote");
    if (newValue) {
      showToast(`✅ Voto por: ${placeName}`);
    } else {
      showToast(`↩️ Voto removido: ${placeName}`);
    }
  };

  const submitVotes = async () => {
    if (!currentPerson) return;
    setSubmitting(true);
    try {
      const votedPlaces = places.filter((p) => (votes[p.name] || {})[currentPerson]);
      await Promise.all(
        votedPlaces.map((p) =>
          fetch(SHEETS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              place: p.name,
              person: currentPerson,
              vote: true,
              final: !!finalSelection[p.name],
            }),
          })
        )
      );
      setSubmitted(true);
      playSound("submit");
      showToast(`🎉 ¡Votos de ${currentPerson} enviados con éxito!`);
      setShowSectionModal(true);
    } catch (error) {
      console.error("Error enviando votos:", error);
      showToast("❌ Error al enviar. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const voteCount = (placeName: string) =>
    Object.values(votes[placeName] || {}).filter(Boolean).length;

  const finalList = places.filter((place) => finalSelection[place.name]);

  // ── Pantalla de selección de persona ───────────────────────
  if (!currentPerson) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)", color: "#0f172a", fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>

          {/* Emoji y título */}
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌊</div>
          <div style={{ fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 12, fontWeight: 700 }}>San Diego Family Trip</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 12px", color: "#fff", lineHeight: 1.1 }}>¡Bienvenido a la aventura!</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, marginBottom: 10, lineHeight: 1.6 }}>
            Estamos armando juntos el viaje perfecto.<br/>
            Tu opinión cuenta — cada voto hace la diferencia.
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 36 }}>Seleccioná tu nombre para empezar 👇</p>

          {/* Tarjetas de personas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {people.map((person) => (
              <button
                key={person}
                type="button"
                onClick={() => setCurrentPerson(person)}
                style={{
                  padding: "20px 12px",
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 700,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { const b = e.target as HTMLButtonElement; b.style.background = "rgba(255,255,255,0.22)"; b.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const b = e.target as HTMLButtonElement; b.style.background = "rgba(255,255,255,0.08)"; b.style.transform = "translateY(0)"; }}
              >
                👤 {person}
              </button>
            ))}
          </div>

          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 28 }}>
            Podés cambiar de participante en cualquier momento
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        color: "#0f172a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: "#0f172a", color: "#fff",
          padding: "14px 22px", borderRadius: 16,
          fontSize: 14, fontWeight: 700,
          boxShadow: "0 8px 32px rgba(15,23,42,0.18)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toast}
        </div>
      )}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px 20px 60px",
        }}
      >
        <section
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 24,
            padding: 28,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 10,
                  fontWeight: 700,
                }}
              >
                San Diego Family Trip
              </div>
              <h1
                style={{
                  fontSize: 42,
                  lineHeight: 1.05,
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                Selección visual de atracciones
              </h1>
              <p
                style={{
                  marginTop: 14,
                  marginBottom: 0,
                  fontSize: 18,
                  lineHeight: 1.6,
                  color: "#475569",
                }}
              >
                Revisen las opciones, vean las imágenes, voten por persona y
                marquen la selección final del grupo.
              </p>
            </div>
            {/* Section switcher (top - compact) */}
            <div style={{ display: "flex", gap: 0, marginTop: 24, marginBottom: 18, background: "#f1f5f9", borderRadius: 20, padding: 4, width: "fit-content" }}>
              {([["atracciones", "🗺️ Atracciones"], ["compras", "🛍️ Compras"]] as const).map(([item, label]) => {
                const active = section === item;
                return (
                  <button key={item} type="button" onClick={() => { setSection(item); playSound("section"); }}
                    style={{ padding: "12px 24px", borderRadius: 16, border: "none", background: active ? "#0f172a" : "transparent", color: active ? "#fff" : "#64748b", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: active ? "0 2px 8px rgba(15,23,42,0.18)" : "none" }}>
                    {label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: "16px 18px",
                  minWidth: 170,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800 }}>
                  {Object.values(votes).reduce(
                    (acc, current) =>
                      acc + Object.values(current || {}).filter(Boolean).length,
                    0
                  )}
                </div>
                <div style={{ color: "#64748b", fontSize: 14 }}>
                  votos emitidos
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: "16px 18px",
                  minWidth: 170,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800 }}>
                  {finalList.length}
                </div>
                <div style={{ color: "#64748b", fontSize: 14 }}>
                  selección final
                </div>
              </div>
            </div>
          </div>

          {/* Search + session — stacks on mobile */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Buscar lugar, categoría..."
              style={{ width: "100%", boxSizing: "border-box", height: 48, borderRadius: 16, border: "1px solid #dbe3ee", padding: "0 16px", fontSize: 15, outline: "none", background: "#f8fafc" }}
            />
            {/* Sesión activa — horizontal compact bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "10px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Votando como</span>
                <span style={{ padding: "6px 14px", borderRadius: 999, background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                  👤 {currentPerson}
                </span>
              </div>
              <button
                type="button"
                onClick={() => { setCurrentPerson(null); setSubmitted(false); }}
                style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Cambiar
              </button>
            </div>
          </div>
        </section>

        {finalList.length > 0 && (
          <section
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
              marginBottom: 24,
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 24 }}>
              Selección final del grupo
            </h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {finalList.map((item) => (
                <span
                  key={item.name}
                  style={{
                    background: "#0f172a",
                    color: "#fff",
                    padding: "10px 14px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {section === "atracciones" && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((place) => (
            <article
              key={place.name}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div style={{ position: "relative" }}>
                <PlaceImage place={place} />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "rgba(255,255,255,0.92)",
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {place.category}
                </div>
              </div>

              <div style={{ padding: 20 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 24,
                        lineHeight: 1.15,
                      }}
                    >
                      {place.name}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 12,
                      }}
                    >
                      <span
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          backgroundColor: getEffortColor(place.effort),
                          color: "#ffffff",
                          border: "1px solid transparent",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Cansancio: {place.effort}
                      </span>

                      <span
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Duración: {place.duration}
                      </span>

                      <span
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Votos: {voteCount(place.name)}
                      </span>
                    </div>
                  </div>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      padding: "10px 12px",
                      fontSize: 14,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
<input
  type="checkbox"
  checked={!!finalSelection[place.name]}
  onChange={async () => {
    const newFinal = !finalSelection[place.name];
    setFinalSelection((prev) => ({ ...prev, [place.name]: newFinal }));
    playSound("section");
    showToast(newFinal ? `🏆 ${place.name} confirmado para el grupo` : `↩️ ${place.name} removido de la selección final`);
    try {
      await fetch(SHEETS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ place: place.name, person: "SELECCION_FINAL", vote: false, final: newFinal }) });
    } catch (error) { console.error("Error guardando selección final:", error); }
  }}
/>
                    ✅ Confirmado
                  </label>
                </div>

                <p
                  style={{
                    color: "#475569",
                    lineHeight: 1.7,
                    fontSize: 15,
                    marginTop: 0,
                    marginBottom: 18,
                  }}
                >
                  {place.description}
                </p>

                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 18,
                    background: "#f8fafc",
                    padding: 16,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      marginBottom: 12,
                      color: "#334155",
                    }}
                  >
                    Votos por persona
                  </div>

                  {/* Mi voto */}
                  <button
                    type="button"
                    onClick={() => toggleVote(place.name)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 14,
                      border: (votes[place.name] || {})[currentPerson!] ? "2px solid #0f172a" : "1px solid #e2e8f0",
                      background: (votes[place.name] || {})[currentPerson!] ? "#0f172a" : "#f8fafc",
                      color: (votes[place.name] || {})[currentPerson!] ? "#fff" : "#64748b",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      marginBottom: 12,
                    }}
                  >
                    {(votes[place.name] || {})[currentPerson!] ? "✅ Votaste este lugar" : "＋ Agregar a mis votos"}
                  </button>

                  {/* Quién ha votado */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {people.filter(p => (votes[place.name] || {})[p]).map(p => (
                      <span key={p} style={{ padding: "4px 10px", borderRadius: 999, background: "#f0fdf4", border: "1px solid #86efac", fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                        ✓ {p}
                      </span>
                    ))}
                    {people.filter(p => (votes[place.name] || {})[p]).length === 0 && (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Nadie ha votado este lugar aún</span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 14, color: "#334155" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 10,
                      borderBottom: "1px solid #eef2f7",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ color: "#64748b" }}>Adulto</span>
                    <strong>{place.adult}</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 10,
                      borderBottom: "1px solid #eef2f7",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ color: "#64748b" }}>Niño</span>
                    <strong>{place.child}</strong>
                  </div>
                  <div style={{ color: "#475569", lineHeight: 1.6 }}>
                    📍 {place.address}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                  <a href={place.maps} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", borderRadius: 16, background: "#0f172a", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Ver en Maps</a>
                  <a href={place.site} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", borderRadius: 16, background: "#fff", color: "#0f172a", textDecoration: "none", fontSize: 14, fontWeight: 700, border: "1px solid #dbe3ee" }}>Más info</a>
                </div>

                {/* Fecha tentativa */}
                <div style={{ marginTop: 16, padding: 14, background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>📅 Fecha tentativa</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="date"
                      value={tentativeDates[place.name] || ""}
                      onChange={(e) => setTentativeDates(prev => ({ ...prev, [place.name]: e.target.value }))}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid #dbe3ee", fontSize: 13, background: "#fff", color: "#334155" }}
                    />
                    {tentativeDates[place.name] && (
                      <button type="button" onClick={() => addToCalendar(place.name, tentativeDates[place.name])}
                        style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                        + Agenda
                      </button>
                    )}
                  </div>
                </div>

                {/* Comentarios */}
                <div style={{ marginTop: 12 }}>
                  <button type="button" onClick={() => setOpenComments(prev => ({ ...prev, [place.name]: !prev[place.name] }))}
                    style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
                    💬 {comments[place.name]?.length || 0} comentario{(comments[place.name]?.length || 0) !== 1 ? "s" : ""}
                    <span style={{ fontSize: 11 }}>{openComments[place.name] ? "▲" : "▼"}</span>
                  </button>
                  {openComments[place.name] && (
                    <div style={{ marginTop: 10 }}>
                      {(comments[place.name] || []).map((c, i) => (
                        <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: "10px 12px", marginBottom: 8, border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: "#334155" }}>👤 {c.person}</span>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.timestamp}</span>
                          </div>
                          <p style={{ margin: "0 0 8px", fontSize: 14, color: "#475569", lineHeight: 1.5 }}>{c.text}</p>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {REACTIONS.map(emoji => {
                              const arr = c.reactions[emoji] || [];
                              const active = arr.includes(currentPerson!);
                              return (
                                <button key={emoji} type="button" onClick={() => addReaction(place.name, i, emoji)}
                                  style={{ padding: "3px 8px", borderRadius: 999, border: active ? "1px solid #0f172a" : "1px solid #e2e8f0", background: active ? "#f1f5f9" : "#fff", fontSize: 13, cursor: "pointer", fontWeight: active ? 700 : 400 }}>
                                  {emoji}{arr.length > 0 ? ` ${arr.length}` : ""}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <input value={commentDraft[place.name] || ""} onChange={(e) => setCommentDraft(prev => ({ ...prev, [place.name]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter") addComment(place.name); }}
                          placeholder="Escribí tu comentario..."
                          style={{ flex: 1, padding: "9px 12px", borderRadius: 12, border: "1px solid #dbe3ee", fontSize: 13, outline: "none", background: "#f8fafc" }} />
                        <button type="button" onClick={() => addComment(place.name)}
                          style={{ padding: "9px 16px", borderRadius: 12, border: "none", background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
        )}

        {section === "compras" && (
          <section>
            {/* Filtros */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {(["recommended", "nearby", "cheap", "all"] as const).map((f) => {
                const labels = { recommended: "⭐ Recomendados", nearby: "📍 Más cercanos", cheap: "💰 Más baratos", all: "Ver todos" };
                const active = shoppingFilter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setShoppingFilter(f)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 999,
                      border: active ? "1px solid #0f172a" : "1px solid #dbe3ee",
                      background: active ? "#0f172a" : "#fff",
                      color: active ? "#fff" : "#0f172a",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {labels[f]}
                  </button>
                );
              })}
              <input
                value={shoppingQuery}
                onChange={(e) => setShoppingQuery(e.target.value)}
                placeholder="Buscar tienda..."
                style={{
                  height: 44,
                  borderRadius: 16,
                  border: "1px solid #dbe3ee",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8fafc",
                  minWidth: 200,
                }}
              />
            </div>

            {/* Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {shoppingPlaces
                .filter((sp) => {
                  const q = shoppingQuery.trim().toLowerCase();
                  const matchesQuery = !q || sp.name.toLowerCase().includes(q) || sp.description.toLowerCase().includes(q) || sp.category.toLowerCase().includes(q);
                  const matchesFilter =
                    shoppingFilter === "all" ? true :
                    shoppingFilter === "recommended" ? sp.priority === "alta" :
                    shoppingFilter === "nearby" ? sp.distance <= 15 :
                    shoppingFilter === "cheap" ? sp.priceLevel === "barato" : true;
                  return matchesQuery && matchesFilter;
                })
                .sort((a, b) =>
                  shoppingFilter === "nearby" ? a.distance - b.distance :
                  shoppingFilter === "cheap" ? (a.priceLevel === "barato" ? -1 : 1) :
                  (a.priority === "alta" ? -1 : b.priority === "alta" ? 1 : 0)
                )
                .map((sp) => {
                  const state = shoppingState[sp.name] || {};
                  const toggleShopping = (field: "interested" | "wantToGo" | "visited") => {
                    const newState = { ...(shoppingState[sp.name] || {}), [field]: !shoppingState[sp.name]?.[field] };
                    setShoppingState((prev) => ({ ...prev, [sp.name]: newState }));
                    try {
                      fetch(SHEETS_URL, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({
                          place: sp.name,
                          person: "SHOPPING",
                          vote: false,
                          final: false,
                          shopping_interested: newState.interested || false,
                          shopping_wantToGo: newState.wantToGo || false,
                          shopping_visited: newState.visited || false,
                        }),
                      });
                    } catch (error) {
                      console.error("Error guardando estado de compras:", error);
                    }
                  };
                  const priceColors: Record<string, string> = { barato: "#22c55e", medio: "#eab308", caro: "#ef4444" };
                  const categoryLabels: Record<string, string> = { outlet: "Outlet", mall: "Mall", souvenirs: "Souvenirs", premium: "Premium", discount: "Descuento" };
                  return (
                    <article
                      key={sp.name}
                      style={{
                        background: "#fff",
                        border: state.visited ? "2px solid #22c55e" : "1px solid #e2e8f0",
                        borderRadius: 24,
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
                        opacity: state.visited ? 0.85 : 1,
                      }}
                    >
                      <div style={{ position: "relative", background: "#f1f5f9", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src={sp.image}
                          alt={sp.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                        />
                        <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.92)", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#334155", backdropFilter: "blur(8px)" }}>
                          {categoryLabels[sp.category] || sp.category}
                        </div>
                        {sp.priority === "alta" && (
                          <div style={{ position: "absolute", top: 14, right: 14, background: "#0f172a", color: "#fff", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                            ⭐ Recomendado
                          </div>
                        )}
                      </div>

                      <div style={{ padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{sp.name}</h3>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 10 }}>
                            <span style={{ padding: "4px 10px", borderRadius: 999, background: priceColors[sp.priceLevel], color: "#fff", fontSize: 11, fontWeight: 700 }}>
                              {sp.priceLevel === "barato" ? "💰 Barato" : sp.priceLevel === "medio" ? "💳 Medio" : "💎 Caro"}
                            </span>
                          </div>
                        </div>

                        <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6, marginTop: 0, marginBottom: 14 }}>{sp.description}</p>

                        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                          🚗 {sp.distance} min · 📍 {sp.address}
                        </div>

                        {/* Estado de planificación — flujo progresivo */}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Mi estado</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {([["interested","❤️","Me interesa","#f97316","#fff7ed"],["wantToGo","🛍","Lo visito","#6366f1","#eef2ff"],["visited","✅","Ya fui","#22c55e","#f0fdf4"]] as const).map(([key, emoji, label, color, bg]) => {
                              const active = !!(state as Record<string, boolean>)[key];
                              return (
                                <button key={key} type="button" onClick={() => toggleShopping(key as "interested"|"wantToGo"|"visited")}
                                  style={{ flex: 1, padding: "10px 6px", borderRadius: 14, border: active ? `2px solid ${color}` : "1px solid #e2e8f0", background: active ? bg : "#f8fafc", color: active ? color : "#94a3b8", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                  <span style={{ fontSize: 18 }}>{emoji}</span>
                                  <span>{label}</span>
                                </button>
                              );
                            })}
                          </div>
                          {state.visited && <div style={{ marginTop: 8, padding: "6px 12px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #86efac", fontSize: 12, color: "#16a34a", fontWeight: 700, textAlign: "center" }}>✓ Visitado por {currentPerson}</div>}
                          {state.wantToGo && !state.visited && <div style={{ marginTop: 8, padding: "6px 12px", borderRadius: 10, background: "#eef2ff", border: "1px solid #c7d2fe", fontSize: 12, color: "#6366f1", fontWeight: 700, textAlign: "center" }}>📋 En tu lista de visitas</div>}
                        </div>

                        <a
                          href={sp.maps}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "12px 16px",
                            borderRadius: 16,
                            background: "#0f172a",
                            color: "#fff",
                            textDecoration: "none",
                            fontSize: 14,
                            fontWeight: 700,
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                        >
                          Ver en Maps
                        </a>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        )}
      </div>

      {/* Section transition modal */}
      {showSectionModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 28, padding: "40px 32px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 800 }}>¡Votos registrados!</h2>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
              Tus votos de atracciones ya están guardados.<br/>
              ¿Querés revisar ahora los <strong>lugares de compras</strong>?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setShowSectionModal(false)}
                style={{ flex: 1, padding: "14px", borderRadius: 16, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Seguir en Atracciones
              </button>
              <button type="button" onClick={() => { setSection("compras"); setShowSectionModal(false); playSound("section"); }}
                style={{ flex: 1, padding: "14px", borderRadius: 16, border: "none", background: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                🛍️ Ver Compras
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating buttons */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
        {/* WhatsApp */}
        <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 20px", borderRadius: 20, background: "#25D366", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 20px rgba(37,211,102,0.35)" }}>
          <span style={{ fontSize: 18 }}>💬</span> WhatsApp
        </a>
        {/* Submit */}
        {submitted ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", borderRadius: 20, background: "#f0fdf4", border: "1px solid #86efac", color: "#16a34a", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
            ✅ Votos enviados
          </div>
        ) : (
          <button type="button" onClick={submitVotes}
            disabled={submitting || Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0}
            style={{
              padding: "16px 28px", borderRadius: 20, border: "none",
              background: Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0 ? "#94a3b8" : "#f97316",
              color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0 ? "not-allowed" : "pointer",
              boxShadow: Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0 ? "none" : "0 4px 24px rgba(249,115,22,0.4)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
            {submitting ? "Enviando..." : (
              <>
                <span>📤 Enviar mis votos</span>
                {Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length > 0 && (
                  <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 999, padding: "2px 10px", fontSize: 13 }}>
                    {Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length}
                  </span>
                )}
              </>
            )}
          </button>
        )}
      </div>
      {/* Bottom nav bar - fixed tabs */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 900, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid #e2e8f0", display: "flex", padding: "8px 0 max(8px, env(safe-area-inset-bottom))" }}>
        {([["atracciones","🗺️","Atracciones"],["compras","🛍️","Compras"]] as const).map(([item, emoji, label]) => {
          const active = section === item;
          return (
            <button key={item} type="button" onClick={() => { setSection(item); playSound("section"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0", border: "none", background: "none", cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <span style={{ fontSize: 11, fontWeight: active ? 800 : 500, color: active ? "#0f172a" : "#94a3b8" }}>{label}</span>
              {active && <div style={{ width: 20, height: 3, borderRadius: 999, background: "#0f172a" }} />}
            </button>
          );
        })}
      </div>
      {/* Spacer for bottom nav */}
      <div style={{ height: 70 }} />
    </main>
  );
}