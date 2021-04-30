import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService } from './services/todo.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'todo-app';
  hasTodo$: Observable<boolean>; // kiem tra xem co todo nao khong

  constructor(private todoService: TodoService){}

  ngOnInit(){
    this.todoService.fetchFromLocalStorage();
    this.hasTodo$ = this.todoService.length$.pipe(map(length => length > 0));
  }
}
