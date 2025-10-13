import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardDocumentIcon, DocumentDuplicateIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { parseExcelData, generateMarkdownTable, copyToClipboard } from '@/lib/excel-converter';
import { MarkdownTablePreview, getHtmlTableFromMarkdown } from '@/components/MarkdownTablePreview';
import { isMarkdownTable, normalizeMarkdownTable } from '@/lib/markdown-table';

type ConversionType = 'excel' | 'markdown';

function App() {
  const [inputData, setInputData] = useState('');
  const [markdownOutput, setMarkdownOutput] = useState('');
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const skipNextDebounceRef = useRef(false);
  const currentYear = new Date().getFullYear();

  const convertRawDataToMarkdown = useCallback((rawData: string) => {
    if (!rawData.trim()) {
      throw new Error('No data provided');
    }

    if (isMarkdownTable(rawData)) {
      const normalized = normalizeMarkdownTable(rawData);
      if (!normalized) {
        throw new Error('Invalid Markdown table format');
      }

      return {
        markdown: normalized,
        type: 'markdown' as ConversionType,
      };
    }

    const parsedData = parseExcelData(rawData);
    const markdown = generateMarkdownTable(parsedData);

    return {
      markdown,
      type: 'excel' as ConversionType,
    };
  }, []);

  const performConversion = useCallback((
    rawData: string,
    messages?: Partial<Record<ConversionType, string>>
  ) => {
    setIsConverting(true);
    setError('');

    const defaultMessages: Record<ConversionType, string> = {
      excel: '🎉 Table converted successfully! Your data looks amazing!',
      markdown: '✅ Markdown table detected! Preview refreshed automatically!',
    };

    try {
      const { markdown, type } = convertRawDataToMarkdown(rawData);
      setMarkdownOutput(markdown);

      const successMessage = messages?.[type] ?? defaultMessages[type];
      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse table data';
      setError(errorMessage);
      setMarkdownOutput('');
      toast.error(`😞 ${errorMessage}`);
    } finally {
      setIsConverting(false);
    }
  }, [convertRawDataToMarkdown]);

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text');
    skipNextDebounceRef.current = true;
    setInputData(clipboardData);

    performConversion(clipboardData);
  };

  const handleCopyMarkdown = async () => {
    if (!markdownOutput) return;

    try {
      await copyToClipboard(markdownOutput);
      toast.success('📋 Markdown copied to clipboard! Ready to use anywhere!');
    } catch (err) {
      toast.error('😔 Failed to copy to clipboard');
    }
  };

  const handleClearAll = () => {
    setInputData('');
    setMarkdownOutput('');
    setError('');
  };

  const handleManualConvert = () => {
    performConversion(inputData, {
      excel: '🎯 Table updated from your edits!',
      markdown: '✨ Markdown table reformatted from your edits!',
    });
  };

  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (!inputData.trim()) {
      setMarkdownOutput('');
      setError('');
      return;
    }

    debounceTimerRef.current = window.setTimeout(() => {
      performConversion(inputData, {
        excel: '',
        markdown: '',
      });
      debounceTimerRef.current = null;
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [inputData, performConversion]);

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Don't handle paste if user is already in the textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        return;
      }

      e.preventDefault();
      const clipboardData = e.clipboardData?.getData('text');
      if (clipboardData) {
        skipNextDebounceRef.current = true;
        setInputData(clipboardData);
        performConversion(clipboardData);
      }
    };

    document.addEventListener('paste', handleGlobalPaste);

    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [performConversion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
                <DocumentDuplicateIcon className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3 tracking-tight">
              Excel to Markdown Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your Excel tables into beautiful <br/>Markdown format with just a simple paste!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="h-full border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b py-6">
              <CardTitle className="flex items-center gap-3 text-xl min-h-[3rem]">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClipboardDocumentIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Excel Data Input
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-full flex flex-col">
              <Textarea
                placeholder="✨ Paste your copied Excel table data here (Ctrl+V)..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onPaste={handlePaste}
                className="min-h-48 font-mono text-sm resize-none border-2 border-primary/20 focus:border-primary/40 bg-gradient-to-br from-background to-muted/20 flex-1"
              />
              
              {error && (
                <Alert variant="destructive" className="border-2 border-destructive/30 bg-gradient-to-r from-destructive/5 to-destructive/10">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <AlertDescription className="font-medium">
                    😞 {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleManualConvert}
                  disabled={!inputData.trim() || isConverting}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                >
                  ⚙️ Convert
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  disabled={(!inputData && !markdownOutput) || isConverting}
                  className="flex-1 border-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-200"
                >
                  🗑️ Clear All
                </Button>
              </div>

              <div className="text-sm text-muted-foreground bg-gradient-to-r from-muted/50 to-accent/10 p-4 rounded-lg border border-accent/20">
                <p className="font-semibold text-accent mb-2">📋 Quick Start Guide:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">📊</span>
                    <span>Select and copy a table from Excel (Ctrl+C)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">🎯</span>
                    <span>Paste anywhere on the page (Ctrl+V)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✨</span>
                    <span>View the converted Markdown table below</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full border-2 border-accent/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-accent/5">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 border-b py-6">
              <CardTitle className="flex items-center justify-between text-xl min-h-[3rem]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <DocumentDuplicateIcon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Markdown Output
                  </span>
                </div>
                {markdownOutput && (
                  <Button
                    onClick={handleCopyMarkdown}
                    size="sm"
                    className="flex items-center gap-2 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    💾 Copy Markdown
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              {markdownOutput ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-accent/20 rounded-lg p-4 font-mono text-sm overflow-auto flex-1">
                    <pre className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {markdownOutput}
                    </pre>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-accent">📝</span>
                      <span className="font-medium">Raw Markdown Table Code</span>
                    </div>
                    <p className="text-xs">
                      This is the raw Markdown source code that you can copy and paste into any Markdown editor, GitHub, or documentation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground border-2 border-dashed border-accent/30 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div>Markdown table will appear here after conversion</div>
                    <div className="text-sm mt-1 text-accent">Ready to transform your data! ✨</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </div>

        <div className="w-full px-4 py-8">
          <Card className="border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b py-6">
              <CardTitle className="text-xl flex items-center justify-between gap-3 min-h-[3rem]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="text-2xl">👀</span>
                  </div>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Table Preview
                  </span>
                </div>
                {markdownOutput && (
                  <Button
                    size="sm"
                    onClick={async () => {
                      const html = getHtmlTableFromMarkdown(markdownOutput);
                      if (!html) {
                        toast.error('😔 Failed to generate HTML table');
                        return;
                      }
                      try {
                        await copyToClipboard(html);
                        toast.success('📄 HTML table copied to clipboard!');
                      } catch (err) {
                        toast.error('😔 Failed to copy HTML table');
                      }
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    Copy HTML
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full">
                <MarkdownTablePreview markdown={markdownOutput} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50 bg-background/60">
        © {currentYear}{' '}
        <a
          href="https://www.facebook.com/will.fans/"
          className="text-primary hover:text-primary/80 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Will 保哥
        </a>
        . All rights reserved. |{' '}
        <a
          href="https://github.com/doggy8088/excel-to-markdown"
          className="text-primary hover:text-primary/80 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo
        </a>
      </footer>
    </div>
  );
}

export default App;
