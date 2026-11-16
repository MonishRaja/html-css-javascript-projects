
// ==========================================
// GLOBAL CALCULATION DATA
// ==========================================

let calculation = null;


// ==========================================
// ANGLE REDUCTION
// ==========================================

function reduceAngle(x) {
    return ((x + Math.PI) % (2 * Math.PI) +
        2 * Math.PI) % (2 * Math.PI) - Math.PI;
}


// ==========================================
// SINE SERIES
// ==========================================

function sineSeries(x, terms) {

    let sum = 0;
    let term = x;
    let partialSums = [];

    for (let i = 0; i < terms; i++) {

        if (i > 0) {
            term *= -(x * x) /
                ((2 * i) * (2 * i + 1));
        }

        sum += term;
        partialSums.push(sum);
    }

    return {
        value: sum,
        partialSums: partialSums
    };
}


// ==========================================
// COSINE SERIES
// ==========================================

function cosineSeries(x, terms) {

    let sum = 0;
    let term = 1;
    let partialSums = [];

    for (let i = 0; i < terms; i++) {

        if (i > 0) {
            term *= -(x * x) /
                ((2 * i - 1) * (2 * i));
        }

        sum += term;
        partialSums.push(sum);
    }

    return {
        value: sum,
        partialSums: partialSums
    };
}


// ==========================================
// TANGENT SERIES
// ==========================================

function tangentSeries(x, terms) {

    let sin = sineSeries(x, terms).value;
    let cos = cosineSeries(x, terms).value;

    if (Math.abs(cos) < 1e-12) {
        return null;
    }

    return sin / cos;
}


// ==========================================
// MAIN CALCULATION FUNCTION
// ==========================================

function calculateSeries() {

    let angleInput =
        document.getElementById("angle").value;

    let termsInput =
        document.getElementById("terms").value;

    let error =
        document.getElementById("error");

    error.textContent = "";

    if (angleInput.trim() === "" ||
        termsInput.trim() === "") {

        error.textContent =
            "Please enter both angle and terms.";

        return;
    }

    let angle = Number(angleInput);
    let terms = Number(termsInput);

    if (!Number.isFinite(angle)) {

        error.textContent =
            "Please enter a valid angle.";

        return;
    }

    if (!Number.isInteger(terms) ||
        terms < 1 || terms > 30) {

        error.textContent =
            "Enter between 1 and 30 terms.";

        return;
    }

    // Convert degrees into radians

    let x = reduceAngle(angle * Math.PI / 180);

    // Calculate Taylor series

    let sine = sineSeries(x, terms);

    let cosine = cosineSeries(x, terms);

    let tangent = tangentSeries(x, terms);

    // Actual mathematical values

    let actualSine = Math.sin(x);

    let actualCosine = Math.cos(x);

    let actualTangent = Math.tan(x);

    // Store all results

    calculation = {

        angle: angle,
        terms: terms,
        radians: x,

        sine: sine.value,
        cosine: cosine.value,
        tangent: tangent,

        actualSine: actualSine,
        actualCosine: actualCosine,
        actualTangent: actualTangent,

        sineError:
            Math.abs(sine.value - actualSine),

        cosineError:
            Math.abs(cosine.value - actualCosine),

        tangentError:
            tangent === null ? null :
            Math.abs(tangent - actualTangent),

        sinePartial: sine.partialSums,
        cosinePartial: cosine.partialSums
    };

    displayResults();

    drawConvergence();
}


// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults() {

    document.getElementById("sineResult")
        .textContent = calculation.sine.toFixed(10);

    document.getElementById("cosResult")
        .textContent = calculation.cosine.toFixed(10);

    document.getElementById("tanResult")
        .textContent =
        calculation.tangent === null
        ? "Undefined"
        : calculation.tangent.toFixed(10);


    document.getElementById("sineError")
        .textContent =
        "Absolute error: " +
        calculation.sineError.toExponential(4);


    document.getElementById("cosError")
        .textContent =
        "Absolute error: " +
        calculation.cosineError.toExponential(4);


    document.getElementById("tanError")
        .textContent =
        calculation.tangentError === null
        ? "Absolute error: Not available"
        : "Absolute error: " +
        calculation.tangentError.toExponential(4);
}


// ==========================================
// CANVAS PREPARATION
// ==========================================

function prepareCanvas(canvas) {

    let rect = canvas.getBoundingClientRect();

    let ratio = window.devicePixelRatio || 1;

    canvas.width =
        Math.max(1, Math.round(rect.width * ratio));

    canvas.height =
        Math.max(1, Math.round(rect.height * ratio));

    let ctx = canvas.getContext("2d");

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    return {
        ctx: ctx,
        width: rect.width,
        height: rect.height
    };
}


// ==========================================
// DRAW GRAPH GRID
// ==========================================

function drawGrid(
    ctx,
    width,
    height,
    xMin,
    xMax,
    yMin,
    yMax
) {

    ctx.strokeStyle = "#49333D";

    ctx.lineWidth = 1;

    ctx.fillStyle = "#A99AA1";

    ctx.font = "11px Arial";

    let left = 42;
    let right = width - 12;
    let top = 15;
    let bottom = height - 30;

    // Vertical grid lines

    for (let i = 0; i <= 8; i++) {

        let x = left +
            (right - left) * i / 8;

        ctx.beginPath();

        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);

        ctx.stroke();

        let value =
            xMin + (xMax - xMin) * i / 8;

        ctx.fillText(
            value.toFixed(1),
            x - 12,
            bottom + 17
        );
    }

    // Horizontal grid lines

    for (let i = 0; i <= 6; i++) {

        let y = top +
            (bottom - top) * i / 6;

        ctx.beginPath();

        ctx.moveTo(left, y);
        ctx.lineTo(right, y);

        ctx.stroke();

        let value =
            yMax - (yMax - yMin) * i / 6;

        ctx.fillText(
            value.toFixed(1),
            3,
            y + 4
        );
    }

    return {
        left,
        right,
        top,
        bottom
    };
}


// ==========================================
// INTERACTIVE TRIGONOMETRIC GRAPH
// ==========================================

function drawFunctionGraph() {

    let canvas =
        document.getElementById("functionGraph");

    let { ctx, width, height } =
        prepareCanvas(canvas);

    if (width <= 0 || height <= 0) return;

    const xMin = -2 * Math.PI;
    const xMax = 2 * Math.PI;

    const yMin = -3;
    const yMax = 3;

    let area = drawGrid(
        ctx,
        width,
        height,
        xMin,
        xMax,
        yMin,
        yMax
    );

    function px(x) {

        return area.left +
            (x - xMin) / (xMax - xMin) *
            (area.right - area.left);
    }

    function py(y) {

        return area.top +
            (yMax - y) / (yMax - yMin) *
            (area.bottom - area.top);
    }

    // Function plotting

    function plot(fn, color, breakTangent = false) {

        ctx.strokeStyle = color;

        ctx.lineWidth = 2.2;

        ctx.beginPath();

        let started = false;
        let previousY = null;

        for (let i = 0; i <= 1000; i++) {

            let x = xMin +
                (xMax - xMin) * i / 1000;

            let y = fn(x);

            let valid =
                Number.isFinite(y) &&
                Math.abs(y) <= yMax &&
                !(breakTangent &&
                previousY !== null &&
                Math.abs(y - previousY) > 1.5);

            if (valid) {

                if (!started) {

                    ctx.moveTo(px(x), py(y));

                    started = true;

                } else {

                    ctx.lineTo(px(x), py(y));
                }

            } else {

                ctx.stroke();

                ctx.beginPath();

                started = false;
            }

            previousY = y;
        }

        ctx.stroke();
    }

    // X and Y axes

    ctx.strokeStyle = "#A99AA1";

    ctx.lineWidth = 1.2;

    ctx.beginPath();

    ctx.moveTo(area.left, py(0));
    ctx.lineTo(area.right, py(0));

    ctx.moveTo(px(0), area.top);
    ctx.lineTo(px(0), area.bottom);

    ctx.stroke();

    // Draw three functions

    plot(Math.sin, "#E8B4C6");

    plot(Math.cos, "#7CC8B4");

    plot(Math.tan, "#D9A441", true);
}


// ==========================================
// SERIES CONVERGENCE GRAPH
// ==========================================

function drawConvergence() {

    let canvas =
        document.getElementById("convergenceGraph");

    let description =
        document.getElementById("convergenceDescription");

    if (!calculation) {

        description.textContent =
            "Calculate an angle to view its convergence.";

        let { ctx, width, height } =
            prepareCanvas(canvas);

        ctx.clearRect(0, 0, width, height);

        return;
    }

    let type =
        document.getElementById("convergenceType").value;

    let isSine = type === "sine";

    let partial = isSine
        ? calculation.sinePartial
        : calculation.cosinePartial;

    let actual = isSine
        ? calculation.actualSine
        : calculation.actualCosine;

    description.textContent =
        "Convergence at " + calculation.angle +
        " degrees using " + calculation.terms + " terms.";

    let { ctx, width, height } =
        prepareCanvas(canvas);

    if (width <= 0 || height <= 0) return;

    let values = [...partial, actual];

    let min = Math.min(...values);
    let max = Math.max(...values);

    let range = max - min;

    if (range < 1e-10) {
        range = 0.1;
    }

    min -= range * 0.25;
    max += range * 0.25;

    let area = drawGrid(
        ctx,
        width,
        height,
        0,
        calculation.terms,
        min,
        max
    );

    function px(x) {

        return area.left +
            x / calculation.terms *
            (area.right - area.left);
    }

    function py(y) {

        return area.top +
            (max - y) / (max - min) *
            (area.bottom - area.top);
    }

    // Actual value reference line

    ctx.strokeStyle = "#7CC8B4";

    ctx.lineWidth = 2;

    ctx.setLineDash([6, 5]);

    ctx.beginPath();

    ctx.moveTo(area.left, py(actual));
    ctx.lineTo(area.right, py(actual));

    ctx.stroke();

    ctx.setLineDash([]);

    // Partial sum curve

    ctx.strokeStyle = "#E8B4C6";

    ctx.lineWidth = 2.5;

    ctx.beginPath();

    partial.forEach((value, i) => {

        let x = px(i + 1);
        let y = py(value);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Draw partial sum points

    partial.forEach((value, i) => {

        ctx.fillStyle = "#E8B4C6";

        ctx.beginPath();

        ctx.arc(
            px(i + 1),
            py(value),
            3.5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}


// ==========================================
// CSV DOWNLOAD
// ==========================================

function downloadCSV() {

    if (!calculation) return;

    let rows = [

        ["Trigonometric Series Calculator Report"],

        ["Angle (degrees)", calculation.angle],

        ["Angle (radians)", calculation.radians],

        ["Number of terms", calculation.terms],

        [],

        [
            "Function",
            "Taylor Series Result",
            "Actual Value",
            "Absolute Error"
        ],

        [
            "Sine",
            calculation.sine,
            calculation.actualSine,
            calculation.sineError
        ],

        [
            "Cosine",
            calculation.cosine,
            calculation.actualCosine,
            calculation.cosineError
        ],

        [
            "Tangent",
            calculation.tangent ?? "Undefined",
            calculation.actualTangent,
            calculation.tangentError ?? "N/A"
        ],

        [],

        [
            "Term Number",
            "Sine Partial Sum",
            "Cosine Partial Sum"
        ]
    ];

    // Add convergence data

    for (let i = 0; i < calculation.terms; i++) {

        rows.push([

            i + 1,

            calculation.sinePartial[i],

            calculation.cosinePartial[i]

        ]);
    }

    let csv = rows.map(row =>

        row.map(value => {

            let text = String(value ?? "");

            return '"' +
                text.replace(/"/g, '""') +
                '"';

        }).join(",")

    ).join("\n");

    let blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    downloadBlob(
        blob,
        "Trigonometric_Results.csv"
    );
}


// ==========================================
// PDF DOWNLOAD
// ==========================================

function downloadPDF() {

    if (!calculation) return;

    if (!window.jspdf || !window.jspdf.jsPDF) {

        alert(
            "PDF library could not load. Please check your internet connection."
        );

        return;
    }

    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();

    doc.setFontSize(20);

    doc.setTextColor(130, 70, 100);

    doc.text(
        "Trigonometric Series Report",
        15,
        20
    );

    doc.setFontSize(12);

    doc.setTextColor(50, 50, 50);

    doc.text(
        "Angle: " + calculation.angle + " degrees",
        15,
        35
    );

    doc.text(
        "Radians: " + calculation.radians.toFixed(8),
        15,
        44
    );

    doc.text(
        "Number of terms: " + calculation.terms,
        15,
        53
    );

    doc.setFontSize(14);

    doc.text("Calculation Results", 15, 70);

    doc.setFontSize(11);

    doc.text(
        "Sine: " + calculation.sine.toFixed(10),
        15,
        83
    );

    doc.text(
        "Sine Error: " +
        calculation.sineError.toExponential(4),
        15,
        91
    );

    doc.text(
        "Cosine: " + calculation.cosine.toFixed(10),
        15,
        103
    );

    doc.text(
        "Cosine Error: " +
        calculation.cosineError.toExponential(4),
        15,
        111
    );

    doc.text(
        "Tangent: " +
        (calculation.tangent === null
            ? "Undefined"
            : calculation.tangent.toFixed(10)),
        15,
        123
    );

    doc.text(
        "Tangent Error: " +
        (calculation.tangentError === null
            ? "N/A"
            : calculation.tangentError.toExponential(4)),
        15,
        131
    );

    doc.setFontSize(14);

    doc.text("Series Convergence", 15, 150);

    doc.setFontSize(10);

    let y = 162;

    doc.text("Term", 15, y);

    doc.text("Sine Partial Sum", 45, y);

    doc.text("Cosine Partial Sum", 110, y);

    for (let i = 0; i < calculation.terms; i++) {

        y += 7;

        if (y > 275) {

            doc.addPage();

            y = 20;
        }

        doc.text(String(i + 1), 15, y);

        doc.text(
            calculation.sinePartial[i].toPrecision(9),
            45,
            y
        );

        doc.text(
            calculation.cosinePartial[i].toPrecision(9),
            110,
            y
        );
    }

    doc.save("Trigonometric_Results.pdf");
}


// ==========================================
// COMMON DOWNLOAD FUNCTION
// ==========================================

function downloadBlob(blob, filename) {

    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


// ==========================================
// RESET FUNCTION
// ==========================================

function resetCalculator() {

    document.getElementById("angle").value = "";

    document.getElementById("terms").value = "";

    document.getElementById("error").textContent = "";

    document.getElementById("convergenceDescription")
        .textContent =
        "Calculate an angle to view its convergence.";

    calculation = null;

    drawConvergence();
}


// ==========================================
// INITIAL GRAPH
// ==========================================

window.addEventListener("load", function() {

    drawFunctionGraph();

    drawConvergence();

});


// ==========================================
// RESPONSIVE GRAPHS
// ==========================================

let resizeTimer;

window.addEventListener("resize", function() {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function() {

        drawFunctionGraph();

        drawConvergence();

    }, 100);

});
