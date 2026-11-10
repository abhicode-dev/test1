
export function normalizeText(text) {
    return text
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export default  normalizeText

