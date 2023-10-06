import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
 
  private baseUrl='http://localhost:8080/api/products'; //same url for the REST api which is what the service we are calling
  
  private categoryUrl= 'http://localhost:8080/api/product-category';
  constructor(private httpClient : HttpClient)// now injecting the http client
  { }




  getProductList(theCategoryId: number) : Observable<Product[]> { // returns an observable. maps the JSON data from Spring Data REST service to product array

    //build the url based on the category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    //spring data rest will automaticall exposes the enpoint ( http://localhost:8080/api/products=which is the baseUrl)
    //search/findByCategoryId?id=${theCategoryId}` wich is our id

    return this.getProducts(searchUrl);
    // return this.httpClient.get<GetResponse>(this.baseUrl).pipe( // use http client, make a get request to the baseUrl,
    //the data thats returned, we pipe it and we make use of map to map that data to our given data type

    // return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(

    //   map(response => response._embedded.products)// then grab that response .embeded.products and thats gonna be the product
      //array i am gonna make use of,
    
  }


  getProduct(theProductId: number) : Observable<Product>{ //Product not Products[] since we returning just one product
    //need to build the URL based on the product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl); 
    //call the API based on this productUrl
  }



  searchProducts(theKeyword: string ): Observable<Product[]> {
    //need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`; // build the new search url
    return this.getProducts(searchUrl); //calls  extracted method using ide (searchProduct) and calls getProducts
  }



  searchProductsPaginate(thePage: number, 
    thePageSize : number, 
    theKeyword:string) : Observable<GetResponseProducts> { 
    //build the url based on the keyword on search bar, page and size
  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}



  getProductListPaginate(thePage: number, thePageSize : number, theCategoryId:number) : Observable<GetResponseProducts> { //parameters for pagination
    //build the url based on the category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
   
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }




  getProductCategories() : Observable <ProductCategory[]> {//because returning a list of product categories
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe( //call the rest api
      map(response => response._embedded.productCategory)//returns observable : maps the JSON data from Spring Data REST to ProductCategory array
    );

}
}



interface GetResponseProducts{ // this supporting interface to help us with the mapping
  //this will help in unwrapping the json data from the spring rest api and make use of the _.embeded entry that
  //back from the spring data rest api/
  _embedded: {
    products: Product[]; // and we will access the array of products
  },
  page:{ //for pagenation.
    size:number, //the metadate response from http://localhost:8080/api/products?page=0&size=10
    totalElements: number, //grand total of the elements
    totalPages:number, //total pages available
    number:number //current page number
  }
}

//unwraps the JSON from Spring Data REST _embedded entry
interface GetResponseProductCategory{  
  _embedded: {
    productCategory: ProductCategory[]; 
  }
}
