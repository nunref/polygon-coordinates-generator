function draw(event) {
    point = [event.x - canvas.offsetLeft, event.y - canvas.offsetTop];

    context.beginPath();
    context.arc( point[0], point[1], 5, 0, Math.PI * 2, 1);
    context.fill();

    if (points.length > 0) {
        previous_point = points[points.length - 1];

        context.beginPath();
        context.moveTo(point[0], point[1]);
        context.lineTo(previous_point[0], previous_point[1]);
        context.stroke();
    }

    points.push(point);
}

function clearPolygon() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    fillPreview();
}

function closePolygon() {
        if (points.length > 2) {
            first_point = points[0];
            last_point = points[points.length - 1];

            context.beginPath();
            context.moveTo(first_point[0], first_point[1]);
            context.lineTo(last_point[0], last_point[1]);
            context.stroke();
        }
}

function generateJSON(preview = false) {
    let sides = [];
    if (points.length > 1) {
        for (let i = 0; i < points.length - 1; i++) {
            sides.push([[points[i][0], points[i][1]], [points[i+1][0], points[i+1][1]]]);
        }
        sides.push([[points[points.length - 1][0], points[points.length - 1][1]], [points[0][0], points[0][1]]]);
    }


    return JSON.stringify(
        {points: points, sides: sides}, 
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
    anchor.download = points.length + "-points-polygon.json";
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

let points = [];

main()

