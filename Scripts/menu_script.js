var content = null;
var file = null;
var supportedFormats = ["json", "csv"];//["json", "xml", "csv"];
var questions = null;
var gameQuestions = null;
var header = null;
var headerEl = null;

function goToMenu() {
    if( content == null) {
        content = document.getElementById("content");
    }
    
    content.innerHTML = "";
        
    var ulist = document.createElement("ul");
    var liElm = document.createElement("li");
    
    ulist.className = "disable-select";
    
    liElm.tabindex = 1;
    liElm.innerHTML = "Započni novi kviz";
    liElm.onclick = goToQuiz;
    ulist.appendChild(liElm);
    
    liElm = document.createElement("li");
    liElm.tabindex = 2;
    liElm.onclick = goToQuestions;
    liElm.innerHTML = "Baza pitanja";
    ulist.appendChild(liElm);
    
    liElm = document.createElement("li");
    liElm.tabindex = 3;
    liElm.onclick = goToScores;
    liElm.innerHTML = "Prethodni pokušaji";
    ulist.appendChild(liElm);
    
    content.appendChild(ulist);
}

function goToQuestions() {
    content.innerHTML = "";
    
    var menuButton = document.createElement("button");
    menuButton.innerHTML = "Nazad";
    menuButton.onclick = goToMenu;
    content.appendChild(menuButton);
    
    var fileLabel = document.createElement("label");
    var dataTable = document.createElement("div");
    dataTable.id = "dataTable";
    
    if( file == null || questions == null ) {
        file = document.createElement("input");

        file.id = "fajlSaPitanjima";
        file.type = "file";
        file.accept = "."+supportedFormats.join(",.");
        file.onchange = function(){ loadQuestions(menuButton,dataTable); };
    }
    
    fileLabel.innerHTML = "Putanja do fajla sa pitanjima: ";
    fileLabel.for = "fajlSaPitanjima";

    
    content.appendChild(document.createElement("br"));
    content.appendChild(document.createElement("br"));
    
    content.appendChild(fileLabel);
    content.appendChild(file);
    
    
    if( questions != null ) {
        createTable(dataTable);
    }
}

function goToQuiz() {
    if( questions == null ) {
        alert("Nije moguće započeti novu igru." + 
                " Učitajte pitanja u bazu pitanja");
        return;
    }
    
    header = document.getElementById("header");
    header.style.height = "100px";
    
    headerEl = header.getElementsByTagName("h1")[0];
    headerEl.hidden = "true";
    
    content.innerHTML = "";
    
    var endButton = document.createElement("button");
    endButton.innerHTML = "Završi igru";
    endButton.onclick = function() {
        clearInterval(timerId);
        endOfTheGame();
    };
    content.appendChild(endButton);
    
    var controlDiv = document.createElement("div");
    controlDiv.className = "row";
    controlDiv.style = "margin: 10px;"
    content.appendChild(controlDiv);
    
    var scoreDiv = document.createElement("div");
    scoreDiv.className = "column";
    controlDiv.appendChild(scoreDiv);
    
    var scoreText = document.createElement("h1");
    scoreText.innerHTML = "Skor";
    scoreText.className = "itemText";
    scoreDiv.appendChild(scoreText);
    
    var scoreValue = document.createElement("h2");
    scoreValue.innerHTML = 0;
    scoreValue.className = "itemValue";
    scoreDiv.appendChild(scoreValue);
    
    var timerDiv = document.createElement("div");
    timerDiv.className = " column";
    controlDiv.appendChild(timerDiv);
    
    var timerText = document.createElement("h1");
    timerText.innerHTML = "Vreme";
    timerText.className = "itemText";
    timerDiv.appendChild(timerText);
    
    var timerValue = document.createElement("h2");
    timerValue.innerHTML = timeToAnswer + "s";
    timerValue.className = "itemValue";
    timerDiv.appendChild(timerValue);
    
    startTheGame(scoreValue,timerValue);
}

function goToScores() {
    content.innerHTML = "";
    
    var menuButton = document.createElement("button");
    menuButton.innerHTML = "Nazad";
    menuButton.onclick = goToMenu;
    content.appendChild(menuButton);
    
    var scores = getCookieValues();
    
    if(scores.length > 0) {
        scores.sort().reverse();

        var table = document.createElement("table");
        table.id = "scoreBoard";

        var tableInner= "<thead><tr><th>Rezultati prethodnih pokušaja</th></tr></thead><tbody>";


        for (var i = 0; i < scores.length; i++) {
            tableInner += "<tr><td>" + scores[i] + "</td></tr>";
        }

        tableInner += "</tbody></table>";

        table.innerHTML = tableInner;

        content.appendChild(table);
    }
    else {
        var txt = document.createElement("h2");
        txt.innerHTML = "Nije odigrana ni jedna igra";
        txt.className = "itemText";
        content.appendChild(txt);
    }
    
}