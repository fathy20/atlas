import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  Link, Link2Off,
  Table, Minus,
  Undo2, Redo2,
  Pilcrow,
  Quote,
  Subscript, Superscript,
  IndentIncrease, IndentDecrease,
  RemoveFormatting,
  ImagePlus,
  Code,
  Type,
  Highlighter,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
}

const ToolbarBtn = ({
  onClick,
  title,
  children,
  active = false,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`
      inline-flex items-center justify-center h-8 w-8 rounded text-sm transition-colors
      ${active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }
    `}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-border mx-0.5 self-center" />;

const FONT_SIZES = [
  { label: '10', value: '1' },
  { label: '12', value: '2' },
  { label: '14', value: '3' },
  { label: '18', value: '4' },
  { label: '24', value: '5' },
  { label: '32', value: '6' },
  { label: '48', value: '7' },
];

const RichTextEditor = ({ content, onChange, placeholder, dir = 'rtl' }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const savedSelectionRef = useRef<Range | null>(null);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showHeadings, setShowHeadings] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => { isUpdatingRef.current = false; }, 0);
    }
  }, [onChange]);

  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  }, [handleInput]);

  const insertHTML = useCallback((html: string) => {
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, html);
    handleInput();
  }, [handleInput]);

  const formatBlock = useCallback((tag: string) => exec('formatBlock', tag), [exec]);

  // ── Link dialog ──
  const openLinkDialog = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
    setLinkUrl('');
    setLinkDialogOpen(true);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith('http') ? linkUrl : 'https://' + linkUrl;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedSelectionRef.current) {
      sel?.removeAllRanges();
      sel?.addRange(savedSelectionRef.current);
    }
    if (sel && sel.toString().length > 0) {
      exec('createLink', url);
    } else {
      insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    }
    setLinkDialogOpen(false);
  };

  // ── Table ──
  const insertTable = () => {
    const rows = prompt('عدد الصفوف:', '3');
    const cols = prompt('عدد الأعمدة:', '3');
    if (!rows || !cols) return;
    const r = parseInt(rows), c = parseInt(cols);
    if (isNaN(r) || isNaN(c) || r < 1 || c < 1) { alert('أرقام غير صالحة'); return; }

    let html = `<table style="border-collapse:collapse;width:100%;margin:1em 0"><tbody>`;
    for (let i = 0; i < r; i++) {
      html += '<tr>';
      for (let j = 0; j < c; j++) {
        const tag = i === 0 ? 'th' : 'td';
        const style = i === 0
          ? 'border:1px solid #ccc;padding:8px;background:#f5f5f5;font-weight:bold;text-align:center'
          : 'border:1px solid #ccc;padding:8px';
        html += `<${tag} style="${style}">${i === 0 ? 'عنوان' : 'خلية'}</${tag}>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    insertHTML(html);
  };

  // ── Image insertion ──
  const insertImage = () => {
    const url = prompt('رابط الصورة:', 'https://');
    if (!url || url === 'https://') return;
    insertHTML(`<img src="${url}" alt="صورة" style="max-width:100%;height:auto;margin:0.5em 0;border-radius:4px" /><p><br></p>`);
  };

  const insertImageFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        insertHTML(`<img src="${base64}" alt="صورة" style="max-width:100%;height:auto;margin:0.5em 0;border-radius:4px" /><p><br></p>`);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // ── Color picker ──
  const colorInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);
  const savedSelBeforeColor = useRef<Range | null>(null);

  const openColorPicker = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedSelBeforeColor.current = sel.getRangeAt(0).cloneRange();
    colorInputRef.current?.click();
  };

  const openBgColorPicker = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedSelBeforeColor.current = sel.getRangeAt(0).cloneRange();
    bgColorInputRef.current?.click();
  };

  const applyColor = (color: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedSelBeforeColor.current) {
      sel?.removeAllRanges();
      sel?.addRange(savedSelBeforeColor.current);
    }
    exec('foreColor', color);
  };

  const applyBgColor = (color: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedSelBeforeColor.current) {
      sel?.removeAllRanges();
      sel?.addRange(savedSelBeforeColor.current);
    }
    exec('hiliteColor', color);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.font-size-dropdown')) setShowFontSize(false);
      if (!target.closest('.headings-dropdown')) setShowHeadings(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-background">
      {/* ── Toolbar ── */}
      <div className="bg-muted/40 border-b px-2 py-1.5 flex flex-wrap items-center gap-0.5">

        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => exec('undo')} title="تراجع (Ctrl+Z)"><Undo2 size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('redo')} title="إعادة (Ctrl+Y)"><Redo2 size={15} /></ToolbarBtn>

        <Divider />

        {/* Block format - Headings dropdown */}
        <div className="relative headings-dropdown">
          <ToolbarBtn
            onClick={(e: any) => { e.stopPropagation(); setShowHeadings(!showHeadings); setShowFontSize(false); }}
            title="تنسيق الفقرة"
          >
            <Pilcrow size={15} />
          </ToolbarBtn>
          {showHeadings && (
            <div className="absolute top-full right-0 mt-1 z-50 bg-popover border rounded-md shadow-lg p-1 min-w-[140px]">
              <button onClick={() => { formatBlock('p'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-sm hover:bg-accent rounded transition-colors">فقرة عادية</button>
              <button onClick={() => { formatBlock('h1'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-xl font-bold hover:bg-accent rounded transition-colors">عنوان 1</button>
              <button onClick={() => { formatBlock('h2'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-lg font-bold hover:bg-accent rounded transition-colors">عنوان 2</button>
              <button onClick={() => { formatBlock('h3'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-base font-semibold hover:bg-accent rounded transition-colors">عنوان 3</button>
              <button onClick={() => { formatBlock('h4'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-sm font-semibold hover:bg-accent rounded transition-colors">عنوان 4</button>
              <button onClick={() => { formatBlock('h5'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-xs font-semibold hover:bg-accent rounded transition-colors">عنوان 5</button>
              <button onClick={() => { formatBlock('h6'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-xs font-medium hover:bg-accent rounded transition-colors">عنوان 6</button>
              <hr className="my-1 border-border" />
              <button onClick={() => { formatBlock('pre'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-sm font-mono hover:bg-accent rounded transition-colors">كود</button>
              <button onClick={() => { formatBlock('blockquote'); setShowHeadings(false); }} className="w-full text-right px-3 py-1.5 text-sm italic hover:bg-accent rounded transition-colors">اقتباس</button>
            </div>
          )}
        </div>

        {/* Font Size dropdown */}
        <div className="relative font-size-dropdown">
          <ToolbarBtn
            onClick={(e: any) => { e.stopPropagation(); setShowFontSize(!showFontSize); setShowHeadings(false); }}
            title="حجم الخط"
          >
            <Type size={15} />
          </ToolbarBtn>
          {showFontSize && (
            <div className="absolute top-full right-0 mt-1 z-50 bg-popover border rounded-md shadow-lg p-1 min-w-[80px]">
              {FONT_SIZES.map(fs => (
                <button
                  key={fs.value}
                  onClick={() => { exec('fontSize', fs.value); setShowFontSize(false); }}
                  className="w-full text-center px-3 py-1.5 text-sm hover:bg-accent rounded transition-colors"
                >
                  {fs.label}px
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Inline formatting */}
        <ToolbarBtn onClick={() => exec('bold')} title="عريض (Ctrl+B)"><Bold size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')} title="مائل (Ctrl+I)"><Italic size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('underline')} title="تحته خط (Ctrl+U)"><Underline size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('strikeThrough')} title="يتوسطه خط"><Strikethrough size={15} /></ToolbarBtn>

        <Divider />

        {/* Subscript / Superscript */}
        <ToolbarBtn onClick={() => exec('subscript')} title="نص سفلي"><Subscript size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('superscript')} title="نص علوي"><Superscript size={15} /></ToolbarBtn>

        <Divider />

        {/* Text Color */}
        <button
          type="button"
          title="لون النص"
          onClick={openColorPicker}
          className="inline-flex items-center justify-center h-8 w-8 rounded text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors relative"
        >
          <span className="font-bold text-base leading-none" style={{ fontFamily: 'serif' }}>A</span>
          <span
            id="color-preview-bar"
            className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-red-500"
          />
        </button>
        <input
          ref={colorInputRef}
          type="color"
          defaultValue="#e53e3e"
          className="sr-only"
          onChange={(e) => {
            const bar = document.getElementById('color-preview-bar');
            if (bar) bar.style.backgroundColor = e.target.value;
            applyColor(e.target.value);
          }}
        />

        {/* Background Color / Highlight */}
        <button
          type="button"
          title="لون تمييز النص"
          onClick={openBgColorPicker}
          className="inline-flex items-center justify-center h-8 w-8 rounded text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors relative"
        >
          <Highlighter size={15} />
          <span
            id="bg-color-preview-bar"
            className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-yellow-300"
          />
        </button>
        <input
          ref={bgColorInputRef}
          type="color"
          defaultValue="#fde047"
          className="sr-only"
          onChange={(e) => {
            const bar = document.getElementById('bg-color-preview-bar');
            if (bar) bar.style.backgroundColor = e.target.value;
            applyBgColor(e.target.value);
          }}
        />

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => exec('justifyRight')} title="محاذاة يمين"><AlignRight size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyCenter')} title="توسيط"><AlignCenter size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyLeft')} title="محاذاة يسار"><AlignLeft size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyFull')} title="ضبط الجانبين"><AlignJustify size={15} /></ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="قائمة نقطية"><List size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="قائمة مرقمة"><ListOrdered size={15} /></ToolbarBtn>

        {/* Indent / Outdent */}
        <ToolbarBtn onClick={() => exec('indent')} title="زيادة المسافة البادئة"><IndentIncrease size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('outdent')} title="تقليل المسافة البادئة"><IndentDecrease size={15} /></ToolbarBtn>

        <Divider />

        {/* Blockquote */}
        <ToolbarBtn onClick={() => formatBlock('blockquote')} title="اقتباس"><Quote size={15} /></ToolbarBtn>

        {/* Code block */}
        <ToolbarBtn onClick={() => formatBlock('pre')} title="كود"><Code size={15} /></ToolbarBtn>

        <Divider />

        {/* Link */}
        <ToolbarBtn onClick={openLinkDialog} title="إدراج رابط"><Link size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('unlink')} title="إزالة الرابط"><Link2Off size={15} /></ToolbarBtn>

        {/* Image */}
        <ToolbarBtn onClick={insertImage} title="إدراج صورة من رابط"><ImagePlus size={15} /></ToolbarBtn>

        <Divider />

        {/* Table */}
        <ToolbarBtn onClick={insertTable} title="إدراج جدول"><Table size={15} /></ToolbarBtn>

        {/* Horizontal rule */}
        <ToolbarBtn onClick={() => insertHTML('<hr style="margin:1em 0;border-color:#e2e8f0"/><p><br></p>')} title="خط فاصل"><Minus size={15} /></ToolbarBtn>

        <Divider />

        {/* Clear formatting */}
        <ToolbarBtn onClick={() => exec('removeFormat')} title="إزالة التنسيق"><RemoveFormatting size={15} /></ToolbarBtn>
      </div>

      {/* ── Link Dialog ── */}
      {linkDialogOpen && (
        <div className="border-b px-3 py-2 bg-accent/30 flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">رابط URL:</span>
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') insertLink(); if (e.key === 'Escape') setLinkDialogOpen(false); }}
            placeholder="https://example.com"
            className="flex-1 text-sm border rounded px-2 py-1 bg-background outline-none focus:ring-1 focus:ring-primary"
            dir="ltr"
          />
          <Button type="button" size="sm" onClick={insertLink}>إدراج</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setLinkDialogOpen(false)}>إلغاء</Button>
        </div>
      )}

      {/* ── Editable Area ── */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        suppressContentEditableWarning
        dir={dir}
        data-placeholder={placeholder}
        className="min-h-[250px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          whiteSpace: 'pre-wrap',
          lineHeight: '1.8',
        }}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] table { border-collapse: collapse; width: 100%; }
        [contenteditable] td, [contenteditable] th { border: 1px solid #d1d5db; padding: 6px 10px; }
        [contenteditable] th { background: #f9fafb; font-weight: 600; }
        [contenteditable] a { color: #3b82f6; text-decoration: underline; }
        [contenteditable] h1 { font-size: 1.8em; font-weight: 700; margin: 0.5em 0; }
        [contenteditable] h2 { font-size: 1.4em; font-weight: 700; margin: 0.5em 0; }
        [contenteditable] h3 { font-size: 1.15em; font-weight: 600; margin: 0.5em 0; }
        [contenteditable] h4 { font-size: 1.05em; font-weight: 600; margin: 0.4em 0; }
        [contenteditable] h5 { font-size: 0.95em; font-weight: 600; margin: 0.4em 0; }
        [contenteditable] h6 { font-size: 0.85em; font-weight: 600; margin: 0.4em 0; }
        [contenteditable] ul { list-style: disc; padding-right: 1.5em; }
        [contenteditable] ol { list-style: decimal; padding-right: 1.5em; }
        [contenteditable] hr { border: none; border-top: 1px solid #e2e8f0; margin: 1em 0; }
        [contenteditable] blockquote { border-right: 3px solid #3b82f6; padding-right: 1em; color: #6b7280; margin: 0.5em 0; font-style: italic; background: #f8fafc; padding: 0.75em 1em; border-radius: 0 4px 4px 0; }
        [contenteditable] pre { background: #1e293b; color: #e2e8f0; padding: 1em; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 0.9em; overflow-x: auto; margin: 0.5em 0; direction: ltr; text-align: left; }
        [contenteditable] code { background: #f1f5f9; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.9em; font-family: 'Courier New', monospace; }
        [contenteditable] img { max-width: 100%; height: auto; border-radius: 4px; margin: 0.5em 0; }
        [contenteditable] sub { font-size: 0.75em; }
        [contenteditable] sup { font-size: 0.75em; }
      `}
      </style>
    </div>
  );
};

export default RichTextEditor;
