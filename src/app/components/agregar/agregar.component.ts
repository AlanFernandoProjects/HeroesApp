import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  forma: FormGroup;
  vivo = true;


  constructor(private http: HttpClient, private hs: HeroesService, private ar: ActivatedRoute) {
    this.ar.params.subscribe(params => {
      this.hs.obtenerHeroe(params['id']).subscribe(resp => {
        let x = resp;
        this.forma.setValue(resp);
      });

    });
    this.forma = new FormGroup({
      'nombre': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(5)]),
      'bio': new FormControl('', [Validators.required]),
      'img': new FormControl(''),
      'aparicion': new FormControl('', [Validators.required]),
      'vivo': new FormControl(true),
      'email': new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])
    });
    // console.log(this.forma);
  }

  ngOnInit() {
  }

  agregarHeroe(forma: FormGroup) {
    if (this.forma.invalid) {
      return;
    }
    this.ar.params.subscribe(params => {
      if (!params['id']) {
        this.hs.agregarHeroe(this.forma.value).subscribe(resp => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El heroe ha sido registrado',
            showConfirmButton: false,
            timer: 1500
          });
        }, (err) => console.log(err));
        this.forma.reset();
      } else {
        this.hs.actualizarHeroe(this.forma.value, params['id']).subscribe(resp => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El heroe ha sido actualizado con exito',
            showConfirmButton: false,
            timer: 1500
          });
        }, (err) => console.log(err));
      }
    });
  }

  cambiar(valor: boolean) {
    if (valor === false) {
      this.vivo = false;
      this.forma.controls['vivo'].setValue(false);
    }
    if (valor === true) {
      this.vivo = true;
      this.forma.controls['vivo'].setValue(true);
    }
  }
}
