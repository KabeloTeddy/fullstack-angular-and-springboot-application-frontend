//
import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories : ProductCategory[] =[]; // array of the product ategory items

  constructor(private productService : ProductService){ //injecting our product service

  }


  ngOnInit() {
    this.listProductCategories(); // the method that will create to actually call our service
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe( //invoke the service
      data =>{
        console.log(" Product Category= " + JSON.stringify(data)); //log the data returned from the service. Json.stringify to take a given object and display in json format
        this.productCategories=data; //assign the data to the property
      }
    );
  }


}
