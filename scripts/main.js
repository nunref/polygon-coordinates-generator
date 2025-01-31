function draw(event) {
    vertex = [event.x - canvas.offsetLeft, event.y - canvas.offsetTop];

    context.beginPath();
    context.arc( vertex[0], vertex[1], 5, 0, Math.PI * 2, 1);
    context.fill();

    if (vertices.length > 0) {
        previous_vertex = vertices[vertices.length - 1];

        context.beginPath();
        context.moveTo(vertex[0], vertex[1]);
        context.lineTo(previous_vertex[0], previous_vertex[1]);
        context.stroke();

        sides.push([[previous_vertex[0], previous_vertex[1]], [vertex[0], vertex[1]]]);
    }

    vertices.push(vertex);
}

function clearPolygon() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    vertices = [];
    sides = [];
    fillPreview();
}

function closePolygon() {
        if (vertices.length > 2) {
            first_vertex = vertices[0];
            last_vertex = vertices[vertices.length - 1];

            context.beginPath();
            context.moveTo(first_vertex[0], first_vertex[1]);
            context.lineTo(last_vertex[0], last_vertex[1]);
            context.stroke();

            sides.push([[last_vertex[0], last_vertex[1]], [first_vertex[0], first_vertex[1]]]);
        }
}

function generateJSON(preview = false) {
    return JSON.stringify(
        {vertices: vertices, sides: sides}, 
        (key, value) => {
            console.log(key, value, typeof value);
            if (value instanceof Array) {
                array_str = "";
                if (preview && value.length > 2) {
                    array_str = JSON.stringify(value.slice(0, 2));
                    array_str = array_str.slice(0,-1) + ",...]";
                } else {
                    array_str = JSON.stringify(value);
                }
                return array_str;
            }
            return value;
        }, 
        1
    );
}

function fillPreview() {
    json_output.textContent = generateJSON(true);
}

async function saveJSONToClipboard() {
    try {
        await navigator.clipboard.writeText(generateJSON());
        copy.textContent = "Copied!";
        window.setTimeout(() => {
            copy.textContent = "Copy JSON";
        }, 1000);
    } catch (error) {
        alert(error.message);
    }
}

function downloadJSON() {
    const blob = new Blob(
        [generateJSON()],
        {type: "application/json"}
    );
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = vertices.length + "-vertices-polygon.json";
    anchor.click();
    URL.revokeObjectURL(blobUrl);
}

function main() {
    context.canvas.width = window.innerWidth * 0.6;
    context.canvas.height = window.innerHeight * 0.6;

    window.addEventListener("load", () => {
        fillPreview()
        canvas.addEventListener("click", draw);
        done.addEventListener("click", () => {
            closePolygon();
            fillPreview();
        });
        clear.addEventListener("click", clearPolygon);
        copy.addEventListener("click", saveJSONToClipboard);
        download.addEventListener("click", downloadJSON);
    });
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const done = document.getElementById("done");
const clear = document.getElementById("clear");
const json_output = document.getElementById("json_output");
const copy = document.getElementById("copy");
const download = document.getElementById("download");

let vertices = [];
let sides = [];

main()

