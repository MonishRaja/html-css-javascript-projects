
/* ==================================
   FLOW STUDIO 2.0
   UNIVERSAL SANKEY GENERATOR
================================== */

// Sample datasets

const sampleData = {

    A: [
        { source: "Website Visitors", target: "Homepage", value: 1000, color: "#A64D79" },
        { source: "Homepage", target: "Product Page", value: 600, color: "#C27BA0" },
        { source: "Homepage", target: "Exit", value: 400, color: "#D9A6BC" },
        { source: "Product Page", target: "Purchase", value: 350, color: "#6B0F2D" },
        { source: "Product Page", target: "Cart Abandonment", value: 250, color: "#E6B8C7" }
    ],

    B: [
        { source: "Website Visitors", target: "Homepage", value: 1200, color: "#A64D79" },
        { source: "Homepage", target: "Product Page", value: 800, color: "#C27BA0" },
        { source: "Homepage", target: "Exit", value: 400, color: "#D9A6BC" },
        { source: "Product Page", target: "Purchase", value: 500, color: "#6B0F2D" },
        { source: "Product Page", target: "Cart Abandonment", value: 300, color: "#E6B8C7" }
    ]

};

let currentScenario = "A";

let data = {
    A: structuredClone(sampleData.A),
    B: structuredClone(sampleData.B)
};

let nodeColorMap = {
    A: {},
    B: {}
};

const defaultNodeColor = "#6B0F2D";

const scenarioNames = {
    A: "Scenario A",
    B: "Scenario B"
};


/* ==================================
   INITIALIZATION
================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderTable();
    renderNodeColors();

    generateAll();

});


/* ==================================
   SCENARIO SWITCHING
================================== */

function switchScenario(scenario) {

    currentScenario = scenario;

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    const tabs = document.querySelectorAll(".tab");

    tabs[scenario === "A" ? 0 : 1].classList.add("active");

    renderTable();
    renderNodeColors();

}


/* ==================================
   TABLE RENDERING
================================== */

function renderTable() {

    const table = document.getElementById("dataTable");

    table.innerHTML = "";

    data[currentScenario].forEach((item, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <input type="text"
                    value="${escapeAttr(item.source)}"
                    onfocus="this.select()"
                    onchange="updateRow(${index}, 'source', this.value)">
            </td>

            <td>
                <input type="text"
                    value="${escapeAttr(item.target)}"
                    onfocus="this.select()"
                    onchange="updateRow(${index}, 'target', this.value)">
            </td>

            <td>
                <input type="number"
                    min="0"
                    step="any"
                    value="${item.value}"
                    onfocus="this.select()"
                    onchange="updateRow(${index}, 'value', this.value)">
            </td>

            <td>
                <input type="color"
                    value="${item.color}"
                    onchange="updateRow(${index}, 'color', this.value)">
            </td>

            <td>
                <button class="delete-btn"
                    onclick="removeRow(${index})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

    });

}

function escapeAttr(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}


/* ==================================
   UPDATE ROW
================================== */

function updateRow(index, key, value) {

    if (key === "value") {

        const number = Number(value);

        if (!Number.isFinite(number) || number <= 0) {
            alert("Flow value must be a positive number.");
            renderTable();
            return;
        }

        value = number;

    }

    data[currentScenario][index][key] = value;

    renderNodeColors();

}


/* ==================================
   ADD ROW
================================== */

function addRow() {

    data[currentScenario].push({

        source: "New Source",
        target: "New Target",
        value: 100,
        color: "#C27BA0"

    });

    renderTable();
    renderNodeColors();

}


/* ==================================
   REMOVE ROW
================================== */

function removeRow(index) {

    data[currentScenario].splice(index, 1);

    renderTable();
    renderNodeColors();

}


/* ==================================
   LOAD SAMPLE DATA
================================== */

function loadSample() {

    data[currentScenario] = structuredClone(
        sampleData[currentScenario]
    );

    nodeColorMap[currentScenario] = {};

    renderTable();
    renderNodeColors();

    generateAll();

}


/* ==================================
   NODE COLOR CUSTOMIZATION
================================== */

function getNodes(scenario) {

    const nodes = new Set();

    data[scenario].forEach(item => {

        nodes.add(item.source);
        nodes.add(item.target);

    });

    return [...nodes];

}


function renderNodeColors() {

    const container = document.getElementById("nodeColors");

    container.innerHTML = "";

    const nodes = getNodes(currentScenario);

    nodes.forEach(node => {

        if (!nodeColorMap[currentScenario][node]) {

            nodeColorMap[currentScenario][node] = defaultNodeColor;

        }

        const color = nodeColorMap[currentScenario][node];

        const element = document.createElement("div");

        element.className = "node-color";

        const label = document.createElement("label");
        label.textContent = node;

        const picker = document.createElement("input");

        picker.type = "color";
        picker.value = color;

        picker.addEventListener("input", event => {

            nodeColorMap[currentScenario][node] = event.target.value;

        });

        picker.addEventListener("change", () => {

            generateOne(currentScenario);

        });

        element.appendChild(label);
        element.appendChild(picker);

        container.appendChild(element);

    });

}


/* ==================================
   DATA VALIDATION
================================== */

function validateData(scenario) {

    const rows = data[scenario];

    if (rows.length === 0) {

        throw new Error(
            `${scenarioNames[scenario]} has no flow data.`
        );

    }

    rows.forEach((item, index) => {

        if (!item.source.trim() || !item.target.trim()) {

            throw new Error(
                `Missing source or target in row ${index + 1}.`
            );

        }

        if (
            !Number.isFinite(Number(item.value)) ||
            Number(item.value) <= 0
        ) {

            throw new Error(
                `Invalid flow value in row ${index + 1}.`
            );

        }

        if (item.source.trim() === item.target.trim()) {

            throw new Error(
                `Source and target cannot be identical in row ${index + 1}.`
            );

        }

    });

    // Detect circular connections

    const graph = {};

    rows.forEach(item => {

        const source = item.source.trim();
        const target = item.target.trim();

        if (!graph[source]) {
            graph[source] = [];
        }

        graph[source].push(target);

    });

    const visited = new Set();
    const active = new Set();

    function visit(node) {

        if (active.has(node)) {
            return true;
        }

        if (visited.has(node)) {
            return false;
        }

        visited.add(node);
        active.add(node);

        for (const next of graph[node] || []) {

            if (visit(next)) {
                return true;
            }

        }

        active.delete(node);

        return false;

    }

    for (const node of Object.keys(graph)) {

        if (visit(node)) {

            throw new Error(
                "Circular flow detected. Please remove the circular connection."
            );

        }

    }

}


/* ==================================
   GENERATE ONE SANKEY DIAGRAM
================================== */

function generateOne(scenario) {

    validateData(scenario);

    const rows = data[scenario];

    const nodes = getNodes(scenario);

    const nodeIndex = {};

    nodes.forEach((node, index) => {

        nodeIndex[node] = index;

    });

    const source = [];
    const target = [];
    const value = [];
    const linkColors = [];

    rows.forEach(item => {

        source.push(nodeIndex[item.source.trim()]);
        target.push(nodeIndex[item.target.trim()]);
        value.push(Number(item.value));
        linkColors.push(item.color);

    });

    const nodeColors = nodes.map(node => {

        return nodeColorMap[scenario][node] || defaultNodeColor;

    });

    const chartData = [{

        type: "sankey",

        arrangement: "snap",

        node: {

            pad: 20,
            thickness: 20,

            line: {
                color: "#6B0F2D",
                width: 0.5
            },

            label: nodes,
            color: nodeColors,

            hovertemplate:
                "%{label}<extra></extra>"

        },

        link: {

            source: source,
            target: target,
            value: value,
            color: linkColors,

            hovertemplate:
                "%{source.label} → %{target.label}<br>" +
                "Flow Value: %{value}<extra></extra>"

        }

    }];

    const layout = {

        title: {
            text: scenarioNames[scenario],
            font: {
                color: "#6B0F2D",
                size: 17
            }
        },

        font: {
            family: "Arial",
            size: 12,
            color: "#321521"
        },

        paper_bgcolor: "#FFFFFF",
        plot_bgcolor: "#FFFFFF",

        margin: {
            l: 20,
            r: 20,
            t: 50,
            b: 20
        },

        autosize: true

    };

    Plotly.react(
        "chart" + scenario,
        chartData,
        layout,
        {
            responsive: true,
            displaylogo: false
        }
    );

    return calculateStats(scenario);

}


/* ==================================
   STATISTICS
================================== */

function calculateStats(scenario) {

    const rows = data[scenario];

    const totalFlow = rows.reduce(
        (sum, item) => sum + Number(item.value),
        0
    );

    const nodes = getNodes(scenario);

    return {

        totalFlow: totalFlow,
        totalNodes: nodes.length,
        connections: rows.length

    };

}


/* ==================================
   GENERATE BOTH DIAGRAMS
================================== */

function generateAll() {

    try {

        const statsA = generateOne("A");
        const statsB = generateOne("B");

        updateDashboard(statsA, statsB);

        document.getElementById("flowA").textContent =
            formatNumber(statsA.totalFlow);

        document.getElementById("flowB").textContent =
            formatNumber(statsB.totalFlow);

        document.getElementById("connectionsA").textContent =
            statsA.connections;

        document.getElementById("connectionsB").textContent =
            statsB.connections;

        const difference =
            statsB.totalFlow - statsA.totalFlow;

        let result;

        if (difference > 0) {

            result =
                `Scenario B has ${formatNumber(Math.abs(difference))} ` +
                `more total link volume than Scenario A.`;

        } else if (difference < 0) {

            result =
                `Scenario A has ${formatNumber(Math.abs(difference))} ` +
                `more total link volume than Scenario B.`;

        } else {

            result =
                "Both scenarios have the same total link volume.";

        }

        document.getElementById("comparisonResult").textContent =
            result;

    } catch (error) {

        alert(error.message);

    }

}


/* ==================================
   DASHBOARD UPDATE
================================== */

function updateDashboard(statsA, statsB) {

    const allNodes = new Set([
        ...getNodes("A"),
        ...getNodes("B")
    ]);

    const totalConnections =
        statsA.connections + statsB.connections;

    const totalFlow =
        statsA.totalFlow + statsB.totalFlow;

    document.getElementById("totalNodes").textContent =
        allNodes.size;

    document.getElementById("totalConnections").textContent =
        totalConnections;

    document.getElementById("totalFlow").textContent =
        formatNumber(totalFlow);

}


/* ==================================
   NUMBER FORMATTING
================================== */

function formatNumber(number) {

    return Number(number).toLocaleString(
        undefined,
        { maximumFractionDigits: 2 }
    );

}


/* ==================================
   EXPORT PNG / SVG
================================== */

function exportChart(scenario, format) {

    const chart = document.getElementById("chart" + scenario);

    if (!chart.data) {

        alert("Please generate the diagram first.");
        return;

    }

    Plotly.downloadImage(chart, {

        format: format,

        filename: `Flow_Studio_Scenario_${scenario}`,

        width: 1400,
        height: 900,
        scale: 2

    });

}


/* ==================================
   PDF REPORT
================================== */

async function downloadPDF() {

    try {

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();

        pdf.setFillColor(107, 15, 45);
        pdf.rect(0, 0, pageWidth, 40, "F");

        pdf.setTextColor(255, 255, 255);

        pdf.setFontSize(22);

        pdf.text(
            "Flow Studio 2.0",
            15,
            19
        );

        pdf.setFontSize(11);

        pdf.text(
            "Universal Flow Visualization Report",
            15,
            28
        );

        pdf.setTextColor(50, 21, 33);

        pdf.setFontSize(15);

        pdf.text(
            "Scenario Summary",
            15,
            55
        );

        const statsA = calculateStats("A");
        const statsB = calculateStats("B");

        pdf.setFontSize(11);

        const summary = [

            `Scenario A - Total Link Volume: ${formatNumber(statsA.totalFlow)}`,

            `Scenario A - Nodes: ${statsA.totalNodes}`,

            `Scenario A - Connections: ${statsA.connections}`,

            `Scenario B - Total Link Volume: ${formatNumber(statsB.totalFlow)}`,

            `Scenario B - Nodes: ${statsB.totalNodes}`,

            `Scenario B - Connections: ${statsB.connections}`

        ];

        let y = 68;

        summary.forEach(line => {

            pdf.text(line, 15, y);

            y += 9;

        });

        // Scenario A chart

        pdf.addPage();

        pdf.setFontSize(16);
        pdf.setTextColor(107, 15, 45);

        pdf.text("Scenario A Diagram", 15, 20);

        const chartA = await Plotly.toImage(
            document.getElementById("chartA"),
            {
                format: "png",
                width: 1200,
                height: 700
            }
        );

        pdf.addImage(
            chartA,
            "PNG",
            10,
            30,
            190,
            115
        );

        // Scenario B chart

        pdf.addPage();

        pdf.setFontSize(16);

        pdf.text("Scenario B Diagram", 15, 20);

        const chartB = await Plotly.toImage(
            document.getElementById("chartB"),
            {
                format: "png",
                width: 1200,
                height: 700
            }
        );

        pdf.addImage(
            chartB,
            "PNG",
            10,
            30,
            190,
            115
        );

        // Data tables

        for (const scenario of ["A", "B"]) {

            pdf.addPage();

            pdf.setFontSize(16);
            pdf.setTextColor(107, 15, 45);

            pdf.text(
                `${scenarioNames[scenario]} - Flow Data`,
                15,
                20
            );

            let tableY = 35;

            pdf.setFontSize(10);
            pdf.setTextColor(50, 21, 33);

            pdf.text("Source", 15, tableY);
            pdf.text("Target", 85, tableY);
            pdf.text("Value", 165, tableY);

            tableY += 8;

            pdf.setDrawColor(107, 15, 45);
            pdf.line(15, tableY - 5, 195, tableY - 5);

            data[scenario].forEach(item => {

                if (tableY > 275) {

                    pdf.addPage();
                    tableY = 20;

                }

                pdf.text(
                    pdf.splitTextToSize(item.source, 60),
                    15,
                    tableY
                );

                pdf.text(
                    pdf.splitTextToSize(item.target, 70),
                    85,
                    tableY
                );

                pdf.text(
                    formatNumber(item.value),
                    165,
                    tableY
                );

                tableY += 10;

            });

        }

        pdf.save("Flow_Studio_Report.pdf");

    } catch (error) {

        console.error(error);

        alert(
            "Unable to generate the PDF report. Please try again."
        );

    }

}
