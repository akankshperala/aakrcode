"use client";

import { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

export default function CodeEditor({ language, code, setCode, theme = "vs-dark" }) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    // Register languages if needed (Monaco already supports them)
    // Python, Java, C++, C# built-in syntax highlighting
  }, [monaco, language]);

  useEffect(() => {
    if (!monaco) return;

    const model = monaco.editor.getModels()[0];
    if (!model) return;

    const markers = [];
    const lines = model.getLinesContent();

    lines.forEach((line, i) => {
      // -----------------------
      // Python rules
    //   if (language === "python") {
    //     if (line.trim().startsWith("if") && !line.trim().endsWith(":")) {
    //       markers.push({
    //         severity: monaco.MarkerSeverity.Warning,
    //         message: "Python 'if' should end with ':'",
    //         startLineNumber: i + 1,
    //         startColumn: 1,
    //         endLineNumber: i + 1,
    //         endColumn: line.length + 1,
    //       });
    //     }
    //   }

    //   // -----------------------
    //   // C++ rules
    //   if (language === "cpp") {
    //     if (line.includes("int") && !line.trim().endsWith(";")) {
    //       markers.push({
    //         severity: monaco.MarkerSeverity.Warning,
    //         message: "C++ statement might be missing a semicolon",
    //         startLineNumber: i + 1,
    //         startColumn: 1,
    //         endLineNumber: i + 1,
    //         endColumn: line.length + 1,
    //       });
    //     }
    //   }

    //   // -----------------------
    //   // Java rules
    //   if (language === "java") {
    //     if (line.includes("System.out.print") && !line.trim().endsWith(";")) {
    //       markers.push({
    //         severity: monaco.MarkerSeverity.Warning,
    //         message: "Java statement should end with ';'",
    //         startLineNumber: i + 1,
    //         startColumn: 1,
    //         endLineNumber: i + 1,
    //         endColumn: line.length + 1,
    //       });
    //     }
    //   }

    //   // -----------------------
    //   // C# rules
    //   if (language === "csharp") {
    //     if (line.includes("Console.WriteLine") && !line.trim().endsWith(";")) {
    //       markers.push({
    //         severity: monaco.MarkerSeverity.Warning,
    //         message: "C# statement should end with ';'",
    //         startLineNumber: i + 1,
    //         startColumn: 1,
    //         endLineNumber: i + 1,
    //         endColumn: line.length + 1,
    //       });
    //     }
    //   }
    });

    monaco.editor.setModelMarkers(model, "owner", markers);
  }, [monaco, code, language]);

  return (
    <Editor
      height="400px"
      language={language}
      theme={theme}
      value={code}
      onChange={(value) => setCode(value)}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
      }}
    />
  );
}
