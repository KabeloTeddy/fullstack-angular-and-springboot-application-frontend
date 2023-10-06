import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl:string;
    unitPrice:number;
    quantity:number;
    productId:number;

    //costrucor for accessing cart item
    constructor(cartItem : CartItem){
        //reading appropriate fields from cart item and  assigning them to order item

        this.imageUrl=cartItem.imageUrl;
        this.quantity=cartItem.quantity;
        this.unitPrice=cartItem.unitPrice;
        this.productId=cartItem.id;

    }
}
