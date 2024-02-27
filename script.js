const gameBoard = (function () {
    let boardArray = 
    [[0, 0, 0],
     [0, 0, 0],
     [0, 0, 0]];

    let currentMark = 'x'

    function allEqual(array) {
        return array.every((value => value == currentMark));
    }

    function checkForWinner() {
        let winner = false;

        // Checks rows
        boardArray.forEach(row => {
            console.log(row[0]);
            if (allEqual(row)) winner = true;
        })

        // Checks columns
        boardArray[0].forEach((column, index) => {
            if (allEqual([column, boardArray[1][index], boardArray[2][index]])) winner = true;
        })

        // Check diagonal
        if (allEqual([boardArray[0][0], boardArray[1][1], boardArray[2][2]])) winner = true;
        if (allEqual([boardArray[0][2], boardArray[1][1], boardArray[2][0]])) winner = true;

        return winner;
    }

    function getBoard() {
        return boardArray;
    }

    return {
        getBoard,
        checkForWinner,
    }
})()

console.log(gameBoard.checkForWinner());