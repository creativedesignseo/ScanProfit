import type { Product } from '../types/product';

export function exportToCSV(products: Product[]) {
  const headers = [
    'UPC',
    'Nombre',
    'Marca',
    'Categoría',
    'Descripción',
    'Peso',
    'Dimensiones',
    'Ingredientes'
  ];

  const rows = products.map(product => [
    product.upc,
    product.nombre || product.name || '',
    product.marca || '',
    product.categoria || '',
    product.descripcion || '',
    product.peso || '',
    product.dimensiones || '',
    product.ingredientes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `lote_productos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
