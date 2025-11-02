let map;


function get_notification_access(){
    Notification.requestPermission().then((result) => {
        report(result);
        if (result === "granted") {
            const notification = new Notification("Wygrana!");
        }
    });
}

function get_location_access(){
    navigator.permissions.query({name: "geolocation"}).then((result) => {
        result.addEventListener("change", () => report(result.state));
        if (result.state === "granted" || result.state === "prompt"){
            navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings);
        } else if(result.state === "denied"){
            report(result.state);
        }
    });
}

const geoSettings = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function report(state){
    console.log(`Permission state: ${state}`);
}


function revealPosition(position){
    const m = document.getElementById('m');
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;
    m.innerText = `Votre localisation : Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;

    if (!map){
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }
    map.setView([lat, lon], 13);
}

function positionDenied(error){
    console.log(`Accès à la localisation refusé : ${error.message}`);
    defaultMap();
}

function defaultMap(){
    if (!map){
        map = L.map('map').setView([51.5, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }
}


function prepare_puzzle(){
    const mapElement = document.getElementById('map');
    setTimeout(() => {
        html2canvas(mapElement, { useCORS: true }).then(function(canvas) {
            cut_puzzles(canvas);
        });
    }, 500);
}

function cut_puzzles(canvas){
    const width_piece = canvas.width / 4;
    const height_piece = canvas.height / 4;
    const puzzle_bench = document.getElementById('puzzle-bench');
    puzzle_bench.innerHTML = '';
    
    let pieces = [];
    for (let y = 0; y < 4; y++){
        for (let x = 0; x < 4; x++){
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.draggable = true;
            pieceCanvas.id = `piece-${y}-${x}`; 
            pieceCanvas.addEventListener('dragstart', handleDragStart);          
            pieceCanvas.width = width_piece;
            pieceCanvas.height = height_piece;
            
            const context = pieceCanvas.getContext('2d');
            const sy = y * height_piece;
            const sx = x * width_piece;

            context.drawImage(canvas, sx, sy, width_piece, height_piece, 0, 0, width_piece, height_piece);
            pieces.push(pieceCanvas);
        }
    }
    shuffleArray(pieces).forEach(piece => puzzle_bench.appendChild(piece));
}

function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function createSolveBench(){
    const solvebench = document.getElementById('solve-bench');
    solvebench.innerHTML = '';
    
    for (let y = 0; y < 4; y++){
        for (let x = 0; x < 4; x++){
            const newDiv = document.createElement('div');
            newDiv.className = "game-cell";
            newDiv.id = `cell-${y}-${x}`;
            newDiv.addEventListener('drop', handleDrop);
            newDiv.addEventListener('dragover', handleDragOver);
            newDiv.addEventListener('dragleave', handleDragLeave);
            solvebench.appendChild(newDiv);
        }
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragOver(e){
    e.preventDefault();
    if (e.target.className === 'game-cell') {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.target.className.includes('game-cell')) {
        e.target.classList.remove('drag-over');
    }
}

function handleDrop(e){
    e.preventDefault();
    const dropTarget = e.currentTarget;
    dropTarget.classList.remove('drag-over');

    const pieceId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(pieceId);

    if (dropTarget.className === 'game-cell' && dropTarget.childElementCount === 0){
        draggedElement.style.position = 'static';
        dropTarget.appendChild(draggedElement);

        if (checkWin()) {
            console.log("wygrana log!");
            get_notification_access();
        }
    }
}

function checkWin() {
    let correctPlacements = 0;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const cell = document.getElementById(`cell-${y}-${x}`);
            const expectedPieceId = `piece-${y}-${x}`;
            
            if (cell && cell.childElementCount === 1) {
                if (cell.children[0].id === expectedPieceId) {
                    correctPlacements++;
                }
            }
        }
    }
    return correctPlacements === 16;
}

defaultMap();
createSolveBench();