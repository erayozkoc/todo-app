const StorageController = (function () {
    return{
        tasks:function(newTask){
            let taskList;
            if(localStorage.getItem('taskList')===null){
                taskList = []; 
                taskList.push(newTask);
            }
            else{
                taskList = JSON.parse(localStorage.getItem('taskList'));
                taskList.push(newTask);
            }
           localStorage.setItem('taskList',JSON.stringify(taskList));
        },
        getTasks:function(){
            let tasks = [];
            if(localStorage.getItem ('taskList')!==null){
                tasks = JSON.parse(localStorage.getItem('taskList'));
            }
            return tasks;
        },
        deleteTask:function(id){
            let taskList = JSON.parse(localStorage.getItem('taskList'));

            taskList.forEach(function(task,index){
                if(id == task.id){
                    taskList.splice(index,1);
                }
            });
            localStorage.setItem('taskList',JSON.stringify(taskList));

        },
        updateStatus:function(items){
            localStorage.setItem("taskList", JSON.stringify(items));
        }
        

    }

})();



const TodoController = (function () {
    const Task = function (id, name,date,status) {
        this.id = id;
        this.name = name;
        this.date =date;
        this.status = status;
      
 
    }
    const taskList =StorageController.getTasks();
    return{
        getTaskList:function(){
            return taskList;

        },
        dateFormat:function(){
            const date = new Date(Date.now());
            const options = { weekday: 'long', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-GB',options);
        },
        addTask:function(name){
         

            let id;

            if (taskList.length > 0) {
                id = taskList[taskList.length - 1].id + 1;
            } else {
                id = 0;
            }

            const newTask = new Task(id,name,this.dateFormat(),"pending");
            taskList.push(newTask);

            return newTask;

        },
        deleteTask:function(id){
            taskList.forEach(function(item,index){
                if(id ==item.id){
                    taskList.splice(index,1);
                }
            })
            
        }
    }

})();

const UIController = (function () {
    const Selectors = {
        taskText:'#txttask',
        addBtn:'#btnAdd',
        item:'#item',
        taskList:'#taskList',
        filters:'.filters span'


        
        
    }
    return{
        displayList: function (filter) {
            const items = TodoController.getTaskList();

            let html ="";
            items.forEach(item => {
         

                let completed = item.status == "completed" ? "checked": "";
                if (filter == item.status || filter == "all") {
            
                 html += `
                    <li class="list-group-item d-flex align-items-center justify-content-between task" id="${item.id}">
                        <div class="form-check">
                            <input class="form-check-input checkbox"  type="checkbox" id="${item.id}" ${completed} >
                            <label class="form-check-label mx-5 ${completed}">
                              ${item.name} 
                            </label>
                          </div>
                        <div class="date">${item.date}<span><i id="${item.id}"class="fa fa-close delete"></i></span></div>
                    </li>
                  
                        `;}
            }
                
                )
    
                document.querySelector(Selectors.taskList).innerHTML = html;
                
                    
        
        },
        getSelectors:function(){
            return Selectors;
            
        },
     
        addTask:function(newTask){

           
         
            let completed = newTask.status == "completed" ? "checked": "";
        
    var item  = `
        <li class="list-group-item d-flex align-items-center justify-content-between task" id="${newTask.id}">
            <div class="form-check">
                <input class="form-check-input checkbox"  type="checkbox" id="${newTask.id}" ${completed} >
                <label class="form-check-label mx-5 ${completed}">
                  ${newTask.name} 
                </label>
              </div>
            <div class="date">${newTask.date}<span><i id="${newTask.id}"class="fa fa-close delete"></i></span></div>
        </li>
      
            `;
        
            document.querySelector(Selectors.taskList).insertAdjacentHTML('beforeend',item);


        },
        deleteTask:function(id){
            let parent = document.querySelector(Selectors.taskList);
            for (let i = 0; i < parent.children.length; i++) {
                if(id == parent.children[i].id){
                    parent.children[i].remove();
                }
            }
          
        },
        inputClear:function(){
          document.querySelector(Selectors.taskText).value ="";
        },
       
 
      
      
       
    }

})();

const AppController = (function (UICtrl,TodoCtrl,StorageCtrl) {
    const UISelectors = UICtrl.getSelectors();

        // Load Event Listeners
      const loadEventListeners = function () {
       // add task event
        document.querySelector(UISelectors.addBtn).addEventListener('click', taskAddSubmit);
        document.querySelector(UISelectors.taskList).addEventListener('click',taskProcess);
        }
        const filters = function(){
            const filters = document.querySelectorAll(UISelectors.filters);
            for(let span of filters) {
                span.addEventListener("click", function() {
                    document.querySelector("span.active").classList.remove("active");
                    span.classList.add("active");
                    UICtrl.displayList(span.id);
               

                    
         
            
                })
            }
        }
        const taskAddSubmit = function (e) {
            const taskName = document.querySelector(UISelectors.taskText).value;
            if(taskName !=""){
                const newTask = TodoCtrl.addTask(taskName);
                UICtrl.addTask(newTask);
                StorageCtrl.tasks(newTask);
        
            }
            else{
                alert("Bu alan Boş Bırakılamaz")
            }
           
            UIController.inputClear();
           
  
         e.preventDefault();
          
        }
        const taskProcess = function(e){
            if(e.target.classList.contains("delete")){
                let id= e.target.id;
                 TodoCtrl.deleteTask(id);
                UICtrl.deleteTask(id);
                StorageCtrl.deleteTask(id);
            }
            else if(e.target.classList.contains("checkbox")){
                const element = e.target;
                let label = element.nextElementSibling;
                let status;
                if(element.checked){
                    label.classList.add("checked");
                    status = "completed";
                }
                else {
                    label.classList.remove("checked");
                    status = "pending";
                }
                const items =  TodoCtrl.getTaskList();
                for(let item of items){
                   if(element.id == item.id){
                     item.status = status;
                   }
                }

                StorageCtrl.updateStatus(items);
               

            }
        }
      
    return{
        init:function(){
               // load event listeners
               loadEventListeners();
               filters();
               UIController.displayList('all');
              
              
    

       

        },
      
    }

})(UIController,TodoController,StorageController);
AppController.init();

