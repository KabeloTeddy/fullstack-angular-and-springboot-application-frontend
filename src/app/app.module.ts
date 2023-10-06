import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';

import {HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';

//defining the router
const routes : Routes =[
  {path: 'checkout' , component : CheckoutComponent },
  {path: 'cart-details' , component : CartDetailsComponent },
  {path: 'products/:id' , component : ProductDetailsComponent },
//NB: The order of the routes matther form top dows as the first match wins. start with the most specific to the generic
  {path: 'search/:keyword' , component : ProductListComponent }, //route for seaching. It will be handles by the ProductListComponent. we will reuse it as the logic for viewing and listing items is already there
  {path:'category/:id', component : ProductListComponent}, //gaev it a path to match and to create an new instance pf the given component
  {path:'category', component : ProductListComponent}, //gaev it a path to match and to create an new instance pf the given component
  {path:'products', component : ProductListComponent}, //gaev it a path to match and to create an new instance pf the given component
  {path:'',redirectTo:'/products', pathMatch:'full'}, //match the fu;; path{/products} as opposed to just the prefix
  {path:'**', redirectTo: '/products', pathMatch:'full'}, //A generic wildcared. it will match anything that didnt match above routes
  

];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent
  ],
  imports: [
    RouterModule.forRoot(routes), //configuring router based on routes
    BrowserModule,
    HttpClientModule, // I imported this module as it is the one containing the http client
    NgbModule,  //wxposes the exported declaration in NgbModule(classes,interfaces,constants etc) and makes it availab;e in the current module
    ReactiveFormsModule //gives support for reactive forms
  ],
  providers: [ProductService], // this will allow to inject that given service into other parts of the give application
  bootstrap: [AppComponent]
})
export class AppModule { }
