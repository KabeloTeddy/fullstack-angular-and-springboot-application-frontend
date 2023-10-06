//
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;



  previousKeyword: string = "";


  constructor(private productService: ProductService, //inject our ProductService into this product-list componenent
    private route: ActivatedRoute,//inject ActivatedRoute, The current active route that loaded the compomnent. Useful for accessing route parameters beacause e need that to access the give category id
    private cartService: CartService) //inject cart service in order to  all the addToCart method on the cart service
  { }
  ngOnInit() { // similar to @{PostConstruct in sb}
    // add the the hook to call my list products method
    this.route.paramMap.subscribe(() => {
      this.listProducts();

    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword') //logic for checking if the route has a parameter for 'keyword' and if it does
    //that means we are performing a search. the 'keyword' parameter comes from the route configuration from app.module.ts
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts(); //list the products
    }


  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!; //get the actual keyword that the user has passed in

    //if we have a diffrent keyword than previous then we set thePageNumber to 1. refreshing the page number
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword; //keep track of the keyword
    console.log(`keyword ${theKeyword} , thePageNumber=${this.thePageNumber}`);


    //now search the products using that given keyword
    // this.productService.searchProducts(theKeyword).subscribe(
    //   data =>{
    //     this.products=data;

    //update to serchProduct
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(
        this.processResult());

  }


  handleListProducts() {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    //use activated route  //snapshop: state of route at this given moment in time  //paramMap: map of all the route parametes
    //snd we read the od pf the given id parameter. if its given it will return true(1) or returns false(0)

    if (hasCategoryId) {
      //get the id oaram string , convert string to a  number using "+" symbol- this is a typescript trick to convert

      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; // make note of the '!@ this is the non null assersion operator.this tells the compiler that the object is not null
    }
    else {
      //not category id available ,, default to category id 1
      this.currentCategoryId = 1;
    }
    //Cgeck if we have a difftent category than the previous
    //NB:  Angular will reuse a componenet if it is being viewed currently

    //if we have a diffrent categoty id tan previous , then we want to reset thePageNumber back to 1

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId; //to keep track on the category

    console.log(`currentCategotyId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)


    //call the service
    this.productService.getProductListPaginate(this.thePageNumber - 1, //pagination componenets are 1 based in angular and pages are zero based in SDR
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult()
        //  .subscribe(data =>{ //EVERYTHING FROM json responsebeing mapped
        //   this.products=data._embedded.products;
        //   this.thePageNumber=data.page.number+1;
        //   this.thePageSize=data.page.size;
        //   this.theTotalElements=data.page.totalElements;

        //keft-hand side of assignments are properties defined in this class
      );
  }



  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;//convert to string(set page size based on paeameter value)
    this.thePageNumber = 1; //reset the page number to 1 as they chanegd the page size
    this.listProducts(); //refresh the page view based n selection
  }

  processResult() {  //take JSON response and map it to firlds in this class. all the pagination will nbe assigned accordingly

    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.theTotalElements;
    }

  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart >>>>>>>>> ${theProduct.name} , ${theProduct.unitPrice}`);

    //call the addToCart method on the cart service
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
