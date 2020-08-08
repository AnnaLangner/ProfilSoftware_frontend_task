document.getElementById('btn-single-player').addEventListener('click', getShuffle, {once : true})
document.getElementById('btn-multiplayer').addEventListener('click', getPlayers, {once : true})

const baseUrl = 'https://deckofcardsapi.com/api/deck/'
let players = [];

function getShuffle(e) {
  const urlShuffleCards = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlShuffleCards, false);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      const deckId = deck.deck_id;  
      document.getElementById('rowPlayer').style.visibility = "visible";
      document.getElementById('rowDealer').style.visibility = "visible";   
      const playerName = "Player";
      players.push(playerName)
      createButtons(deckId, playerName);      
      getFirstTwoCards(deckId, true, playerName);
      getFirstTwoCards(deckId, false);               
    }
  }

  xmlHttp.send();

  e.preventDefault();
}

function getPlayers(e) {
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body text-center';
  cardBody.setAttribute('id', 'cardBody')  

  const divPlayer = document.createElement('div');
  divPlayer.className = 'input-group mb-3';
  const inputPlayer = document.createElement('input');
  inputPlayer.className = 'form-control';
  inputPlayer.setAttribute('id', 'inputPlayer');
  inputPlayer.setAttribute('type', 'text');
  inputPlayer.setAttribute('placeholder', 'Player name');  
  divPlayer.appendChild(inputPlayer)

  const divBtnAddPlayer = document.createElement('div');
  divBtnAddPlayer.className = 'input-group-append';
  const btnAddPlayer = document.createElement('button');
  btnAddPlayer.className = 'btn btn-outline-primary';
  btnAddPlayer.innerHTML = 'Submit Player';
  btnAddPlayer.setAttribute('type', 'button');
  divBtnAddPlayer.appendChild(btnAddPlayer);
  divPlayer.appendChild(divBtnAddPlayer);
  
  cardBody.appendChild(divPlayer);

  const btnStartGame = document.createElement('button');
  btnStartGame.className = 'btn btn-primary btn-lg text-center';
  btnStartGame.setAttribute('id', 'btn-start-game');
  btnStartGame.innerHTML = 'Start game';

  cardBody.appendChild(btnStartGame);
 
  document.getElementById('divListGroup').appendChild(cardBody);
        
  btnAddPlayer.addEventListener('click', addPlayer);

  document.getElementById('rowPlayer').style.visibility = "visible";
  document.getElementById('rowDealer').style.visibility = "visible"; 
  document.getElementById('btn-start-game').style.display = 'block';
  document.getElementById('btn-single-player').style.visibility = "hidden";
  document.getElementById('btn-multiplayer').style.visibility = "hidden";
  
  document.getElementById('btn-start-game').addEventListener('click', startNewGame, {once : true})
    
  e.preventDefault();
}

function addPlayer(e) {
  let inputPlayerContent = document.getElementById('inputPlayer').value;
  if(inputPlayerContent === ''){
    alert('Add Player')
    return;
  };
  players.push(inputPlayerContent);  

  const singlePlayer = document.createElement('li');
  singlePlayer.className = 'list-group-item m-2';
  singlePlayer.appendChild(document.createTextNode(inputPlayerContent));
  
  const removeButton = document.createElement('button');
  removeButton.className = 'delete-item secondary-content';
  removeButton.innerHTML = `
  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
  </svg>
  `;
  singlePlayer.appendChild(removeButton); 

  document.getElementById('listOfPlayers').appendChild(singlePlayer);

  removeButton.addEventListener('click', removePlayer);

  document.getElementById('inputPlayer').value = "";

  e.preventDefault();
}

function removePlayer(e) {
  if(e.target.parentElement.classList.contains('delete-item')) {
    if(confirm('Are You Sure?')){
      e.target.parentElement.parentElement.remove();
    }    
  }
}

function startNewGame() {
  const urlStartNewGame = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlStartNewGame, false);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      const deckId = deck.deck_id; 
      document.getElementById('tablePlayer').style.visibility = "visible";
      document.getElementById('tableDealer').style.visibility = "visible";
      document.getElementById('cardBody').style.display = "none";
      document.getElementById('listOfPlayers').style.display = "none";
      document.getElementById('btn-start-game').style.display = "none";   
      
      for(let i = 0; i < players.length; i++) {
        getFirstTwoCards(deckId, true, players[i]);
        createButtons(deckId, players[i]);
      }
      getFirstTwoCards(deckId, false);
    }
  }

  xmlHttp.send();
}

function getFirstTwoCards(deckId, isPlayer, playerName) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let cardValueSum = 0;

      const row = document.createElement('div');
      if(isPlayer) {
        row.className = 'body-content';
        row.setAttribute('id', `player${playerName}`);
        document.getElementById('playerCards').appendChild(row);
        const rowPlayerName = document.createElement('h6')
        rowPlayerName.className = 'card-header text-center'
        rowPlayerName.innerHTML = `${playerName}`
        row.appendChild(rowPlayerName)
      } else {
        row.className = 'body-content';
        row.setAttribute('id', 'dealer');
        document.getElementById('dealerCards').appendChild(row);
      }      

      if(isPlayer && deck.cards[0].value == 'ACE' && deck.cards[1].value == 'ACE') {
        showModal(deckId, true)
      }

      for(let i = 0; i < deck.cards.length; i++) {
        const cardSrc = deck.cards[i].image;
        const cardValue = deck.cards[i].value;        

        row.innerHTML += `<img src="${cardSrc + ' '}">`;
              
        const cardValueNum = cardValueMapping(cardValue)
    
        cardValueSum += cardValueNum;  
      }           
    
      const cardsScore = document.createElement('div');
      cardsScore.className = 'card-body';    
      if(isPlayer){
        cardsScore.setAttribute('id', `cardScore${playerName}`)
        cardsScore.innerHTML = `
        <h5 class="card-title">${playerName} score: </h5>
        <p id="scorePlayer${playerName}">${cardValueSum}</p>
        `
        document.getElementById('playerOutput').appendChild(cardsScore) 
      } else {
        cardsScore.innerHTML = `
      <h5 class="card-title">Dealer score: </h5>
      <p id="scoreDealer">${cardValueSum}</p>      `
      document.getElementById('dealerScore').appendChild(cardsScore);
      }                 
    }
  }

  xmlHttp.send();
}

function drawCard(deckId, isPlayer, playerName) {
  const urlTakenCard = `${baseUrl}${deckId}/draw/?count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlTakenCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200) {
      const deck = JSON.parse(this.responseText);
      const cardSrc = deck.cards[0].image;
      const cardValue = deck.cards[0].value;

      if(isPlayer) {
        document.getElementById(`player${playerName}`).innerHTML += `<img src="${cardSrc + ' '}">`;
      } else {
        document.getElementById('dealer').innerHTML += `<img src="${cardSrc + ' '}">`;
      }     

      const cardValueNum = cardValueMapping(cardValue)

        if(isPlayer) {
          let cardValueSum = document.getElementById(`scorePlayer${playerName}`).innerHTML;     
          let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
          document.getElementById(`scorePlayer${playerName}`).innerHTML = `${cardNewValueSum}`;
          if(cardNewValueSum == 21) {
            standGame(deckId, playerName);
          } else if (cardNewValueSum >= 22) {
            standGame(deckId, playerName);
            showAlert(`${playerName} lost the game!`);
          }       
        } else {
          let cardValueSum = document.getElementById('scoreDealer').innerHTML;     
          let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
          document.getElementById('scoreDealer').innerHTML = `${cardNewValueSum}`;
          if(cardNewValueSum < 17) {
            drawCard(deckId, false);
          } 
        }  
      } 
    }

  xmlHttp.send();
}

function showAlert(err) {
  const form = document.getElementById('rowPlayer')
  const container = document.querySelector('.card');
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger';
  alert.appendChild(document.createTextNode(err));

  container.insertBefore(alert, form);

  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 5000);
}

function createButtons(deckId, playerName) {
  const btnPlayerTakeCard = document.createElement('button');
  btnPlayerTakeCard.className = 'btn btn-primary';
  btnPlayerTakeCard.innerHTML = 'Hit the card';
  btnPlayerTakeCard.onclick = function() {drawCard(deckId, true, playerName)};
  btnPlayerTakeCard.setAttribute('id', `btnCardHit${playerName}`)
  btnPlayerTakeCard.setAttribute("data-toggle","modal")
  btnPlayerTakeCard.setAttribute("data-target", "#refreshModal")      
  btnPlayerTakeCard.setAttribute('type','button');      

  const btnPlayerStandGame = document.createElement('button');
  btnPlayerStandGame.className = 'btn btn-secondary'; 
  btnPlayerStandGame.innerHTML = 'stand the game'; 
  btnPlayerStandGame.onclick = function() {standGame(deckId, playerName)};    
  btnPlayerStandGame.setAttribute('type','button');
  btnPlayerStandGame.setAttribute('id', `btnStandGame${playerName}`)
  const cardsScore = document.createElement('div');
  cardsScore.className = 'card-body';  
  cardsScore.appendChild(btnPlayerTakeCard);
  cardsScore.appendChild(btnPlayerStandGame);
  document.getElementById('playerOutput').appendChild(cardsScore) 
            
}

function standGame(deckId, playerName) {
  document.getElementById(`btnCardHit${playerName}`).style.visibility = 'hidden';
  let btnStandGame = document.getElementById(`btnStandGame${playerName}`)  
  btnStandGame.style.visibility = 'hidden';  
  btnStandGame.setAttribute('state', 'stand');
  for(let i = 0; i < players.length; i++){
    let id = `btnStandGame${players[i]}`
    if(document.getElementById(id).getAttribute('state') != 'stand') {
      return;
    } 
  } 
  drawCard(deckId, false);
  showModal(deckId, false);
}

function cardValueMapping(cardValue) {  
  if(cardValue === 'JACK'){
    return 2;
  } else if (cardValue === 'QUEEN') {
    return 3;
  } else if (cardValue === 'KING') {
    return 4;
  } else if (cardValue === 'ACE') {
    return 11; 
  } else {
    return parseInt(cardValue)
  }
}

function showModal(deckId, isDoubleAce) {
  let cardPlayerValueSum = '';  
  let playerMax = '';
  let scorePlayerMax = 0;
  for(let i = 0; i < players.length; i++) {
    let scorePlayer = document.getElementById(`scorePlayer${players[i]}`).innerText;
    cardPlayerValueSum += `<h5>${players[i]}:</h5><p>Score: ${scorePlayer}</p>`;
    if(scorePlayer < 22 && scorePlayer > scorePlayerMax) {
      scorePlayerMax = scorePlayer;
      playerMax = players[i]
    }
  }
  cardPlayerValueSum = `<h5>${playerMax}:</h5><p>Score: ${scorePlayerMax}</p>`;
  const cardDealerValueSum = document.getElementById('dealerScore').innerHTML;

  const modalRefresh = document.createElement('div');
  modalRefresh.className = 'modal fade show';
  modalRefresh.setAttribute("id", "refreshModal"); 

  modalRefresh.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Game summary</h5>
      </div>
      <div class="modal-body">
        <p>${cardPlayerValueSum}</p>
        <p>${cardDealerValueSum}</p>
        <p>${printScore(deckId, isDoubleAce, playerMax, scorePlayerMax)}</p>
      </div>
      <div class="modal-footer text-center">
        <button type="button" class="btn btn-primary" onClick="window.location.reload();">Refresh</button>
      </div>
    </div>
  </div>
  `
  document.querySelector('.container').appendChild(modalRefresh);
}

function printScore(deckId, isDoubleAce, playerName, scorePlayer) {
  let player = scorePlayer;
  let dealer = document.getElementById('scoreDealer').innerText;

  if (isDoubleAce) {
    return `${playerName} win!`;
  }  else if (player >= 22){
    return "lost game";
  } else if (player == 21) {
    return `${playerName} win!`;
  } else if(player < dealer && dealer > 22 ) {
    return `${playerName} win!`;    
  } else if(player < dealer && dealer < 22 ) {
    return "lost game";    
  } else if(player > dealer && player < 22 ) {
    return `${playerName} win!`;
  } else if(player == dealer) {
    return "Push";
  }  
}
