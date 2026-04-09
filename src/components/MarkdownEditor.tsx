"use client";

import React, { useState, useRef } from 'react';

export function MarkdownEditor({ 
    defaultValue = "", 
    name = "content", 
    placeholder = "Type your description here..." 
}: { 
    defaultValue?: string;
    name?: string;
    placeholder?: string;
}) {
    const [content, setContent] = useState(defaultValue);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const selectedText = text.substring(start, end);
        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);

        setContent(newText);

        // Reset cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-shadow bg-white">
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-1 overflow-x-auto">
                <button type="button" onClick={() => insertText("**", "**")} className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors" title="Bold">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                </button>
                <button type="button" onClick={() => insertText("*", "*")} className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors" title="Italic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                </button>
                <button type="button" onClick={() => insertText("\n### ")} className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors" title="Heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M4 18V6M20 18V6"></path></svg>
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <button type="button" onClick={() => insertText("[", "](url)")} className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors" title="Link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </button>
                <button type="button" onClick={() => insertText("\n- ")} className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors" title="List">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                </button>
            </div>
            <textarea
                ref={textareaRef}
                name={name}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={10}
                className="w-full p-4 border-none focus:ring-0 resize-y font-mono text-sm leading-relaxed"
            />
        </div>
    );
}
