const API_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = "YOUR_API_KEY";

const countrySelect = document.getElementById("countrySelect");
const infoButton = document.getElementById("infoButton");
const clearButton = document.getElementById("clearButton");
const statusMessage = document.getElementById("statusMessage");
const countryCard = document.getElementById("countryCard");

let countries = [];

function setStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.classList.toggle("error", isError);
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent =
        value === null || value === undefined || value === ""
            ? "Not available"
            : String(value);
}

function formatList(value) {
    if (!value || value.length === 0) {
        return "Not available";
    }

    return Array.isArray(value)
        ? value.join(", ")
        : String(value);
}

// Supports common API response wrappers.
// Verify the actual response fields in DevTools if needed.
function extractCountries(result) {
    if (Array.isArray(result?.data?.objects)) {
        return result.data.objects;
    }

    if (Array.isArray(result?.data)) {
        return result.data;
    }

    if (Array.isArray(result?.objects)) {
        return result.objects;
    }

    if (Array.isArray(result)) {
        return result;
    }

    return [];
}

async function getCountriesList() {
    try {
        setStatus("Loading all countries...");

        countries = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const url = new URL(API_URL);
            url.searchParams.set("limit", "100");
            url.searchParams.set("offset", String(offset));

            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${await response.text()}`
                );
            }

            const result = await response.json();
            const page = result.data?.objects || [];
            const meta = result.data?.meta;

            if (!page.length) break;

            countries.push(...page);
            offset += page.length;

            if (typeof meta?.more !== "boolean") {
                throw new Error("Pagination metadata is missing.");
            }

            hasMore = meta.more;

            setStatus(
                `Loading countries... ${countries.length} loaded`
            );
        }

        countries.sort((a, b) =>
            (a.names?.common || "").localeCompare(
                b.names?.common || ""
            )
        );

        countrySelect.replaceChildren();

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select a country";
        countrySelect.appendChild(placeholder);

        countries.forEach(country => {
            const code = country.codes?.alpha_3;
            const name = country.names?.common;

            if (!code || !name) return;

            const option = document.createElement("option");
            option.value = code;
            option.textContent = name;
            countrySelect.appendChild(option);
        });

        infoButton.disabled = true;

        setStatus(`Loaded ${countrySelect.options.length - 1} countries.`);

    } catch (error) {
        console.error("Country API error:", error);
        setStatus(`Unable to load countries: ${error.message}`, true);
    }
}

function getCountryInfo() {
    const selectedCode = countrySelect.value;

    if (!selectedCode) {
        setStatus("Please select a country first.", true);
        return;
    }

    const country = countries.find(
        item => item.codes?.alpha_3 === selectedCode
    );

    if (!country) {
        setStatus("Country information not found.", true);
        return;
    }

    focusCountryOnGlobe(country);

    // Country names
    setText("commonName", country.names?.common);
    setText("officialName", country.names?.official);

    // Capital
    const capitals = country.capitals?.map(
        item => typeof item === "string"
            ? item
            : item.name || item.common || ""
    ).filter(Boolean);

    setText("capital", formatList(capitals));

    // Continent and population
    setText(
        "continent",
        formatList(country.continents || country.region)
    );

    setText(
        "population",
        typeof country.population === "number"
            ? country.population.toLocaleString("en-US")
            : country.population
    );

    // Currencies: this API returns an array
    let currencyText = "Not available";

    if (Array.isArray(country.currencies)) {
        currencyText = country.currencies.map(currency => {
            const code = currency.code ||
                         currency.alpha_3 ||
                         currency.symbol ||
                         "";

            const name = currency.name || currency.common || "";
            const symbol = currency.symbol &&
                           currency.symbol !== code
                ? ` (${currency.symbol})`
                : "";

            return [code, name].filter(Boolean).join(" — ") + symbol;
        }).filter(Boolean).join(", ");
    }

    setText("currency", currencyText);

    // Time zones
    setText("timezones", formatList(country.timezones));

    // Languages: this API returns an array
    let languageText = "Not available";

    if (Array.isArray(country.languages)) {
        languageText = country.languages.map(language =>
            typeof language === "string"
                ? language
                : language.name || language.common || language.english_name || ""
        ).filter(Boolean).join(", ");
    }

    setText("languages", languageText);

    // ISO country code
    setText(
        "countryCode",
        `ISO Code: ${country.codes?.alpha_3 || "Not available"}`
    );

    // Flag
    // Display flag using ISO alpha-2 country code
    const flag = document.getElementById("countryFlag");

    const alpha2 = country.codes?.alpha_2?.toLowerCase();

    if (alpha2 && /^[a-z]{2}$/.test(alpha2)) {
        flag.src = `https://flagcdn.com/w160/${alpha2}.png`;
        flag.alt = `Flag of ${country.names?.common || "selected country"}`;
        flag.hidden = false;

        flag.onerror = () => {
            flag.hidden = true;
        };
    } else {
        flag.removeAttribute("src");
        flag.alt = "";
        flag.hidden = true;
    }

    countryCard.classList.remove("hidden");

    setStatus(
        `Showing information for ${country.names?.common}.`
    );

    countryCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function clearEntries() {
    countrySelect.value = "";
    countryCard.classList.add("hidden");

    [
        "commonName",
        "officialName",
        "capital",
        "continent",
        "population",
        "currency",
        "timezones",
        "languages"
    ].forEach(id => setText(id, ""));

    setText("countryCode", "ISO Code: —");

    const flag = document.getElementById("countryFlag");
    flag.removeAttribute("src");
    flag.hidden = true;

    infoButton.disabled = true;
    resetGlobe();
    setStatus("Selection cleared. Choose another country.");
}

countrySelect.addEventListener("change", () => {
    infoButton.disabled = !countrySelect.value;
});

let globeInstance = null;
let countryFeatures = [];
let selectedGlobeFeature = null;

async function initializeGlobe() {
    const container = document.getElementById("globeViz");

    if (!container || typeof Globe !== "function") {
        console.error("Globe.gl failed to load.");
        return;
    }

    try {
        globeInstance = Globe()(container)
            .width(container.clientWidth)
            .height(container.clientHeight)
            .backgroundColor("rgba(0,0,0,0)")
            .globeImageUrl(
                "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            )
            .showAtmosphere(true)
            .atmosphereColor("#8b5cf6")
            .atmosphereAltitude(0.16)
            .polygonsData([])
            .polygonAltitude(feature =>
                feature === selectedGlobeFeature ? 0.09 : 0.005
            )
            .polygonCapColor(feature =>
                feature === selectedGlobeFeature
                    ? "#a78bfa"
                    : "rgba(80, 130, 190, 0.12)"
            )
            .polygonSideColor(() => "rgba(120, 110, 220, 0.12)")
            .polygonStrokeColor(() => "rgba(190, 200, 255, 0.45)")
            .polygonsTransitionDuration(300);

        const controls = globeInstance.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.45;
        controls.enableZoom = true;

        // Load country boundary data.
        const response = await fetch(
            "https://unpkg.com/world-atlas@2/countries-110m.json"
        );

        if (!response.ok) {
            throw new Error("Could not load country boundary data.");
        }

        const topology = await response.json();

        countryFeatures = topojson.feature(
            topology,
            topology.objects.countries
        ).features;

        globeInstance.polygonsData(countryFeatures);

        // Keep the globe sized to its container.
        const resizeGlobe = () => {
            if (globeInstance && container.clientWidth > 0) {
                globeInstance
                    .width(container.clientWidth)
                    .height(container.clientHeight);
            }
        };

        window.addEventListener("resize", resizeGlobe);

    } catch (error) {
        console.error("Globe initialization error:", error);
        document.getElementById("globeStatus").textContent =
            "GLOBE UNAVAILABLE";
        document.getElementById("globeCountryDetail").textContent =
            "Check your internet connection and reload the page.";
    }
}


// Find a country on the globe and focus on it.
function focusCountryOnGlobe(country) {
    if (!globeInstance) return;

    const controls = globeInstance.controls();

    // Stop continuous rotation.
    controls.autoRotate = false;

    const countryName =
        country.names?.common || "Selected country";

    document.getElementById("globeStatus").textContent =
        "● COUNTRY SELECTED";

    document.getElementById("globeCountryName").textContent =
        countryName;

    document.getElementById("globeCountryDetail").textContent =
        "Exploring your selected destination";

    // Match World Atlas geometry to the numeric ISO code.
    const numericCode = String(
        country.codes?.ccn3 || ""
    ).padStart(3, "0");

    selectedGlobeFeature = countryFeatures.find(feature =>
        String(feature.id).padStart(3, "0") === numericCode
    );

    // Refresh the polygon styles to highlight the country.
    globeInstance.polygonsData(countryFeatures);

    if (!selectedGlobeFeature) {
        document.getElementById("globeCountryDetail").textContent =
            "Country selected; its map boundary is unavailable.";
        return;
    }

    // Calculate an approximate center from the country's coordinates.
    const coordinates = [];

    function collectCoordinates(value) {
        if (!Array.isArray(value)) return;

        if (
            value.length >= 2 &&
            typeof value[0] === "number" &&
            typeof value[1] === "number"
        ) {
            coordinates.push([value[0], value[1]]);
            return;
        }

        value.forEach(collectCoordinates);
    }

    collectCoordinates(selectedGlobeFeature.geometry.coordinates);

    if (coordinates.length > 0) {
        const longitude = coordinates.reduce(
            (sum, point) => sum + point[0], 0
        ) / coordinates.length;

        const latitude = coordinates.reduce(
            (sum, point) => sum + point[1], 0
        ) / coordinates.length;

        globeInstance.pointOfView(
            {
                lat: latitude,
                lng: longitude,
                altitude: 1.8
            },
            1200
        );
    }

    document.getElementById("globeCountryDetail").textContent =
        selectedGlobeFeature.properties?.name || countryName;
}


// Restart rotation when the selection is cleared.
function resetGlobe() {
    if (!globeInstance) return;

    selectedGlobeFeature = null;

    globeInstance.polygonsData(countryFeatures);

    globeInstance.controls().autoRotate = true;

    document.getElementById("globeStatus").textContent =
        "● LIVE GLOBE";

    document.getElementById("globeCountryName").textContent =
        "Explore the world";

    document.getElementById("globeCountryDetail").textContent =
        "Choose a country to begin";

    globeInstance.pointOfView(
        {
            lat: 20,
            lng: 0,
            altitude: 2.2
        },
        1000
    );
}


// Start the globe.
initializeGlobe();

infoButton.addEventListener("click", getCountryInfo);
clearButton.addEventListener("click", clearEntries);

getCountriesList();
