import { NgModule } from "@angular/core";

import {FormsModule} from "@angular/forms";
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';

import { PagesComponent } from './pages.component';

import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PAGES_ROUTES } from './pages.routes';
import { GraficoDonaComponent } from '../components/graficoDona/graficoDona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PipesModule } from '../pipes/pipes.module';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UploadFileModalComponent } from './upload-file-modal/upload-file-modal.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoProfileComponent } from './medicos/medico-profile.component';
import { BusquedaComponent } from './busqueda/busqueda.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent,
        PromesasComponent,
        RxjsComponent,
        ProfileComponent,
        UsuariosComponent,
        UploadFileModalComponent,
        HospitalesComponent,
        MedicosComponent,
        MedicoProfileComponent,
        BusquedaComponent,
        
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent
        
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule,
        PipesModule,
        CommonModule
    ]
})

export class PageModule { }