import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;
  auth2: any;

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    //setea el email del localstorage si existe y sino un string vacio
    this.email = localStorage.getItem('email') || '';

    //mantengo el recuerdame si hay mail guardado 
    if (this.email.length > 1) {
      this.recuerdame = true;
    }

  }

  googleInit() {

    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '986417748290-o823uie92buhc92q437dum7iqht4neno.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }


  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {

      
      let token = googleUser.getAuthResponse().id_token;
     

      this.usuarioService.loginGoogle(token).subscribe(response=>{
        this.router.navigate(['/dashboard']);
      });
    });
  }



  ingresar(form: NgForm) {

    //chequeo si el formulario es válido
    if (form.valid) {

      //creo usuario a partir de los datos del formulario (PODRIA TENERLO COMO ATRIBUTO TAMBIEN Y ASI NO CREARLO, MANEJARIA UN USUARIO EN VEZ DE FORMULARIO)
      let usuario = new Usuario(null, form.value.email, form.value.password);

      //ejecuto el login service
      this.usuarioService.login(usuario, form.value.recuerdame)
        .subscribe(response => this.router.navigate(['/dashboard']));
      
    }

  }

}
