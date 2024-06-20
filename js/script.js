document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById('grid-container');
    const gridSize = 10;
    const gridItems = []
    const gridValues = [[0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];


    // create grid
    for (let i =0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++ ) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.style.backgroundColor = gridValues[i][j] === 1 ? '#dddddd' : '#223388';
            gridContainer.appendChild(gridItem);
            gridItems.push(gridItem);
        }
    }

    // switch colors around
    function switchColors() {
        const numToSwitch = 10;
        for (let i = 0; i < numToSwitch; i++) {
            const id = Math.round(Math.random() * gridSize * gridSize)
            const color = gridItems[id].style.backgroundColor;
            gridItems[id].style.backgroundColor = color === 'rgb(221, 221, 221)' ? '#223388' : '#dddddd';
        }
    }

    // Set interval to switch colors every second
    setInterval(switchColors, 300);

});
