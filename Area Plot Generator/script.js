// =========================================
// GLOBAL CHART VARIABLE
// =========================================

let areaChart = null;


// =========================================
// GENERATE GRAPH
// =========================================

function plotGraph() {

    const errorMessage =
        document.getElementById("errorMessage");

    const successMessage =
        document.getElementById("successMessage");


    // Clear previous messages

    errorMessage.textContent = "";

    successMessage.textContent = "";


    // =====================================
    // GET INPUT VALUES
    // =====================================

    const xInput =
        document.getElementById("xEntry")
        .value
        .trim();

    const y1Input =
        document.getElementById("y1Entry")
        .value
        .trim();

    const y2Input =
        document.getElementById("y2Entry")
        .value
        .trim();


    const color1 =
        document.getElementById("color1Entry")
        .value
        .trim();


    const color2 =
        document.getElementById("color2Entry")
        .value
        .trim();


    const xlabel =
        document.getElementById("xaxisEntry")
        .value
        .trim();


    const ylabel =
        document.getElementById("yaxisEntry")
        .value
        .trim();


    const titlelabel =
        document.getElementById("gtitleEntry")
        .value
        .trim();


    // =====================================
    // CHECK DATA
    // =====================================

    if (!xInput || !y1Input || !y2Input) {

        errorMessage.textContent =
            "Please enter X, Y1 and Y2 data.";

        return;
    }


    // =====================================
    // CONVERT DATA TO ARRAYS
    // =====================================

    const x =
        xInput
        .split(",")
        .map(value => Number(value.trim()));


    const y1 =
        y1Input
        .split(",")
        .map(value => Number(value.trim()));


    const y2 =
        y2Input
        .split(",")
        .map(value => Number(value.trim()));


    // =====================================
    // VALIDATE NUMBERS
    // =====================================

    if (
        x.some(value => Number.isNaN(value)) ||
        y1.some(value => Number.isNaN(value)) ||
        y2.some(value => Number.isNaN(value))
    ) {

        errorMessage.textContent =
            "Please enter valid numerical values.";

        return;
    }


    // =====================================
    // CHECK ARRAY LENGTH
    // =====================================

    if (
        x.length !== y1.length ||
        x.length !== y2.length
    ) {

        errorMessage.textContent =
            "X, Y1 and Y2 must contain the same number of values.";

        return;
    }


    // =====================================
    // MINIMUM DATA POINTS
    // =====================================

    if (x.length < 2) {

        errorMessage.textContent =
            "Please enter at least two data points.";

        return;
    }


    // =====================================
    // DESTROY OLD CHART
    // =====================================

    if (areaChart !== null) {

        areaChart.destroy();

        areaChart = null;
    }


    // =====================================
    // GET CANVAS
    // =====================================

    const canvas =
        document.getElementById("areaChart");

    const ctx =
        canvas.getContext("2d");


    // =====================================
    // CREATE CHART
    // =====================================

    areaChart = new Chart(ctx, {

        type: "line",


        data: {

            labels: x,

            datasets: [

                // -------------------------
                // FIRST DATA SET
                // -------------------------

                {
                    label: "Data Set 1",

                    data: y1,

                    borderColor:
                        color1 || "blue",

                    backgroundColor:
                        convertColor(
                            color1 || "blue",
                            0.4
                        ),

                    fill: true,

                    tension: 0.3,

                    borderWidth: 2,

                    pointRadius: 4
                },


                // -------------------------
                // SECOND DATA SET
                // -------------------------

                {
                    label: "Data Set 2",

                    data: y2,

                    borderColor:
                        color2 || "red",

                    backgroundColor:
                        convertColor(
                            color2 || "red",
                            0.4
                        ),

                    fill: true,

                    tension: 0.3,

                    borderWidth: 2,

                    pointRadius: 4
                }

            ]

        },


        // =================================
        // CHART OPTIONS
        // =================================

        options: {

            responsive: true,

            maintainAspectRatio: false,


            animation: {

                duration: 800

            },


            plugins: {

                title: {

                    display:
                        titlelabel !== "",

                    text:
                        titlelabel,

                    font: {

                        size: 20,

                        weight: "bold"

                    }

                },


                legend: {

                    display: true

                }

            },


            scales: {

                x: {

                    title: {

                        display:
                            xlabel !== "",

                        text:
                            xlabel

                    }

                },


                y: {

                    title: {

                        display:
                            ylabel !== "",

                        text:
                            ylabel

                    }

                }

            }

        }

    });


    // =====================================
    // SUCCESS MESSAGE
    // =====================================

    successMessage.textContent =
        "Graph generated successfully.";

}


// =========================================
// SAVE GRAPH
// =========================================

function saveGraph() {

    const errorMessage =
        document.getElementById("errorMessage");

    const successMessage =
        document.getElementById("successMessage");


    errorMessage.textContent = "";

    successMessage.textContent = "";


    // =====================================
    // CHECK WHETHER GRAPH EXISTS
    // =====================================

    if (areaChart === null) {

        errorMessage.textContent =
            "Please generate the graph first.";

        return;
    }


    // =====================================
    // GET CANVAS
    // =====================================

    const canvas =
        document.getElementById("areaChart");


    // =====================================
    // CONVERT GRAPH TO PNG
    // =====================================

    const imageData =
        canvas.toDataURL("image/png");


    // =====================================
    // SAVE TO LOCAL STORAGE
    // =====================================

    try {

        localStorage.setItem(
            "savedAreaGraph",
            imageData
        );

    }

    catch (error) {

        errorMessage.textContent =
            "Unable to save graph to local storage.";

        return;
    }


    // =====================================
    // DOWNLOAD IMAGE
    // =====================================

    const link =
        document.createElement("a");


    link.href =
        imageData;


    link.download =
        "area_graph.png";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    // =====================================
    // SUCCESS MESSAGE
    // =====================================

    successMessage.textContent =
        "Graph saved and downloaded successfully.";

}


// =========================================
// COLOR CONVERTER
// =========================================

function convertColor(color, alpha) {

    const tempCanvas =
        document.createElement("canvas");


    const tempContext =
        tempCanvas.getContext("2d");


    tempContext.fillStyle =
        color;


    const convertedColor =
        tempContext.fillStyle;


    // =====================================
    // RGB COLOR
    // =====================================

    if (
        convertedColor.startsWith("rgb")
    ) {

        const values =
            convertedColor
            .match(/\d+/g)
            .map(Number);


        return `rgba(
            ${values[0]},
            ${values[1]},
            ${values[2]},
            ${alpha}
        )`;

    }


    // =====================================
    // HEX COLOR
    // =====================================

    let hex =
        convertedColor.replace("#", "");


    if (hex.length === 3) {

        hex =
            hex
            .split("")
            .map(char => char + char)
            .join("");

    }


    const r =
        parseInt(
            hex.substring(0, 2),
            16
        );


    const g =
        parseInt(
            hex.substring(2, 4),
            16
        );


    const b =
        parseInt(
            hex.substring(4, 6),
            16
        );


    return `rgba(
        ${r},
        ${g},
        ${b},
        ${alpha}
    )`;

}


// =========================================
// BUTTON EVENT LISTENERS
// =========================================

document
    .getElementById("generateButton")
    .addEventListener(
        "click",
        plotGraph
    );


document
    .getElementById("saveButton")
    .addEventListener(
        "click",
        saveGraph
    );
