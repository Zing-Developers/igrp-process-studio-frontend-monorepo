import { cn } from "../lib/utils";
import BpmnJS from "bpmn-js/lib/Modeler";
import { useRef, useEffect } from "react";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";
import diagramXML from "../resources/newDiagram";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import ZoomControls from "./ZoomControls";

import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import BpmnControls from "./BpmnControls";

interface BpmnModelerProps {
  xml?: string;
  onChange?: (xml: string) => void;
  onLoad?: (modeler: BpmnJS) => void;
  processKey: string;
  processName: string;
  className?: string;
}

const BpmnModeler = ({
  xml,
  onChange,
  onLoad,
  processKey,
  processName,
  className,
}: BpmnModelerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnJS | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let modeler: BpmnJS;

    try {
      modeler = new BpmnJS({
        container: containerRef.current,
        propertiesPanel: {
          parent: "#js-properties-panel",
        },
        additionalModules: [
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          CamundaPlatformPropertiesProviderModule,
        ],
        moddleExtensions: {
          camunda: CamundaBpmnModdle,
        },
      });
    } catch (err) {
      console.error("Error creating BPMN modeler:", err);
      return;
    }

    modelerRef.current = modeler;

    // Wait for the modeler to be fully initialized
    const waitForModeler = () => {
      return new Promise<void>((resolve) => {
        const checkReady = () => {
          try {
            const canvas = modeler.get("canvas");
            if (canvas && (canvas as any)._layers) {
              resolve();
            } else {
              setTimeout(checkReady, 10);
            }
          } catch (err) {
            setTimeout(checkReady, 10);
          }
        };
        checkReady();
      });
    };

    // Initialize the modeler with proper error handling
    const initializeModeler = async () => {
      try {
        // Wait for the modeler to be ready
        await waitForModeler();

        // Now it's safe to call onLoad
        onLoad?.(modeler);

        // Ensure the modeler is fully initialized before importing XML
        await new Promise((resolve) => setTimeout(resolve, 50));

        const canvas = modeler.get("canvas");

        if (xml) {
          // Use Promise API for importXML
          const result = await modeler.importXML(xml);
          const { warnings } = result;
          if (warnings && warnings.length) {
            console.warn("Warnings during BPMN import:", warnings);
          }
          // Adjust zoom after import
          (canvas as any).zoom("fit-viewport");
        } else {
          await createNewDiagram(modeler);
        }

        // Setup change events after successful initialization
        modeler.on("commandStack.changed", async () => {
          try {
            const { xml } = await modeler.saveXML({ format: true });
            // Ensure onChange is called only when xml is successfully retrieved
            if (xml) {
              onChange?.(xml);
            }
          } catch (err) {
            console.error("Failed to save BPMN XML:", err);
          }
        });
      } catch (err) {
        console.error("Error during modeler initialization:", err);
        // Fallback to creating a new diagram
        try {
          await createNewDiagram(modeler);
        } catch (fallbackErr) {
          console.error("Error creating fallback diagram:", fallbackErr);
        }
      }
    };

    // Start initialization
    initializeModeler();

    return () => {
      try {
        if (modelerRef.current) {
          (modelerRef.current as any).destroy();
          modelerRef.current = null;
        }
      } catch (err) {
        console.error("Error destroying BPMN modeler:", err);
      }
    };
  }, [onLoad, onChange, xml, processKey, processName]);

  const createNewDiagram = async (modeler: BpmnJS) => {
    try {
      // Ensure the modeler is ready before creating a new diagram
      await new Promise((resolve) => setTimeout(resolve, 25));

      const xml = diagramXML(processKey, processName);
      const canvas = modeler.get("canvas");

      // Use Promise API for importXML
      const result = await modeler.importXML(xml);
      const { warnings } = result;
      if (warnings && warnings.length) {
        console.warn("Warnings during default diagram import:", warnings);
      }

      // Adjust zoom after import
      (canvas as any).zoom("fit-viewport");

      // Notify the change
      onChange?.(xml);
    } catch (err) {
      console.error("Error creating new diagram:", err);
      throw err; // Re-throw to allow proper error handling
    }
  };

  return (
    <div
      className={cn(
        "flex h-[78vh] relative border rounded-lg bg-white",
        className,
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex-1 w-full h-full transition-all duration-300 ease-in-out",
          "bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(0,0,0,0.2)_0.5px,transparent_0)]",
          "bg-[length:10px_10px]",
          "relative",
        )}
      >
        {/* BPMN Controls */}
        {modelerRef.current && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-2 z-10">
            <BpmnControls
              modeler={modelerRef.current}
              processKey={processKey}
              processName={processName}
            />
          </div>
        )}

        {/* Zoom Controls */}
        {modelerRef.current && (
          <div className="absolute bottom-10 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-2 z-10">
            <ZoomControls modeler={modelerRef.current} />
          </div>
        )}
      </div>
      <div
        id="js-properties-panel"
        className="w-80 h-full  border-l overflow-y-auto"
      />
    </div>
  );
};

export { BpmnModeler };
