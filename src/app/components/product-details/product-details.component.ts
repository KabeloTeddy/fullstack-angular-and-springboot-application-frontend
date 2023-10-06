import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  //define propoeties for ou product

  product!: Product;

  constructor(private productService:ProductService,
    private cartService : CartService,
              private route : ActivatedRoute){} //inject dependencies for the actual product service and an=ctivated route


  ngOnInit() {
    this.route.paramMap.subscribe(() =>{
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    //get the 'id' parameter string and convert it to a number

    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    //now that i have the id i can use the product service and i can call getProduct
    this.productService.getProduct(theProductId).subscribe(
      data =>{ 
        //assign the results of this call to my  product property defined in thos class
        this.product=data;
      }
    )
  }

  addToCart(){

    console.log(` adding to cart.... ${this.product.name} , ${this.product.unitPrice}`)

    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);

  }

}
