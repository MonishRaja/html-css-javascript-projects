
/* ==========================================
   SPIDER CHART ANALYTICS STUDIO
========================================== */

// ==========================================
// CHART.JS INITIALIZATION
// ==========================================

const ChartJS = window.Chart;

let chartInstance = null;

console.log("Chart.js:", typeof ChartJS);


// ==========================================
// DATASET COLOR PALETTE
// ==========================================

const colors = [
    "#39ff88",
    "#9b72ff",
    "#ffb84d",
    "#ff6384",
    "#36c9e8",
    "#f4e85b",
    "#ff8c42",
    "#00d4aa",
    "#e879f9",
    "#60a5fa"
];


// ==========================================
// DOM ELEMENTS
// ==========================================

const datasetList =
    document.getElementById("datasetList");

const categoriesInput =
    document.getElementById("categories");

const chartTitle =
    document.getElementById("chartTitle");

const maxValue =
    document.getElementById("maxValue");

const error =
    document.getElementById("error");

const canvas =
    document.getElementById("myChart");


// ==========================================
// ADD DATASET
// ==========================================

function addDataset(name = "", values = "", color = "") {

    // Object-based dataset support
    if (typeof name === "object" && name !== null) {

        const dataset = name;

        name = dataset.name || dataset.label || "";

        values = dataset.values || dataset.data || "";

        color = dataset.color || "";

    }

    // Find unused color
    const usedColors = Array.from(
        datasetList.querySelectorAll(".dataset-color")
    ).map(input => input.value.toLowerCase());

    const availableColor = colors.find(
        item => !usedColors.includes(item.toLowerCase())
    );

    const selectedColor =
        color ||
        availableColor ||
        colors[datasetList.children.length % colors.length];


    // Dataset card
    const card = document.createElement("div");

    card.className = "dataset-card";


    // Top section
    const top = document.createElement("div");

    top.className = "dataset-top";


    // Dataset name
    const nameInput = document.createElement("input");

    nameInput.type = "text";

    nameInput.className = "dataset-name";

    nameInput.placeholder = "Dataset name";

    nameInput.value = String(name);


    // Dataset color
    const colorInput = document.createElement("input");

    colorInput.type = "color";

    colorInput.className = "dataset-color";

    colorInput.value = selectedColor;


    // Remove button
    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.className = "remove-btn";

    removeButton.textContent = "✕";

    removeButton.title = "Remove dataset";

    removeButton.addEventListener("click", () => {

        card.remove();

    });


    top.append(
        nameInput,
        colorInput,
        removeButton
    );


    // Dataset values
    const valuesInput = document.createElement("input");

    valuesInput.type = "text";

    valuesInput.className = "dataset-values";

    valuesInput.placeholder = "85, 90, 75, 80, 95";

    valuesInput.value = Array.isArray(values)
        ? values.join(", ")
        : String(values);


    card.append(
        top,
        valuesInput
    );

    datasetList.appendChild(card);

}


// ==========================================
// COLLECT DATASETS
// ==========================================

function getDatasets() {

    const cards =
        document.querySelectorAll(".dataset-card");

    const datasets = [];

    cards.forEach((card, index) => {

        const nameInput =
            card.querySelector(".dataset-name");

        const valuesInput =
            card.querySelector(".dataset-values");

        const colorInput =
            card.querySelector(".dataset-color");


        if (!nameInput || !valuesInput || !colorInput) {

            throw new Error(
                `Dataset ${index + 1} has missing input fields.`
            );

        }


        datasets.push({

            name: nameInput.value.trim(),

            valuesInput: valuesInput.value.trim(),

            color: colorInput.value

        });

    });

    return datasets;

}


// ==========================================
// VALIDATE AND PREPARE DATA
// ==========================================

function prepareData() {

    // Categories
    const categoryText =
        categoriesInput.value.trim();

    if (!categoryText) {

        throw new Error(
            "Please enter categories."
        );

    }


    const categories = categoryText
        .split(",")
        .map(item => item.trim());


    if (
        categories.length < 3 ||
        categories.some(item => item === "")
    ) {

        throw new Error(
            "Enter at least 3 valid categories."
        );

    }


    // Duplicate category validation
    const normalizedCategories =
        categories.map(item => item.toLowerCase());

    if (
        new Set(normalizedCategories).size !==
        categories.length
    ) {

        throw new Error(
            "Categories must be unique."
        );

    }


    // Maximum value
    const maximum = Number(maxValue.value);

    if (
        !Number.isFinite(maximum) ||
        maximum <= 0
    ) {

        throw new Error(
            "Maximum value must be greater than zero."
        );

    }


    // Collect datasets
    const rawDatasets = getDatasets();

    if (rawDatasets.length === 0) {

        throw new Error(
            "Please add at least one dataset."
        );

    }


    // Validate datasets
    const datasets = rawDatasets.map(
        (dataset, index) => {

            if (!dataset.name) {

                throw new Error(
                    `Please enter a name for Dataset ${index + 1}.`
                );

            }


            if (!dataset.valuesInput) {

                throw new Error(
                    `Please enter values for ${dataset.name}.`
                );

            }


            const rawValues = dataset.valuesInput
                .split(",")
                .map(item => item.trim());


            if (
                rawValues.length !== categories.length ||
                rawValues.some(value => value === "")
            ) {

                throw new Error(
                    `${dataset.name}: Enter exactly ${categories.length} values.`
                );

            }


            const values = rawValues.map(Number);


            if (
                values.some(value =>
                    !Number.isFinite(value) ||
                    value < 0 ||
                    value > maximum
                )
            ) {

                throw new Error(
                    `${dataset.name}: Values must be between 0 and ${maximum}.`
                );

            }


            return {

                label: dataset.name,

                data: values,

                color: dataset.color

            };

        }
    );


    return {

        categories,

        datasets,

        maximum

    };

}


// ==========================================
// COLOR CONVERSION
// ==========================================

function hexToRGBA(hex, alpha = 0.2) {

    const clean = hex.replace("#", "");

    const r = parseInt(clean.substring(0, 2), 16);

    const g = parseInt(clean.substring(2, 4), 16);

    const b = parseInt(clean.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;

}


// ==========================================
// GENERATE SPIDER / RADAR CHART
// ==========================================

function plotGraph() {

    try {

        // Chart.js validation
        if (typeof ChartJS !== "function") {

            throw new Error(
                "Chart.js is not loaded. Check your internet connection."
            );

        }


        // Canvas validation
        if (!canvas) {

            throw new Error(
                "Chart canvas was not found."
            );

        }


        error.textContent = "";


        // Prepare data
        const {
            categories,
            datasets,
            maximum
        } = prepareData();


        // Chart title
        const title =
            chartTitle.value.trim() || "Spider Chart";

        document.getElementById(
            "displayTitle"
        ).textContent = title;


        // Display options
        const showLegend =
            document.getElementById("showLegend").checked;

        const showFill =
            document.getElementById("showFill").checked;

        const showGrid =
            document.getElementById("showGrid").checked;


        // ==================================
        // FORMAT DATASETS
        // ==================================

        const formattedDatasets = datasets.map(dataset => {

            return {

                label: dataset.label,

                data: dataset.data,

                borderColor: dataset.color,

                backgroundColor: hexToRGBA(
                    dataset.color,
                    0.18
                ),

                borderWidth: 2,

                pointBackgroundColor: dataset.color,

                pointBorderColor: "#ffffff",

                pointRadius: 4,

                pointHoverRadius: 7,

                fill: showFill,

                tension: 0.35

            };

        });


        // ==================================
        // DESTROY PREVIOUS CHART
        // ==================================

        if (chartInstance) {

            chartInstance.destroy();

            chartInstance = null;

        }


        // ==================================
        // CREATE RADAR CHART
        // ==================================

        chartInstance = new ChartJS(canvas, {

            type: "radar",

            data: {

                labels: categories,

                datasets: formattedDatasets

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: {

                    duration: 1000,

                    easing: "easeOutQuart"

                },

                interaction: {

                    intersect: false,

                    mode: "index"

                },

                scales: {

                    r: {

                        min: 0,

                        max: maximum,

                        beginAtZero: true,

                        ticks: {

                            stepSize: maximum / 5,

                            color: "#a8b3d3",

                            backdropColor: "transparent"

                        },

                        grid: {

                            color: showGrid
                                ? "rgba(160,175,220,0.2)"
                                : "transparent"

                        },

                        angleLines: {

                            color: showGrid
                                ? "rgba(160,175,220,0.3)"
                                : "transparent"

                        },

                        pointLabels: {

                            color: "#d5dcf5",

                            font: {

                                size: 12,

                                weight: "bold"

                            }

                        }

                    }

                },

                plugins: {

                    legend: {

                        display: showLegend,

                        position: "bottom",

                        labels: {

                            color: "#d5dcf5",

                            padding: 20,

                            usePointStyle: true

                        }

                    },

                    title: {

                        display: false,

                        text: title

                    },

                    tooltip: {

                        backgroundColor: "#172344",

                        titleColor: "#39ff88",

                        bodyColor: "#ffffff",

                        borderColor: "#7955d9",

                        borderWidth: 1,

                        padding: 12

                    }

                }

            }

        });


        // Update statistics
        updateStatistics(datasets);

    }

    catch (err) {

        error.textContent = err.message;

        console.error(
            "Spider chart generation error:",
            err
        );

    }

}


// ==========================================
// AUTOMATIC STATISTICS
// ==========================================

function updateStatistics(datasets) {

    const allValues = datasets.flatMap(
        dataset => dataset.data
    );


    const total = allValues.reduce(
        (sum, value) => sum + value,
        0
    );


    const average = total / allValues.length;

    const highest = Math.max(...allValues);

    const lowest = Math.min(...allValues);


    // Overall statistics
    document.getElementById(
        "totalDatasets"
    ).textContent = datasets.length;

    document.getElementById(
        "averageValue"
    ).textContent = average.toFixed(2);

    document.getElementById(
        "highestValue"
    ).textContent = highest;

    document.getElementById(
        "lowestValue"
    ).textContent = lowest;


    // Individual statistics
    const table = document.getElementById(
        "statisticsBody"
    );

    table.innerHTML = "";


    datasets.forEach(dataset => {

        const values = dataset.data;

        const sum = values.reduce(
            (a, b) => a + b,
            0
        );

        const avg = sum / values.length;

        const high = Math.max(...values);

        const low = Math.min(...values);


        const row = document.createElement("tr");


        const cells = [

            dataset.label,

            avg.toFixed(2),

            high,

            low,

            sum

        ];


        cells.forEach(value => {

            const td = document.createElement("td");

            td.textContent = value;

            row.appendChild(td);

        });


        table.appendChild(row);

    });

}


// ==========================================
// EXPORT CHART AS PNG
// ==========================================

function exportPNG() {

    try {

        if (!chartInstance) {

            alert("Please generate a spider chart first.");

            return;

        }


        const image = chartInstance.toBase64Image();

        const link = document.createElement("a");

        link.href = image;

        link.download = "SpiderChart.png";

        document.body.appendChild(link);

        link.click();

        link.remove();

    }

    catch (err) {

        console.error("PNG export error:", err);

        alert("Unable to export PNG.");

    }

}


// ==========================================
// EXPORT CHART AS PDF
// ==========================================

function exportPDF() {

    try {

        if (!chartInstance) {

            alert("Please generate a spider chart first.");

            return;

        }


        if (!window.jspdf || !window.jspdf.jsPDF) {

            alert("PDF library is not loaded.");

            return;

        }


        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF(
            "landscape",
            "mm",
            "a4"
        );


        const image = chartInstance.toBase64Image();

        const title =
            chartTitle.value.trim() || "Spider Chart";


        // PDF heading
        pdf.setFontSize(18);

        pdf.text(title, 148, 15, {
            align: "center"
        });


        // Add radar chart
        pdf.addImage(
            image,
            "PNG",
            25,
            25,
            247,
            150
        );


        // Save PDF
        pdf.save("SpiderChart_Report.pdf");

    }

    catch (err) {

        console.error("PDF export error:", err);

        alert("Unable to export PDF.");

    }

}


// ==========================================
// EVENT LISTENERS
// ==========================================

function bindClick(id, callback) {

    const element = document.getElementById(id);

    if (!element) {

        console.error(
            `HTML element not found: #${id}`
        );

        return;

    }

    element.addEventListener(
        "click",
        callback
    );

}


// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Spider Chart Analytics Studio Initialized"
        );


        // Chart.js validation
        if (typeof ChartJS !== "function") {

            error.textContent =
                "Chart.js failed to load. Please check your internet connection.";

            return;

        }


        // Add dataset
        bindClick("addDataset", () => {

            addDataset();

        });


        // Generate spider chart
        bindClick("generateBtn", () => {

            plotGraph();

        });


        // PNG export
        bindClick("pngBtn", () => {

            exportPNG();

        });


        // PDF export
        bindClick("pdfBtn", () => {

            exportPDF();

        });


        // ==================================
        // INITIAL SAMPLE DATA
        // ==================================

        categoriesInput.value =
            "Mathematics, Science, English, History, Sports";


        addDataset(
            "Student A",
            "85, 90, 75, 80, 70",
            "#39ff88"
        );


        addDataset(
            "Student B",
            "75, 80, 90, 65, 95",
            "#9b72ff"
        );


        addDataset(
            "Student C",
            "90, 70, 85, 95, 80",
            "#ffb84d"
        );


        // Generate initial spider chart
        plotGraph();

    }
);
