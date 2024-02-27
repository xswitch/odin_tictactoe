const gameBoard = (function () {
    let boardArray = 
    [[1, 'x', 1],
     [0, 'x', 1],
     [0, 'x', 1]];

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