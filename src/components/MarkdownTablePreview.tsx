interface MarkdownTablePreviewProps {
  markdown: string;
}

export function MarkdownTablePreview({ markdown }: MarkdownTablePreviewProps) {
  if (!markdown.trim()) {
    return (
      <div className="text-muted-foreground text-center py-8">
        Paste Excel table data to see the Markdown preview here
      </div>
    );
  }

  const parseMarkdownTable = (md: string) => {
    const lines = md.trim().split('\n');
    if (lines.length < 2) return null;

    const headerLine = lines[0];
    const separatorLine = lines[1];
    const dataLines = lines.slice(2);

    if (!headerLine.includes('|') || !separatorLine.includes('---')) {
      return null;
    }

    const headers = headerLine
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');

    const rows = dataLines.map(line =>
      line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '')
    );

    return { headers, rows };
  };

  const tableData = parseMarkdownTable(markdown);

  if (!tableData) {
    return (
      <div className="text-destructive text-center py-8">
        Invalid table format
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse border border-border rounded-md">
        <thead>
          <tr className="bg-muted">
            {tableData.headers.map((header, index) => (
              <th
                key={index}
                className="border border-border px-3 py-2 text-left font-medium"
              >
                {header || ' '}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-muted/30">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-border px-3 py-2"
                >
                  {cell || ' '}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}