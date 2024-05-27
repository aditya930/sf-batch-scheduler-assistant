import { LightningElement, api } from 'lwc';
import ModalCmp from 'c/modalCmp'

const DELAY = 300;

export default class BatchClassesCmp extends LightningElement {
    batchClassData = [];
    allRecordsHolder = [];
    recordsToDisplay = [];
    columns = [];

    pageSizeOptions = [10,25,50,75,100];
    pageSize;
    totalPages;
    totalRecords = 0;
    pageNumber = 1
    
    @api
    get batchData(){
        return this.batchClassData
    }
    set batchData(batchData){
        this.batchClassData = batchData.filter(item => item.InterfaceName === "Batchable")
        this.setDataForPagination();
    }

    setDataForPagination(){
        this.allRecordsHolder = [...this.batchClassData]
        this.recordsToDisplay = this.batchClassData
        this.pageSize = this.pageSizeOptions[0]
        this.totalRecords = this.batchClassData.length
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
            {type: "button", label: 'Execute Batch', 
            typeAttributes: {
                label: 'Execute Batch',
                name: 'Execute Batch',
                title: 'Execute Batch',
                disabled: false,
                value: 'executeBatch',
                variant:'Brand'
            }}
        ]
    }

    async callRowAction(event){
        const actionName = event.detail.action.name
        await ModalCmp.open({
            size: 'small',
            description: 'Schedule Modal Popup',
            content: event.detail
        });
    }

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
                this.searchKey = searchKey;
                filteredRecords = this.batchClassData.filter(rec => JSON.stringify(rec).toLowerCase().includes(searchKey.toLowerCase()));
                this.batchClassData = filteredRecords
                this.totalRecords = this.batchClassData.length
                this.paginationHelper();
            }, DELAY);
        }else{
            this.batchClassData = this.allRecordsHolder;
            this.totalRecords = this.batchClassData.length         
            this.paginationHelper();
        }        
    }

    paginationHelper(){
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
            this.recordsToDisplay.push(this.batchClassData[i])
        }
    }

}