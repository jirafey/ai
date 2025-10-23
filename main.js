const input = document.getElementById('taskInput');
const list = document.getElementById('myUL');
const addButton = document.getElementById('addBtn');

class Todo {
    constructor() {
        const savedTasks = JSON.parse(localStorage.getItem('user'));
        this.tasks = savedTasks || [];
        this.draw();
        this.delegate();
    }

    draw() {
        list.innerHTML = '';
        for (const [index, task] of this.tasks.entries()){
            const li = document.createElement('li');
            li.dataset.index = index;

            const textNode = document.createTextNode(task + ' ');
            li.appendChild(textNode);

            const deleteNode = document.createElement('span');
            deleteNode.className = 'delete';
            deleteNode.innerHTML ='❌';
            li.appendChild(deleteNode);
            li.appendChild(document.createTextNode(' '));

            const editNode = document.createElement('span');
            editNode.className = 'edit';
            editNode.innerHTML = '✏️';
            li.appendChild(editNode);
            
            list.appendChild(li);
        }
    }
    add() {
        const taskText = input.value.trim();
        if (taskText) {
            this.tasks.push(taskText);
            localStorage.setItem('user', JSON.stringify(this.tasks));
            this.draw();
        }

        input.value = '';
    }
    del(index) {
        this.tasks.splice(index, 1);
        this.draw();
    }
    edit(index, x) {
        this.tasks[index]=x;
        this.draw();
    }
    delegate(){
        const t = document.getElementById('myUL');

        t.onclick = (event) =>  {
            const clickedElement = event.target;
            const listItem = clickedElement.closest('li');
            
            if (clickedElement.classList.contains('delete')) {
                const index = listItem.dataset.index;
                this.del(index);
            }
            else if(clickedElement.classList.contains('edit')) {
                const index = listItem.dataset.index;
                const editPrompt = prompt("change name of the task");
                this.edit(index, editPrompt);
            }
            else  {
                return;
            }
        }
    }
}

const myTodo = new Todo();
addButton.addEventListener("click", () => {
    myTodo.add();
});

