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

export default function Page() {
  const [query, setQuery] = useState("");
  const [votes, setVotes] = useState<Record<string, Record<string, boolean>>>(
    {}
  );
  const [finalSelection, setFinalSelection] = useState<Record<string, boolean>>(
    {}
  );
  const [section, setSection] = useState<"atracciones" | "compras">("atracciones");
const [shoppingQuery, setShoppingQuery] = useState("");
const [shoppingFilter, setShoppingFilter] = useState<
  "all" | "nearby" | "cheap" | "recommended"
>("recommended");
const [shoppingState, setShoppingState] = useState<ShoppingState>({});

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
  const toggleVote = async (placeName: string, person: string) => {
    const newValue = !(votes[placeName] || {})[person];

  setVotes((prev) => ({
    ...prev,
    [placeName]: {
      ...(prev[placeName] || {}),
      [person]: newValue,
    },
  }));

  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        place: placeName,
        person,
        vote: newValue,
        final: !!finalSelection[placeName],
      }),
    });
  } catch (error) {
    console.error("Error guardando voto:", error);
  }
};

  const voteCount = (placeName: string) =>
    Object.values(votes[placeName] || {}).filter(Boolean).length;

  const finalList = places.filter((place) => finalSelection[place.name]);

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
            <div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 24,
    marginBottom: 18,
    flexWrap: "wrap",
  }}
>
  {["atracciones", "compras"].map((item) => {
    const active = section === item;
    return (
      <button
        key={item}
        type="button"
        onClick={() => setSection(item as "atracciones" | "compras")}
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
        {item === "atracciones" ? "Atracciones" : "Compras"}
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

          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 16,
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por lugar, categoría o descripción..."
              style={{
                height: 48,
                borderRadius: 16,
                border: "1px solid #dbe3ee",
                padding: "0 16px",
                fontSize: 15,
                outline: "none",
                background: "#f8fafc",
              }}
            />

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                padding: 16,
                background: "#fff",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 10,
                }}
              >
                Participantes con voto
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {people.map((person) => (
                  <span
                    key={person}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      fontSize: 13,
                      color: "#334155",
                      fontWeight: 600,
                    }}
                  >
                    {person}
                  </span>
                ))}
              </div>
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

    setFinalSelection((prev) => ({
      ...prev,
      [place.name]: newFinal,
    }));

    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          place: place.name,
          person: "SELECCION_FINAL",
          vote: false,
          final: newFinal,
        }),
      });
    } catch (error) {
      console.error("Error guardando selección final:", error);
    }
  }}
/>
                    Final
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

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    {people.map((person) => (
                      <label
                        key={`${place.name}-${person}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: 14,
                          padding: "10px 12px",
                          fontSize: 14,
                          color: "#334155",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!(votes[place.name] || {})[person]}
                          onChange={() => toggleVote(place.name, person)}
                        />
                        {person}
                      </label>
                    ))}
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

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 18,
                  }}
                >
                  <a
                    href={place.maps}
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
                    }}
                  >
                    Ver en Maps
                  </a>

                  <a
                    href={place.site}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 16px",
                      borderRadius: 16,
                      background: "#fff",
                      color: "#0f172a",
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      border: "1px solid #dbe3ee",
                    }}
                  >
                    Más info
                  </a>
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

                        {/* Botones de interacción */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => toggleShopping("interested")}
                            style={{
                              flex: 1,
                              minWidth: 90,
                              padding: "10px 8px",
                              borderRadius: 14,
                              border: state.interested ? "2px solid #f97316" : "1px solid #e2e8f0",
                              background: state.interested ? "#fff7ed" : "#f8fafc",
                              color: state.interested ? "#f97316" : "#64748b",
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ❤️ Me interesa
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleShopping("wantToGo")}
                            style={{
                              flex: 1,
                              minWidth: 90,
                              padding: "10px 8px",
                              borderRadius: 14,
                              border: state.wantToGo ? "2px solid #6366f1" : "1px solid #e2e8f0",
                              background: state.wantToGo ? "#eef2ff" : "#f8fafc",
                              color: state.wantToGo ? "#6366f1" : "#64748b",
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            🛍 Quiero ir
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleShopping("visited")}
                            style={{
                              flex: 1,
                              minWidth: 90,
                              padding: "10px 8px",
                              borderRadius: 14,
                              border: state.visited ? "2px solid #22c55e" : "1px solid #e2e8f0",
                              background: state.visited ? "#f0fdf4" : "#f8fafc",
                              color: state.visited ? "#22c55e" : "#64748b",
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✅ Visitado
                          </button>
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
    </main>
  );
}