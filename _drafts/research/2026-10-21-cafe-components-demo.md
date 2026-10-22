---
layout: story
title: "Café visits, prices, and ratings: a component showcase"
subtitle: "Example patterns for research stories: a filterable chart, sortable table, and an interactive map with popups. All data is synthetic."
tags: [research, en, draft]
---

Where the previous demo post showed *scrollytelling*, this one shows the other half of the toolkit: the standard interactive components that make up a paper turned story — charts with controls, tables that sort, and maps with popups. Everything on this page reads from two small data files and renders in the browser.

## Trend with a filter

Most papers have a time series somewhere. Here it is as a line chart with a filter: pick a district, or keep all of them. Hovering a line shows a tooltip with the value. This is the "minimum interactivity" that turns a static figure into something a reader can query.

<div class="story-fig" style="text-align: center;">
<label for="district-select"><b>District:</b></label>
<select id="district-select" style="font-family: inherit; font-size: inherit; margin-left: 0.5em; margin-bottom: 1em; padding: 2px 6px;">
    <option value="all">All</option>
    <option value="Altstadt">Altstadt</option>
    <option value="Neustadt">Neustadt</option>
    <option value="Schallmoos">Schallmoos</option>
    <option value="Elisabeth-Vorstadt">Elisabeth-Vorstadt</option>
</select>
<figure>
    <div id="visits-chart"></div>
    <figcaption>Figure 1: Monthly café visits per district, 2024–2026 (synthetic data). Use the selector to filter.</figcaption>
</figure>
</div>

The seasonal pattern repeats every year — summer dips in the tourist districts, steady growth in Schallmoos. A control like this costs a `<select>` element and about ten lines of script: the handler filters the data and re-renders the chart.

## Two variables against each other

Scatter plots are where Observable Plot's built-in tooltips earn their keep. Each dot below is a café; hover it to see which one.

<div class="story-fig">
<figure>
    <div id="price-chart"></div>
    <figcaption>Figure 2: Espresso price vs. rating, coloured by district (synthetic data). Hover a dot for details.</figcaption>
</figure>
</div>

The (made-up) relationship is flat: price does not buy rating here. That is precisely the kind of claim a reader should be able to check by poking the figure themselves.

## Tables still work

Sometimes a table is the honest visualisation. This one lists the eight top-rated cafés from the dataset — and it is sortable: click a column header.

| Café                 | District            | Rating | Espresso | Seats |
|----------------------|---------------------|--------|----------|-------|
| Café Sperl           | Altstadt            | 4.8    | €3.80    | 42    |
| Dritter Platz        | Schallmoos          | 4.7    | €4.50    | 28    |
| Kaffee Altstadt Gold | Altstadt            | 4.6    | €4.20    | 30    |
| Schallmoos Roasters  | Schallmoos          | 4.6    | €4.00    | 36    |
| Rösterei DomQuartier | Altstadt            | 4.5    | €3.50    | 24    |
| Triest               | Neustadt            | 4.4    | €3.90    | 55    |
| Krypto Kaffee        | Elisabeth-Vorstadt  | 4.3    | €3.60    | 18    |
| Gleis 1              | Elisabeth-Vorstadt  | 4.2    | €3.20    | 20    |
{: .sortable}

Sorting is done by a few lines of script that read the table from the DOM — no data plumbing required, which makes it the cheapest interactivity you can add to a post.

## The map, up close

The scrollytelling demo pinned a map in place; a story can also just *have* a map. This one shows the cafés themselves. Marker size follows seat count, the red markers are the top-rated places, and every marker opens a popup with its details.

<div class="story-fig">
<figure>
    <div id="cafe-map" style="height: 480px; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 8px;"></div>
    <figcaption>Figure 3: Café locations (synthetic, illustrative coordinates). Click a marker for details.</figcaption>
</figure>
</div>

## The recipe

Every component on this page follows the same three steps:

1. Put an empty `div` (or a table) in the Markdown where the component belongs.
2. Fetch your data from `assets/stories/<slug>/` — here, a GeoJSON of cafés and a JSON of monthly visits.
3. Build the component in a module script and wire controls to re-render it.

For your own papers, the pattern is identical: your analysis pipeline exports GeoJSON/JSON, the post narrates the argument, and the components let readers interrogate the evidence.

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
    window.COMPONENTS_DATA = {
        visits: "{{ site.baseurl }}/assets/stories/components/visits.json",
        cafes: "{{ site.baseurl }}/assets/stories/components/cafes.geojson"
    };
</script>

{% raw %}
<script type="module">
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

const ACCENT = "#FF0F00";
const [visitsData, cafesFc] = await Promise.all([
    fetch(window.COMPONENTS_DATA.visits).then(r => r.json()),
    fetch(window.COMPONENTS_DATA.cafes).then(r => r.json())
]);
const visits = visitsData.records;
const cafes = cafesFc.features.map(f => f.properties);

// --- Figure 1: line chart with district filter ---

const select = document.getElementById("district-select");
const plotStyle = { color: "currentColor", fontFamily: "inherit", fontSize: 13 };

function renderVisitsChart() {
    const chosen = select.value;
    const data = chosen === "all" ? visits : visits.filter(d => d.district === chosen);
    const chart = Plot.plot({
        style: plotStyle,
        width: 860,
        x: { type: "utc", label: null },
        y: { label: "Visits per month", grid: true },
        color: chosen === "all" ? { legend: true } : {},
        marks: [
            chosen === "all"
                ? Plot.line(data, { x: "date", y: "visits", stroke: "district", tip: true })
                : Plot.line(data, { x: "date", y: "visits", stroke: ACCENT, strokeWidth: 2, tip: true }),
            Plot.ruleY([0])
        ]
    });
    document.getElementById("visits-chart").replaceChildren(chart);
}
select.addEventListener("change", renderVisitsChart);
renderVisitsChart();

// --- Figure 2: scatter with tooltips ---

document.getElementById("price-chart").append(Plot.plot({
    style: plotStyle,
    width: 860,
    grid: true,
    x: { label: "Espresso price (€)" },
    y: { label: "Rating", domain: [3.5, 5] },
    color: { legend: true },
    marks: [
        Plot.dot(cafes, { x: "espresso", y: "rating", fill: "district", r: 6, tip: true })
    ]
}));

// --- Sortable table ---

document.querySelectorAll("table.sortable").forEach(table => {
    const tbody = table.querySelector("tbody");
    table.querySelectorAll("th").forEach((th, i) => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => {
            const asc = th.dataset.dir !== "asc";
            table.querySelectorAll("th").forEach(h => delete h.dataset.dir);
            th.dataset.dir = asc ? "asc" : "desc";
            const rows = Array.from(tbody.rows);
            rows.sort((a, b) => {
                const x = a.cells[i].textContent.trim();
                const y = b.cells[i].textContent.trim();
                const nx = parseFloat(x.replace("€", ""));
                const ny = parseFloat(y.replace("€", ""));
                const cmp = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y);
                return asc ? cmp : -cmp;
            });
            rows.forEach(r => tbody.appendChild(r));
        });
    });
});

// --- Figure 3: Leaflet map with popups ---

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const map = L.map("cafe-map", { scrollWheelZoom: false });
L.tileLayer("https://{s}.basemaps.cartocdn.com/" + (isDark ? "dark_all" : "light_all") + "/{z}/{x}/{y}{r}.png?key=cb1_4hrr_1_f5d8d8c2fa1f6e2aff2e35d6", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
}).addTo(map);

const layer = L.geoJSON(cafesFc, {
    pointToLayer: (feature, latlng) => {
        const p = feature.properties;
        return L.circleMarker(latlng, {
            radius: 5 + p.seats / 12,
            color: p.rating >= 4.5 ? ACCENT : "#666666",
            weight: 1.5,
            fillOpacity: 0.75
        }).bindPopup(
            "<b>" + p.name + "</b><br>District: " + p.district +
            "<br>Rating: " + p.rating + " / 5" +
            "<br>Espresso: €" + p.espresso.toFixed(2) +
            "<br>Seats: " + p.seats
        );
    }
}).addTo(map);
map.fitBounds(layer.getBounds(), { padding: [30, 30] });
window.addEventListener("resize", () => map.invalidateSize());
</script>
{% endraw %}
