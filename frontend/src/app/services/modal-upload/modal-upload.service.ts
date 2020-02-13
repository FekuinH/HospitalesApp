import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;

  public isOpen = false;

  public notificacion = new EventEmitter<any>();

  constructor() {
    
  }

  public closeModal() {
    this.isOpen = false;
    this.tipo = null;
    this.id = null;
  }

  public openModal(tipo: string, id: string) {
    this.tipo = tipo
    this.id = id;
    this.isOpen = true;
  }
}
