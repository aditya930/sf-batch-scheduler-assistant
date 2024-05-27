import { LightningElement, api } from 'lwc';
import LightningModal from 'lightning/modal';
import executeBatchClass from '@salesforce/apex/SchedulerBatchUtils.executeBatchClass';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ModalCmpExecuteBatchJob extends LightningModal {
    @api batchClassExecuteDetails
    modalHeader = 'Execute Batch Apex';
    batchSize;
    apexClassParam;
    classNameFormattedText = ''

    connectedCallback(){
        this.apexClassParam = this.batchClassExecuteDetails.row.DurableId != "" ? this.batchClassExecuteDetails.row.DurableId + '.' + this.batchClassExecuteDetails.row.ClassName : this.batchClassExecuteDetails.row.ClassName
        this.classNameFormattedText = 'Class name - ' + this.apexClassParam
    }

    handleClose() {
        const closeEvt = new CustomEvent('callparentmodal', {
            detail:{
                message: "Close Modal popup!"
            }
        });
        this.dispatchEvent(closeEvt);
    }

    handleBatchExecute(event){
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.setCustomValidity('Please enter a number between 1 - 2000')
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        },true);

        if(allValid){
            this.batchSize = this.refs.batchSizeRef.value;
            console.log('this.batchSize ==>>', this.batchSize)
            console.log('this.batchSize ==>>', typeof(this.batchSize))
            this.close('okay');
            
            executeBatchClass({className: this.apexClassParam, batchSize: this.batchSize})
                .then( result => {
                    this.toastTitle = 'Success!';
                    this.toastMessage = 'The batch class is successfully executed';
                    this.toastVariant = 'success';
                    this.toastMode = 'dismissable';
                    this.showToastMessage(this.toastTitle, this.toastMessage, this.toastVariant, this.toastMode);
                })
                .catch( error =>{
                    this.toastTitle = 'Something went wrong during exeucting batch Class!';
                    this.toastMessage = error.body.message;
                    this.toastVariant = 'error';
                    this.toastMode = 'dismissable';

                    this.showToastMessage(this.toastTitle, this.toastMessage, this.toastVariant, this.toastMode);
                })
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