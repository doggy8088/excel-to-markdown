import { generateMarkdownTable } from './excel-converter';

export interface ParsedMarkdownTable {
  headers: string[];
  rows: string[][];
}

const HTML_BREAK_REGEX = /<br\s*\/?>/gi;

function trimOuterPipes(line: string) {
  return line.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
}

function splitMarkdownRow(line: string) {
  const cells: string[] = [];
  let current = '';
  let escaping = false;

  const trimmedLine = trimOuterPipes(line.trim());

  for (const char of trimmedLine) {
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }

    if (char === '\\') {
      escaping = true;
      continue;
    }

    if (char === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());

  return cells;
}

function sanitizeCellContent(cell: string) {
  return cell.replace(/\\\|/g, '|').replace(HTML_BREAK_REGEX, '\n').trim();
}

export function isMarkdownTable(input: string) {
  if (!input?.trim()) return false;

  const lines = input
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  if (lines.length < 2) return false;

  // Find the first table by looking for a valid header-separator pattern
  for (let i = 0; i < lines.length - 1; i++) {
    const headerCells = splitMarkdownRow(lines[i]);
    if (headerCells.length === 0) continue;

    const separatorCells = splitMarkdownRow(lines[i + 1]);
    if (separatorCells.length !== headerCells.length) continue;

    const isValidSeparator = separatorCells.every(cell => {
      const normalized = cell.replace(/\s/g, '');
      if (!normalized) return false;

      const withoutColons = normalized.replace(/:/g, '');
      if (withoutColons.length < 3) return false;

      return /^:?-{3,}:?$/.test(normalized);
    });

    if (isValidSeparator && headerCells.some(cell => cell.length > 0)) {
      return true;
    }
  }

  return false;
}

export function parseMarkdownTable(markdown: string): ParsedMarkdownTable | null {
  if (!isMarkdownTable(markdown)) {
    return null;
  }

  const lines = markdown
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  // Find the first valid table
  for (let i = 0; i < lines.length - 1; i++) {
    const headerCells = splitMarkdownRow(lines[i]);
    if (headerCells.length === 0) continue;

    const separatorCells = splitMarkdownRow(lines[i + 1]);
    if (separatorCells.length !== headerCells.length) continue;

    const isValidSeparator = separatorCells.every(cell => {
      const normalized = cell.replace(/\s/g, '');
      if (!normalized) return false;

      const withoutColons = normalized.replace(/:/g, '');
      if (withoutColons.length < 3) return false;

      return /^:?-{3,}:?$/.test(normalized);
    });

    if (isValidSeparator && headerCells.some(cell => cell.length > 0)) {
      // Found the first valid table
      const sanitizedHeaders = headerCells.map(sanitizeCellContent);
      const dataStartIndex = i + 2;
      
      // Extract data rows until we find a non-table line or another table
      const rows: string[][] = [];
      for (let j = dataStartIndex; j < lines.length; j++) {
        const line = lines[j].trim();
        
        // Check if this line is part of the table (starts with |)
        if (!line.startsWith('|')) {
          break; // End of table
        }
        
        const cells = splitMarkdownRow(line).map(sanitizeCellContent);
        const normalized = [...cells];

        while (normalized.length < sanitizedHeaders.length) {
          normalized.push('');
        }

        rows.push(normalized.slice(0, sanitizedHeaders.length));
      }

      return {
        headers: sanitizedHeaders,
        rows,
      };
    }
  }

  return null;
}

export function normalizeMarkdownTable(markdown: string) {
  const parsed = parseMarkdownTable(markdown);
  if (!parsed) {
    return null;
  }

  return generateMarkdownTable([parsed.headers, ...parsed.rows]);
}
