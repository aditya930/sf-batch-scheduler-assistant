import { api, track, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import retrieveScheduleJobDetails from '@salesforce/apex/SchedulerBatchUtils.retrieveScheduleJobDetails';

export default class ModalCmpFetchSchedJobDetails extends LightningModal{
    @api schedulerContent;
    @api apexClassParam;

    columns = [];
    scheduledJobDetails;
    noJobsMessage = 'No jobs scheduled for this class'
    modalHeader = '';

    //apexClassParam = this.schedulerContent.row.DurableId != "" ? this.schedulerContent.row.DurableId + '.' + this.schedulerContent.row.ClassName : this.schedulerContent.row.ClassName;

    constructor(){
        super();
        console.log('apexClassParam==>>', this.apexClassParam)
    }
    connectedCallback() {
        this.columns =  [
            {label: 'Scheduled Job Label', fieldName: 'CronJobName'},
            {label: 'Cron Expression', fieldName: 'CronJobDetails'}
        ];
        //console.log('sched content===>>>' + JSON.stringify(this.schedulerContent));
        //apexClassParam = this.schedulerContent.row.DurableId != "" ? this.schedulerContent.row.DurableId + '.' + this.schedulerContent.row.ClassName : this.schedulerContent.row.ClassName;
        /*retrieveScheduleJobDetails({apexClassName: apexClassParam})
            .then(result => {
                if(result == ""){
                    console.log('Empty--->>>');
                }
                else{
                    console.log('schedResults==>>', JSON.stringify(result));
                    this.scheduledJobDetails = result;
                    console.log('this.scheduledJobDetails--->>', this.scheduledJobDetails[0].ApexClassId);
                    testValue = this.scheduledJobDetails[0].ApexClassId;
                }
            })
            .catch(error => {
                //console.log('error--', error.body.message);
            });*/

    }

    handleClose() {
        const closeEvt = new CustomEvent('callparentmodal', {
            detail:{
                message: "Close Modal popup!"
            }
        });
        this.dispatchEvent(closeEvt);
    }

    @wire(retrieveScheduleJobDetails, { apexClassName: "$apexClassParam" })
    wiredRetrieveScheduleJobDetails({error, data}){
        if(data){
            this.modalHeader = 'Scheduled Job Details - ' + this.apexClassParam
            console.log('schedResults==>>', JSON.stringify(data));
            if(data == ""){
                //this.scheduledJobDetails = 'No jobs scheduled for this class'
                //console.log('this.scheduledJobDetails1==>>', this.scheduledJobDetails);
            }
            else{
                this.scheduledJobDetails = data.map(item => ({
                    CronJobName: item.CronTrigger.CronJobDetail.Name,
                    CronJobDetails: item.CronTrigger.CronExpression
                }));   
            }
            //console.log('this.scheduledJobDetails1==>>', JSON.stringify(this.scheduledJobDetails1));
            
        }
        else if(error){

        }
    }
}