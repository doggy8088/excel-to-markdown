export function parseExcelData(clipboardData: string): string[][] {
  if (!clipboardData?.trim()) {
    throw new Error('No data provided');
  }

  const lines = clipboardData.trim().split('\n');
  const rows = lines.map(line => {
    return line.split('\t').map(cell => cell.trim());
  });

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
      .replace(/\n/g, ' ')
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