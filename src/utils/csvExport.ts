import type { Product } from '../types/product';

export function exportToCSV(products: Product[]): void {
  if (products.length === 0) return;

  const headers = [
    'Nombre del Producto',
    'UPC/EAN',
    'Precio Amazon',
    'Precio Walmart',
    'Precio LIDER Sugerido',
    'Precio Promedio Calculado'
  ];

  const csvData = products.map(p => [
    `"${p.name.replace(/"/g, '""')}"`,
    p.upc,
    p.amazonPrice.toFixed(2),
    p.walmartPrice.toFixed(2),
    p.leaderPrice.toFixed(2),
    p.averagePrice.toFixed(2)
  ]);

  let csvContent = headers.join(';') + '\n';
  csvContent += csvData.map(row => row.join(';')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const date = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_Lote_Productos_${date}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
