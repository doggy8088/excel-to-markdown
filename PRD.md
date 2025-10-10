# Excel to Markdown Table Converter

Convert Excel table data directly into properly formatted Markdown tables through clipboard paste functionality.

**Experience Qualities**: 
1. **Efficient** - Immediate conversion with single paste action eliminates manual formatting
2. **Reliable** - Consistent parsing handles various Excel data types and formats accurately  
3. **Clear** - Side-by-side preview shows exact Markdown output before copying

**Complexity Level**: Light Application (multiple features with basic state)
- Handles clipboard data parsing, format conversion, and live preview with minimal complexity

## Essential Features

### Clipboard Paste Detection
- **Functionality**: Automatically detects when Excel table data is pasted
- **Purpose**: Eliminates need for file uploads or manual data entry
- **Trigger**: User pastes clipboard content (Ctrl+V) in designated input area
- **Progression**: Paste action → Parse clipboard data → Detect tab-separated format → Convert to internal table structure
- **Success criteria**: Successfully parses Excel's tab-separated clipboard format into rows and columns

### Markdown Table Generation
- **Functionality**: Converts parsed Excel data into properly formatted Markdown table syntax
- **Purpose**: Provides ready-to-use Markdown that follows standard table formatting
- **Trigger**: Automatic conversion after successful clipboard parsing
- **Progression**: Parsed data → Generate table headers → Add alignment row → Format data rows → Complete Markdown output
- **Success criteria**: Produces valid Markdown table with proper pipe separators and alignment

### Live Preview Display
- **Functionality**: Shows real-time rendered preview of the generated Markdown table
- **Purpose**: Allows users to verify conversion accuracy before copying output
- **Trigger**: Updates automatically when new data is converted
- **Progression**: Markdown generated → Render table preview → Display in right pane → Show copy button
- **Success criteria**: Preview matches exactly what the Markdown will render as

### Copy to Clipboard
- **Functionality**: One-click copying of generated Markdown to clipboard
- **Purpose**: Streamlines workflow for using converted tables elsewhere
- **Trigger**: User clicks copy button on generated Markdown
- **Progression**: Click copy → Write Markdown to clipboard → Show success feedback
- **Success criteria**: Markdown is copied accurately and can be pasted into any Markdown editor

## Edge Case Handling

- **Empty Cells**: Handle missing data with proper empty cell formatting in Markdown
- **Special Characters**: Escape pipe characters and other Markdown syntax within cell content
- **Large Tables**: Handle tables with many rows/columns without performance issues
- **Invalid Paste Data**: Gracefully handle non-tabular clipboard content with clear error messages
- **Mixed Data Types**: Process cells containing numbers, text, dates, and formulas consistently

## Design Direction

The interface should feel professional and efficient like a developer tool, emphasizing clarity and speed over visual flourishes with a clean, focused layout that removes distractions from the core conversion workflow.

## Color Selection

Complementary (opposite colors) - Using a blue and orange pairing to create clear visual distinction between input and output areas while maintaining professional appearance.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 230)) - Communicates trust and professionalism for primary actions
- **Secondary Colors**: Light Gray (oklch(0.95 0.01 230)) - Supporting neutral background that doesn't compete with content
- **Accent Color**: Warm Orange (oklch(0.65 0.15 45)) - Attention-grabbing highlight for copy actions and success states
- **Foreground/Background Pairings**: 
  - Background (Light Gray oklch(0.98 0.005 230)): Dark Text (oklch(0.15 0.01 230)) - Ratio 15.8:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 230)): White Text (oklch(0.98 0.005 230)) - Ratio 8.2:1 ✓
  - Accent (Warm Orange oklch(0.65 0.15 45)): White Text (oklch(0.98 0.005 230)) - Ratio 4.9:1 ✓
  - Card (White oklch(1 0 0)): Dark Text (oklch(0.15 0.01 230)) - Ratio 16.5:1 ✓

## Font Selection

Typography should emphasize readability and technical precision using a clean monospace font for code/Markdown output and a crisp sans-serif for interface elements.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Semi-Bold/32px/tight letter spacing for clear hierarchy
  - H2 (Section Headers): Inter Medium/18px/normal spacing for organization  
  - Body (Instructions): Inter Regular/16px/relaxed leading for readability
  - Code (Markdown Output): JetBrains Mono Regular/14px/monospace for technical content
  - Labels: Inter Medium/14px/uppercase tracking for form clarity

## Animations

Subtle functionality-focused animations that provide immediate feedback for paste actions and state changes without delaying the core workflow.

- **Purposeful Meaning**: Quick fade-ins for content updates and gentle hover states reinforce the tool's responsive, professional character
- **Hierarchy of Movement**: Paste detection and conversion completion deserve primary animation focus as the core user actions

## Component Selection

- **Components**: 
  - Card components for input/output panes with subtle shadows
  - Textarea for paste input area with focus states
  - Button (primary variant) for copy actions with loading states
  - Alert components for error/success feedback
  - Separator for visual division between panes
- **Customizations**: 
  - Custom table preview component to render Markdown accurately
  - Enhanced textarea with paste detection and placeholder content
- **States**: 
  - Textarea: empty, focused, filled, error states with clear visual feedback
  - Copy button: default, hover, active, success states with icon transitions
  - Alert messages: info, success, error variants with appropriate colors
- **Icon Selection**: 
  - ClipboardDocument for paste actions
  - DocumentDuplicate for copy functionality  
  - CheckCircle for success confirmations
  - ExclamationTriangle for error states
- **Spacing**: Consistent 4-unit (1rem) gaps between major sections, 2-unit (0.5rem) for related elements
- **Mobile**: Stack panes vertically on screens below 768px, maintain full functionality with touch-optimized button sizes