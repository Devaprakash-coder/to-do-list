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
    this.todoList.push(this.taskForm.value);
    // this.taskForm.reset();
    this.setToLocal()
    console.log("TodoList",this.todoList)
  }

  taskComplete(task:any,index:number){
    task.done = !task.done;
    if(task.done){
      task.oldIndex = index;
      this.todoList.splice(index,1)
      this.todoList.push(task)
    }else{
      this.todoList.splice(index,1);
      this.todoList.splice(task.oldIndex,0,task)
    }
    this.setToLocal()
  }

  setToLocal(){
    localStorage.setItem('todoList',JSON.stringify(this.todoList))
  }

  drop(event:any){
    console.log("event",event)
    moveItemInArray(this.todoList,event.previousIndex,event.currentIndex);
  }

}
