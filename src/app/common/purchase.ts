import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {
    //main object used for sedning  all o f the data that is read from the checkout form
    customer:Customer;
    shippingAddress:Address;
    billingAddress:Address;

    order:Order;
    orderItems:OrderItem[];

    //frontend will assemble this purchase from all the form data and send to restAPI for processing

}
