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
        if (isAvailable(x, y)) boardArray[x][y] = mark;
    }

    return {
        getBoard,
        addMark,
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
            console.log(row[0]);
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
        gameBoard.addMark(x, y, currentMark);
        if (!checkForWinner(gameBoard.getBoard())) {
            if (checkForTie(gameBoard.getBoard())) console.log(`A TIE!`);
        } else {
            console.log(`${currentMark} WINS!`);
        }
        changeMark()
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

gameController.playRound(0, 1)
gameController.playRound(0, 0)
gameController.playRound(0, 2)
gameController.playRound(1, 1)
gameController.playRound(1, 0)
gameController.playRound(1, 2)
gameController.playRound(2, 1)
gameController.playRound(2, 0)
gameController.playRound(2, 2)
console.log(gameBoard.getBoard());
console.log(gameController.checkForWinner(gameBoard.getBoard()));