'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useEffect } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  useEffect(() => {
    // Intercept footnote reference clicks and open URLs directly
    const handleFootnoteClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked element is a sup element or inside one
      const supElement = target.closest('sup');
      if (!supElement) return;
      
      // Find the link inside the sup element
      const link = supElement.querySelector('a') as HTMLAnchorElement;
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      // Get the footnote ID
      const footnoteId = href.replace('#', '');
      
      // Find the footnotes section
      const footnotesSection = document.querySelector('[data-footnotes]');
      if (!footnotesSection) return;
      
      // Find all list items in the footnotes section
      const footnoteItems = footnotesSection.querySelectorAll('li');
      
      // Extract the number from the link (e.g., "user-content-fn-6" -> "6")
      const footnoteNumber = footnoteId.match(/\d+$/)?.[0];
      if (!footnoteNumber) return;
      
      // Find the corresponding list item (0-indexed, so subtract 1)
      const footnoteIndex = parseInt(footnoteNumber) - 1;
      const footnoteItem = footnoteItems[footnoteIndex];
      if (!footnoteItem) return;
      
      // Find the actual external link within the footnote
      const footnoteLink = footnoteItem.querySelector('a[href^="http"]') as HTMLAnchorElement;
      if (footnoteLink) {
        // Open the citation URL in a new tab
        window.open(footnoteLink.href, '_blank', 'noopener,noreferrer');
      }
    };

    document.addEventListener('click', handleFootnoteClick, true);
    return () => document.removeEventListener('click', handleFootnoteClick, true);
  }, []);

  return (
    <div className="markdown-content [&_.data-footnote-backref]:hidden [&_[data-footnotes]_li]:mb-3 [&_[data-footnotes]_li_p]:inline [&_[data-footnotes]_li_p]:mb-0 [&_ol_li_p]:inline [&_ol_li_p]:mb-0 [&_ul_li_p]:inline [&_ul_li_p]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4 font-serif border-b-2 border-saffron-300 pb-3" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4 font-serif border-l-4 border-saffron-600 pl-4" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-3 font-serif text-saffron-900" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-2 font-serif" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6 ml-4" {...props} />
        ),
        li: ({ node, ...props }: any) => {
          // Check if this is a footnote list item
          if (props.id && props.id.startsWith('user-content-fn-')) {
            return (
              <li className="text-gray-700 mb-3" {...props} />
            );
          }
          return <li className="text-gray-700" {...props} />;
        },
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-saffron-600 bg-gradient-to-r from-saffron-50 to-sandalwood-50 pl-8 pr-4 italic font-semibold text-gray-800 my-8 py-4 rounded-r-lg shadow-sm text-center"
            {...props}
          />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-saffron-100 text-saffron-900 px-2 py-1 rounded text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm font-mono"
              {...props}
            />
          ),
        pre: ({ node, ...props }) => (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-saffron-700 hover:text-vermillion-700 underline font-medium decoration-saffron-300 hover:decoration-vermillion-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-gray-900" {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className="italic text-gray-800" {...props} />
        ),
        hr: ({ node, ...props }) => (
          <hr className="border-t-2 border-saffron-300 my-12" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-8">
            <table className="min-w-full divide-y divide-saffron-300 border border-saffron-200 rounded-lg" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gradient-to-r from-saffron-100 to-sandalwood-100" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="bg-white divide-y divide-saffron-200" {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr {...props} />
        ),
        th: ({ node, ...props }) => (
          <th
            className="px-6 py-3 text-left text-xs font-bold text-saffron-900 uppercase tracking-wider"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props} />
        ),
        sup: ({ node, ...props }) => (
          <sup className="text-saffron-700 hover:text-vermillion-700 font-semibold" {...props} />
        ),
        section: ({ node, ...props }: any) => {
          // Check if this is a footnotes section
          if (props['data-footnotes']) {
            return (
              <section className="mt-16 pt-8 border-t-2 border-saffron-300" {...props}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Footnotes</h2>
                {props.children}
              </section>
            );
          }
          return <section {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
