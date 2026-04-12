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
  adultMWR?: string;
  childMWR?: string;
  mwrNote?: string;
  address: string;
  maps: string;
  site: string;
  openHour: number;  // hora de apertura (24h)
  peakStart: number; // inicio de hora pico
  peakEnd: number;   // fin de hora pico
  bestTime: string;  // texto recomendación entre semana
  weekendWarning: string; // advertencia específica para fin de semana
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
    description: "Zoológico de clase mundial con hábitats abiertos, gran biodiversidad y teleférico interno. Ideal para recorrer en familia, aunque exige caminata constante.",
    effort: "Alto", duration: "4–6 h",
    adult: "$70–80", child: "$60–70",
    adultMWR: "$64.50", childMWR: "$56.25",
    mwrNote: "Precio MWR disponible via primo en Naval Base",
    address: "2920 Zoo Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=San+Diego+Zoo",
    site: "https://zoo.sandiegozoo.org",
    openHour: 9, peakStart: 11, peakEnd: 15,
    bestTime: "Llegar a las 9am — los animales están más activos y hay menos gente. Evitar 11am–3pm (hora pico con escolares).",
    weekendWarning: "⚠️ Sábados y domingos el zoo recibe hasta 3x más visitantes. Llegar a las 9am en punto cuando abren las puertas. Comprar tickets online con anticipación para saltar la fila del ingreso.",
  },
  {
    name: "SeaWorld San Diego",
    category: "Imperdible",
    image: "/images/seaworld-san-diego.jpg",
    description: "Parque marino con shows de animales, montañas rusas y áreas infantiles. Muy equilibrado entre entretenimiento y educación.",
    effort: "Medio", duration: "4–6 h",
    adult: "$80–100", child: "$70–90",
    adultMWR: "$50.50", childMWR: "$50.50",
    mwrNote: "1 Day MWR. Military Pass anual: $111.75",
    address: "500 Sea World Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=SeaWorld+San+Diego",
    site: "https://seaworld.com/san-diego",
    openHour: 10, peakStart: 12, peakEnd: 16,
    bestTime: "Jueves o viernes antes del fin de semana. Llegar a las 10am y hacer las atracciones de agua primero antes del calor.",
    weekendWarning: "⚠️ Fin de semana es el día más concurrido en SeaWorld. Filas de 45–60 min en atracciones principales. Ir directo a Journey to Atlantis al entrar. Considerar ir un jueves o viernes.",
  },
  {
    name: "USS Midway Museum",
    category: "Imperdible",
    image: "/images/uss-midway-museum.jpg",
    description: "Portaaviones histórico convertido en museo interactivo. Permite explorar cabinas, cubierta y aviones reales. Muy atractivo para adultos y niños curiosos.",
    effort: "Medio", duration: "2–3 h",
    adult: "$30", child: "$20",
    adultMWR: "$23.00", childMWR: "$17.50",
    mwrNote: "Precio reducido MWR. Militar activo: entrada gratis",
    address: "910 N Harbor Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=USS+Midway+Museum",
    site: "https://midway.org",
    openHour: 10, peakStart: 12, peakEnd: 15,
    bestTime: "Lunes o martes por la mañana. Menos concurrido entre semana. Ideal llegar a las 10am cuando abre.",
    weekendWarning: "⚠️ Sábados hay filas moderadas en la entrada. Llegar antes de las 10am. El recorrido del portaaviones es más agitado — tomarse el tiempo para subir a cubierta temprano.",
  },
  {
    name: "Balboa Park",
    category: "Imperdible",
    image: "/images/balboa-park.jpg",
    description: "Complejo cultural con jardines, arquitectura histórica y múltiples museos. Ideal para paseos tranquilos o visitas parciales.",
    effort: "Bajo", duration: "2–5 h",
    adult: "Gratis", child: "Gratis",
    address: "1549 El Prado, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Balboa+Park",
    site: "https://balboapark.org",
    openHour: 8, peakStart: 11, peakEnd: 14,
    bestTime: "Mañanas entre semana son ideales. Jardines más tranquilos antes de las 10am. Los museos militares ofrecen entrada gratis.",
    weekendWarning: "⚠️ Domingos hay familias y eventos culturales — más animado pero más lleno. Estacionamiento limitado. Llegar temprano o usar transporte público.",
  },
  // 👨‍👩‍👧‍👦 FAMILIA / NIÑOS
  {
    name: "LEGOLAND California",
    category: "Familia / Niños",
    image: "/images/legoland-california.jpg",
    description: "Parque temático diseñado para niños, con atracciones LEGO, shows y áreas acuáticas. Muy recomendado para el niño de 6 años.",
    effort: "Medio", duration: "4–6 h",
    adult: "$90–120", child: "$90–110",
    adultMWR: "$69.25", childMWR: "$69.25",
    mwrNote: "Single Day MWR (2+ años). Combo LEGO+SeaLife con 2do día gratis: $74.50",
    address: "1 Legoland Dr, Carlsbad, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=LEGOLAND+California",
    site: "https://legoland.com/california",
    openHour: 10, peakStart: 12, peakEnd: 16,
    bestTime: "Entre semana es mucho menos concurrido. Llegar a las 10am. Hacer Miniland y atracciones principales primero, agua después del mediodía.",
    weekendWarning: "⚠️ LEGOLAND en fin de semana puede duplicar su afluencia. Filas largas en Dragon y atracciones acuáticas. Hacer las atracciones principales los primeros 90 minutos de apertura.",
  },
  {
    name: "Birch Aquarium",
    category: "Familia / Niños",
    image: "/images/birch-aquarium.jpg",
    description: "Acuario pequeño y educativo con enfoque en ciencia marina. Muy manejable y cómodo con bebé.",
    effort: "Bajo", duration: "1–2 h",
    adult: "$20–30", child: "$15–25",
    adultMWR: "$28.75", childMWR: "$24.25",
    mwrNote: "Precio MWR disponible via Naval Base",
    address: "2300 Expedition Way, La Jolla, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Birch+Aquarium",
    site: "https://aquarium.ucsd.edu",
    openHour: 9, peakStart: 11, peakEnd: 14,
    bestTime: "Mañanas de entre semana. Muy tranquilo antes de las 11am. Perfecto para combinar con La Jolla Cove el mismo día.",
    weekendWarning: "⚠️ Fin de semana hay más familias pero sigue siendo manejable. Llegar antes de las 10am para disfrutar sin aglomeración. Estacionamiento en la UCSD puede ser complicado.",
  },
  {
    name: "Belmont Park",
    category: "Familia / Niños",
    image: "/images/belmont-park.jpg",
    description: "Parque de diversiones frente al mar con ambiente relajado. Ideal para combinar con playa.",
    effort: "Bajo", duration: "1–3 h",
    adult: "Gratis", child: "Gratis",
    adultMWR: "$45.25", childMWR: "$45.25",
    mwrNote: "Combo Pass rides + atracciones MWR: $45.25",
    address: "3146 Mission Blvd, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Belmont+Park+San+Diego",
    site: "https://belmontpark.com",
    openHour: 11, peakStart: 14, peakEnd: 18,
    bestTime: "Tardes entre semana o mañanas de fin de semana antes de las 11am. Ideal combinarlo con Mission Beach en la misma visita.",
    weekendWarning: "⚠️ Sábados y domingos Belmont Park es muy popular con locales. La playa adyacente se llena. Ir antes de las 11am o después de las 6pm para mejor experiencia.",
  },
  // 🌊 PLAYAS Y NATURALEZA
  {
    name: "La Jolla Cove",
    category: "Playas y Naturaleza",
    image: "/images/la-jolla-cove.jpg",
    description: "Zona costera con acantilados, aguas claras y lobos marinos. Uno de los paisajes más icónicos de San Diego.",
    effort: "Bajo", duration: "1–3 h",
    adult: "Gratis", child: "Gratis",
    address: "1100 Coast Blvd, La Jolla, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=La+Jolla+Cove",
    site: "https://lajolla.com",
    openHour: 7, peakStart: 11, peakEnd: 16,
    bestTime: "Antes de las 9am para ver lobos marinos tranquilos y menos turistas. En mayo el agua está fresca pero el cielo es claro.",
    weekendWarning: "⚠️ La Jolla Cove en fin de semana está muy concurrida — turistas, fotógrafos y grupos numerosos. Ir antes de las 8am para experiencia tranquila con los lobos marinos.",
  },
  {
    name: "Coronado Beach",
    category: "Playas y Naturaleza",
    image: "/images/coronado-beach.jpg",
    description: "Playa amplia, limpia y elegante frente al Hotel del Coronado. Perfecta para relajarse en familia.",
    effort: "Bajo", duration: "2–4 h",
    adult: "Gratis", child: "Gratis",
    address: "1500 Orange Ave, Coronado, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Coronado+Beach",
    site: "https://coronado.ca.us",
    openHour: 7, peakStart: 12, peakEnd: 17,
    bestTime: "Mañanas son ideales en mayo. La brisa es suave antes del mediodía. Combinar con un paseo por Orange Ave y el Hotel del Coronado.",
    weekendWarning: "⚠️ Coronado Beach los fines de semana es uno de los destinos más concurridos de San Diego. Estacionamiento muy limitado. Considerar el ferry desde el centro (más relajado).",
  },
  {
    name: "Sunset Cliffs",
    category: "Playas y Naturaleza",
    image: "/images/sunset-cliffs.jpg",
    description: "Acantilados con vistas espectaculares del océano, especialmente al atardecer. Experiencia corta pero muy impactante.",
    effort: "Bajo", duration: "1–2 h",
    adult: "Gratis", child: "Gratis",
    address: "680 Ladera St, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Sunset+Cliffs",
    site: "https://sandiego.gov",
    openHour: 6, peakStart: 18, peakEnd: 20,
    bestTime: "Atardecer entre las 7–8pm en mayo. Llegar 30 min antes para conseguir buen lugar. Entre semana hay mucha menos gente.",
    weekendWarning: "⚠️ Sunset Cliffs en fin de semana está lleno de gente buscando el atardecer. Llegar 45–60 min antes para asegurar lugar. Cuidado con el estacionamiento en la calle.",
  },
  {
    name: "Torrey Pines",
    category: "Playas y Naturaleza",
    image: "/images/torrey-pines.jpg",
    description: "Reserva natural con senderos y vistas panorámicas del océano. Ideal para quienes disfrutan caminar en naturaleza.",
    effort: "Medio/Alto", duration: "2–4 h",
    adult: "$15 parking", child: "-",
    address: "12600 N Torrey Pines Rd, La Jolla, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Torrey+Pines",
    site: "https://torreypines.org",
    openHour: 7, peakStart: 10, peakEnd: 14,
    bestTime: "Temprano en la mañana (7–9am) para el mejor clima. En mayo hace fresco antes del mediodía. Llevar agua y zapatos cómodos.",
    weekendWarning: "⚠️ Torrey Pines en fin de semana tiene el estacionamiento lleno desde las 9am. Llegar antes de las 8am o ir entre semana. Los senderos se congestionan en las horas pico.",
  },
  // 🏙 EXPERIENCIAS URBANAS
  {
    name: "Old Town San Diego",
    category: "Experiencias Urbanas",
    image: "/images/old-town-san-diego.jpg",
    description: "Centro histórico con fuerte influencia mexicana, tiendas, restaurantes y ambiente cultural. Muy auténtico.",
    effort: "Bajo", duration: "1–3 h",
    adult: "Gratis", child: "Gratis",
    address: "4002 Wallace St, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Old+Town+San+Diego",
    site: "https://oldtownsandiego.org",
    openHour: 10, peakStart: 13, peakEnd: 16,
    bestTime: "Mañanas entre semana. Los restaurantes están menos llenos antes de la 1pm. Combinar con Bazaar del Mundo para artesanías.",
    weekendWarning: "⚠️ Old Town los fines de semana tiene eventos culturales y música en vivo — más animado pero más lleno. Los restaurantes tienen espera de 20–30 min para almorzar.",
  },
  {
    name: "Little Italy",
    category: "Experiencias Urbanas",
    image: "/images/little-italy.jpg",
    description: "Zona moderna con restaurantes, cafés y excelente ambiente. Ideal para cenas.",
    effort: "Bajo", duration: "2–3 h",
    adult: "Variable", child: "Variable",
    address: "India St & W Date St, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Little+Italy+San+Diego",
    site: "https://littleitalysd.com",
    openHour: 11, peakStart: 19, peakEnd: 21,
    bestTime: "Cena entre semana (lunes–jueves) para evitar esperas. Los sábados hay mercado de agricultores en la mañana — muy recomendado.",
    weekendWarning: "✅ Sábados por la mañana hay Mercado de Agricultores — excelente para desayuno. Para cenar esperar esperas de 30–45 min en restaurantes populares. Reservar con anticipación.",
  },
  {
    name: "Seaport Village",
    category: "Experiencias Urbanas",
    image: "/images/seaport-village.jpg",
    description: "Paseo frente al mar con tiendas, restaurantes y ambiente relajado. Muy agradable para caminar.",
    effort: "Bajo", duration: "1–2 h",
    adult: "Gratis", child: "Gratis",
    address: "849 W Harbor Dr, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Seaport+Village",
    site: "https://seaportvillage.com",
    openHour: 10, peakStart: 12, peakEnd: 16,
    bestTime: "Mañanas tranquilas o tarde después de las 5pm. Combinar con USS Midway en la misma visita al waterfront.",
    weekendWarning: "⚠️ Seaport Village en fin de semana tiene más ambiente pero más gente. Mejor visitarlo temprano (10–11am) o como cierre del día después del Midway.",
  },
  {
    name: "Gaslamp Quarter",
    category: "Experiencias Urbanas",
    image: "/images/gaslamp-quarter.jpg",
    description: "Zona histórica con restaurantes y vida nocturna. Más orientado a adultos.",
    effort: "Bajo", duration: "2–4 h",
    adult: "Gratis", child: "-",
    address: "614 5th Ave, San Diego, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Gaslamp+Quarter",
    site: "https://gaslamp.org",
    openHour: 11, peakStart: 20, peakEnd: 23,
    bestTime: "Entre semana para cenar sin esperas. Viernes y sábados es muy animado pero concurrido. Ideal para noche de adultos.",
    weekendWarning: "⚠️ Gaslamp Quarter los viernes y sábados es una de las zonas más concurridas de San Diego. Si van en familia llegar antes de las 8pm. Para adultos, la vida nocturna empieza después de las 9pm.",
  },
  // 🚗 ALREDEDORES
  {
    name: "Carlsbad Flower Fields",
    category: "Alrededores",
    image: "/images/carlsbad-flower-fields.jpg",
    description: "Campos de flores en temporada, muy coloridos y fotogénicos. Mayo es el último mes — ¡no perdérselo!",
    effort: "Bajo", duration: "1–2 h",
    adult: "$20–30", child: "$20–30",
    address: "5704 Paseo Del Norte, Carlsbad, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Carlsbad+Flower+Fields",
    site: "https://theflowerfields.com",
    openHour: 9, peakStart: 11, peakEnd: 15,
    bestTime: "Mañanas de entre semana. Las flores están más frescas antes del mediodía. Muy popular en mayo — ir temprano es clave.",
    weekendWarning: "⚠️ Carlsbad Flower Fields en mayo es muy popular. Los fines de semana la entrada puede tener 30 min de espera. Abren a las 9am — llegar antes para luz de fotografía y menos gente.",
  },
  {
    name: "Laguna Beach",
    category: "Alrededores",
    image: "/images/laguna-beach.jpg",
    description: "Playa de alto nivel con calas, arte y paisajes espectaculares. Ideal para paseo premium.",
    effort: "Bajo", duration: "Medio día",
    adult: "Gratis", child: "Gratis",
    address: "Laguna Beach, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Laguna+Beach",
    site: "https://visitlagunabeach.com",
    openHour: 8, peakStart: 12, peakEnd: 17,
    bestTime: "Mañanas de entre semana. Combinar con Outlets at San Clemente (45 min) en el mismo día. Ideal salir temprano desde el hospedaje.",
    weekendWarning: "⚠️ Laguna Beach en fin de semana tiene tráfico intenso y estacionamiento muy limitado. Llegar antes de las 9am o usar los lotes de estacionamiento pagados. Vale la pena de todas formas.",
  },
  {
    name: "Anza-Borrego Desert",
    category: "Alrededores",
    image: "/images/anza-borrego-desert.jpg",
    description: "Desierto con esculturas y paisajes únicos. Experiencia diferente, pero más exigente.",
    effort: "Alto", duration: "Día completo",
    adult: "Gratis", child: "Gratis",
    address: "Borrego Springs, CA",
    maps: "https://www.google.com/maps/search/?api=1&query=Anza+Borrego",
    site: "https://parks.ca.gov",
    openHour: 6, peakStart: 11, peakEnd: 15,
    bestTime: "Salir muy temprano (6–7am) para estar allá antes del calor fuerte. En mayo puede llegar a 38°C al mediodía. Solo para quienes disfrutan aventura.",
    weekendWarning: "ℹ️ Anza-Borrego es tranquilo cualquier día — es muy remoto. El mayor riesgo es el calor. Fin de semana hay algo más de visitantes en las esculturas pero nada significativo. Llevar mínimo 3L de agua por persona.",
  },
];

const people = ["Mauricio", "Rosario", "Eric", "Erika", "Adrián", "Felipe", "Invitado"];
const TRIP_START = "2026-05-15";
const TRIP_END   = "2026-05-25";
const TRIP_DAYS  = ["vie 15", "sáb 16", "dom 17", "lun 18", "mar 19", "mié 20", "jue 21", "vie 22", "sáb 23", "dom 24", "lun 25"];

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

  const [selectedDay, setSelectedDay] = useState<string>("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getBestTimeForDay = (place: Place, dayLabel: string): string => {
    const isWeekend = dayLabel.startsWith("sáb") || dayLabel.startsWith("dom");
    if (isWeekend) {
      return place.weekendWarning;
    }
    return `✅ Entre semana — ${place.bestTime}`;
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
          {/* Sesión activa — lo primero que ve el usuario */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderRadius: 18, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>👋</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hola de nuevo</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{currentPerson} — ¡tu voto cuenta!</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setCurrentPerson(null); setSubmitted(false); }}
              style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Cambiar
            </button>
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", marginBottom: 8, fontWeight: 700 }}>
              San Diego Family Trip 🌊
            </div>
            <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: "0 0 10px", fontWeight: 800 }}>
              ¿A dónde vamos juntos?
            </h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#475569" }}>
              Explorá los lugares, votá los que más te emocionan y ayudá a armar el viaje perfecto para toda la familia.
            </p>
          </div>

          {/* Section switcher */}
          <div style={{ display: "flex", gap: 0, marginTop: 20, marginBottom: 20, background: "#f1f5f9", borderRadius: 20, padding: 4, width: "fit-content" }}>
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

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 18px", minWidth: 140 }}>
              <div style={{ fontSize: 26, fontWeight: 800 }}>
                {Object.values(votes).reduce((acc, current) => acc + Object.values(current || {}).filter(Boolean).length, 0)}
              </div>
              <div style={{ color: "#64748b", fontSize: 13 }}>votos emitidos</div>
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 18px", minWidth: 140 }}>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{finalList.length}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>confirmados por el grupo</div>
            </div>
          </div>

          {/* Buscador */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Buscar lugar, categoría..."
            style={{ width: "100%", boxSizing: "border-box", height: 48, borderRadius: 16, border: "1px solid #dbe3ee", padding: "0 16px", fontSize: 15, outline: "none", background: "#f8fafc" }}
          />
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
                    {(votes[place.name] || {})[currentPerson!] ? "✅ Voto por este lugar" : "＋ Agregar a mis votos"}
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

                {/* Precios */}
                <div style={{ background: "#f8fafc", borderRadius: 16, padding: 14, border: "1px solid #e2e8f0", fontSize: 14, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>💰 Precios de entrada</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Precio regular</div>
                      <div style={{ fontWeight: 700, color: "#334155" }}>Adulto: {place.adult}</div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>Niño: {place.child}</div>
                    </div>
                    {place.adultMWR && (
                      <div style={{ background: "#fff7ed", borderRadius: 12, padding: "10px 12px", border: "1px solid #fed7aa" }}>
                        <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 2 }}>⭐ Precio MWR</div>
                        <div style={{ fontWeight: 700, color: "#c2410c" }}>Adulto: {place.adultMWR}</div>
                        <div style={{ color: "#ea580c", fontSize: 13 }}>Niño: {place.childMWR}</div>
                      </div>
                    )}
                  </div>
                  {place.mwrNote && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#f97316", fontStyle: "italic" }}>ℹ️ {place.mwrNote}</div>
                  )}
                </div>

                <div style={{ color: "#475569", fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>📍 {place.address}</div>

                {/* Botones de navegación */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  <a href={place.maps} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", borderRadius: 16, background: "#0f172a", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
                    🗺 Maps
                  </a>
                  <a href={`maps://?q=${encodeURIComponent(place.address)}`}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", borderRadius: 16, background: "#fff", color: "#0f172a", textDecoration: "none", fontSize: 14, fontWeight: 700, border: "1px solid #dbe3ee" }}>
                    🍎 Apple Maps
                  </a>
                  <a href={place.site} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", borderRadius: 16, background: "#f8fafc", color: "#0f172a", textDecoration: "none", fontSize: 14, fontWeight: 700, border: "1px solid #dbe3ee" }}>
                    Más info
                  </a>
                </div>

                {/* Planificador unificado — día + horario + calendario */}
                {(() => {
                  const dateMap: Record<string,string> = {"vie 15":"2026-05-15","sáb 16":"2026-05-16","dom 17":"2026-05-17","lun 18":"2026-05-18","mar 19":"2026-05-19","mié 20":"2026-05-20","jue 21":"2026-05-21","vie 22":"2026-05-22","sáb 23":"2026-05-23","dom 24":"2026-05-24","lun 25":"2026-05-25"};
                  const selectedDate = tentativeDates[place.name] || "";
                  const selectedDayLabel = Object.entries(dateMap).find(([, v]) => v === selectedDate)?.[0] || "";
                  const isWeekend = selectedDayLabel.startsWith("sáb") || selectedDayLabel.startsWith("dom");
                  // Otros lugares ya agendados en el mismo día
                  const conflicts = places.filter(p => p.name !== place.name && tentativeDates[p.name] === selectedDate);
                  return (
                    <div style={{ background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 4 }}>
                      {/* Header desplegable */}
                      <button type="button"
                        onClick={() => setOpenComments(prev => ({ ...prev, [`__day__${place.name}`]: !prev[`__day__${place.name}`] }))}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>📅</span>
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>¿Cuándo planean ir?</div>
                            {selectedDayLabel
                              ? <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{selectedDayLabel} de mayo · {isWeekend ? "Fin de semana" : "Entre semana"}</div>
                              : <div style={{ fontSize: 13, color: "#94a3b8" }}>Seleccioná un día del viaje</div>
                            }
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{openComments[`__day__${place.name}`] ? "▲" : "▼"}</span>
                      </button>

                      {openComments[`__day__${place.name}`] && (
                        <div style={{ padding: "0 16px 16px" }}>
                          {/* Chips de días */}
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                            {TRIP_DAYS.map(day => {
                              const isSelected = selectedDayLabel === day;
                              const hasOther = Object.entries(tentativeDates).some(([pName, pDate]) => pName !== place.name && pDate === dateMap[day]);
                              return (
                                <button key={day} type="button"
                                  onClick={() => setTentativeDates(prev => ({ ...prev, [place.name]: isSelected ? "" : dateMap[day] }))}
                                  style={{
                                    padding: "6px 12px", borderRadius: 999,
                                    border: isSelected ? "2px solid #0f172a" : hasOther ? "1px solid #fbbf24" : "1px solid #e2e8f0",
                                    background: isSelected ? "#0f172a" : hasOther ? "#fefce8" : "#fff",
                                    color: isSelected ? "#fff" : hasOther ? "#92400e" : "#64748b",
                                    fontSize: 12, fontWeight: isSelected ? 800 : 500, cursor: "pointer",
                                    position: "relative" as const,
                                  }}>
                                  {day}{hasOther ? " ⚡" : ""}
                                </button>
                              );
                            })}
                          </div>

                          {/* Recomendación de horario para el día elegido */}
                          {selectedDayLabel && (
                            <div style={{ background: isWeekend ? "#fff7ed" : "#f0fdf4", borderRadius: 12, padding: 12, marginBottom: 12, border: isWeekend ? "1px solid #fed7aa" : "1px solid #86efac" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: isWeekend ? "#f97316" : "#16a34a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                🕐 {isWeekend ? "Advertencia fin de semana" : "Recomendación para este día"}
                              </div>
                              <p style={{ margin: 0, fontSize: 13, color: isWeekend ? "#c2410c" : "#15803d", lineHeight: 1.6 }}>
                                {getBestTimeForDay(place, selectedDayLabel)}
                              </p>
                            </div>
                          )}

                          {/* Sin día seleccionado — mostrar recomendación general */}
                          {!selectedDayLabel && (
                            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 12, marginBottom: 12, border: "1px solid #86efac" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>🕐 Mejor horario general</div>
                              <p style={{ margin: 0, fontSize: 13, color: "#15803d", lineHeight: 1.6 }}>{place.bestTime}</p>
                            </div>
                          )}

                          {/* Conflictos — otros lugares ese mismo día */}
                          {conflicts.length > 0 && (
                            <div style={{ background: "#fefce8", borderRadius: 12, padding: 10, marginBottom: 12, border: "1px solid #fbbf24" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>⚡ Ese día ya tienen agendado:</div>
                              {conflicts.map(c => (
                                <div key={c.name} style={{ fontSize: 12, color: "#78350f" }}>• {c.name}</div>
                              ))}
                            </div>
                          )}

                          {/* Botón calendario */}
                          {selectedDate && (
                            <button type="button" onClick={() => addToCalendar(place.name, selectedDate)}
                              style={{ width: "100%", padding: "10px", borderRadius: 12, border: "none", background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                              📅 Agregar a Google Calendar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

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
                    // Estados progresivos excluyentes: visited > wantToGo > interested
                    const current = shoppingState[sp.name] || {};
                    const isActive = !!current[field];
                    let newState: typeof current;
                    if (isActive) {
                      // Si ya estaba activo, desactivar
                      newState = { ...current, interested: false, wantToGo: false, visited: false };
                    } else if (field === "visited") {
                      newState = { interested: false, wantToGo: false, visited: true };
                    } else if (field === "wantToGo") {
                      newState = { interested: false, wantToGo: true, visited: false };
                    } else {
                      newState = { interested: true, wantToGo: false, visited: false };
                    }
                    setShoppingState((prev) => ({ ...prev, [sp.name]: newState }));
                    playSound("vote");
                    const labels: Record<string, string> = { interested: "❤️ Me interesa", wantToGo: "🛍 Lo visito", visited: "✅ Ya fui" };
                    if (!isActive) showToast(`${labels[field]}: ${sp.name}`);
                    try {
                      fetch(SHEETS_URL, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify({
                          place: sp.name,
                          person: currentPerson,
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

      {/* Bottom bar — tabs izquierda, acciones derecha */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)",
        borderTop: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px max(10px, env(safe-area-inset-bottom))",
        gap: 12,
      }}>
        {/* Izquierda — tabs de sección */}
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 16, padding: 3 }}>
          {([["atracciones","🗺️","Atracciones"],["compras","🛍️","Compras"]] as const).map(([item, emoji, label]) => {
            const active = section === item;
            return (
              <button key={item} type="button"
                onClick={() => { setSection(item); playSound("section"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "6px 14px", borderRadius: 13, border: "none", background: active ? "#0f172a" : "transparent", color: active ? "#fff" : "#94a3b8", cursor: "pointer", minWidth: 70 }}>
                <span style={{ fontSize: 18 }}>{emoji}</span>
                <span style={{ fontSize: 10, fontWeight: active ? 800 : 500 }}>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Derecha — Enviar votos + WhatsApp */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          {/* Enviar mis votos — primero */}
          {submitted ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 14, background: "#f0fdf4", border: "1px solid #86efac", color: "#16a34a", fontSize: 13, fontWeight: 700 }}>
              ✅ Votos enviados
            </div>
          ) : (
            <button type="button" onClick={submitVotes}
              disabled={submitting || Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0}
              style={{
                padding: "9px 16px", borderRadius: 14, border: "none",
                background: Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0 ? "#e2e8f0" : "#f97316",
                color: Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0 ? "#94a3b8" : "#fff",
                fontSize: 13, fontWeight: 700,
                cursor: Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0 ? "not-allowed" : "pointer",
                boxShadow: Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length === 0 ? "none" : "0 3px 14px rgba(249,115,22,0.35)",
                display: "flex", alignItems: "center", gap: 7,
              }}>
              <span>📤 Enviar votos</span>
              {Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length > 0 && (
                <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 999, padding: "1px 8px", fontSize: 12 }}>
                  {Object.keys(votes).filter(p => (votes[p] || {})[currentPerson!]).length}
                </span>
              )}
            </button>
          )}
          {/* WhatsApp — ícono circular */}
          <a href={WHATSAPP_GROUP} target="_blank" rel="noreferrer" title="Abrir grupo de WhatsApp"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "#25D366", textDecoration: "none", boxShadow: "0 3px 12px rgba(37,211,102,0.35)", flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
      {/* Spacer for bottom bar */}
      <div style={{ height: 110 }} />
    </main>
  );
}