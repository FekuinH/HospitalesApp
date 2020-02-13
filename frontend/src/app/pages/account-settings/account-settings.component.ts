import { Component, OnInit, ElementRef } from '@angular/core';
import { SettingsService } from 'src/app/services/service.index';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor(private settingService: SettingsService) { }

  ngOnInit() {
    this.colocarCheck();
  }

  //recibo color nuevo y link al cual se lo voy a aplicar
  cambiarColor(tema: string, link: ElementRef) {
    this.aplicarCheck(link)
    //servicio encargado de guardar los temas en el local storage y aplicar cambios
    this.settingService.aplicarTema(tema);
  }

  // recibo link 
  aplicarCheck(link: any) {
    // obtengo lista de elementos que contengan la clase selector
    let listaLinks: any = document.getElementsByClassName('selector');
    //recorro la lista y le quito la clase deseada
    for (let link of listaLinks) {
      link.classList.remove('working');
    }
    //le agrego la clase deseada al link actual
    link.classList.add('working');

  }

  colocarCheck() {
    // obtengo lista de elementos que contengan la clase selector
    let listaLinks: any = document.getElementsByClassName('selector');

    //obtengo tema actual
    let tema = this.settingService.ajustes.tema;

    // reccorro la lista y le quito la clase
    for (let link of listaLinks) {
      link.classList.remove('working');
    }

    //recorro y pregunto si el atributo data theme es igual al tema
    for (let link of listaLinks) {
      // en caso de ser igual le pongo el check
      if (link.getAttribute('data-theme') === tema) {
        link.classList.add('working');
        break;
      }
    };
  }
}



