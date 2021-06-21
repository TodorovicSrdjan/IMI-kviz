
function loadQuestions(menuButton,dataTable) {
    
    dataTable.innerHTML = "";

    var ext = file.value.split('.').pop();

    if( ext === "csv" ) {
        if (typeof (FileReader) === "undefined") {
            alert("Vaš browser ne podržava FileReader API.");
            return;
        } 
        else {
            readCSV_CreateTable(dataTable);
        }
    }
    else if( ext === "json" ) {
        if (typeof window.FileReader !== 'function') {
            alert("Vaš browser ne podržava File API");
            return;
        }

        if (!file.files) {
            alert("Vaš browser ne podržava `files` svojstvo ulaznih fajlova ");
          }
        else {
          readJSON_CreateTable(dataTable);
        }
    }
// TODO
    /*
    else if( ext === "xml" ) {
        readXML_CreateTable(dataTable);
    }*/
    else {
        alert("Greska: nepoznat format");
        questions = null;
        goToQuestions();
    }
}

function createTable(dataTable) {
    var domDataTable = document.getElementById("dataTable");
    
    if( domDataTable != null ) {
        domDataTable.parentNode.removeChild(domDataTable);
    }
    
    var table = document.createElement("table");
    table.className = "tableFixHead";
    
    var TableInnerHTML = "<thead><tr>" +
                        "<th>Rbr</th>" +
                        "<th>Pitanje</th>" +
                        "<th>Odgovor</th>" +
                        "<th>Tip pitanja</th>" + 
                        "<th>Broj poena</th>" +
                        "</tr></thead><tbody>";
    
    for (var i = 0; i < questions.length; i++) {
        TableInnerHTML += "<tr><td>";
        TableInnerHTML += i+1 + "</td>";
        TableInnerHTML += "<td>" + questions[i].Pitanje + "</td>";
        TableInnerHTML += "<td>" + questions[i].Odgovor + "</td>";
        TableInnerHTML += "<td>" + questions[i].Tip + "</td>";
        TableInnerHTML += "<td>" + questions[i].Vrednost + "</td>";
        TableInnerHTML += "</tr>";
    }
    table.innerHTML = TableInnerHTML + "</tbody>";
    
    var txt = document.createElement("p");
    txt.innerHTML = "Učitana pitanja i odgovori:";
    
    if( timeToAnswer == null || timeToAnswer < 5 ) {
        timeToAnswer = 20;
    }
    
    
    var time2AnswerDiv = document.createElement("div");
    time2AnswerDiv.innerHTML = '<label for="vremeCekanja">' 
                                + 'Maksimalno vreme za unos ispravnog odgovora: </label>';
    time2AnswerDiv.innerHTML += '<input id="vremeCekanja" type="number" '
                            + 'onchange="timeToAnswer=this.value;" min="5" '
                            + 'value="' + timeToAnswer
                            + '" title="Jedinica mere je sekund"/>';
    time2AnswerDiv.style.margin = "10px 0";
    
    var form = document.createElement("form");
    var fieldset = document.createElement("fieldset");
    
    var fieldsetInnerHtml = "<legend>Izvoz pitanja</legend>";
    
    fieldsetInnerHtml += '<label for="formatIzlaznogFajla">Format izlaznog fajla: </label>';
    
    fieldsetInnerHtml += '<select id="formatIzlaznogFajla">' 
                            + "<option>json</option>"
                            + "<option>csv</option></select>";
// TODO
                            /*+ "<option>csv</option>"
                            + "<option>xml</option></select>";*/
      
    fieldsetInnerHtml += '<input type="button" '
                            + 'onclick="downloadQuestions()" '
                            + 'value="Izvezi"/>';
    
    fieldset.innerHTML = fieldsetInnerHtml;
    form.appendChild(fieldset);
    
    dataTable.appendChild(time2AnswerDiv);
    dataTable.appendChild(form);
    dataTable.appendChild(txt);
    dataTable.appendChild(table);

    content.appendChild(dataTable);
}

function readCSV_CreateTable(dataTable) {
    var reader = new FileReader();
    reader.onload = function (e) {
        questions = $.csv.toObjects(e.target.result);
        if(Object.keys(questions["0"]).join() !== "Pitanje,Odgovor,Tip,Vrednost" ) {
            alert("Neispravan format. "+ 
                    "Ispravan format zaglavlja: Pitanje,Odgovor,Tip,Vrednost");
            questions = null;
            
            goToQuestions();
            
            return;
        }
        createTable(dataTable);
    };
    
    reader.readAsText(file.files[0], "utf-8");
}

function readJSON_CreateTable(dataTable) {
    
    var fr = new FileReader();
    fr.onload = function(e) {
        try {
            questions = JSON.parse( e.target.result );

            if(Object.keys(questions["0"]).join() !== "Pitanje,Odgovor,Tip,Vrednost" ) {
                alert("Neispravan format. "+ 
                        "Ispravan format zaglavlja: Pitanje,Odgovor,Tip,Vrednost");
                questions = null;
                
                goToQuestions();
                
                return;
            }
            createTable(dataTable);
        }
        catch (exception) {
            alert("Neispravan json fajl.");
            questions = null;
            console.log("Uhvacen exception: ",exception);
            
            goToQuestions();
            
            return;
        }
    };
    
    fr.readAsText(file.files[0]);
    
}

// TODO
function readXML_CreateTable(dataTable) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var x2js = new X2JS();
        questions = x2js.xml_str2json(ParseXML(e.target.result));
        createTable(dataTable);
    };
    
    reader.readAsText(file.files[0], "utf-8");
}

function downloadQuestions(event) {
  var ext = document.getElementById("formatIzlaznogFajla").value;
  var filename = "izvezena_pitanja." + ext;
  var outputContent = formatQuestionsTo(ext);
  
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' 
                            + encodeURIComponent(outputContent));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function formatQuestionsTo(ext) {
    if(ext === "csv") {
        return $.csv.fromObjects(questions);
    }
    else if(ext === "json") {
        return JSON.stringify(questions);
    }
    /*else if(ext === "xml") { 
// TODO
        return json2xml( questions, 1 );
    }*/
}

/*
function ParseXML(val)
{
    if (window.DOMParser)
    {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(val,"text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
        xmlDoc.loadXML(val);
    }
return xmlDoc ;
}
*/