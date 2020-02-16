import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  canActivate() {

    //check si esta logeado, en caso de que no redirige a la pantalla login
    if (!this.usuarioService.estaLogeado()) {
      this.router.navigate(['/login']);
      swal('Acceso denegado', 'Por favor inicie sesión', 'warning');
    }
    return this.usuarioService.estaLogeado();
  }
}