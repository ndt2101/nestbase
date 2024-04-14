export const ProcessEnum = {
    START_EVENT_TYPE: 'bpmn:StartEvent',
    START_EVENT_TYPES: [
        'bpmn:StartEvent',
        'bpmn:MessageEventDefinition',
        'bpmn:TimerEventDefinition',
        'bpmn:ConditionalEventDefinition',
        'bpmn:SignalEventDefinition',
    ],
    OUTGOING_TYPE: 'bpmn:outgoing',
    INCOMING_TYPE: 'bpmn:incoming',
}
