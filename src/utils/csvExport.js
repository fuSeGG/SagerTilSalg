/**
 * Utility to export inventory data to CSV
 */

export const exportToCSV = (items) => {
    const headers = ['SKU', 'Navn', 'Kategori', 'Beskrivelse', 'Dato Tilføjet'];
    const rows = items.map(item => [
        item.sku,
        item.name,
        item.category,
        item.description.replace(/\n/g, ' '),
        new Date(item.dateAdded).toLocaleDateString('da-DK')
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `sager_til_salg_eksport_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
