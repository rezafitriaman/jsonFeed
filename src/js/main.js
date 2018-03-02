console.log('custom JS');
let items;
let arrrayNew = []
/*--- LOAD IN REALTIME ---*/
function getJson(Url, pageLoad) {
  fetch(Url)
    .then(function(response) {
      console.log('get response')
      return response.json();
    })
  .then(function(myJson) {
    items = myJson.items;
    console.log('finished')

    let sort = items.sort(function(a,b) {
    	console.log('sort')
		/*console.log(a.pubDate)
		console.log(b.pubDate)*/
		let dateA=new Date(a.pubDate), 
		 	dateB=new Date(b.pubDate)
		let newAr = dateB-dateA;
		 console.log(newAr)
	    return dateA-dateB
	});
	console.log(sort)
    return sort;

  })
  .then(function(sort) {
  	console.log('finsihed sort function');
    let page = pageLoad;
    let howManyitems = 10;

    console.log(`start page ${page}`);

    for (var i = (0 + page) * 10 ; i < (page * howManyitems ) + 10; i++) {
        appendString(sort[i]);
        console.log(sort[i])
        arrrayNew.push(sort[i])
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
		pubDate = data.pubDate,
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
			    ${province.length > 0 ? provinceString(province) : ""}
			</div>
			<div class="wrapper-button">
			    <a href="#">
			        <button class="button">BEKIJK DETAILS</button>
			    </a>
			</div>
		</div>
	`;
	console.log(pubDate)

/*	console.log(link)
	console.log(logo)*/
	/*console.log(province)*/
/*	console.log(title)*/

  document.querySelector('#content').insertAdjacentHTML('afterbegin', string);
}

function provinceString(province) {
	/*console.log(province)*/

	let string = `
		<p class="place">${province}</p>
	`;

	return string;
}

/*var sander = Date.parse('Fri, 02 Mar 2018 08:03:45 GMT');
var reza = Date.parse('Fri, 02 Mar 2018 11:03:00 GMT');

console.log(sander);
// expected output: 0

console.log(reza);
// expected output: 818035920000
console.log(reza - sander)
console.log(sander - reza)
console.log(sander < reza)*/

/*var test = arrrayNew.sort(function(a,b) {
	console.log(a.pubDate)
	console.log(b.pubDate)
	 var dateA=new Date(a.pubDate), dateB=new Date(b.pubDate)
	 var newAr = dateB-dateA;
	 console.log(newAr)
    return dateB-dateA //sort by date ascending
});

console.log(test)*/