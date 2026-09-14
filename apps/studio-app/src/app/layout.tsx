import "@/styles/globals.css";
import "@igrp/framework-process-studio-bpmn-editor/dist/src/styles.css";
import "@igrp/igrp-framework-react-design-system/dist/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}