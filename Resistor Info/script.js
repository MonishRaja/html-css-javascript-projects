const colors = [
    { name: "Black", value: 0, hex: "#000000" },
    { name: "Brown", value: 1, hex: "#8B4513" },
    { name: "Red", value: 2, hex: "#FF0000" },
    { name: "Orange", value: 3, hex: "#FFA500" },
    { name: "Yellow", value: 4, hex: "#FFFF00" },
    { name: "Green", value: 5, hex: "#008000" },
    { name: "Blue", value: 6, hex: "#0000FF" },
    { name: "Violet", value: 7, hex: "#8F00FF" },
    { name: "Grey", value: 8, hex: "#808080" },
    { name: "White", value: 9, hex: "#FFFFFF" }
];

// Populate dropdowns
function populateColors() {

    for (let i = 1; i <= 3; i++) {

        const select = document.getElementById("color" + i);

        colors.forEach(color => {

            const option = document.createElement("option");

            option.value = color.value;
            option.textContent = color.name;

            select.appendChild(option);

        });
    }
}

// Update resistor bands
function updateBands() {

    for (let i = 1; i <= 3; i++) {

        const select = document.getElementById("color" + i);
        const band = document.getElementById("band" + i);

        if (select.value === "") {
            band.style.background = "#bda47e";
        } else {
            band.style.background =
                colors[Number(select.value)].hex;
        }
    }
}

// Format numbers
function formatNumber(value) {
    return value.toLocaleString("en-US", {
        maximumFractionDigits: 8
    });
}

// Calculate resistance and output voltage
function calculate() {

    const n = document.getElementById("color1").value;
    const m = document.getElementById("color2").value;
    const p = document.getElementById("color3").value;

    const vin = Number(document.getElementById("inputVoltage").value);
    const r2 = Number(document.getElementById("r2").value);

    const error = document.getElementById("error");
    const result = document.getElementById("result");

    // Validation
    if (n === "" || m === "" || p === "") {
        error.textContent = "Please select all three resistor colors!";
        result.style.display = "none";
        return;
    }

    if (
        document.getElementById("inputVoltage").value === "" ||
        document.getElementById("r2").value === "" ||
        !Number.isFinite(vin) ||
        !Number.isFinite(r2) ||
        vin < 0 || r2 <= 0
    ) {
        error.textContent =
            "Enter a valid input voltage and a positive R2 value!";
        result.style.display = "none";
        return;
    }

    // Resistance calculation
    const r1 = ((Number(n) * 10) + Number(m)) *
               Math.pow(10, Number(p));

    // Voltage divider calculation
    const vout = vin * (r2 / (r1 + r2));

    // Display results
    document.getElementById("ohms").textContent =
        formatNumber(r1) + " Ω";

    document.getElementById("vinResult").textContent =
        formatNumber(vin) + " V";

    document.getElementById("vout").textContent =
        formatNumber(vout) + " V";

    error.textContent = "";
    result.style.display = "block";
}

// Reset calculator
function resetCalculator() {

    for (let i = 1; i <= 3; i++) {
        document.getElementById("color" + i).value = "";
    }

    document.getElementById("inputVoltage").value = "";
    document.getElementById("r2").value = "";

    document.getElementById("result").style.display = "none";
    document.getElementById("error").textContent = "";

    updateBands();
}

// Initialize
populateColors();

for (let i = 1; i <= 3; i++) {
    document.getElementById("color" + i)
        .addEventListener("change", updateBands);
}
