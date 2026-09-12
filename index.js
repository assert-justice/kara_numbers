const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 360;

let ctx = null;

function main(){
    const input = document.querySelector("#value");
    input.addEventListener("change", e => drawNumber(e.target.valueAsNumber));
    ctx = document.querySelector("#canvas").getContext("2d");
    ctx.strokeStyle = "#C1AB00";
    ctx.lineWidth = 4;
    drawNumber(100);
}
function drawNumber(number){
    ctx.setTransform();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.translate(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
    // ctx.clearRect(-CANVAS_WIDTH * 0.5, -CANVAS_HEIGHT * 0.5, CANVAS_WIDTH, CANVAS_HEIGHT);
    // ctx.fillStyle = "red";
    drawCircle(ctx, 0, 0, 60);
    if(number < 0){
        drawCircle(ctx, 0, 0, 6);
        number = -number;
    }
    const digits = toDigits(number);
    const da = Math.PI / 6;
    let angle = - (digits.length - 1) / 2 * da;
    ctx.rotate(angle);
    for (const d of digits) {
        drawDigit(ctx, d);
        ctx.rotate(da);
    }
}
function toDigits(number){
    const res = [];
    let mod = 6;
    while(number > 0){
        const digit = number % mod;
        res.push(digit);
        number = Math.floor(number / mod);
    }
    return res;
}
function drawDigit(ctx, digit){
    if(digit === 0){
        drawLine(ctx, 60, 0, 60-6*4, 0);
        return;
    }
    drawLine(ctx, 60, 0, 156, 0);
    if(digit === 1) return;
    drawLine(ctx, 156, -18, 156, 18);
    if(digit === 2) return;
    drawCircle(ctx, 156, -24, 6);
    if(digit === 3) return;
    drawLine(ctx, 108, -18, 108, 18);
    if(digit === 4) return;
    drawCircle(ctx, 108, -24, 6);
}
function drawCircle(ctx, x, y, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    const segments = 48;
    const da = Math.PI * 2 / segments;
    let angle = 0;
    for (let idx = 0; idx <= segments; idx++) {
        ctx.lineTo(Math.cos(angle) * r + x, Math.sin(angle) * r + y);
        angle += da;
    }
    ctx.stroke();
}
function drawLine(ctx, startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

main();
