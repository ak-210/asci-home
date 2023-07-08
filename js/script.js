// Auto populate #case-study ////////////////////////////////////////////////////
async function getJSON(path) {
    const response = await fetch(path);
    const data = await response.json();
    return data
};

async function getHTML(path) {
    const response = await fetch(path);
    const data = await response.text();
    return data
};

function addProperty(name, value, text){
    var txt = text.replace(name, value)
    return(txt);
};

var projects = await getJSON('../json/case-study.json');
var html = await getHTML('../snippets/case-study.html');
var final_html = '';


for(var i = 0; i < 3; i++){
    var txt =  addProperty("{{title}}", projects[i].title, html);
    final_html +=  addProperty("{{desc}}", projects[i].description, txt) + '\n';
}

document.getElementById("case-study").innerHTML = final_html;