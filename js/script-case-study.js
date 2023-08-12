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
    return text.replace(name, value)
};

var projects = await getJSON('json/case-study.json');
var html = await getHTML('snippets/case-study.html');
var final_html = '';

var no_of_blogs = 2 // Change to display more blogs

for(var i = 0; i < no_of_blogs; i++){
    var txt =  addProperty("{{title}}", projects[i].title, html);
    txt =  addProperty("{{desc}}", projects[i].description, txt) + '\n';
    final_html +=  addProperty("{{link}}", projects[i].link, txt) + '\n';
}

document.getElementById("case-study").innerHTML = final_html;