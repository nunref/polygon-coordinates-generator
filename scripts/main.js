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

function generateJSON() {
    json_output.textContent = JSON.stringify(
        {points: points, lines: lines}, 
        (key, value) => {
            console.log(key, value, typeof value);
            if (value instanceof Array) {
                array_str = JSON.stringify(value.slice(0, 2));
                if (value.length > 2) {
                    array_str = array_str.slice(0,-1) + ",...]";
                }
                return array_str;
            }
            return value;
        }, 
        1
    );
}

function resize_canvas() {
    context.canvas.width = window.innerWidth * 0.6;
    context.canvas.height = window.innerHeight * 0.6;
}

function main() {
    window.addEventListener("load", () => {
        resize_canvas();
        generateJSON()
        canvas.addEventListener("click", draw);
        button.addEventListener("click", () => {
            closePolygon();
            generateJSON();
        });
        window.addEventListener("resize", resize_canvas);
    });
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const button = document.getElementById("button");
const json_output = document.getElementById("json_output");
const points = [];
const lines = [];

main()

