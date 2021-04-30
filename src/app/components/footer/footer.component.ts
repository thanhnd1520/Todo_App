import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Button } from 'selenium-webdriver';
import { Filter, FilterButton } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  filterButtons: FilterButton[] = [
    {type: Filter.All, laber: 'All', isActive: true},
    {type: Filter.Active, laber: 'Active', isActive: false},
    {type: Filter.Complete, laber: 'Completed', isActive: false}
  ];

  length = 0; 
  hasCompleted$: Observable<boolean>;
  destroy$:Subject<null> = new Subject<null>();

  constructor(private todoService: TodoService) { }

  ngOnInit(){
    this.hasCompleted$ = this.todoService.todos$.pipe(
      map(todos => todos.some(t => t.isCompleted)),
      takeUntil(this.destroy$)
    );

    this.todoService.length$.pipe(takeUntil(this.destroy$)).subscribe(length => {
      this.length =length;
    })
  }
  
  filter(type: Filter){
    this.setActiveFilterBtn(type);
    this.todoService.filterTodos(type);
  }

  clearCompleted(){
    this.todoService.clearCompleted();
  }

  private setActiveFilterBtn(type: Filter){
    this.filterButtons.forEach(btn => {
      btn.isActive = btn.type === type;
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
