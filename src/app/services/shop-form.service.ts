import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { Province } from '../common/province';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl='http://localhost:8080/api/countries';
  private provincesUrl= 'http://localhost:8080/api/provinces';

  constructor(private httpClient : HttpClient) //httpclient because ill be making rest calls
   { }

   //get countries
   getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(   //api call
      map(response => response._embedded.countries)
    );
   }

   getProvinces(theCountryCode : string) : Observable<Province[]>{

    //search url
    const searchProvincesUrl= `${this.provincesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    //api call using searchProvincesUrl
    return this.httpClient.get<GetResponseProvinces>(searchProvincesUrl).pipe(
      map(response => response._embedded.provinces)
    );
   }

  getCreditCardMonths(startMonth: number): Observable<number[]> { //observable array
    let data: number[] = [];

    //build an array for  "Month" dropdown list
    // -start at current ,onth and loop until month 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data); //The 'of' operator form rxjs(reactive javascript framword), will wrap an object as an obervable because the component will subscribe to this method to recieve asyn data
  }



  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    const startYear: number = new Date().getFullYear(); // get current year
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear); //adding that year to the array
    }

    return of(data);

  }
}

//unwrap the JSON from Spring Data REST for the _embedded entry
interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }

}
interface GetResponseProvinces{
  _embedded:{
    provinces: Province[];
  }
}