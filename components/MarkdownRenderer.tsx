import React from 'react';
import CodeBlock from './CodeBlock';
import { PhotoIcon } from './IconComponents';

// FIX: Declare 'marked' on the window object for TypeScript
declare global {
  interface Window {
    marked: any;
  }
}

interface MarkdownRendererProps {
  content: string;
  courseContext: string;
  className?: string;
}

const sanitizeHtml = (htmlString: string): string => {
  if (typeof htmlString !== 'string') return '';
  // A very basic sanitizer. For a real-world app, use a library like DOMPurify.
  let sanitized = htmlString;
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gi, '');
  // Remove on* event handler attributes
  sanitized = sanitized.replace(/ on\w+=(['"]?)(?:(?!\1).)*\1/gi, '');
  // Remove javascript: URLs from href attributes
  sanitized = sanitized.replace(/ href=(['"]?)javascript:.*?(['"]?)/gi, ' href="#"');
  return sanitized;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, courseContext, className = '' }) => {
  const handleSearchClick = (term: string) => {
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const renderContent = () => {
    if (!content) return null;
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`|\[searchable\][\s\S]*?\[\/searchable\])/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/\`\`\`(\w+)?\n([\s\S]*)\`\`\`/);
        if (match) {
          const language = match[1] || 'plaintext';
          const code = match[2];
          return <CodeBlock key={index} code={code} language={language} courseContext={courseContext} />;
        }
      }

      if (part.startsWith('[searchable]')) {
        const term = part.replace('[searchable]', '').replace('[/searchable]', '');
        return (
          <button
            key={index}
            onClick={() => handleSearchClick(term)}
            className="inline-flex items-center gap-1.5 bg-slate-700 text-telnet-yellow hover:bg-slate-600 px-2 py-1 rounded-md transition-colors text-base mx-1 border border-slate-600"
          >
            <PhotoIcon className="w-4 h-4" />
            <span className="font-semibold">{term}</span>
          </button>
        );
      }
      
      // Render normal markdown text
      const rawHtml = typeof window.marked?.parse === 'function' ? window.marked.parse(part) : part.replace(/\n/g, '<br />');
      const sanitizedHtml = sanitizeHtml(rawHtml);
      return (
        <span key={index} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      );
    });
  };

  return (
    <article className={`prose prose-lg max-w-none prose-invert prose-p:my-4 prose-li:my-2 ${className}`}>
      {renderContent()}
    </article>
  );
};

export default MarkdownRenderer;