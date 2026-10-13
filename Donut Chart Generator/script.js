
document.addEventListener("DOMContentLoaded", function () {
    let donutChart = null;

    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const error = document.getElementById("error");
    const canvas = document.getElementById("donutChart");

    // Generate Chart button
    generateBtn.addEventListener("click", function () {
        error.textContent = "";

        if (typeof Chart === "undefined") {
            error.textContent =
                "Chart.js failed to load. Check your internet connection.";
            return;
        }

        const sizesInput =
            document.getElementById("sizes").value.trim();
        const labelsInput =
            document.getElementById("labels").value.trim();
        const title =
            document.getElementById("title").value.trim();

        if (!sizesInput || !labelsInput) {
            error.textContent = "Please enter sizes and labels.";
            return;
        }

        const sizes = sizesInput.split(",").map(v => Number(v.trim()));
        const labels = labelsInput.split(",").map(v => v.trim());

        if (sizes.some(v => !Number.isFinite(v) || v <= 0)) {
            error.textContent =
                "Sizes must be positive numbers separated by commas.";
            return;
        }

        if (
            sizes.length !== labels.length ||
            labels.some(label => label === "")
        ) {
            error.textContent =
                "Enter one label for each size.";
            return;
        }

        // Destroy the previous chart, if any
        if (donutChart) {
            donutChart.destroy();
        }

        // Create the chart
        donutChart = new Chart(canvas, {
            type: "doughnut",

            data: {
                labels: labels,
                datasets: [{
                    data: sizes,
                    backgroundColor: [
                        "#6366f1",
                        "#14b8a6",
                        "#f59e0b",
                        "#ec4899",
                        "#8b5cf6",
                        "#06b6d4",
                        "#84cc16",
                        "#f97316"
                    ],
                    borderColor: "#ffffff",
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },

            options: {
                responsive: true,
                cutout: "60%",

                plugins: {
                    title: {
                        display: title !== "",
                        text: title,
                        color: "#222222",
                        font: {
                            size: 18,
                            weight: "bold"
                        }
                    },

                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    });

    // Download Chart button — independent of Generate Chart
    downloadBtn.addEventListener("click", function () {
        error.textContent = "";

        if (!donutChart) {
            error.textContent =
                "Please click Generate Chart before downloading.";
            return;
        }

        try {
            const title =
                document.getElementById("title").value.trim()
                || "Donut_Chart";

            const filename = title
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
                .replace(/\s+/g, "_");

            // Export the existing chart as a PNG
            const imageURL = donutChart.toBase64Image("image/png");

            const link = document.createElement("a");
            link.href = imageURL;
            link.download = filename + ".png";

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (err) {
            console.error(err);
            error.textContent =
                "Download failed. Check the browser console.";
        }
    });
});
