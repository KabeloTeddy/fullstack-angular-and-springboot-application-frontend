import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
t
  //url to the spring boot backend rest endpoin
  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private httpClient:HttpClient) { }

  placeOrder(purchase:Purchase): Observable<any> { //any return type

    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);  // send to the purchaseurl and pass over the purchase object
    
  }
}
