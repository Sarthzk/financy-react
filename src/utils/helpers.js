// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const RECENT_ENTRIES_LIMIT = 5;
export const FINTECH_PALETTE = [
  '#0B50DA', '#D4AF37', '#10B981', '#EF4444', 
  '#8B5CF6', '#F59E0B', '#06B6D4'
];

export function sanitizeInput(input) {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function formatCurrency(amount) {
  const isNegative = amount < 0;
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function getDisplayCategory(category) {
  if (!category) return 'Uncategorized';
  return category
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function normalizeCategoryKey(category) {
  return category ? category.toLowerCase().trim() : 'uncategorized';
}

export function getCategoryColor(category, categoryColorMap) {
  if (!categoryColorMap[category]) {
    const index = Object.keys(categoryColorMap).length % FINTECH_PALETTE.length;
    categoryColorMap[category] = FINTECH_PALETTE[index];
  }
  return categoryColorMap[category];
}

export function showNotification(message, type = 'info') {
  // This will be handled by a Toast component in React
  return { message, type };
}

export function exportToCSV(entries) {
  if (entries.length === 0) {
    return { success: false, message: "No data to export" };
  }
  
  const headers = ["Date", "Type", "Category", "Amount"];
  const csv = [
    headers.join(","),
    ...entries.map(e => [e.date, e.type, e.category, e.amount].join(","))
  ].join("\n");
  
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `financy-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  return { success: true, message: "Export successful" };
}
