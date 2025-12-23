import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

// Hàm này sẽ phân tích chuỗi văn bản và render LaTeX
export const renderContentWithLaTeX = (content: string) => {
    // Regex để tìm các công thức LaTeX trong dòng ($...$) và khối ($$...$$)
    // Chú ý: Cần xử lý Block Math trước để tránh xung đột với Inline Math nếu có $ bên trong $$
    const regexBlock = /\$\$([^$]+?)\$\$/g // Non-greedy match for block math
    const regexInline = /\$([^$]+?)\$/g // Non-greedy match for inline math

    const parts: (string | any)[] = []
    let lastIndex = 0

    // 1. Xử lý Block Math
    content?.replace(regexBlock, (match, latexContent, offset) => {
        if (offset > lastIndex) {
            parts.push(content.substring(lastIndex, offset))
        }
        parts.push(<BlockMath key={`block-${offset}`}>{latexContent}</BlockMath>)
        lastIndex = offset + match.length
        return match
    })

    // Thêm phần còn lại sau khi xử lý Block Math
    if (lastIndex < content?.length) {
        parts.push(content.substring(lastIndex))
    }

    // 2. Xử lý Inline Math trên các phần đã được xử lý (hoặc không)
    const finalParts = parts.flatMap((part, partIndex) => {
        if (typeof part !== 'string') {
            return part // Giữ nguyên BlockMath component đã được tạo
        }
        const subParts: (string | any)[] = []
        let subLastIndex = 0
        part.replace(regexInline, (match, latexContent, offset) => {
            if (offset > subLastIndex) {
                subParts.push(part.substring(subLastIndex, offset))
            }
            subParts.push(<InlineMath key={`inline-${partIndex}-${offset}`}>{latexContent}</InlineMath>)
            subLastIndex = offset + match.length
            return match
        })
        if (subLastIndex < part.length) {
            subParts.push(part.substring(subLastIndex))
        }
        return subParts
    })

    return <>{finalParts}</> // Trả về một React Fragment chứa các phần
}

export const renderHightlightedContent = (content: string) => {
    // Kiểm tra xem có chứa code block không
    if (!content?.includes('```')) {
        return <span className="whitespace-pre-wrap">{renderContentWithLaTeX(content)}</span>
    }

    // Tách content thành các phần bằng cách split theo ```
    const parts = content.split(/(```[\s\S]*?```)/g)

    return (
        <div className="">
            {parts.map((part, index) => {
                // Kiểm tra xem phần này có phải là code block không
                if (part.startsWith('```') && part.endsWith('```')) {
                    // Xử lý code block
                    const lines = part.split('\n')
                    const language = lines[0].replace('```', '').trim() || 'plaintext'
                    const code = lines.slice(1, -1).join('\n')

                    // Nếu không có code thì skip
                    if (!code.trim()) return null

                    return (
                        <div
                            key={index}
                            className=""
                            style={{
                                backgroundColor: '#282c34',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            }}
                        >
                            <SyntaxHighlighter
                                language={language.toLowerCase()}
                                style={atomOneDark}
                                showLineNumbers={true}
                                wrapLines={true}
                                customStyle={{
                                    padding: '15px',
                                    margin: 0,
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                }}
                                codeTagProps={{
                                    style: {
                                        fontFamily: 'JetBrains Mono, monospace',
                                        fontSize: '0.95em',
                                    },
                                }}
                            >
                                {code.trim()}
                            </SyntaxHighlighter>
                        </div>
                    )
                } else {
                    // Text bình thường
                    return part.trim() ? (
                        <span key={index} className="whitespace-pre-wrap">
                            {part}
                        </span>
                    ) : null
                }
            })}
        </div>
    )
}
