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
    let currentPlayer;
    let players = [];
    let playing = true;

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
        if (!playing) return;
        if (gameBoard.addMark(x, y, currentPlayer.getMark()) == false) return;
        if (checkForWinner(gameBoard.getBoard())) {
            endRound(currentPlayer)
            if (checkForTie(gameBoard.getBoard()));
        } else if (checkForTie(gameBoard.getBoard())) {
            endRound('tie')
        } else {
            changePlayer()
        }
    }

    function endRound(result) {
        displayController.changeWinningText(result);
        if (result != 'tie') currentPlayer.updateScore()
        currentPlayer = players[0];
        console.table([players[0].getScore(),players[1].getScore()])
        toggleState(false)
        displayController.toggleModal(2);
    }

    function getMark() {
        return [currentPlayer.getMark(), getMarkIndex()];
    }

    function getMarkIndex() {
        return marks.indexOf(currentPlayer.getMark());
    }

    function getState() {
        return playing;
    }

    function toggleState(newState) {
        (newState == true) ? playing = true : playing = false;
    }

    // Player factory
    function createPlayer(mark, name) {
        let score = 0;

        if (name == '') name = `Player ${players.length+1}`
    
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
            return mark;
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
        currentPlayer = players[0]
    }

    function changePlayer() {
        (currentPlayer == players[0]) ? currentPlayer = players[1] : currentPlayer = players[0];
    }

    function resetPlayers() {
        players = [];
        currentPlayer = ''
    }

    return {
        checkForWinner,
        getMark,
        changePlayer,
        playRound,
        setupPlayers,
        getState,
        toggleState,
        resetPlayers,
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
        if (!gameBoard.isAvailable(row, cell) || gameController.getState() == false) return;
        e.target.style.backgroundImage = imageUrls[gameController.getMark()[1]][1]
        e.target.classList.remove('free');
        gameController.playRound(row, cell)
    }

    // If cell is available, change background to hover version
    function cellHover(e, row, cell) {
        if (!gameBoard.isAvailable(row, cell) || gameController.getState() == false) return;
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

    // Sets up newGame and roundEnd modal
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
            gameController.toggleState(true)
            toggleModal(1)
        });

        const playAgainButton = document.querySelector('.playAgainButton');
        playAgainButton.addEventListener('click', () => {
            toggleModal(2);
            resetBoardElements()
            gameController.toggleState(true);
            gameBoard.resetBoard();
        })
        const exitButton = document.querySelector('.exitButton');
        exitButton.addEventListener('click', () => {
            toggleModal(2)
            toggleModal(1)
            resetBoardElements()
            gameBoard.resetBoard();
            gameController.resetPlayers();
            gameController.toggleState(false);
        })
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

    // Toggle menu modal with (1) and endRound with (2)
    function toggleModal(target) {
        const targetModal = (target == 1) ? document.querySelector('.menu') : document.querySelector('.roundEnd')
        targetModal.classList.toggle('show')
    }

    // Changes text on endRound modal
    function changeWinningText(result) {
        const roundResultElement = document.querySelector('.roundResult')
        if (result == 'tie') {
            roundResultElement.textContent = `It's a tie!`
        } else {
            roundResultElement.textContent = `${result.getName()} won!`
        }
    }

    createGrid(gameBoard.getBoard());
    initModal()

    return {resetBoardElements, getPlayerNames, getPlayerMark, toggleModal, changeWinningText}
})()
