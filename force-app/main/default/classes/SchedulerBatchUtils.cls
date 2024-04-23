/**
 * @description       : 
 * @author            : 
 * @group             : 
 * @last modified on  : 04-23-2024
 * @last modified by  : Aditya M
**/
public class SchedulerBatchUtils {
    @AuraEnabled (cacheable=true)
    public static List<ApexTypeImplementor> retrieveScheduledClasses(String interfaceName){
        return [SELECT Id, ClassName, ApexClassId, DurableId FROM ApexTypeImplementor WHERE InterfaceName =: interfaceName];
    }

    @AuraEnabled (cacheable=true)
    public static void scheduleApexClass(String scheduleJobName, String cronExpression, String apexClassName){
        try{
            Type scheduleApexType = Type.forName(apexClassName);
            Object obj = scheduleApexType.newInstance();
            if (obj instanceof Schedulable) {
                Schedulable scheduler = (Schedulable)obj;
    
                // Schedule the job
                String jobId = System.schedule(scheduleJobName, cronExpression, scheduler);
                System.debug('Job ID: ' + jobId);
            }
            else{
                throw newExceptionMessage('The class does not implement the Schedulable interface');
            }
        }
        catch(Exception ex){
            System.debug('Exception occurred: ' + ex.getMessage());
            throw newExceptionMessage(ex.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)
    public static List<AsyncApexJob> retrieveScheduleJobDetails(String apexClassName){
        try {
            List<AsyncApexJob> scheduleJobDetails = new List<AsyncApexJob>();
            scheduleJobDetails = [SELECT ApexClassId, ApexClass.Name, CronTriggerId,Crontrigger.CronJobDetail.Name, CronTrigger.CronExpression FROM AsyncApexJob where ApexClass.Name =: apexClassName];
            system.debug('scheduleJobDetails--->>' + scheduleJobDetails);
            return scheduleJobDetails;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    private static AuraHandledException newExceptionMessage(String message){
        AuraHandledException lwcException = new AuraHandledException(message);
        lwcException.setMessage(message);
        return lwcException;
    }
}