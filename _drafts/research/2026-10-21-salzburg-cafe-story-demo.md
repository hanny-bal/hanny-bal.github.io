---
layout: story
title: "Salzburg's café landscape: a demo interactive research story"
subtitle: "A template for turning papers into scroll-driven stories with live charts and maps. All data in this post is synthetic."
tags: [research, en, draft]
---

<!-- TEMPLATE NOTES
This post is a working template for "interactive paper" stories.

To turn a real paper into a story:
1. Copy this file into _posts/research/ with a new date, title, and slug.
2. Put your data (GeoJSON or JSON, exported from your paper's pipeline) in
   assets/stories/<your-slug>/ and update DEMO_STORY_DATA below.
3. Keep the figure pattern: a <div id="..."> where the chart goes, plus a
   module script that fetches the data and builds the figure.
4. For scrollytelling, edit the .step cards and their data-focus attributes.
Everything is client-side, so GitHub Pages needs no extra build tooling.
-->

This is what an interactive version of a research paper can look like on this blog: a short, plain-language narrative wrapped around live figures. The chart below is rendered from data when you load the page, and the map reacts to where you are in the text. All numbers are synthetic — the point is the pattern, not the findings.

## The shape of the data

A story usually works best if the first figure is static and gives the reader the overall picture, before any interaction starts. Here is the headline count: cafés per district, rendered with Observable Plot straight from a GeoJSON file.

<div class="story-fig">
<figure>
    <div id="cafe-chart"></div>
    <figcaption>Figure 1: Cafés per Salzburg district (synthetic data). The leading district is highlighted.</figcaption>
</figure>
</div>

The distribution is steep: one historic core district holds roughly a fifth of all cafés, while the outer districts have a handful each. Numbers alone hide *where* this happens, so the rest of this story moves to the map. Scroll on.

## A geographic reading

The figure below stays pinned while you scroll through the steps on the right. Each step moves the map and updates the caption.

<div class="scrolly" id="cafe-scrolly">
    <figure class="sticky-fig">
        <div class="fig-inner">
            <div id="cafe-map" style="height: 100%"></div>
            <div class="map-caption" id="map-caption">Loading…</div>
        </div>
    </figure>
    <div class="steps">
        <div class="step" data-focus="">
            <div class="step-card"><p><b>Overview.</b> 128 cafés across 11 districts. Right now the map shows all of them, shaded by district. Keep scrolling to walk through the argument.</p></div>
        </div>
        <div class="step" data-focus="Altstadt">
            <div class="step-card"><p><b>Altstadt.</b> The historic core concentrates 28 cafés — by far the densest cluster in the city. Tourist footfall keeps them alive year-round.</p></div>
        </div>
        <div class="step" data-focus="Schallmoos">
            <div class="step-card"><p><b>Schallmoos.</b> Across the river, the picture changes: 17 cafés, mostly specialty roasters opened within the last five years. A young, growing neighbourhood.</p></div>
        </div>
        <div class="step" data-focus="Elisabeth-Vorstadt">
            <div class="step-card"><p><b>Elisabeth-Vorstadt.</b> Near the main station, commuter foot traffic supports 12 cafés despite very little tourism — a different survival strategy than in the old town.</p></div>
        </div>
        <div class="step" data-focus="Gnigl">
            <div class="step-card"><p><b>Gnigl.</b> The eastern periphery tells the other side of the story: 4 cafés for almost 6,000 residents. Amenities cluster in the centre and thin out with distance.</p></div>
        </div>
        <div class="step" data-focus="">
            <div class="step-card"><p><b>Back to the whole city.</b> This is where your paper's map goes: replace the GeoJSON with your study area, and these cards with the steps of your argument.</p></div>
        </div>
    </div>
</div>

## How this post works

Everything above is plain Markdown plus three small pieces of front-end glue, with no build step beyond Jekyll itself:

- **Data.** One static file, `assets/stories/demo/salzburg-districts.geojson`. Your paper's Python pipeline can emit this directly.
- **Charts.** Observable Plot, imported as an ES module from a CDN, draws Figure 1 from the fetched data. No npm install, no bundler.
- **Scrollytelling.** scrollama watches the `.step` cards and fires events; the handler tells Leaflet which district to highlight and zoom to.

To write your own story, duplicate this post, drop your data file into `assets/stories/<slug>/`, and edit the prose and step cards. Interactive controls (sliders, toggles) are just more of the same: a `div` and a few lines of script updating the figure.

<script src="https://cdn.jsdelivr.net/npm/scrollama@3.2.0/build/scrollama.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
    window.DEMO_STORY_DATA = "{{ site.baseurl }}/assets/stories/demo/salzburg-districts.geojson";
</script>

{% raw %}
<script type="module">
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

const ACCENT = "#FF0F00";
const fc = await (await fetch(window.DEMO_STORY_DATA)).json();
const districts = fc.features.map(f => f.properties);
const totalCafes = districts.reduce((sum, d) => sum + d.cafes, 0);

// --- Figure 1: static chart (Observable Plot) ---

const maxCafes = Math.max(...districts.map(d => d.cafes));
const chart = Plot.plot({
    style: { color: "currentColor", fontFamily: "inherit", fontSize: 13 },
    width: 860,
    marginBottom: 80,
    x: { label: null, tickRotate: -35, fontSize: 16 },
    y: { label: "Cafés (count)", grid: true, fontSize: 16 },
    marks: [
        Plot.barY(districts, {
            x: "name",
            y: "cafes",
            fill: d => (d.cafes === maxCafes ? ACCENT : "currentColor"),
            fillOpacity: d => (d.cafes === maxCafes ? 1 : 0.55),
            title: d => d.name + ": " + d.cafes + " cafés"
        }),
        Plot.ruleY([0])
    ]
});
document.getElementById("cafe-chart").append(chart);

// --- Scrollytelling map (Leaflet + scrollama) ---

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const map = L.map("cafe-map", { scrollWheelZoom: false });
L.tileLayer("https://{s}.basemaps.cartocdn.com/" + (isDark ? "dark_all" : "light_all") + "/{z}/{x}/{y}{r}.png?key=cb1_4hrr_1_f5d8d8c2fa1f6e2aff2e35d6", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
}).addTo(map);

const styleDim = { color: "#666666", weight: 1, fillOpacity: 0.10 };
const styleHidden = { color: "#666666", weight: 1, fillOpacity: 0.02 };
const styleFocus = { color: ACCENT, weight: 2, fillOpacity: 0.35 };
const layer = L.geoJSON(fc, { style: () => styleDim }).addTo(map);
const caption = document.getElementById("map-caption");

function overview() {
    layer.eachLayer(l => l.setStyle(styleDim));
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    caption.textContent = districts.length + " districts · " + totalCafes + " cafés (synthetic data)";
}

function focusDistrict(name) {
    let bounds;
    layer.eachLayer(l => {
        const isFocus = l.feature.properties.name === name;
        l.setStyle(isFocus ? styleFocus : styleHidden);
        if (isFocus) bounds = l.getBounds();
    });
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
    const p = fc.features.find(f => f.properties.name === name).properties;
    caption.textContent = p.name + ": " + p.cafes + " cafés · " + p.population.toLocaleString("en-GB") + " residents";
}

const steps = Array.from(document.querySelectorAll("#cafe-scrolly .step"));
const scroller = (typeof scrollama === "function") ? scrollama() : null;
if (scroller) {
    scroller.setup({ step: "#cafe-scrolly .step", offset: 0.55 })
        .onStepEnter(response => {
            steps.forEach((s, i) => s.classList.toggle("active", i === response.index));
            const focus = response.element.dataset.focus;
            if (focus) { focusDistrict(focus); } else { overview(); }
        });
} else {
    console.warn("scrollama did not load; steps will not highlight.");
}

overview();
steps[0].classList.add("active");
window.addEventListener("resize", () => { if (scroller) scroller.resize(); map.invalidateSize(); });
</script>
{% endraw %}
