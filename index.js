class Item {
  constructor(id, text) {
    this.id = id,
    this.text = text
  }
}
class TodoItem extends Item {
  constructor(id, text, completed = false) {
    super(id, text),
    this.completed = completed
  }
}
class createDOM {
  query(selector) {
    return document.querySelector(selector)
  }
  
  createEl(type, textContent, ...classNames) {
    const item = document.createElement(type)
    item.textContent = textContent
    item.classList.add(...classNames)
    return item
  }
}

class LocalStorage {
  #keyName;
  constructor(keyName) {
    this.#keyName = keyName
  }
  
  GetItems() {
    const items = localStorage.getItem(this.#keyName)
    return items ? JSON.parse(items) : []
  }
  
  SetItems(itemsList) {
    localStorage.setItem(this.#keyName, JSON.stringify(itemsList))
  }
}
class TodoApp {
  constructor() {
    this.todosStorage = new LocalStorage('todos')
    this.todoList = this.todosStorage.GetItems()
    
    this.dom = new createDOM()
    this.todoInput = this.dom.query('[data-add-todo-input]')
    this.todoContainer = this.dom.query('[data-todos-container]')
    
    this.bindEvents()
    this.render()
  }
  
  bindEvents() {
    this.todoInput.addEventListener('keypress', (e) => {
      if(e.key === 'Enter' && e.target.value.trim()) {
        this.addTodo(e.target.value.trim())
        this.todoInput.value = ''
      }
    })
    
    this.todoContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) {
        const id = Number(e.target.dataset.id)
        this.removeTodo(id)
      }
      else if (e.target.classList.contains('todo-item')) {
        const id = Number(e.target.dataset.id)
        this.toggleTodo(id)
      }
    })
  }
  
  render() {
    this.todoContainer.innerHTML = ''
    
    this.todoList.forEach(todo => {
      const todoItem = this.dom.createEl('div', '', 'todo-item', todo.completed ? 'completed' : undefined)
      todoItem.dataset.id = todo.id
      const todoItemText = this.dom.createEl('span', todo.text)
      
      this.todoContainer.appendChild(todoItem)
      todoItem.appendChild(todoItemText)
      
      const removeBtn = this.dom.createEl('button', 'Удалить', 'remove-btn')
      removeBtn.dataset.id = todo.id
      removeBtn.disabled = !todo.completed
      
      todoItem.appendChild(removeBtn)
    })
  }
  
  addTodo(textInputValue) {
    const newTodo = new TodoItem(Date.now(), textInputValue, false)
    this.todoList.push(newTodo)
    this.todosStorage.SetItems(this.todoList)
    
    this.render()
  }
  
  removeTodo(id) {
    this.todoList = this.todoList.filter(todo => todo.id !== id)
    this.todosStorage.SetItems(this.todoList)
    this.render()
  }
  
  toggleTodo(id) {
    const todo = this.todoList.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
      this.todosStorage.SetItems(this.todoList)
      this.render()
    }
  }
  
}
new TodoApp()