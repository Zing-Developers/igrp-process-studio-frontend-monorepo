"use client";

import { useState } from "react";
import {
  IGRPBpmnModeler,
  IGRPZoomControls,
  IGRPBpmnControls,
} from "@igrp/framework-process-studio-bpmn-editor";
import type {
  Project,
  PaginatedResponse,
  ProcessDefinition,
} from "@igrp/framework-process-studio-types";

// Test BPMN XML
const testBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Sample Task">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="392" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="400" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="392" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// Test data
const createProcessDefinition: ProcessDefinition = {
  title: "Employee Onboarding Process",
  description: "Complete workflow for onboarding new employees",
  projectId: "proj-001",
  status: "ACTIVE",
  processDefinitionId: "proc-001",
  version: "1.0.0",
  statusDesc: "Process is active and ready for execution",
};

const createProject: Project = {
  code: "HR-PROJECTS",
  name: "Human Resources Processes",
  description: "Collection of HR-related business processes",
  projectId: "proj-001",
  processDefinitions: [createProcessDefinition],
};

export default function Home() {
  const [currentXml, setCurrentXml] = useState(testBpmnXml);
  const [modelerInstance, setModelerInstance] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleXmlChange = (xml: string) => {
    setCurrentXml(xml);
    console.log("BPMN XML changed, new length:", xml.length);
  };

  const handleModelerLoad = (modeler: any) => {
    setModelerInstance(modeler);
    console.log("BPMN Modeler loaded successfully");
    console.log("Modeler instance:", typeof modeler);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">IGRP Process Studio</h1>

        <IGRPBpmnModeler
          xml={""}
          processKey="test-process"
          processName="Test Process"
          onChange={handleXmlChange}
          onLoad={handleModelerLoad}
        />
      </div>
    </main>
  );
}
