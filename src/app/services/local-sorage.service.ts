import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalSorageService {

  storage: Storage;

  constructor() {
    this.storage = window.localStorage;
   }

   set(key: string, value:string): void{
     this.storage[key]=value;
   }
   get(key:string):string{
     return this.storage[key] || false;
   }
   setObject(key:string, value:any): void{
     if(!value){
       return;
     }
     this.storage[key] = JSON.stringify(value);
    }
   getObject(key:string): any{
     return JSON.parse(this.storage[key] || '{}');
   }
   getValue<T>(key:string){
    const obj = JSON.parse(this.storage[key] || null);
    return <T>obj || null;
   }
   remote(key:string): void{
     this.storage.removeItem(key);
   }
   clear():void{
     this.storage.clear();
   }
   get getLength(): number{
     return this.storage.length;
   }
   get isStorageEmpty(): boolean{
     return this.storage.length == 0;
   }
} 
