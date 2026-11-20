import type { Locale } from "@/i18n/routing";
import type { Callout, Figure, TitledItem } from "@/components/ProjectPageKit";

// Copy for the bespoke open-data-warehouse page (repo: nl-vehicle-warehouse).
// The listing on /projects, the sitemap and llms-full.txt still read the
// project's MDX frontmatter and prose; this module only feeds the custom
// detail page. Diagrams are exported from projects/open-data-warehouse/
// (see scripts/drawio-export.mjs).
//
// The page leads with the analytical story (questions, model, SCD2, Power BI,
// limits, data quality); the pipeline that feeds the model comes last.

export const SLUG = "open-data-warehouse";
export const ACCENT = "#F97316";
export const REPO_URL = "https://github.com/datavakwerk/nl-vehicle-warehouse";
const IMG = "/images/projects/open-data-warehouse";

export interface CodeItem {
  code: string;
  title: string;
  body: string;
}

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
    sources: string;
    docs: string;
  };
  /** The star schema, shown in the hero. */
  hero: Figure;
  why: { title: string; body: string[] };
  questions: {
    title: string;
    intro: string;
    items: TitledItem[];
    sourcesTitle: string;
    sourcesBody: string[];
    columns: string[];
    rows: string[][];
  };
  model: { title: string; body: string[]; tablesTitle: string; tables: CodeItem[]; quote: string };
  scd2: {
    title: string;
    body: string[];
    callouts: Callout[];
    figure: Figure;
    testsTitle: string;
    tests: string[];
    testsNote: string;
  };
  powerbi: { title: string; body: string[]; choicesTitle: string; choices: string[]; quote: string };
  limits: { title: string; body: string[]; quote: string };
  quality: { title: string; body: string[]; columns: string[]; rows: string[][]; figure: Figure; after: string[] };
  consistency: {
    title: string;
    body: string[];
    callouts: Callout[];
    resultTitle: string;
    results: string[];
    resultNote: string;
  };
  pipeline: { title: string; body: string[]; figure: Figure; partsTitle: string; parts: TitledItem[]; after: string[] };
  shows: { title: string; skills: string[]; closing: string };
}

const DIAGRAM_DIMS = {
  "nl-vehicle-warehouse-1-architectuur": { width: 1534, height: 652 },
  "nl-vehicle-warehouse-2-sterschema": { width: 1293, height: 940 },
  "nl-vehicle-warehouse-3-scd2": { width: 1342, height: 631 },
  "nl-vehicle-warehouse-4-lineage": { width: 1390, height: 841 },
} as const;

function diagram(name: keyof typeof DIAGRAM_DIMS, alt: string, caption: string): Figure {
  // The architecture diagram carries the most detail, so it is rendered by
  // draw.io's own viewer (zoom, pan, lightbox) from the .drawio source in
  // public/diagrams; the others stay a flat SVG that links to its full size.
  const drawioSrc = name.endsWith("-architectuur") ? `/diagrams/${name}.drawio` : undefined;
  return { kind: "diagram", src: `${IMG}/${name}.svg`, ...DIAGRAM_DIMS[name], alt, caption, drawioSrc };
}

const nl: PageContent = {
  eyebrow: "Eigen project · datamodellering en BI",
  title: "Open-data-warehouse: een sterschema en Power BI-rapport op RDW en CBS",
  lead: "Een dimensioneel model op Nederlandse open data, met een Power BI-rapport dat er rechtstreeks op staat. De grain is per feit vastgelegd, de DAX-measures zijn nagelopen tegen het warehouse en de beperkingen staan opgeschreven.",
  intro: [
    "Twee publieke bronnen, één model. RDW-voertuigdata levert feiten op recordniveau, CBS StatLine levert een periodieke snapshot per gemeente. Die twee samenbrengen in één dimensioneel model klinkt eenvoudig, tot je merkt dat ze een verschillende grain hebben, dat Nederland bijna elk jaar herindeelt, en dat de bron zich niet aan zijn eigen schema houdt.",
    "Dit project is de uitwerking daarvan: een Kimball-sterschema met de grain per feit vastgelegd, een gemeentedimensie met historie (SCD type 2), datakwaliteitstests op sleutels, relaties en grain, en een Power BI-rapport waarvan het semantisch model het schema spiegelt. De data komt binnen via Python en wordt gemodelleerd in SQL met dbt. Elke keuze staat gedocumenteerd, ook wat niet kon.",
  ],
  facts: ["Kimball-sterschema", "SQL", "Power BI", "DAX", "dbt", "Datakwaliteitstests", "DuckDB", "Python", "GitHub Actions"],
  stats: [
    { label: "Sterschema", value: "2 feiten · 5 dimensies · 1 bridge" },
    { label: "Power BI", value: "3 vragen, rechtstreeks op het sterschema" },
    { label: "Datakwaliteit", value: "Tests op sleutels, relaties en grain" },
    { label: "Standaardrun", value: "2,8 miljoen rijen" },
  ],
  ui: {
    repo: "Bekijk de code op GitHub",
    allProjects: "Alle projecten",
    back: "Terug naar projecten",
    sources: "Bronnen: RDW open data (opendata.rdw.nl) en CBS StatLine (opendata.cbs.nl). Beide zonder API-sleutel te bevragen.",
    docs: "De documentatie van de data en de steekproefopzet staat in docs/data.md in de repository.",
  },
  hero: diagram(
    "nl-vehicle-warehouse-2-sterschema",
    "Het sterschema: twee feiten met een verschillende grain in één model. fct_gebrek_constatering is een transactiefeit met grain één geconstateerd gebrek per keuring per voertuig en maat aantal_gebreken = 1; eraan hangen dim_voertuig (SCD type 1, kenteken en typekenmerken), dim_gebrek (SCD type 1, RDW-gebrekcode, omschrijving en geldigheidsperiode) en dim_datum via meld_datum_key. dim_voertuig hangt via bridge_voertuig_brandstof (12.671 voertuigen hebben meer dan één brandstof — voorkomt dubbeltellen) aan dim_brandstof. fct_voertuigpark_gemeente is een periodieke snapshot met grain één gemeente per peiljaar per voertuigsoort en maat aantal; eraan hangen dim_gemeente (SCD type 2 met geldig_van en geldig_tot, via een temporele join op gemeente_key) en dim_datum via peildatum_key. dim_datum is gegenereerd, bevat NL-feestdagen en kwartaal- en weeknummers, en wordt door beide feiten gedeeld als conformed dimension.",
    "Twee feiten met een verschillende grain, verbonden door dim_datum als gedeelde dimensie.",
  ),
  why: {
    title: "Waarom dit project",
    body: [
      "Portfolioprojecten met data blijven vaak steken bij “een CSV inlezen en een grafiek maken”. Wat een rapport betrouwbaar maakt zit ergens anders: in de keuzes die je maakt vóórdat er een dashboard is. Op welke grain staat een feit. Wat doe je met een dimensie die verandert. Hoe zorg je dat een collega dezelfde cijfers krijgt als jij.",
      "Ik wilde een project waarin die keuzes zichtbaar zijn en verdedigd worden, niet weggepoetst. Elke ontwerpkeuze staat in de repository gedocumenteerd, inclusief de dingen die niet konden.",
    ],
  },
  questions: {
    title: "De vragen die het rapport beantwoordt",
    intro: "Het Power BI-rapport beantwoordt drie vragen, rechtstreeks op het sterschema.",
    items: [
      {
        title: "Het voertuigpark per gemeente en peiljaar",
        body: "Inclusief heringedeelde gemeenten: een cijfer van 2016 staat bij de gemeente zoals die toen heette, dankzij de SCD2-dimensie.",
      },
      {
        title: "De top-gebreken per voertuigsoort en bouwjaar",
        body: "Met een slicer op energiedrager, die dankzij de bridge niet dubbel telt bij voertuigen met meer dan één brandstof.",
      },
      {
        title: "De aansluiting tussen RDW-steekproef en CBS-park",
        body: "Hoe verhoudt de steekproef uit de RDW-sets zich tot het volledige park dat CBS per gemeente rapporteert.",
      },
    ],
    sourcesTitle: "Twee bronnen, twee grains",
    sourcesBody: [
      "De combinatie is bewust gekozen. Twee feiten met een verschillende grain in één schema is precies waar dimensioneel modelleren over gaat — en waar het misgaat als je de grain niet expliciet maakt.",
      "Beide bronnen zijn zonder API-sleutel te bevragen; iedereen kan elk cijfer op deze pagina zelf nalopen.",
    ],
    columns: ["Bron", "Wat", "Rol in het model"],
    rows: [
      ["RDW open data (Socrata)", "gekentekende voertuigen, brandstof, geconstateerde gebreken, gebrekcodes", "transactiefeiten op recordniveau"],
      ["CBS StatLine (odata)", "motorvoertuigenpark per gemeente en de gemeentelijke indeling per jaar", "snapshotfeit + gemeentedimensie"],
    ],
  },
  model: {
    title: "Het model: grain eerst",
    body: [
      "Het sterschema bovenaan deze pagina telt twee feiten, vijf dimensies en één bridge. Per feittabel staat de grain expliciet in de documentatie — één zin, geen interpretatie mogelijk. Elke dimensie hangt aan de feiten via een surrogaatsleutel; degenerate dimensies (kenteken, melddatum, gebrek-identificatie, voertuigsoort) blijven in de feittabel staan, zodat de graintest erop kan draaien.",
    ],
    tablesTitle: "Vier tabellen die het model dragen",
    tables: [
      {
        code: "fct_gebrek_constatering",
        title: "Eén geconstateerd gebrek per keuring per voertuig",
        body: "Daardoor is gebreken tellen gewoon count(*). De bronkolom met het keuringtotaal is bewust weggelaten: die herhaalt hetzelfde getal op elke regel van dezelfde keuring, en een sum() daarover telt dubbel.",
      },
      {
        code: "fct_voertuigpark_gemeente",
        title: "Eén gemeente per peiljaar per voertuigsoort",
        body: "Een periodieke snapshot naast een transactiefeit, met dim_datum als gedeelde dimensie. De gemeentesleutel komt uit een temporele join op de SCD2-dimensie: het cijfer hangt aan de gemeente zoals die tóen heette.",
      },
      {
        code: "bridge_voertuig_brandstof",
        title: "12.671 voertuigen met meer dan één brandstof",
        body: "Zonder brugtabel tel je die dubbel zodra iemand filtert op energiedrager. In Power BI staat diezelfde bridge als many-to-many met één bidirectioneel kruisfilter, zodat het rapport zich net zo gedraagt als het warehouse.",
      },
      {
        code: "dim_datum",
        title: "Gegenereerd, met NL-feestdagen",
        body: "Kwartaal- en weeknummers, Nederlandse feestdagen, geen bron nodig. Als conformed dimension is het de enige tabel die beide feiten delen — en dus de as waarlangs je ze naast elkaar legt.",
      },
    ],
    quote: "Het keuringtotaal per regel herhalen en er dan een sum() overheen doen — dat is het soort fout dat niemand opmerkt tot een stuurgroep vraagt waarom een getal niet klopt.",
  },
  scd2: {
    title: "Waarom de gemeentedimensie SCD type 2 is",
    body: [
      "Nederland ging van 393 gemeenten in 2015 naar 342 in 2026. Het verschil tussen twee CBS-gebiedsbestanden ís de herindeling die je moet vastleggen.",
      "Zonder een dimensie met geldigheidsperioden hangt het cijfer van 2016 aan de gemeente zoals die vandaag heet. Historische stuurinformatie verschuift dan met terugwerkende kracht, en er komt geen foutmelding — de query draait gewoon door. Dat is de stille variant van een datafout, en de vervelendste.",
      "De dimensie wordt opgebouwd met een lag() over peiljaar per gemeentecode: elke naamswijziging markeert een nieuwe versie, en de lopende som over die markeringen is het versienummer. Het feit joint niet op code alleen, maar op code én peildatum binnen de geldigheidsperiode.",
    ],
    callouts: [
      { value: "393 → 342", label: "gemeenten tussen 2015 en 2026; elk verschil tussen twee jaren is een herindeling" },
      { value: "12", label: "CBS-gebiedsbestanden, één per peiljaar, waaruit de versies worden afgeleid" },
      { value: "3", label: "eigen tests die de geldigheidsperioden bewaken" },
    ],
    figure: diagram(
      "nl-vehicle-warehouse-3-scd2",
      "SCD type 2: het cijfer hangt aan de gemeente van tóen. Links de bron, CBS Gebieden in Nederland, één bestand per peiljaar van 2015 tot en met 2026: 2015 393 gemeenten, 2018 380 (+3/−11), 2019 355 (+9/−34), 2023 342 (+1/−4); het verschil tussen twee jaren is de herindeling. In het midden dim_gemeente als SCD type 2 met gemeente_key, naam, geldig_van en geldig_tot: versie 1 Haaren 2015-01-01 tot 2020-12-31, versie 2 Oisterwijk 2021-01-01 tot 9999-12-31; opgebouwd met lag() over peiljaar per gemeente_code, met eigen tests op aaneengesloten, niet-overlappende perioden en hoogstens één actuele versie. Rechts fct_voertuigpark_gemeente met peiljaar 2016 (valt in versie 1) en peiljaar 2023 (valt in versie 2): elke feitrij krijgt de surrogaatsleutel van de versie die op 1 januari van dat peiljaar geldig was. Onderaan de temporele join: on gemeente_code = gemeente_code and make_date(peiljaar,1,1) between geldig_van and geldig_tot. Zonder type 2 zou het cijfer van 2016 aan de huidige gemeente hangen.",
      "Haaren ging in 2021 op in Oisterwijk: het cijfer van 2016 blijft aan versie 1 hangen, dat van 2023 aan versie 2.",
    ),
    testsTitle: "Drie eigen tests bewaken de dimensie",
    tests: [
      "De perioden per gemeentecode zijn aaneengesloten: geldig_tot van de ene versie sluit aan op geldig_van van de volgende.",
      "De perioden overlappen elkaar niet: een peildatum valt in hoogstens één versie.",
      "Er bestaat hoogstens één actuele versie per gemeente.",
    ],
    testsNote: "De temporele join is de enige plek waar het feit de dimensie raakt; als deze drie tests groen zijn, is die join eenduidig.",
  },
  powerbi: {
    title: "Het semantisch model in Power BI",
    body: [
      "Het semantisch model spiegelt het schema en repareert het niet. Power BI staat op het sterschema, niet op de bron: wat in het warehouse is vastgelegd, wordt in het rapport niet opnieuw bedacht.",
    ],
    choicesTitle: "Vier keuzes in het semantisch model",
    choices: [
      "Relaties staan 1:* van dimensie naar feit, met enkelzijdig kruisfilter.",
      "De SCD2-dimensie hangt via de surrogaatsleutel aan het feit, zodat de temporele join uit het warehouse behouden blijft.",
      "De bridge tussen voertuig en brandstof staat als many-to-many met één bidirectioneel kruisfilter, zodat het rapport zich net zo gedraagt als het warehouse.",
      "De DAX-measures zijn gekruist met dbt show: elk getal in het rapport is nagelopen tegen het warehouse.",
    ],
    quote: "Een rapport dat het model omzeilt is een tweede model — en dan heb je twee waarheden.",
  },
  limits: {
    title: "Wat níet kon, en waarom dat in de documentatie staat",
    body: [
      "De beoogde grain voor het snapshotfeit was gemeente per peiljaar per brandstofsoort. Die bestaat niet bij CBS. De tabel met de brandstofsplitsing gaat niet lager dan provincie; de tabel met 728 gemeenten splitst alleen naar voertuigsoort. Gemeente × brandstof kan alleen door cijfers te verzinnen.",
      "Beide tabellen zijn opgehaald en de keuze staat uitgeschreven in de repository: het is gemeente × voertuigsoort geworden, omdat de temporele koppeling aan de SCD2-dimensie het punt van dit feit is. De ongebruikte tabel is een bewuste keuze, geen vergeten bestand.",
    ],
    quote: "Een model waarvan de beperkingen opgeschreven zijn, is bruikbaar. Een model waarvan ze niet opgeschreven zijn, wordt vroeg of laat verkeerd gebruikt.",
  },
  quality: {
    title: "Datakwaliteit: tests op sleutels, relaties en grain",
    body: [
      "Elke sleutel, elke relatie en elke graindefinitie heeft een test, en die tests draaien bij elke pull request samen met de build van de modellen. Een fout valt dus op vóór iemand op het cijfer stuurt.",
    ],
    columns: ["Stap", "Tool", "Wat het bewaakt"],
    rows: [
      ["Datakwaliteit", "dbt tests", "unique en not_null op elke sleutel, relationships van elke foreign key naar zijn dimensie, accepted_values op de referentiekolommen, plus eigen tests op de grain: geen dubbele rijen per graindefinitie"],
      ["Build", "dbt build", "modellen én tests, in afhankelijkheidsvolgorde"],
      ["Documentatie", "dbt docs generate", "lineage en kolomdocumentatie, bewaard als CI-artifact"],
      ["SQL-lint", "sqlfluff", "elk dbt-model compileert en volgt de stijlregels"],
      ["Python-lint", "ruff", "de ingestiescripts"],
    ],
    figure: diagram(
      "nl-vehicle-warehouse-4-lineage",
      "Data lineage van bron tot mart in vier lanes. Sources (data/raw/*.parquet): rdw.gekentekende_voertuigen, rdw.brandstof, rdw.gebreken (codelijst), rdw.geconstateerde_gebreken, cbs.gebieden (één bestand per peiljaar 2015-2026), cbs.70072ned (motorvoertuigen per gemeente). Staging (views, 1:1 met de bron): stg_rdw__voertuigen, stg_rdw__brandstof, stg_rdw__gebreken, stg_rdw__gebrek_constateringen (hier wordt de dubbeling uit de bron gededupt), stg_cbs__gemeenten, stg_cbs__voertuigpark_gemeente (lang formaat gepivot en gelabeld). Warehouse (tabellen, sterschema): dim_voertuig, bridge_voertuig_brandstof, dim_brandstof, dim_gebrek, fct_gebrek_constatering, dim_datum (gegenereerd, geen bron), dim_gemeente (SCD type 2, temporele join), fct_voertuigpark_gemeente. Marts: mart_gebrek_top (top-gebreken per voertuigsoort en bouwjaar), mart_rdw_cbs_aansluiting (steekproef naast het CBS-park), mart_voertuigpark_herindeling (park per gemeente en peiljaar, met herindeling). Elke pijl is een source() of ref() in de SQL.",
      "Elke pijl is een source() of ref() in de SQL; dbt docs genereert deze lineage bij elke pull request.",
    ),
    after: [
      "De lineage is geen tekening naast de code, maar wat dbt uit de source()- en ref()-aanroepen afleidt: van elk cijfer in een mart is terug te lezen uit welke brontabel het komt.",
      "De tests draaien in CI op kleine fixtures die in git staan, zodat een pull request in een paar minuten groen of rood is. Lokaal is het hetzelfde commando.",
    ],
  },
  consistency: {
    title: "Een dataset die er goed uitziet en niet klopt",
    body: [
      "De drie grote RDW-sets zijn samen ongeveer 58 miljoen rijen; de standaardrun werkt met een steekproef. Daar één steekproef uit nemen is geen probleem. Er drie uit nemen wel.",
      "De sets zijn allemaal op kenteken gesleuteld. De eerste 500.000 rijen van elke set pakken levert drie verschillende voertuigpopulaties op: de gebrekenset heeft meerdere rijen per voertuig en beslaat dus een veel smaller kentekenbereik dan de voertuigenset. Het gevolg is dat feiten naar dimensierijen wijzen die niet in de snapshot zitten, en dat geen enkele relationships-test standhoudt. Elke tabel ziet er afzonderlijk goed uit; samen kloppen ze niet.",
      "De oplossing is één bereik bepalen op de voertuigenset — gesorteerd op kenteken, positie 0 en positie 499.999 — en alle andere sets op datzelfde bereik ophalen. Het bereik is deterministisch, dus de run is reproduceerbaar zolang de bron niet wijzigt, en het gekozen bereik wordt samen met snapshotdatum, selectiequery en rijaantallen vastgelegd in een manifest dat in git staat.",
    ],
    callouts: [
      { value: "58 mln", label: "rijen in de drie grote RDW-sets samen; de standaardrun neemt er een steekproef uit" },
      { value: "1", label: "kentekenbereik, bepaald op de voertuigenset en hergebruikt voor elke andere set" },
      { value: "0", label: "weesrijen in brandstof en gebreken — controleerbaar met de relationships-tests" },
    ],
    resultTitle: "Het resultaat is te controleren",
    results: [
      "Nul weesrijen in brandstof: elke brandstofrij wijst naar een voertuig in de snapshot.",
      "Nul weesrijen in gebreken: elke geconstateerde gebrekrij wijst naar een voertuig in de snapshot.",
      "Alle 622 gebruikte gebrekcodes zijn aanwezig in de codelijst.",
    ],
    resultNote: "Dit zijn precies de relationships-tests die met drie losse snapshots faalden.",
  },
  pipeline: {
    title: "Van bron tot rapport",
    body: [
      "De keten onder het model is opzettelijk saai en lineair. Python haalt de bronnen op en schrijft ze weg als parquet, zonder iets te wijzigen. dbt typeert en hernoemt in staging/, bouwt het sterschema in warehouse/ en beantwoordt de businessvragen in marts/. Power BI staat op het sterschema.",
    ],
    figure: diagram(
      "nl-vehicle-warehouse-1-architectuur",
      "Architectuur van nl-vehicle-warehouse in vijf kolommen: bronnen (RDW open data via de Socrata API, vier datasets: voertuigen, brandstof, gebreken, gebrekcodes; CBS StatLine via odata: 70072ned, 85237NED en Gebieden 2015-2026), ingestie in Python (rdw.py met offset-paginatie van 50.000 per pagina, cbs.py met paginatie via @odata.nextLink, common.py met retries, batches, alles als string en de kolomlijst uit de datasetmetadata; één kentekenbereik voor alle RDW-sets), data/raw/ (23 parquet-bestanden, 2,8 miljoen rijen, circa 47 MB zstd, letterlijke kopie van de bron, niet in git; _manifest.json met snapshotdatum, selectiequery, kentekenbereik en rijaantallen, wél in git), dbt op DuckDB (staging als views 1:1 met de bron; warehouse als tabellen met 2 feiten, 5 dimensies en 1 bridge; marts als tabellen) en gebruik (Power BI op het sterschema, dbt docs als CI-artifact, exports als parquet). Onderaan de kwaliteits- en CI-strook: ruff, sqlfluff, dbt build, datakwaliteitstests en dbt docs generate, bij elke pull request op kleine fixtures.",
      "Van twee open bronnen naar een sterschema en een rapport — elke stap in versiebeheer en getest in CI.",
    ),
    partsTitle: "Drie keuzes die de cijfers navolgbaar houden",
    parts: [
      {
        title: "Raw is een letterlijke kopie",
        body: "De ingestie wijzigt niets: alles wordt als string ingelezen, zonder hernoeming of filter. Typeren hoort in dbt, waar het getest wordt. Alles wat het warehouse anders maakt dan de bron, staat in een model dat te lezen en te reviewen is.",
      },
      {
        title: "Drie lagen met elk één taak",
        body: "staging/ is 1:1 met de bron: typeren, hernoemen, ontdubbelen, CBS pivotten. warehouse/ is het Kimball-sterschema. marts/ beantwoordt de businessvragen. Een model hoort in precies één laag, en de lineage laat zien dat dat zo is.",
      },
      {
        title: "De bron houdt zich niet aan zijn eigen schema",
        body: "Socrata laat lege velden gewoon weg, waardoor verschillende pagina's verschillende kolommen opleveren. De kolomlijst komt daarom uit de datasetmetadata. De voertuigenset lijkt 52 kolommen te hebben en heeft er 98.",
      },
    ],
    after: [
      "Het warehouse is DuckDB: nul kosten en één bestand om te reviewen. Hetzelfde dbt-project richt zich met een ander profiel op Snowflake of Databricks; buiten staging/ staat er geen DuckDB-specifieke SQL.",
    ],
  },
  shows: {
    title: "Wat dit project laat zien",
    skills: [
      "Dimensioneel modelleren volgens Kimball",
      "SCD type 2 met temporele joins",
      "Power BI op het sterschema, niet op de bron",
      "DAX-measures gecontroleerd tegen het warehouse",
      "Datakwaliteitstests op sleutels en grain",
      "Gedocumenteerde grain en beperkingen",
      "SQL met dbt: staging, sterschema, marts",
      "Reproduceerbare ingestie in Python",
      "Tests in CI op elke pull request",
    ],
    closing: "De cijfers zijn navolgbaar, de keuzes zijn opgeschreven, en iemand anders kan het draaien.",
  },
};

const en: PageContent = {
  eyebrow: "Own project · data modelling and BI",
  title: "Open data warehouse: a star schema and Power BI report on RDW and CBS",
  lead: "A dimensional model on Dutch open data, with a Power BI report that sits directly on it. The grain is stated per fact, the DAX measures are checked against the warehouse and the limitations are written down.",
  intro: [
    "Two public sources, one model. Vehicle data from the RDW (the Dutch vehicle authority) supplies record-level facts; CBS StatLine (Statistics Netherlands) supplies a periodic snapshot per municipality. Bringing those two together in one dimensional model sounds simple, until you notice that they have a different grain, that the Netherlands redraws municipal boundaries almost every year, and that the source doesn't stick to its own schema.",
    "This project works that out: a Kimball star schema with the grain stated per fact, a municipality dimension with history (SCD type 2), data-quality tests on keys, relationships and grain, and a Power BI report whose semantic model mirrors the schema. The data comes in through Python and is modelled in SQL with dbt. Every choice is documented, including what couldn't be done.",
  ],
  facts: ["Kimball star schema", "SQL", "Power BI", "DAX", "dbt", "Data-quality tests", "DuckDB", "Python", "GitHub Actions"],
  stats: [
    { label: "Star schema", value: "2 facts · 5 dimensions · 1 bridge" },
    { label: "Power BI", value: "3 questions, directly on the star schema" },
    { label: "Data quality", value: "Tests on keys, relationships and grain" },
    { label: "Default run", value: "2.8 million rows" },
  ],
  ui: {
    repo: "View the code on GitHub",
    allProjects: "All projects",
    back: "Back to projects",
    sources: "Sources: RDW open data (opendata.rdw.nl) and CBS StatLine (opendata.cbs.nl). Both can be queried without an API key.",
    docs: "The documentation of the data and the sampling approach lives in docs/data.md in the repository.",
  },
  hero: diagram(
    "nl-vehicle-warehouse-2-sterschema",
    "The star schema (labels in Dutch): two facts with a different grain in one model. fct_gebrek_constatering is a transaction fact with grain one observed defect per inspection per vehicle and measure aantal_gebreken = 1; attached are dim_voertuig (SCD type 1, plate and type attributes), dim_gebrek (SCD type 1, RDW defect code, description and validity period) and dim_datum via meld_datum_key. dim_voertuig connects through bridge_voertuig_brandstof (12,671 vehicles have more than one fuel — prevents double counting) to dim_brandstof. fct_voertuigpark_gemeente is a periodic snapshot with grain one municipality per reference year per vehicle type and measure aantal; attached are dim_gemeente (SCD type 2 with geldig_van and geldig_tot, via a temporal join on gemeente_key) and dim_datum via peildatum_key. dim_datum is generated, holds Dutch public holidays and quarter and week numbers, and is shared by both facts as a conformed dimension.",
    "Two facts with a different grain, joined by dim_datum as the shared dimension.",
  ),
  why: {
    title: "Why this project",
    body: [
      "Portfolio projects with data often stop at “read a CSV and make a chart”. What makes a report reliable sits elsewhere: in the choices you make before there is a dashboard. What grain does a fact sit on. What do you do with a dimension that changes. How do you make sure a colleague gets the same numbers you do.",
      "I wanted a project in which those choices are visible and defended, not polished away. Every design choice is documented in the repository, including the things that couldn't be done.",
    ],
  },
  questions: {
    title: "The questions the report answers",
    intro: "The Power BI report answers three questions, directly on the star schema.",
    items: [
      {
        title: "The vehicle fleet per municipality and reference year",
        body: "Including redivided municipalities: a 2016 number sits with the municipality as it was called then, thanks to the SCD2 dimension.",
      },
      {
        title: "The top defects per vehicle type and build year",
        body: "With a slicer on energy source that, thanks to the bridge, doesn't double count vehicles with more than one fuel.",
      },
      {
        title: "How the RDW sample lines up with the CBS fleet",
        body: "How the sample from the RDW sets relates to the full fleet that CBS reports per municipality.",
      },
    ],
    sourcesTitle: "Two sources, two grains",
    sourcesBody: [
      "The combination is deliberate. Two facts with a different grain in one schema is exactly what dimensional modelling is about — and where it goes wrong if you don't make the grain explicit.",
      "Both sources can be queried without an API key; anyone can check every number on this page themselves.",
    ],
    columns: ["Source", "What", "Role in the model"],
    rows: [
      ["RDW open data (Socrata)", "registered vehicles, fuel, observed defects, defect codes", "record-level transaction facts"],
      ["CBS StatLine (odata)", "motor-vehicle fleet per municipality and the municipal boundaries per year", "snapshot fact + municipality dimension"],
    ],
  },
  model: {
    title: "The model: grain first",
    body: [
      "The star schema at the top of this page has two facts, five dimensions and one bridge. For every fact table the grain is stated explicitly in the documentation — one sentence, no interpretation possible. Every dimension hangs off the facts through a surrogate key; degenerate dimensions (plate, report date, defect id, vehicle type) stay in the fact table, so the grain test can run on them.",
    ],
    tablesTitle: "Four tables that carry the model",
    tables: [
      {
        code: "fct_gebrek_constatering",
        title: "One observed defect per inspection per vehicle",
        body: "So counting defects is simply count(*). The source column with the inspection total is deliberately left out: it repeats the same number on every row of the same inspection, and a sum() over it double counts.",
      },
      {
        code: "fct_voertuigpark_gemeente",
        title: "One municipality per reference year per vehicle type",
        body: "A periodic snapshot next to a transaction fact, with dim_datum as the shared dimension. The municipality key comes from a temporal join on the SCD2 dimension: the number hangs off the municipality as it was called then.",
      },
      {
        code: "bridge_voertuig_brandstof",
        title: "12,671 vehicles with more than one fuel",
        body: "Without a bridge table you count those twice as soon as someone filters on energy source. In Power BI the same bridge is set up as many-to-many with one bidirectional cross filter, so the report behaves the same as the warehouse.",
      },
      {
        code: "dim_datum",
        title: "Generated, with Dutch public holidays",
        body: "Quarter and week numbers, Dutch public holidays, no source needed. As the conformed dimension it is the only table both facts share — and so the axis along which you put them side by side.",
      },
    ],
    quote: "Repeating the inspection total on every row and then summing it — that's the kind of mistake nobody notices until a steering committee asks why a number doesn't add up.",
  },
  scd2: {
    title: "Why the municipality dimension is SCD type 2",
    body: [
      "The Netherlands went from 393 municipalities in 2015 to 342 in 2026. The difference between two CBS boundary files is the redivision you have to record.",
      "Without a dimension with validity periods, the 2016 number hangs off the municipality as it is called today. Historical management information then shifts retroactively, and there is no error — the query just runs. That is the silent kind of data error, and the most annoying one.",
      "The dimension is built with a lag() over reference year per municipality code: every name change marks a new version, and the running sum over those markers is the version number. The fact doesn't join on code alone, but on code and reference date within the validity period.",
    ],
    callouts: [
      { value: "393 → 342", label: "municipalities between 2015 and 2026; every difference between two years is a redivision" },
      { value: "12", label: "CBS boundary files, one per reference year, from which the versions are derived" },
      { value: "3", label: "custom tests that guard the validity periods" },
    ],
    figure: diagram(
      "nl-vehicle-warehouse-3-scd2",
      "SCD type 2: the number hangs off the municipality of that time (labels in Dutch). Left the source, CBS Gebieden in Nederland, one file per reference year from 2015 to 2026: 2015 393 municipalities, 2018 380 (+3/−11), 2019 355 (+9/−34), 2023 342 (+1/−4); the difference between two years is the redivision. In the middle dim_gemeente as SCD type 2 with gemeente_key, name, geldig_van and geldig_tot: version 1 Haaren 2015-01-01 to 2020-12-31, version 2 Oisterwijk 2021-01-01 to 9999-12-31; built with lag() over reference year per gemeente_code, with custom tests for contiguous, non-overlapping periods and at most one current version. Right fct_voertuigpark_gemeente with reference year 2016 (falls in version 1) and 2023 (falls in version 2): every fact row gets the surrogate key of the version valid on 1 January of that year. At the bottom the temporal join: on gemeente_code = gemeente_code and make_date(peiljaar,1,1) between geldig_van and geldig_tot. Without type 2 the 2016 number would hang off the current municipality.",
      "Haaren merged into Oisterwijk in 2021: the 2016 number stays on version 1, the 2023 number on version 2.",
    ),
    testsTitle: "Three custom tests guard the dimension",
    tests: [
      "The periods per municipality code are contiguous: geldig_tot of one version meets geldig_van of the next.",
      "The periods don't overlap: a reference date falls in at most one version.",
      "There is at most one current version per municipality.",
    ],
    testsNote: "The temporal join is the only place where the fact touches the dimension; when these three tests are green, that join is unambiguous.",
  },
  powerbi: {
    title: "The semantic model in Power BI",
    body: [
      "The semantic model mirrors the schema and doesn't repair it. Power BI sits on the star schema, not on the source: what is settled in the warehouse isn't reinvented in the report.",
    ],
    choicesTitle: "Four choices in the semantic model",
    choices: [
      "Relationships run 1:* from dimension to fact, with a single-direction cross filter.",
      "The SCD2 dimension hangs off the fact via the surrogate key, so the temporal join from the warehouse is preserved.",
      "The bridge between vehicle and fuel is set up as many-to-many with one bidirectional cross filter, so the report behaves the same as the warehouse.",
      "The DAX measures are cross-checked with dbt show: the report's measures are checked against the warehouse.",
    ],
    quote: "A report that bypasses the model is a second model — and then you have two truths.",
  },
  limits: {
    title: "What couldn't be done, and why that is in the documentation",
    body: [
      "The intended grain for the snapshot fact was municipality per reference year per fuel type. That doesn't exist at CBS. The table with the fuel split doesn't go below province; the table with 728 municipalities only splits by vehicle type. Municipality × fuel is only possible by making numbers up.",
      "Both tables were fetched and the choice is written out in the repository: it became municipality × vehicle type, because the temporal link to the SCD2 dimension is the point of this fact. The unused table is a deliberate choice, not a forgotten file.",
    ],
    quote: "A model whose limitations are written down is usable. A model whose limitations aren't written down will sooner or later be used wrongly.",
  },
  quality: {
    title: "Data quality: tests on keys, relationships and grain",
    body: [
      "Every key, every relationship and every grain definition has a test, and those tests run on every pull request together with the build of the models. So an error surfaces before anyone steers on the number.",
    ],
    columns: ["Step", "Tool", "What it guards"],
    rows: [
      ["Data quality", "dbt tests", "unique and not_null on every key, relationships from every foreign key to its dimension, accepted_values on the reference columns, plus custom tests on the grain: no duplicate rows per grain definition"],
      ["Build", "dbt build", "models and tests, in dependency order"],
      ["Documentation", "dbt docs generate", "lineage and column documentation, kept as a CI artifact"],
      ["SQL lint", "sqlfluff", "every dbt model compiles and follows the style rules"],
      ["Python lint", "ruff", "the ingestion scripts"],
    ],
    figure: diagram(
      "nl-vehicle-warehouse-4-lineage",
      "Data lineage from source to mart in four lanes (labels in Dutch). Sources (data/raw/*.parquet): rdw.gekentekende_voertuigen, rdw.brandstof, rdw.gebreken (code list), rdw.geconstateerde_gebreken, cbs.gebieden (one file per reference year 2015-2026), cbs.70072ned (motor vehicles per municipality). Staging (views, 1:1 with the source): stg_rdw__voertuigen, stg_rdw__brandstof, stg_rdw__gebreken, stg_rdw__gebrek_constateringen (this is where the source duplication is deduplicated), stg_cbs__gemeenten, stg_cbs__voertuigpark_gemeente (long format pivoted and labelled). Warehouse (tables, star schema): dim_voertuig, bridge_voertuig_brandstof, dim_brandstof, dim_gebrek, fct_gebrek_constatering, dim_datum (generated, no source), dim_gemeente (SCD type 2, temporal join), fct_voertuigpark_gemeente. Marts: mart_gebrek_top (top defects per vehicle type and build year), mart_rdw_cbs_aansluiting (sample next to the CBS fleet), mart_voertuigpark_herindeling (fleet per municipality and reference year, with redivisions). Every arrow is a source() or ref() in the SQL.",
      "Every arrow is a source() or ref() in the SQL; dbt docs generates this lineage on every pull request.",
    ),
    after: [
      "The lineage isn't a drawing next to the code but what dbt derives from the source() and ref() calls: for every number in a mart you can read back which source table it comes from.",
      "The tests run in CI on small fixtures that are in git, so a pull request is green or red within a few minutes. Locally it is the same command.",
    ],
  },
  consistency: {
    title: "A dataset that looks fine and is wrong",
    body: [
      "The three large RDW sets together hold about 58 million rows; the default run works with a sample. Taking one sample out of that is no problem. Taking three is.",
      "The sets are all keyed on licence plate. Taking the first 500,000 rows of each set yields three different vehicle populations: the defects set has several rows per vehicle and so covers a much narrower plate range than the vehicles set. The result is facts pointing at dimension rows that aren't in the snapshot, and not a single relationships test holding up. Each table looks fine on its own; together they are wrong.",
      "The fix is to determine one range on the vehicles set — sorted by plate, position 0 and position 499,999 — and fetch every other set on that same range. The range is deterministic, so the run is reproducible as long as the source doesn't change, and the chosen range is recorded, together with snapshot date, selection query and row counts, in a manifest that is in git.",
    ],
    callouts: [
      { value: "58M", label: "rows in the three large RDW sets together; the default run samples from them" },
      { value: "1", label: "licence-plate range, determined on the vehicles set and reused for every other set" },
      { value: "0", label: "orphan rows in fuel and defects — verifiable with the relationships tests" },
    ],
    resultTitle: "The result can be checked",
    results: [
      "Zero orphan rows in fuel: every fuel row points at a vehicle in the snapshot.",
      "Zero orphan rows in defects: every observed-defect row points at a vehicle in the snapshot.",
      "All 622 defect codes in use are present in the code list.",
    ],
    resultNote: "These are exactly the relationships tests that failed with three separate snapshots.",
  },
  pipeline: {
    title: "From source to report",
    body: [
      "The chain underneath the model is deliberately boring and linear. Python fetches the sources and writes them as parquet, without changing anything. dbt types and renames in staging/, builds the star schema in warehouse/ and answers the business questions in marts/. Power BI sits on the star schema.",
    ],
    figure: diagram(
      "nl-vehicle-warehouse-1-architectuur",
      "Architecture of nl-vehicle-warehouse in five columns (labels in Dutch): sources (RDW open data via the Socrata API, four datasets: vehicles, fuel, defects, defect codes; CBS StatLine via odata: 70072ned, 85237NED and Gebieden 2015-2026), ingestion in Python (rdw.py with offset pagination of 50,000 per page, cbs.py with pagination via @odata.nextLink, common.py with retries, batches, everything as string and the column list from the dataset metadata; one licence-plate range for all RDW sets), data/raw/ (23 parquet files, 2.8 million rows, about 47 MB zstd, a literal copy of the source, not in git; _manifest.json with snapshot date, selection query, plate range and row counts, which is in git), dbt on DuckDB (staging as views 1:1 with the source; warehouse as tables with 2 facts, 5 dimensions and 1 bridge; marts as tables) and use (Power BI on the star schema, dbt docs as a CI artifact, exports as parquet). At the bottom the quality and CI strip: ruff, sqlfluff, dbt build, data-quality tests and dbt docs generate, on every pull request against small fixtures.",
      "From two open sources to a star schema and a report — every step in version control and tested in CI.",
    ),
    partsTitle: "Three choices that keep the numbers traceable",
    parts: [
      {
        title: "Raw is a literal copy",
        body: "Ingestion changes nothing: everything is read as a string, with no renaming and no filter. Typing belongs in dbt, where it is tested. Everything that makes the warehouse differ from the source lives in a model that can be read and reviewed.",
      },
      {
        title: "Three layers, one job each",
        body: "staging/ is 1:1 with the source: type, rename, deduplicate, pivot CBS. warehouse/ is the Kimball star schema. marts/ answers the business questions. A model belongs in exactly one layer, and the lineage shows that it does.",
      },
      {
        title: "The source doesn't stick to its own schema",
        body: "Socrata simply omits empty fields, so different pages yield different columns. The column list is therefore taken from the dataset metadata. The vehicles set appears to have 52 columns and has 98.",
      },
    ],
    after: [
      "The warehouse is DuckDB: zero cost and one file to review. The same dbt project targets Snowflake or Databricks with a different profile; outside staging/ there is no DuckDB-specific SQL.",
    ],
  },
  shows: {
    title: "What this project shows",
    skills: [
      "Dimensional modelling the Kimball way",
      "SCD type 2 with temporal joins",
      "Power BI on the star schema, not on the source",
      "DAX measures checked against the warehouse",
      "Data-quality tests on keys and grain",
      "Documented grain and limitations",
      "SQL with dbt: staging, star schema, marts",
      "Reproducible ingestion in Python",
      "Tests in CI on every pull request",
    ],
    closing: "The numbers are traceable, the choices are written down, and someone else can run it.",
  },
};

export const CONTENT: Record<Locale, PageContent> = { nl, en };
