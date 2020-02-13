import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { UploadFileService } from 'src/app/services/upload-file/upload-file.service';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/services/modal-upload/modal-upload.service';

@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.css']
})
export class UploadFileModalComponent implements OnInit {

  selectImage: File;
  tempImg: string;

  constructor(private uploadFileService: UploadFileService, private userService: UsuarioService, private modalService: ModalUploadService) { }

  ngOnInit() {
  }

  public closeModal() {
    this.selectImage = null;
    this.tempImg = null;
    this.modalService.closeModal();
  }

  selectImg(file: File) {

    //check si es imagen
    if (!file.type.includes('image')) {
      swal('Error al subir la imagne', 'El archivo seleccionado no es valido', 'error')
      this.selectImage = null;
      return;
    }

    //check si me llega archivo
    if (file) {
      //seteo la imagen a la imgselect
      this.selectImage = file;

      //creo reader
      let reader = new FileReader();
      //extraigo la url del archivo seleccionado
      let urlImgTemporal = reader.readAsDataURL(file);

      reader.onloadend = () => this.tempImg = reader.result as any;

    } else {
      //si no me llega la imagen seleccionada actual es null
      this.selectImage = null;
    }

  }


  public uploadFile() {
    console.log('hola');
    this.uploadFileService.uploadfile(this.selectImage, this.modalService.tipo, this.modalService.id)
      .then((response: any) => {

        //si es el mismo usuario que el logeado actualizo el storage
        if (this.userService.usuario._id === this.modalService.id){
          this.userService.usuario.img = response.usuario.img;
          this.userService.guardarStorage(this.userService.token,this.userService.usuario);
        }

        //emito notifificacion para saber que se cambio una imagen
        this.modalService.notificacion.emit(response);
        this.modalService.closeModal();

        
      })
      .catch(error => {

      })
  }


}
