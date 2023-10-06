import { Injectable } from '@angular/core';

import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //array of cart item objects
  cartItems: CartItem[] = [];

  // totalPrice: Subject<number> = new Subject<number>();
  // totalQuantity: Subject<number> = new Subject<number>();

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }



  addToCart(theCartItem: CartItem) {
    //check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      //find the item in cart based on the item id

      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id == theCartItem.id){
      //     existingCartItem=tempCartItem;
      //     break;
      //   }

      // }

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      //.find() returns first elemet that passess else returns undefined.
      //then test condition ex0ecutes tests for each element in the array until test passes
      //check if we found the item
      alreadyExistsInCart = (existingCartItem != undefined);

    }
    if (alreadyExistsInCart) {
      //ic=ncrease the quantity
      existingCartItem.quantity++;
    } else {
      //just add th item to the array
      this.cartItems.push(theCartItem);
    }
    //compute the cart total price and total qualntity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCarItem of this.cartItems) {
      totalPriceValue += currentCarItem.quantity * currentCarItem.unitPrice;
      totalQuantityValue += currentCarItem.quantity;

    }

    //publis the new values... all subscribers will recieve the new data
    this.totalPrice.next(totalPriceValue); //.next to send the events
    this.totalQuantity.next(totalQuantityValue);
    // service will publish/send the events to all subscibers. one event for 
    //one event for totalPrice and one event fir totalQuality


    //log cart data just dor debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    // console.log(`totalPriceValue>>>>${totalPriceValue} , totalQuantity >>>${totalQuantityValue}`);
    console.log("Contents of the cart>>>>>>");
    for (let tempContents of this.cartItems) {
      const subTotalPrice = tempContents.quantity * tempContents.unitPrice;
      console.log(`name: ${tempContents.name} , unitPrice: ${tempContents.unitPrice} , quantity ${tempContents.quantity} , subTotalPrice ${subTotalPrice}`)
    }

    console.log(` totalPrice ${totalPriceValue.toFixed(2)}, totalQuantity ${totalQuantityValue}`); //two decimal place
    console.log("________");
  }


  decreaseQuantity(theCartItem: CartItem) {
    let existingCartItems2 = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    existingCartItems2.quantity--;
    // Remove the item from the cart if the quantity is equal to 0
    if (existingCartItems2.quantity === 0) {
      this.cartItems.splice(this.cartItems.indexOf(existingCartItems2), 1);
    }
    this.computeCartTotals();
  }


  removeItem(theCartItem: CartItem) {
    this.cartItems.splice(this.cartItems.indexOf(theCartItem), 1);
    this.computeCartTotals();
  }


}
