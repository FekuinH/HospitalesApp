import { Usuario } from './usuario';
import { Hospital } from './hospital';

export class Medico{


    constructor(
        public nombre: string,
        public usuario?: Usuario,
        public hospital?: Hospital,
        public _id?: string
    ) {}
}