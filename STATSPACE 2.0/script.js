
/* ==========================================
   STATSPACE 2.0
   ADVANCED STATISTICAL ANALYSIS ENGINE
========================================== */

const $ = id => document.getElementById(id);

const COLORS = {
    emerald: "#075B46",
    rose: "#D49A9C",
    espresso: "#49352E",
    beige: "#E8DED5",
    ivory: "#F7F3EE"
};

let datasets = {};
let history = [];
let activeDataset = null;
let lastStatistics = null;
let chartInstances = {};

// ==========================================
// 1. INITIALIZATION & STORAGE
// ==========================================

function loadStorage() {
    try {
        const saved = JSON.parse(localStorage.getItem("statspace_data"));
        const savedHistory = JSON.parse(localStorage.getItem("statspace_history"));

        if (saved && typeof saved === "object" && !Array.isArray(saved)) {
            datasets = saved;
        }

        if (Array.isArray(savedHistory)) {
            history = savedHistory;
        }
    } catch (error) {
        console.warn("Stored data could not be loaded.", error);
    }

    if (!Object.keys(datasets).length) {
        datasets = {
            "Sample Dataset": [12, 18, 21, 25, 28, 30, 32, 35, 38, 40],
            "Experiment B": [15, 19, 22, 24, 27, 31, 34, 37, 42, 45]
        };
    }

    activeDataset = Object.keys(datasets)[0];

    saveStorage();
}

function saveStorage() {
    try {
        localStorage.setItem(
            "statspace_data",
            JSON.stringify(datasets)
        );

        localStorage.setItem(
            "statspace_history",
            JSON.stringify(history.slice(-50))
        );
    } catch (error) {
        showToast("Storage limit reached. Export your data.");
    }
}

// ==========================================
// 2. NAVIGATION
// ==========================================

const pageTitles = {
    dashboard: "Overview",
    descriptive: "Descriptive Statistics",
    distribution: "Distribution Analysis",
    correlation: "Correlation & Regression",
    datasets: "Dataset Manager",
    comparison: "Dataset Comparison",
    reports: "Reports & Export"
};

function showPage(page) {
    const target = $(page);

    if (!target) return;

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === page
        );
    });

    target.classList.add("active");

    $("headerTitle").textContent = pageTitles[page];
    $("pageName").textContent = page.toUpperCase();

    if (page === "dashboard") updateDashboard();
    if (page === "datasets") renderDatasetManager();
    if (page === "reports") renderHistory();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// ==========================================
// 3. UTILITIES
// ==========================================

function showToast(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function parseData(value) {
    if (Array.isArray(value)) {
        if (!value.length) throw new Error("Dataset is empty.");

        const result = value.map(Number);

        if (result.some(v => !Number.isFinite(v))) {
            throw new Error("Dataset contains invalid numbers.");
        }

        return result;
    }

    const raw = String(value).trim();

    if (!raw) throw new Error("Please enter numerical data.");

    const parts = raw.split(/[,\s;]+/).filter(Boolean);

    if (!parts.length) throw new Error("No data found.");

    const values = parts.map(Number);

    if (values.some(v => !Number.isFinite(v))) {
        throw new Error("Enter valid numerical values only.");
    }

    return values;
}

function getDataset(name) {
    if (!name || !datasets[name]) {
        throw new Error("Please select a valid dataset.");
    }

    return parseData(datasets[name]);
}

function average(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const mid = Math.floor(n / 2);

    return n % 2
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Linear interpolation percentile (R-7 method)

function percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);

    if (sorted.length === 1) return sorted[0];

    const position = (sorted.length - 1) * p;
    const lower = Math.floor(position);
    const upper = Math.ceil(position);

    return sorted[lower] +
        (sorted[upper] - sorted[lower]) *
        (position - lower);
}

function variance(values, sample = true) {
    if (sample && values.length < 2) {
        throw new Error("Sample variance requires at least two values.");
    }

    const mean = average(values);

    const sum = values.reduce(
        (total, value) => total + Math.pow(value - mean, 2),
        0
    );

    return sum / (values.length - (sample ? 1 : 0));
}

function standardDeviation(values, sample = true) {
    return Math.sqrt(variance(values, sample));
}

function mode(values) {
    const frequencies = new Map();

    values.forEach(value => {
        frequencies.set(value, (frequencies.get(value) || 0) + 1);
    });

    const maxFrequency = Math.max(...frequencies.values());

    if (maxFrequency === 1) return [];

    return [...frequencies.entries()]
        .filter(([, frequency]) => frequency === maxFrequency)
        .map(([value]) => value)
        .sort((a, b) => a - b);
}

function formatNumber(value, digits = 3) {
    if (value === null || !Number.isFinite(value)) return "—";

    return Number(value.toFixed(digits)).toString();
}

// ==========================================
// 4. COMPLETE DESCRIPTIVE STATISTICS
// ==========================================

function calculateStatistics(values, sample = true) {

    const n = values.length;

    if (n === 0) {
        throw new Error("Dataset cannot be empty.");
    }

    if (sample && n < 2) {
        throw new Error("Sample statistics require at least two values.");
    }

    const sorted = [...values].sort((a, b) => a - b);

    const mean = average(values);
    const med = median(values);
    const min = sorted[0];
    const max = sorted[n - 1];

    const q1 = percentile(sorted, 0.25);
    const q3 = percentile(sorted, 0.75);

    const varValue = variance(values, sample);
    const sd = Math.sqrt(varValue);

    const iqr = q3 - q1;

    const modes = mode(values);

    const m2 = values.reduce(
        (sum, x) => sum + Math.pow(x - mean, 2), 0
    ) / n;

    const m3 = values.reduce(
        (sum, x) => sum + Math.pow(x - mean, 3), 0
    ) / n;

    const m4 = values.reduce(
        (sum, x) => sum + Math.pow(x - mean, 4), 0
    ) / n;

    // Moment-based population skewness and excess kurtosis

    const skewness = m2 === 0
        ? 0
        : m3 / Math.pow(m2, 1.5);

    const kurtosis = m2 === 0
        ? 0
        : m4 / Math.pow(m2, 2) - 3;

    const cv = mean === 0
        ? null
        : (sd / Math.abs(mean)) * 100;

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    const outliers = sorted.filter(
        value => value < lowerFence || value > upperFence
    );

    return {
        n,
        mean,
        median: med,
        modes,
        min,
        max,
        range: max - min,
        q1,
        q3,
        iqr,
        variance: varValue,
        sd,
        cv,
        skewness,
        kurtosis,
        lowerFence,
        upperFence,
        outliers,
        sorted
    };
}

// ==========================================
// 5. ANALYSIS HISTORY
// ==========================================

function recordHistory(title, stats) {
    history.push({
        title,
        date: new Date().toLocaleString(),
        mean: stats.mean,
        sd: stats.sd,
        count: stats.n
    });

    history = history.slice(-50);

    saveStorage();

    updateDashboard();
    renderHistory();
}

function renderHistory() {
    const html = history.length
        ? [...history].reverse().map(item => `
            <div class="history-item">
                <div>
                    <strong>${escapeHTML(item.title)}</strong>
                    <span> · ${item.count} observations</span>
                </div>
                <span>${escapeHTML(item.date)}</span>
            </div>
        `).join("")
        : '<div class="empty-state">No analysis performed yet.</div>';

    $("reportHistory").innerHTML = html;
    $("dashboardHistory").innerHTML = html;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// ==========================================
// 6. DESCRIPTIVE STATISTICS MODULE
// ==========================================

function calculateDescriptive() {
    try {
        const manual = $("manualData").value.trim();

        const values = manual
            ? parseData(manual)
            : getDataset($("descriptiveDataset").value);

        const sample = $("statMethod").value === "sample";

        const stats = calculateStatistics(values, sample);

        lastStatistics = stats;

        $("rMean").textContent = formatNumber(stats.mean);
        $("rMedian").textContent = formatNumber(stats.median);

        $("rMode").textContent = stats.modes.length
            ? stats.modes.map(v => formatNumber(v)).join(", ")
            : "No mode";

        $("rSD").textContent = formatNumber(stats.sd);
        $("rVariance").textContent = formatNumber(stats.variance);
        $("rRange").textContent = formatNumber(stats.range);

        $("rQ1").textContent = formatNumber(stats.q1);
        $("rQ3").textContent = formatNumber(stats.q3);
        $("rIQR").textContent = formatNumber(stats.iqr);

        $("rCV").textContent = stats.cv === null
            ? "Undefined"
            : formatNumber(stats.cv) + "%";

        $("rSkew").textContent = formatNumber(stats.skewness);
        $("rKurt").textContent = formatNumber(stats.kurtosis);

        const skewText =
            stats.skewness > 0.5 ? "positively skewed" :
            stats.skewness < -0.5 ? "negatively skewed" :
            "approximately symmetric";

        const variability = stats.cv === null
            ? "The coefficient of variation is undefined because the mean is zero."
            : `The coefficient of variation is ${formatNumber(stats.cv)}%.`;

        $("interpretation").textContent =
            `Your dataset contains ${stats.n} observations. ` +
            `The mean is ${formatNumber(stats.mean)} and the median is ${formatNumber(stats.median)}. ` +
            `The distribution is ${skewText} based on its moment skewness. ` +
            `The standard deviation is ${formatNumber(stats.sd)}. ` +
            `${variability} ` +
            `${stats.outliers.length} potential outlier(s) were identified using the IQR rule.`;

        recordHistory(
            manual ? "Manual descriptive analysis" : $("descriptiveDataset").value,
            stats
        );

        showToast("Descriptive analysis completed.");

    } catch (error) {
        showToast(error.message);
    }
}

// ==========================================
// 7. DATASET MANAGER
// ==========================================

function addDataset() {
    const name = $("datasetName").value.trim();

    if (!name) {
        showToast("Enter a dataset name.");
        return;
    }

    if (datasets[name]) {
        showToast("A dataset with that name already exists.");
        return;
    }

    let values;

    try {
        values = parseData(
            $("manualData").value || "10, 20, 30, 40, 50"
        );
    } catch (error) {
        showToast(error.message);
        return;
    }

    datasets[name] = values;
    activeDataset = name;

    $("datasetName").value = "";
    $("manualData").value = "";

    saveStorage();
    refreshSelectors();
    renderDatasetManager();
    updateDashboard();

    showToast("Dataset created successfully.");
}

function renderDatasetManager() {
    const rows = Object.entries(datasets).map(([name, values]) => {

        const stats = calculateStatistics(values, false);

        return `
            <tr>
                <td><strong>${escapeHTML(name)}</strong></td>
                <td>${values.length}</td>
                <td>${formatNumber(stats.mean)}</td>
                <td>${formatNumber(stats.sd)}</td>
                <td>
                    <button class="action-btn"
                        onclick="selectDataset('${escapeHTML(name)}')">
                        Edit
                    </button>

                    <button class="action-btn delete-btn"
                        onclick="deleteDataset('${escapeHTML(name)}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    $("datasetTable").innerHTML = rows ||
        '<tr><td colspan="5">No datasets available.</td></tr>';

    $("datasetTotal").textContent =
        Object.keys(datasets).length + " datasets";
}

function selectDataset(name) {
    if (!datasets[name]) return;

    activeDataset = name;

    $("editorDataset").value = name;
    $("editorData").value = datasets[name].join(", ");

    showToast("Dataset selected.");
}

function saveDatasetEdit() {
    const name = $("editorDataset").value;

    if (!name || !datasets[name]) {
        showToast("Select a dataset first.");
        return;
    }

    try {
        datasets[name] = parseData($("editorData").value);

        activeDataset = name;

        saveStorage();
        refreshSelectors();
        renderDatasetManager();
        updateDashboard();

        showToast("Dataset updated.");
    } catch (error) {
        showToast(error.message);
    }
}

function deleteDataset(name) {
    if (!datasets[name]) return;

    if (!confirm(`Delete dataset "${name}"?`)) return;

    delete datasets[name];

    if (activeDataset === name) {
        activeDataset = Object.keys(datasets)[0] || null;
    }

    saveStorage();
    refreshSelectors();
    renderDatasetManager();
    updateDashboard();

    showToast("Dataset deleted.");
}

// ==========================================
// 8. IMPORT CSV / EXCEL
// ==========================================

$("fileInput").addEventListener("change", async event => {

    const file = event.target.files[0];

    if (!file) return;

    try {
        const buffer = await file.arrayBuffer();

        const workbook = XLSX.read(buffer, {
            type: "array"
        });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
            defval: ""
        });

        if (!rows.length) {
            throw new Error("The file is empty.");
        }

        let columnIndex = 0;

        // Choose a numeric column, skipping a possible header.

        const candidates = Math.max(...rows.map(row => row.length));

        for (let c = 0; c < candidates; c++) {
            const validCount = rows.filter(row =>
                row[c] !== "" &&
                row[c] !== null &&
                Number.isFinite(Number(row[c]))
            ).length;

            if (validCount > 0) {
                columnIndex = c;
                break;
            }
        }

        const values = rows
            .map(row => row[columnIndex])
            .filter(v => v !== "" && v !== null && v !== undefined)
            .filter(v => Number.isFinite(Number(v)))
            .map(Number);

        if (!values.length) {
            throw new Error("No numeric values found in the file.");
        }

        const name = file.name.replace(/\.[^/.]+$/, "");

        let finalName = name;
        let counter = 1;

        while (datasets[finalName]) {
            finalName = `${name} (${counter++})`;
        }

        datasets[finalName] = values;
        activeDataset = finalName;

        saveStorage();
        refreshSelectors();
        renderDatasetManager();
        updateDashboard();

        showToast(`Imported ${values.length} values.`);

    } catch (error) {
        showToast("Import failed: " + error.message);
    }

    event.target.value = "";
});

// ==========================================
// 9. SELECTOR MANAGEMENT
// ==========================================

function refreshSelectors() {

    const names = Object.keys(datasets);

    const selectors = [
        "descriptiveDataset",
        "distributionDataset",
        "editorDataset",
        "compareA",
        "compareB"
    ];

    selectors.forEach(id => {

        const element = $(id);
        const previous = element.value;

        element.innerHTML = "";

        names.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            element.appendChild(option);
        });

        if (names.includes(previous)) {
            element.value = previous;
        } else if (names.includes(activeDataset)) {
            element.value = activeDataset;
        }
    });

    if ($("compareB").value === $("compareA").value && names.length > 1) {
        $("compareB").selectedIndex = 1;
    }

    if (activeDataset && datasets[activeDataset]) {
        $("editorDataset").value = activeDataset;
        $("editorData").value = datasets[activeDataset].join(", ");
    }
}

// ==========================================
// 10. CHART MANAGEMENT
// ==========================================

function destroyChart(id) {
    if (chartInstances[id]) {
        chartInstances[id].destroy();
        delete chartInstances[id];
    }
}

function createChart(id, config) {
    destroyChart(id);

    chartInstances[id] = new Chart($(id), config);

    return chartInstances[id];
}

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: COLORS.espresso,
                font: {
                    family: "DM Sans"
                }
            }
        }
    },
    scales: {
        x: {
            ticks: { color: COLORS.espresso },
            grid: { color: "#EAE1D9" }
        },
        y: {
            ticks: { color: COLORS.espresso },
            grid: { color: "#EAE1D9" }
        }
    }
};

// ==========================================
// 11. HISTOGRAM
// ==========================================

function createHistogram(values) {

    const min = Math.min(...values);
    const max = Math.max(...values);

    const binCount = Math.min(
        20,
        Math.max(1, Math.ceil(Math.sqrt(values.length)))
    );

    const width = (max - min) / binCount || 1;

    const frequencies = Array(binCount).fill(0);

    values.forEach(value => {
        const index = Math.min(
            binCount - 1,
            Math.floor((value - min) / width)
        );

        frequencies[index]++;
    });

    const labels = frequencies.map((_, i) => {
        const start = min + i * width;
        const end = i === binCount - 1
            ? max
            : start + width;

        return `${formatNumber(start, 2)}–${formatNumber(end, 2)}`;
    });

    return { labels, frequencies };
}

// ==========================================
// 12. DISTRIBUTION ANALYSIS
// ==========================================

function renderDistribution() {

    try {
        const name = $("distributionDataset").value;
        const values = getDataset(name);
        const stats = calculateStatistics(values, false);

        const histogram = createHistogram(values);

        createChart("histogramChart", {
            type: "bar",
            data: {
                labels: histogram.labels,
                datasets: [{
                    label: "Frequency",
                    data: histogram.frequencies,
                    backgroundColor: COLORS.emerald,
                    borderRadius: 5
                }]
            },
            options: {
                ...commonChartOptions,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    ...commonChartOptions.scales,
                    x: {
                        ...commonChartOptions.scales.x,
                        title: {
                            display: true,
                            text: "Value intervals"
                        }
                    },
                    y: {
                        ...commonChartOptions.scales.y,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Frequency"
                        }
                    }
                }
            }
        });

        // Five-number summary visualization

        const fiveNumbers = [
            stats.min,
            stats.q1,
            stats.median,
            stats.q3,
            stats.max
        ];

        createChart("boxChart", {
            type: "scatter",
            data: {
                datasets: [{
                    label: "Five-number summary",
                    data: fiveNumbers.map((x, index) => ({
                        x,
                        y: index + 1
                    })),
                    backgroundColor: [
                        COLORS.espresso,
                        COLORS.rose,
                        COLORS.emerald,
                        COLORS.rose,
                        COLORS.espresso
                    ],
                    pointRadius: 7,
                    pointHoverRadius: 10
                }]
            },
            options: {
                ...commonChartOptions,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context =>
                                `Value: ${formatNumber(context.raw.x)}`
                        }
                    }
                },
                scales: {
                    x: {
                        ...commonChartOptions.scales.x,
                        title: {
                            display: true,
                            text: "Data value"
                        }
                    },
                    y: {
                        min: 0,
                        max: 6,
                        ticks: {
                            stepSize: 1,
                            callback: value => ({
                                1: "Minimum",
                                2: "Q1",
                                3: "Median",
                                4: "Q3",
                                5: "Maximum"
                            })[value] || ""
                        }
                    }
                }
            }
        });

        $("lowerFence").textContent = formatNumber(stats.lowerFence);
        $("upperFence").textContent = formatNumber(stats.upperFence);
        $("outlierCount").textContent = stats.outliers.length;

        $("outlierList").textContent = stats.outliers.length
            ? "Potential outliers: " + stats.outliers.join(", ")
            : "No potential outliers were detected using the 1.5 × IQR rule.";

        showToast("Distribution analysis generated.");

        recordHistory(name + " distribution analysis", stats);

    } catch (error) {
        showToast(error.message);
    }
}

// ==========================================
// 13. CORRELATION & REGRESSION
// ==========================================

function calculateCorrelation() {

    try {
        const x = parseData($("xData").value);
        const y = parseData($("yData").value);

        if (x.length !== y.length || x.length < 2) {
            throw new Error("X and Y must contain equal numbers of observations (at least 2).");
        }

        const meanX = average(x);
        const meanY = average(y);

        let numerator = 0;
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < x.length; i++) {

            const dx = x[i] - meanX;
            const dy = y[i] - meanY;

            numerator += dx * dy;
            sumX += dx * dx;
            sumY += dy * dy;
        }

        if (sumX === 0 || sumY === 0) {
            throw new Error("Correlation is undefined for a constant dataset.");
        }

        const r = numerator / Math.sqrt(sumX * sumY);

        const slope = numerator / sumX;
        const intercept = meanY - slope * meanX;

        const r2 = r * r;

        $("corrR").textContent = formatNumber(r);
        $("regSlope").textContent = formatNumber(slope);
        $("regIntercept").textContent = formatNumber(intercept);
        $("regR2").textContent = formatNumber(r2);

        const minX = Math.min(...x);
        const maxX = Math.max(...x);

        const line = [
            { x: minX, y: slope * minX + intercept },
            { x: maxX, y: slope * maxX + intercept }
        ];

        createChart("scatterChart", {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "Observations",
                        data: x.map((value, index) => ({
                            x: value,
                            y: y[index]
                        })),
                        backgroundColor: COLORS.emerald,
                        pointRadius: 6
                    },
                    {
                        label: "Regression line",
                        data: line,
                        type: "line",
                        borderColor: COLORS.rose,
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: commonChartOptions
        });

        const strength =
            Math.abs(r) >= 0.7 ? "strong" :
            Math.abs(r) >= 0.4 ? "moderate" :
            Math.abs(r) >= 0.2 ? "weak" :
            "very weak";

        const direction =
            r > 0 ? "positive" : "negative";

        $("correlationInterpretation").textContent =
            `The variables have a ${strength} ${direction} linear association. ` +
            `Pearson's r is ${formatNumber(r)}. ` +
            `The coefficient of determination is ${formatNumber(r2)}, ` +
            `meaning approximately ${(r2 * 100).toFixed(1)}% of the observed variation in Y ` +
            `is accounted for by the fitted linear relationship in this dataset. ` +
            `This association does not establish causation.`;

        recordHistory("Correlation and regression", {
            n: x.length,
            mean: meanY,
            sd: Math.sqrt(sumY / x.length)
        });

        showToast("Regression analysis completed.");

    } catch (error) {
        showToast(error.message);
    }
}

// ==========================================
// 14. DATASET COMPARISON
// ==========================================

function compareDatasets() {

    try {
        const nameA = $("compareA").value;
        const nameB = $("compareB").value;

        if (!nameA || !nameB || nameA === nameB) {
            throw new Error("Select two different datasets.");
        }

        const a = calculateStatistics(getDataset(nameA), false);
        const b = calculateStatistics(getDataset(nameB), false);

        $("compareTitleA").textContent = nameA;
        $("compareTitleB").textContent = nameB;

        const metrics = [
            ["Observations", a.n, b.n],
            ["Mean", a.mean, b.mean],
            ["Median", a.median, b.median],
            ["Standard Deviation", a.sd, b.sd],
            ["Variance", a.variance, b.variance],
            ["Minimum", a.min, b.min],
            ["Maximum", a.max, b.max],
            ["Range", a.range, b.range],
            ["Q1", a.q1, b.q1],
            ["Q3", a.q3, b.q3],
            ["IQR", a.iqr, b.iqr]
        ];

        $("comparisonTable").innerHTML = metrics.map(row => `
            <tr>
                <td>${escapeHTML(row[0])}</td>
                <td>${formatNumber(row[1])}</td>
                <td>${formatNumber(row[2])}</td>
            </tr>
        `).join("");

        createChart("comparisonChart", {
            type: "bar",
            data: {
                labels: ["Mean", "Standard Deviation"],
                datasets: [
                    {
                        label: nameA,
                        data: [a.mean, a.sd],
                        backgroundColor: COLORS.emerald,
                        borderRadius: 5
                    },
                    {
                        label: nameB,
                        data: [b.mean, b.sd],
                        backgroundColor: COLORS.rose,
                        borderRadius: 5
                    }
                ]
            },
            options: commonChartOptions
        });

        recordHistory("Comparison: " + nameA + " vs " + nameB, a);

        showToast("Dataset comparison completed.");

    } catch (error) {
        showToast(error.message);
    }
}

// ==========================================
// 15. DASHBOARD
// ==========================================

function updateDashboard() {

    const names = Object.keys(datasets);

    const totalPoints = Object.values(datasets)
        .reduce((sum, data) => sum + data.length, 0);

    $("dashDatasets").textContent = names.length;
    $("dashPoints").textContent = totalPoints;

    if (activeDataset && datasets[activeDataset]) {

        const stats = calculateStatistics(
            datasets[activeDataset],
            false
        );

        $("dashMean").textContent = formatNumber(stats.mean);
        $("dashSD").textContent = formatNumber(stats.sd);

    } else {
        $("dashMean").textContent = "—";
        $("dashSD").textContent = "—";
    }

    $("dashboardHistory").innerHTML = history.length
        ? [...history].reverse().slice(0, 5).map(item => `
            <div class="history-item">
                <strong>${escapeHTML(item.title)}</strong>
                <span>${escapeHTML(item.date)}</span>
            </div>
        `).join("")
        : '<div class="empty-state">No analysis performed yet.</div>';
}

// ==========================================
// 16. CSV EXPORT
// ==========================================

function downloadFile(content, filename, type) {

    const blob = new Blob([content], { type });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

function getReportRows() {

    const rows = [
        ["Dataset", "Observations", "Mean", "Median",
         "Mode", "Variance", "Standard Deviation",
         "Minimum", "Maximum", "Range", "Q1", "Q3",
         "IQR", "CV", "Skewness", "Excess Kurtosis"]
    ];

    Object.entries(datasets).forEach(([name, values]) => {

        const s = calculateStatistics(values, false);

        rows.push([
            name,
            s.n,
            s.mean,
            s.median,
            s.modes.join(", ") || "No mode",
            s.variance,
            s.sd,
            s.min,
            s.max,
            s.range,
            s.q1,
            s.q3,
            s.iqr,
            s.cv === null ? "Undefined" : s.cv,
            s.skewness,
            s.kurtosis
        ]);
    });

    return rows;
}

function exportCSV() {

    try {
        const rows = getReportRows();

        const csv = rows.map(row =>
            row.map(value =>
                '"' + String(value).replace(/"/g, '""') + '"'
            ).join(",")
        ).join("\n");

        downloadFile(
            "\uFEFF" + csv,
            "STATSPACE_Analysis.csv",
            "text/csv;charset=utf-8;"
        );

        showToast("CSV report exported.");

    } catch (error) {
        showToast(error.message);
    }
}

// ==========================================
// 17. EXCEL EXPORT
// ==========================================

function exportExcel() {

    try {
        const rows = getReportRows();

        const worksheet = XLSX.utils.aoa_to_sheet(rows);

        worksheet["!cols"] = rows[0].map(() => ({
            wch: 20
        }));

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Statistical Analysis"
        );

        XLSX.writeFile(workbook, "STATSPACE_Report.xlsx");

        showToast("Excel report exported.");

    } catch (error) {
        showToast(error.message);
    }
}

// ==========================================
// 18. PDF REPORT
// ==========================================

function exportPDF() {

    try {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();

        const rows = getReportRows();

        pdf.setFillColor(7, 91, 70);
        pdf.rect(0, 0, 210, 35, "F");

        pdf.setTextColor(255, 255, 255);

        pdf.setFontSize(20);
        pdf.text("STATSPACE 2.0", 15, 16);

        pdf.setFontSize(10);
        pdf.text("STATISTICAL ANALYSIS REPORT", 15, 25);

        pdf.setTextColor(73, 53, 46);
        pdf.setFontSize(10);

        pdf.text(
            "Generated: " + new Date().toLocaleString(),
            15,
            45
        );

        let y = 60;

        rows.forEach((row, index) => {

            if (y > 275) {
                pdf.addPage();
                y = 20;
            }

            if (index === 0) {
                pdf.setFont(undefined, "bold");
                pdf.setTextColor(7, 91, 70);
            } else {
                pdf.setFont(undefined, "normal");
                pdf.setTextColor(73, 53, 46);
            }

            const line = row.map(value => String(value)).join(" | ");

            const wrapped = pdf.splitTextToSize(line, 180);

            pdf.text(wrapped, 15, y);

            y += wrapped.length * 6 + 3;
        });

        pdf.setFontSize(9);
        pdf.setTextColor(120, 110, 100);

        pdf.text(
            "STATSPACE 2.0 | Statistical Analysis Workspace",
            15,
            287
        );

        pdf.save("STATSPACE_Analysis_Report.pdf");

        showToast("PDF report generated.");

    } catch (error) {
        showToast("PDF export failed: " + error.message);
    }
}

// ==========================================
// 19. INITIAL APPLICATION STARTUP
// ==========================================

function initializeApp() {

    loadStorage();

    refreshSelectors();

    renderDatasetManager();

    updateDashboard();

    renderHistory();

    showPage("dashboard");
}

initializeApp();
