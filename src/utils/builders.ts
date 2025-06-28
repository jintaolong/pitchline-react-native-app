export const uniqueKeyBuilder = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${crypto?.randomUUID?.() ?? ''}`;
}