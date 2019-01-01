var TWENTYONE = 21;
var suits = ["C", "D", "H", "S"];

var drawnCards = [];
var playerCount = 4;
var gameOver = false;
var playersContinue = 4;

var p1 = [];
var p1info = {"player" : 1};

var p2 = [];
var p2info = {"player" : 2};

var p3 = [];
var p3info = {"player" : 3};

var me = [];
var myInfo = {"player" : 0};

var players = {me, p1, p2, p3};
var playerInfos = {myInfo, p1info, p2info, p3info};

var audio = new Audio('resources/music.mp3');
audio.loop = true;
audio.play();

function init() {
	me = [];
	p1 = [];
	p2 = [];
	p3 = [];
	drawnCards = [];
	gameOver = false;
	playersContinue = 4;
	myInfo = {"player" : 0, "busted" : false, "won" : false, "frozen" : false};
	p1info = {"player" : 1, "busted" : false, "won" : false, "frozen" : false};
	p2info = {"player" : 2, "busted" : false, "won" : false, "frozen" : false};
	p3info = {"player" : 3, "busted" : false, "won" : false, "frozen" : false};
	for(var i = 0; i < 2; i++){
		me.push(getCard());
		evaluate(me, myInfo);
		p1.push(getCard());
		evaluate(p1, p1info);
		p2.push(getCard());
		evaluate(p2, p2info);
		p3.push(getCard());	
		evaluate(p3, p3info);	
	}
	game();
	showCards();
	displayMessage("");
	
}


function showCards() {
	var myCards = document.getElementById("myCards");	
	while(myCards.childElementCount != 0){
		myCards.removeChild(myCards.children[0]);
	}
	for(var i = 0; i < me.length; i++){
		var newCard = document.createElement("div");
		newCard.setAttribute('class', 'card');
		var image = "images/cards/" + me[i] + ".png";
		newCard.setAttribute('style', 'background-image: url('+image+')');
		myCards.appendChild(newCard);
	}
}

function hitMe() {
	
	if(myInfo["won"] == true || myInfo["busted"] == true || myInfo["frozen"] == true){		
		while(gameOver != true){
			nextRound();
			game();
		}
	}
	else if(myInfo["frozen"] != true && !gameOver && myInfo["busted"] != true ){
		me.push(getCard());
		showCards();
		evaluate(me, myInfo);
		if(myInfo["busted"] == true)
			freeze();

	}
	nextRound();
	game();
}

function freeze() {
	//if(myInfo["won"] == false && myInfo["frozen"] == false){
		myInfo["frozen"] = true;
		//playersContinue--;
		while(gameOver != true){
			nextRound();
			game();
		}
		
	//}
}

//Returns true if busted, false otherwise
function evaluate(cards, info) {
	var sum = sumCards(cards);
	var busted = false;
	if(sum == 21){
		info["won"] = true;	
		//playersContinue--;	
	}
	else if(sum > 21){
		info["busted"] = true;		
		busted = true;
		//playersContinue--;
	}
	if(info["player"] != 0){
		var playerDiv = document.getElementById("p"+info["player"]);
		var status =  "Number of cards: " + cards.length;
		if(busted)
			status += "\n BUSTED!";
		if(info["frozen"] == true)
			status += "\n FROZE!";
		playerDiv.innerText = status;
	}
	return busted;
}


/*for(var i in players){
console.log(players[i]);
}*/
//Operations for other players
function nextRound(){
	//Player 1
	if(p1info["busted"] != true && p1info["won"] != true && p1info["frozen"] != true){
		var sum = sumCards(p1);
		if(requestCard(sum) == "true"){
			p1.push(getCard());
		}
		else{
			p1info["frozen"] = true;
			//playersContinue--;
		}
		evaluate(p1, p1info);
	}

	//Player2
	if(p2info["busted"] != true && p2info["won"] != true && p2info["frozen"] != true){
		var sum = sumCards(p2);
		if(requestCard(sum) == "true"){
			p2.push(getCard());
		}
		else{
			p2info["frozen"] = true;
			//playersContinue--;
		}
		evaluate(p2, p2info);
	}
	//Player 3
	if(p3info["busted"] != true && p3info["won"] != true && p3info["frozen"] != true){
		var sum = sumCards(p3);
		if(requestCard(sum) == "true"){
			p3.push(getCard());
		}
		else{
			p3info["frozen"] = true;
			//playersContinue--;
		}
		evaluate(p3, p3info);
	}
	/*players = [p1, p2, p3];
	playerInfos = {myInfo, p1info, p2info, p3info};
	for(var playerInfo in playerInfos){
		var info = playerInfos[playerInfo];
		if(info.busted != true && info.won != true && info.frozen != true){
			var sum = sumCards(players[info.player]);
			if(requestCard(sum) == "true"){
				players[info.player].push(getCard());
			}
			else{
				info["frozen"] = true;
			}
			evaluate(players[info.player], info);
		}
	}*/
}

function getCard() {
	var card = "No cards left!";
	if(drawnCards.length < 52) {
		do{
			var rank = rand(1, 14);
			switch(rank){
				case 1: rank = "A"; break;
				case 11: rank = "J"; break;
				case 12: rank = "Q"; break;
				case 13: rank = "K"; break;
			}

			var suitIndex = rand(0, 4);
			var suit = suits[suitIndex];
			card = rank + "" + suit;
			
		
		}while(drawnCards.includes(card) && drawnCards.length != 52); //check if card was already drawn
		drawnCards.push(card);
	}
	return card;
}

function rand(min , max) 
{
    return Math.floor(Math.random() * (max-min) + min);
} 

function sumCards(cards){
	var sum = 0;
	var aceCount = 0;
	var value;
	for (var i = 0; i < cards.length; i++) {
		if(isNaN(parseInt(cards[i]))){
			value = cards[i].charAt(0);
			switch(value){
				case "A": aceCount++; value = 1; break;
				case "J": case "Q": case "K": value = 10; break;

			}
		}
		else{
			value = parseInt(cards[i]);
		}

		sum += parseInt(value);
	}
	while(aceCount > 0){
		if(sum < TWENTYONE){
			if(((sum-1) + 11) < TWENTYONE){
				sum = (sum - 1) + 11;
			}
			else if(((sum-1) + 11) == TWENTYONE){
				sum = TWENTYONE;
			}
		}
		aceCount--;
	}
	return sum;
}

function displayMessage(message){
	document.getElementById("message").innerText = message;
}

//Decision-making algorithm for bots
function requestCard(sum) {
	var drawCard = false;
	var pNotRequesting = 0;
	var pRequesting = 1;
	var table = [];

	if(sum > 11){		
		pNotRequesting = ((13 - (21 - sum))/13);
		pRequesting = 1 - pNotRequesting;
	}

	var weights = {false: pNotRequesting, true: pRequesting};
	for(var i in weights){
		for(var j = 0; j < weights[i] * 100; j++){
			table.push(i);
		}
	}
	drawCard = table[rand(0, table.length)];
	return drawCard;
}


function game(){
	var over = false;
	playersContinue = playerCount;
	var playerInfos = {myInfo, p1info, p2info, p3info};
	for(var info in playerInfos){		
		if(playerInfos[info].busted == true || playerInfos[info].frozen == true || playerInfos[info].won == true){
			playersContinue--;
		}
	}

	players = {p1, p2, p3};
	for(var player in players){
		var playerDivOuter = document.getElementById(""+player+"outer");
		var pCards = players[player];
		while (playerDivOuter.firstChild) {
		    playerDivOuter.removeChild(playerDivOuter.firstChild);
		}
		for(var card in pCards){			
			var img = document.createElement("img");
			img.setAttribute("src", "images/card_back.png");
			img.setAttribute("style", "width: 50px; margin: 3px;");
			playerDivOuter.appendChild(img);
		}
	}

	
	over = (playersContinue > 0)? false : true;
	if(over == true){
		//find winner(s) and print
		var max = 0;
		var winners = [];
		var value = 0;
		gameOver = true;
		players = {me, p1, p2, p3};
		for(var player in players){
			value = sumCards(players[player]);
			if(value == max)
				winners.push(player);
			if(value <= 21 && value > max){
				winners = [];
				winners.push(player);
				
				max = value;
			}
			console.log(player + " : " + value);
		}
		var playerNames = "";
		for(var name in winners){
			switch(winners[name]){
				case "me": winners[name] = "you"; break;
				case "p1": winners[name] = "player 1"; break;
				case "p2": winners[name] = "player 2"; break;
				case "p3": winners[name] = "player 3"; break;
			}			
			playerNames += winners[name] + "\n";
		}
		displayMessage("Game over! \n Winners: \n"+ playerNames);
		flipCards();
	}
	return over;

}

function flipCards() {
	players = {p1, p2, p3};
	for(var player in players){
		//console.log(player);
		var playerDivOuter = document.getElementById(""+player+"outer");
		while (playerDivOuter.firstChild) {
		    playerDivOuter.removeChild(playerDivOuter.firstChild);
		}
		var pCards = players[player];
		for(var card in pCards){
			var img = document.createElement("img");
			img.setAttribute("src", "images/cards/"+ pCards[card] +".png");
			img.setAttribute("style", "width: 50px; margin: 3px;");

			playerDivOuter.appendChild(img);
		}		
	}
}

//http://acbl.mybigcommerce.com/52-playing-cards/
//https://medium.com/mindorks/creating-a-random-number-generator-in-javascript-5dfc6f7a3bee
//https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number