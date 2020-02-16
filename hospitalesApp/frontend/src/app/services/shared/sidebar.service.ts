import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {


  menu: any = [];

  constructor(private userService: UsuarioService) {
  }
  
  public cargarMenu(){
    
    this.menu = this.userService.menu;
  }
}
