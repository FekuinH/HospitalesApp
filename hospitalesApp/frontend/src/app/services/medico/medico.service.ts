import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';

import swal from 'sweetalert2';
import { Medico } from 'src/app/models/medico';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }



  public loadMedics(desde: number = 0) {

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

  public deleteMedic(id: string) {

    let token = localStorage.getItem('token');

    let end_point = URL_SERVICIOS + '/medico/' + id;
    end_point += '?token=' + token;

    return this.http.delete(end_point).pipe(
      map((response: any) => {
        swal('Medico borrado', `${response.medico.nombre} ha sido borrado correctamente`, 'success');
      })
    );
  }

  public guardarMedico(medico: Medico) {

    let token = localStorage.getItem('token');
    let end_point = URL_SERVICIOS + '/medico';
    end_point += '?token=' + token;


    return this.http.post(end_point, medico).pipe(
      map((response: any) => {
        swal('Nuevo medico', `${response.medico.nombre} ha sido creado correctamente`, 'success');
        return response.medico;
      }),
      catchError(err=>{
        swal(err.error.mensaje,err.error.errors.message,'error');
        return throwError(err);
      })
    );
  }

  public findById(id: string) {
    let end_point = URL_SERVICIOS + '/medico/' + id;
    let token = localStorage.getItem('token');
    end_point += '?token=' + token;

    return this.http.get(end_point).pipe(
      map((response: any) => response.medico)
    );
  }

  public actualizarMedico(medico: Medico) {
    let end_point = URL_SERVICIOS + '/medico/' + medico._id
    let token = localStorage.getItem('token');

    end_point += '?token=' + token;

    return this.http.put(end_point,medico).pipe(
      map((response: any)=>{
        swal('Medico actualizado',`${response.medico.nombre} ha sido actualizado`,'success');
        return response;
      }),
      catchError(err=>{
        swal(err.error.mensaje,err.error.errors.message,'error');
        return throwError(err);
      })
    )
  }
}
