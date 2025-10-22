export function parseExcelData(clipboardData: string): string[][] {
  if (!clipboardData?.trim()) {
    throw new Error('No data provided');
  }

  const lines = clipboardData.trim().split('\n');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let inQuotedCell = false;
  let currentCell = '';
  let tableStarted = false;
  let tableEnded = false;

  for (let i = 0; i < lines.length; i++) {
    if (tableEnded) break; // Stop processing after first table ends

    const line = lines[i];
    const cells = line.split('\t');

    // Check if this line looks like table data (has at least one tab)
    const isTableRow = line.includes('\t');

    if (!isTableRow && !inQuotedCell) {
      // This is non-table content
      if (tableStarted) {
        // Table has ended - stop processing
        tableEnded = true;
        break;
      }
      // Skip non-table content before table starts
      continue;
    }

    // Mark that we've started processing a table
    if (isTableRow) {
      tableStarted = true;
    }

    for (let j = 0; j < cells.length; j++) {
      let cell = cells[j];

      if (inQuotedCell) {
        currentCell += '\n' + cell;
        if (cell.endsWith('"') && !cell.endsWith('""')) {
          currentCell = currentCell.slice(0, -1);
          currentRow.push(currentCell.trim());
          currentCell = '';
          inQuotedCell = false;
        }
      } else {
        if (cell.startsWith('"') && !cell.endsWith('"')) {
          inQuotedCell = true;
          currentCell = cell.slice(1);
        } else if (cell.startsWith('"') && cell.endsWith('"') && cell.length > 1) {
          currentRow.push(cell.slice(1, -1).trim());
        } else {
          currentRow.push(cell.trim());
        }
      }
    }

    if (!inQuotedCell && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  if (rows.length === 0 || rows.every(row => row.length === 0)) {
    throw new Error('No valid table data found');
  }

  return rows;
}

export function generateMarkdownTable(data: string[][]): string {
  if (data.length === 0) return '';

  const maxColumns = Math.max(...data.map(row => row.length));
  
  const normalizedData = data.map(row => {
    const normalized = [...row];
    while (normalized.length < maxColumns) {
      normalized.push('');
    }
    return normalized;
  });

  const escapeCellContent = (content: string): string => {
    return content
      .replace(/\|/g, '\\|')
      .replace(/\n/g, '<br>')
      .trim() || ' ';
  };

  const header = normalizedData[0];
  const dataRows = normalizedData.slice(1);

  let markdown = '| ' + header.map(escapeCellContent).join(' | ') + ' |\n';
  markdown += '| ' + header.map(() => '---').join(' | ') + ' |\n';
  
  dataRows.forEach(row => {
    markdown += '| ' + row.map(escapeCellContent).join(' | ') + ' |\n';
  });

  return markdown;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve, reject) => {
      if (document.execCommand('copy')) {
        resolve();
      } else {
        reject(new Error('Failed to copy to clipboard'));
      }
      document.body.removeChild(textArea);
    });
  }
}