// =====================================================
// 3D MOLECULAR VISUALIZER
// =====================================================


// -----------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------

const input =
    document.getElementById("moleculeInput");

const visualizeButton =
    document.getElementById("visualizeButton");

const viewerElement =
    document.getElementById("viewer");

const loadingElement =
    document.getElementById("loading");

const errorBox =
    document.getElementById("errorBox");

const statusElement =
    document.getElementById("status");

const moleculeNameElement =
    document.getElementById("moleculeName");

const moleculeFormulaElement =
    document.getElementById("moleculeFormula");

const infoMolecule =
    document.getElementById("infoMolecule");

const infoFormula =
    document.getElementById("infoFormula");

const infoAtoms =
    document.getElementById("infoAtoms");

const infoCID =
    document.getElementById("infoCID");


// -----------------------------------------------------
// GLOBAL VIEWER
// -----------------------------------------------------

let viewer = null;


// -----------------------------------------------------
// COMMON MOLECULE NAMES
// -----------------------------------------------------

const commonNames = {

    "h2o": "Water",

    "water": "Water",

    "co2": "Carbon dioxide",

    "carbon dioxide":
        "Carbon dioxide",

    "ch4": "Methane",

    "methane": "Methane",

    "nh3": "Ammonia",

    "ammonia": "Ammonia",

    "o2": "Oxygen",

    "oxygen": "Oxygen",

    "n2": "Nitrogen",

    "nitrogen": "Nitrogen",

    "ethanol": "Ethanol",

    "c2h5oh": "Ethanol",

    "benzene": "Benzene",

    "c6h6": "Benzene",

    "glucose": "Glucose",

    "c6h12o6": "Glucose",

    "caffeine": "Caffeine",

    "acetone": "Acetone",

    "methanol": "Methanol",

    "acetic acid": "Acetic acid",

    "aspirin": "Aspirin",

    "ibuprofen": "Ibuprofen"
};


// -----------------------------------------------------
// SHOW ERROR
// -----------------------------------------------------

function showError(message) {

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";

    statusElement.textContent =
        "Error";

    statusElement.classList.add(
        "error-status"
    );

    statusElement.classList.remove(
        "loading-status"
    );
}


// -----------------------------------------------------
// HIDE ERROR
// -----------------------------------------------------

function hideError() {

    errorBox.style.display =
        "none";

}


// -----------------------------------------------------
// SET LOADING
// -----------------------------------------------------

function setLoading() {

    loadingElement.style.display =
        "flex";

    statusElement.textContent =
        "Loading";

    statusElement.classList.add(
        "loading-status"
    );

    statusElement.classList.remove(
        "error-status"
    );

}


// -----------------------------------------------------
// SET READY
// -----------------------------------------------------

function setReady() {

    loadingElement.style.display =
        "none";

    statusElement.textContent =
        "Ready";

    statusElement.classList.remove(
        "loading-status",
        "error-status"
    );

}


// -----------------------------------------------------
// CREATE VIEWER
// -----------------------------------------------------

function createViewer() {

    if (
        typeof $3Dmol === "undefined"
    ) {

        throw new Error(
            "3Dmol.js could not be loaded. Check your internet connection."
        );

    }


    if (!viewer) {

        viewer =
            $3Dmol.createViewer(
                viewerElement,
                {
                    backgroundColor:
                        "#020617"
                }
            );

    }


    return viewer;

}


// -----------------------------------------------------
// PUBCHEM REQUEST
// -----------------------------------------------------

async function getPubChemCompound(
    query
) {

    /*
        First try PubChem's
        compound/name endpoint.

        This works for:

        water
        ethanol
        caffeine
        benzene

        and many other compounds.
    */


    const encoded =
        encodeURIComponent(query);


    const nameURL =
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encoded}/property/MolecularFormula,IUPACName/JSON`;


    try {

        const response =
            await fetch(nameURL);


        if (response.ok) {

            const data =
                await response.json();


            if (
                data.PropertyTable &&
                data.PropertyTable.Properties &&
                data.PropertyTable.Properties.length
            ) {

                return data
                    .PropertyTable
                    .Properties[0];

            }

        }

    } catch (error) {

        console.log(
            "Name search failed:",
            error
        );

    }


    /*
        If name search fails,
        try the fast formula endpoint.
    */


    const formulaURL =
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastformula/${encoded}/cids/JSON`;


    try {

        const response =
            await fetch(formulaURL);


        if (response.ok) {

            const data =
                await response.json();


            if (
                data.IdentifierList &&
                data.IdentifierList.CID &&
                data.IdentifierList.CID.length
            ) {

                const cid =
                    data.IdentifierList.CID[0];


                const propertyURL =
                    `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,IUPACName/JSON`;


                const propertyResponse =
                    await fetch(
                        propertyURL
                    );


                if (
                    propertyResponse.ok
                ) {

                    const propertyData =
                        await propertyResponse.json();


                    if (
                        propertyData.PropertyTable &&
                        propertyData.PropertyTable.Properties
                    ) {

                        return propertyData
                            .PropertyTable
                            .Properties[0];

                    }

                }

            }

        }

    } catch (error) {

        console.log(
            "Formula search failed:",
            error
        );

    }


    return null;

}


// -----------------------------------------------------
// GET 3D SDF
// -----------------------------------------------------

async function get3DSDF(cid) {

    const url =
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF?record_type=3d`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "A 3D structure is not available for this compound."
        );

    }


    return await response.text();

}


// -----------------------------------------------------
// GET 2D SDF FALLBACK
// -----------------------------------------------------

async function get2DSDF(cid) {

    const url =
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Molecular structure could not be downloaded."
        );

    }


    return await response.text();

}


// -----------------------------------------------------
// RENDER SDF
// -----------------------------------------------------

function renderSDF(
    sdf
) {

    viewer.removeAllModels();


    viewer.addModel(
        sdf,
        "sdf"
    );


    /*
        Ball and stick representation
    */

    viewer.setStyle(
        {},
        {
            stick: {
                radius: 0.18
            },

            sphere: {
                scale: 0.30
            }
        }
    );


    viewer.zoomTo();


    viewer.render();


    /*
        Allow the molecule to rotate
        slowly when the mouse isn't
        being used.
    */

    if (
        viewer.spin
    ) {

        viewer.spin(
            "y",
            0.3
        );

    }

}


// -----------------------------------------------------
// GET ATOM COUNT FROM SDF
// -----------------------------------------------------

function getAtomCountFromSDF(
    sdf
) {

    const lines =
        sdf.split("\n");


    /*
        SDF counts line is normally
        located at line 4.

        Example:

        3  2  0  0  0  0 ...
    */


    if (
        lines.length > 3
    ) {

        const countsLine =
            lines[3];


        const atoms =
            parseInt(
                countsLine.substring(
                    0,
                    3
                )
            );


        if (
            !isNaN(atoms)
        ) {

            return atoms;

        }

    }


    return "-";

}


// -----------------------------------------------------
// FORMAT FORMULA
// -----------------------------------------------------

function formatFormula(
    formula
) {

    if (!formula) {

        return "-";

    }


    return formula.replace(
        /(\d+)/g,
        "<sub>$1</sub>"
    );

}


// -----------------------------------------------------
// UPDATE INFORMATION
// -----------------------------------------------------

function updateInformation(
    property,
    cid,
    sdf
) {

    const formula =
        property.MolecularFormula ||
        "-";


    const name =
        property.IUPACName ||
        "Molecular structure";


    const atomCount =
        getAtomCountFromSDF(
            sdf
        );


    moleculeNameElement.textContent =
        commonNames[
            input.value
                .trim()
                .toLowerCase()
        ] ||
        name;


    moleculeFormulaElement.innerHTML =
        formatFormula(
            formula
        );


    infoMolecule.textContent =
        moleculeNameElement.textContent;


    infoFormula.innerHTML =
        formatFormula(
            formula
        );


    infoAtoms.textContent =
        atomCount;


    infoCID.textContent =
        cid;

}


// -----------------------------------------------------
// MAIN VISUALIZATION FUNCTION
// -----------------------------------------------------

async function visualizeMolecule(
    query
) {

    query =
        query.trim();


    if (!query) {

        showError(
            "Please enter a molecule."
        );

        return;

    }


    hideError();

    setLoading();


    try {

        /*
            Create the viewer.
        */

        createViewer();


        /*
            Find the compound
            in PubChem.
        */

        const property =
            await getPubChemCompound(
                query
            );


        if (!property) {

            throw new Error(
                `No compound was found for "${query}". Try a molecular formula, chemical name, or SMILES notation.`
            );

        }


        const cid =
            property.CID;


        /*
            Try to get the actual
            3D conformer.
        */

        let sdf;


        try {

            sdf =
                await get3DSDF(
                    cid
                );

        } catch (error) {

            /*
                If no 3D structure exists,
                fall back to the 2D structure.
            */

            sdf =
                await get2DSDF(
                    cid
                );


            showError(
                "A 3D conformer is not available for this compound, so its molecular structure is being displayed using the available structure data."
            );

        }


        /*
            Render the molecule.
        */

        renderSDF(
            sdf
        );


        /*
            Update information.
        */

        updateInformation(
            property,
            cid,
            sdf
        );


        setReady();


    } catch (error) {

        console.error(
            error
        );


        showError(
            error.message ||
            "Unable to load the molecular structure."
        );


        loadingElement.style.display =
            "none";

    }

}


// -----------------------------------------------------
// VISUALIZE BUTTON
// -----------------------------------------------------

visualizeButton.addEventListener(
    "click",
    function () {

        visualizeMolecule(
            input.value
        );

    }
);


// -----------------------------------------------------
// ENTER KEY
// -----------------------------------------------------

input.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            visualizeMolecule(
                input.value
            );

        }

    }
);


// -----------------------------------------------------
// EXAMPLE BUTTONS
// -----------------------------------------------------

const exampleButtons =
    document.querySelectorAll(
        ".examples button"
    );


exampleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const value =
                    button.dataset.value;


                input.value =
                    value;


                visualizeMolecule(
                    value
                );

            }
        );

    }
);


// -----------------------------------------------------
// START WITH WATER
// -----------------------------------------------------

window.addEventListener(
    "load",
    function () {

        visualizeMolecule(
            "H2O"
        );

    }
);
