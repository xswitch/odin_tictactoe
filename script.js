const gameBoard = (function () {
    let boardArray = 
    [['', '', ''],
     ['', '', ''],
     ['', '', '']];

    // Returns boardArray
    function getBoard() {
        return boardArray;
    }

    // Checks (x, y) in array
    function isAvailable(x, y) {
        return (boardArray[x][y] == '') ? true : false;
    }

    // If index is available then add mark, else return false
    function addMark(x, y, mark) {
        if (isAvailable(x, y)) {
            boardArray[x][y] = mark;
        } else {
            return false;
        }
    }

    // Loop through array and set all entries to ''
    function resetBoard() {
        boardArray.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                boardArray[rowIndex][cellIndex] = ''
            })
        })
    }

    return {
        getBoard,
        addMark,
        resetBoard,
        isAvailable,
    }
})()

const gameController = (function() {

    const marks = ['X', 'O'];
    let currentMark = marks[0];
    const players = [];

    // Checks if all values in an array matches "currentMark"
    function allEqual(array) {
        return array.every((value => value == array[0] && value != 0));
    }
    
    // Returns true if any check is true
    function checkForWinner(array) {
        let winner = false;

        // Checks rows
        array.forEach(row => {
            if (allEqual(row)) winner = true;
        })

        // Checks columns
        array[0].forEach((column, index) => {
            if (allEqual([column, array[1][index], array[2][index]])) winner = true;
        })

        // Check diagonal
        if (allEqual([array[0][0], array[1][1], array[2][2]])) winner = true;
        if (allEqual([array[0][2], array[1][1], array[2][0]])) winner = true;

        return winner;
    }

    // Check for tie
    function checkForTie(array) {
        let tie = true;

        array.forEach(row => {
            if (row.includes('')) tie = false;
        })

        return tie;
    }

    function playRound(x, y) {
        // Add mark if empty
        // Checks for winning conditions, if not change mark
        if (gameBoard.addMark(x, y, currentMark) == false) return;
        if (checkForWinner(gameBoard.getBoard())) {
            endRound(currentMark)
            if (checkForTie(gameBoard.getBoard()));
        } else if (checkForTie(gameBoard.getBoard())) {
            endRound('tie')
        } else {
            changeMark()
        }
    }

    function endRound(result) {
        currentMark = marks[0];
        gameBoard.resetBoard();
        displayController.resetBoardElements();
    }

    function getMark() {
        return [currentMark, getMarkIndex()];
    }

    function getMarkIndex() {
        return marks.indexOf(currentMark);
    }

    function createPlayer(mark, name) {
        let score = 0;
        let currentMark = mark;
    
        function getName() {
            return name;
        }
    
        function updateScore() {
            score++;
        }
    
        function getScore() {
            return score;
        }
    
        function getMark() {
            return currentMark;
        }
    
        return {
            updateScore,
            getScore,
            getMark,
            getName,
        }
    }

    function setupPlayers(inputMarks, inputNames) {
        players.push(createPlayer(marks[inputMarks[0]], inputNames[0]))
        players.push(createPlayer(marks[inputMarks[1]], inputNames[1]))
        console.log(players);
    }

    function changeMark() {
        (currentMark == marks[0]) ? currentMark = marks[1] : currentMark = marks[0];
    }

    return {
        checkForWinner,
        getMark,
        changeMark,
        playRound,
        setupPlayers,
        players,
    }
})()


const displayController = (function() {
    const imageUrls = [
        ["url('/img/cross-outline.svg'", "url('/img/cross.svg'"],
        ["url('/img/circle-outline.svg'", "url('/img/circle.svg'"],
    ]

    // Creates all elements based on values in passed array
    function createGrid(array) {
        const gridContainer = document.querySelector('.gameContainer');
        array.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const element = document.createElement('div');
                element.classList.add('cell');
                element.classList.add('free')
                element.textContent = cell;
                element.addEventListener('click', (e) => {
                    cellClick(e, rowIndex, cellIndex)
                })
                element.addEventListener('mouseover', (e) => {
                    cellHover(e, rowIndex, cellIndex)
                })
                element.addEventListener('mouseleave', (e) => {
                    cellLeave(e, rowIndex, cellIndex)
                })
                gridContainer.appendChild(element);
            })
        })
    }

    // If cell is available, play round on that cell
    function cellClick(e, row, cell) {
        if (!gameBoard.isAvailable(row, cell)) return;
        e.target.style.backgroundImage = imageUrls[gameController.getMark()[1]][1]
        e.target.classList.remove('free');
        gameController.playRound(row, cell)
    }

    // If cell is available, change background to hover version
    function cellHover(e, row, cell) {
        if (!gameBoard.isAvailable(row, cell)) return;
        e.target.style.backgroundImage = imageUrls[gameController.getMark()[1]][0]

    }

    // Revert back to no background image
    function cellLeave(e, row, cell) {
        if (!gameBoard.isAvailable(row, cell)) return;
        e.target.style.backgroundImage = ""
    }

    // Removes all cells from the board
    function resetBoardElements() {
        const board = document.querySelectorAll('.cell');
        board.forEach(element => {
            element.textContent = '';
            element.classList.add('free');
            element.style.backgroundImage = ''
        })
    }

    // Sets up newGame modal
    function initModal() {
        // Changes marks and matches them to their respective indexes.
        const switchMarkElement = document.querySelector('.changeMark');
        switchMarkElement.addEventListener('click', () => {
            const markElements = document.querySelectorAll('.playerMark');
            markElements.forEach(element => {
                if (Number(element.dataset.mark) == 0) {
                    element.dataset.mark = 1;
                    element.style.backgroundImage = imageUrls[1][1];
                } else {
                    element.dataset.mark = 0;
                    element.style.backgroundImage = imageUrls[0][1];
                }
            })
        })

        // Passes marks and names to player creating function in gameController.
        const startGameButton = document.querySelector('.startGame');
        startGameButton.addEventListener('click', () => {
            gameController.setupPlayers(getPlayerMark(), getPlayerNames());
            toggleModal(1)
        });
    }

    // Returns an array of the values in playerName inputs
    function getPlayerNames() {
        const inputElement = document.querySelectorAll('.playerName')
        const inputValues = Array.from(inputElement).map((element) => element.value);
        return inputValues;
    }

    // Return an array with what mark player1 and 2 has chosen
    function getPlayerMark() {
        const inputMarks = document.querySelectorAll('.playerMark');
        return Array.from(inputMarks).map((element) => Number(element.dataset.mark));
    }

    createGrid(gameBoard.getBoard());
    initModal()

    return {resetBoardElements, getPlayerNames, getPlayerMark}
})()


function toggleModal(target) {
    const targetModal = (target == 1) ? document.querySelector('.menu') : document.querySelector('.roundEnd')
    targetModal.classList.toggle('show')
}
