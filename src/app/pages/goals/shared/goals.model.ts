import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

export class Goal extends BaseResourceModel {

    constructor(
        public _id?:string, 
        public description?:string, 
        public initialDate?: Date, 
        public finalDate?: Date, 
        public expectedAmount?: string, 
        public installmentsQuantity?: number,
        public installmentsValue?: string) {

        super();
    }

    static fromJson(jsonData: any): Goal {
        return Object.assign(new Goal(), jsonData);
    }

}