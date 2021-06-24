var score = 0;
var timeToAnswer = 20;
var timeLeft = timeToAnswer;
var currQuestion = null;
var timerId = null;

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function startTheGame(scoreElementValue,timerElementValue) {
    score = 0;
    timeLeft = timeToAnswer;
    
    // prekopiraj niz
    gameQuestions = questions.map(a => Object.assign({}, a));
    
    shuffle(gameQuestions);
    
    var len = gameQuestions.length;
    timerId = setInterval(countdown, 1000);
    
    var questionText = document.createElement("p");
    currQuestion = gameQuestions.pop();
    questionText.innerHTML = currQuestion.Pitanje;
    content.appendChild(questionText);
    
    var answerElement = document.createElement("input");
    answerElement.type = "text";
    answerElement.id = "answer";
    answerElement.oninput = function () {
        checkInput(answerElement,scoreElementValue);
    };
    content.appendChild(answerElement);
    
    
    function countdown() {
      if (timeLeft <= 0) {
        if( --len === 0) {
            clearTimeout(timerId);
            endOfTheGame();
            return;
        }
        else
            timeLeft = timeToAnswer;
        
        currQuestion = gameQuestions.pop();
        
        if(currQuestion == null ) {
            alert("OVDEEE 64");
            clearTimeout(timerId);
            endOfTheGame();
            return;
        }
        
        questionText.innerHTML = currQuestion.Pitanje;
        answerElement.value = "";
        answerElement.style.backgroundColor = "white";
      }
      else {
        timerElementValue.innerHTML = timeLeft + 's';
        timeLeft--;
      }
    }
}

function checkInput(answerElement,scoreElementValue) {
    
    var str1 = answerElement.value.toLowerCase();
    var str2 = currQuestion.Odgovor.toLowerCase();
    
    str1 = convertToLat(str1);
    str2 = convertToLat(str2);
    
    if( str1 === str2 ) {
        scoreElementValue.innerHTML = ++score;
        answerElement.style.backgroundColor = "lightgreen";
        timeLeft = -1;
    }
    else {
        answerElement.style.backgroundColor = "lightpink";
    }
        
 }
 
 function convertToLat(str) {
    str = str.replace(/ž/,"z");
    str = str.replace(/š/,"s");
    str = str.replace(/đ/,"dj");
    str = str.replace(/ć/,"c");
    return str.replace(/č/,"c");
 }
 
 function endOfTheGame() {
    content.innerHTML = "";
    
    var infoDiv = document.createElement("div");
     
    var txt = document.createElement("h1");
    txt.innerHTML = "Vaš skor je";
    txt.className = "itemText";
    infoDiv.appendChild(txt);
    
    var finalScore = document.createElement("h2");
    finalScore.innerHTML = score;
    finalScore.className = "itemValue";
    infoDiv.appendChild(finalScore);
    
    content.appendChild(infoDiv);
    
    var newGame = document.createElement("button");
    newGame.innerHTML = "Nova igra";
    newGame.className = "endButton";
    newGame.onclick = goToQuiz;
    content.appendChild(newGame);
    
    var menuButton = document.createElement("button");
    menuButton.innerHTML = "Glavni meni";
    menuButton.className = "endButton";
    menuButton.onclick = function() {
        header.style.height = "100%";
        headerEl.hidden = null;
        goToMenu();
    };
    content.appendChild(menuButton);
    
    var cookie = document.cookie;
    var i = 0;
    
    if( cookie !== "") {
        while(readCookie(i) != null && i < 10) {
            i++;
        }
    
        if( i === 10 ) {
            i = 0;
        }
    }
    
    var date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    createCookie(i, score, date);
 }
