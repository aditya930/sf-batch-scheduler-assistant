import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import scheduleApexClass from '@salesforce/apex/SchedulerBatchUtils.scheduleApexClass';


export default class ModalCmpScheduleApexCls extends LightningModal {
    @api schedulerClsDetails;
    modalHeader = 'Schedule Apex';
    scheduleJobName;
    cronExpression;

    //Toast variables
    toastTitle;
    toastMessage 
    toastVariant;
    toastMode;
    connectedCallback() {
        //console.log('inside connected app')
        //console.log('schedulerClsDetails details===>>>' + JSON.stringify(this.schedulerClsDetails));
    }
    
    handleClose() {
        //this.close('close popup');
        const closeEvt = new CustomEvent('callparentmodal', {
            detail:{
                message: "Close Modal popup!"
            }
        });
        this.dispatchEvent(closeEvt);
    }

    handleSchedule(event){
        
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        if (allValid) {
            this.trst = '';
            //alert('All form entries look valid. Ready to submit!');
            this.scheduleJobName = this.refs.jobNameRef.value;
            this.cronExpression = this.refs.cronExpRef.value;
            let apexClassParam = this.schedulerClsDetails.row.DurableId != "" ? this.schedulerClsDetails.row.DurableId + '.' + this.schedulerClsDetails.row.ClassName : this.schedulerClsDetails.row.ClassName
            this.close('okay');

            scheduleApexClass({ scheduleJobName: this.scheduleJobName, cronExpression: this.cronExpression, apexClassName: apexClassParam })
                .then(result => {
                    console.log('result==>>', result);

                    this.toastTitle = 'Success!';
                    toastMessage = 'The class is successfully scheduled';
                    toastVariant = 'success';
                    toastMode = 'dismissable';
                    this.showToastMessage(this.toastTitle, this.toastMessage, this.toastVariant, this.toastMode);
                })
                .catch(error => {
                    this.toastTitle = 'Something went wrong during Scheduling Class!';
                    this.toastMessage = error.body.message;
                    this.toastVariant = 'error';
                    this.toastMode = 'dismissable';

                    console.log('this.toastVariant--->>>', this.toastVariant)
                    this.showToastMessage(this.toastTitle, this.toastMessage, this.toastVariant, this.toastMode);
                });

                
            
            } else {
            //alert('Please update the invalid form entries and try again.');
            this.toastTitle = 'Invalid Entries!';
            this.toastMessage = 'Please update the invalid form entries and try again.';
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