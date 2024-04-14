const { Engine } = require('bpmn-engine')
const { EventEmitter } = require('events')

const xml = 
`
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL &#10;        http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd">
  <process id="process_1" isExecutable="true">
    <startEvent id="Event_0yanz2q">
      <outgoing>Flow_0vqtfh6</outgoing>
    </startEvent>
    <endEvent id="Event_0qft2ed">
      <incoming>Flow_0ld9256</incoming>
    </endEvent>
    <sequenceFlow id="Flow_0vqtfh6" sourceRef="Event_0yanz2q" targetRef="Activity_0oibyg2" />
    <sequenceFlow id="Flow_0ld9256" sourceRef="Activity_0oibyg2" targetRef="Event_0qft2ed" />
    <dataObjectReference id="inputFromUserRef" dataObjectRef="inputFromUser" />
    <dataObject id="inputFromUser" />
    <userTask id="Activity_0oibyg2">
      <incoming>Flow_0vqtfh6</incoming>
      <outgoing>Flow_0ld9256</outgoing>
      <ioSpecification id="inputSpec">
        <dataOutput id="userInput" name="sirname" />
      </ioSpecification>
      <dataOutputAssociation id="associatedWith" sourceRef="userInput" targetRef="inputFromUserRef" />
    </userTask>
  </process>
  <bpmndi:BPMNDiagram>
    <bpmndi:BPMNPlane bpmnElement="process_1">
      <bpmndi:BPMNShape id="Event_0yanz2q_di" bpmnElement="Event_0yanz2q">
        <omgdc:Bounds x="152" y="112" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0qft2ed_di" bpmnElement="Event_0qft2ed">
        <omgdc:Bounds x="232" y="362" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0koumfm_di" bpmnElement="Activity_0oibyg2">
        <omgdc:Bounds x="230" y="210" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0vqtfh6_di" bpmnElement="Flow_0vqtfh6">
        <omgdi:waypoint x="188" y="130" />
        <omgdi:waypoint x="209" y="130" />
        <omgdi:waypoint x="209" y="230" />
        <omgdi:waypoint x="230" y="230" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ld9256_di" bpmnElement="Flow_0ld9256">
        <omgdi:waypoint x="280" y="290" />
        <omgdi:waypoint x="280" y="326" />
        <omgdi:waypoint x="250" y="326" />
        <omgdi:waypoint x="250" y="362" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`

const engine = new Engine({
    name: 'Process BPMN Engine',
    source: xml,
})
engine.once('end', execution => {
    console.log(execution.environment.variables)
    console.log(`User sirname is ${execution.environment.output.data.inputFromUser}`)
})

const listener = new EventEmitter()
listener.once('wait', task => {
    task.signal({
        ioSpecification: {
            dataOutputs: [
                {
                    id: 'userInput',
                    value: 'von Rosen',
                },
            ]
        }
    })
})

engine.execute({
    listener,
}, err => {
    if (!!err) console.error(err)
})
