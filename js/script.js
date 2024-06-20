document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('grid-container');
    const gridHeight = 50;
    const gridWidth = 100;
    const gridItems = []
    let gridValues = Array.from({ length: gridHeight }, (_, rowIndex) => 
        Array.from({ length: gridWidth }, (_, colIndex) =>
            (rowIndex * 2 + colIndex + Math.floor((Math.random() * 4))) % 4
        )
    );


    // create grid
    for (let i =0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++ ) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.style.backgroundColor = gridValues[i][j] === 1 ? '#dddddd' : '#223388';
            gridContainer.appendChild(gridItem);
            gridItems.push(gridItem);
        }
    }

    // cgol iterate
    function iterate() {
        console.log(gridValues[0][0] + ', ' + gridValues[0][1]);
        const newGrid = Array.from({ length: gridValues.length}, () => Array(gridValues[0].length).fill(0));
        // loop through the whole previous array, building the new array along the way
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
                neighbors = neighborhood(i, j);
                if (gridValues[i][j] === 1) {  // stay alive if 2 or 3 neighbors
                    if (neighbors === 2 || neighbors === 3) newGrid[i][j] = 1;
                } else {  // come alive if exactly 3 neighbors
                    if (neighbors === 3) newGrid[i][j] = 1;
                }
            }
        }
        gridValues = newGrid;  // 'active' grid points toward newly evaluated grid
        updateColors();
    }

    function neighborhood(row, col) {
        let neighbors = 0;
        for (let i = row - 1; i < row + 2; i++) {
            for (let j = col - 1; j < col + 2; j++) {
                if (i >= 0 && j >= 0 && i < gridValues.length && j < gridValues[0].length) {  // boundary check
                    if (!(i === row & j === col) && gridValues[i][j] === 1)  // not counting self
                    neighbors ++;
                }
            }
        }
        return neighbors;
    }

    function updateColors() {
        for (let index = 0; index < gridItems.length; index++) {
            const i = Math.floor(index / gridWidth);
            const j = index % gridWidth;
            if (gridValues[i][j] === 1) {
                gridItems[index].style.backgroundColor = '#aaaaaa';
            } else {
                gridItems[index].style.backgroundColor = '#223388';
            }
        }
    }


    // Set interval to switch colors every second
    setInterval(iterate, 200);

});
