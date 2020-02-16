import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/service.index';
import swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/services/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {


  public userList: Usuario[] = [];
  public desde: number = 0;
  public totalRegistros: number = 0;
  public loading: boolean = true;

  constructor(
    private userService: UsuarioService,
    private modalService: ModalUploadService) { }

  ngOnInit() {

    this.loadUsers();

    this.modalService.notificacion.subscribe(response => {
      this.loadUsers();
    });
  }


  public loadUsers() {

    this.loading = true;

    //cargo usuarios y le mando desde que registro quiero empezar a paginar
    this.userService.loadUsers(this.desde).subscribe((response: any) => {


      this.totalRegistros = response.total;
      this.userList = response.usuarios;
      this.loading = false;

    });

  }

  //paginacion method
  public changePage(value: number) {

    //variable local para saber desde que registro estoy parado y desde cual será el proximo
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
    this.loadUsers();

  }


  public findUser(termino: string) {

    //si la busqueda no tiene letras resetea los usuarios a la lista total
    if (termino.length <= 0) {
      this.loadUsers();
      return;
    }

    this.loading = true;

    this.userService.findUser(termino)
      .subscribe((userListResponse: Usuario[]) => {

        this.userList = userListResponse;
        this.loading = false;
      });

  }


  public deleteUser(user: Usuario) {

    //comparo id del usuario a borrar con id del usuario logeado actualmente (no se puede borrar el mismo)
    if (user._id === this.userService.usuario._id) {
      swal('Error al borrar', 'No te puedes borrar tu mismo', 'info');
      return;
    }

    (swal as any).fire({
      title: 'Esta seguro?',
      text: "Despues de realizar no podrá volver atrás",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.userService.deleteUser(user._id)
          .subscribe(response => {
            //si no hay error al borrar el usuario recargo la lista para actualizarla
            this.loadUsers();
            (swal as any).fire(
              'Borrado!',
              'El usuario ha sido borrado',
              'success'
            )

          });

      }
    })


  }

  public saveChanges(user: Usuario) {

    this.userService.actualizar(user)
      .subscribe();
  }


  public openModal(id: string) {
    this.modalService.openModal('usuarios', id);
  }


}
