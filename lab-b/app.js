class Todo {

    tasks = [];
    term = '';

    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoList')) || [];
        this.draw();
    }

    get filteredTasks() {
        if (this.term.length < 2) {
            return this.tasks;
        }
        return this.tasks.filter(task => 
            task.text.toLowerCase().includes(this.term.toLowerCase())
        );
    }


    draw() {
        const lista = document.querySelector('#list');
        lista.innerHTML = '';

        this.filteredTasks.forEach((task, index) => {
            const realIndex = this.tasks.indexOf(task);
            const li = document.createElement('li');
            li.dataset.index = realIndex;

            const span=document.createElement('span');
            const small=document.createElement('small');
            const button=document.createElement('button');

            //przygotowanie tekstu z ew podswietleniem
            let tasktodo=task.text;
            if(this.term.length >= 2){
                const regex = new RegExp(`(${this.term})`, 'gi');
                tasktodo = tasktodo.replace(regex, '<mark>$1</mark>');
                span.innerHTML = tasktodo;
            } else {
                span.innerText = tasktodo;
            }
            span.style.cursor='pointer';
            span.onclick=()=> this.edit(realIndex, li);

            //wyświetlenie daty jeśli istnieje
            if(task.date) {
                small.innerText = new Date(task.date).toLocaleString('pl-PL');
                small.style.cursor = 'pointer';
                small.onclick=()=> this.edit(realIndex, li);
            }

            li.appendChild(span);
            li.appendChild(small);
            
            button.innerText='Usuń';
            button.className= 'deletebutton';
            button.onclick=()=>this.remove(realIndex);
            li.appendChild(button);
            
            lista.appendChild(li);

        });
    }

    edit(index, liElement) {
        const task = this.tasks[index];
        liElement.innerHTML = '';

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = task.text;
        textInput.className = 'edit-input';

        const dateInput = document.createElement('input');
        dateInput.type = 'datetime-local';
        dateInput.value = task.date || '';

        liElement.appendChild(textInput);
        liElement.appendChild(dateInput);
        textInput.focus();

        // Funkcja zapisująca
        const saveChanges = () => {
            const newText = textInput.value.trim();
            const newDate = dateInput.value;

            if (newText.length < 3 || newText.length > 255) {
                this.draw();
                return;
            }

            this.tasks[index].text = newText;
            this.tasks[index].date = newDate;
            this.save();
            this.draw();
        };


        let isSaving = false;
        const handleBlur = () => {
            setTimeout(() => {

                if (!liElement.contains(document.activeElement) && !isSaving) {
                    isSaving = true;
                    saveChanges();
                }
            }, 100);
        };

        textInput.onblur = handleBlur;
        dateInput.onblur = handleBlur;

        //Enter zapisuje
        textInput.onkeydown = (e) => {
            if (e.key === 'Enter') saveChanges();
            if (e.key === 'Escape') this.draw(); // Escape anuluje
        };
    }
    add(text, deadline) {
        const now = new Date();
        const sd = new Date(deadline);
        if (text.length < 3 || text.length > 255) return alert("Złą długość tekstu (min 3, max 255 znaków)");
        if (deadline && sd <= now) return alert("Zła data (musi być w przyszłości)");
        this.tasks.push({
            text: text,
            date: deadline
        });
        this.save()
        this.draw()

    }

    remove(index) {
        this.tasks.splice(index, 1);
        this.save()
        this.draw()
    }


    save() {
        localStorage.setItem('todoList', JSON.stringify(this.tasks))
    }

}
const todo=new Todo();
document.getElementById('addButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const text = taskInput.value.trim();
    const deadline = deadlineInput.value;
    
    if (text) {
        todo.add(text, deadline);
        taskInput.value = '';
        deadlineInput.value = '';
    }
});

document.getElementById('searchInput').addEventListener('input', function(e) {
    todo.term = e.target.value;
    todo.draw();
});


