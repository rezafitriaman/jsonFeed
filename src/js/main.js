console.log('custom JS');

/*--- LOAD IN REALTIME ---*/

/*GLOBAL VARIABLE*/
let items;
let once = true;
/*START GET JSON*/
function getJson(Url, pageLoad) {
  fetch(Url)
    .then(function(response) {
      console.log('get response')
      return response.json();

    })
  .then(function(myJson) {
	items = myJson.items;
	/*USE SORT METHODE AND SAVE IT ON AN VARIABLE*/
    let sort = items.sort(newToOld);
    console.log('sort')
    return sort;

  })
  .then(function(sortedItem) {
    let page = pageLoad,
    	howManyitems = 10,
    	itemsLength = sortedItem.length,
    	spinnerEl = document.querySelector('#loading'),
    	lastPage = ((page * howManyitems ) + 10 - itemsLength > 0) ? (page * howManyitems ) + 10 - itemsLength : 0;

    console.log('startPage', page);
    /*HIDE SPINNER*/
    spinnerEl.style.display = 'none';
    /*LOOP THROUGHT THE ITEMS*/
    for (var i = (0 + page) * 10 ; i < (page * howManyitems ) + 10 - lastPage ; i++) {
        /*APPEND HTML STRINGS*/
        appendString(sortedItem[i]);
    }
    /*ADD PAGE NUMBER*/
    pageNumber(sortedItem, spinnerEl);

  })
  .catch(function(error) {
        console.log(error);
  });   
}

/*START THE FIRST PAGE*/
getJson('http://assessment.ictwerk.net/data', 0);

/*IMPLEMENT PAGE NUMBER*/
function pageNumber (sortedItem, spinnerEl) {
	let itemsLength = sortedItem.length / 10,
		maxPagesNumber = Math.ceil(itemsLength) - 1,
		lastPageEl = document.querySelector('#lastPage'),
		pageContainerEl = document.querySelector('#page');


	lastPageEl.innerHTML = maxPagesNumber;
	pageContainerEl.style.display = 'flex';

	if(once) {
		console.log('Doing this once!');
		clickpage(lastPageEl, pageContainerEl, spinnerEl);
		once = false;

	}else{
		return;
	}

}

function clickpage(lastPageEl, pageContainerEl, spinnerEl) {
	console.log('on click function')
	let itemPageNumber = pageContainerEl.querySelectorAll('.number'),
		prevButton = document.querySelector('#prev'),
		nextButton = document.querySelector('#next');

	/*loop trought the pageNumber*/
	for (var i = 0; i < itemPageNumber.length; i++) {
		/*on click this change the page to this number*/  
		itemPageNumber[i].addEventListener("click", function(){
			let $this = this,
		    	page = $this.innerText,
		    	itemsEl = document.querySelector('#content').querySelectorAll('.item'),
		    	parentPageNumber = $this.parentElement.parentElement.querySelectorAll('.item');

		    for (var i = 0; i < itemsEl.length; i++) {
				itemsEl[i].remove()
			}

			for (var i = 0; i < parentPageNumber.length; i++) {
				parentPageNumber[i].classList.remove("active");
			}
			/*add class active on page number*/
			$this.parentElement.classList.add("active");
			/*show spinner*/
			spinnerEl.style.display = 'block';
			/*hide page number*/
			pageContainerEl.style.display = 'none';
			/*load Json*/
			getJson('http://assessment.ictwerk.net/data', page);
			/*IF LAST PAGE NUMBER IS CLIKED CREATE DEC NUMBERS FROM THE MAX NUMBER*/
			if(page == lastPageEl.innerText) {
				let numbersEl = document.querySelectorAll('.prevOrNext'),
					pageNumber = lastPageEl.innerText - 1;

				console.log('clickpage', page)

				for (var i = numbersEl.length - 1; i >= 0; i--) {
					numbersEl[i].innerText = pageNumber--;
				}
				nextOrPrev(lastPageEl);
			}

		});
	}

	/*on click next list number*/
	nextButton.addEventListener('click', nextOrPrev);

}

function nextOrPrev (lastPageEl) {
	let target = this.id || lastPageEl.id,
		listNumber = document.querySelector('#page').querySelectorAll('.prevOrNext'),
		prevButtonEl = document.querySelector('#prev'),
		maxNumber = parseInt(document.querySelector('#lastPage').innerText) - 1,
		nextButtonEl = document.querySelector('#next');

	if (target == 'next' || target == 'lastPage') {
		if(target == 'lastPage') {
			console.log('lastPage')
			nextButtonEl.style.opacity = 0;
			nextButtonEl.style.cursor = 'auto';
			nextButtonEl.removeEventListener('click', nextOrPrev)

			prevButtonEl.style.opacity = 1;
			prevButtonEl.style.cursor = 'pointer';
			prevButtonEl.addEventListener('click', nextOrPrev);
		}else {
			console.log('next')

			prevButtonEl.style.opacity = 1;
			prevButtonEl.style.cursor = 'pointer';
			prevButtonEl.addEventListener('click', nextOrPrev);

			for (var i = 0; i < listNumber.length; i++) {
				let value = parseInt(listNumber[i].innerText),
					parent = listNumber[i].parentElement
				listNumber[i].innerText = value + listNumber.length;
				parent.classList.remove("active");
				listNumber[i].parentElement.style.display = 'inline-block';

				console.log(listNumber[i].innerText)
				if(listNumber[i].innerText > maxNumber) {
					console.log('loop')
					console.log(listNumber[i])
					listNumber[i].parentElement.style.display = 'none';
					nextButtonEl.style.opacity = 0;
					nextButtonEl.style.cursor = 'auto';
					nextButtonEl.removeEventListener('click', nextOrPrev)
				}
			}

			if(listNumber[9].innerText == maxNumber) {
				nextButtonEl.style.opacity = 0;
				nextButtonEl.style.cursor = 'auto';
				nextButtonEl.removeEventListener('click', nextOrPrev);
			}
		}	

	}else {
		console.log('prev')

		for (var i = 0; i < listNumber.length; i++) {
			let value = parseInt(listNumber[i].innerText),
				parent = listNumber[i].parentElement

			listNumber[i].innerText = value - listNumber.length;
			parent.classList.remove("active");
			listNumber[i].parentElement.style.display = 'inline-block';

			if(listNumber[i].innerText < 0) {
				listNumber[i].parentElement.style.display = 'none';
				prevButtonEl.style.opacity = 0;
				prevButtonEl.style.cursor = 'auto';
				prevButtonEl.removeEventListener('click', nextOrPrev)
			}
		}
		if(listNumber[0].innerText == '0') {
			prevButtonEl.style.opacity = 0;
			prevButtonEl.style.cursor = 'auto';
			prevButtonEl.removeEventListener('click', nextOrPrev);
		}

		nextButtonEl.style.opacity = 1;
		nextButtonEl.style.cursor = 'pointer';
		nextButtonEl.addEventListener('click', nextOrPrev)
	}
}

/*IMPLEMENT SORT FUNCTION FORM NEW TO OLD*/
function newToOld (a, b) {
	let dateA = new Date(a.pubDate), 
	 	dateB = new Date(b.pubDate),
		newAr = dateB-dateA;

    return dateB-dateA
}

/* FUNCTION TO APPEND STRING FOR ITEMS*/
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
/*IF PROVINCE EXIST THEN APPEND THIS FUNCTION*/
function provinceString(province) {
	let string = `
		<p class="place">${province}</p>
	`;

	return string;
}

/*function numbers(numbers) {
	console.log(numbers)
	let stringFirst = `
		<li class="item">
            <span class="number prevOrNext">${numbers}</span>
        </li>
	`;
	
	document.querySelector('.doted').insertAdjacentHTML('beforebegin', stringFirst);

	if(numbers == 0) {
		document.querySelector('#page').querySelectorAll('.item')[1].classList.add("active");
	}
	if(numbers == 9) {
		clickpage();
	}
}*/