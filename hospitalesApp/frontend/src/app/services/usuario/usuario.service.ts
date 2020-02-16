import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];


  constructor(private http: HttpClient, private router: Router, private uploadService: UploadFileService) {
    this.cargarDatosStorage();
  }


  public refreshToken(){
    let end_point = URL_SERVICIOS + '/login/renovartoken';
    end_point+= '?token=' + this.token;

    return this.http.get(end_point).pipe(
      map((response: any)=>{
        this.token = response.token
        localStorage.setItem('token',this.token);
      }),
      catchError(err=>{
        swal('Error al renovar token',err.error.mensaje,'error');
        this.router.navigate(['/login']);
        return throwError(err);
      })
    );
  }

  public logOut() {

    this.router.navigate(['/login']);
    swal('Fin sesion', `Adios ${this.usuario.nombre}, has cerrado sesión`, 'info');

    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
  }

  public estaLogeado(): boolean {
    return this.token.length > 5;
  }

  public cargarDatosStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  public guardarStorage(token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', usuario._id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu))

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }


  //new usuario
  public crearUsuario(usuario: Usuario): Observable<Usuario> {

    let endPoint = URL_SERVICIOS + '/usuario';

    return this.http.post<Usuario>(endPoint, usuario).pipe(
      map((response: any) => {
      swal('Nuevo usuario','usuario creado correctamente','success');
        return response;
      }),
      catchError((err)=>{
        swal(err.error.mensaje,err.error.errors.message,'error');
        return throwError(err);
      })
    );

  }


  public loginGoogle(token: string) {

    let endPoint = URL_SERVICIOS + '/login/google';


    //ejecuto el login google. uso el map para guardarme en el storage los datos del response
    return this.http.post(endPoint, { token }).pipe(
      map((response: any) => {
        //guardo en storage
        this.guardarStorage(response.token, response.usuario, response.menu)
      })
    );

  }


  //login usuario
  public login(usuario: Usuario, recuerdame: boolean) {

    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let endPoint = URL_SERVICIOS + '/login';
    //ejecuto el post de logear usuario, utilizo el map para guardar los datos en el storage y devuelvo igual la response
    return this.http.post(endPoint, usuario).pipe(
      map((response: any) => {
        //guardo en el storage
        this.guardarStorage(response.token, response.usuario, response.menu);
        swal('Ingreso exitoso', `${response.usuario.nombre}, ha iniciado correctamente`, 'success')
        return response;
      }),
      catchError(err => {

        swal('Login error', err.error.mensaje, 'error');
        return throwError(err);
      })

    );

  }


  public actualizar(usuario: Usuario) {


    let endPoint = URL_SERVICIOS + '/usuario/' + usuario._id;
    endPoint += '?token=' + this.token

    return this.http.put(endPoint, usuario).pipe(
      map((response: any) => {

        //chequeo si el usuario que estoy actualizando es el mismo que esta logeado, en caso de que si guardo los nuevos cambios en el storage
        if (usuario._id === this.usuario._id) {
          //guardo storage
          this.guardarStorage(this.token, response.usuario, response.menu);
        }

        swal('Modificacion usuario', `Usuario ${response.usuario.nombre} modificado correctamente`, 'success');
        //devuelvo la response
        return response;
      }),
      catchError(err=>{
        swal(err.error.mensaje,err.error.errors.message,'error');
        return throwError(err);
      })
    );
  }

  public changeImage(file: File, id: string) {

    // llamo al servicio de subir, le mando el archivo, USUARIOS PORQUE ESTOY EN EL USUARIO SERVICE y el id
    this.uploadService.uploadfile(file, 'usuarios', id)
      .then((resp: any) => {

        //si la promesa sale bien seteo la imagen proveniente del upload service al usuario que tengo
        this.usuario.img = resp.usuario.img;
        swal('Imagen actualizada', this.usuario.nombre, 'success');

        //guardo en storage el usuario actualizada
        this.guardarStorage(this.token, this.usuario, this.menu);
      })
      .catch(error => {

      })
  }


  public loadUsers(desde: number = 0) {

    let end_point = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(end_point);

  }


  public findUser(termino: string) {

    let end_point = URL_SERVICIOS + '/busqueda/usuarios/' + termino;

    return this.http.get(end_point)
      .pipe(
        map((response: any) => response.usuarios)
      );


  }

  public deleteUser(id: string) {

    let end_point = URL_SERVICIOS + '/usuario/' + id;
    end_point += '?token=' + this.token;

    return this.http.delete(end_point);

  }
}
