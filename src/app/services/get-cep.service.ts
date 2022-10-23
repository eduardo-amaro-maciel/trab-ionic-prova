import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetCepService {

  constructor(private http:HttpClient) { }

  obterDadosDoCep(cep:string) {
    let url = `https://cdn.apicep.com/file/apicep/${cep}.json`
    return this.http.get(url);
  }
}
