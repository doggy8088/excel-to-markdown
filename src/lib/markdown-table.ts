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

  const headerCells = splitMarkdownRow(lines[0]);
  if (headerCells.length === 0) return false;

  const separatorCells = splitMarkdownRow(lines[1]);
  if (separatorCells.length !== headerCells.length) return false;

  const isValidSeparator = separatorCells.every(cell => {
    const normalized = cell.replace(/\s/g, '');
    if (!normalized) return false;

    const withoutColons = normalized.replace(/:/g, '');
    if (withoutColons.length < 3) return false;

    return /^:?-{3,}:?$/.test(normalized);
  });

  if (!isValidSeparator) return false;

  return headerCells.some(cell => cell.length > 0);
}

export function parseMarkdownTable(markdown: string): ParsedMarkdownTable | null {
  if (!isMarkdownTable(markdown)) {
    return null;
  }

  const lines = markdown
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  const headerCells = splitMarkdownRow(lines[0]).map(sanitizeCellContent);
  const separatorIndex = 1;
  const dataLines = lines.slice(separatorIndex + 1);

  const rows = dataLines.map(line => {
    const cells = splitMarkdownRow(line).map(sanitizeCellContent);
    const normalized = [...cells];

    while (normalized.length < headerCells.length) {
      normalized.push('');
    }

    return normalized.slice(0, headerCells.length);
  });

  return {
    headers: headerCells,
    rows,
  };
}

export function normalizeMarkdownTable(markdown: string) {
  const parsed = parseMarkdownTable(markdown);
  if (!parsed) {
    return null;
  }

  return generateMarkdownTable([parsed.headers, ...parsed.rows]);
}
