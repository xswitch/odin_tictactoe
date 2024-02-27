const gameBoard = (function () {
    let boardArray = 
    [['', '', ''],
     ['', '', ''],
     ['', '', '']];

    // Returns boardArray
    function getBoard() {
        return boardArray;
    }

    function isAvailable(x, y) {
        return (boardArray[x][y] == '') ? true : false;
    }

    function addMark(x, y, mark) {
        if (isAvailable(x, y)) {
            boardArray[x][y] = mark;
        } else {
            return false;
        }
    }

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
        if (gameBoard.addMark(x, y, currentMark) == false) return;;
        if (!checkForWinner(gameBoard.getBoard())) {
            if (checkForTie(gameBoard.getBoard())) endRound('tie')
        } else {
            endRound(currentMark)
        }
        changeMark()
    }

    function endRound(result) {
        currentMark = 'x';
        gameBoard.resetBoard();
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
