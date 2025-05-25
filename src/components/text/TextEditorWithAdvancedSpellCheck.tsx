// src/components/content/TextEditorWithSpellCheck.tsx
import React, { useState, useEffect, CSSProperties } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

interface TextEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  onSave: (text: string) => void;
  title?: string;
}

interface SpellCheckError {
  offset: number;
  length: number;
  message: string;
  shortMessage: string;
  replacements: Array<{ value: string }>;
  rule: {
    id: string;
    description: string;
    issueType: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface LanguageToolResponse {
  matches: SpellCheckError[];
}

const TextEditorWithSpellCheck: React.FC<TextEditorProps> = ({
  isOpen,
  onClose,
  initialText = '',
  onSave,
  title = 'Edit Text'
}) => {
  const [content, setContent] = useState(initialText);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState<'en-US' | 'fr'>('en-US');
  const [spellCheckErrors, setSpellCheckErrors] = useState<SpellCheckError[]>([]);
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
  const [showSpellCheckPanel, setShowSpellCheckPanel] = useState(false);

  // Create lowlight instance
  const lowlight = createLowlight(common);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: initialText,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      
      // Update word and character count
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(text.length);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
        style: `font-size: ${fontSize}px; line-height: 1.7;`,
        spellcheck: 'true',
        lang: language,
      },
    },
  });

  useEffect(() => {
    if (editor && isOpen) {
      editor.commands.setContent(initialText);
      setContent(initialText);
      
      // Update counters for initial content
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(text.length);
    }
  }, [editor, initialText, isOpen]);

  // LanguageTool API spell check
  const checkSpelling = async () => {
    if (!editor) return;
    
    setIsCheckingSpelling(true);
    const text = editor.getText();
    
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          language: language,
          enabledOnly: 'false'
        }),
      });

      if (response.ok) {
        const data: LanguageToolResponse = await response.json();
        setSpellCheckErrors(data.matches);
        setShowSpellCheckPanel(true);
      } else {
        console.error('Spell check failed:', response.statusText);
      }
    } catch (error) {
      console.error('Spell check error:', error);
    } finally {
      setIsCheckingSpelling(false);
    }
  };

  // Apply suggestion
  const applySuggestion = (error: SpellCheckError, replacement: string) => {
    if (!editor) return;

    const text = editor.getText();
    const before = text.substring(0, error.offset);
    const after = text.substring(error.offset + error.length);
    const newText = before + replacement + after;
    
    // Update editor content
    editor.commands.setContent(`<p>${newText}</p>`);
    
    // Remove this error from the list
    setSpellCheckErrors(prev => prev.filter(e => e !== error));
  };

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleCancel = () => {
    if (editor) {
      editor.commands.setContent(initialText);
      setContent(initialText);
    }
    onClose();
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const colors = [
    '#000000', '#374151', '#6b7280', '#ef4444', '#f59e0b', 
    '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'
  ];

  const highlightColors = [
    '#fef3c7', '#fde68a', '#fed7d7', '#c7f0db', '#bee3f8', 
    '#d1fae5', '#e0e7ff', '#f3e8ff', '#fce7f3', 'transparent'
  ];

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>
              {title}
            </h2>
            <div style={styles.headerSubtitle}>
              {wordCount} words • {charCount} characters
              {spellCheckErrors.length > 0 && (
                <span style={styles.errorCount}>
                  • {spellCheckErrors.length} issue{spellCheckErrors.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleCancel}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Advanced Toolbar */}
        {editor && (
          <div style={styles.toolbarContainer}>
            <div style={styles.toolbarInner}>
              {/* Language Selection */}
              <div style={styles.languageGroup}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en-US' | 'fr')}
                  style={styles.languageSelect}
                >
                  <option value="en-US">🇺🇸 English</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
              </div>

              {/* Spell Check Group */}
              <div style={styles.buttonGroup}>
                <button
                  onClick={checkSpelling}
                  disabled={isCheckingSpelling}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: isCheckingSpelling ? '#d1d5db' : '#10b981',
                    color: 'white'
                  }}
                >
                  {isCheckingSpelling ? '🔍 Checking...' : '✓ Spell Check'}
                </button>
                {spellCheckErrors.length > 0 && (
                  <button
                    onClick={() => setShowSpellCheckPanel(!showSpellCheckPanel)}
                    style={{
                      ...styles.toolbarButton,
                      backgroundColor: showSpellCheckPanel ? '#ef4444' : '#f59e0b',
                      color: 'white'
                    }}
                  >
                    ⚠️ {spellCheckErrors.length} Issues
                  </button>
                )}
              </div>

              {/* Text Formatting Group */}
              <div style={styles.buttonGroup}>
                {[
                  { action: () => editor.chain().focus().toggleBold().run(), icon: 'B', active: editor.isActive('bold'), style: { fontWeight: 'bold' } },
                  { action: () => editor.chain().focus().toggleItalic().run(), icon: 'I', active: editor.isActive('italic'), style: { fontStyle: 'italic' } },
                  { action: () => editor.chain().focus().toggleUnderline().run(), icon: 'U', active: editor.isActive('underline'), style: { textDecoration: 'underline' } },
                  { action: () => editor.chain().focus().toggleStrike().run(), icon: 'S', active: editor.isActive('strike'), style: { textDecoration: 'line-through' } },
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={btn.action}
                    style={{
                      ...styles.toolbarButton,
                      backgroundColor: btn.active ? '#3b82f6' : 'transparent',
                      color: btn.active ? 'white' : '#374151',
                      ...btn.style
                    }}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>

              {/* Headers Group */}
              <div style={styles.buttonGroup}>
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
                    style={{
                      ...styles.toolbarButton,
                      backgroundColor: editor.isActive('heading', { level }) ? '#3b82f6' : 'transparent',
                      color: editor.isActive('heading', { level }) ? 'white' : '#374151'
                    }}
                  >
                    H{level}
                  </button>
                ))}
              </div>

              {/* Lists Group */}
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: editor.isActive('bulletList') ? '#3b82f6' : 'transparent',
                    color: editor.isActive('bulletList') ? 'white' : '#374151'
                  }}
                >
                  •••
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: editor.isActive('orderedList') ? '#3b82f6' : 'transparent',
                    color: editor.isActive('orderedList') ? 'white' : '#374151'
                  }}
                >
                  123
                </button>
              </div>

              {/* Colors Group */}
              <div style={styles.colorPickerGroup}>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: showColorPicker ? '#3b82f6' : 'transparent',
                    color: showColorPicker ? 'white' : '#374151'
                  }}
                >
                  🎨 Text
                </button>
                {showColorPicker && (
                  <div style={styles.colorPickerDropdown}>
                    {colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          editor.chain().focus().setColor(color).run();
                          setShowColorPicker(false);
                        }}
                        style={{
                          ...styles.colorButton,
                          backgroundColor: color
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ))}
                  </div>
                )}
                
                <button
                  onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: showHighlightPicker ? '#3b82f6' : 'transparent',
                    color: showHighlightPicker ? 'white' : '#374151'
                  }}
                >
                  ✨ Highlight
                </button>
                {showHighlightPicker && (
                  <div style={styles.highlightPickerDropdown}>
                    {highlightColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (color === 'transparent') {
                            editor.chain().focus().unsetHighlight().run();
                          } else {
                            editor.chain().focus().toggleHighlight({ color }).run();
                          }
                          setShowHighlightPicker(false);
                        }}
                        style={{
                          ...styles.colorButton,
                          backgroundColor: color
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {color === 'transparent' && <span style={styles.transparentIcon}>🚫</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced Features */}
              <div style={styles.buttonGroup}>
                <button
                  onClick={addLink}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: editor.isActive('link') ? '#3b82f6' : 'transparent',
                    color: editor.isActive('link') ? 'white' : '#374151'
                  }}
                >
                  🔗
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: editor.isActive('blockquote') ? '#3b82f6' : 'transparent',
                    color: editor.isActive('blockquote') ? 'white' : '#374151'
                  }}
                >
                  💬
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  style={{
                    ...styles.toolbarButton,
                    backgroundColor: editor.isActive('codeBlock') ? '#3b82f6' : 'transparent',
                    color: editor.isActive('codeBlock') ? 'white' : '#374151'
                  }}
                >
                  💻
                </button>
              </div>

              {/* Font Size Control */}
              <div style={styles.fontSizeControl}>
                <span style={styles.fontSizeLabel}>Size:</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  style={styles.fontSizeSlider}
                />
                <span style={styles.fontSizeValue}>
                  {fontSize}px
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={styles.contentArea}>
          {/* Editor */}
          <div style={styles.editorContainer}>
            <div style={styles.editorInner}>
              <EditorContent
                editor={editor}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.7'
                }}
              />
            </div>
          </div>

          {/* Spell Check Panel */}
          {showSpellCheckPanel && spellCheckErrors.length > 0 && (
            <div style={styles.spellCheckPanel}>
              <div style={styles.spellCheckHeader}>
                <h3 style={styles.spellCheckTitle}>
                  ✏️ Grammar & Spelling Issues ({spellCheckErrors.length})
                </h3>
                <button
                  onClick={() => setShowSpellCheckPanel(false)}
                  style={styles.spellCheckClose}
                >
                  ✕
                </button>
              </div>
              <div style={styles.spellCheckList}>
                {spellCheckErrors.map((error, index) => (
                  <div key={index} style={styles.spellCheckItem}>
                    <div style={styles.errorInfo}>
                      <div style={styles.errorMessage}>{error.message}</div>
                      <div style={styles.errorCategory}>
                        {error.rule.category.name} • {error.rule.description}
                      </div>
                    </div>
                    {error.replacements.length > 0 && (
                      <div style={styles.suggestions}>
                        <div style={styles.suggestionsLabel}>Suggestions:</div>
                        <div style={styles.suggestionButtons}>
                          {error.replacements.slice(0, 3).map((replacement, idx) => (
                            <button
                              key={idx}
                              onClick={() => applySuggestion(error, replacement.value)}
                              style={styles.suggestionButton}
                            >
                              {replacement.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerTip}>
            💡 Press F7 for spell check • Ctrl/Cmd + Z for undo
          </div>
          <div style={styles.footerButtons}>
            <button
              onClick={handleCancel}
              style={styles.cancelButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={styles.saveButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              ✨ Save Content
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .ProseMirror {
          outline: none;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          margin: 1.5rem 0;
          padding-left: 1rem;
          font-style: italic;
          background: #f8fafc;
          border-radius: 0 8px 8px 0;
        }

        .ProseMirror pre {
          background: #1e293b;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
        }

        .ProseMirror code {
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875em;
        }

        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .ProseMirror h1 {
          font-size: 2.25rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ProseMirror h2 {
          font-size: 1.875rem;
          color: #374151;
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          color: #4b5563;
        }

        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
        }

        .ProseMirror li {
          margin: 0.5rem 0;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

// Enhanced styles with spell check features
const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  },

  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    width: '95%',
    maxWidth: '1400px',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'slideIn 0.3s ease-out'
  },

  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  headerTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },

  headerSubtitle: {
    fontSize: '14px',
    opacity: 0.9,
    marginTop: '4px'
  },

  errorCount: {
    color: '#fbbf24',
    fontWeight: '600'
  },

  closeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },

  toolbarContainer: {
    background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 24px',
    overflowX: 'auto'
  },

  toolbarInner: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    minWidth: 'fit-content'
  },

  languageGroup: {
    background: 'white',
    borderRadius: '12px',
    padding: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  languageSelect: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },

  buttonGroup: {
    display: 'flex',
    gap: '4px',
    background: 'white',
    borderRadius: '12px',
    padding: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  toolbarButton: {
    padding: '10px 12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },

  colorPickerGroup: {
    display: 'flex',
    gap: '4px',
    background: 'white',
    borderRadius: '12px',
    padding: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'relative'
  },

  colorPickerDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 10,
    background: 'white',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
    marginTop: '8px'
  },

  highlightPickerDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    zIndex: 10,
    background: 'white',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
    marginTop: '8px'
  },

  colorButton: {
    width: '32px',
    height: '32px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    position: 'relative'
  },

  transparentIcon: {
    fontSize: '16px'
  },

  fontSizeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    borderRadius: '12px',
    padding: '6px 12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

  fontSizeLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600'
  },

  fontSizeSlider: {
    width: '80px',
    accentColor: '#3b82f6'
  },

  fontSizeValue: {
    fontSize: '12px',
    color: '#374151',
    fontWeight: '600',
    minWidth: '24px'
  },

  contentArea: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  },

  editorContainer: {
    flex: 1,
    overflow: 'auto',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '24px'
  },

  editorInner: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    minHeight: '100%',
    border: '1px solid #e2e8f0'
  },

  spellCheckPanel: {
    width: '350px',
    backgroundColor: 'white',
    borderLeft: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column'
  },

  spellCheckHeader: {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },

  spellCheckTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  },

  spellCheckClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6b7280',
    padding: '4px'
  },

  spellCheckList: {
    flex: 1,
    overflow: 'auto',
    padding: '0'
  },

  spellCheckItem: {
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6'
  },

  errorInfo: {
    marginBottom: '12px'
  },

  errorMessage: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: '4px'
  },

  errorCategory: {
    fontSize: '12px',
    color: '#6b7280'
  },

  suggestions: {
    marginTop: '8px'
  },

  suggestionsLabel: {
    fontSize: '12px',
    color: '#374151',
    fontWeight: '600',
    marginBottom: '6px'
  },

  suggestionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },

  suggestionButton: {
    padding: '4px 8px',
    backgroundColor: '#e0f2fe',
    border: '1px solid #0284c7',
    borderRadius: '4px',
    color: '#0369a1',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },

  footer: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  footerTip: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px'
  },

  footerButtons: {
    display: 'flex',
    gap: '12px'
  },

  cancelButton: {
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)'
  },

  saveButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  }
};

export default TextEditorWithSpellCheck;