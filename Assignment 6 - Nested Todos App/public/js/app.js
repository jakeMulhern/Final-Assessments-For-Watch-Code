/*global jQuery, Handlebars, Router */
'use strict';


var myArraySystem =  {
  ourArraySystem: function(libraryName, val) {
    var storageUnitName = libraryName.toString().replace('nestedArray', 'Storage');
    
    var SU = util.store(storageUnitName);
    var length = util.store(storageUnitName).length;
    
    if (util.store(storageUnitName).length >= 1) {
      var arrayStorage = util.store(storageUnitName);
      arrayStorage.push({
        id: util.uuid(),
        title: val,
        completed: false
      });
      console.log(arrayStorage);
    } else {
      arrayStorage = new Array();
      arrayStorage.push({
        id: util.uuid(),
        title: val,
        completed: false
      });
      console.log(arrayStorage);
    }
      
      
      util.store(storageUnitName, arrayStorage);
    
      console.log('following is the MF Storage unit')
      console.log(util.store(storageUnitName));
    
        
  }
};

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			this.todos = util.store('todos-jquery');
			this.bindEvents();

      new Router({
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');      
		},
		bindEvents: function () {
		  document.getElementById('new-todo').addEventListener('keyup', this.create.bind(this));
      document.getElementById('toggle-all').addEventListener('change', this.toggleAll.bind(this));
		  document.getElementById('footer').addEventListener('click', function(event) {
        var elementClicked = event.target;
		    if (elementClicked.id === 'clear-completed') {
		      this.destroyCompleted();
	      	}    
	      }.bind(this));
        
    /*
		 $('#todo-list') 
		 */
      
      document.getElementById('todo-list').addEventListener('change', function(event) {
        var elementChanged = event.target;
        if (elementChanged.className === 'toggle') {
          this.toggle(event);
        }
      }.bind(this));
      document.getElementById('todo-list').addEventListener('change', function(event) {
        var elementChanged = event.target;
        if (elementChanged.className === 'nestToggle') {
          this.nestToggle(event);
        }
      }.bind(this));
      document.getElementById('todo-list').addEventListener('dblclick', function(event) {
        var elementDblClicked = event.target;
        if (elementDblClicked.localName === 'label') {
          this.edit(event);
        }
      }.bind(this));
      document.getElementById('todo-list').addEventListener('keyup', function(event) {
        var elementKeyup = event.target;
        if (elementKeyup.className === 'edit') {
          this.editKeyup(event);
        }
      }.bind(this));
      document.getElementById('todo-list').addEventListener('focusout', function(event) {
        var elementFocusOut = event.target;
        if (elementFocusOut.className === 'edit') {
          this.update(event);
        }
      }.bind(this));
      document.getElementById('todo-list').addEventListener('click', function(event) {
        var elementClicked = event.target;
        if (elementClicked.className === 'destroy') {
          this.destroy(event);
        }
      }.bind(this));
      document.getElementById('todo-list').addEventListener('click', function(event) {
        var elementClicked = event.target;
        if (elementClicked.className === 'nestDestroy') {
          this.destroyNestedTodo(event);
        }
      }.bind(this));
      document.getElementById('todo-list').addEventListener('click', function(event) {
        var elementClicked = event.target;
        if (elementClicked.className === 'nest') {
          this.createNestedInput(event);
        }
      }.bind(this));
      
	 },
		render: function () {
			var todos = this.getFilteredTodos();
      var todosUl = document.querySelector('ul');
	    todosUl.innerHTML = '';
	    var i;
      var array = array;
	    for (i = 0; i < todos.length; i++) {
        var makeLi = document.createElement('li');
        var makeDiv = document.createElement('div');
        var makeInput = document.createElement('input');
        var makeLabel = document.createElement('label');
        var makeButton = document.createElement('button');
        var makeInputTwo = document.createElement('input');

          if (todos[i].completed === true) {
            makeLi.className += 'completed';
            makeInput.setAttribute('checked', '');
          }

        makeLi.setAttribute('data-id', todos[i].id);
        makeLi.id = todos[i].id;
        todosUl.appendChild(makeLi);
        makeDiv.className = 'view';
        makeLi.appendChild(makeDiv);
        makeInput.className = 'toggle';
        makeInput.type = 'checkbox';
        makeDiv.appendChild(makeInput);
        makeLabel.innerHTML = todos[i].title;
        makeDiv.appendChild(makeLabel);
        var makeNestedButton = document.createElement('button');
        makeNestedButton.className = 'nest';
        makeDiv.appendChild(makeNestedButton);
        makeButton.className = 'destroy';
        makeDiv.appendChild(makeButton);
        makeInputTwo.className = 'edit';
        makeInputTwo.setAttribute('value', todos[i].title);
        makeLi.appendChild(makeInputTwo);

        // Create Nested Ul

        var nestedUl = document.createElement('ul');
        makeLi.appendChild(nestedUl);
        var formatId = makeLi.getAttribute('data-id').toString().replace(/[-]/g, '');
        nestedUl.id = "nestedUlId" + formatId.toString();
        nestedUl.className = 'nestedUlClass';
    
        var parentListId = nestedUl.id;
        var storageUnitNumber = todos[i].id.toString().replace(/[-]/g, '');
        var storageUnitName = 'Storage' + storageUnitNumber;
        
        
        if (util.store(storageUnitName).length >= 1) {
          this.renderNests(parentListId, storageUnitName);
        }
        
      
		  }
      if (todos.length > 0) {
        document.querySelector('#main').style.display = 'block';
      } else {
        document.querySelector('#main').style.display = 'none';
      }			

			document.querySelector('#toggle-all').setAttribute('checked', this.getActiveTodos().length === 0);			
			this.renderFooter();

			document.querySelector('#new-todo').focus();			
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
      var todos = this.getFilteredTodos();

      var footerEl = document.querySelector('footer');
      footerEl.innerHTML = '';
      var activeTodoCount = this.getActiveTodos().length;
      var activeTodoWord = util.pluralize(activeTodoCount, 'item');
      var completedTodos = todoCount - activeTodoCount;
      var filter = this.filter;
  
      var makeSpan = document.createElement('span');
      makeSpan.id = 'todo-count';
      footerEl.appendChild(makeSpan);
      var makeStrong = document.createElement('strong');
      makeSpan.appendChild(makeStrong);
      makeSpan.innerHTML = '<strong>' + activeTodoCount + '</strong>' + ' ' + activeTodoWord;

      var makeUl = document.createElement('ul');
      makeUl.id = 'filters';
      footerEl.appendChild(makeUl);
      var makeLiAll = document.createElement('li');
      makeUl.appendChild(makeLiAll);
      var makeAAll = document.createElement('a');
      makeLiAll.appendChild(makeAAll);
      var makeLiActive = document.createElement('li');
      makeUl.appendChild(makeLiActive);
      var makeAActive = document.createElement('a');
      makeLiActive.appendChild(makeAActive);
      var makeLiCompleted = document.createElement('li');
      makeUl.appendChild(makeLiCompleted);
      var makeACompleted = document.createElement('a');
      makeLiCompleted.appendChild(makeACompleted);
      makeAAll.innerHTML = 'All';
      makeAActive.innerHTML = 'Active';
      makeACompleted.innerHTML = 'Completed';
      makeAAll.href = '#/all';
      makeAActive.href = '#/active';
      makeACompleted.href = '#/completed';
      
      if (todoCount > 0) {
        //document.querySelector('#footer').innerHTML = this.footerTemplateNoHandle();
        document.querySelector('#footer').style.display = 'block';
      } else {
        //document.querySelector('#footer').innerHTML = this.footerTemplateNoHandle()
        document.querySelector('#footer').style.display = 'none';
      };
      
      if (this.getCompletedTodos().length > 0) {
        var makeClearCompletedButton = document.createElement('button');
        footerEl.appendChild(makeClearCompletedButton);
        makeClearCompletedButton.id = 'clear-completed';
        makeClearCompletedButton.innerHTML = 'Clear completed';
      };
      
      if (filter === 'all') {
        makeAAll.className = 'selected';
        return;
      } else if (filter === 'active') {
        makeAActive.className = 'selected';
        return;
      } else if (filter === 'completed') {
        makeACompleted.className = 'selected';
        return;
      };
      
		},
		toggleAll: function (e) {
      var isChecked = e.target.checked;

			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});
      for (var i = 0; i < this.todos.length; i++) {
        var nestedNumber = this.todos[i].id.toString().replace(/[-]/g, '');
        var nestedStorage = 'Storage' + nestedNumber;
        if (util.store(nestedStorage).length >= 1) {
          this.toggleAllNests(nestedStorage, this.todos[i]);
        }
      }

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
      var id = el.closest('li').getAttribute('data-id');
      
			var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
          
				}
			}
		},
		create: function (e) {
      var input = e.target;
      console.log(input);
      var val = document.querySelector('input').value.trim();
      console.log(val);

			if (e.keyCode !== ENTER_KEY || !val) {
				return;
			}

			this.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			});

      document.querySelector('input').value = '';

			this.render();
		},
		toggle: function (e) {
			var i = this.indexFromEl(e.target);
      var currentTodo = this.todos[i];
			this.todos[i].completed = !this.todos[i].completed;
      
      var nestedStorageId = this.todos[i].id.toString().replace(/[-]/g, '');
      var nestedStorageUnit = 'Storage' + nestedStorageId;
      
      if (util.store(nestedStorageUnit).length >= 1) {
        this.toggleAllNests(nestedStorageUnit, this.todos[i]);
      }
      
			this.render();
		},
		edit: function (e) {
      var input1 = e.target.closest('li')
      input1.classList.add('editing');
      var input = input1.querySelector('.edit');
      input.focus();
		},
		editKeyup: function (e) {
			if (e.keyCode === ENTER_KEY) {
				event.target.blur();
			}

			if (e.keyCode === ESCAPE_KEY) {
        e.target.setAttribute('abort', true);
        e.target.blur();
			}
		},
		update: function (e) {
			var el = e.target;
      var el2 = el;
      var val = el2.value.trim();

			if (!val) {
        this.destroy(e);
				return;
			}

      if (el2.getAttribute('abort')) {
        el2.setAttribute('abort', false);
			} else {
        if (el.closest('li').className === 'nestedLi editing') {
          var parentUl = el.closest('ul');
          var storageUnitName = parentUl.id.replace('nestedUlId', 'Storage');
          var todos = util.store(storageUnitName);
          var index = this.indexFromNestedEl(el);
          todos[index].title = val;
          util.store(storageUnitName, todos);
        } else {
          this.todos[this.indexFromEl(el)].title = val;
        }
			}

			this.render();
		},
		destroy: function (e) {
			this.todos.splice(this.indexFromEl(e.target), 1);
			this.render();
		}, 
    createNestedInput: function (e){
      var button = e.target;
      
      // Get the Nested Ul to attach input to
      var parentLi = button.closest('li');
      var formatId = parentLi.getAttribute('data-id').toString().replace(/[-]/g, '');
      var desiredUlId = 'nestedUlId' + formatId;
      var findNestedUl = document.getElementById(desiredUlId);
      
      // Create New Input when Plus Button Is Clicked
      var nestedInput = document.createElement('input');
      findNestedUl.appendChild(nestedInput);
      nestedInput.className = 'new-nested-input';
      nestedInput.placeholder = "What's the next step?";
      nestedInput.autofocus = true;
      var desiredInputId = 'nestedInputId' + formatId;
      nestedInput.id = desiredInputId;
      
      findNestedUl.addEventListener('keyup', function(event) {
        var elementTyped = event.target;
        if (elementTyped.className === 'new-nested-input') {
          this.createStepTodo(event);
        }
      }.bind(this));
      
    },
    createStepTodo: function (e){
      var input = e.target;
      var findId = input.id;
      
      var neededId = '#' + findId;
      
      var val = document.querySelector(neededId).value.trim();

      if (e.keyCode !== ENTER_KEY || !val) {
        return;
      }
      
      var newArrayName = neededId.toString().replace('#nestedInputId', 'nestedArray');
    
      myArraySystem.ourArraySystem(newArrayName, val);

      this.render();

    },
    renderNests: function (parentListId, storageUnitName) {
      var parentUlId = '#' + parentListId;
      var storageUnit = util.store(storageUnitName)
      
      for (var i = 0; i < storageUnit.length; i++) {
        var ulToAttachTo = document.querySelector(parentUlId);
        var nestedLi = document.createElement('li');
        ulToAttachTo.appendChild(nestedLi);
        nestedLi.setAttribute('data-id', storageUnit[i].id);
        nestedLi.id = nestedLi.getAttribute('data-id');
        nestedLi.className = 'nestedLi';
        var nestedDiv = document.createElement('div');
        nestedLi.appendChild(nestedDiv);
        nestedDiv.className = 'view';
        var nestedToggle = document.createElement('input');
        nestedDiv.appendChild(nestedToggle);
        nestedToggle.className = 'nestToggle';
        nestedToggle.type = 'checkbox';
        if (storageUnit[i].completed === true) {
          nestedLi.className += 'completed';
          nestedToggle.setAttribute('checked', '');
        }
        
        var nestedLabel = document.createElement('label');
        nestedDiv.appendChild(nestedLabel);
        nestedLabel.innerHTML = storageUnit[i].title;
        var nestedNestButton = document.createElement('button');
        nestedDiv.appendChild(nestedNestButton);
        nestedNestButton.className = 'nest';
        var nestedDestroy = document.createElement('button');
        nestedDiv.appendChild(nestedDestroy);
        nestedDestroy.className = 'nestDestroy';
        var nestedEditingInput = document.createElement('input');
        nestedLi.appendChild(nestedEditingInput);
        nestedEditingInput.className = 'edit';
        nestedEditingInput.setAttribute('value', storageUnit[i].title);
        var nextNestedUl = document.createElement('ul');
        nestedLi.appendChild(nextNestedUl);
        var parentLiDataId = nestedLi.id.toString().replace(/[-]/g, '');
        nextNestedUl.id = 'nestedUlId' + parentLiDataId;
        nextNestedUl.className = 'nestedUlClass';
        
        var nextStorageUnitNumber = storageUnit[i].id.toString().replace(/[-]/g, '');
        var nextStorageUnitName = 'Storage' + nextStorageUnitNumber;
        var parentListId = nextNestedUl.id;
        var length = util.store(nextStorageUnitName).length;
        
        if (util.store(nextStorageUnitName).length >= 1) {
          this.renderNests(parentListId, nextStorageUnitName);
        } 
        
      }
    },
    indexFromNestedEl: function (el) {
      var parentLi = el.closest('li')
      var id = parentLi.getAttribute('data-id');
      
      var storageUnitName = parentLi.closest('ul').id.toString().replace('nestedUlId', 'Storage');
			var todos = util.store(storageUnitName);
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
          
				}
			}
		},
    destroyNestedTodo: function (e) {
      var clickedElement = e.target;
      var parentLi = clickedElement.closest('li');
      var parentUl = parentLi.closest('ul');
      var storageUnitName = parentUl.id.toString().replace('nestedUlId', 'Storage');
      
      var todos = util.store(storageUnitName);
      todos.splice(this.indexFromNestedEl(e.target), 1);
      util.store(storageUnitName, todos);
			this.render();
		},
    nestToggle: function (e) {
			var i = this.indexFromNestedEl(e.target);
      var clickedElement = e.target;
      var parentLi = clickedElement.closest('li');
      var parentUl = parentLi.closest('ul');
      var storageUnitName = parentUl.id.toString().replace('nestedUlId', 'Storage');
      
      var todos = util.store(storageUnitName);
			todos[i].completed = !todos[i].completed;
      util.store(storageUnitName, todos);
      
      var nestedNumber = todos[i].id.toString().replace(/[-]/g, '');
      var nestedStorage = 'Storage' + nestedNumber;
      if (util.store(nestedStorage).length >= 1) {
        this.toggleAllNests(nestedStorage, todos[i]);
      }
			this.render();
		},
    toggleAllNests: function (storageUnitName, currentTodo) {
      var storageUnit = util.store(storageUnitName);
      for (var i = 0; i < storageUnit.length; i++) {
        if (storageUnit[i].completed !== currentTodo.completed) {
          storageUnit[i].completed = currentTodo.completed;
          util.store(storageUnitName, storageUnit);
        }
        var nestedNumber = storageUnit[i].id.toString().replace(/[-]/g, '');
        var nestedStorage = 'Storage' + nestedNumber;
        if (util.store(nestedStorage).length >= 1) {
          this.toggleAllNests(nestedStorage, storageUnit[i]);
        }
      }
      
    }
	};

	App.init();
