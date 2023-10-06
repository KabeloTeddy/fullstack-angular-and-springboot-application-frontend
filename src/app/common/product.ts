export class Product {

    //these field matches with the json data coming back from the springboot rest APi
    constructor( public id : number,
        public sku : string,
        public name : string,
        public description : string,
        public unitPrice : number,
        public imageUrl : string,
        public active : boolean,
        public unitInStock : number,
        public dateCreated : Date,
        public lastUpdated : Date



        ){

        }
}
