let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
// let marker = L.marker([53.430127, 14.564802]).addTo(map);
// marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");
let pieces;
window.onload = () => {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
};
document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        // here we have the canvas
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        
        // Ustawiamy kanwę na 600x600px dla 4x4 grid (150x150 każdy kawałek)
        rasterMap.width = 600;
        rasterMap.height = 600;
        let rasterMAPA=rasterContext.drawImage(canvas, 0, 0, 600, 600);
       
        gen_puzzle_piece(rasterMap);

    });
});
function gen_puzzle_piece(sourceCanvas){
    pieces=[];
    const container=document.getElementById("puzzleContainer");
    container.innerHTML="";
    const dropZone=document.getElementById("dropZone");
    dropZone.innerHTML="";
    
    // Tworzymy sloty w dropZone - 4x4 grid (UKRYTE)
    for(let row=0;row<4;row++){
        for(let col=0;col<4;col++){
            const slot=document.createElement('div');
            slot.className='puzzle_slot';
            slot.dataset.row=row;
            slot.dataset.col=col;
            slot.id=`slot-${row}-${col}`;
            slot.style.position='absolute';
            slot.style.left=(col*150)+'px';
            slot.style.top=(row*150)+'px';
            slot.style.width=150+'px';
            slot.style.height=150+'px';
            slot.style.border='none'; // Brak obramowania
            slot.style.backgroundColor='transparent'; // Przezroczyste
            slot.style.boxSizing='border-box';
            dropZone.appendChild(slot);
        }
    }
    
    const random_pieces=[];
    for(let row=0;row<4;row++){
        for(let col=0;col<4;col++){
            random_pieces.push({row,col});
        }
    }
    random_pieces.sort(()=>Math.random()-0.5);
    random_pieces.forEach((piece,index)=>{
        const {row,col} = piece;
        const piece_e=document.createElement('div');
        piece_e.className='puzzle_piece';
        piece_e.draggable=true;
        piece_e.dataset.row= row;
        piece_e.dataset.col=col;
        piece_e.style.width=150+'px';
        piece_e.style.height=150+'px';

        const pieceCanvas=document.createElement('canvas');
        pieceCanvas.width = 150;
        pieceCanvas.height = 150;
        const c=pieceCanvas.getContext('2d');
        c.drawImage(sourceCanvas,col*150,row*150,150,150,0,0,150,150);

        piece_e.style.backgroundImage = `url(${pieceCanvas.toDataURL()})`;
        piece_e.style.backgroundSize = 'cover';
        container.appendChild(piece_e);
        pieces.push(piece_e);
    });
    document.getElementById("miejsce_na_puzle").style.display='block';
    DragAndDrop();
}
function DragAndDrop(){
    const Dropzone=document.getElementById('dropZone');
    let dragged=null;
    
    pieces.forEach(piece=>{
        piece.addEventListener('dragstart',(e)=>{
            dragged=piece;
            piece.classList.add('dragging');
            e.dataTransfer.effectAllowed='move';
        });
        piece.addEventListener('dragend',(e)=>{
            piece.classList.remove('dragging');
        });
    })
    Dropzone.addEventListener('dragover',(e)=>{
        e.preventDefault();
        e.dataTransfer.dropEffect='move';
        Dropzone.classList.add('drag-over');
    });
    Dropzone.addEventListener('dragleave',(e)=>{
        if(e.target===Dropzone){
            Dropzone.classList.remove('drag-over');
        }
    });
    Dropzone.addEventListener('drop',(e)=>{
        e.preventDefault();
        Dropzone.classList.remove('drag-over');
        if(dragged){
            const rect=Dropzone.getBoundingClientRect();
            const x=e.clientX-rect.left;
            const y=e.clientY-rect.top;
            placePuzzlePiece(dragged,x,y);
        }
    });
}
function placePuzzlePiece(pieceElement,x,y){
    const Dropzone=document.getElementById('dropZone');
    const dropZoneRect=Dropzone.getBoundingClientRect();
    
    // Czy upuszczenie miało miejsce wewnątrz dropZone
    if(x>=0 && x<dropZoneRect.width && y>=0 && y<dropZoneRect.height){
        const pieceRow=parseInt(pieceElement.dataset.row);
        const pieceCol=parseInt(pieceElement.dataset.col);

        // Sprawdzamy czy ta sama część już istnieje
        const existingPiece=Dropzone.querySelector(`[data-piece-row="${pieceRow}"][data-piece-col="${pieceCol}"]`);
        if(existingPiece){
            existingPiece.remove();
        }

        const clonedPiece=pieceElement.cloneNode(true);
        clonedPiece.id=`placed-${pieceRow}-${pieceCol}`;
        clonedPiece.className='puzzle_piece_placed';
        clonedPiece.draggable=false;
        clonedPiece.dataset.pieceRow=pieceRow;
        clonedPiece.dataset.pieceCol=pieceCol;
        clonedPiece.style.position='absolute';
        clonedPiece.style.left=x+'px';
        clonedPiece.style.top=y+'px';
        clonedPiece.style.width=150+'px';
        clonedPiece.style.height=150+'px';
        clonedPiece.style.cursor='move';
        Dropzone.appendChild(clonedPiece);
        makeMovable(clonedPiece);

        pieceElement.style.display='none';

        // Informacja o umieszczonym puzzlu
        checkPuzzlePiece(clonedPiece);
        checkPuzzleComplete();
    }
}
function checkPuzzlePiece(piece){
    const pieceRow=parseInt(piece.dataset.pieceRow);
    const pieceCol=parseInt(piece.dataset.pieceCol);
    const tolerance=30;

    const correctLeft=pieceCol*150;
    const correctTop=pieceRow*150;
    const currentLeft=parseInt(piece.style.left);
    const currentTop=parseInt(piece.style.top);
    const diffLeft=Math.abs(currentLeft-correctLeft);
    const diffTop=Math.abs(currentTop-correctTop);

    if(diffLeft<=tolerance && diffTop<=tolerance){
        console.debug(`Puzzle [${pieceRow},${pieceCol}] umieszczony w dobrym miejscu!`);
    } else {
        console.debug(`Puzzle [${pieceRow},${pieceCol}] w zlym miejscu: (${currentLeft}px, ${currentTop}px), Powinno być: (${correctLeft}px, ${correctTop}px)`);
    }
}
function makeMovable(element){
    let pos1=0,pos2=0,pos3=0,pos4=0;
    element.addEventListener('mousedown',(e)=>{
        e.preventDefault();
        pos3=e.clientX;
        pos4=e.clientY;
        element.addEventListener('mousemove',dragElement);
        element.addEventListener('mouseup',stopDrag);
    });
    const dragElement=(e)=>{
        pos1=pos3-e.clientX;
        pos2=pos4-e.clientY;
        pos3=e.clientX;
        pos4=e.clientY;
        element.style.top=(element.offsetTop-pos2)+'px';
        element.style.left=(element.offsetLeft-pos1)+'px';
    };
    const stopDrag=()=>{
        element.removeEventListener('mousemove',dragElement);
        element.removeEventListener('mouseup',stopDrag);
        // Sprawdzamy pozycje po upuszczeniu
        checkPuzzlePiece(element);
        checkPuzzleComplete();
    };
}

function checkPuzzleComplete(){
    const Dropzone=document.getElementById('dropZone');
    let completed=true;
    const tolerance=30;
    
    for(let row=0;row<4;row++){
        for(let col=0;col<4;col++){
            const piece=Dropzone.querySelector(`[data-piece-row="${row}"][data-piece-col="${col}"]`);
            if(!piece){
                completed=false;
                break;
            }
            
            // Prawidłowa pozycja dla tego puzzla
            const correctLeft=col*150;
            const correctTop=row*150;

            // Aktualna pozycja
            const currentLeft=parseInt(piece.style.left);
            const currentTop=parseInt(piece.style.top);
            
            // Sprawdzamy czy jest w tolerancji
            if(Math.abs(currentLeft-correctLeft)>tolerance || Math.abs(currentTop-correctTop)>tolerance){
                completed=false;
                break;
            }
        }
        if(!completed) break;
    }
    
    if(completed){
        console.log('wszystkie puzle w dobrym miejscu');
        setTimeout(()=>{
            // Powiadomienie systemowe
            if(Notification.permission==="granted"){
                new Notification("Gratulacje!", {
                    body: "Udało się ułożyć puzzle!",
                });
            } else {
                alert('Udało się ułożyć puzzle!');
            }
        }, 100);
    }
}
document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        document.getElementById("latitude").innerText = position.coords.latitude;
        document.getElementById("longitude").innerText = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});
