import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filtering.model';
import { Todo } from '../models/todo.model';
import { LocalSorageService } from './local-sorage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly TodoStorageKey = 'todo';
  private todos: Todo[];
  private filteredTodos: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalSorageService) { }

  fetchFromLocalStorage(){
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos.map(todo => ({...todo}))]; //cloneDeep cua lodash
    this.updateTodoData();
  }

  
  updateToLocalStorage(){
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodoData();
  }
  
  addTodo(content: string){
    const date = new Date(Date.now()).getTime();
    const newTodo = new Todo(date, content);
    this.todos.unshift(newTodo); // su dung unshift để thêm newTodo lên đầu todoList,
                                 // su dung push thêm newTodo vao cuoi todoList
    
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean){ // thay doi trang thai isCompeleted cua todo de thay dau checkbox
    const index = this.todos.findIndex(t => t.id = id);
    const todo = this.todos[index];
    todo.isCompleted = isCompleted;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
    //console.log(1);
  }

  editTodo(id:number, content: string){
    const index = this.todos.findIndex(t => t.id = id);
    const todo = this.todos[index];
    todo.content = content;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  deleteTodo(id: number){
    const index = this.todos.findIndex(t => t.id = id);
    const todo = this.todos[index];
    this.todos.splice(index, 1);
    this.updateToLocalStorage();
  }

  clearCompleted(){
    this.todos = this.todos.filter(todo => !todo.isCompleted);
    this.updateToLocalStorage();
  }

  toggleAll(){
    this.todos = this.todos.map(todo => {
      return{
        ...todo,
        isCompleted: !this.todos.every(t => t.isCompleted)
      };
    });
    this.updateToLocalStorage();
  }

  private updateTodoData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }

  filterTodos(filter: Filter, isFiltering: boolean = true){
    this.currentFilter = filter;
    switch(filter){
      case Filter.Active:
        this.filteredTodos = this.todos.filter(todo =>  !todo.isCompleted);
        break;
      case Filter.Complete:
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos =[...this.todos.map(todo => ({...todo}))];
        break;
    }

    if(isFiltering){
      this.updateTodoData();
    }
  }
}
