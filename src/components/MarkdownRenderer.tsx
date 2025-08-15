import React from 'react';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
  onLinkClick?: (cardId: string) => void;
  onImageClick?: (src: string, alt: string) => void;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onLinkClick, onImageClick }) => {
  const renderMarkdown = (text: string): JSX.Element => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|!\[[^\]]*\]\([^)]+\)|\n\n)/g);

    return (
      <>
        {parts.map((part, index) => {
          if (!part) return null;
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={index} className="font-semibold text-blue-600 dark:text-blue-400">
                {part.slice(2, -2)}
              </strong>
            );
          } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            return (
              <em key={index} className="italic">
                {part.slice(1, -1)}
              </em>
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
          } else if (part.match(/\[!\[[^\]]*\]\([^)]+\)\]\(([^)]+)\)/)) {
            // Handle clickable images: [![alt](src)](url)
            const match = part.match(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/);
            if (match) {
              const [, alt, src, url] = match;
              return (
                <div key={index} className="my-6 flex justify-center">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="block hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={800}
                      height={400}
                      className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
                    />
                  </a>
                </div>
              );
            }
            return <span key={index}>{part}</span>;
          } else if (part.match(/!\[[^\]]*\]\([^)]+\)/)) {
            const match = part.match(/!\[([^\]]*)\]\(([^)]+)\)/);
            if (match) {
              const [, alt, src] = match;
              return (
                <div key={index} className="my-6 flex justify-center">
                  <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={400}
                    onClick={() => onImageClick && onImageClick(src, alt)}
                    className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
                  />
                </div>
              );
            }
            return <span key={index}>{part}</span>;
          } else if (part.match(/\[([^\]]+)\]\(([^)]+)\)/)) {
            const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match) {
              const [, linkText, linkUrl] = match;
              // Check if it's an external link (starts with http/https)
              if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
                return (
                  <a
                    key={index}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 decoration-dotted decoration-1 underline decoration-gray-300 dark:decoration-gray-600 hover:decoration-blue-500 underline-offset-2 transition-all duration-200"
                  >
                    {linkText}
                  </a>
                );
              } else if (onLinkClick) {
                // Internal link to another card
                return (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLinkClick(linkUrl);
                    }}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 decoration-dotted decoration-1 underline decoration-gray-300 dark:decoration-gray-600 hover:decoration-blue-500 underline-offset-2 transition-all duration-200"
                  >
                    {linkText}
                  </button>
                );
              } else {
                return <span key={index}>{part}</span>;
              }
            }
            return <span key={index}>{part}</span>;
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
        } else if (line.match(/^  - /)) {
          // Handle nested list items with 2-space indentation
          return (
            <div key={index} className="flex items-start space-x-2 ml-6">
              <span className="text-indigo-500 dark:text-indigo-400 mt-1 text-sm">◦</span>
              <div className="flex-1">{renderMarkdown(line.slice(4))}</div>
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
