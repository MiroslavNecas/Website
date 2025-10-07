import React, { useRef } from 'react';
import { Bold, Italic, Code, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Editor = ({ value, onChange }) => {
  const textareaRef = useRef(null);

  const applyFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText;

    switch (format) {
      case 'bold':
        newText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        newText = `<em>${selectedText}</em>`;
        break;
      case 'code':
        newText = `<pre><code class="language-javascript">${selectedText}</code></pre>`;
        break;
      case 'link':
        const url = prompt("Enter the URL:");
        if (url) {
          newText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
        } else {
          newText = selectedText;
        }
        break;
      default:
        newText = selectedText;
    }

    const updatedValue = value.substring(0, start) + newText + value.substring(end);
    onChange({ target: { value: updatedValue } });
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-lg">
      <div className="flex items-center p-2 border-b border-white/20">
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('bold')} className="text-white"><Bold size={16} /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('italic')} className="text-white"><Italic size={16} /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('code')} className="text-white"><Code size={16} /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat('link')} className="text-white"><LinkIcon size={16} /></Button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        rows={12}
        className="w-full p-4 bg-transparent rounded-b-lg text-white placeholder-gray-400 focus:outline-none resize-y"
        required
      />
    </div>
  );
};

export default Editor;