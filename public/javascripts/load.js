window.onload = function (){
    let page = getMeta('page')
    fetch(`/load/${page}`).then(function(response) {
        return response.json();
    }).then(function(myJson) {
        console.log(myJson)
        document.getElementById('main').innerHTML = myJson.body;
    });
}

function getMeta(metaName) {
    const metas = document.getElementsByTagName('page');
  
    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === metaName) {
          console.log(metas[i].innerText)
        return metas[i].innerText;
      }
    }
  
    return '';
  }
