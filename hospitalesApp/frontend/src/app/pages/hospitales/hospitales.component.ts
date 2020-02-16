import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { ModalUploadService } from 'src/app/services/modal-upload/modal-upload.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {


  public hospitalesList: Hospital[] = [];
  public loading: boolean = true;
  public totalRegistros: number;
  public desde: number = 0;


  constructor(private hospitalService: HospitalService, private modalService: ModalUploadService) { }

  ngOnInit() {

    this.loadHospitals();

    this.modalService.notificacion.subscribe(response => {
      this.loadHospitals();
    });

  }


  public loadHospitals() {

    this.loading = true;

    this.hospitalService.getHospitals(this.desde).subscribe((response: any) => {


      this.hospitalesList = response.hospitales;
      this.totalRegistros = response.total;
      this.loading = false;


    });
  }

  public findHospitals(term: string) {

    //si vuelve a 0 recargo hospitales
    if (term.length <= 0) {
      this.loadHospitals();
      return;
    }

    this.loading = true;

    this.hospitalService.findHospitalBy(term).subscribe((response: any) => {

      this.hospitalesList = response.hospitales;
      this.loading = false;
    });

  }

  public changePage(value: number) {

    //desde que registro empiezo
    let desde = this.desde + value;

    //si el proximo registro desde es mayor a la cantidad de registros retorno sin hacer nada
    if (desde >= this.totalRegistros) {
      return;
    }

    // <0 return sin nada
    if (desde < 0) {
      return;
    }
    this.desde += value;
    this.loadHospitals();
  }

  public createHospital() {

    (swal as any).fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      let newHospitalName = result.value;

      if (!newHospitalName || newHospitalName.length === 0) {
        return;
      }
      this.hospitalService.createHospital(newHospitalName)
        .subscribe((response: any) => {
          this.loadHospitals()
          swal('Nuevo hospital', `${response.hospital.nombre} creado correctamente`, 'success')
        });

    });

  }

  public openModal(id: string) {
    this.modalService.openModal('hospitales', id);
  }

  public saveChanges(hospital: Hospital) {

    this.hospitalService.actualizar(hospital).subscribe();

  }

  public deleteHospital(id: number) {

    // this.hospitalService.delete(id).subscribe(resp => swal('Hospital eliminado', 'Ha eliminado el hispital correctamente', 'success'));

    (swal as any).fire({
      title: 'Esta seguro?',
      text: "Despues de realizar no podrá volver atrás",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        this.hospitalService.delete(id)
          .subscribe(response => {
            //si no hay error al borrar el usuario recargo la lista para actualizarla
            this.loadHospitals();
            (swal as any).fire(
              'Borrado!',
              'El hospital ha sido borrado',
              'success'
            )

          });

      }
    })
  }
}

