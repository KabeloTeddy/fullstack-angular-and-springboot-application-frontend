import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Province } from 'src/app/common/province';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  //review ypur order section
  totalPrice: number = 0;
  totalQuantity: number = 0;


  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  //array for shipping address and billing address provinces
  shippingAddressProvinces: Province[] = [];
  billingAddressProvinces: Province[] = [];

  constructor(private formBulder: FormBuilder,
    private shopService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) {

  }
  ngOnInit(): void {

    //call reviewCardDetails
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBulder.group({  //build the form


      customer: this.formBulder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace]),

        email: new FormControl('',
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ])
      }),

      shippingAddress: this.formBulder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace]),

        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace]),

        province: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        postCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace])
      }),

      billingAddress: this.formBulder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace]),
        province: new FormControl('',
          [Validators.required,
          ]),
        country: new FormControl('',
          [Validators.required,
          ]),

        postCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpace]),

      }),
      creditCard: this.formBulder.group({
        cardType: new FormControl('', [Validators.required, Validators.minLength(2),
        ShopValidators.notOnlyWhiteSpace]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
        ShopValidators.notOnlyWhiteSpace]),

        cardNumber: new FormControl('', [Validators.pattern('{0-9}{16}'), Validators.required]),

        securityCode: new FormControl('', [Validators.pattern('{0-9}{3}'), Validators.required]),
        expirationMonth: [''],
        expirationYear: ['']

      })

    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth >> : " + startMonth)

    this.shopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    // populate credit card years
    this.shopService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived credit card years : " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );


    //populate countries when form is initially displayed

    this.shopService.getCountries().subscribe(
      data => {
        console.log("Retrived countries : " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  reviewCartDetails() {

    //subscribe to cartService.totalQuanitity 
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )
  }


  //define getter methods to access form controls
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  //getters to access form controls: to use in HTML
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressProvince() { return this.checkoutFormGroup.get('shippingAddress.province'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressPostCode() { return this.checkoutFormGroup.get('shippingAddress.postCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressProvince() { return this.checkoutFormGroup.get('billingAddress.province'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressPostCode() { return this.checkoutFormGroup.get('billingAddress.postCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }





  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //bug fix code for provinces
      //need to assign shipping address provinces to billing address 
      this.billingAddressProvinces = this.shippingAddressProvinces
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for clearing province too
      //TODO this.billinProvince = Country
      this.billingAddressProvinces = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if current year is equals to the selectes year, then start with the current month till the alst of that year
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;

    }
    this.shopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit cart months : " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }


  onSubmit() {
    console.log(">>>>Handling the submition button....");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // triggers all the display of the error messages
      //  console.log("triggering all the display error messaged");
      // return; //should not execute any method if invalid
    }


    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items(get cart items form car Service)
  
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    //-long way
    // let orderItems : OrderItem[]=[];
    // for(let i=0;i<cartItems.length; i++){
    //   orderItems[i]=new OrderItem(cartItems[i]);
    // }

    //-dhorter way
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));


    //set up purchase

    let purchase = new Purchase();

    //popolate purchase -customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;


    //popolate purchase -shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingProvince: Province = JSON.parse(JSON.stringify(purchase.shippingAddress.province));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    //grab the actual data for each one of those items
    purchase.shippingAddress.province = shippingProvince.name;
    purchase.shippingAddress.country = shippingCountry.name;



    //popolate purchase -billing address

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingProvince: Province = JSON.parse(JSON.stringify(purchase.billingAddress.province));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    //grab the actual data for each one of those items
    purchase.billingAddress.province = billingProvince.name;
    purchase.billingAddress.country = billingCountry.name;


    //populate purchase - using order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;


    //call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => { //success path
          alert( `Your order has been recieved.\nYour Order Tracking number is : ${response.orderTrackingNumber} `);
          console.log("popup - should show")
          //reset the cart
          this.resetCart();

        },
        //exception path
        error: err => {   
          alert( `There was an error : ${err.message}` );
        }
      }
    );



  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);


    // reset form data

    this.checkoutFormGroup.reset();
    //navigate to main page
    this.router.navigateByUrl("/products");
  }


  getProvinces(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName) //pass in shipping address or billing addres to make sure i get the actual country from the correct form group
    //retrieve country
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code ${countryCode}`);
    console.log(`${formGroupName} country name ${countryName}`); //not required for calling REST API, just for debugging and logging purposes. Only country code is required

    //call to the form service to get the procince
    this.shopService.getProvinces(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') { //check formGrouName, then assign to shippingAddress provinces
          this.shippingAddressProvinces = data;
        }
        else {
          this.billingAddressProvinces = data;
        }

        //select the first province ad default
        formGroup.get('province').setValue(data[0]);
      }
    );

  }





}
