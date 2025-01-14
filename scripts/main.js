function draw(event) {
    point = [event.x - canvas.offsetLeft, event.y - canvas.offsetTop];

    context.beginPath();
    context.arc( point[0], point[1], 5, 0, Math.PI * 2, 1);
    context.fill();

    if (points.length > 0) {
        //TODO: avoid that [0]
        previous_point = points[points.length - 1][0];

        context.beginPath();
        context.moveTo(point[0], point[1]);
        context.lineTo(previous_point[0], previous_point[1]);
        context.stroke();
    }

    points.push([point]);
}

function closePolygon() {
        if (points.length > 2) {
            first_point = points[0][0];
            last_point = points[points.length - 1][0];

            context.beginPath();
            context.moveTo(first_point[0], first_point[1]);
            context.lineTo(last_point[0], last_point[1]);
            context.stroke();
        }
}

function resize_canvas() {
    context.canvas.width = window.innerWidth * 0.6;
    context.canvas.height = window.innerHeight * 0.6;
}

function main() {
    window.addEventListener("load", () => {
        resize_canvas()
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

main()
