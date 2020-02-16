import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from 'src/app/services/service.index';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;
  constructor(private sideBar: SidebarService, private usuarioService: UsuarioService) { }

  ngOnInit() {

    this.usuario = this.usuarioService.usuario;
    this.sideBar.cargarMenu();
  }

}
