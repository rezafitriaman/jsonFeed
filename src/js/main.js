console.log('custom JS');

/*--- LOAD IN REALTIME ---*/
function getJson(Url, pageLoad) {
  fetch(Url)
    .then(function(response) {
      console.log('get response')
      return response.json();
    })
  .then(function(myJson) {
    let items = myJson.items;
    console.log('finished')
    return items;
  })
  .then(function(items) {
    let page = pageLoad;
    let howManyitems = 10;

    console.log(`start page ${page}`);

    for (var i = (0 + page) * 10 ; i < (page * howManyitems ) + 10; i++) {
        appendString(items[i]);
        console.log(items[i])
    }
  })
  .catch(function(error) {
        console.log(error);
  });   
}

getJson('http://assessment.ictwerk.net/data', 0);

function appendString (data) {
	let link = data.link,
		logo = data.logo,
		province = data.province,
		title = data.title,
		string = `
		<div class="item">
			<div class="wrapper-img">
			    <img src="${logo}" alt="logo" class="img">
			</div>
			<div class="wrapper-text">
			    <a href="${link}">
			        <h2 class="title">${title}</h2>
			    </a>
			    <p class="subtitle">Locatienet</p>
			    <p class="place">${province}</p>
			</div>
			<div class="wrapper-button">
			    <a href="#">
			        <button class="button">BEKIJK DETAILS</button>
			    </a>
			</div>
		</div>
	`;
/*
	console.log(link)
	console.log(logo)
	console.log(province)
	console.log(title)*/

  document.querySelector('#content').insertAdjacentHTML('afterbegin', string);
}
