class Todo {
    constructor() {
        this.tasks = [];
        this.draw();
        this.add();
        this.del();
    }

    draw() {}
    add() {
        // let li = document.createElement("li");
        // let inputValue=document.getElementById("input1").value;
        // li.textContent=inputValue;
        // document.getElementById("myUL").appendChild(li);
        for (i=0; i<tasks.length; i++){
            this.tasks[i]=(input1.value);
        }
    }
    del() {}
    edit(x) {}
}

const myTodo = new Todo();
document.getElementById("addBtn").addEventListener("click", () => {
    myTodo.add();
});
let userArray = ["a", 25];
localStorage.setItem('user', JSON.stringify(userArray));

let userData = JSON.parse(localStorage.getItem('user'));
console.log(userData); // ["a", 25]



// let savedInput = JSON.parse(localStorage.getItem('user2'));
// console.log(savedInput);

// let input = prompt("input your data");
// const userData3 = JSON.parse(localStorage.getItem('user2'));
// console.log(userData3); // input
// localStorage.setItem('user2', JSON.stringify(input));
// const userData2 = JSON.parse(localStorage.getItem('user2'));
// console.log(userData2); // input

let tasks = [];
tasks.append("a");