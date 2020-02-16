import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Hospital } from 'src/app/models/hospital';
import { Medico } from 'src/app/models/medico';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(parametros => {
      let termino = parametros['termino'];
      this.buscar(termino);
    });
  }


  buscar(termino: string) {
    let end_point = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.http.get(end_point)
      .subscribe((response: any) => {
        this.hospitales = response.hospitales;
        this.usuarios = response.usuarios;
        this.medicos = response.medicos;
      });
  }

}
