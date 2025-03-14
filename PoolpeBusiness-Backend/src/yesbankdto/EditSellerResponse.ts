import { EditSeller } from "./EditSeller";

export class EditSellerResponse{

    code:number;
    editSeller: EditSeller;
    msg: string;

    constructor(
        code: number,
        editSeller:EditSeller,
        msg: string
    ) {
        this.code = code;
        this.editSeller= editSeller;
        this.msg = msg;
    }

    

}