const input = document.getElementById('taskInput');
const calendarInput = document.getElementById('calendarInput');
const list = document.getElementById('myUL');
const addButton = document.getElementById('addBtn');
const searchButton = document.getElementById('searchInput');


class Todo {
    constructor() {
        try {
            const savedTasks = JSON.parse(localStorage.getItem('user'));
            this.tasks = Array.isArray(savedTasks) ? savedTasks : [];
        } catch (error) {
            console.error("Could not parse tasks from local storage. Starting fresh.", error);
            this.tasks = [];
        }
        this.draw(this.tasks);
        this.delegate();
        this.listenForChanges();
    }
    listenForChanges(){
        list.addEventListener('change',  (event) =>{
            const target = event.target;
            const listItem = target.closest('li');
            if (!listItem) return;
            const index = listItem.dataset.index;

            if (target.classList.contains('calendar')) {
                const listItem = target.closest('li');
                const newDate = target.value;

                this.tasks[index].date = newDate;
                this.save();
            }
            if (target.classList.contains('task-checkbox')){
                const isCompleted = target.checked;
                this.tasks[index].completed = isCompleted;
                this.save();
                this.draw(this.tasks);
            }
        });
    }
    draw(array, searchTerm = '') {
        list.innerHTML = '';
        for (const [index, task] of array.entries()) {
            const li = document.createElement('li');
            li.dataset.index = index;

            if (task.completed) {
                li.classList.add('completed-task');
            }
            const checkBoxNode = document.createElement('input');
            checkBoxNode.type = 'checkbox';
            checkBoxNode.className = 'task-checkbox';
            checkBoxNode.checked = task.completed;
            li.appendChild(checkBoxNode);
            li.appendChild(document.createTextNode(' '));

            // --- CORRECTED LOGIC STRUCTURE ---
            // This if/else block is ONLY responsible for the task text.
            if (searchTerm) {
                const regex = new RegExp(searchTerm, 'gi');
                const highlightedText = task.text.replace(regex, (match) => `<mark>${match}</mark>`);
                const textSpan = document.createElement('span');
                textSpan.innerHTML = highlightedText;
                li.appendChild(textSpan);
            } else {
                const textNode = document.createTextNode(task.text);
                li.appendChild(textNode);
            }
            
            // FIX #2: All these elements are now OUTSIDE the else block, so they
            // will always be created, whether you are searching or not.
            li.appendChild(document.createTextNode(' '));

            const calendarNode = document.createElement('input');
            calendarNode.className = 'calendar';
            calendarNode.type = 'date';
            if (task.date) {
                calendarNode.value = task.date;
            }
            li.appendChild(calendarNode);
            li.appendChild(document.createTextNode(' '));

            const deleteNode = document.createElement('span');
            deleteNode.className = 'delete';
            deleteNode.innerHTML = '❌';
            li.appendChild(deleteNode);
            li.appendChild(document.createTextNode(' '));

            const editNode = document.createElement('span');
            editNode.className = 'edit';
            editNode.innerHTML = '✏️';
            li.appendChild(editNode);

            // The 'li' is now always appended at the end.
            list.appendChild(li);
        }
    }
    save(){
        localStorage.setItem('user', JSON.stringify(this.tasks));
    }
    add() {
        const taskText = input.value.trim();
        const calendarText = calendarInput.value;

        if (taskText.length >= 3 && taskText.length <= 255 
            && this.isValidDate(calendarText)) {

            this.tasks.push({text: taskText, date:calendarText, completed:false});
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
        this.tasks[index].text = x;
        this.save();
        this.draw(this.tasks);
    }
    filterItems(array, query){
        return array.filter((el) => el.text.toLowerCase().includes(query.toLowerCase()));
    }
    search(searchTerm) {
        
        const tempTasks = this.filterItems(this.tasks, searchTerm);
        this.draw(tempTasks, searchTerm);
        if (!searchTerm) {
            this.draw(this.tasks);
        }
    }

    delegateEditHelper(index){
        const oldText = this.tasks[index].text;
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
    isValidDate(dateString){
        if (!dateString){
            return true;
        }
        const today = new Date();
        today.setHours(0,0,0,0);
        const userSelectedDate = new Date(dateString + 'T00:00');
        return userSelectedDate >=today;
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
            else if (clickedElement.classList.contains('calendar')){
                return;
            }
            else if (clickedElement.classList.contains('edit')){
                this.delegateEditHelper(index);
            }
            
            else if (clickedElement.classList.contains('task-checkbox')) {
                return;
            }
            else {
                this.delegateEditHelper(index);
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
