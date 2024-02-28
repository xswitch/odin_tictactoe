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

    let currentMark = 'x';

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
        currentMark = 'x';
        console.log(gameBoard.getBoard());
        gameBoard.resetBoard();
        displayController.resetBoardElements();
        console.log(result);
    }

    function getMark() {
        return currentMark;
    }

    function changeMark() {
        (currentMark == 'x') ? currentMark = 'o' : currentMark = 'x';
    }

    return {
        checkForWinner,
        getMark,
        changeMark,
        playRound,
    }
})()


const displayController = (function() {
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
                gridContainer.appendChild(element);
            })
        })
    }

    // If cell is available, play round on that cell
    function cellClick(e, row, cell) {
        if (!gameBoard.isAvailable(row, cell)) return;
        e.target.textContent = gameController.getMark();
        e.target.classList.remove('free');
        gameController.playRound(row, cell)
    }

    // Removes all cells from the board
    function resetBoardElements() {
        const board = document.querySelectorAll('.cell');
        board.forEach(element => {
            element.textContent = '';
            element.classList.add('free');
        })
    }

    createGrid(gameBoard.getBoard());

    return {resetBoardElements,}
})()

function createPlayer(mark) {
    let score = 0;
    let currentMark = mark;

    function updateScore() {
        score++;
    }

    function getScore() {
        return score;
    }

    function changeMark(newMark) {
        currentMark = newMark;
    }

    function getMark() {
        return currentMark;
    }

    return {
        updateScore,
        getScore,
        changeMark,
        getMark,
    }
}