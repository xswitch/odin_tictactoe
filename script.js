const gameBoard = (function () {
    let boardArray = 
    [[0, 0, 0],
     [0, 0, 0],
     [0, 0, 0]];

    // Returns boardArray
    function getBoard() {
        return boardArray;
    }

    function addMark(x, y, mark) {
        if (boardArray[x][y] == 0) boardArray[x][y] = mark;
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

    function playRound(x, y) {
        gameBoard.addMark(x, y, currentMark);
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

gameController.playRound(1, 0)
gameController.playRound(0, 0)
gameController.playRound(1, 1)
gameController.playRound(0, 1)
console.log(gameBoard.getBoard());
console.log(gameController.checkForWinner(gameBoard.getBoard()));