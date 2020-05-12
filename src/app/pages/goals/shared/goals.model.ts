import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

export class Goal extends BaseResourceModel {

    constructor(
        public id?:number, 
        public description?:string, 
        public initialDate?: Date, 
        public endDate?: Date, 
        public expectedAmount?: number, 
        public installmentsQuantity?: number,
        public installmentsValue?: number) {

        super();
    }

    static fromJson(jsonData: any): Goal {
        return Object.assign(new Goal(), jsonData);
    }

}