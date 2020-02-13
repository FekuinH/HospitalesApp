import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  //interface que contiene el tema actual y la ruta del tema actual
  ajustes: Ajustes = {
    temaUrl: "assets/css/colors/default.css",
    tema: "default"
  }

  constructor() {this.cargarAjustes(); }

  //setea las configuraciones actuales en el localstorage
  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  //si existen ajustes los guarda en la interface que los contiene
  cargarAjustes() {

    if (localStorage.getItem('ajustes')) {
      console.log('cargando ajustes del storage');
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      
      this.aplicarTema(this.ajustes.tema);
    }else{
      console.log('usando valores por defecto');
    }
  }

  aplicarTema(tema:string){
     //obtengo el elemento que contiene el tema
     let elemento = document.getElementById('tema');
     //creo la url con el color del tema nuevo
     let url = `assets/css/colors/${tema}.css`
     //seteo al elemento la nueva direccion 
     elemento.setAttribute('href', url);
 
     // seteo al servicio de ajustes el nuevo color y nueva ruta
     this.ajustes.tema = tema;
     this.ajustes.temaUrl = url;
     //guardo los cambios en el local storage
     this.guardarAjustes();
  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
