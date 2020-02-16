import { Injectable, EventEmitter } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {


  public tipo: string;
  public id: string;
  public modal: boolean;


  constructor() {
    this.modal = false;;
  }




  uploadfile = function (file: File, tipo: string, id: string) {

    let endPoint = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

    return new Promise((resolve, reject) => {

      //payload que se quiero mandar a la peticion por ajax
      let formData = new FormData();

      //peticion AJAX
      let xhr = new XMLHttpRequest();

      //config formData
      formData.append('imagen', file, file.name);

      //config XMLREQUEST
      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {

          //ya se subio
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            //fallo la subida de imagen
            reject(JSON.parse(xhr.response));
          }

        }

      };


      xhr.open('PUT', endPoint, true);
      xhr.send(formData);

    });


  }




}
