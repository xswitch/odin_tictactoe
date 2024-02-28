# odin_tictactoe

> Maybe look into updating cells instead of creating new ones on every turn.
>> Creating new ones ruins styling as they start in default state.
>> Upon cells first creation add them into a copy of the gameBoard array so they can be referenced with (x, y)

> Choose mark - associate mark with player1 or 2
>> Create players, store them in an object in gameController, reference this object when doing anything that has to do with the player.

> Events for winning, losing, and ties
>> Update score - Give option to play again and change mark
>> Remove ability to place marks until a new game is started.

> More styling
>> Scoreboard - start/restart buttons - choose mark - who's turn it is - Better board
>>> Scoreboard - Always show while showing the game
>>> Start/restart buttons - Display as a modal before first game and after a game
>>> Choose mark - In same modal as start/restart buttons
>>> Who's turn it is - Show player name/number and mark in game window
>>> Cleaner X and O. Separate cells with better styling for visualizing hover and click. 

> Remove auto restart, show resulting board until restart is pressed.
>> Stop reset on roundEnd
>> Bind reset to a button instead
>> Also give option to exit, to choose a new mark and reset score.