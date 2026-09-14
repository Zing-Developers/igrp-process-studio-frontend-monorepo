import { cn } from "../lib/utils";
import BpmnJS from "bpmn-js/lib/Modeler";
import { useRef, useEffect, useState } from "react";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";
import "../bpmn-theme.css";
import diagramXML from "../resources/newDiagram";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import ZoomControls from "./ZoomControls";

import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import BpmnControls from "./BpmnControls";
import { SaveSVGResult } from "bpmn-js/lib/BaseViewer";

interface BpmnModelerProps {
  xml?: string;
  onChange?: (xml: string) => void;
  onLoad?: (modeler: BpmnJS) => void;
  processKey: string;
  processName: string;
  className?: string;
}

// Theme follows the `.dark` class set on <html> by next-themes.
const getIsDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

// Default element colors handed to bpmn-js' BpmnRenderer. Elements with their
// own BPMN di colors keep them — these only fill in the defaults.
const rendererColors = (isDark: boolean) =>
  isDark
    ? {
        defaultFillColor: "hsl(240, 6%, 16%)",
        defaultStrokeColor: "hsl(225, 10%, 90%)",
        defaultLabelColor: "hsl(225, 10%, 90%)",
      }
    : {
        defaultFillColor: "white",
        defaultStrokeColor: "black",
        defaultLabelColor: "black",
      };

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
  // The XML the modeler currently holds — whatever it last imported or emitted.
  // Used to (a) restore the diagram when the modeler is recreated (theme toggle)
  // and (b) recognise an echo of our own output coming back through the `xml`
  // prop, so we don't reimport and blow away the user's selection/cursor.
  const latestXmlRef = useRef<string | undefined>(xml);
  // Freshest `xml` prop value (read after async init to catch content that
  // arrived while the modeler was still initialising) and a flag marking the
  // modeler ready, so the sync effect never imports concurrently with init.
  const xmlPropRef = useRef<string | undefined>(xml);
  xmlPropRef.current = xml;
  const readyRef = useRef(false);
  // Keep callbacks in refs so the modeler isn't recreated when their identity
  // changes (e.g. the parent's handler closes over freshly-loaded data).
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(getIsDark);

  // Watch the `.dark` class on <html> and follow the app theme at runtime.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const target = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(getIsDark()));
    observer.observe(target, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
        bpmnRenderer: rendererColors(isDark),
      });
    } catch (err) {
      console.error("Error creating BPMN modeler:", err);
      return;
    }

    modelerRef.current = modeler;
    readyRef.current = false;
    let disposed = false;

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
        onLoadRef.current?.(modeler);

        // Ensure the modeler is fully initialized before importing XML
        await new Promise((resolve) => setTimeout(resolve, 50));

        const canvas = modeler.get("canvas");

        // Pick the content to load. Prefer in-progress edits preserved across a
        // theme-toggle recreation (latestXmlRef); otherwise use the freshest xml
        // prop — by now the parent has usually replaced the transient empty
        // placeholder with the real process xml, so we avoid creating (and
        // worse, auto-saving) a default diagram over real content.
        const source = latestXmlRef.current || xmlPropRef.current;

        if (source) {
          const result = await modeler.importXML(source);
          const { warnings } = result;
          if (warnings && warnings.length) {
            console.warn("Warnings during BPMN import:", warnings);
          }
          latestXmlRef.current = source;
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
              latestXmlRef.current = xml;
              onChangeRef.current?.(xml);
            }
          } catch (err) {
            console.error("Failed to save BPMN XML:", err);
          }
        });

        // The modeler is ready; let the sync effect import external changes.
        readyRef.current = true;

        // Content may have arrived via the `xml` prop while we were still
        // initialising (the sync effect bails until ready). Reconcile it now,
        // sequentially, so we never run two imports at once.
        const freshXml = xmlPropRef.current;
        if (!disposed && freshXml && freshXml !== latestXmlRef.current) {
          await modeler.importXML(freshXml);
          if (disposed) return;
          latestXmlRef.current = freshXml;
          (modeler.get("canvas") as any).zoom("fit-viewport");
        }
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

    // Removed example snippet (debounce/setEncoded) not used in this app

    // Start initialization
    initializeModeler();

    return () => {
      disposed = true;
      readyRef.current = false;
      try {
        if (modelerRef.current) {
          (modelerRef.current as any).destroy();
          modelerRef.current = null;
        }
      } catch (err) {
        console.error("Error destroying BPMN modeler:", err);
      }
    };
  }, [processKey, processName, isDark]);

  // Sync genuinely-external xml changes into the existing modeler without
  // recreating it. We skip echoes of our own output (the parent feeds the
  // emitted xml back through this prop on every edit) so editing never reloads
  // the diagram and loses the selected element / focused panel field.
  useEffect(() => {
    const modeler = modelerRef.current;
    if (!modeler || !readyRef.current) return; // init reconciles otherwise
    if (!xml) return; // nothing / placeholder
    if (xml === latestXmlRef.current) return; // echo or already current

    let cancelled = false;
    (async () => {
      try {
        await modeler.importXML(xml);
        if (cancelled) return;
        latestXmlRef.current = xml;
        (modeler.get("canvas") as any).zoom("fit-viewport");
      } catch (err) {
        console.error("Failed to import BPMN XML:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [xml]);

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
      latestXmlRef.current = xml;
      onChangeRef.current?.(xml);
    } catch (err) {
      console.error("Error creating new diagram:", err);
      throw err; // Re-throw to allow proper error handling
    }
  };

  const togglePanel = () => {
    setIsPanelCollapsed((prev) => {
      const next = !prev;
      // Allow CSS transition to complete, then tell canvas to recalc size
      setTimeout(() => {
        try {
          const canvas = modelerRef.current?.get("canvas");
          if (canvas && typeof (canvas as any).resized === "function") {
            (canvas as any).resized();
          } else if (canvas && typeof (canvas as any).zoom === "function") {
            (canvas as any).zoom("fit-viewport");
          }
        } catch (e) {
          // no-op
        }
      }, 310);
      return next;
    });
  };

  const onUploadDiagram = async (xml: string) => {
    const canvas = modelerRef.current?.get("canvas");

    await modelerRef.current?.importXML(xml);
    (modelerRef.current?.get("canvas") as any).zoom("fit-viewport");

    (canvas as any).zoom("fit-viewport");
  };

  const onDownLoadSvg = async (): Promise<SaveSVGResult | undefined> => {
    return await modelerRef.current?.saveSVG();
  };

  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-13rem)] min-h-[480px] relative border rounded-lg bg-white dark:bg-neutral-900 dark:border-neutral-700",
        className,
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex-1 w-full h-full transition-all duration-300 ease-in-out",
          "bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(0,0,0,0.2)_0.5px,transparent_0)]",
          "dark:bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(255,255,255,0.12)_0.5px,transparent_0)]",
          "bg-[length:10px_10px]",
          "relative",
        )}
      >
        {/* BPMN Controls */}
        {modelerRef.current && (
          <div className="absolute top-4 right-4 backdrop-blur-sm bg-white/70 dark:bg-neutral-800/70 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg p-2 z-10">
            <BpmnControls
              modeler={modelerRef.current}
              processKey={processKey}
              processName={processName}
              onTogglePanel={togglePanel}
              isPanelCollapsed={isPanelCollapsed}
              onUploadDiagram={onUploadDiagram}
              onDownLoadSvg={onDownLoadSvg}
            />
          </div>
        )}

        {/* Zoom Controls */}
        {modelerRef.current && (
          <div className="absolute bottom-12 right-4 backdrop-blur-sm bg-white/70 dark:bg-neutral-800/70 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg p-2 z-10">
            <ZoomControls modeler={modelerRef.current} />
          </div>
        )}
      </div>
      <div
        id="js-properties-panel"
        className={cn(
          "h-full overflow-y-auto transition-all duration-300 ease-in-out",
          isPanelCollapsed ? "w-0" : "w-80 border-l dark:border-neutral-700",
        )}
      />
    </div>
  );
};

export { BpmnModeler };
