# markdown-to-gemtext
JavaScript Node.js library for converting Markdown documents to Gemini Gemtext

## Limitations:

- Any HTML is ignored, straight up
- Tables are also ignored
- Images get turned into links
- Bold/Italics/Strikethrough is just text
- Code block language gets lost

## Usage

```bash
npm i markdown-to-gemtext
```

```javascript
import * as MarkdownToGemtext from "markdown-to-gemtext"

const markdown = `
## Hello World!
[some link](hyper://agregore.mauve.moe)
`

const gemtext = MarkdownToGemtext.fromMarkdown(markdown)

gemtext === `
## Hello World!
=> hyper://agregore.mauve.moe some link
`
```

## Features

If you want to add more support or find bugs in the existing support, please open an issue or a pull request (with tests).

- [x] Paragraphs
- [x] Links pulled to the end
- [x] Links on a line
- [x] Lists
- [x] Lists of links are just lines of links
- [x] Blockquotes
- [x] Preformatted text (code blocks)
- [x] Bold/italic/strikethrough converted to raw text
- [ ] Links to media
- [ ] Tables
- [ ] Inline HTML