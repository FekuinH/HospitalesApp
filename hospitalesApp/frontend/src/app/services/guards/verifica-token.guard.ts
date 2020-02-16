import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) { }
  canActivate(): Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Token Guard')

    let token = this.usuarioService.token;
    //recuperar informacion del token
    let payload = JSON.parse(atob(token.split('.')[1]))

    if (this.isExpired(payload.exp)) {
      this.router.navigate(['/login']);
      return false
    }





    return this.willExpire(payload.exp);
  }




  public willExpire(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

      //fecha de exp en milisegundos
      let tokenExp = new Date(fechaExp * 1000);

      let timeNow = new Date();

      timeNow.setTime(timeNow.getTime() + (4 * 60 * 60 * 1000))

      if (tokenExp.getTime() > timeNow.getTime()) {
        resolve(true);
      } else {
        this.usuarioService.refreshToken()
          .subscribe(()=>{
            resolve(true)
          },()=>{
            this.router.navigate(['/login']);
            reject(false)
          })
      }

    })
  }
  public isExpired(fechaExp: number): boolean {

    //obtener hora actual
    let timeNow = new Date().getTime() / 1000;

    return fechaExp < timeNow;
  }

}