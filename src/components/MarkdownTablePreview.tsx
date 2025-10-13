import { parseMarkdownTable, ParsedMarkdownTable } from '@/lib/markdown-table';

interface MarkdownTablePreviewProps {
  markdown: string;
}

function generateHtmlTable({ headers, rows }: ParsedMarkdownTable): string {
  const escapeHtml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const renderCell = (content: string) => {
    const sanitized = escapeHtml(content).replace(/\n/g, '<br />');
    return sanitized.length > 0 ? sanitized : '&nbsp;';
  };

  const headerHtml = headers
    .map(header => `      <th>${renderCell(header)}</th>`)
    .join('\n');

  const bodyHtml = rows
    .map(row => {
      const cells = row
        .map(cell => `      <td>${renderCell(cell)}</td>`)
        .join('\n');
      return `    <tr>\n${cells}\n    </tr>`;
    })
    .join('\n');

  return [
    '<table>',
    '  <thead>',
    '    <tr>',
    headerHtml,
    '    </tr>',
    '  </thead>',
    '  <tbody>',
    bodyHtml,
    '  </tbody>',
    '</table>',
  ].join('\n');
}

export function MarkdownTablePreview({ markdown }: MarkdownTablePreviewProps) {
  if (!markdown.trim()) {
    return (
      <div className="text-muted-foreground text-center py-12 bg-gradient-to-br from-accent/5 to-primary/5 border-dashed border-accent/30 m-6 rounded-lg border-2">
        <div className="text-4xl mb-3">📋</div>
        <div className="text-lg">Paste Excel table data to see the preview</div>
        <div className="text-sm text-accent mt-2">Watch your table come to life! ✨</div>
      </div>
    );
  }

  const tableData = parseMarkdownTable(markdown);

  if (!tableData) {
    return (
      <div className="text-destructive text-center py-12 bg-gradient-to-br from-destructive/5 to-destructive/10 border-dashed border-destructive/30 m-6 rounded-lg border-2">
        <div className="text-4xl mb-3">⚠️</div>
        <div className="text-lg font-medium">Invalid table format</div>
        <div className="text-sm mt-2">Please check your Excel data and try again</div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 pb-6 pt-6">
      <table className="w-full border-collapse border-2 border-primary/20 overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
            {tableData.headers.map((header, index) => (
              <th
                key={index}
                className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary bg-gradient-to-br from-primary/5 to-accent/5"
              >
                {header.split('\n').map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line || ' '}
                    {lineIndex < header.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition-colors hover:bg-accent/10 ${
                rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'
              }`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-primary/10 px-4 py-3 text-foreground"
                >
                  {cell.split('\n').map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line || ' '}
                      {lineIndex < cell.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function getHtmlTableFromMarkdown(markdown: string) {
  const parsed = parseMarkdownTable(markdown);
  if (!parsed) {
    return null;
  }
  return generateHtmlTable(parsed);
}
