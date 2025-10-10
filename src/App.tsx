import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
      
      toast.success('Table converted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse table data';
      setError(errorMessage);
      setMarkdownOutput('');
      toast.error(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyMarkdown = async () => {
    if (!markdownOutput) return;

    try {
      await copyToClipboard(markdownOutput);
      toast.success('Markdown copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClearAll = () => {
    setInputData('');
    setMarkdownOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
            Excel to Markdown Converter
          </h1>
          <p className="text-muted-foreground">
            Copy a table from Excel and paste it here to convert to Markdown format
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardDocumentIcon className="w-5 h-5" />
                Excel Data Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your copied Excel table data here (Ctrl+V)..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onPaste={handlePaste}
                className="min-h-48 font-mono text-sm resize-none"
                disabled={isConverting}
              />
              
              {error && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  disabled={!inputData && !markdownOutput}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Select and copy a table from Excel (Ctrl+C)</li>
                  <li>Click in the text area above</li>
                  <li>Paste the data (Ctrl+V)</li>
                  <li>View the converted Markdown table on the right</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <DocumentDuplicateIcon className="w-5 h-5" />
                    Markdown Output
                  </div>
                  {markdownOutput && (
                    <Button
                      onClick={handleCopyMarkdown}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Copy Markdown
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {markdownOutput ? (
                  <Textarea
                    value={markdownOutput}
                    readOnly
                    className="min-h-48 font-mono text-sm resize-none bg-muted/30"
                  />
                ) : (
                  <div className="min-h-48 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-md">
                    Markdown table will appear here after conversion
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Table Preview</CardTitle>
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