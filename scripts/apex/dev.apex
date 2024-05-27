//SchedulerBatchUtils.retrieveScheduledClasses();

List<String> interfaceNames = new List<String>{'Schedulable', 'Batchable'};
List<ApexTypeImplementor> lst = [SELECT Id, ClassName, ApexClassId, DurableId FROM ApexTypeImplementor WHERE InterfaceName IN : interfaceNames];
system.debug(lst);