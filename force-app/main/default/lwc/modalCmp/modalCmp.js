import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class ModalCmp extends LightningModal  {
    @api content;
    scheduleJobFlag = false;
    getScheduleDetailsFlag = false;
    executeBatchFlag = false;
    apexClass;

    connectedCallback() {
        this.apexClass = this.content.row.DurableId != "" ? this.content.row.DurableId + '.' + this.content.row.ClassName : this.content.row.ClassName;
        this.scheduleJobFlag = this.content.action.title == 'Schedule Job'? true: false
        this.getScheduleDetailsFlag = this.content.action.title == 'View Schedule Details'? true: false
        this.executeBatchFlag = this.content.action.title == 'Execute Batch'? true: false
    }
    handleClose(event){
        this.close('okay');
    }
}