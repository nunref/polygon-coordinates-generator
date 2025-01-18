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

        lines.push([[previous_point[0], previous_point[1]], [point[0], point[1]]]);
    }

    points.push(point);
}

function closePolygon() {
        if (points.length > 2) {
            first_point = points[0];
            last_point = points[points.length - 1];

            context.beginPath();
            context.moveTo(first_point[0], first_point[1]);
            context.lineTo(last_point[0], last_point[1]);
            context.stroke();

            lines.push([[last_point[0], last_point[1]], [first_point[0], first_point[1]]]);
        }
}

function generateJSON(preview = false) {
    return JSON.stringify(
        {points: points, lines: lines}, 
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

function resize_canvas() {
    context.canvas.width = window.innerWidth * 0.6;
    context.canvas.height = window.innerHeight * 0.6;
}

function main() {
    window.addEventListener("load", () => {
        resize_canvas();
        fillPreview()
        canvas.addEventListener("click", draw);
        button.addEventListener("click", () => {
            closePolygon();
            fillPreview();
        });
        copy.addEventListener("click", saveJSONToClipboard);
        download.addEventListener("click", downloadJSON);
        window.addEventListener("resize", resize_canvas);
    });
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const button = document.getElementById("button");
const json_output = document.getElementById("json_output");
const copy = document.getElementById("copy");
const download = document.getElementById("download");

const points = [];
const lines = [];

main()

