/**
 * Formats a list of items into a readable text format
 * @param {Array} items - List of item objects
 * @returns {string} Formatted text content
 */
export const formatFavoritesAsText = (items) => {
    const date = new Date().toLocaleDateString('da-DK');
    const header = `SAGER TIL SALG - FAVORITLISTE\nDato: ${date}\n----------------------------------------\n\n`;

    const content = items.map(item => {
        const price = item.price ? `${item.price},-` : 'Ring for pris';
        const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
        return `[${item.sku}] ${item.name}\nKategori: ${item.category}\nPris: ${price}${qty}\n${item.description}\n\n`;
    }).join('----------------------------------------\n\n');

    const footer = `----------------------------------------\nKontakt Peter på +45 40 78 14 88 for bestilling.\nAdresse: Mårsøvej 1, 4300 Holbæk`;

    return header + content + footer;
};

/**
 * Triggers a download of the text content
 * @param {string} content - The text content to save
 * @param {string} filename - The name of the file
 */
export const downloadTextFile = (content, filename = 'mine-favoritter.txt') => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
