import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: UsuarioService, private router: Router) { }

  canActivate() {

    if (this.userService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      swal('Acceso prohibido','Por favor inicie sesión con una cuenta ADMIN para acceder a la ruta','warning');
      this.userService.logOut();
      this.router.navigate(['/login']);
      return false;
    }


  }

}
