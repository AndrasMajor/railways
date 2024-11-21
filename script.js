let player = "";
let difficulty = 0;
let elapsedSeconds = 0;
let selectedMap = [];
let randomIndex = -1;
let timerInterval;
let gameOver = false;
let currentMapId;
let simplifiedMap = null;


//cell types, each represents a different tyles on the map
const CellType = {
    //tiles
    E: "empty",
    BV: "bridge_vertical",
    BH: "bridge_horizontal",
    M_DL: "mountain_downtoleft",
    M_DR: "mountain_downtoright",
    M_UL: "mountain_uptoleft",
    M_UR: "mountain_uptoright",
    O: "oasis",

    //tiles with rail
    R_UL: "rail_upleft",
    R_UR: "rail_upright",
    R_DL: "rail_downleft",
    R_DR: "rail_downright",
    R_V: "rail_vertical",
    R_H: "rail_horizontal",
    R_BV: "rail_bridge_vertical",
    R_BH: "rail_bridge_horizontal",
    R_M_DL: "rail_mountain_downtoleft",
    R_M_DR: "rail_mountain_downtoright",
    R_M_UL: "rail_mountain_uptoleft",
    R_M_UR: "rail_mountain_uptoright",

    //simplified tiles with rails
    UL: "upleft",
    UR: "upright",
    DL: "downleft",
    DR: "downright",
    V: "vertical",
    H: "horizontal",
    NR: "norail", 
};

// easy level maps
const easyMaps = [
    [ // easy map 1
      [CellType.E, CellType.M_DL, CellType.E, CellType.E, CellType.O],
      [CellType.E, CellType.E, CellType.E, CellType.BV, CellType.O],
      [CellType.BV, CellType.E, CellType.M_UL, CellType.E, CellType.E],
      [CellType.E, CellType.E, CellType.E, CellType.O, CellType.E],
      [CellType.E, CellType.E, CellType.M_UR, CellType.E, CellType.E]
    ],
    [ // easy map 2
        [CellType.O, CellType.E, CellType.BH, CellType.E, CellType.E],
        [CellType.E, CellType.M_UL, CellType.E, CellType.E, CellType.M_UL],
        [CellType.BV, CellType.O, CellType.M_UR, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.O, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E]
    ],
    [ // easy map 3
      [CellType.E, CellType.E, CellType.BH, CellType.E, CellType.E],
      [CellType.E, CellType.E, CellType.E, CellType.E, CellType.BV],
      [CellType.E, CellType.M_UL, CellType.BV, CellType.E, CellType.E],
      [CellType.E, CellType.O, CellType.E, CellType.E, CellType.E],
      [CellType.E, CellType.BH, CellType.E, CellType.E, CellType.M_UL]
    ],
    [ // easy map 4
      [CellType.E, CellType.E, CellType.E, CellType.BH, CellType.E],
      [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
      [CellType.BV, CellType.E, CellType.M_DL, CellType.E, CellType.M_DL],
      [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
      [CellType.E, CellType.E, CellType.O, CellType.M_UR, CellType.E]
    ],
    [ // easy map 5
      [CellType.E, CellType.E, CellType.BH, CellType.E, CellType.E],
      [CellType.E, CellType.M_DR, CellType.E, CellType.E, CellType.E],
      [CellType.BV, CellType.E, CellType.E, CellType.M_UR, CellType.E],
      [CellType.E, CellType.E, CellType.BV, CellType.O, CellType.E],
      [CellType.E, CellType.M_UL, CellType.E, CellType.E, CellType.E]
    ]
]; 

// hard level maps
const hardMaps = [
    [ // hard map 1
        [CellType.E, CellType.M_DL, CellType.O, CellType.O, CellType.E, CellType.BH, CellType.E],
        [CellType.BV, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.BV, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.M_UR, CellType.E, CellType.E, CellType.E],
        [CellType.M_UR, CellType.E, CellType.M_DL, CellType.E, CellType.BH, CellType.E, CellType.O],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.BH, CellType.E, CellType.E, CellType.E]
    ],
    [ // hard map 2
        [CellType.E, CellType.E, CellType.O, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.BV, CellType.E, CellType.BH, CellType.E, CellType.E, CellType.M_UL, CellType.E],
        [CellType.E, CellType.E, CellType.BH, CellType.E, CellType.E, CellType.E, CellType.BV],
        [CellType.M_DR, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.O, CellType.E, CellType.M_DL, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.M_DR, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.O, CellType.E, CellType.E, CellType.E, CellType.E]
    ],
    [ //hard map 3
        [CellType.E, CellType.E, CellType.BH, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.BV],
        [CellType.O, CellType.E, CellType.M_UR, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.O, CellType.M_UR, CellType.E, CellType.BH, CellType.E, CellType.E],
        [CellType.BV, CellType.E, CellType.E, CellType.E, CellType.E, CellType.M_DL, CellType.E],
        [CellType.E, CellType.E, CellType.O, CellType.M_UR, CellType.E, CellType.E, CellType.E]
    ],
    [ // hard map 4
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.BV, CellType.E, CellType.M_UL, CellType.E],
        [CellType.E, CellType.E, CellType.M_UR, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.BH, CellType.E, CellType.O, CellType.E, CellType.BH, CellType.E],
        [CellType.E, CellType.E, CellType.M_UL, CellType.E, CellType.M_DL, CellType.E, CellType.E],
        [CellType.BV, CellType.E, CellType.E, CellType.E, CellType.E, CellType.M_UR, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E]
    ],
    [ // hard map 5
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.M_DR, CellType.E],
        [CellType.E, CellType.BH, CellType.BH, CellType.E, CellType.M_DL, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.M_DR, CellType.E, CellType.O, CellType.E, CellType.E],
        [CellType.E, CellType.M_UL, CellType.E, CellType.BV, CellType.E, CellType.E, CellType.E],
        [CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E, CellType.E]
    ]
];

//this function simplyfies the selected map, it helps to handle the tiles easier
function simplifyMap(selectedMap) {
    simplifiedMap = JSON.parse(JSON.stringify(selectedMap));
    for (let i = 0; i < simplifiedMap.length; i++) {
        for (let j = 0; j < simplifiedMap[i].length; j++) {
            switch (simplifiedMap[i][j]) {
                case CellType.R_BV:
                case CellType.R_V:
                    simplifiedMap[i][j] = CellType.V;
                    break;
                case CellType.R_BH:
                case CellType.R_H:
                    simplifiedMap[i][j] = CellType.H;
                    break;
                case CellType.R_UL:
                case CellType.R_M_UL:
                    simplifiedMap[i][j] = CellType.UL;
                    break;
                case CellType.R_UR:
                case CellType.R_M_UR:
                    simplifiedMap[i][j] = CellType.UR;
                    break;
                case CellType.R_DL:
                case CellType.R_M_DL:
                    simplifiedMap[i][j] = CellType.DL;
                    break;
                case CellType.R_DR:
                case CellType.R_M_DR:
                    simplifiedMap[i][j] = CellType.DR;
                    break;
                case CellType.O:
                    simplifiedMap[i][j] = CellType.O;
                    break;
                default:
                    simplifiedMap[i][j] = CellType.NR;
                    break;
            }
        }
    }
    return simplifiedMap;
}

//converts the simplified map into an adjecency matrix
function toAdjacencyMatrix(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const size = rows * cols;
    const adjMatrix = Array.from({ length: size }, () => Array(size).fill(0));

    // Segédfüggvény a mátrix indexek 1D-re alakításához
    function toIndex(row, col) {
        return row * cols + col;
    }

    // Végigmegyünk az eredeti mátrixon
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = grid[r][c];
            const currentIndex = toIndex(r, c);

            if (cell === CellType.E || cell === CellType.O || cell === CellType.NR) continue;

            // UL: "upleft"
            if (cell === CellType.UL) {
                if (r > 0) adjMatrix[currentIndex][toIndex(r - 1, c)] = 1; // Fel
                if (c > 0) adjMatrix[currentIndex][toIndex(r, c - 1)] = 1; // Balra
            }
            // UR: "upright"
            else if (cell === CellType.UR) {
                if (r > 0) adjMatrix[currentIndex][toIndex(r - 1, c)] = 1; // Fel
                if (c < cols - 1) adjMatrix[currentIndex][toIndex(r, c + 1)] = 1; // Jobbra
            }
            // DL: "downleft"
            else if (cell === CellType.DL) {
                if (r < rows - 1) adjMatrix[currentIndex][toIndex(r + 1, c)] = 1; // Le
                if (c > 0) adjMatrix[currentIndex][toIndex(r, c - 1)] = 1; // Balra
            }
            // DR: "downright"
            else if (cell === CellType.DR) {
                if (r < rows - 1) adjMatrix[currentIndex][toIndex(r + 1, c)] = 1; // Le
                if (c < cols - 1) adjMatrix[currentIndex][toIndex(r, c + 1)] = 1; // Jobbra
            }
            // V: "vertical"
            else if (cell === CellType.V) {
                if (r > 0) adjMatrix[currentIndex][toIndex(r - 1, c)] = 1; // Fel
                if (r < rows - 1) adjMatrix[currentIndex][toIndex(r + 1, c)] = 1; // Le
            }
            // H: "horizontal"
            else if (cell === CellType.H) {
                if (c > 0) adjMatrix[currentIndex][toIndex(r, c - 1)] = 1; // Balra
                if (c < cols - 1) adjMatrix[currentIndex][toIndex(r, c + 1)] = 1; // Jobbra
            }
        }
    }

    return adjMatrix;
}

//this function ensures, that there is only one circle on the map
function onlyOneCircle(){
    let adjMatrix = toAdjacencyMatrix(simplifiedMap);
    const n = adjMatrix.length; // A szomszédsági mátrix mérete
    const visited = new Array(n).fill(false); // Látogatottság nyomon követése
    let cycleCount = 0; // Körök számlálása

    // Mélységi keresés (DFS)
    function dfs(node, parent) {
        visited[node] = true;

        for (let neighbor = 0; neighbor < n; neighbor++) {
            if (adjMatrix[node][neighbor] === 1) { // Van él
                if (!visited[neighbor]) {
                    // Ha még nem látogattuk, rekurzívan folytatjuk a keresést
                    if (dfs(neighbor, node)) {
                        return true;
                    }
                } else if (neighbor !== parent) {
                    // Ha a szomszéd már látogatott, és nem a szülő, akkor kört találtunk
                    return true;
                }
            }
        }
        return false;
    }

    // Minden komponens ellenőrzése
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            if (dfs(i, -1)) {
                cycleCount++;
            }
        }
    }

    // Pontosan egy kört kell találni
    return cycleCount === 1;
}

// this is the primary checkwin function, which is constantly check for a possible win
function checkWinFc() {
    const simplifiedMap = simplifyMap(selectedMap);
    const n = simplifiedMap.length;
    let win = true;
    let win2 = true;
    /* check if all tiles has rail on them except oasis*/
    for(let i = 0; i < simplifiedMap.length; i++)
    {
        for(let j = 0; j < simplifiedMap[0].length; j++)
        {
            switch(simplifiedMap[i][j])
            {
                case CellType.NR:
                    win = false;
                    break;
            }
        }
    }

    //check each cell
    for(let i = 0; i < n; i++)
    {
        for(let j = 0; j < n; j++)
        {
            win2 = checkCell(i,j,simplifiedMap[i][j],n, simplifiedMap);
            if(win2 == false) win = false;
        }
    }

    if (win && onlyOneCircle())
    {
        stopTimer();
        const newScore = saveScore(player, elapsedSeconds);
        displayToplist(newScore);
        gameOver = true;
    } 
}

//this function is used by checkWinFc, it checks the type of the given cell, and it's surrounding cells
function checkCell(i,j,cell,n, simplifiedMap)
{
    let helpMap = simplifiedMap;
    // check the four corners
    if((i == 0 && j == 0))
    {
        if(cell != CellType.O && cell != CellType.DR) return false;
    }
    else if((i == 0 && j == n-1))
    {
        if(cell != CellType.O && cell != CellType.DL) return false;
    }
    else if((i == n-1 && j == 0))
    {
        if(cell != CellType.O && cell != CellType.UR) return false;
    }
    else if((i == n-1 && j == n-1))
    {
        if(cell != CellType.O && cell != CellType.UL) return false;
    }

    // check the other cells
    else
    {
        // check which cells can not be used on the top row
        if(i == 0)
        {
            if(cell == CellType.V || cell == CellType.UL || cell == CellType.UR) return false;
        }
        // check which cells can not be used on the right side
        else if(j == n-1)
        {
            if(cell == CellType.H || cell == CellType.DR || cell == CellType.UR) return false;
        }
        // check which cells can not be used on the bottom row
        else if(i == n-1)
        {
            if(cell == CellType.V || cell == CellType.DR || cell == CellType.DL) return false;
        }
        // check which cells can not be used on the left side
        else if(j == 0)
        {
            if(cell == CellType.H || cell == CellType.DL || cell == CellType.UL) return false;
        }



        // on the bottom row we only have to check the cells next to each other
        if(i == n-1)
        {
            return checkLeft(i,j,cell, helpMap);
        }
        // on the left side we only have to check the cells under each other
        else if(j == 0)
        {
            return checkDown(i,j,cell, helpMap);
        }
        // in other cases we have to check the cells above and next to
        else
        {
            return (checkDown(i,j,cell, helpMap) && checkLeft(i,j,cell, helpMap));
        }
    }
}

// this function checks if the cell under the given cell is correct
function checkDown(i,j,cell, helpMap)
{
    if (i + 1 >= helpMap.length) return true;
    let cellDown = helpMap[i+1][j];
    switch(cell)
    {
        case CellType.O:
        case CellType.H:
        case CellType.UL:
        case CellType.UR:
            if(cellDown == CellType.V || cellDown == CellType.UL || cellDown == CellType.UR) return false;
            break;
        case CellType.V:
        case CellType.DL:
        case CellType.DR:
            if(cellDown == CellType.O || cellDown == CellType.H || cellDown == CellType.DR || cellDown == CellType.DL) return false;
            break;
        default:
            break;
    }
    return true;
}

//this function checks if the cell on the given cell's left side is correct
function checkLeft(i,j,cell, helpMap)
{
    if (j - 1 < 0) return true;
    let cellToLeft = helpMap[i][j-1];
    switch(cell)
    {
        case CellType.O:
        case CellType.V:
        case CellType.UR:
        case CellType.DR:
            if(cellToLeft == CellType.DR || cellToLeft == CellType.UR || cellToLeft == CellType.H) return false;
            break;
        case CellType.H:
        case CellType.UL:
        case CellType.DL:
            if(cellToLeft == CellType.O || cellToLeft == CellType.UL || cellToLeft == CellType.DL || cellToLeft == CellType.V) return false;
            break;
        default:
            break;
    }
    return true;
}

//this function chooses a random map, knowing the difficulty
function getRandomMap(maps)
{
    randomIndex = Math.floor(Math.random() * maps.length);
    return maps[randomIndex];
}

//this function creates the board table, and it fills the cells with the correct images
function generateBoard(map)
{
    const table = document.createElement("table");
    table.classList.add("table_class");
    table.setAttribute('id', 'game-board');
    map.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement("td");
        td.classList.add("td_class");
  
        const cellImage = document.createElement("img");
        cellImage.classList.add("cell-image");
  
        // setting the cell's images
        switch (cell) {
          case CellType.E:
            cellImage.src = "pics/tiles/empty.png";
            break;
          case CellType.BH:
            cellImage.src = "pics/tiles/bridge_horizontal.png";
            break;
          case CellType.BV:
            cellImage.src = "pics/tiles/bridge_vertical.png";
            break;
          case CellType.M_DL:
            cellImage.src = "pics/tiles/mountain_downtoleft.png";
            break;
          case CellType.M_DR:
            cellImage.src = "pics/tiles/mountain_downtoright.png";
            break;
          case CellType.M_UL:
            cellImage.src = "pics/tiles/mountain_uptoleft.png";
            break;
          case CellType.M_UR:
            cellImage.src = "pics/tiles/mountain_uptoright.png";
            break;
          case CellType.O:
            cellImage.src = "pics/tiles/oasis.png";
            break;
        }
  
        td.appendChild(cellImage);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    document.querySelector(".board").appendChild(table);
} 

//this function sets the difficulty easy
function setDiffEasyFc()
{
    difficulty = 1;
    document.querySelector(".d_easy").classList.add('selected');
    document.querySelector(".d_hard").classList.remove('selected');
}

//this function sets the difficulty hard
function setDiffHardFc()
{
    difficulty = 2;
    document.querySelector(".d_easy").classList.remove('selected');
    document.querySelector(".d_hard").classList.add('selected');
}

//this function helps to deepcopy the maps
function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item));
    }
    const newObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepCopy(obj[key]);
        }
    }
    return newObj;
}

//when the player presses start, this function is responsible to change the menu screen to the game screen
function startFc() {
    player = document.querySelector("#name").value;
    if (player != "" && difficulty > 0) {
        startTimer();
        document.querySelector("#menu").style.display = "none";
        document.querySelector(".title-image").style.display = "none";
        document.querySelector("#title").style.display = "none";
        document.querySelector('#game').style.display = "flex";
        document.querySelector(".player_name").innerText = player;
        document.querySelector(".timer").innerText = formatTime(elapsedSeconds);

        if (difficulty === 1) {
            selectedMap = deepCopy(getRandomMap(easyMaps));
            generateBoard(selectedMap);
        } else {
            selectedMap = deepCopy(getRandomMap(hardMaps));
            generateBoard(selectedMap);
        }
        document.querySelectorAll("#game-board td").forEach(cell => {
            cell.addEventListener('click', handleClickFc, false);
        });

        document.querySelectorAll('#game-board td img').forEach(img => {
            img.addEventListener('click', handleImageClick, false);
        });
    }
}

//this function changes the clicked cell's image
function handleImageClick(e) {
    if(gameOver){return;}
    const img = e.target;
    const currentSrc = img.src.split('/').pop();
    
    switch (currentSrc) {
        case 'bridge_vertical.png':
            img.src = 'pics/tiles/bridge_rail_vertical.png';
            break;
        case 'bridge_rail_vertical.png':
            img.src = 'pics/tiles/bridge_vertical.png';
            break;
        case 'bridge_horizontal.png':
            img.src = 'pics/tiles/bridge_rail_horizontal.png';
            break;
        case 'bridge_rail_horizontal.png':
            img.src = 'pics/tiles/bridge_horizontal.png';
            break;
        case 'empty.png':
            img.src = 'pics/tiles/curve_rail_dl.png';
            break;
        case 'curve_rail_dl.png':
            img.src = 'pics/tiles/curve_rail_dr.png';
            break;
        case 'curve_rail_dr.png':
            img.src = 'pics/tiles/curve_rail_ul.png';
            break;
        case 'curve_rail_ul.png':
            img.src = 'pics/tiles/curve_rail_ur.png';
            break;
        case 'curve_rail_ur.png':
            img.src = 'pics/tiles/straight_rail_horizontal.png';
            break;
        case 'straight_rail_horizontal.png':
            img.src = 'pics/tiles/straight_rail_vertical.png';
            break;
        case 'straight_rail_vertical.png':
            img.src = 'pics/tiles/empty.png';
            break;
        case 'mountain_uptoleft.png':
            img.src = 'pics/tiles/mountain_rail_ul.png';
            break;
        case 'mountain_rail_ul.png':
            img.src = 'pics/tiles/mountain_uptoleft.png';
            break;
        case 'mountain_uptoright.png':
            img.src = 'pics/tiles/mountain_rail_ur.png';
            break;
        case 'mountain_rail_ur.png':
            img.src = 'pics/tiles/mountain_uptoright.png';
            break;
        case 'mountain_downtoleft.png':
            img.src = 'pics/tiles/mountain_rail_dl.png';
            break;
        case 'mountain_rail_dl.png':
            img.src = 'pics/tiles/mountain_downtoleft.png';
            break;
        case 'mountain_downtoright.png':
            img.src = 'pics/tiles/mountain_rail_dr.png';
            break;
        case 'mountain_rail_dr.png':
            img.src = 'pics/tiles/mountain_downtoright.png';
            break;
        default:
            break;
    }
}

//this function refreshes the selectedMaps's clicked cell's value
function handleClickFc(e) {
    if(gameOver){return;}
    const cell = e.target;
    const rowIndex = cell.closest('tr').rowIndex;
    const cellIndex = cell.closest('td').cellIndex;

    switch(selectedMap[rowIndex][cellIndex]){
        case CellType.BV:
            selectedMap[rowIndex][cellIndex] = CellType.R_BV;
            break;
        case CellType.R_BV:
            selectedMap[rowIndex][cellIndex] = CellType.BV;
            break;
        case CellType.BH:
            selectedMap[rowIndex][cellIndex] = CellType.R_BH;
            break;
        case CellType.R_BH:
            selectedMap[rowIndex][cellIndex] = CellType.BH;
            break;
        case CellType.E:
            selectedMap[rowIndex][cellIndex] = CellType.R_DL;
            break;
        case CellType.R_DL:
            selectedMap[rowIndex][cellIndex] = CellType.R_DR;
            break;
        case CellType.R_DR:
            selectedMap[rowIndex][cellIndex] = CellType.R_UL;
            break;
        case CellType.R_UL:
            selectedMap[rowIndex][cellIndex] = CellType.R_UR;
            break;
        case CellType.R_UR:
            selectedMap[rowIndex][cellIndex] = CellType.R_H;
            break;
        case CellType.R_H:
            selectedMap[rowIndex][cellIndex] = CellType.R_V;
            break;
        case CellType.R_V:
            selectedMap[rowIndex][cellIndex] = CellType.E;
            break;
        case CellType.M_UL:
            selectedMap[rowIndex][cellIndex] = CellType.R_M_UL;
            break;
        case CellType.R_M_UL:
            selectedMap[rowIndex][cellIndex] = CellType.M_UL;
            break;
        case CellType.M_UR:
            selectedMap[rowIndex][cellIndex] = CellType.R_M_UR;
            break;
        case CellType.R_M_UR:
            selectedMap[rowIndex][cellIndex] = CellType.M_UR;
            break;
        case CellType.M_DL:
            selectedMap[rowIndex][cellIndex] = CellType.R_M_DL;
            break;
        case CellType.R_M_DL:
            selectedMap[rowIndex][cellIndex] = CellType.M_DL;
            break;
        case CellType.M_DR:
            selectedMap[rowIndex][cellIndex] = CellType.R_M_DR;
            break;
        case CellType.R_M_DR:
            selectedMap[rowIndex][cellIndex] = CellType.M_DR;
            break;
        default:
            break;
    }
    checkWinFc();
}

//this function checks of two arrays are equal
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++)
        {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i]))
        {
            if (!arraysEqual(arr1[i], arr2[i])) return false;
        }
        else if (arr1[i] !== arr2[i])
        {
            return false;
        }
    }
    return true;
}

//when the solution is correct, this function saves the player's time
function saveScore(player, time) {
    const currentMapId = `map_${randomIndex}_difficulty_${difficulty}`;
    const scores = JSON.parse(localStorage.getItem(currentMapId)) || [];

    const newScore = {
        player: player,
        time: time,
        difficulty: difficulty === 1 ? 'easy' : 'hard',
        mapId: randomIndex + 1
    };

    scores.push(newScore);
    scores.sort((a, b) => a.time - b.time);
    localStorage.setItem(currentMapId, JSON.stringify(scores));
    return newScore;
}

//this function is responsible to display the toplist if a player solves a map
function displayToplist(newlyAdded = null) {
    const currentMapId = `map_${randomIndex}_difficulty_${difficulty}`;
    const scores = JSON.parse(localStorage.getItem(currentMapId)) || [];

    const toplistDiv = document.querySelector("#toplist");
    toplistDiv.style.display = "flex";

    const existingTable = toplistDiv.querySelector(".toplist-table");
    if (existingTable) {
        existingTable.remove();
    }

    const table = document.createElement("table");
    table.classList.add("toplist-table");

    const headerRow = document.createElement("tr");
    const headerCells = ["Rank", "Név", "Idő", "Szint", "Pálya"];
    headerCells.forEach(cellText => {
        const th = document.createElement("th");
        th.textContent = cellText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    scores.forEach((score, index) => {
        const row = document.createElement("tr");

        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;

        const playerCell = document.createElement("td");
        playerCell.textContent = score.player;

        const timeCell = document.createElement("td");
        timeCell.textContent = formatTime(score.time);

        const difficultyCell = document.createElement("td");
        difficultyCell.textContent = score.difficulty;

        const mapIdCell = document.createElement("td");
        mapIdCell.textContent = score.mapId;

        row.appendChild(rankCell);
        row.appendChild(playerCell);
        row.appendChild(timeCell);
        row.appendChild(difficultyCell);
        row.appendChild(mapIdCell);

        if (newlyAdded && newlyAdded.player === score.player && newlyAdded.time === score.time) {
            row.classList.add("new-entry");

            setTimeout(() => {
                row.classList.remove("new-entry");
            }, 2000);
        }

        table.appendChild(row);
    });

    const closeHintRow = document.createElement("tr");
    const closeHintCell = document.createElement("td");
    closeHintCell.colSpan = 5;
    closeHintCell.textContent = "Nyomja meg az Esc a bezáráshoz";
    closeHintCell.style.fontWeight = "bold";
    closeHintRow.appendChild(closeHintCell);
    table.appendChild(closeHintRow);

    toplistDiv.appendChild(table);
}

//this function shows the description when its clicked
function showDescription() {
    document.querySelector("#descriptionModal").style.display = "block";
}

//this function closes the description
function hideDescription() {
    document.querySelector("#descriptionModal").style.display = "none";
}

//this function ensures that the time is displayed correctly
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

//this function starts the timer
function startTimer()
{
    const timerElement = document.querySelector('#elapsed-time');
    
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        timerElement.textContent = formatTime(elapsedSeconds);
    }, 1000);
}

//this function stotps the timer
function stopTimer() {
    clearInterval(timerInterval);
}

//when the Esc button is pressed it closes the toplist
function closeTopList(event)
{
    const toplist = document.querySelector('#toplist');
    if (event.key === 'Escape' && toplist.style.display === 'flex') {
        toplist.style.display = 'none';
    }
}

//this function is responsible for displaying the best scores from each difficulty
function displayBestScores() {
    const scores = [];
    for (let difficulty = 1; difficulty <= 2; difficulty++) {
        const difficultyText = difficulty === 1 ? 'easy' : 'hard';
        for (let i = 0; i < 5; i++) {
            const mapId = `map_${i}_difficulty_${difficulty}`;
            const mapScores = JSON.parse(localStorage.getItem(mapId)) || [];
            scores.push(...mapScores);
        }
    }

    const bestScores = {
        easy: scores.filter(score => score.difficulty === 'easy').sort((a, b) => a.time - b.time)[0],
        hard: scores.filter(score => score.difficulty === 'hard').sort((a, b) => a.time - b.time)[0]
    };

    const toplistDiv = document.querySelector("#toplist");
    toplistDiv.style.display = "flex";
    toplistDiv.innerHTML = '';

    const table = document.createElement("table");
    table.classList.add("toplist-table");

    const headerRow = document.createElement("tr");
    const headerCells = ["Név", "Idő", "Szint"];
    headerCells.forEach(cellText => {
        const th = document.createElement("th");
        th.textContent = cellText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    ["easy", "hard"].forEach(level => {
        if (bestScores[level]) {
            const score = bestScores[level];
            const row = document.createElement("tr");

            const playerCell = document.createElement("td");
            playerCell.textContent = score.player;

            const timeCell = document.createElement("td");
            timeCell.textContent = formatTime(score.time);

            const difficultyCell = document.createElement("td");
            difficultyCell.textContent = level;

            row.appendChild(playerCell);
            row.appendChild(timeCell);
            row.appendChild(difficultyCell);

            table.appendChild(row);
        }
    });

    const closeHintRow = document.createElement("tr");
    const closeHintCell = document.createElement("td");
    closeHintCell.colSpan = 3;
    closeHintCell.textContent = "Nyomja meg az Esc billentyűt a bezáráshoz";
    closeHintCell.style.fontWeight = "bold";
    closeHintRow.appendChild(closeHintCell);
    table.appendChild(closeHintRow);

    toplistDiv.appendChild(table);
}

//this function is called, when the discription is open, and the user presses space
function showTop2(e)
{
    if (e.code === "Space" && document.querySelector("#descriptionModal").style.display === "block")
    {
        displayBestScores();
    }
}

//when the user starts a new game, this function is called, it sets every element how the were at the start
function newGameFc() {
    const gameElement = document.querySelector("#game");
    if (gameElement.style.display === 'flex') {
        gameElement.style.display = 'none';
        document.querySelector(".title-image").style.display = 'block';
        document.querySelector("#title").style.display = 'flex';
        document.querySelector("#menu").style.display = 'block';
        document.querySelector(".d_easy").classList.remove('selected');
        document.querySelector(".d_hard").classList.remove('selected');
        document.querySelector("#name").value = "";
        document.querySelector('.board').removeChild(document.querySelector('.table_class'));
        document.querySelector("#elapsed-time").textContent = "00:00";

        stopTimer();
        player = "";
        difficulty = 0;
        elapsedSeconds = 0;
        selectedMap = [];
        randomIndex = -1;
        timerInterval = null;
        gameOver = false;
        currentMapId = -1;
        delete simplifiedMap;
    }
}

//this function handles the other functions
function init()
{
    document.querySelector("#start_button").addEventListener('click', startFc, false);
    document.querySelector(".d_easy").addEventListener('click', setDiffEasyFc, false);
    document.querySelector(".d_hard").addEventListener('click', setDiffHardFc, false);
    document.querySelector("#description_button").addEventListener('click', showDescription, false);
    document.querySelector(".close").addEventListener("click", hideDescription, false);
    document.addEventListener("keydown", closeTopList, false);
    document.addEventListener("keydown", showTop2, false);
    document.querySelector(".new_game").addEventListener('click', newGameFc, false);
}

window.addEventListener('load', init, false);
