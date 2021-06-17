$(document).ready(function () {
    //listSubject(params)
})

function listClasses() {
    var e = document.getElementById('subject');
    let subject = e.value;
    if (!subject) {
        var x = document.getElementById("classes");
        x.innerHTML = '';
        var y = document.getElementById("name");
        y.innerHTML = '';
        return;
    }
    fetch(`/nauczyciel/przedmiot/${subject}`).then(function (response) {
        return response.json();
    }).then(function (myJson) {
        //console.log(myJson)
        var x = document.getElementById("classes");
        x.innerHTML = '';
        var option = document.createElement("option");
        option.text = '';
        option.value = '';
        x.add(option);
        for (var i = 0; i < myJson.classes.length; i++) {
            var el = myJson.classes[i];
            var option = document.createElement("option");
            option.text = el.nazwaKlasy;
            option.value = el.nazwaKlasy;
            x.add(option);
        }
    });
}


function listName() {
    var e = document.getElementById('classes');
    let class_ = e.value;
    if (!class_) {
        var x = document.getElementById("name");
        x.innerHTML = '';
        return;
    }

    var f = document.getElementById('subject');
    let subject = f.value;

    fetch(`/nauczyciel/przedmiot/${subject}/klasa/${class_}`).then(function (response) {
        return response.json();
        //return JSON.stringify(response);
    }).then(function (myJson) {
        //console.log(myJson)
        var keys = myJson.ke;
        var values = myJson.va;
        /*
        for(var i=0; i< keys.length; i++){
            console.log(keys[i] + ": " + values[i]);
        }
        */

        var x = document.getElementById("name");
        x.innerHTML='';
        var option = document.createElement("option");
        option.text = '';
        option.value = '';
        x.add(option);
        for(var i=0; i< keys.length; i++){
            var option = document.createElement("option");
            option.text = values[i];
            option.value = keys[i];
            x.add(option);
        }
    });
}


function validScore() {
    var e = document.getElementById('score');
    if (isNaN(e.value)) {
        e.classList.add('is-invalid')
    }
    else {
        var val = new Number(e.value);
        if (!(1 <= val && val <= 6)) {
            e.classList.add('is-invalid')
        }
        else {
            e.classList.remove('is-invalid')
        }
    }
    console.log(e.value);
}
