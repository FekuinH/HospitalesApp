import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico';
import { Hospital } from 'src/app/models/hospital';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { MedicoService } from 'src/app/services/medico/medico.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'src/app/services/modal-upload/modal-upload.service';


@Component({
  selector: 'app-medico-profile',
  templateUrl: './medico-profile.component.html',
  styles: []
})
export class MedicoProfileComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico();
  hospitalSeleccionado: Hospital = new Hospital('');

  constructor(private hospitalService: HospitalService, private medicoService: MedicoService, private router: Router, private activatedRoute: ActivatedRoute, private modalService: ModalUploadService) { }



  ngOnInit() {

    this.hospitalService.getHospitals().subscribe((response: any) => {

      this.hospitales = response.hospitales

    });

    //obtengo todos los parametros definidos en la URL
    this.activatedRoute.params.subscribe(parametros => {
      let id = parametros['id'];

      if (id !== 'nuevo') {
        this.findById(id);
      }

    });

    this.modalService.notificacion.subscribe(response => {
      this.medico.img = response.medico.img;
    });
  }

  public createMedic(form) {

    if (form.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico).subscribe(medico => {
      this.medico = medico;
      this.router.navigate(['/medico/', medico._id]);
    });

  }

  public cambioHospital(id) {

   
    this.hospitalService.findById(id).subscribe(hospital => {
      this.hospitalSeleccionado = hospital;

    });



  }

  public findById(id: string) {
    this.medicoService.findById(id).subscribe(medico => {
      this.medico = medico
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital(this.medico.hospital);

    });
  }

  public cambiarFoto(){

    
    this.modalService.openModal('medicos', this.medico._id);

  }

  public actualizar(medico: Medico){

    this.medicoService.actualizarMedico(medico).subscribe((response: any)=>{
      this.medico= response.medico
      this.router.navigate(['/medicos']);
    });
  }


}
