function draw(event) {
    point = [event.x - canvas.offsetLeft, event.y - canvas.offsetTop];

    context.beginPath();
    context.arc( point[0], point[1], 5, 0, Math.PI * 2, 1);
    context.fill();

    if (points.length > 0) {
        previous_point = points[points.length - 1];
        drawLine(previous_point, point);
    }

    points.push(point);
}

function drawLine(first_point, second_point) {
    context.beginPath();
    context.moveTo(second_point[0], second_point[1]);
    context.lineTo(first_point[0], first_point[1]);
    context.stroke();
}

function donePolygon() {
    if (points.length > 2) {
        first_point = points[0];
        last_point = points[points.length - 1];
        drawLine(last_point, first_point);
    }
    fillPreview();
}

function clearPolygon() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    fillPreview();
}

function generateJSON(preview = false) {
    let vertices = [];
    if (points.length > 0) {
        for (let point of points) {
            vertices.push([point[0], canvas.height - point[1]]);
        }
    }

    let sides = [];
    if (vertices.length > 1) {
        for (let i = 0; i < vertices.length - 1; i++) {
            sides.push([[vertices[i][0], vertices[i][1]], [vertices[i+1][0], vertices[i+1][1]]]);
        }
        sides.push([[vertices[vertices.length - 1][0], vertices[vertices.length - 1][1]], [vertices[0][0], vertices[0][1]]]);
    }


    return JSON.stringify(
        {vertices: vertices, sides: sides}, 
        (key, value) => {
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
    anchor.download = points.length + "-sides-polygon.json";
    anchor.click();
    URL.revokeObjectURL(blobUrl);
}

function main() {
    context.canvas.width = window.innerWidth * 0.6;
    context.canvas.height = window.innerHeight * 0.6;

    window.addEventListener("load", () => {
        fillPreview()
        canvas.addEventListener("click", draw);
        done.addEventListener("click", donePolygon);
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

let points = [];

main()

