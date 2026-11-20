import type { Locale } from "@/i18n/routing";
import type { Figure, TitledItem } from "@/components/ProjectPageKit";

// Copy for the bespoke OV delay metrics page (slug: ov-streaming-pipeline). The listing on /projects,
// the sitemap and llms-full.txt still read the project's MDX frontmatter and
// prose; this module only feeds the custom detail page.

export const SLUG = "ov-streaming-pipeline";
export const ACCENT = "#10B981";
export const REPO_URL = "https://github.com/datavakwerk/ov-streaming-pipeline";
const IMG = "/images/projects/ov-streaming-pipeline";

export type { Figure, TitledItem };

export interface PageContent {
  eyebrow: string;
  title: string;
  lead: string;
  intro: string[];
  facts: string[];
  stats: { label: string; value: string }[];
  ui: {
    repo: string;
    allProjects: string;
    back: string;
    dataSource: string;
    dataSourceName: string;
    links: string;
  };
  hero: Figure;
  why: { title: string; body: string[] };
  /** What is measured: windows, dimensions, the five figures per window. */
  definitions: { title: string; body: string[]; choicesTitle: string; choices: TitledItem[] };
  /** The Streamlit delay dashboard and the Grafana dashboard. */
  dashboards: { title: string; body: string[]; screenshots: Figure[]; grafana: Figure };
  /** What the feed really looks like and where bad records go. */
  quality: {
    title: string;
    body: string[];
    quirksTitle: string;
    quirks: string[];
    quirksNote: string;
    notesTitle: string;
    notes: TitledItem[];
  };
  /** The two times good events were wrongly dropped as late. */
  incidents: { title: string; body: string[]; items: TitledItem[]; figure: Figure };
  /** No double counting, recomputable, tested. */
  trust: {
    title: string;
    body: string[];
    items: TitledItem[];
    figure: Figure;
    proof: { test: string; body: string };
  };
  measured: { title: string; intro: string; tableCaption: string; rows: [string, string][] };
  /** The pipeline underneath, kept short. */
  underneath: { title: string; body: string[]; figure: Figure; items: TitledItem[] };
  shows: { title: string; skills: string[]; closing: string };
}

const DIAGRAM_DIMS = {
  "ov-1-architectuur": { width: 1606, height: 1015 },
  "ov-2-vensters-watermarks": { width: 1486, height: 846 },
  "ov-3-at-least-once": { width: 1510, height: 834 },
} as const;

function diagram(name: keyof typeof DIAGRAM_DIMS, alt: string, caption: string): Figure {
  // The architecture diagram carries the most detail, so it is rendered by
  // draw.io's own viewer (zoom, pan, lightbox) from the .drawio source in
  // public/diagrams; the others stay a flat SVG that links to its full size.
  const drawioSrc = name.endsWith("-architectuur") ? `/diagrams/${name}.drawio` : undefined;
  return { kind: "diagram", src: `${IMG}/${name}.svg`, ...DIAGRAM_DIMS[name], alt, caption, drawioSrc };
}

function shot(name: string, height: number, alt: string, caption: string): Figure {
  return { kind: "screenshot", src: `${IMG}/${name}.png`, width: 1600, height, alt, caption };
}


const nl: PageContent = {
  eyebrow: "Eigen project · 3 weken",
  title: "Realtime vertragingscijfers voor het Nederlandse OV",
  lead: "Vertragingen in het Nederlandse openbaar vervoer, samengevat per vijf minuten per lijn, station, vervoerder en netwerk — op een live kaart van het hele land, met de onderbouwing waarom die cijfers kloppen.",
  intro: [
    "Twee bestanden op een open endpoint bevatten elke minuut waar ongeveer 4.900 voertuigen zich bevinden en hoeveel vertraging ze hebben. Daar een dashboard van maken is een middag werk. Daar cijfers van maken die 24 uur per dag doorlopen, na een crash nog steeds kloppen, waarin kapotte records niet stilzwijgend verdwijnen en waarvan je een uur uit het verleden opnieuw kunt uitrekenen — dat is een ander project.",
    "Dit is dat tweede project. Vaste definities voor de vertragingscijfers, per venster opgeslagen in Postgres, met een live dashboard in Streamlit erbovenop en een Grafana-dashboard dat laat zien hoe de aanvoer erbij staat. Daaronder draait een streamingpipeline op Kafka met een ruw archief waaruit je kunt herberekenen. Dertien containers, één make up, geen accounts en geen sleutels.",
  ],
  facts: [
    "Postgres",
    "Streamlit + pydeck",
    "Prometheus + Grafana",
    "Python 3.12",
    "Kafka (Redpanda)",
    "MinIO",
    "Docker Compose",
  ],
  stats: [
    { label: "Vensters", value: "5 min · 4 dimensies" },
    { label: "Dashboards", value: "Live kaart + Grafana" },
    { label: "Ochtendspits", value: "176 berichten/s" },
    { label: "Tests", value: "106, zonder infra" },
  ],
  ui: {
    repo: "Bekijk de code op GitHub",
    allProjects: "Alle projecten",
    back: "Terug naar projecten",
    dataSource: "Databron",
    dataSourceName: "OVapi GTFS-realtime, open access zonder sleutel",
    links: "Links",
  },
  hero: shot(
    "dashboard",
    1000,
    "Het live dashboard NL OV Delay Monitor in de ochtendspits: zes KPI-tegels (4.616 voertuigen live, 6.628 ritten met voorspelling, gemiddelde vertraging +1:01, P90 +2:40, 70% op tijd, slechtste lijn +60:00), een kaart van Nederland met duizenden gekleurde voertuigposities en rechts een tabel met de slechtste lijnen van het laatste venster.",
    "Het dashboard op maandagochtend 08:24: 4.616 voertuigen op de kaart, de KPI's van het laatste gesloten venster en de slechtste lijnen van dat venster.",
  ),
  why: {
    title: "Waarom dit project",
    body: [
      "Een vertragingscijfer op een dashboard zetten is het makkelijke deel. De interessante dingen gebeuren pas als er echte tijd in het spel is: metingen die te laat aankomen, een proces dat omvalt tussen twee schrijfacties, een feed die zich niet aan zijn eigen documentatie houdt. Elk daarvan kan een cijfer verkeerd maken zonder dat het dashboard er anders uitziet.",
      "Ik wilde die dingen tegenkomen in plaats van erover lezen. Een landelijke, publieke, altijd-aan databron dwingt dat af — en levert meteen iets op wat je kunt laten zien.",
    ],
  },
  definitions: {
    title: "Wat er gemeten wordt",
    body: [
      "De vertraging komt uit de ritvoorspellingen in de feed; de voertuigposities zelf bevatten geen vertraging. Die vertragingen worden samengevat in vaste vensters van vijf minuten (10:00–10:05, 10:05–10:10, enzovoort) over vier dimensies tegelijk: lijn, station, vervoerder en netwerk.",
      "Per venster zijn er vijf kengetallen: het aantal waarnemingen, het gemiddelde, de exacte P90, het maximum en het minimum.",
      "Elk afgesloten venster staat als één rij in Postgres, in de tabel delay_aggregates, met als sleutel (window_start, dimension, dimension_id). Het dashboard leest die tabel, en dezelfde cijfers per lijn, station, vervoerder of netwerk zijn met gewone SQL op te vragen.",
    ],
    choicesTitle: "Vier keuzes in de definitie",
    choices: [
      {
        title: "Exacte P90 in plaats van een schatting",
        body: "Met een paar duizend waarnemingen per venster per sleutel kost een exacte berekening (nearest-rank) niets, en het maakt een test mogelijk tegen een venster dat met de hand is uitgerekend. Op echte schaal is dit het onderdeel dat je zou vervangen, bijvoorbeeld door een t-digest.",
      },
      {
        title: "Elke dimensie apart, niet afgeleid",
        body: "De P90 van het netwerk kun je niet uit de P90's per lijn afleiden. De vier dimensies worden daarom elk apart bijgehouden; dat kost bijna niets extra.",
      },
      {
        title: "Een stilstaande vertraging blijft meetellen",
        body: "Alleen wijzigingen ten opzichte van de vorige meting worden doorgestuurd. Om te voorkomen dat een trein die al twintig minuten op +5:00 staat uit de statistiek verdwijnt, gaat er elke zestig seconden een heartbeat mee.",
      },
      {
        title: "Wat ‘te laat’ betekent",
        body: "Een venster wordt precies één keer vastgesteld. Wat meer dan twee minuten achterloopt telt niet meer mee, maar wordt wel geteld als te laat. In de praktijk is dat aantal nul, omdat de tijd van een meting de generatietijd van de feed zelf is en die alleen oploopt.",
      },
    ],
  },
  dashboards: {
    title: "De dashboards",
    body: [
      "Het live dashboard, gebouwd in Streamlit, leest rechtstreeks uit Postgres. Bovenaan staan zes KPI-tegels over het laatste gesloten venster: voertuigen live, ritten met voorspelling, gemiddelde vertraging, P90, percentage op tijd en de slechtste lijn. Daaronder de kaart met alle voertuigposities en de slechtste lijnen van dat venster.",
      "De detailpanelen tonen de netwerkvertraging over de laatste drie uur in vensters van vijf minuten, de gemiddelde vertraging per vervoerder en de verdeling van de huidige vertraging over actieve ritten. Helemaal onderaan staat een health-strip met de cijfers over de aanvoer zelf: berichten per seconde in en verwerkt, achterstand, late events en opzijgezette records per uur. Wie naar de vertragingscijfers kijkt, ziet op dezelfde pagina hoe de data eronder erbij staat.",
      "Het Grafana-dashboard gaat een laag dieper, met 26 panelen: doorvoer, achterstand en verwerkingstijd, correctheid (opzijgezette records, late events, vensters) en state en archief.",
    ],
    screenshots: [
      shot(
        "dashboard-detail",
        1000,
        "Onderste helft van het dashboard: een grafiek van de netwerkvertraging over de laatste drie uur in vensters van vijf minuten (P90 rond 2,5 minuut, gemiddelde rond 1 minuut), een staafdiagram met de gemiddelde vertraging per vervoerder, een histogram van de huidige vertraging over actieve ritten, en een health-strip met berichten per seconde in en verwerkt, consumer lag, watermark lag, vensters per uur, late events, DLQ per uur en archiefobjecten per uur.",
        "De detailpanelen: netwerktrend in vensters van vijf minuten, vertraging per vervoerder, verdeling over actieve ritten en de health-strip met de pipelinecijfers.",
      ),
      shot(
        "dashboard-night",
        1000,
        "Hetzelfde dashboard om 00:40 's nachts: 535 voertuigen live, 1.001 ritten met voorspelling, gemiddelde vertraging +0:48, 78% op tijd; de kaart is grotendeels leeg met voertuigen rond de grote steden, en de tabel met slechtste lijnen toont nachtbussen.",
        "Om 00:40 's nachts: 535 voertuigen in plaats van 4.600. Het dashboard laat de leegte zien in plaats van beweging te faken.",
      ),
    ],
    grafana: shot(
      "grafana",
      1400,
      "Het geprovisioneerde Grafana-dashboard over de laatste drie uur: bovenaan tegels voor berichten in en verwerkt per seconde (142,5), consumer lag 0, watermark lag 3 minuten, DLQ per uur en late events 0; daaronder rijen met throughput per topic en per consumer, feed-entiteiten per poll, consumer lag per partitie, watermark lag, verwerkingstijd p95, dead-letter rate, late en dubbele events, gefinaliseerde vensters per vijf minuten, open vensters, snapshot-differ-sleutels en archiefobjecten per uur.",
      "Het Grafana-dashboard met 26 panelen: throughput, lag en latency, correctheid (DLQ, lateness, vensters) en state en archief.",
    ),
  },
  quality: {
    title: "Hoe de data er echt uitziet",
    body: [
      "De feed houdt zich niet aan zijn eigen documentatie. Wat hieronder staat vind je nergens beschreven; het komt rechtstreeks uit de data.",
    ],
    quirksTitle: "Wat de feed niet documenteert",
    quirks: [
      "Entiteits-id's zoals 2026-09-06:GVB:13:13605 bevatten de vervoerderscode, die verder nergens in het bericht staat — dus die wordt uit het id gehaald.",
      "De voertuigpositie bevat geen vertraging; die zit in de ritvoorspelling.",
      "Er rijden spookvoertuigen rond: een bus die elf dagen op dezelfde plek STOPPED_AT staat, en één voertuig dat vanuit 29 minuten in de toekomst rapporteerde.",
      "Posities ouder dan tien minuten of meer dan een minuut vooruit worden weggegooid.",
    ],
    quirksNote: "Al die gevallen zijn vastgelegd in opgenomen feedbestanden in de repo: 140 KB die elke parsertest aan de werkelijkheid vastpint.",
    notesTitle: "Wat je pas ziet als het echt een nacht draait",
    notes: [
      {
        title: "De spits en de nacht schelen een factor honderd",
        body: "Om half twaalf 's avonds zijn het 50 tot 110 berichten per seconde en 1.400 voertuigen, om vier uur 's nachts twee berichten per seconde en twintig bussen — het dashboard zegt dat dan ook eerlijk in plaats van beweging te faken.",
      },
      {
        title: "Ook als het land stilvalt moet het laatste venster sluiten",
        body: "Tussen 01:00 en 05:00 rijden er twintig à dertig nachtbussen. Zonder ingreep wordt het laatste venster nooit vastgesteld, want er komt geen meting meer die de tijd vooruit duwt. Na negentig seconden stilte schuift de verwerking daarom op de wandklok door.",
      },
      {
        title: "Een slapende laptop is geen storing",
        body: "Maar ziet er in Grafana precies zo uit: macOS wordt elk uur 45 seconden wakker voor onderhoud, wat één hoge piek per uur en een watermark lag van een half uur oplevert. make keep-awake staat inmiddels in de runbook.",
      },
      {
        title: "Kapotte records gaan opzij, niet verloren",
        body: "Wat niet te lezen is — een voertuig zonder positie, zonder rit-id, coördinaten op 0,0 — gaat met de originele bytes en de foutreden naar een aparte wachtrij (dead-letter queue) en blokkeert de rest niet. De feed stuurt dezelfde kapotte entiteit elke minuut opnieuw, dus elke combinatie van entiteit en reden wordt één keer opzijgezet. Binnen tien seconden staat zo'n record op het Grafana-paneel en in de health-strip; na een fix kan het opnieuw worden aangeboden.",
      },
    ],
  },
  incidents: {
    title: "Twee keer klopte een cijfer stilletjes niet",
    body: [
      "Beide keren werden goede metingen als ‘te laat’ bestempeld en weggegooid, waardoor vensters op minder waarnemingen rustten dan er waren. Het begrip erachter is de watermark: de klok die bepaalt hoe ver de data is, en dus welke vensters dicht mogen.",
      "Te late events verdwijnen niet stil: ze worden geteld, en die teller staat op het Grafana-dashboard en in de health-strip.",
    ],
    items: [
      {
        title: "169.000 events weg na een inhaalslag",
        body: "De eerste versie had één klok voor alles: de nieuwste meting die was binnengekomen. Dat werkte prima tot er een inhaalslag van veertig minuten kwam. De zes partities van de stroom werden op verschillende snelheden gelezen, de snelste trok de klok vooruit, en 169.000 volstrekt normale events van de tragere partities golden als te laat. Nu heeft elke partitie een eigen klok en geldt de traagste; een partitie die 120 seconden niets stuurt telt niet mee, anders zou er nooit meer een venster sluiten.",
      },
      {
        title: "130.000 events weg door een klok in de toekomst",
        body: "Bij het opstarten wordt de klok gezet op het laatste venster dat al in Postgres staat, zodat opnieuw geleverde berichten geen gedeeltelijk venster over een compleet venster heen schrijven. Eén keer zette een herberekening die nog liep die klok in de toekomst, waarna 130.000 goede events werden weggegooid. Sindsdien wordt die startwaarde begrensd op de wandklok.",
      },
    ],
    figure: diagram(
      "ov-2-vensters-watermarks",
      "Diagram van de watermark: zes partities met elk hun maximale event-time; de traagste (p2, 10:12:40) bepaalt het minimum, een partitie die 130 s stil is telt niet mee; min minus 120 s toegestane vertraging geeft watermark 10:10:40. Op de event-time-as zijn de vensters 10:00–10:05 en 10:05–10:10 gefinaliseerd, 10:10–10:15 en 10:15–10:20 staan open. Een event met event-time 10:07 dat nu arriveert is te laat: geteld en weggegooid.",
      "De watermark komt van de traagste actieve partitie, niet van de snelste. Een venster sluit zodra de watermark het einde bereikt.",
    ),
  },
  trust: {
    title: "Waarom de cijfers kloppen",
    body: [
      "Drie eigenschappen waar ik bewust op gestuurd heb, omdat een cijfer dat je niet kunt narekenen weinig waard is.",
    ],
    items: [
      {
        title: "Opnieuw verwerken telt niet dubbel",
        body: "Een venster wordt eerst naar Postgres geschreven; pas daarna wordt vastgelegd tot waar de stroom gelezen is. Valt het proces daartussen om, dan komen dezelfde berichten opnieuw binnen, wordt hetzelfde venster uit dezelfde events herberekend en op dezelfde sleutel weggeschreven. De rij wordt vervangen, er wordt niets bij opgeteld.",
      },
      {
        title: "Een tijdvak is opnieuw uit te rekenen",
        body: "Alle ruwe berichten gaan ook naar een archief. make replay FROM=… TO=… rekent een tijdvak daaruit opnieuw uit, door dezelfde code als de live verwerking: er is geen tweede versie van de rekenregels. Gemeten: 122.364 gearchiveerde berichten uit twaalf minuten ochtendspits, herberekend tot 11.323 vensters in ongeveer tien seconden.",
      },
      {
        title: "Getest tegen een handberekend venster",
        body: "106 unit tests draaien zonder infrastructuur, waaronder de parser tegen opgenomen feeds (ook een van gemengde kwaliteit en een met pure onzin), een venster dat met de hand is uitgerekend en de SQL-invarianten van het dashboard. De integratietests draaien de dashboardqueries en de dubbele-levering-test tegen echte Postgres.",
      },
    ],
    figure: diagram(
      "ov-3-at-least-once",
      "Diagram in drie delen. De volgorde: poll batch, decoderen en tellen, watermark bijwerken, UPSERT van gefinaliseerde vensters in Postgres, ledger vrijgeven, en pas dan COMMIT van de offsets — stap 4 vóór stap 6, altijd. De offset-ledger per partitie: (offset, window_end) in aankomstvolgorde; offset 103 hoort bij een open venster, dus de commit stopt daar, ook al is offset 104 al gefinaliseerd. Crash tussen upsert en commit: venster 10:05–10:10 wordt geüpsert met count 412, het proces valt om, de broker levert opnieuw, de processor herberekent dezelfde count en de upsert op de primary key vervangt de rij in plaats van erbij op te tellen.",
      "Eerst wegschrijven, dan pas afvinken, en een schrijfsleutel die gelijk is aan de venstersleutel: dubbeltellen kan niet.",
    ),
    proof: {
      test: "test_duplicate_delivery_does_not_double_count_in_real_postgres",
      body: "past hetzelfde gefinaliseerde venster twee keer toe tegen de échte database en controleert dat er één rij staat, met de oorspronkelijke count.",
    },
  },
  measured: {
    title: "Gemeten",
    intro: "Gemeten op een MacBook Pro uit 2019 met de hele stack in Docker Desktop, landelijke feed, geen filter op vervoerder. make throughput haalt deze cijfers rechtstreeks uit Prometheus.",
    tableCaption: "Maandagochtendspits 08:15–09:15",
    rows: [
      ["Berichten in, gemiddeld", "176 per seconde (piekminuut 347)"],
      ["Voertuigen in de feed per poll", "3.625; 45% ongewijzigd en dus niet doorgestuurd"],
      ["Vensters vastgesteld", "2.739 per vijf minuten, 6.994 tegelijk open"],
      ["Watermark lag", "170 seconden — 120 s toegestane vertraging plus ~50 s feedcadans"],
      ["Achterstand (consumer lag)", "p50 nul; maximaal 3.806 direct na een herstart, binnen een minuut ingelopen"],
      ["Batchverwerking p95", "0,18 s voor een batch van 2.000 berichten, inclusief de state-upserts"],
      ["Ruw archief", "718 objecten, 30 MB gzip per uur in de spits; ~1 MB/uur 's nachts"],
    ],
  },
  underneath: {
    title: "Hoe het eronder werkt",
    body: [
      "De keten loopt van links naar rechts. Een producer haalt de twee feeds op en publiceert ze naar Kafka (Redpanda). Twee onafhankelijke afnemers lezen mee: de ene rekent de vensters uit en schrijft naar Postgres, de andere schrijft de ruwe bytes naar het archief in MinIO. Valt het archief even weg, dan lopen de cijfers gewoon door, en andersom.",
      "Een sidecar laadt dagelijks de statische GTFS-referentiedata in stagingtabellen die in één transactie worden omgewisseld, zodat lezers nooit een half geladen set zien. Het dashboard staat op Postgres; Prometheus meet alle onderdelen.",
    ],
    figure: diagram(
      "ov-1-architectuur",
      "Architectuurdiagram: OVapi GTFS-RT (vehiclePositions elke 20 s, tripUpdates elke 60 s) → producer (protobuf parsen, snapshot diffen, heartbeat, backoff) → Redpanda met de topics vehicle_positions en arrival_predictions (6 partities) en twee DLQ-topics, retentie 24 uur. Twee consumergroepen: de processor (tumbling windows van 5 min, per-partitie watermarks, 2 min toegestane vertraging, count/mean/P90/max/min over lijn, station, vervoerder en netwerk) schrijft met idempotente upserts naar Postgres; de archiver schrijft ruwe bytes als gzip JSON-lines naar MinIO. Een gtfs-static sidecar laadt dagelijks de referentiedata via COPY en een atomische swap. Het Streamlit-dashboard leest Postgres; Prometheus scrapet alles; replay draait archiefbestanden door dezelfde Pipeline-klasse.",
      "De keten van links naar rechts: twee feeds in, twee afnemers, één tabel waar het dashboard uit leest.",
    ),
    items: [
      {
        title: "Alleen wijzigingen gaan door",
        body: "De feed stuurt elke minuut het volledige beeld opnieuw; rechtstreeks doorzetten geeft zo'n 700 berichten per seconde die grotendeels herhaling zijn. Elke meting wordt daarom vergeleken met de vorige. In de ochtendspits valt zo ongeveer 45% weg: vijf tot twintig keer minder berichten, met identieke venstercijfers.",
      },
      {
        title: "Het archief bewaart ruwe bytes",
        body: "Kafka is hier een buffer van 24 uur, geen archief. Wat je over een maand nog nodig hebt staat in MinIO, onbewerkt. Daardoor kun je er later een nieuwe leesregel overheen draaien; had ik de al geïnterpreteerde gegevens opgeslagen, dan lag de interpretatie van toen voor altijd vast.",
      },
      {
        title: "Een nieuw berichtformaat breekt niets",
        body: "Elk bericht draagt een versienummer, en de verwerking leest de huidige én de vorige versie, zodat beide kanten los van elkaar kunnen worden bijgewerkt. Een onbekende versie crasht niet maar gaat opzij, net als elk ander onleesbaar record.",
      },
    ],
  },
  shows: {
    title: "Wat dit project laat zien",
    skills: [
      "Metriekdefinities: vensters, dimensies, P90",
      "Dashboards in Streamlit en Grafana",
      "Datakwaliteit en opzijgezette records",
      "SQL en Postgres",
      "Herberekenbare cijfers zonder dubbeltellingen",
      "Testen tegen handberekende waarden",
      "Python",
      "Kafka (Redpanda)",
      "Docker Compose",
    ],
    closing: "Of korter: cijfers waarvan ik kan uitleggen waarom ze kloppen, ook nadat er iets is omgevallen.",
  },
};

const en: PageContent = {
  eyebrow: "Own project · 3 weeks",
  title: "Real-time delay metrics for Dutch public transport",
  lead: "Delays in Dutch public transport, summarised every five minutes per line, stop, operator and network — on a live map of the whole country, with the evidence for why those figures hold.",
  intro: [
    "Two files on an open endpoint contain, every minute, where roughly 4,900 vehicles are and how late they are. Turning that into a dashboard is an afternoon's work. Turning it into figures that keep coming 24 hours a day, are still right after a crash, don't silently lose broken records, and let you recompute an hour from the past — that is a different project.",
    "This is that second project. Fixed definitions for the delay figures, stored per window in Postgres, with a live Streamlit dashboard on top and a Grafana dashboard that shows the state of the data supply. Underneath runs a streaming pipeline on Kafka with a raw archive you can recompute from. Thirteen containers, one make up, no accounts and no keys.",
  ],
  facts: [
    "Postgres",
    "Streamlit + pydeck",
    "Prometheus + Grafana",
    "Python 3.12",
    "Kafka (Redpanda)",
    "MinIO",
    "Docker Compose",
  ],
  stats: [
    { label: "Windows", value: "5 min · 4 dimensions" },
    { label: "Dashboards", value: "Live map + Grafana" },
    { label: "Morning rush", value: "176 messages/s" },
    { label: "Tests", value: "106, no infra" },
  ],
  ui: {
    repo: "View the code on GitHub",
    allProjects: "All projects",
    back: "Back to projects",
    dataSource: "Data source",
    dataSourceName: "OVapi GTFS-realtime, open access without a key",
    links: "Links",
  },
  hero: shot(
    "dashboard",
    1000,
    "The live NL OV Delay Monitor dashboard in the morning rush: six KPI tiles (4,616 vehicles live, 6,628 trips with a prediction, mean delay +1:01, P90 +2:40, 70% on time, worst line +60:00), a map of the Netherlands with thousands of coloured vehicle positions, and on the right a table of the worst lines in the last window.",
    "The dashboard on a Monday morning at 08:24: 4,616 vehicles on the map, the KPIs of the last closed window and that window's worst lines. Interface labels are in English; diagrams on this page are in Dutch.",
  ),
  why: {
    title: "Why this project",
    body: [
      "Putting a delay figure on a dashboard is the easy part. The interesting things only happen once real time is involved: measurements arriving late, a process falling over between two writes, a feed that doesn't follow its own documentation. Each of those can make a figure wrong without the dashboard looking any different.",
      "I wanted to run into those things instead of reading about them. A nationwide, public, always-on data source forces that — and produces something you can show at the same time.",
    ],
  },
  definitions: {
    title: "What is measured",
    body: [
      "The delay comes from the trip predictions in the feed; the vehicle positions themselves carry no delay. Those delays are summarised in fixed five-minute windows (10:00–10:05, 10:05–10:10 and so on) over four dimensions at once: line, stop, operator and network.",
      "Each window has five figures: the number of observations, the mean, the exact P90, the maximum and the minimum.",
      "Every closed window is one row in Postgres, in the table delay_aggregates, keyed on (window_start, dimension, dimension_id). The dashboard reads that table, and the same figures per line, stop, operator or network can be queried with plain SQL.",
    ],
    choicesTitle: "Four choices in the definition",
    choices: [
      {
        title: "Exact P90 instead of an estimate",
        body: "With a few thousand observations per window per key, an exact calculation (nearest-rank) costs nothing, and it makes a test against a window computed by hand possible. At real scale this is the part you'd replace, for instance with a t-digest.",
      },
      {
        title: "Each dimension separately, not derived",
        body: "You can't derive the network P90 from the per-line P90s. So the four dimensions are each tracked separately; that costs next to nothing extra.",
      },
      {
        title: "A standing delay keeps counting",
        body: "Only changes relative to the previous measurement are passed on. To stop a train that has been sitting at +5:00 for twenty minutes from disappearing from the statistics, a heartbeat goes out every sixty seconds.",
      },
      {
        title: "What “late” means",
        body: "A window is settled exactly once. Anything more than two minutes behind no longer counts towards it, but is counted as late. In practice that number is zero, because the time of a measurement is the feed's own generation time and it only increases.",
      },
    ],
  },
  dashboards: {
    title: "The dashboards",
    body: [
      "The live dashboard, built in Streamlit, reads straight from Postgres. At the top are six KPI tiles for the last closed window: vehicles live, trips with a prediction, mean delay, P90, percentage on time and the worst line. Below that, the map with every vehicle position and that window's worst lines.",
      "The detail panels show network delay over the last three hours in five-minute windows, mean delay per operator and the distribution of current delay across active trips. At the very bottom is a health strip with the figures about the data supply itself: messages per second in and processed, backlog, late events and records set aside per hour. Whoever looks at the delay figures sees, on the same page, the state of the data underneath.",
      "The Grafana dashboard goes one level deeper, with 26 panels: throughput, backlog and processing time, correctness (records set aside, late events, windows) and state and archive.",
    ],
    screenshots: [
      shot(
        "dashboard-detail",
        1000,
        "Lower half of the dashboard: a chart of network delay over the last three hours in five-minute windows (P90 around 2.5 minutes, mean around 1 minute), a bar chart of mean delay per operator, a histogram of current delay across active trips, and a health strip with messages per second in and processed, consumer lag, watermark lag, windows per hour, late events, DLQ per hour and archive objects per hour.",
        "The detail panels: network trend in five-minute windows, delay per operator, distribution across active trips and the health strip with the pipeline figures.",
      ),
      shot(
        "dashboard-night",
        1000,
        "The same dashboard at 00:40 at night: 535 vehicles live, 1,001 trips with a prediction, mean delay +0:48, 78% on time; the map is largely empty with vehicles around the big cities, and the worst-lines table shows night buses.",
        "At 00:40 at night: 535 vehicles instead of 4,600. The dashboard shows the emptiness instead of faking movement.",
      ),
    ],
    grafana: shot(
      "grafana",
      1400,
      "The provisioned Grafana dashboard over the last three hours: tiles at the top for messages in and processed per second (142.5), consumer lag 0, watermark lag 3 minutes, DLQ per hour and late events 0; below, rows with throughput per topic and per consumer, feed entities per poll, consumer lag per partition, watermark lag, processing time p95, dead-letter rate, late and duplicate events, windows finalised per five minutes, open windows, snapshot-differ keys and archive objects per hour.",
      "The Grafana dashboard with 26 panels: throughput, lag and latency, correctness (DLQ, lateness, windows) and state and archive.",
    ),
  },
  quality: {
    title: "What the data really looks like",
    body: [
      "The feed doesn't follow its own documentation. What's listed below isn't described anywhere; it comes straight from the data.",
    ],
    quirksTitle: "What the feed doesn't document",
    quirks: [
      "Entity ids like 2026-09-06:GVB:13:13605 contain the operator code, which appears nowhere else in the message — so it's taken from the id.",
      "The vehicle position carries no delay; that lives in the trip prediction.",
      "Ghost vehicles roam the feed: a bus STOPPED_AT the same spot for eleven days, and one vehicle reporting from 29 minutes in the future.",
      "Positions older than ten minutes or more than a minute ahead are dropped.",
    ],
    quirksNote: "All of those cases are captured in recorded feed files in the repo: 140 KB that pins every parser test to reality.",
    notesTitle: "What you only see once it actually runs through a night",
    notes: [
      {
        title: "Rush hour and night differ by a factor of a hundred",
        body: "At half past eleven at night it's 50 to 110 messages per second and 1,400 vehicles; at four in the morning two messages per second and twenty buses — and the dashboard says so honestly instead of faking movement.",
      },
      {
        title: "Even when the country goes quiet, the last window has to close",
        body: "Between 01:00 and 05:00 there are twenty to thirty night buses running. Without intervention the last window is never settled, because no measurement arrives to push time forward. So after ninety seconds of silence the processing moves on by the wall clock.",
      },
      {
        title: "A sleeping laptop is not an outage",
        body: "But it looks exactly like one in Grafana: macOS wakes up for 45 seconds of maintenance every hour, which produces one tall spike per hour and a watermark lag of half an hour. make keep-awake is in the runbook now.",
      },
      {
        title: "Broken records are set aside, not lost",
        body: "Anything unreadable — a vehicle without a position, without a trip id, coordinates at 0,0 — goes to a separate queue (dead-letter queue) with the original bytes and the reason for the error, and doesn't block the rest. The feed sends the same broken entity again every minute, so each combination of entity and reason is set aside once. Within ten seconds such a record shows on the Grafana panel and in the health strip; after a fix it can be offered again.",
      },
    ],
  },
  incidents: {
    title: "Twice, a figure was silently wrong",
    body: [
      "Both times good measurements were labelled “late” and dropped, so windows rested on fewer observations than there were. The concept behind it is the watermark: the clock that says how far the data has got, and therefore which windows may close.",
      "Late events don't vanish quietly: they are counted, and that counter is on the Grafana dashboard and in the health strip.",
    ],
    items: [
      {
        title: "169,000 events gone after a catch-up",
        body: "The first version had one clock for everything: the newest measurement received. That worked fine until a forty-minute catch-up came along. The stream's six partitions were read at different speeds, the fastest pulled the clock ahead, and 169,000 perfectly normal events from the slower partitions counted as late. Now every partition has its own clock and the slowest one rules; a partition that sends nothing for 120 seconds is left out, otherwise no window would ever close again.",
      },
      {
        title: "130,000 events gone because of a clock in the future",
        body: "At startup the clock is set to the last window already in Postgres, so that redelivered messages don't write a partial window over a complete one. Once, a recomputation that was still running set that clock into the future, after which 130,000 good events were dropped. Since then that starting value is capped at the wall clock.",
      },
    ],
    figure: diagram(
      "ov-2-vensters-watermarks",
      "Watermark diagram (labels in Dutch): six partitions each with their maximum event time; the slowest (p2, 10:12:40) sets the minimum, a partition silent for 130 s is left out; min minus 120 s allowed lateness gives watermark 10:10:40. On the event-time axis the windows 10:00–10:05 and 10:05–10:10 are finalised, 10:10–10:15 and 10:15–10:20 are open. An event with event time 10:07 arriving now is late: counted and dropped.",
      "The watermark comes from the slowest active partition, not the fastest. A window closes as soon as the watermark reaches its end. Diagram labels are in Dutch.",
    ),
  },
  trust: {
    title: "Why the figures hold",
    body: [
      "Three properties I steered towards deliberately, because a figure you can't recompute isn't worth much.",
    ],
    items: [
      {
        title: "Reprocessing doesn't double count",
        body: "A window is written to Postgres first; only then is it recorded how far the stream has been read. If the process dies in between, the same messages come in again, the same window is recomputed from the same events and written under the same key. The row is replaced; nothing is added to it.",
      },
      {
        title: "A time range can be recomputed",
        body: "All raw messages also go to an archive. make replay FROM=… TO=… recomputes a time range from it, through the same code as the live processing: there is no second version of the calculation rules. Measured: 122,364 archived messages from twelve minutes of morning rush, recomputed into 11,323 windows in about ten seconds.",
      },
      {
        title: "Tested against a hand-computed window",
        body: "106 unit tests run without infrastructure, including the parser against recorded feeds (one of mixed quality and one of pure nonsense among them), a window computed by hand and the dashboard's SQL invariants. The integration tests run the dashboard queries and the duplicate-delivery test against real Postgres.",
      },
    ],
    figure: diagram(
      "ov-3-at-least-once",
      "Diagram in three parts (labels in Dutch). The order: poll batch, decode and count, update the watermark, UPSERT finalised windows into Postgres, release the ledger, and only then COMMIT the offsets — step 4 before step 6, always. The per-partition offset ledger: (offset, window_end) in arrival order; offset 103 belongs to an open window, so the commit stops there even though offset 104 is already finalised. Crash between upsert and commit: window 10:05–10:10 is upserted with count 412, the process dies, the broker redelivers, the processor recomputes the same count and the upsert on the primary key replaces the row instead of adding to it.",
      "Write first, tick off afterwards, and a write key equal to the window key: double counting is impossible. Diagram labels are in Dutch.",
    ),
    proof: {
      test: "test_duplicate_delivery_does_not_double_count_in_real_postgres",
      body: "applies the same finalised window twice against the real database and checks that there is one row, with the original count.",
    },
  },
  measured: {
    title: "Measured",
    intro: "Measured on a 2019 MacBook Pro with the whole stack in Docker Desktop, nationwide feed, no operator filter. make throughput pulls these figures straight from Prometheus.",
    tableCaption: "Monday morning rush 08:15–09:15",
    rows: [
      ["Messages in, average", "176 per second (peak minute 347)"],
      ["Vehicles in the feed per poll", "3,625; 45% unchanged and therefore not passed on"],
      ["Windows settled", "2,739 per five minutes, 6,994 open at once"],
      ["Watermark lag", "170 seconds — 120 s allowed lateness plus ~50 s feed cadence"],
      ["Backlog (consumer lag)", "p50 zero; at most 3,806 right after a restart, caught up within a minute"],
      ["Batch processing p95", "0.18 s for a batch of 2,000 messages, including the state upserts"],
      ["Raw archive", "718 objects, 30 MB gzip per hour in the rush; ~1 MB/hour at night"],
    ],
  },
  underneath: {
    title: "How it works underneath",
    body: [
      "The chain runs from left to right. A producer fetches the two feeds and publishes them to Kafka (Redpanda). Two independent consumers read along: one computes the windows and writes to Postgres, the other writes the raw bytes to the archive in MinIO. If the archive is briefly gone, the figures keep coming, and the other way round.",
      "A sidecar loads the static GTFS reference data daily into staging tables that are swapped in a single transaction, so readers never see a half-loaded set. The dashboard sits on Postgres; Prometheus measures every component.",
    ],
    figure: diagram(
      "ov-1-architectuur",
      "Architecture diagram (labels in Dutch): OVapi GTFS-RT (vehiclePositions every 20 s, tripUpdates every 60 s) → producer (parse protobuf, diff snapshots, heartbeat, backoff) → Redpanda with the topics vehicle_positions and arrival_predictions (6 partitions) and two DLQ topics, 24-hour retention. Two consumer groups: the processor (5-minute tumbling windows, per-partition watermarks, 2 minutes allowed lateness, count/mean/P90/max/min over line, stop, operator and network) writes to Postgres with idempotent upserts; the archiver writes raw bytes as gzip JSON lines to MinIO. A gtfs-static sidecar loads the reference data daily via COPY and an atomic swap. The Streamlit dashboard reads Postgres; Prometheus scrapes everything; replay runs archive files through the same Pipeline class.",
      "The chain from left to right: two feeds in, two consumers, one table the dashboard reads from. Diagram labels are in Dutch.",
    ),
    items: [
      {
        title: "Only changes are passed on",
        body: "The feed sends the complete picture again every minute; passing that on directly gives around 700 messages per second that are mostly repetition. So each measurement is compared with the previous one. In the morning rush about 45% drops out that way: five to twenty times fewer messages, with identical window figures.",
      },
      {
        title: "The archive keeps raw bytes",
        body: "Kafka is a 24-hour buffer here, not an archive. What you still need a month from now lives in MinIO, unprocessed. That lets you run a new reading rule over it later; had I stored the already interpreted data, that day's interpretation would have been frozen forever.",
      },
      {
        title: "A new message format breaks nothing",
        body: "Every message carries a version number, and the processing reads the current and the previous version, so both sides can be updated independently. An unknown version doesn't crash but is set aside, like any other unreadable record.",
      },
    ],
  },
  shows: {
    title: "What this project shows",
    skills: [
      "Metric definitions: windows, dimensions, P90",
      "Dashboards in Streamlit and Grafana",
      "Data quality and records set aside",
      "SQL and Postgres",
      "Recomputable figures without double counting",
      "Testing against hand-computed values",
      "Python",
      "Kafka (Redpanda)",
      "Docker Compose",
    ],
    closing: "Or shorter: figures where I can explain why they are right, even after something has fallen over.",
  },
};

export const CONTENT: Record<Locale, PageContent> = { nl, en };
