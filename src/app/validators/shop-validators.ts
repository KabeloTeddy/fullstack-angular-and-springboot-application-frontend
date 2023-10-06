import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

    //whitespace validation
    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors{
        //if validation check fails, return validation error(s) ellse retun null(passes)

        if((control.value != null ) && (control.value.trim().length===0)){

            return {'notOnlyWhiteSpace' : true}; //key : value
            //html templete will check t=for the error key to figure if itll display message or not
        }
        else{

        return null;
}
    }
}
