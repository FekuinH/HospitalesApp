import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/service.index';
import swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  public usuario: Usuario;

  selectImage: File;
  tempImg: string;

  constructor(private usuarioService: UsuarioService) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit() {


  }


  guardar(usuario: Usuario) {

    //cambio los valores del usuario actual que es el que tengo en el token
    this.usuario.nombre = usuario.nombre;
    this.usuario.email = usuario.email;

    this.usuarioService.actualizar(this.usuario).subscribe();

  }

  selectImg(file: File) {

    //check si es imagen
    if (!file.type.includes('image')){
      swal('Error al subir la imagne','El archivo seleccionado no es valido','error')
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


  changeImg() {
    this.usuarioService.changeImage(this.selectImage, this.usuario._id);
  }
}
