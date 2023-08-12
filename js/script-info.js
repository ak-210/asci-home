async function getData(url, element) {
    var res = await fetch(url)
    var data = await res.text()

    document.querySelector(element).innerHTML = data
}

getData('snippets/header.html', 'header')
getData('snippets/footer.html', 'footer')
