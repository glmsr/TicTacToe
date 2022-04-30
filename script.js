d = document;

var GameBoard = (function () {
    'use strict';
    let gameBoardArray = [...Array(9).keys()];
    let markOne = 'X'
    let markTwo = 'O';
    let winBoolean = false;
    let clickBoolean = false;
    let tiles = d.getElementsByClassName('tiles');
    let tilesArray = Array.from(tiles);
    tilesArray.forEach(e => gameBoardArray.push(e));
    let count = 0;
    let markBoolean = false;
    let firstMarkBoolean = false;
    let turnBoolean = true;
    let checkWinCount = 0;
    var winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    function minimax(newBoard, player) {
        var availSpots = emptyIndexies(newBoard);
        if (checkWin2(newBoard, Players.Player1.mark)){
            return { score: -10 };
        }
        else if(checkWin2(newBoard, Players.Player2.mark)){
            return { score: 20 };
        }
        else if (availSpots.length === 0) {
            return { score: 0 };
        }
        
        var moves = [];
        for (let i = 0; i < availSpots.length; i++){
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;
            
            if (player === Players.Player2.mark) {
                var result = minimax(newBoard, Players.Player1.mark);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, Players.Player2.mark);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        var bestMove;
        if (player === Players.Player1.mark) {
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        
        
        return moves[bestMove]
    }
    function emptyIndexies(board) {

        return board.filter(s => s !== "O" && s !== "X")
    }
    function bestSpot() {
        checkWin();
        return minimax(gameBoardArray, Players.Player2.mark).index;
    }
    

    function turn(tileId, player) {
        gameBoardArray[tileId] = player;
        markingTileAi(tileId, player);
       

    }
    
    function playAgainFunc() {
        let playAgain = d.createElement('div');
        
        playAgain.classList.add('playAgain');
        playAgain.innerHTML = '<a class="playAgainButton">Play Again</a>';

        d.body.appendChild(playAgain);
        // d.getElementById('winScreen').appendChild(playAgain);

        playAgain.onclick = function () {
            gameBoardArray = [...Array(9).keys()];
            d.body.removeChild(gameBoard);
            d.body.removeChild(playAgain);
            d.body.removeChild(scoreBoard);
            turnBoolean = true;
            checkWinCount = 0;
            winBoolean = false;
            Players.Player1.winBoolean,
            Players.Player2.winBoolean = false;

            startButton.onclick();
        }
    }

    function winScreen() {
        let winScreen = document.createElement('div');
        winScreen.classList.add('winScreen');
        winScreen.id = 'winScreen';
        gameBoard.appendChild(winScreen);
        gameBoard.classList.add('gameBoard-win');
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].classList.add('tiles-win');
        }
    }
    
    function markingTileAi(id, player) {
        var tile = d.getElementById(`tile${id}`);
        let p = player;
        tile.textContent = p;
        gameBoardArray.splice(tile.dataset.tile, 1, p);
        tile.style.pointerEvents = 'none';
    }

    function checkWin2(board, player) {
        for (let i = 0; i < winningCombinations.length; i++) {
            
            let a = winningCombinations[i][0];
            let b = winningCombinations[i][1];
            let c = winningCombinations[i][2];

            if (board[a] === board[b] && board[b] === board[c] && board[b].innerHTML !== '') { 
                if (board[a] === player) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
    
 
    const checkWin = () => {
        let gameWon = null;
        checkWinCount++;
        for (let i = 0; i < winningCombinations.length; i++) {
            
            let a = winningCombinations[i][0];
            let b = winningCombinations[i][1];
            let c = winningCombinations[i][2];

            if (gameBoardArray[a] === gameBoardArray[b] && gameBoardArray[b] === gameBoardArray[c] && gameBoardArray[a] !== undefined && gameBoardArray[a].innerHTML !== '' ) {
                winBoolean = true;
                    for (var j = 0; j < tiles.length; j++) {
                        var currentElement = tiles[j];
                        currentElement.style.pointerEvents = 'none';
                    }
                    function winnerCheck() {
                        if (gameBoardArray[a] === Players.Player1.mark) {
                            return Players.Player1.name;
                        }
                        else if (gameBoardArray[a] === Players.Player2.mark) {
                            return Players.Player2.name;
                        }
                    }
                    scoreBoard.innerHTML = (`${winnerCheck()} is the winner!`);
                    
                var winnerTilesArray = [tiles[a], tiles[b], tiles[c]];
                
                var winnerTiles = [gameBoardArray[a], gameBoardArray[b], gameBoardArray[c]]
                
                    for (let i = 0; i < winnerTilesArray.length; i++) {
                        setTimeout(function () {
                            winnerTilesArray[i].classList.add('winnerTilesBg');
                        }, i * 150);
                    }
                    setTimeout(function () {
                        playAgainFunc();
                        winScreen();
                    }, 1000);
                return true
            } else {
                scoreBoard.innerHTML = `${Players.turnFunction()}'s turn`;
                }
        }   
            checkDraw();
        return false;
    }

    function checkDraw() {
        if (emptyTiles().length === 0 && winBoolean === false) {
            scoreBoard.innerHTML = 'Draw!';
            setTimeout(function () {
                playAgainFunc();
                winScreen();
            }, 1000)
            return true;
        }
        return false;
    }
    

    function emptyTiles() {
        return gameBoardArray.filter(elem => typeof elem == 'number');

    }

    function randomEmptyTile() {
        if (!winBoolean) {
            let emptyTileArray = [];
            for (let i = 0; i < gameBoardArray.length; i++) {
                if (typeof gameBoardArray[i] == 'number') {
                    emptyTileArray.push(i);
                }
            }
            let randomEmptyTile = emptyTileArray[Math.floor(Math.random() * emptyTileArray.length)]
            let p = Players.Player2.mark;

            


            let aiChoice = d.querySelector(`[data-tile="${randomEmptyTile}"]`);
            if (randomEmptyTile !== undefined) {
                aiChoice.textContent = p;
                aiChoice.style.pointerEvents = 'none';
                gameBoardArray.splice(randomEmptyTile, 1, p);
            }
        }
    }
    const startMenu = d.getElementById('startMenu');
    //could have cloneNode these but, idk
    let createPvpBtn =  (function () {
        const pvpBtn = d.createElement('input');
        pvpBtn.type = 'radio';
        pvpBtn.id = 'pvpBtn';
        pvpBtn.setAttribute('name', 'radioBtn');
        startMenu.appendChild(pvpBtn);
        
        let label = d.createElement('label');
        label.htmlFor = 'pvpBtn';
        startMenu.appendChild(label);
        
        // buradan asagisini ayni sekilde calistirmak istiyorum sag tarafta da.
        let pvpBtnMenu = d.createElement('div');
        pvpBtnMenu.id = 'pvpBtnMenu';
        label.appendChild(pvpBtnMenu);
        
        let pvpBtnTitle = d.createElement('p');
        pvpBtnTitle.id = 'pvpBtnTitle';
        pvpBtnTitle.innerHTML = 'Player vs. Player';
        label.appendChild(pvpBtnTitle);


        let pvpBtnBg = d.createElement('div');
        pvpBtnBg.id = 'pvpBtnBg';
        label.appendChild(pvpBtnBg);

        let pvpBtnBgText = d.createElement('p');
        pvpBtnBgText.id = 'pvpBtnBgText';
        pvpBtnBgText.innerHTML = 'Player vs. Player';
        pvpBtnBg.appendChild(pvpBtnBgText);
        
        let nameTitle = d.createElement('p')
        nameTitle.id = 'nameTitle';
        nameTitle.innerHTML = 'Name(optional)';
        pvpBtnMenu.appendChild(nameTitle);
        
        
        let pvpName1 = d.createElement('input');
        pvpName1.type = 'name';
        pvpName1.id = 'pvpName1';
        pvpName1.maxLength = '16';
        pvpName1.setAttribute('placeholder', 'Player 1');
        pvpBtnMenu.appendChild(pvpName1);
        
        let pvpName2 = d.createElement('input');
        pvpName2.type = 'name';
        pvpName2.id = 'pvpName2';
        pvpName2.maxLength = '16';
        pvpName2.setAttribute('placeholder', 'Player 2');
        pvpBtnMenu.appendChild(pvpName2);
        
        let markTitle = d.createElement('p');
        markTitle.id = 'markTitle';
        markTitle.innerHTML = 'Choose your mark';
        pvpBtnMenu.appendChild(markTitle);
        
        let pvpMark1 = d.createElement('p');
        pvpMark1.id = 'pvpMark1';
        pvpMark1.innerHTML = 'X';
        pvpBtnMenu.appendChild(pvpMark1);

        let pvpMark2 = d.createElement('p');
        pvpMark2.id = 'pvpMark2';
        pvpMark2.innerHTML = 'O';
        pvpBtnMenu.appendChild(pvpMark2);

        let markChanger = d.createElement('button');
        markChanger.id = 'markChanger';
        pvpBtnMenu.appendChild(markChanger);
        markChanger.onclick = function () {
            if (pvpMark1.innerHTML === 'X') {
                pvpMark1.innerHTML = 'O';
                pvpMark2.innerHTML = 'X';
            }
            else {
                pvpMark1.innerHTML = 'X';
                pvpMark2.innerHTML = 'O';
            }
            
        }
            

        let markChangerImg = d.createElement('img');
        markChangerImg.id = 'markChangerImg';
        markChangerImg.src = 'resources/outline_swap_horizontal_circle_white_24dp.png';
        markChanger.appendChild(markChangerImg);
        
        pvpBtn.onclick = function () {
            if (pvpBtn.checked) {
                pvpBtnMenu.style.display = 'flex';
                pvpBtnBg.style.display = 'flex';
                pvpBtnBgText.style.display = 'flex';
                pvpBtnTitle.style.display = 'none';

                pvAiBtnTitle.style.display = 'flex';
                pvAiBtnBg.style.display = 'none';
                pvAiBtnMenu.style.display = 'none';

                pvpBtnMenu.appendChild(startButton);
            }
        }
        
    })();
    
    let createPvAiBtn = (function () {
        const pvAiBtn = d.createElement('input')
        pvAiBtn.type = 'radio';
        pvAiBtn.id = 'pvAiBtn';
        pvAiBtn.setAttribute('name', 'radioBtn');
        startMenu.appendChild(pvAiBtn);
        
        let label = d.createElement('label');
        label.htmlFor = 'pvAiBtn';
        startMenu.appendChild(label)
        
        let pvAiBtnTitle = d.createElement('p');
        pvAiBtnTitle.id = 'pvAiBtnTitle';
        pvAiBtnTitle.innerHTML = `Player vs. AI`;
        label.appendChild(pvAiBtnTitle);

        let pvAiBtnBg = d.createElement('div');
        pvAiBtnBg.id = 'pvAiBtnBg';
        label.appendChild(pvAiBtnBg);

        let pvAiBtnBgText = d.createElement('p');
        pvAiBtnBgText.id = 'pvAiBtnBgText';
        pvAiBtnBgText.innerHTML = `Player vs. Ai`;
        pvAiBtnBg.appendChild(pvAiBtnBgText);

        let pvAiBtnMenu = d.createElement('div');
        pvAiBtnMenu.id = 'pvAiBtnMenu';
        label.appendChild(pvAiBtnMenu);

        let nameTitle = d.createElement('p');
        nameTitle.id = 'nameTitle';
        nameTitle.innerHTML = 'Name(optional)';
        pvAiBtnMenu.appendChild(nameTitle);

        let pvAiName1 = d.createElement('input');
        pvAiName1.type = 'name';
        pvAiName1.id = 'pvAiName1';
        pvAiName1.maxLength = '16';
        pvAiName1.setAttribute('placeholder', 'Player 1');
        pvAiBtnMenu.appendChild(pvAiName1);

        let pvAiName2 = d.createElement('input');
        pvAiName2.type = 'name';
        pvAiName2.id = 'pvAiName2';
        pvAiName2.maxLength = '16';
        pvAiName2.setAttribute('placeholder', 'Computer');
        pvAiName2.style.cursor = 'not-allowed';
        pvAiName2.disabled = true;
        pvAiBtnMenu.appendChild(pvAiName2);

        let markTitle = d.createElement('p');
        markTitle.id = 'markTitle';
        markTitle.innerHTML = 'Choose your mark';
        pvAiBtnMenu.appendChild(markTitle);
        
        let pvAiMark1 = d.createElement('p');
        pvAiMark1.id = 'pvAiMark1';
        pvAiMark1.innerHTML = 'X';
        pvAiBtnMenu.appendChild(pvAiMark1);

        let pvAiMark2 = d.createElement('p');
        pvAiMark2.id = 'pvAiMark2';
        pvAiMark2.innerHTML = 'O';
        pvAiBtnMenu.appendChild(pvAiMark2);


        let markChanger = d.createElement('button');
        markChanger.id = 'markChanger';
        pvAiBtnMenu.appendChild(markChanger);

        markChanger.onclick = function () {
            if (pvAiMark1.innerHTML === 'X') {
                pvAiMark1.innerHTML = 'O';
                pvAiMark2.innerHTML = 'X';
            }
            else {
                pvAiMark1.innerHTML = 'X';
                pvAiMark2.innerHTML = 'O';
            }
        }

        let markChangerImg = d.createElement('img');
        markChangerImg.id = 'markChangerImg';
        markChangerImg.src = 'resources/outline_swap_horizontal_circle_white_24dp.png';
        markChanger.appendChild(markChangerImg);
        
    

        pvAiBtn.onclick = function () {
            if (pvAiBtn.checked) {
                pvpBtnBg.style.display = 'none';
                pvpBtnMenu.style.display = 'none';
                pvpBtnBgText.style.display = 'none';
                pvpBtnTitle.style.display = 'flex';

                pvAiBtnTitle.style.display = 'none';
                pvAiBtnBg.style.display = 'flex';
                pvAiBtnBgText.style.display = 'flex';
                pvAiBtnMenu.style.display = 'flex';

                pvAiBtnMenu.appendChild(startButton);
            }
        }
    })();
    
    
    
    
    const startButton = d.createElement('button');
    startButton.id = 'startButton';
    startButton.innerHTML = 'Start';
    

    startButton.onclick =
    
    function () {
        
        let isAgainstAi = false;
        if (this.parentNode.id === 'pvAiBtnMenu') {
            isAgainstAi = true;
            Players.Player1.name = pvAiName1.value === '' ? 'Player 1' : pvAiName1.value;
            Players.Player2.name = 'Computer';

            Players.Player1.mark = pvAiMark1.innerHTML;
            Players.Player2.mark = pvAiMark2.innerHTML;

            
        } else { 
        Players.Player1.name = 
            pvpName1.value === '' ? 'Player 1' : pvpName1.value;
        Players.Player2.name =
            pvpName2.value === '' ? 'Player 2' : pvpName2.value;

        Players.Player1.mark = pvpMark1.innerHTML;
        Players.Player2.mark = pvpMark2.innerHTML;
        }
        
        var docTitle = d.getElementById('titleId');
        docTitle.style.display = 'flex';
        docTitle.onclick = function () {
            location.reload();
        }
        
        const gameBoard = d.createElement('div');
        gameBoard.id = 'gameBoard';
        d.body.appendChild(gameBoard);
            
        const scoreBoard = d.createElement('div');
        scoreBoard.id = 'scoreBoard';
        scoreBoard.innerHTML = `${Players.turnFunction()}'s turn`;
        d.body.appendChild(scoreBoard);
        

            
        for (let i = 0; i < 9; i++) {
                        const createdTiles = d.createElement('div');
                        createdTiles.classList.add('tiles');
                        createdTiles.id = (`tile${i}`);
                        createdTiles.dataset.tile = i;
                        gameBoard.appendChild(createdTiles);
                        //**in progress**add a hover effect for tiles for incoming mark**in progress**
                        // createdTiles.addEventListener('mouseover', function () {
                        //     if (turnBoolean) {
                        //         console.log('X')
                        //         this.innerHTML = 'X'
                        //         //this.classList.add('xHover')
                        //     }
                        //     else {
                        //         console.log('O');
                        //         //this.classList.add('oHover')
                        //     }
                        // })
                        //         createdTiles.addEventListener('mouseleave', function () {
                        //             console.log("mouse left")
                        //             this.innerHTML = '';
                        //             })
                                
            createdTiles.onclick = function () {
                
                    if (!checkDraw()) {
                    
                            
                            if (isAgainstAi && !checkWin2(gameBoardArray, Players.Player1.mark)) {
                            markingTileAi(this.dataset.tile, Players.Player1.mark);
                            
                                turn(bestSpot(), Players.Player2.mark)
                        }
                        else {
                                markingTileAi(this.dataset.tile, Players.playerFunction())
                                
                       
                    }
                    checkWin();
                    }
                }
            }
            startMenu.style.display = 'none';
        if (isAgainstAi && Players.Player2.mark === 'X') {
            randomEmptyTile();
            Players.playerFunction();
        }
            checkWin();
    }
    const playerFactory = (name, mark) => {
        
        count++;
        function nameFunc() {
            name === null || name === '' || name === undefined ?
            name = `Player ${count}`
            :
            name = name;
        }
        if (mark === 'X') {
            markBoolean = false;
        } else if (mark === 'O') {
        markBoolean = true;
    } 
    if(markBoolean === false && count > 1){
        mark = 'O'
    } else if (markBoolean === true && count > 1){
        mark = 'X'
    }
        
        const winCount = 0;
        var bestScore;
        
        const playersTurn = false;
        
        return { name, mark, winCount, playersTurn, nameFunc, winBoolean, bestScore }
    }
    
    
    
    
    const Players = {
        Player1 : playerFactory(pvpName1.value, ''),
        Player2 : playerFactory(pvpName2.value, ''),
        playerFunction() {
            //check if turnBoolean is true
            //if true, return X
            //if false, return O
            if (turnBoolean === true && this.Player1.mark === 'X' || turnBoolean === true && this.Player2.mark === 'X') {
                turnBoolean = false;
                return 'X'
            } else if (turnBoolean === false && this.Player1.mark === 'O' || turnBoolean === false && this.Player2.mark === 'O') {
                turnBoolean = true;
                return 'O'
            }
        },
        turnFunction() {
            if (turnBoolean === true && this.Player1.mark === 'X') {
                return this.Player1.name;
            } else if (turnBoolean === false && this.Player1.mark === 'O') {
                return this.Player1.name;
            } else if (turnBoolean === true && this.Player2.mark === 'X') {
                return this.Player2.name;
            } else if (turnBoolean === false && this.Player2.mark === 'O') {
                return this.Player2.name;
            }
        }
    }
    
    
    
    
})();

