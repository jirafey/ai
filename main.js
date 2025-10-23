const input = document.getElementById('taskInput');
const list = document.getElementById('myUL');
const addButton = document.getElementById('addBtn');
const searchButton = document.getElementById('searchInput');
const search = document.getElementById('searchInput');

class Todo {
    constructor() {
        const savedTasks = JSON.parse(localStorage.getItem('user'));
        this.tasks = savedTasks || [];
        this.draw(this.tasks);
        this.delegate();
    }

    draw(array) {
        list.innerHTML = '';
        for (const [index, task] of array.entries()) {
            const li = document.createElement('li');
            li.dataset.index = index;

            const textNode = document.createTextNode(task + ' ');
            li.appendChild(textNode);

            const deleteNode = document.createElement('span');
            deleteNode.className = 'delete';
            deleteNode.innerHTML = '❌';
            li.appendChild(deleteNode);
            li.appendChild(document.createTextNode(' '));

            const editNode = document.createElement('span');
            editNode.className = 'edit';
            editNode.innerHTML = '✏️';
            li.appendChild(editNode);

            list.appendChild(li);
        }
    }
    save(){
        localStorage.setItem('user', JSON.stringify(this.tasks));
    }
    add() {
        const taskText = input.value.trim();
        if (taskText.length >= 3 && taskText.length <= 255) {
            this.tasks.push(taskText);
            this.save();
            this.draw(this.tasks);
        }

        input.value = '';
    }
    del(index) {
        this.tasks.splice(index, 1);
        this.save();
        this.draw(this.tasks);
    }
    edit(index, x) {
        this.tasks[index] = x;
        this.save();
        this.draw(this.tasks);
    }
    filterItems(array, query){
        return array.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
    }
    search(searchTerm) {
        const tempTasks = this.filterItems(this.tasks, searchTerm);
        this.draw(tempTasks);
        if (!searchTerm) {
            this.draw(this.tasks);
        }
    }
    delegate() {
        const t = document.getElementById('myUL');

        t.onclick = (event) => {
            const clickedElement = event.target;
            const listItem = clickedElement.closest('li');
            if (!listItem) return; 
            const index = listItem.dataset.index;

            if (clickedElement.classList.contains('delete')) {
                this.del(index);
            }
            else  {
                const oldText = this.tasks[index];
                let newText = prompt("Change name of the task", oldText);
                if (newText === null){
                    return;
                }
                newText = newText.trim();

                if (newText.length < 3 || newText.length > 255) {
                    alert("Task has to be between 3 and 255 characters");
                    return;
                }
                this.edit(index, newText);
            }
        }
    }
}

const myTodo = new Todo();
addButton.addEventListener("click", () => {
    myTodo.add();
});
searchButton.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    myTodo.search(searchTerm);
});
