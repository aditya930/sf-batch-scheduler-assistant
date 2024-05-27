import { LightningElement, wire } from 'lwc';
import fetchScheduleBatchClasses from '@salesforce/apex/SchedulerBatchUtils.retrieveInterfaceClasses';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class BatchScheduleAssistantHome extends LightningElement {
    interfaceNames = ["Schedulable", "Batchable"];
    scheduleandBatchClassesData = [];

    //Toast variables
    toastTitle;
    toastMessage 
    toastVariant;
    toastMode;

    @wire(fetchScheduleBatchClasses, {interfaceNames: '$interfaceNames'})
    wiredFetchScheduleBatchClasses({error,data}){
        if (data) {
            this.scheduleandBatchClassesData = data.map((item) => {
                const durableIds = item.DurableId.split(';')
                let durableId = ''
                if(durableIds.length > 2){
                  durableId = durableIds[1].split('-')[1]
                }
                return { ...item, DurableId: durableId };
              });

        } else if (error) {
            this.toastTitle = 'ERROR!';
            this.toastMessage = error.body.message;
            this.toastVariant = 'error';
            this.toastMode = 'dismissable';

            this.showToastMessage(this.toastTitle, this.toastMessage, this.toastVariant, this.toastMode);
        }
    }

    showToastMessage(toastTitle, toastMessage, toastVariant, toastMode) {
        const evt = new ShowToastEvent({
            title: toastTitle,
            message: toastMessage,
            variant: toastVariant,
            mode: toastMode
        });
        this.dispatchEvent(evt);
    }
}