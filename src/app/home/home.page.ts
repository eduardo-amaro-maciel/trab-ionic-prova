import { GetCepService } from './../services/get-cep.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  public formulario:FormGroup
  
  public showLabel:boolean = true

  constructor(private fb:FormBuilder, public getCep:GetCepService) {

    this.formulario = fb.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      sobrenome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, cpfValidator()])],
      cep: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}-[0-9]{3}$')])],
      bairro: ['', Validators.required],
      localidade: ['', Validators.required],
      logradouro: ['', Validators.required],
      estado: ['', Validators.required],
      genero: [''],
      outro: ['']
    })
  }

  ngOnInit() {}

  enviar() { 
    if (!this.formulario.valid) {
      this.formulario.markAllAsTouched();
    } else {
      console.log(this.formulario.value)
      this.formulario.reset()
    }
  }

  testCepIsValid(cep) {
    let regex = /^[0-9]{5}-[0-9]{3}$/
    return regex.test(cep)
  }

  optionsFn() {

    if (this.formulario.value.genero === 'Informar outro') {
      this.showLabel = false
      this.formulario.get('outro').setValidators([Validators.required])
      this.formulario.get('outro').updateValueAndValidity()
    } else {
      this.formulario.get('outro').removeValidators([Validators.required])
      this.formulario.get('outro').updateValueAndValidity()
      this.showLabel = true
    }
  }

  onBlurEffect() {

    const userCEP = this.formulario.value.cep

    if(this.testCepIsValid(userCEP)) {
      this.getCep.obterDadosDoCep(userCEP).subscribe((response:any) => {
    
        const dado = {
          bairro: response.district,
          localidade: response.city,
          logradouro: response.address,
          estado: response.state
        }
  
        this.formulario.patchValue(dado, {emitEvent: true});
      })
    }  
  }
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;
    if (cpf) {
      let numbers, digits, sum, i, result, equalDigits;
      equalDigits = 0;
      if (cpf.length > 11) {
        return { cpfInvalid: true };
      }

      for (i = 0; i < cpf.lenght - 1; i++) {
        if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
          equalDigits = 1;
          break;
        }
      }

      if (!equalDigits) {
        console.log('Entrou na função e caiu no primeiro if')
        numbers = cpf.substring(0, 9);
        digits = cpf.substring(9);
        sum = 0;
        for (i = 10; i > 1; i--) {
          sum += numbers.charAt(10 - i) * i;
        }

        result = sum % 11 <2 ? 0 : 11 - (sum % 11);

        if (result !== Number(digits.charAt(0))) {
          return { cpfInvalid: true };
        }
        numbers = cpf.substring(0, 10);
        sum = 0;

        for (i = 11; i > 1; i--) {
          sum += numbers.charAt(11 - i) * i;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        if (result !== Number(digits.charAt(1))) {
          return { cpfInvalid: true }
        }
        return null;
      } else {
        return { cpfInvalid: true };
      }
    }
    return null;
  };
}