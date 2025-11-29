import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  collapsible?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "c",
  filename,
  collapsible = false,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (code: string) => {
    const keywords = /\b(void|int|char|float|double|long|short|unsigned|signed|const|static|struct|typedef|enum|union|if|else|for|while|do|switch|case|default|break|continue|return|sizeof|include|define|ifdef|ifndef|endif|pragma)\b/g;
    const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g;
    const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const numbers = /\b(\d+\.?\d*|\.\d+)\b/g;
    const types = /\b(uint8_t|uint16_t|uint32_t|uint64_t|int8_t|int16_t|int32_t|int64_t|size_t|bool|true|false|NULL)\b/g;
    const operators = /([+\-*/%=<>!&|^~?:])/g;

    let highlighted = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    highlighted = highlighted
      .replace(comments, '<span class="syntax-comment">$1</span>')
      .replace(strings, '<span class="syntax-string">$1</span>')
      .replace(keywords, '<span class="syntax-keyword">$1</span>')
      .replace(types, '<span class="syntax-type">$1</span>')
      .replace(functions, '<span class="syntax-function">$1</span>')
      .replace(numbers, '<span class="syntax-number">$1</span>')
      .replace(operators, '<span class="syntax-operator">$1</span>');

    return highlighted;
  };

  const lines = code.split("\n");

  return (
    <div className={cn("my-4 rounded-lg overflow-hidden border border-border", className)}>
      {(filename || collapsible) && (
        <div className="flex items-center justify-between bg-muted px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-mono text-muted-foreground">{filename}</span>
            )}
            {language && (
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                {language.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 px-2"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
      {isExpanded && (
        <div className="code-block relative">
          <pre className="m-0 p-0">
            <code className="block">
              {lines.map((line, index) => (
                <div key={index} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell pr-4 text-right text-muted-foreground select-none w-12">
                      {index + 1}
                    </span>
                  )}
                  <span
                    className="table-cell"
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(line) || "&nbsp;",
                    }}
                  />
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
