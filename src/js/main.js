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
  	/*console.log('sort', sort);*/
    let page = pageLoad,
    	howManyitems = 10,
    	itemsLength = items.length,
    	lastPage = ((page * howManyitems ) + 10 - itemsLength > 0) ? (page * howManyitems ) + 10 - itemsLength : 0;
    	/*console.log('lastPage', lastPage)*/
    	console.log('startPage', page);
    /*make spinner disapere*/
    document.querySelector('#loading').style.display = 'none';

    for (var i = (0 + page) * 10 ; i < (page * howManyitems ) + 10 - lastPage ; i++) {
        appendString(sort[i]);
    }

  })
  .catch(function(error) {
        console.log(error);
  });   
}

getJson('http://assessment.ictwerk.net/data', 0);
clickpage();

function clickpage() {
	console.log('on click function')
	let itemPageNumber = document.querySelector('#page').querySelectorAll('.number'),
		prevButton = document.querySelector('#prev'),
		nextButton = document.querySelector('#next')

	/*loop trought the pageNumber*/
	for (var i = 0; i < itemPageNumber.length; i++) {
		/*on click this change the page to this number*/  
		itemPageNumber[i].addEventListener("click", function(){
			let $this = this,
		    	page = $this.innerText,
		    	items = document.querySelector('#content').querySelectorAll('.item'),
		    	parentPageNumber = $this.parentElement.parentElement.querySelectorAll('.item');

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

			/*load Json*/
			getJson('http://assessment.ictwerk.net/data', page);

		});
	}

	/*on click next list number*/
	nextButton.addEventListener('click', nextOrPrev);

	/*on click prev list number*/
	prevButton.addEventListener('click', nextOrPrev);
}

function nextOrPrev () {
	let target = this.id,
		listNumber = document.querySelector('#page').querySelectorAll('.prevOrNext');
		console.log(target)
	if (target == 'next') {

		document.querySelector('#prev').style.opacity = 1;

		for (var i = 0; i < listNumber.length; i++) {
			let value = parseInt(listNumber[i].innerText),
				parent = listNumber[i].parentElement

			listNumber[i].innerText = value + listNumber.length;
			parent.classList.remove("active");
		}	

	}else {

		for (var i = 0; i < listNumber.length; i++) {
			let value = parseInt(listNumber[i].innerText),
				parent = listNumber[i].parentElement

			listNumber[i].innerText = value - listNumber.length;
			parent.classList.remove("active");
		}

	}
}

function pageNumber (items) {
	/*console.log('pagesNumber');*/
	let itemsLength = items.length / 10,
		maxPagesNumber = Math.ceil(itemsLength) - 1;

	document.querySelector('#lastPage').innerHTML = maxPagesNumber;
	document.querySelector('#page').style.display = 'flex';
}

function newToOld (a, b) {
	let dateA = new Date(a.pubDate), 
	 	dateB = new Date(b.pubDate),
		newAr = dateB-dateA;

    return dateB-dateA
}

function appendString (data) {
	let logo = data.logo,
		link = data.link,
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