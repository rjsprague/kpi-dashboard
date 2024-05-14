export function sanitizeInput(input: string): string {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function validateInput(input: string, type: string): boolean {
    if (type === 'key') {
        return /^[a-zA-Z0-9_]+$/.test(input);
    } else if (type === 'value') {
        return input.length < 500;
    }
    return false;
}
