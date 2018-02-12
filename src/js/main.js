//create data for local storage
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : { todo: [], completed: []};

/*add dragula function*/
var lifted = false;
var drakeTodo = dragula([document.getElementById('todo')], {
	moves: function (el, container, handle) {
		if (lifted) {
            lifted = false;
            return handle.classList.contains('handle');
        }
	},
	isContainer: function (el) {
	   return el.classList.contains('.list');
  	}
});

var drakeCompleted = dragula([document.getElementById('completed')], {
	moves: function (el, container, handle) {
		if (lifted) { // Manage the drag after 1 second
            lifted = false;
            return handle.classList.contains('handle');
        }
	},
	isContainer: function (el) {
	   return el.classList.contains('.list');
  	}
});

//renderTodoListToHTML
renderTodoListToHTML ();

function renderTodoListToHTML() {

	if(data.completed.length == 0 && data.todo.length == 0 ) {
		/*console.log('two of them is empty');*/
		
	}else {
		/*console.log('one of them is not empty');*/
		for (var i = 0; i < data.todo.length; i++) {
			var value = data.todo[i];
			addItemTodo(value);
		}
		for (var j = 0; j < data.completed.length; j++) {
			var value = data.completed[j];
			addItemTodo(value, true) 		
		}

	}
	/*Call on onTouchStart*/
	onTouchStart();
}

function dataObjectUpdated() {
	//make it Json first then store it as a string on locaql sotrage
	localStorage.setItem('todoList', JSON.stringify(data));
	/*console.log('data on doom', data);*/
}

/*User clicked on the add button
if there is any text inside the item field, add that text to the todo list*/
document.getElementById('add').addEventListener('touchstart', function() {
	var value = document.getElementById('item').value;
	//if the value not empty
	if(value) {
		addItemTodo(value);
		document.getElementById('item').value = '';
		//push value in to object data
		data.todo.push(value);

		dataObjectUpdated();
		onTouchStart();
		vibrate();
	}else {
		/*console.log('no value');*/
	}
});

//on key down Enter
document.getElementById('item').addEventListener('keydown', function(e) { 
	var value = this.value;

	if(e.keyCode === 13 && value || e.keyCode === 13 && value ) {

		addItemTodo(value);
		document.getElementById('item').value = '';
		data.todo.push(value);

		dataObjectUpdated();
		onTouchStart();
		vibrate();
	}

});

//add item function
function addItemTodo(value, completed) {
	//parent El
	var parent = (completed) ? document.getElementById('completed'):document.getElementById('todo');
	//create div an apply class and id
	var container = document.createElement("div")
	container.classList.add('container');
	container.classList.add('mirror');
	container.setAttribute('id', 'container');
	container.style.opacity = 0;
	//create domString
	var domString = '<div class="row">\
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
                            <div class="content">\
                                <ul class="items">\
                                	<li class="item">\
                                        <i class="fa fa-bars fa-1x handle" aria-hidden="true"></i>\
                                    </li>\
                                    <li class="item">\
                                        <p class="text" id="text">'+ value +'</p>\
                                    </li>\
                                    <li class="item delete">\
                                        <a id="delete" class="deleteButton"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></a>\
                                    </li>\
                                    <li class="item check">\
                                       <button id="check" class="checkButton"><i class="fa fa-check-circle-o fa-2x" aria-hidden="true"></i></button>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
	                </div>';
	
	//append the string to the div .container
	container.innerHTML = domString;
	//insert before other item on click
	parent.insertBefore(container, parent.childNodes[0]);
	//fade in function after append it before first child(insert Before)
	fadeIn(container);

	//get the delete button and remove item on click trash
	var deleteButton = document.getElementsByClassName('deleteButton');

	for (var i = 0; i < deleteButton.length; i++) {
		deleteButton[i].addEventListener('touchstart', removeItem);
	}

	//get the complete button and add item to complete or re-add
	var completeButton = document.getElementsByClassName('checkButton');

	for (var i = 0; i < completeButton.length; i++) {
		completeButton[i].addEventListener('touchstart', completeItem);
	}
}

//the add to complete function
function completeItem() {
	var completeButton = this;
	var value = completeButton.parentNode.parentNode.querySelector("#text").innerText;
	var item = completeButton.closest("#container");
	var parentID = item.parentNode.id;

	/*on click desable button*/
	completeButton.setAttribute('disabled', true);

	if(parentID === 'todo') {
		
		data.todo.splice(data.todo.indexOf(value), 1);
		data.completed.push(value);
	}else {
		data.completed.splice(data.completed.indexOf(value), 1);
		data.todo.push(value);
	}

	//check what the parent is
	var target = (parentID == 'todo') ? document.getElementById('completed') : document.getElementById('todo');
	/*console.log('item from completeItem', item);*/
	fadeOut(completeButton, item, target, true);
	/*target.insertBefore(item, target.childNodes[0]);*/

	dataObjectUpdated();
	vibrate();
}

//the remove function
function removeItem() {
	var item = this.closest("#container");
	var parentID = item.parentNode.id;
	var value = this.parentNode.parentNode.querySelector("#text").innerText;

	if(parentID === 'todo') {
		data.todo.splice(data.todo.indexOf(value), 1);
	}else {
		data.completed.splice(data.completed.indexOf(value), 1);
	}
	/*console.log('target from removeItem', item)*/
	fadeOut(false, item, false, false);
	/*target.remove();*/

	dataObjectUpdated();
	vibrate();
};

//Fade out
function fadeOut(completeButton, item, target, completed) {
    var timer = setInterval(function () {
        op = op - 0.1;
        if (op <= 0.0){
            clearInterval(timer);
            if(completed === true) {
            	target.insertBefore(item, target.childNodes[0]);
            	fadeIn(item);
            	/*finished delete disabled*/
            	completeButton.removeAttribute('disabled');
            }else {
            	item.remove();
            	/*console.log('remove');*/
            }
        }
        item.style.opacity = op;
        
    }, 40);

   var op = 1;  // initial opacity
}

//fade in
function fadeIn(container) {
	var timer = setInterval(function() {
		op = op + 0.1
		if(op >= 1) {
			clearInterval(timer);
			/*console.log('add');*/
			op = 1;
		}
		/*console.log('op', op);*/
		container.style.opacity = op;

	},40);

	var op = 0.1;
	
}

/*drag en drop dragula*/
function onTouchStart() {
	var target = document.querySelectorAll('.mirror');
	var timer, lockTimer;
	var touchduration = 800;
	var dragTarget;

	/*first delete style property*/
	for (var i = 0; i < target.length; i++) {

		target[i].querySelector('.handle').addEventListener("touchstart", touchstart, false);
  		target[i].querySelector('.handle').addEventListener("touchend", touchend, false);

	}

	function touchstart(e) {
		e.preventDefault();
		dragTarget = this;
		dragTarget.closest('#container').removeAttribute("style");
		if(lockTimer){
			return;
		}
	    timer = setTimeout(onlongtouch, touchduration); 
		lockTimer = true;
	}

	function touchend() {
		lifted = false;
	    //stops short touches from firing the event
	    if (timer){
	        clearTimeout(timer); // clearTimeout, not cleartimeout..
			lockTimer = false;
		}
		/*console.log(this)*/
		/*update the list on drop*/
		observeDrop(this);
	}

	 function onlongtouch() {
		var parent = dragTarget.closest('#container').parentNode.getAttribute('id');
		var offsetTop = (parent == 'todo') ? dragTarget.closest('#container').offsetTop - window.scrollY + 130 : (dragTarget.closest('#container').offsetTop + document.querySelector('#todo').offsetHeight) - window.scrollY + 170;
		
		lifted = true;
        drakeTodo.lift(dragTarget);
        drakeCompleted.lift(dragTarget);

        var guMirror = document.querySelector('.gu-mirror');

       	guMirror.style.top = offsetTop + 'px';
       	guMirror.style.left = 20 + 'px';

		vibrate();
	};

}

/*observe on drop and save the list on localstorage (dataObjectUpdated)*/
function observeDrop(dropedItem) {
	var parentTarget =  dropedItem.closest('#container').parentNode;
	var targetList = parentTarget.querySelectorAll('.container');

	if(parentTarget.getAttribute('id') == 'todo') {
		/*console.log('if on todo', parentTarget.querySelectorAll('.container'))*/
		data.todo = [];

		for (var i = 0; i < targetList.length; i++) {
			data.todo.unshift(targetList[i].querySelector('.text').innerText);
		}

	}else {
		data.completed = [];
		for (var i = 0; i < targetList.length; i++) {
			data.completed.unshift(targetList[i].querySelector('.text').innerText);
		}
	}

	dataObjectUpdated();
}

/*function intro*/
function intro() {
	var intro = document.getElementById('intro');
	var todoApp = document.getElementById('todo-app');

	function showApp() {
		intro.style.display = 'none'
		todoApp.style.display = 'block'
	}
	setTimeout(function() {
		showApp();
	},2000);
}

intro();

//vibrate function
document.addEventListener("deviceready", vibrate, false);
function vibrate() {
    /*console.log(navigator.vibrate);*/
    navigator.vibrate(100);
}
