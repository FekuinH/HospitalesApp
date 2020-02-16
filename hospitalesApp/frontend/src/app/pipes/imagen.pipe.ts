import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: any, tipo: string = 'usuarios'): any {

    let url = URL_SERVICIOS + "/img";

    //check si mandaron imagen, sino regresa la por defecto
    if (!img) {
      return url += '/usuarios/xxx';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (tipo) {


      case 'usuarios':
        url += '/usuarios/' + img;
        break;

      case 'medicos':
        url += '/medicos/' + img;
        break;

      case 'hospitales':
        url += '/hospitales/' + img;
        break;

      default:
        url += '/usuarios/xxx';
    }


    return url;

  }

}
