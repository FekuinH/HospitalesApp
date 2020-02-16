import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital } from 'src/app/models/hospital';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }


  //list hospital
  public getHospitals(desde: number = 0): Observable<Hospital[]> {

    let end_point = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get<Hospital[]>(end_point);
  }

  public findHospitalBy(term: string) {

    let end_point = URL_SERVICIOS + '/busqueda/hospitales/' + term;

    return this.http.get(end_point);

  }

  public createHospital(nombre: string): Observable<Hospital> {

    let newHospital = new Hospital(nombre);

    let token = localStorage.getItem('token');

    let end_point = URL_SERVICIOS + '/hospital?token=' + token;

    return this.http.post<Hospital>(end_point,newHospital);
  }

  public actualizar(hospital: Hospital){

    let endPoint = URL_SERVICIOS + '/hospital/' + hospital._id;
    let token = localStorage.getItem('token');
    endPoint += '?token=' + token


    // let id = hospital._id;
    // let end_point = URL_SERVICIOS + `/hospital/${id}?token=${token}`;

    return this.http.put(endPoint,hospital).pipe(
      map((response: any)=>{

        swal('Modificacion hospital',`${response.hospital.nombre} modificado correctamente`,'success')
        return response;
      })

    );
  }

  public delete(id:number){

    let token = localStorage.getItem('token');

    let end_point = URL_SERVICIOS + `/hospital/${id}?token=${token}`;

    return this.http.delete(end_point);
  }

  public findById(id: string){
    let end_point = URL_SERVICIOS + '/hospital/' + id;
    
    return this.http.get(end_point).pipe(
      map((response: any)=>{
        return response.hospital;
      })
    );
  }

}
