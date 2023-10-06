import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {


  totalPrice : number=0.00;
  totalQuantity: number =0.00;

  constructor(private cartService: CartService) //inject the CartService
  {}

  ngOnInit(): void {
   this.updateCartStatus();
  }
  updateCartStatus() {
    //subscribe for events on the service injected
    //subscriobe to totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data // recieve the event from the subscription make the assignments as data comes in
    );


    //subscribe to the total quantity event

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity= data //data will be assigned to the rpoperty
    );
  }

}
