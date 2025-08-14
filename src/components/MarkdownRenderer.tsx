import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string): JSX.Element => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n\n)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={index} className="font-semibold text-blue-600 dark:text-blue-400">
                {part.slice(2, -2)}
              </strong>
            );
          } else if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={index}
                className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono"
              >
                {part.slice(1, -1)}
              </code>
            );
          } else if (part === '\n\n') {
            return <br key={index} className="block mb-3" />;
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </>
    );
  };

  const lines = content.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-indigo-500 dark:text-indigo-400 mt-1 text-sm">•</span>
              <div className="flex-1">{renderMarkdown(line.slice(2))}</div>
            </div>
          );
        } else if (line.match(/^\d+\./)) {
          const match = line.match(/^(\d+)\.\s(.*)$/);
          if (match) {
            return (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-indigo-500 dark:text-indigo-400 mt-1 text-sm font-semibold">
                  {match[1]}.
                </span>
                <div className="flex-1">{renderMarkdown(match[2])}</div>
              </div>
            );
          }
        } else if (line.trim()) {
          return (
            <div key={index} className="leading-relaxed">
              {renderMarkdown(line)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default MarkdownRenderer;