/** biome-ignore-all lint/suspicious/noAssignInExpressions: regex magic  */
export function parseMarkupFromString(text: string) {
    const parts: React.ReactNode[] = []
    let lastEnd = 0
  
    // Combined regex to match all tag types in order of appearance
    const tagRegex = /<(h2|li|strong|i|check|em|b)>(.*?)<\/\1>/g
    let match = tagRegex.exec(text)
  
    while (match !== null) {
      // Add text before this match
      if (match.index > lastEnd) {
        parts.push(text.slice(lastEnd, match.index))
      }
  
      const [fullMatch, tagName, content] = match
  
      // Add the formatted element based on tag type
      switch (tagName) {
        case "h2":
          parts.push(<h2 key={match.index}>{content}</h2>)
          break
        case "li":
          parts.push(
            <li key={match.index} className="ml-4">
              {parseMarkupFromString(content)}
            </li>,
          )
          break
          case "b":
        case "strong":
          parts.push(<strong key={match.index}>{content}</strong>)
          break
      case "i":
    case "em":
          parts.push(<em key={match.index}>{content}</em>)
          break
      }
  
      lastEnd = match.index + fullMatch.length
      match = tagRegex.exec(text)
    }
  
    // Add remaining text after the last match
    if (lastEnd < text.length) {
      parts.push(text.slice(lastEnd))
    }
  
    return parts
  }