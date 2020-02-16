import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService,SettingsService,SidebarService,UsuarioService,LoginGuardGuard,AdminGuard,VerificaTokenGuard } from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from './modal-upload/modal-upload.service';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[SharedService,
    SettingsService,
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    ModalUploadService,
    AdminGuard,
    VerificaTokenGuard
  ],
})
export class ServiceModule { }
