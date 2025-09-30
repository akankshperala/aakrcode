"use client";

import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
// Import a CSS theme for PrismJS
import 'prismjs/themes/prism-tomorrow.css'; 

// A simple component that uses the library to provide syntax highlighting
const CodeEditor = ({ code, setCode, language }) => {
  return (
    <Editor
      value={code}
      onValueChange={newCode => setCode(newCode)}
      highlight={code => highlight(code, languages[language] || languages.clike, language)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 14,
        backgroundColor: '#2d2d2d', // Matches prism-tomorrow theme
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '300px',
      }}
    />
  );
};

export default CodeEditor;