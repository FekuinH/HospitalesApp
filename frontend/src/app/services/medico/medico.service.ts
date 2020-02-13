import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }



  public loadMedics(desde: number = 0){

    let end_point = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get(end_point);
  }

  public findMedic(termino: string) {

    let end_point = URL_SERVICIOS + '/busqueda/medicos/' + termino;

    return this.http.get(end_point)
      .pipe(
        map((response: any) => response.medicos)
      );


  }

  public deleteMedic(id: string){

    let token = localStorage.getItem('token');

    let end_point = URL_SERVICIOS + '/medico/' + id;
    end_point += '?token=' + token

    return this.http.delete(end_point).pipe(
      map(response=>{
        swal('Medico borrado','Ha borrado al medico correctamente','success');

        return response;
      })
    );
  }

}
