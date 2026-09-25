const elements = {

    H:  [1, "Hydrogen", "1.008", "nonmetal", "1s¹"],
    He: [2, "Helium", "4.0026", "noble", "1s²"],
    
    Li: [3, "Lithium", "6.94", "alkali", "1s² 2s¹"],
    Be: [4, "Beryllium", "9.0122", "alkaline", "1s² 2s²"],
    B:  [5, "Boron", "10.81", "metalloid", "1s² 2s² 2p¹"],
    C:  [6, "Carbon", "12.011", "nonmetal", "1s² 2s² 2p²"],
    N:  [7, "Nitrogen", "14.007", "nonmetal", "1s² 2s² 2p³"],
    O:  [8, "Oxygen", "15.999", "nonmetal", "1s² 2s² 2p⁴"],
    F:  [9, "Fluorine", "18.998", "halogen", "1s² 2s² 2p⁵"],
    Ne: [10, "Neon", "20.180", "noble", "1s² 2s² 2p⁶"],
    
    Na: [11, "Sodium", "22.990", "alkali", "[Ne] 3s¹"],
    Mg: [12, "Magnesium", "24.305", "alkaline", "[Ne] 3s²"],
    Al: [13, "Aluminium", "26.982", "post-transition", "[Ne] 3s² 3p¹"],
    Si: [14, "Silicon", "28.085", "metalloid", "[Ne] 3s² 3p²"],
    P:  [15, "Phosphorus", "30.974", "nonmetal", "[Ne] 3s² 3p³"],
    S:  [16, "Sulfur", "32.06", "nonmetal", "[Ne] 3s² 3p⁴"],
    Cl: [17, "Chlorine", "35.45", "halogen", "[Ne] 3s² 3p⁵"],
    Ar: [18, "Argon", "39.948", "noble", "[Ne] 3s² 3p⁶"],
    
    K:  [19, "Potassium", "39.098", "alkali", "[Ar] 4s¹"],
    Ca: [20, "Calcium", "40.078", "alkaline", "[Ar] 4s²"],
    Sc: [21, "Scandium", "44.956", "transition", "[Ar] 3d¹ 4s²"],
    Ti: [22, "Titanium", "47.867", "transition", "[Ar] 3d² 4s²"],
    V:  [23, "Vanadium", "50.942", "transition", "[Ar] 3d³ 4s²"],
    Cr: [24, "Chromium", "51.996", "transition", "[Ar] 3d⁵ 4s¹"],
    Mn: [25, "Manganese", "54.938", "transition", "[Ar] 3d⁵ 4s²"],
    Fe: [26, "Iron", "55.845", "transition", "[Ar] 3d⁶ 4s²"],
    Co: [27, "Cobalt", "58.933", "transition", "[Ar] 3d⁷ 4s²"],
    Ni: [28, "Nickel", "58.693", "transition", "[Ar] 3d⁸ 4s²"],
    Cu: [29, "Copper", "63.546", "transition", "[Ar] 3d¹⁰ 4s¹"],
    Zn: [30, "Zinc", "65.38", "transition", "[Ar] 3d¹⁰ 4s²"],
    
    Ga: [31, "Gallium", "69.723", "post-transition", "[Ar] 3d¹⁰ 4s² 4p¹"],
    Ge: [32, "Germanium", "72.630", "metalloid", "[Ar] 3d¹⁰ 4s² 4p²"],
    As: [33, "Arsenic", "74.922", "metalloid", "[Ar] 3d¹⁰ 4s² 4p³"],
    Se: [34, "Selenium", "78.971", "nonmetal", "[Ar] 3d¹⁰ 4s² 4p⁴"],
    Br: [35, "Bromine", "79.904", "halogen", "[Ar] 3d¹⁰ 4s² 4p⁵"],
    Kr: [36, "Krypton", "83.798", "noble", "[Ar] 3d¹⁰ 4s² 4p⁶"],
    
    Rb: [37, "Rubidium", "85.468", "alkali", "[Kr] 5s¹"],
    Sr: [38, "Strontium", "87.62", "alkaline", "[Kr] 5s²"],
    Y:  [39, "Yttrium", "88.906", "transition", "[Kr] 4d¹ 5s²"],
    Zr: [40, "Zirconium", "91.224", "transition", "[Kr] 4d² 5s²"],
    Nb: [41, "Niobium", "92.906", "transition", "[Kr] 4d⁴ 5s¹"],
    Mo: [42, "Molybdenum", "95.95", "transition", "[Kr] 4d⁵ 5s¹"],
    Tc: [43, "Technetium", "98", "transition", "[Kr] 4d⁵ 5s²"],
    Ru: [44, "Ruthenium", "101.07", "transition", "[Kr] 4d⁷ 5s¹"],
    Rh: [45, "Rhodium", "102.91", "transition", "[Kr] 4d⁸ 5s¹"],
    Pd: [46, "Palladium", "106.42", "transition", "[Kr] 4d¹⁰"],
    Ag: [47, "Silver", "107.87", "transition", "[Kr] 4d¹⁰ 5s¹"],
    Cd: [48, "Cadmium", "112.41", "transition", "[Kr] 4d¹⁰ 5s²"],
    
    In: [49, "Indium", "114.82", "post-transition", "[Kr] 4d¹⁰ 5s² 5p¹"],
    Sn: [50, "Tin", "118.71", "post-transition", "[Kr] 4d¹⁰ 5s² 5p²"],
    Sb: [51, "Antimony", "121.76", "metalloid", "[Kr] 4d¹⁰ 5s² 5p³"],
    Te: [52, "Tellurium", "127.60", "metalloid", "[Kr] 4d¹⁰ 5s² 5p⁴"],
    I:  [53, "Iodine", "126.90", "halogen", "[Kr] 4d¹⁰ 5s² 5p⁵"],
    Xe: [54, "Xenon", "131.29", "noble", "[Kr] 4d¹⁰ 5s² 5p⁶"],
    
    Cs: [55, "Caesium", "132.91", "alkali", "[Xe] 6s¹"],
    Ba: [56, "Barium", "137.33", "alkaline", "[Xe] 6s²"],
    
    La: [57, "Lanthanum", "138.91", "lanthanide", "[Xe] 5d¹ 6s²"],
    Ce: [58, "Cerium", "140.12", "lanthanide", "[Xe] 4f¹ 5d¹ 6s²"],
    Pr: [59, "Praseodymium", "140.91", "lanthanide", "[Xe] 4f³ 6s²"],
    Nd: [60, "Neodymium", "144.24", "lanthanide", "[Xe] 4f⁴ 6s²"],
    Pm: [61, "Promethium", "145", "lanthanide", "[Xe] 4f⁵ 6s²"],
    Sm: [62, "Samarium", "150.36", "lanthanide", "[Xe] 4f⁶ 6s²"],
    Eu: [63, "Europium", "151.96", "lanthanide", "[Xe] 4f⁷ 6s²"],
    Gd: [64, "Gadolinium", "157.25", "lanthanide", "[Xe] 4f⁷ 5d¹ 6s²"],
    Tb: [65, "Terbium", "158.93", "lanthanide", "[Xe] 4f⁹ 6s²"],
    Dy: [66, "Dysprosium", "162.50", "lanthanide", "[Xe] 4f¹⁰ 6s²"],
    Ho: [67, "Holmium", "164.93", "lanthanide", "[Xe] 4f¹¹ 6s²"],
    Er: [68, "Erbium", "167.26", "lanthanide", "[Xe] 4f¹² 6s²"],
    Tm: [69, "Thulium", "168.93", "lanthanide", "[Xe] 4f¹³ 6s²"],
    Yb: [70, "Ytterbium", "173.05", "lanthanide", "[Xe] 4f¹⁴ 6s²"],
    Lu: [71, "Lutetium", "174.97", "lanthanide", "[Xe] 4f¹⁴ 5d¹ 6s²"],
    
    Hf: [72, "Hafnium", "178.49", "transition", "[Xe] 4f¹⁴ 5d² 6s²"],
    Ta: [73, "Tantalum", "180.95", "transition", "[Xe] 4f¹⁴ 5d³ 6s²"],
    W:  [74, "Tungsten", "183.84", "transition", "[Xe] 4f¹⁴ 5d⁴ 6s²"],
    Re: [75, "Rhenium", "186.21", "transition", "[Xe] 4f¹⁴ 5d⁵ 6s²"],
    Os: [76, "Osmium", "190.23", "transition", "[Xe] 4f¹⁴ 5d⁶ 6s²"],
    Ir: [77, "Iridium", "192.22", "transition", "[Xe] 4f¹⁴ 5d⁷ 6s²"],
    Pt: [78, "Platinum", "195.08", "transition", "[Xe] 4f¹⁴ 5d⁹ 6s¹"],
    Au: [79, "Gold", "196.97", "transition", "[Xe] 4f¹⁴ 5d¹⁰ 6s¹"],
    Hg: [80, "Mercury", "200.59", "transition", "[Xe] 4f¹⁴ 5d¹⁰ 6s²"],
    
    Tl: [81, "Thallium", "204.38", "post-transition", "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹"],
    Pb: [82, "Lead", "207.2", "post-transition", "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²"],
    Bi: [83, "Bismuth", "208.98", "post-transition", "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³"],
    Po: [84, "Polonium", "209", "post-transition", "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴"],
    At: [85, "Astatine", "210", "halogen", "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵"],
    Rn: [86, "Radon", "222", "noble", "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶"],
    
    Fr: [87, "Francium", "223", "alkali", "[Rn] 7s¹"],
    Ra: [88, "Radium", "226", "alkaline", "[Rn] 7s²"],
    
    Ac: [89, "Actinium", "227", "actinide", "[Rn] 6d¹ 7s²"],
    Th: [90, "Thorium", "232.04", "actinide", "[Rn] 6d² 7s²"],
    Pa: [91, "Protactinium", "231.04", "actinide", "[Rn] 5f² 6d¹ 7s²"],
    U:  [92, "Uranium", "238.03", "actinide", "[Rn] 5f³ 6d¹ 7s²"],
    Np: [93, "Neptunium", "237", "actinide", "[Rn] 5f⁴ 6d¹ 7s²"],
    Pu: [94, "Plutonium", "244", "actinide", "[Rn] 5f⁶ 7s²"],
    Am: [95, "Americium", "243", "actinide", "[Rn] 5f⁷ 7s²"],
    Cm: [96, "Curium", "247", "actinide", "[Rn] 5f⁷ 6d¹ 7s²"],
    Bk: [97, "Berkelium", "247", "actinide", "[Rn] 5f⁹ 7s²"],
    Cf: [98, "Californium", "251", "actinide", "[Rn] 5f¹⁰ 7s²"],
    Es: [99, "Einsteinium", "252", "actinide", "[Rn] 5f¹¹ 7s²"],
    Fm: [100, "Fermium", "257", "actinide", "[Rn] 5f¹² 7s²"],
    Md: [101, "Mendelevium", "258", "actinide", "[Rn] 5f¹³ 7s²"],
    No: [102, "Nobelium", "259", "actinide", "[Rn] 5f¹⁴ 7s²"],
    Lr: [103, "Lawrencium", "266", "actinide", "[Rn] 5f¹⁴ 7s² 7p¹"],
    
    Rf: [104, "Rutherfordium", "267", "transition", "[Rn] 5f¹⁴ 6d² 7s²"],
    Db: [105, "Dubnium", "268", "transition", "[Rn] 5f¹⁴ 6d³ 7s²"],
    Sg: [106, "Seaborgium", "269", "transition", "[Rn] 5f¹⁴ 6d⁴ 7s²"],
    Bh: [107, "Bohrium", "270", "transition", "[Rn] 5f¹⁴ 6d⁵ 7s²"],
    Hs: [108, "Hassium", "277", "transition", "[Rn] 5f¹⁴ 6d⁶ 7s²"],
    Mt: [109, "Meitnerium", "278", "transition", "[Rn] 5f¹⁴ 6d⁷ 7s²"],
    Ds: [110, "Darmstadtium", "281", "transition", "[Rn] 5f¹⁴ 6d⁸ 7s²"],
    Rg: [111, "Roentgenium", "282", "transition", "[Rn] 5f¹⁴ 6d⁹ 7s²"],
    Cn: [112, "Copernicium", "285", "transition", "[Rn] 5f¹⁴ 6d¹⁰ 7s²"],
    
    Nh: [113, "Nihonium", "286", "post-transition", "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹"],
    Fl: [114, "Flerovium", "289", "post-transition", "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²"],
    Mc: [115, "Moscovium", "290", "post-transition", "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³"],
    Lv: [116, "Livermorium", "293", "post-transition", "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴"],
    Ts: [117, "Tennessine", "294", "halogen", "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵"],
    Og: [118, "Oganesson", "294", "noble", "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶"]
    
    };
    
    
    // Periodic-table positions
    const periodRows = [
        ["H","","","","","","","","","","","","","","","","","He"],
        ["Li","Be","","","","","","","","","","","B","C","N","O","F","Ne"],
        ["Na","Mg","","","","","","","","","","","Al","Si","P","S","Cl","Ar"],
        ["K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"],
        ["Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe"],
        ["Cs","Ba","La","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn"],
        ["Fr","Ra","Ac","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"]
    ];
    
    const positions = {};
    
    periodRows.forEach((row, r) => {
        row.forEach((symbol, c) => {
            if (symbol) {
                positions[symbol] = [r + 1, c + 1];
            }
        });
    });
    
    const categoryNames = {
        alkali: "Alkali Metal",
        alkaline: "Alkaline Earth Metal",
        transition: "Transition Metal",
        "post-transition": "Post-transition Metal",
        metalloid: "Metalloid",
        nonmetal: "Nonmetal",
        halogen: "Halogen",
        noble: "Noble Gas",
        lanthanide: "Lanthanide",
        actinide: "Actinide"
    };
    
    const table = document.getElementById("periodicTable");
    const lanthanidesContainer = document.getElementById("lanthanides");
    const actinidesContainer = document.getElementById("actinides");
    
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const resetBtn = document.getElementById("resetBtn");
    
    const panelPlaceholder = document.getElementById("panelPlaceholder");
    const elementDetails = document.getElementById("elementDetails");
    
    const detailSymbol = document.getElementById("detailSymbol");
    const detailNumber = document.getElementById("detailNumber");
    const detailName = document.getElementById("detailName");
    const detailCategory = document.getElementById("detailCategory");
    const detailMass = document.getElementById("detailMass");
    const detailPeriod = document.getElementById("detailPeriod");
    const detailGroup = document.getElementById("detailGroup");
    const detailBlock = document.getElementById("detailBlock");
    const detailConfiguration = document.getElementById("detailConfiguration");
    
    const shellContainer = document.getElementById("shellContainer");
    const bohrContainer = document.getElementById("bohrContainer");
    const orbitalContainer = document.getElementById("orbitalContainer");
    
    
    function createElement(symbol) {
    
        const data = elements[symbol];
    
        if (!data) return null;
    
        const [number, name, mass, category] = data;
    
        const element = document.createElement("div");
    
        element.className = `element ${category}`;
    
        element.dataset.symbol = symbol;
        element.dataset.name = name.toLowerCase();
        element.dataset.number = number;
        element.dataset.category = category;
    
        element.innerHTML = `
            <div class="atomic-number">${number}</div>
            <div class="symbol">${symbol}</div>
            <div class="mass">${mass}</div>
        `;
    
        element.addEventListener("click", () => {
            selectElement(symbol);
        });
    
        return element;
    }
    
    
    function buildPeriodicTable() {
    
        table.innerHTML = "";
    
        Object.entries(positions).forEach(([symbol, position]) => {
    
            const [period, group] = position;
    
            const element = createElement(symbol);
    
            if (!element) return;
    
            element.style.gridRow = period;
            element.style.gridColumn = group;
    
            table.appendChild(element);
    
        });
    }
    
    
    function buildSeries(container, symbols) {
    
        container.innerHTML = "";
    
        symbols.forEach(symbol => {
    
            const element = createElement(symbol);
    
            if (element) {
                container.appendChild(element);
            }
    
        });
    }
    
    
    buildSeries(
        lanthanidesContainer,
        [
            "La", "Ce", "Pr", "Nd", "Pm",
            "Sm", "Eu", "Gd", "Tb", "Dy",
            "Ho", "Er", "Tm", "Yb", "Lu"
        ]
    );
    
    
    buildSeries(
        actinidesContainer,
        [
            "Ac", "Th", "Pa", "U", "Np",
            "Pu", "Am", "Cm", "Bk", "Cf",
            "Es", "Fm", "Md", "No", "Lr"
        ]
    );
    
    
    function getBlock(symbol) {
    
        const category = elements[symbol][3];
    
        if (
            category === "lanthanide" ||
            category === "actinide"
        ) {
            return "f";
        }
    
        const sBlock = [
            "H", "Li", "Be", "Na", "Mg",
            "K", "Ca", "Rb", "Sr",
            "Cs", "Ba", "Fr", "Ra"
        ];
    
        if (sBlock.includes(symbol)) {
            return "s";
        }
    
        const pBlock = [
            "B", "C", "N", "O", "F", "Ne",
            "Al", "Si", "P", "S", "Cl", "Ar",
            "Ga", "Ge", "As", "Se", "Br", "Kr",
            "In", "Sn", "Sb", "Te", "I", "Xe",
            "Tl", "Pb", "Bi", "Po", "At", "Rn",
            "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
        ];
    
        if (pBlock.includes(symbol)) {
            return "p";
        }
    
        return "d";
    }
    
    
    const nobleGasOrbitals = {
    
        He: "1s²",
    
        Ne: "1s² 2s² 2p⁶",
    
        Ar: "1s² 2s² 2p⁶ 3s² 3p⁶",
    
        Kr:
            "1s² 2s² 2p⁶ " +
            "3s² 3p⁶ 4s² 3d¹⁰ 4p⁶",
    
        Xe:
            "1s² 2s² 2p⁶ " +
            "3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ " +
            "5s² 4d¹⁰ 5p⁶",
    
        Rn:
            "1s² 2s² 2p⁶ " +
            "3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ " +
            "5s² 4d¹⁰ 5p⁶ " +
            "6s² 4f¹⁴ 5d¹⁰ 6p⁶"
    };
    
    
    const superscriptToNumber = {
    
        "⁰": 0,
        "¹": 1,
        "²": 2,
        "³": 3,
        "⁴": 4,
        "⁵": 5,
        "⁶": 6,
        "⁷": 7,
        "⁸": 8,
        "⁹": 9
    
    };
    
    
    const numberToSuperscript = [
        "⁰", "¹", "²", "³", "⁴",
        "⁵", "⁶", "⁷", "⁸", "⁹"
    ];
    
    
    function parseSuperscript(value) {
    
        return [...value].reduce(
            (total, character) => {
                return total * 10 +
                       superscriptToNumber[character];
            },
            0
        );
    
    }
    
    
    function superscript(number) {
    
        return String(number)
            .split("")
            .map(digit => numberToSuperscript[Number(digit)])
            .join("");
    
    }
    
    
    function expandConfiguration(configuration) {
    
        const cores = {
    
            "[He]": nobleGasOrbitals.He,
            "[Ne]": nobleGasOrbitals.Ne,
            "[Ar]": nobleGasOrbitals.Ar,
            "[Kr]": nobleGasOrbitals.Kr,
            "[Xe]": nobleGasOrbitals.Xe,
            "[Rn]": nobleGasOrbitals.Rn
    
        };
    
        let result = configuration;
    
        Object.entries(cores).forEach(
            ([core, expansion]) => {
    
                result = result.replace(
                    core,
                    expansion
                );
    
            }
        );
    
        return result.trim();
    
    }
    
    
    function parseOrbitals(configuration) {
    
        const expanded =
            expandConfiguration(configuration);
    
        const terms =
            expanded.match(
                /\d[spdf][⁰¹²³⁴⁵⁶⁷⁸⁹]+/g
            ) || [];
    
        return terms.map(term => {
    
            return {
                shell: Number(term[0]),
                type: term[1],
                occupancy:
                    parseSuperscript(term.slice(2))
            };
    
        });
    
    }
    
    
    function getShellDistribution(symbol) {
    
        const atomicNumber =
            elements[symbol][0];
    
        const totals = {};
    
        const orbitals =
            parseOrbitals(elements[symbol][4]);
    
        orbitals.forEach(orbital => {
    
            totals[orbital.shell] =
                (totals[orbital.shell] || 0) +
                orbital.occupancy;
    
        });
    
        const shells =
            Object.keys(totals)
                .sort((a, b) => Number(a) - Number(b))
                .map(shell => totals[shell]);
    
        const total =
            shells.reduce(
                (sum, value) => sum + value,
                0
            );
    
        if (total === atomicNumber) {
            return shells;
        }
    
        return [atomicNumber];
    
    }
    
    
    const orbitalCapacity = {
    
        s: 2,
        p: 6,
        d: 10,
        f: 14
    
    };
    
    
    function createElectronArrows(occupancy, type) {
    
        const orbitalCount =
            orbitalCapacity[type] / 2;
    
        const orbitals =
            Array.from(
                { length: orbitalCount },
                () => []
            );
    
        for (
            let i = 0;
            i < occupancy;
            i++
        ) {
    
            const orbitalIndex =
                i < orbitalCount
                    ? i
                    : i - orbitalCount;
    
            const direction =
                i < orbitalCount
                    ? "↑"
                    : "↓";
    
            orbitals[orbitalIndex].push(
                direction
            );
    
        }
    
        return orbitals;
    
    }
    
    
    function buildOrbitalDiagram(symbol) {
    
        orbitalContainer.innerHTML = "";
    
        const configuration =
            elements[symbol][4];
    
        const orbitals =
            parseOrbitals(configuration);
    
        orbitals.forEach(
            (orbital, rowIndex) => {
    
                const row =
                    document.createElement("div");
    
                row.className =
                    "orbital-row";
    
    
                const label =
                    document.createElement("div");
    
                label.className =
                    "orbital-label";
    
                label.textContent =
                    `${orbital.shell}${orbital.type}${superscript(orbital.occupancy)}`;
    
    
                const boxes =
                    document.createElement("div");
    
                boxes.className =
                    "orbital-boxes";
    
    
                const electronOrbitals =
                    createElectronArrows(
                        orbital.occupancy,
                        orbital.type
                    );
    
    
                electronOrbitals.forEach(
                    electrons => {
    
                        const box =
                            document.createElement("div");
    
                        box.className =
                            "orbital-box";
    
    
                        if (!electrons.length) {
                            box.classList.add("empty");
                        }
    
    
                        electrons.forEach(
                            (direction, electronIndex) => {
    
                                const arrow =
                                    document.createElement("span");
    
                                arrow.className =
                                    "electron-arrow";
    
                                arrow.textContent =
                                    direction;
    
                                arrow.style.animationDelay =
                                    `${rowIndex * 0.05 +
                                       electronIndex * 0.08}s`;
    
                                box.appendChild(arrow);
    
                            }
                        );
    
    
                        boxes.appendChild(box);
    
                    }
                );
    
    
                row.appendChild(label);
                row.appendChild(boxes);
    
                orbitalContainer.appendChild(row);
    
            }
        );
    
    
        const info =
            document.createElement("div");
    
        info.className =
            "orbital-info";
    
        info.innerHTML = `
            <strong>↑</strong> = electron spin up
            &nbsp;&nbsp;
            <strong>↓</strong> = electron spin down
            <br>
            Orbitals are populated according to
            the Aufbau principle and Hund's rule.
        `;
    
        orbitalContainer.appendChild(info);
    
    }
    
    
    function buildBohrModel(
        symbol,
        shellDistribution
    ) {
    
        bohrContainer.innerHTML = "";
    
    
        const nucleus =
            document.createElement("div");
    
        nucleus.className =
            "bohr-nucleus";
    
        nucleus.textContent =
            symbol;
    
        bohrContainer.appendChild(
            nucleus
        );
    
    
        /*
            Shell diameters.
    
            The largest ring is kept
            inside the 430px container.
        */
    
        const orbitSizes = [
            120,
            155,
            190,
            225,
            260,
            295,
            330
        ];
    
    
        const shellCount =
            Math.min(
                shellDistribution.length,
                orbitSizes.length
            );
    
    
        for (
            let shellIndex = 0;
            shellIndex < shellCount;
            shellIndex++
        ) {
    
            const electrons =
                shellDistribution[shellIndex];
    
            const size =
                orbitSizes[shellIndex];
    
    
            /*
                Static shell ring.
            */
    
            const orbit =
                document.createElement("div");
    
            orbit.className =
                "bohr-orbit";
    
            orbit.style.setProperty(
                "--orbit-size",
                `${size}px`
            );
    
            bohrContainer.appendChild(
                orbit
            );
    
    
            /*
                Rotating track.
    
                The electrons are children
                of this track, so the track
                rotation moves them around
                the nucleus.
            */
    
            const track =
                document.createElement("div");
    
            track.className =
                "electron-track";
    
            track.style.setProperty(
                "--orbit-size",
                `${size}px`
            );
    
    
            /*
                Inner shells rotate faster.
            */
    
            track.style.animationDuration =
                `${3.5 + shellIndex * 1.8}s`;
    
    
            /*
                Alternate direction for
                adjacent shells.
            */
    
            track.style.animationDirection =
                shellIndex % 2
                    ? "reverse"
                    : "normal";
    
    
            /*
                Create electrons.
            */
    
            for (
                let electronIndex = 0;
                electronIndex < electrons;
                electronIndex++
            ) {
    
                const electron =
                    document.createElement("div");
    
                electron.className =
                    "bohr-electron";
    
    
                /*
                    Evenly distribute the
                    electrons around the shell.
                */
    
                const angle =
                    (360 / electrons) *
                    electronIndex;
    
    
                electron.style.left =
                    "50%";
    
                electron.style.top =
                    "50%";
    
    
                electron.style.transform =
                    `translate(-50%, -50%)
                     rotate(${angle}deg)
                     translateY(-${size / 2}px)`;
    
    
                track.appendChild(
                    electron
                );
    
            }
    
    
            bohrContainer.appendChild(
                track
            );
    
        }
    
    }
    
    
    function selectElement(symbol) {
    
        const data =
            elements[symbol];
    
        if (!data) return;
    
    
        const [
            number,
            name,
            mass,
            category,
            configuration
        ] = data;
    
    
        /*
            Highlight selected element.
        */
    
        document
            .querySelectorAll(".element")
            .forEach(element => {
    
                element.classList.toggle(
                    "selected",
                    element.dataset.symbol === symbol
                );
    
            });
    
    
        detailSymbol.textContent =
            symbol;
    
        detailNumber.textContent =
            number;
    
        detailName.textContent =
            name;
    
        detailMass.textContent =
            mass;
    
        detailCategory.textContent =
            categoryNames[category] ||
            category;
    
    
        const position =
            positions[symbol];
    
    
        if (position) {
    
            detailPeriod.textContent =
                position[0];
    
            detailGroup.textContent =
                position[1];
    
        } else {
    
            detailPeriod.textContent =
                category === "lanthanide"
                    ? "6"
                    : "7";
    
            detailGroup.textContent =
                "f-block";
    
        }
    
    
        detailBlock.textContent =
            getBlock(symbol);
    
        detailConfiguration.textContent =
            configuration;
    
    
        /*
            Shell distribution.
        */
    
        const shells =
            getShellDistribution(symbol);
    
        shellContainer.innerHTML =
            shells
                .map(
                    (electrons, index) => `
                        <div class="shell">
                            <span>
                                Shell ${index + 1}
                            </span>
                            <strong>
                                ${electrons}
                            </strong>
                        </div>
                    `
                )
                .join("");
    
    
        /*
            Build both visualizations.
        */
    
        buildBohrModel(
            symbol,
            shells
        );
    
        buildOrbitalDiagram(
            symbol
        );
    
    
        panelPlaceholder.style.display =
            "none";
    
        elementDetails.classList.add(
            "active"
        );
    
    
        if (window.innerWidth < 700) {
    
            document
                .getElementById("elementPanel")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
    
        }
    
    }
    
    
    function filterElements() {
    
        const search =
            searchInput.value
                .trim()
                .toLowerCase();
    
        const category =
            categoryFilter.value;
    
    
        document
            .querySelectorAll(".element")
            .forEach(element => {
    
                const symbol =
                    element.dataset.symbol
                        .toLowerCase();
    
                const name =
                    element.dataset.name;
    
                const number =
                    element.dataset.number;
    
                const elementCategory =
                    element.dataset.category;
    
    
                const matchesSearch =
                    !search ||
                    symbol.includes(search) ||
                    name.includes(search) ||
                    number === search;
    
    
                const matchesCategory =
                    category === "all" ||
                    elementCategory === category;
    
    
                element.classList.toggle(
                    "dimmed",
                    !(matchesSearch &&
                      matchesCategory)
                );
    
            });
    
    }
    
    
    searchInput.addEventListener(
        "input",
        filterElements
    );
    
    categoryFilter.addEventListener(
        "change",
        filterElements
    );
    
    
    resetBtn.addEventListener(
        "click",
        () => {
    
            searchInput.value =
                "";
    
            categoryFilter.value =
                "all";
    
    
            document
                .querySelectorAll(".element")
                .forEach(element => {
    
                    element.classList.remove(
                        "dimmed",
                        "selected"
                    );
    
                });
    
    
            panelPlaceholder.style.display =
                "flex";
    
            elementDetails.classList.remove(
                "active"
            );
    
    
            bohrContainer.innerHTML =
                "";
    
            orbitalContainer.innerHTML =
                "";
    
            shellContainer.innerHTML =
                "";
    
        }
    );
    
    
    document.addEventListener(
        "keydown",
        event => {
    
            if (
                event.key === "/" &&
                document.activeElement !==
                    searchInput
            ) {
    
                event.preventDefault();
    
                searchInput.focus();
    
            }
    
        }
    );
    
    
    const themeBtn =
        document.getElementById(
            "themeBtn"
        );
    
    
    themeBtn.addEventListener(
        "click",
        () => {
    
            document.body.classList.toggle(
                "light"
            );
    
        }
    );
    
    
    /*
        Start application.
    */
    
    buildPeriodicTable();
    
    selectElement("H");
