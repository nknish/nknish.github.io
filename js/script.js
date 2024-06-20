document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('grid-container');  // html container
    const gridHeight = 50;
    const gridWidth = 100;
    const gridItems = [];  // list of html items (each one is a tile)

    // intialize empty grid
    let gridValues = Array.from(Array(gridHeight), () => new Array(gridWidth).fill(0));

    // read data from file to populate grid
    fetch('noah.txt').then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    }).then(data => {
        const dataArray = data.split('\n');  // 1d array, each element is 1 row of txt
        /*
            there's gotta be a more elegant way to do this nested loop
            i'll come back to it
        */
        let counter = 0;
        dataArray.forEach(row => {
            for (let index = 0; index < row.length; index++) {
                // puts integer equivalent of each char into the grid values
                gridValues[counter][index] = parseInt(row.charAt(index));
            }
            counter ++;
        });
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

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
        updateColors();
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
    }

    function neighborhood(row, col) {
        let neighbors = 0;
        // loop through the 'neighborhood': 3x3 square surrounding the tile on all sides
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
            /*
                gridItems is 1d and gridValues is 2d, so
                floor division and modulus are needed
                to enable smooth interaction between them
            */
             const i = Math.floor(index / gridWidth);
            const j = index % gridWidth;
            if (gridValues[i][j] === 1) {
                gridItems[index].style.backgroundColor = '#aaaaaa';  // 'on'
            } else {
                gridItems[index].style.backgroundColor = '#223388';  // 'off'
            }
        }
    }


    // Set interval to iterate 5x per second
    setInterval(iterate, 200);

});
