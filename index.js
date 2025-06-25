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
class TodoApp {
  constructor() {
    this.todoList = []
    
    this.dom = new createDOM()
    this.todoInput = this.dom.query('[data-add-todo-input]')
    this.todoContainer = this.dom.query('[data-todos-container]')
    
    this.bindEvents()
    this.render()
  }
  
  addTodo(textInputValue) {
    const newTodo = new TodoItem(Date.now(), textInputValue, false)
    this.todoList.push(newTodo)
    this.render()
    
  }
  
  bindEvents() {
    this.todoInput.addEventListener('keypress', (e) => {
      if(e.key === 'Enter' && e.target.value.trim()) {
        this.addTodo(e.target.value.trim())
        this.todoInput.value = ''
      }
    })
  }
  
  render() {
    this.todoContainer.innerHTML = ''
    
    this.todoList.forEach(todo => {
      const todoItem = this.dom.createEl('div', todo.text, 'todo-item')
      todoItem.dataset.id = todo.id
      
      this.todoContainer.appendChild(todoItem)
      
      const removeBtn = this.dom.createEl('button', 'Удалить', 'remove-btn')
      removeBtn.dataset.id = todo.id
      removeBtn.disabled = !todo.completed
      
      todoItem.appendChild(removeBtn)
    })
  }
  
}
new TodoApp()