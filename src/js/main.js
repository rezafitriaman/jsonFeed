console.log('custom JS');
let items;
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

    pageNumber(items);
    
    let sort = items.sort(newToOld)
    return sort;

  })
  .then(function(sort) {
  	console.log('finsihed sort function');
    let page = pageLoad,
    	howManyitems = 10;

    /*make spinner disapere*/
    document.querySelector('#loading').style.display = 'none';

    console.log(`start page ${page}`);

    for (var i = (0 + page) * 10 ; i < (page * howManyitems ) + 10; i++) {
        appendString(sort[i]);
    }

    clickpage();
  })
  .catch(function(error) {
        console.log(error);
  });   
}

getJson('http://assessment.ictwerk.net/data', 0);

function clickpage() {
	console.log('on click function')
	let itemPageNumber = document.querySelector('#page').querySelectorAll('.number'),
		load = true;

	console.log(load)
	/*loop trought the pageNumber*/
	for (var i = 0; i < itemPageNumber.length; i++) {
		console.log('on loop')
		itemPageNumber[i].addEventListener("click", function(){
			console.log('click page')
			let $this = this,
		    	page = $this.innerText,
		    	items = document.querySelector('#content').querySelectorAll('.item'),
		    	parentPageNumber = $this.parentElement.parentElement.querySelectorAll('.item');

		    console.log(parentPageNumber)
		    console.log(page)

		    for (var i = 0; i < items.length; i++) {
				items[i].remove()
			}

			for (var i = 0; i < parentPageNumber.length; i++) {
				parentPageNumber[i].classList.remove("active");
			}
			/*add class active on page number*/
			$this.parentElement.classList.add("active");
			/*show spinner*/
			document.querySelector('#loading').style.display = 'block';
			/*hide page number*/
			document.querySelector('#page').style.display = 'none';
			console.log(load)
			/*load Json*/
			if (load == true) {
				console.log('loadpage')
				getJson('http://assessment.ictwerk.net/data', page);
				load = false;
			}
		});
	}

}

function pageNumber (items) {
	console.log('pagesNumber');
	let itemsLength = items.length / 10,
		maxPagesNumber = Math.ceil(itemsLength) - 1,
		clickOnce = true;

	document.querySelector('#lastPage').innerHTML = maxPagesNumber;
	document.querySelector('#page').style.display = 'flex';
	console.log(maxPagesNumber);

	/*fix this double click*/
	if (clickOnce == true) {
		document.querySelector('#next').addEventListener('click', function() {
			console.log('click')
		});
		clickOnce = false;
	}
}

function newToOld (a, b) {
	let dateA = new Date(a.pubDate), 
	 	dateB = new Date(b.pubDate),
		newAr = dateB-dateA;

    return dateB-dateA
}

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

  document.querySelector('#content').insertAdjacentHTML('afterbegin', string);
}

function provinceString(province) {
	let string = `
		<p class="place">${province}</p>
	`;

	return string;
}