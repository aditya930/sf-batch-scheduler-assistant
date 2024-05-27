import { LightningElement, api } from 'lwc';
//import fetchSchedulerClasses from '@salesforce/apex/SchedulerBatchUtils.retrieveInterfaceClasses';
import ModalCmp from 'c/modalCmp'

const DELAY = 300;

export default class SchedulerClassCmp extends LightningElement{
    scheduledClassesData = [];
    allRecordsHolder = [];
    recordsToDisplay = [];
    columns = [];
    schedulePopup = false
    isloading = true
    pageSizeOptions = [10,25,50,75,100];
    pageSize;
    totalPages;
    totalRecords = 0;
    pageNumber = 1

    @api
    get scheduledData(){
        return this.scheduledClassesData
    }

    set scheduledData(scheduledData){
        this.scheduledClassesData = scheduledData.filter(item => item.InterfaceName === 'Schedulable');
        this.setDataForPagination();
    }

    setDataForPagination(){
        this.allRecordsHolder = [...this.scheduledClassesData]
        this.recordsToDisplay = this.scheduledClassesData
        this.pageSize = this.pageSizeOptions[0]
        this.totalRecords = this.scheduledClassesData.length
        this.paginationHelper();
    }

    handleRecordsPerPage(event){
        this.pageSize = event.target.value;
        this.paginationHelper();
    }

    handlePageNumberChange(event){
        if(event.keyCode === 13){
            this.pageNumber = event.target.value;
            this.paginationHelper();
        }
    }

    connectedCallback(){

        this.columns = [
            {label: 'Class Name', fieldName: 'ClassName'},
            {label: 'Package', fieldName: 'DurableId'},
            {type: "button", label: 'Schedule Job', 
            typeAttributes: {
                label: 'Schedule Job',
                name: 'Schedule Job',
                title: 'Schedule Job',
                disabled: false,
                value: 'schedulejob',
                variant:'Brand'
            }},
            {
                label: 'Scheduled Job Details',
                type: 'button',
                typeAttributes: {
                    label: 'View',
                    name: 'View Schedule Details',
                    title: 'View Schedule Details',
                    variant: 'base',
                    alternativeText: 'View',
                    target:'_blank'
                }
            }
        ]
    }

    async callRowAction(event){
        const actionName = event.detail.action.name;

        const result = await ModalCmp.open({
            size: 'small',
            description: 'Schedule Modal Popup',
            content: event.detail
        });
    }

    /*@wire(fetchSchedulerClasses, {interfaceNames: '$interfaceNames'})
    wiredFetchScheduledClasses({error,data}){
        this.isloading = false
        if (data) {
            this.scheduledClassesData = data.map((item) => {
                const durableIds = item.DurableId.split(';')
                let durableId = ''
                if(durableIds.length > 2){
                  durableId = durableIds[1].split('-')[1]
                }
                return { ...item, DurableId: durableId };
              });

              //console.log('this.scheduledClassesData ===>>', this.scheduledClassesData )
              
              this.allRecordsHolder = [...this.scheduledClassesData]
              this.recordsToDisplay = this.scheduledClassesData
              this.pageSize = this.pageSizeOptions[0]
              this.totalRecords = this.scheduledClassesData.length
              this.paginationHelper();
        } else if (error) {
            // Handle error 
        }
    }*/

    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage(){
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }

    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        let filteredRecords = []
        if(searchKey){
            this.delayTimeout = setTimeout(() => {
                //this.setPaginationControls();

                this.searchKey = searchKey;
                filteredRecords = this.scheduledClassesData.filter(rec => JSON.stringify(rec).toLowerCase().includes(searchKey.toLowerCase()));
                this.scheduledClassesData = filteredRecords
                this.totalRecords = this.scheduledClassesData.length
                //this.filtredNum = this.filteredRecords.length; 
                this.paginationHelper();
            }, DELAY);
        }else{
            this.scheduledClassesData = this.allRecordsHolder;
            //this.filtredNum = this.totalRecords;
            this.totalRecords = this.scheduledClassesData.length         
            //this.paginationVisibility = SHOWDIV;
            this.paginationHelper();
        }        
    }

    paginationHelper(){
        //console.log('this.scheduledClassesData===>>', JSON.stringify(this.scheduledClassesData))
        this.recordsToDisplay = []
        this.totalPages = Math.ceil(this.totalRecords/this.pageSize)
        if(this.pageNumber <=1){
            this.pageNumber = 1
        }
        else if (this.pageNumber >= this.totalPages){
            this.pageNumber = this.totalPages
        }

        for(let i = (this.pageNumber-1) * this.pageSize; i < this.pageNumber * this.pageSize; i++){
            if(i == this.totalRecords){
                break;
            }
            this.recordsToDisplay.push(this.scheduledClassesData[i])
        }
    }
}