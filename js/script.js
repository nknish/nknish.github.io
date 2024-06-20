document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('grid-container');
    const gridHeight = 50;
    const gridWidth = 100;
    const gridItems = []
    const gridValues = Array.from({ length: gridHeight }, (_, rowIndex) => 
        Array.from({ length: gridWidth }, (_, colIndex) =>
            (rowIndex + colIndex) % 2
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

    // switch colors around
    function switchColors() {
        const numToSwitch = 3;
        for (let i = 0; i < numToSwitch; i++) {
            const id = Math.round(Math.random() * gridHeight * gridWidth)
            const color = gridItems[id].style.backgroundColor;
            gridItems[id].style.backgroundColor = color === 'rgb(221, 221, 221)' ? '#223388' : '#dddddd';
        }
    }

    // cgol iterate
    function iterate() {
        // declare a new, blank array of the proper size
        // nested loop through the array
            // check the neighborhood
            // given the neighborhood and current state, determine new state
            // place new state into new array at proper row, col
        // 2 options:
            // somehow 'return' the new array to be used
            // point the old array name toward the new one using assignment
        // finally, make sure colors update 
    }


    // Set interval to switch colors every second
    setInterval(switchColors, 100);

});
