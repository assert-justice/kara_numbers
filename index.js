let canvasWidth = 360;
let canvasHeight = 360;
let cellSize = 6;

let ctx = null;
let rootNode = null;
let valueNode = null;
let bgColorNode = null;
let strokeColorNode = null;
let canvas = null;

function init(w, h){
    rootNode = document.querySelector("#root");
    while (rootNode.firstChild) {
        rootNode.removeChild(rootNode.firstChild);
    }
    canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    rootNode.appendChild(canvas);
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = strokeColorNode?.value ?? "#C1AB00";
    ctx.lineWidth = 4;
    ctx.fillStyle = bgColorNode?.value ?? "#000000";
    ctx.font = "72px serif";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function calculator(){
    valueNode = document.querySelector("#value");
    valueNode.addEventListener("change", renderSingle);
    bgColorNode = document.querySelector("#bg-color");
    bgColorNode.addEventListener("change", renderSingle);
    strokeColorNode = document.querySelector("#stroke-color");
    strokeColorNode.addEventListener("change", renderSingle);
    renderSingle();
}
function renderSingle(){
    init(canvasWidth, canvasHeight);
    drawNumber(valueNode.valueAsNumber, canvasWidth * 0.5, canvasHeight *  0.5);
}
function displayLegend(){
    const numbers = [0, 1, 2, 3, 4, 5, 6, 36, 100];
    const values = numbers.map(n => [n,n]);
    init(canvasWidth * 2, canvasHeight * values.length);
    renderNumbers(values);
}
function displayKeys(){
    const numbers = [ 1210, 627, 956, 6459, 95, 860, 3669, 1281, 7336, 95, 5750 ]
    const values = numbers.map((n, idx) => [String.fromCharCode(idx + 65),n]);
    init(canvasWidth * 2, canvasHeight * values.length);
    renderNumbers(values);
}
function displaySingleDigits(){
    rootNode = document.querySelector("#root");
    while (rootNode.firstChild) {
        rootNode.removeChild(rootNode.firstChild);
    }
    for (const d of [1,2,3,4,5,6]) {
        canvas = document.createElement("canvas");
        canvas.width = cellSize * 22;
        canvas.height = cellSize * 22;
        rootNode.appendChild(canvas);
        ctx = canvas.getContext("2d");
        ctx.strokeStyle = strokeColorNode?.value ?? "#C1AB00";
        ctx.lineWidth = 4;
        ctx.fillStyle = bgColorNode?.value ?? "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawSingleDigit(d, canvas.width * 0.5, canvas.height * 0.5);
    }
}
function renderNumbers(values){
    for(let idx = 0; idx < values.length; idx++){
        const [text, number] = values[idx];
        ctx.strokeText(text, canvasWidth * 0.5, canvasHeight * (idx + 0.5));
        drawNumber(number, canvasWidth * 1.5, canvasHeight * (idx + 0.5));
        if(idx > 0){
            drawLine(0, canvasHeight * idx, canvas.width, canvasHeight * idx);
        }
    }
    drawLine(canvasWidth, 0, canvasWidth, canvas.height);
}
function drawNumber(number, x, y, segments = 12){
    drawCircle(x, y, cellSize * 10);
    if(number < 0){
        drawCircle(x, y, cellSize);
        number = -number;
    }
    const digits = toDigits(number);
    const da = Math.PI * 2 / segments;
    let angle = - (digits.length - 1) / 2 * da;
    for (const d of digits) {
        drawDigit(d, x, y, angle);
        angle += da;
    }
}
function drawSingleDigit(digit, x, y){
    drawCircle(x, y, cellSize * 10);
    drawCircle(x - cellSize * 8, y, cellSize);
    if(digit === 0) return;
    drawLine(x - cellSize * 7, y, x + cellSize * 7, y);
    if(digit === 1) return;
    drawLine(x + cellSize * 7, y - cellSize, x + cellSize * 7, y + cellSize * 2);
    if(digit === 2) return;
    drawCircle(x + cellSize * 7, y - cellSize * 2, cellSize);
    if(digit === 3) return;
    drawLine(x, y - cellSize, x, y + cellSize * 2);
    if(digit === 4) return;
    drawCircle(x, y - cellSize * 2, cellSize);
    if(digit === 5) return;
    const [xa,ya] = rotateVec(cellSize, 0, -Math.PI / 3);
    const [xb,yb] = rotateVec(cellSize * 6, 0, -Math.PI / 3);
    drawLine(xa - cellSize * 8 + x, ya + y, xb - cellSize * 8 + x, yb + y);
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
function drawDigit(digit, x, y, angle){
    let xa, ya, xb, yb;
    if(digit === 0){
        [xa,ya] = rotateVec(cellSize * 10, 0, angle);
        [xb,yb] = rotateVec(cellSize * 6, 0, angle);
        drawLine(xa + x, ya + y, xb + x, yb + y);
        return;
    }
    [xa,ya] = rotateVec(cellSize * 10, 0, angle);
    [xb,yb] = rotateVec(cellSize * 26, 0, angle);
    drawLine(xa + x, ya + y, xb + x, yb + y);
    if(digit === 1) return;
    [xa,ya] = rotateVec(cellSize * 26, -3 * cellSize, angle);
    [xb,yb] = rotateVec(cellSize * 26, 3 * cellSize, angle);
    drawLine(xa + x, ya + y, xb + x, yb + y);
    if(digit === 2) return;
    [xa,ya] = rotateVec(cellSize * 26, -4 * cellSize, angle);
    drawCircle(xa + x, ya + y, cellSize);
    if(digit === 3) return;
    [xa,ya] = rotateVec(cellSize * 18, -3 * cellSize, angle);
    [xb,yb] = rotateVec(cellSize * 18, 3 * cellSize, angle);
    drawLine(xa + x, ya + y, xb + x, yb + y);
    if(digit === 4) return;
    [xa,ya] = rotateVec(cellSize * 18, -4 * cellSize, angle);
    drawCircle(xa + x, ya + y, cellSize);
}
function drawCircle(x, y, r){
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
function rotateVec(x, y, angle){
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const nx = x * c - y * s;
    const ny = x * s + y * c;
    return [nx, ny];
}
function drawLine(startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
