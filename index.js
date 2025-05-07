import { lexer } from 'marked'

const RAW_TYPES = [
  'text',
  'em',
  'strong',
  'del',
  'codespan'
]

const NEWLINE = '\n'

export function fromMarkdown (markdown) {
  const tokens = lexer(markdown)
  return [...tokensToGemtext(tokens)].join('')
}

export function * tokensToGemtext (tokens) {
  const endLinks = []
  for (const token of tokens) {
    const { type, tokens } = token
    if (type === 'space') {
      yield NEWLINE
    } else if (type === 'heading') {
      const prefix = new Array(token.depth).fill('#').join('')
      yield prefix + ' '
      yield flattenTokens(tokens)
      yield NEWLINE
    } else if (type === 'paragraph') {
      if (tokens.length === 1 && tokens[0].type === 'link') {
        const { href, text } = tokens[0]
        yield `=> ${href} ${text}`
        continue
      }

      yield flattenTokens(tokens)
      yield NEWLINE
    } else if (type === 'blockquote') {
      const quote = flattenTokens(tokens[0].tokens)
      for (const line of quote.split(NEWLINE)) {
        yield `> ${line}\n`
      }
    } else if (type === 'code') {
      yield '```\n'
      yield token.text
      yield '\n```\n'
    } else if (type === 'list') {
      const { items } = token
      if (areAllLinks(items)) {
        for (const item of items) {
          const { href, text } = item.tokens[0].tokens[0]
          yield `=> ${href} ${text}\n`
        }
      } else {
        for (const item of items) {
          yield `* ${flattenTokens(item.tokens)}\n`
        }
      }
    }
  }

  if (endLinks.length) {
    yield NEWLINE + '----' + NEWLINE + NEWLINE
  }
  for (const { text, href, index } of endLinks) {
    yield `=> ${href} [${index}] ${text}\n`
  }

  function flattenTokens (tokens) {
    let full = ''
    for (const token of tokens) {
      if (RAW_TYPES.includes(token.type)) {
        full += token.raw
      } else if (token.type === 'link') {
        const index = endLinks.length
        const { href, text } = token
        endLinks.push({ href, text, index })
        full += `${text}[${index}]`
      } else {
        throw new Error(`Unsupported markdown type ${token.type}:\n${JSON.stringify(tokens)}`)
      }
    }
    return full
  }
}

function areAllLinks (tokens) {
  for (const item of tokens) {
    if (item.tokens.length !== 1) return false
    if (item.tokens[0].tokens?.length !== 1) return false
    if (item.tokens[0]?.tokens[0]?.type !== 'link') return false
  }
  return true
}
