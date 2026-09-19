const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 360;
// const CANVAS_HEIGHT = 240;
const CELL_SIZE = 6;

let ctx = null;
let rootNode = null;
let valueNode = null;
let bgColorNode = null;
let strokeColorNode = null;

// cool number 3598
const numbers = [0, 1, 2, 3, 4, 5, 6, 36, 100];
// const numbers = [0, 1, 2, 3, 4, 5, 6, 36, 100];
// const ds = [4,5,3,4,2];
// console.log(n);
function randInt(min, max){
    // note: makes range inclusive
    max++;
    const diff = max - min;
    return Math.floor(Math.random() + diff) + min;
}
function rngNumber(){
    const numDigits = randInt(3, 5);
    const digits = [];
    for(let idx = 0; idx < numDigits; idx++){
        digits.push(randInt(2, 5));
    }
    let n = 0;
    let pow = 1;
    for (const element of digits) {
        n += element * pow;
        pow *= 6;
    }
    return n;
}

function main(){
    valueNode = document.querySelector("#value");
    valueNode.addEventListener("change", render);
    bgColorNode = document.querySelector("#bg-color");
    bgColorNode.addEventListener("change", render);
    strokeColorNode = document.querySelector("#stroke-color");
    strokeColorNode.addEventListener("change", render);
    rootNode = document.querySelector("#root");
    render();
    // numbers.length = 0;
    // for (let idx = 0; idx < 11; idx++) {
    //     numbers.push(rngNumber());
    // }
    // let idx = randInt(0, 11);
    // numbers.splice(idx, 0, 3598);
    // renderNumbers();
}
function render(){
    while (rootNode.firstChild) {
        rootNode.removeChild(rootNode.firstChild);
    }
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    rootNode.appendChild(canvas);
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = strokeColorNode.value;
    ctx.lineWidth = 4;
    ctx.fillStyle = bgColorNode.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawNumber(valueNode.valueAsNumber, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT *  0.5);
}
function renderNumbers(){
    while (rootNode.firstChild) {
        rootNode.removeChild(rootNode.firstChild);
    }
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH * 2;
    canvas.height = CANVAS_HEIGHT * numbers.length;
    rootNode.appendChild(canvas);
    ctx = canvas.getContext("2d");
    ctx.font = "72px serif";
    ctx.strokeStyle = strokeColorNode.value;
    ctx.lineWidth = 4;
    ctx.fillStyle = bgColorNode.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let idx = 0; idx < numbers.length; idx++){
        ctx.strokeText(numbers[idx], CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * (idx + 0.5));
        drawNumber(numbers[idx], CANVAS_WIDTH * 1.5, CANVAS_HEIGHT * (idx + 0.5));
        if(idx > 0){
            drawLine(0, CANVAS_HEIGHT * idx, canvas.width, CANVAS_HEIGHT * idx);
        }
    }
    drawLine(CANVAS_WIDTH, 0, CANVAS_WIDTH, canvas.height);
}
function drawNumber(number, x, y, segments = 12){
    drawCircle(x, y, CELL_SIZE * 10);
    if(number < 0){
        drawCircle(x, y, CELL_SIZE);
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
        [xa,ya] = rotateVec(CELL_SIZE * 10, 0, angle);
        [xb,yb] = rotateVec(CELL_SIZE * 6, 0, angle);
        drawLine(xa + x, ya + y, xb + x, yb + y);
        return;
    }
    [xa,ya] = rotateVec(CELL_SIZE * 10, 0, angle);
    [xb,yb] = rotateVec(CELL_SIZE * 26, 0, angle);
    drawLine(xa + x, ya + y, xb + x, yb + y);
    if(digit === 1) return;
    [xa,ya] = rotateVec(CELL_SIZE * 26, -3 * CELL_SIZE, angle);
    [xb,yb] = rotateVec(CELL_SIZE * 26, 3 * CELL_SIZE, angle);
    drawLine(xa + x, ya + y, xb + x, yb + y);
    if(digit === 2) return;
    [xa,ya] = rotateVec(CELL_SIZE * 26, -4 * CELL_SIZE, angle);
    drawCircle(xa + x, ya + y, CELL_SIZE);
    if(digit === 3) return;
    [xa,ya] = rotateVec(CELL_SIZE * 18, -3 * CELL_SIZE, angle);
    [xb,yb] = rotateVec(CELL_SIZE * 18, 3 * CELL_SIZE, angle);
    drawLine(xa + x, ya + y, xb + x, yb + y);
    if(digit === 4) return;
    [xa,ya] = rotateVec(CELL_SIZE * 18, -4 * CELL_SIZE, angle);
    drawCircle(xa + x, ya + y, CELL_SIZE);
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

main();
