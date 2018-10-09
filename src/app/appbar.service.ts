import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppbarService {

  title: String = '';

  constructor() { }

  setTitle(newTitle: string) {
    this.title = newTitle;
  }
}
