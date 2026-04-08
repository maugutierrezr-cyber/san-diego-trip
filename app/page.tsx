"use client";

import { useMemo, useState } from "react";

type Place = {
  name: string;
  category: string;
  image: string;
  fallback: string;
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
  {
    name: "San Diego Zoo",
    category: "Imperdible",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    description:
      "Zoológico de clase mundial con gran biodiversidad y recorridos amplios. Excelente para adultos y niños, aunque implica bastante caminata.",
    effort: "Alto",
    duration: "4–6 h",
    adult: "$70–80",
    child: "$60–70",
    address: "2920 Zoo Dr, San Diego, CA 92101",
    maps: "https://www.google.com/maps/search/?api=1&query=2920+Zoo+Dr%2C+San+Diego%2C+CA+92101",
    site: "https://zoo.sandiegozoo.org",
  },
  {
    name: "SeaWorld San Diego",
    category: "Imperdible",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    description:
      "Parque marino con shows, atracciones y áreas familiares. Muy completo para un grupo con niño pequeño y adultos.",
    effort: "Medio",
    duration: "4–6 h",
    adult: "$80–100",
    child: "$70–90",
    address: "500 Sea World Dr, San Diego, CA 92109",
    maps: "https://www.google.com/maps/search/?api=1&query=500+Sea+World+Dr%2C+San+Diego%2C+CA+92109",
    site: "https://seaworld.com/san-diego",
  },
  {
    name: "USS Midway Museum",
    category: "Imperdible",
    image:
      "https://images.unsplash.com/photo-1518544866330-95a4f8ad5e79?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Portaaviones histórico convertido en museo interactivo. Muy atractivo para quienes disfrutan historia, aviones y experiencias distintas.",
    effort: "Medio",
    duration: "2–3 h",
    adult: "$30–40",
    child: "$20–30",
    address: "910 N Harbor Dr, San Diego, CA 92101",
    maps: "https://www.google.com/maps/search/?api=1&query=910+N+Harbor+Dr%2C+San+Diego%2C+CA+92101",
    site: "https://www.midway.org",
  },
  {
    name: "Balboa Park",
    category: "Imperdible",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    description:
      "Complejo cultural con jardines, plazas, arquitectura icónica y museos. Perfecto para un día flexible con poco cansancio.",
    effort: "Bajo",
    duration: "2–5 h",
    adult: "Gratis",
    child: "Gratis",
    address: "1549 El Prado, San Diego, CA 92101",
    maps: "https://www.google.com/maps/search/?api=1&query=1549+El+Prado%2C+San+Diego%2C+CA+92101",
    site: "https://balboapark.org",
  },
  {
    name: "Old Town San Diego",
    category: "Cultural",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    description:
      "Centro histórico con fuerte influencia mexicana, tiendas, restaurantes y ambiente tradicional. Muy agradable para caminar sin presión.",
    effort: "Bajo",
    duration: "1–3 h",
    adult: "Gratis",
    child: "Gratis",
    address: "4002 Wallace St, San Diego, CA 92110",
    maps: "https://www.google.com/maps/search/?api=1&query=4002+Wallace+St%2C+San+Diego%2C+CA+92110",
    site: "https://www.parks.ca.gov/?page_id=663",
  },
  {
    name: "La Jolla Cove",
    category: "Playa / Naturaleza",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    description:
      "Acantilados, agua clara y vistas muy bonitas. Ideal para fotos y paseo corto.",
    effort: "Bajo",
    duration: "1–3 h",
    adult: "Gratis",
    child: "Gratis",
    address: "1100 Coast Blvd, La Jolla, CA 92037",
    maps: "https://www.google.com/maps/search/?api=1&query=1100+Coast+Blvd%2C+La+Jolla%2C+CA+92037",
    site: "https://lajolla.com",
  },
  {
    name: "Coronado Beach",
    category: "Playa / Relax",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
    description:
      "Playa amplia, limpia y elegante. Muy cómoda para familia y para relajarse.",
    effort: "Bajo",
    duration: "2–4 h",
    adult: "Gratis",
    child: "Gratis",
    address: "1500 Orange Ave, Coronado, CA 92118",
    maps: "https://www.google.com/maps/search/?api=1&query=1500+Orange+Ave%2C+Coronado%2C+CA+92118",
    site: "https://www.coronado.ca.us",
  },
  {
    name: "Sunset Cliffs",
    category: "Naturaleza / Vista",
    image:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
    fallback:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    description:
      "Acantilados con una de las mejores vistas al atardecer en San Diego. Excelente para una salida corta y memorable.",
    effort: "Bajo",
    duration: "1–2 h",
    adult: "Gratis",
    child: "Gratis",
    address: "680 Ladera St, San Diego, CA 92107",
    maps: "https://www.google.com/maps/search/?api=1&query=680+Ladera+St%2C+San+Diego%2C+CA+92107",
    site: "https://www.sandiego.gov/park-and-recreation/parks/regional/sunsetcliffs",
  },
];

const people = ["Mauricio", "Rosario", "Eric", "Erika", "Adrián"];

function PlaceImage({ place }: { place: Place }) {
  const [src, setSrc] = useState(place.image);

  return (
    <img
      src={src}
      alt={place.name}
      onError={() => setSrc(place.fallback)}
      style={{
        width: "100%",
        height: "230px",
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
    const q = query.toLowerCase();
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const toggleVote = (placeName: string, person: string) => {
    setVotes((prev) => ({
      ...prev,
      [placeName]: {
        ...(prev[placeName] || {}),
        [person]: !(prev[placeName] || {})[person],
      },
    }));
  };

  const voteCount = (placeName: string) =>
    Object.values(votes[placeName] || {}).filter(Boolean).length;

  const finalList = places.filter((p) => finalSelection[p.name]);

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
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
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