import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardDocumentIcon, DocumentDuplicateIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { parseExcelData, generateMarkdownTable, copyToClipboard } from '@/lib/excel-converter';
import { MarkdownTablePreview } from '@/components/MarkdownTablePreview';

function App() {
  const [inputData, setInputData] = useState('');
  const [markdownOutput, setMarkdownOutput] = useState('');
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsConverting(true);
    setError('');

    try {
      const clipboardData = e.clipboardData.getData('text');
      setInputData(clipboardData);

      const parsedData = parseExcelData(clipboardData);
      const markdown = generateMarkdownTable(parsedData);
      setMarkdownOutput(markdown);
      
      toast.success('🎉 Table converted successfully! Your data looks amazing!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse table data';
      setError(errorMessage);
      setMarkdownOutput('');
      toast.error(`😞 ${errorMessage}`);
    } finally {
      setIsConverting(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
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
            Transform your Excel tables into beautiful Markdown format with just a simple paste ✨
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="h-fit border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ClipboardDocumentIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Excel Data Input
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="✨ Paste your copied Excel table data here (Ctrl+V)..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onPaste={handlePaste}
                className="min-h-48 font-mono text-sm resize-none border-2 border-primary/20 focus:border-primary/40 bg-gradient-to-br from-background to-muted/20"
                disabled={isConverting}
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
                  variant="outline"
                  onClick={handleClearAll}
                  disabled={!inputData && !markdownOutput}
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
                    <span>Click in the text area above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">📝</span>
                    <span>Paste the data (Ctrl+V)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✨</span>
                    <span>View the converted Markdown table on the right</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-2 border-accent/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-accent/5">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 border-b">
                <CardTitle className="flex items-center justify-between text-xl">
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
              <CardContent>
                {markdownOutput ? (
                  <Textarea
                    value={markdownOutput}
                    readOnly
                    className="min-h-48 font-mono text-sm resize-none bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-accent/20"
                  />
                ) : (
                  <div className="min-h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed border-accent/30 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <div>Markdown table will appear here after conversion</div>
                      <div className="text-sm mt-1 text-accent">Ready to transform your data! ✨</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="text-2xl">👀</span>
                  </div>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Table Preview
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownTablePreview markdown={markdownOutput} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;