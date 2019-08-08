import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-errores',
  templateUrl: './errores.component.html'
})
export class ErroresComponent  {
  @Input() texto: string;
  constructor() { }
}
