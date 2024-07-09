document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('grid-container');  // html container
    const height = 50;
    const width = height * 2;
    const gridItems = [];  // list of html items (each one is a tile)
    const brightColors = ['#6cbc4d', '#d4e056', '#f18244', '#e23f51', '#584796', '#3b7bbd'];  // for 'N' 
    let countdown = 10;  // how many iterations before the N collapses into surroundings


    // intialize randomized grid
    let gridValues = Array.from(Array(height), () => new Array(width).fill(0));
    for (let i = 0; i < gridValues.length; i++) {
        for (let j = 0; j < gridValues[i].length; j++) {
            gridValues[i][j] = Math.round(Math.random()-0.25);  // approx. 1/4 chance of life?
        }
    }

    // read data from file to populate grid
    fetch('txt/n.txt').then(response => {
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
                gridValues[counter+16][index+41] = parseInt(row.charAt(index));
            }
            counter ++;
        });

        /*
            putting this createGrid() function, instead of just continuing
            the rest of the code below, ensures that the file is read and
            its contents are used in the grid before everything displays.
            this effectively makes the asynchronous 'fetch' function into
            a synchronous one.
        */
        createGrid();

    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

    // check if a position (i, j) is within 10 spaces of the center
    function isInCenter(i, j, width, height) {
        leftBound = width / 2 - 10;
        rightBound = width / 2 + 11;
        topBound = height / 2 - 10;
        bottomBound = height / 2 + 11;
        return i > topBound && i < bottomBound && j > leftBound && j < rightBound;
    }

    // after preparing array of values, make the actual grid from those values
    function createGrid() {
        for (let i =0; i < height; i++) {
            for (let j = 0; j < width; j++ ) {
                const gridItem = document.createElement('div');  // create a div for the item
                gridItem.classList.add('grid-item');  // add to css class to apply styles
                if (isInCenter(i, j, width, height)) {  // if it's in the special box
                    if (gridValues[i][j] === 1) {
                        // one of the bright colors from the list
                        gridItem.style.backgroundColor = brightColors[Math.round(Math.random()*(brightColors.length-1))];
                    } else {
                        // should probably pick a better dark color
                        gridItem.style.backgroundColor = '#222244';
                    }
                } else {
                    // set color based on alive or dead
                    gridItem.style.backgroundColor = gridValues[i][j] === 1 ? '#aaaaaa' : '#103074';
                }
                gridContainer.appendChild(gridItem);  // add item to the container
                gridItems.push(gridItem);  // add item to the list of items
            }
        }
    }
    
    // cgol iterate
    function iterate() {
        const newGrid = Array.from({ length: gridValues.length}, () => Array(gridValues[0].length).fill(0));
        // loop through the whole previous array, building the new array along the way
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[0].length; j++) {
                neighbors = neighborhood(i, j);
                if (countdown > 0 && isInCenter(i, j, width, height)) {
                    // the special middle section doesn't iterate till countdown ends
                    newGrid[i][j] = gridValues[i][j];
                } else if (gridValues[i][j] === 1) {  // stay alive if 2 or 3 neighbors
                    if (neighbors === 2 || neighbors === 3) newGrid[i][j] = 1;
                } else {  // come alive if exactly 3 neighbors
                    if (neighbors === 3) newGrid[i][j] = 1;
                }
            }
        }
        if (countdown > 0) {
            countdown --;  // decrement countdown
        }
        if (countdown === 0) {
            const proceeder = document.getElementById('scroll-button')
            /*
                proceeder.addEventListener('click', proceed);
                IMPORTANT!!! this line above being commented out means that
                none of the 'proceed' related stuff will happen, making
                the button useless. this shouldn't be commented out once
                the button's functionality is ready to implement.
             */
            proceeder.setAttribute('href', '#proceed');
            countdown --;
        }
        gridValues = newGrid;  // 'active' grid points toward newly evaluated grid
        updateColors();
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
            const i = Math.floor(index / width);
            const j = index % width;
            if (countdown > 0 && isInCenter(i, j, width, height)) {
                // doesn't mess with the fun colors until the countdown ends
            } else if (gridValues[i][j] === 1) {
                gridItems[index].style.backgroundColor = '#aaaaaa';  // 'on'
            } else {
                gridItems[index].style.backgroundColor = '#103074';  // 'off'
            }
        }
    }

    function popTile() {
        /*
        the calculation of 'rows' below ensures that sometimes, none are
        cleared which makes the clearing 'jerky' to fit the vibe. i may
        change it because it looks like unintentional performance issues
        */
        const rows = Math.round(Math.random() - 0.1) * 4

        for (let i = 0; i < rows * 100; i++) {  // each row is 100 tiles, hence (rows * 100)
            if (gridItems.length > 0) {
                gridItems.pop().remove();
            } else {
                clearInterval(poppingInterval);  // stop popping
                proceedFinish();  // occurs after all tiles have been popped
            }
        }

        let h = Math.floor(gridItems.length / 10);
        gridContainer.style.height = `${h}px`;
    }

    function proceed() {  // when the 'proceed' button is clicked
        const proceeder = document.getElementById('scroll-button')

        proceeder.removeEventListener('click', proceed);  // doesn't let it happen again

        clearInterval(iterationInterval);  // stops all cgol related activities
        let poppingInterval = setInterval(popTile, 50);  // starts removing rows of tiles
    }

    function proceedFinish() {

    }

    // Set interval to iterate 5x per second
    let iterationInterval = setInterval(iterate, 200);

});
