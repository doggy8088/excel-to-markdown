interface MarkdownTablePreviewProps {
  markdown: string;
}

export function MarkdownTablePreview({ markdown }: MarkdownTablePreviewProps) {
  if (!markdown.trim()) {
    return (
      <div className="text-muted-foreground text-center py-12 bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg border-2 border-dashed border-accent/30">
        <div className="text-4xl mb-3">📋</div>
        <div className="text-lg">Paste Excel table data to see the preview</div>
        <div className="text-sm text-accent mt-2">Watch your table come to life! ✨</div>
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
      <div className="text-destructive text-center py-12 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-lg border-2 border-dashed border-destructive/30">
        <div className="text-4xl mb-3">⚠️</div>
        <div className="text-lg font-medium">Invalid table format</div>
        <div className="text-sm mt-2">Please check your Excel data and try again</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse border-2 border-primary/20 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
            {tableData.headers.map((header, index) => (
              <th
                key={index}
                className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary bg-gradient-to-br from-primary/5 to-accent/5"
              >
                {header || ' '}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={`transition-colors hover:bg-accent/10 ${
              rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'
            }`}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-primary/10 px-4 py-3 text-foreground"
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