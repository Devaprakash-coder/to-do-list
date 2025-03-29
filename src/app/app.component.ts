import { Component } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule,FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {CdkDrag,DragDropModule,CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-root',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,CdkDrag,DragDropModule,CdkDropList],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'to-do-list';
  todoList:any[]=[];
  taskForm: FormGroup;
  constructor(private fb:FormBuilder){
    this.taskForm = this.fb.group({
      taskName: ['',[Validators.required]],
      done:[false],
      oldIndex:['']
    })
  }

  ngOnInit(){
    this.setStoredValue();
  }

  setStoredValue(){
    let localValue = localStorage.getItem('todoList');
    this.todoList = localValue ? JSON.parse(localValue) : []
  }

  deleteTask(i:number){
    this.todoList.splice(i,1)
    this.setToLocal()
  }

  addTask(){
    if(this.taskForm.invalid){
      let button = document.getElementsByClassName('btn')[0];
      button.classList.add('invalid')
      button.addEventListener('animationend',()=>{
        button.classList.remove('invalid');
      },{ once: true })
      return
    }
      this.todoList.push(this.taskForm.value);
      this.setToLocal()
      this.taskForm.reset();
  }

  // taskComplete(task:any,index:number){
  //   task.done = !task.done;
  //   if(task.done){
  //     task.oldIndex = index;
  //     this.todoList.splice(index,1)
  //     this.todoList.push(task)
  //   }else{
  //     this.todoList.splice(index,1);
  //     this.todoList.splice(task.oldIndex,0,task)
  //   }
  //   this.setToLocal()
  // }

  taskComplete(task: any, index: number) {
    task.slideOut = true;  
    setTimeout(() => {
      task.done = !task.done;
      task.slideOut = false;
      if (task.done) {
        task.oldIndex = index;
        this.todoList.splice(index, 1);
        this.todoList.push(task);
      } else {
        this.todoList.splice(index, 1);
        this.todoList.splice(task.oldIndex, 0, task);
      }
      this.setToLocal();
    }, 500);
  }
  

  setToLocal(){
    localStorage.setItem('todoList',JSON.stringify(this.todoList))
  }

  drop(event:any){
    moveItemInArray(this.todoList,event.previousIndex,event.currentIndex);
  }

}
