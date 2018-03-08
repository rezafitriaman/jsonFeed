console.log('custom JS');

/*--- LOAD IN REALTIME ---*/
let items;
let once = true;
function getJson(Url, pageLoad) {
  fetch(Url)
    .then(function(response) {
      console.log('get response')
      return response.json();
    })
  .then(function(myJson) {
	items = myJson.items;
	console.log('sort')
    let sort = items.sort(newToOld);

    return sort;

  })
  .then(function(sort) {
  	console.log('finsihed sort function');
  	/*console.log('sort', sort);*/
    let page = pageLoad,
    	howManyitems = 10,
    	itemsLength = sort.length,
    	lastPage = ((page * howManyitems ) + 10 - itemsLength > 0) ? (page * howManyitems ) + 10 - itemsLength : 0;

    	console.log('startPage', page);

    document.querySelector('#loading').style.display = 'none';

    for (var i = (0 + page) * 10 ; i < (page * howManyitems ) + 10 - lastPage ; i++) {
        appendString(sort[i]);
        /*console.log(i)*/
/*        numbers(i);*/
    }


    pageNumber(sort);

  })
  .catch(function(error) {
        console.log(error);
  });   
}

getJson('http://assessment.ictwerk.net/data', 0);

function clickpage() {
	console.log('on click function')
	let itemPageNumber = document.querySelector('#page').querySelectorAll('.number'),
		prevButton = document.querySelector('#prev'),
		nextButton = document.querySelector('#next'),
		lastPage = document.querySelector('#lastPage');

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

			if(page == lastPage.innerText) {
				let number = document.querySelectorAll('.prevOrNext');
				let pageNumber = lastPage.innerText - 1;
				console.log('clickpage', page)

				for (var i = number.length - 1; i >= 0; i--) {
					number[i].innerText = pageNumber--;
				}
				nextOrPrev(lastPage.id);
			}

		});
	}

	/*on click next list number*/
	nextButton.addEventListener('click', nextOrPrev);

}

function nextOrPrev (lastPage) {
	let target = this.id || lastPage,
		listNumber = document.querySelector('#page').querySelectorAll('.prevOrNext'),
		prevButtonEl = document.querySelector('#prev'),
		maxNumber = parseInt(document.querySelector('#lastPage').innerText) - 1,
		nextButtonEl = document.querySelector('#next');
		console.log(target)

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

function pageNumber (items) {
	/*console.log('pagesNumber');*/
	let itemsLength = items.length / 10,
		maxPagesNumber = Math.ceil(itemsLength) - 1;

	document.querySelector('#lastPage').innerHTML = maxPagesNumber;
	document.querySelector('#page').style.display = 'flex';

	if(once) {
		console.log('Doing this once!');
		clickpage();
		once = false;

	}else{
		return;
	}

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