import { useState } from 'react';
import { parseMarkdownTable, ParsedMarkdownTable } from '@/lib/markdown-table';

interface MarkdownTablePreviewProps {
  markdown: string;
}

type SortDirection = 'asc' | 'desc' | null;

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
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  const handleHeaderClick = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const sortedRows = [...tableData.rows];
  if (sortColumn !== null && sortDirection !== null) {
    sortedRows.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      
      // Try to compare as numbers first
      const aNum = parseFloat(aVal.replace(/,/g, ''));
      const bNum = parseFloat(bVal.replace(/,/g, ''));
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // Fall back to string comparison
      const comparison = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  return (
    <div className="w-full px-6 pb-6 pt-6">
      <table className="w-full border-collapse border-2 border-primary/20 overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
            {tableData.headers.map((header, index) => (
              <th
                key={index}
                onClick={() => handleHeaderClick(index)}
                className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary bg-gradient-to-br from-primary/5 to-accent/5 cursor-pointer hover:bg-primary/10 transition-colors select-none"
                title="Click to sort"
              >
                <div className="flex items-center gap-2">
                  <span>
                    {header.split('\n').map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {line || ' '}
                        {lineIndex < header.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                  {sortColumn === index && (
                    <span className="text-sm">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
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
