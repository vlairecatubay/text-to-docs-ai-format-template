import { useCallback, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import mammoth from "mammoth";

interface TemplateUploadProps {
  onTemplateUpload: (file: File, htmlContent?: string) => void;
}

export const TemplateUpload = ({ onTemplateUpload }: TemplateUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const styleMap = `
    p[style-name='Heading 1'] => h1.fresh(class='text-3xl font-bold text-gray-900 mb-4')
    p[style-name='Heading 2'] => h2.fresh(class='text-2xl font-semibold text-gray-800 mb-3')
    p[style-name='Heading 3'] => h3.fresh(class='text-xl font-semibold text-gray-700 mb-2')

    p[style-name='Normal'] => p.fresh(class='text-base text-gray-700 leading-relaxed mb-4')
    p[style-name='Quote'] => blockquote.fresh(class='border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4')
    p[style-name='Code'] => pre.fresh(class='bg-gray-100 text-gray-800 p-3 rounded-md font-mono text-sm mb-4')

    r[style-name='Strong'] => strong(class='font-semibold text-gray-900')
    r[style-name='Emphasis'] => em(class='italic text-gray-700')
    r[style-name='Link'] => a(class='text-blue-600 underline hover:text-blue-800')

    table => table.fresh(class='table-auto border-collapse w-full my-6')
    tr => tr.fresh(class='border-b')
    td => td.fresh(class='px-3 py-2 border')
    th => th.fresh(class='px-3 py-2 border bg-gray-50 font-semibold text-gray-700')

    list => ul.fresh(class='list-disc pl-6 mb-4')
    list[style-name='Numbered List'] => ol.fresh(class='list-decimal pl-6 mb-4')`;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFile = files.find(
        (f) =>
          f.type === "text/plain" ||
          f.name.endsWith(".txt") ||
          f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          f.name.endsWith(".docx"),
      );

      if (validFile) {
        try {
          let content = "";
          let htmlContent;

          if (validFile.name.endsWith(".docx")) {
            const arrayBuffer = await validFile.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer }, { styleMap: styleMap });
            htmlContent = result.value;
            toast({
              title: "Info",
              description: htmlContent,
            });

            // Also extract raw text for the AI
            const textResult = await mammoth.extractRawText({ arrayBuffer });
            content = textResult.value;

            // Create a file with both text and HTML
            const textFile = new File([content], validFile.name, { type: "text/plain" });
            onTemplateUpload(textFile, htmlContent);
          } else {
            onTemplateUpload(validFile);
          }

          toast({
            title: "Template uploaded",
            description: `${validFile.name} added successfully`,
          });
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "Failed to process the document",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload a .txt or .docx file",
          variant: "destructive",
        });
      }
    },
    [onTemplateUpload, toast],
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFile = files.find(
      (f) =>
        f.type === "text/plain" ||
        f.name.endsWith(".txt") ||
        f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        f.name.endsWith(".docx"),
    );

    if (validFile) {
      try {
        let content = "";
        let htmlContent;

        if (validFile.name.endsWith(".docx")) {
          const arrayBuffer = await validFile.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer }, { styleMap: styleMap });
          htmlContent = result.value;
          console.log(result);

          // Also extract raw text for the AI
          const textResult = await mammoth.extractRawText({ arrayBuffer });
          content = textResult.value;

          // Create a file with both text and HTML
          const textFile = new File([content], validFile.name, { type: "text/plain" });
          onTemplateUpload(textFile, htmlContent);
        } else {
          onTemplateUpload(validFile);
        }

        toast({
          title: "Template uploaded",
          description: `${validFile.name} added successfully`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to process the document",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card
      className={`
        relative overflow-hidden backdrop-blur-xl
        bg-gradient-to-br from-white/70 to-white/50
        border-white/20 shadow-lg
        transition-all duration-300
        ${isDragging ? "scale-[1.02] shadow-2xl border-primary" : ""}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div
            className={`
            p-6 rounded-full bg-gradient-primary
            transition-transform duration-300
            ${isDragging ? "scale-110" : "scale-100"}
          `}
          >
            <Upload className="w-8 h-8 text-white" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Upload Template</h3>
            <p className="text-sm text-muted-foreground">Drag & drop your .txt or .docx file here</p>
          </div>

          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
          />

          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </Button>
        </div>
      </div>
    </Card>
  );
};
