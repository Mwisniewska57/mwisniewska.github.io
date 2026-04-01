
class Todo{

    tasks=['spac','nic nie robic','podgladac sasiada'];
    draw(){
        const t=document.querySelector('.przycisk-usuwania')
        t.remove();
        document.getElementById('list').innerHTML = '';
        for (let i = 0; i < this.tasks.length; i++) {
            let element = document.createElement('li');
            element.innerText = this.tasks[i] + " ";
            let clone =t.cloneNode(true);
            let btn=clone.querySelector('button');
            btn.onclick=()=>{
                this.tasks.splice(i,1);
                this.draw();
            };
            element.appendChild(clone);
            document.getElementById('list').appendChild(element);
        }

    }

}
const mojalista=new Todo();

