import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico';
import { MedicoService } from 'src/app/services/medico/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  public medicosList: Medico[] = [];
  public loading: boolean = true;
  public totalRegistros: number;
  public desde: number = 0;

  constructor(private medicoService: MedicoService) { }

  ngOnInit() {

    this.loadMedicos();
  }


  public loadMedicos() {
    this.loading = true


    this.medicoService.loadMedics(this.desde).subscribe((response: any) => {

      console.log(response);
      this.medicosList = response.medicos;
      this.totalRegistros = response.total
      this.loading = false;

    });
  }

  public findMedic(termino: string){

    if (termino.length<= 0){
      this.loadMedicos();
      return;
    }


    this.medicoService.findMedic(termino)
    .subscribe(medicosResponse=>{this.medicosList=medicosResponse});
  }

  public deleteMedic(id: string){
    this.medicoService.deleteMedic(id).subscribe(()=>{
      this.loadMedicos();
    });
  }

}
