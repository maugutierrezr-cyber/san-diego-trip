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

const people = ["Mauricio", "Rosario", "Eric", "Erika", "Adrián"];

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

export default function Page() {
  const [query, setQuery] = useState("");
  const [votes, setVotes] = useState<Record<string, Record<string, boolean>>>(
    {}
  );
  const [finalSelection, setFinalSelection] = useState<Record<string, boolean>>(
    {}
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return places;
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q)
    );
  }, [query]);

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
                      onChange={() =>
                        setFinalSelection((prev) => ({
                          ...prev,
                          [place.name]: !prev[place.name],
                        }))
                      }
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
      </div>
    </main>
  );
}