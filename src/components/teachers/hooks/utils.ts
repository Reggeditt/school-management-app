export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculateAge = (dateOfBirth: Date | string) => {
  const birth = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const getFileIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case 'pdf':
      return 'file-text';
    case 'word':
    case 'doc':
    case 'docx':
      return 'file';
    case 'excel':
    case 'xls':
    case 'xlsx':
      return 'sheet';
    default:
      return 'file';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'submitted':
      return 'secondary';
    case 'under-review':
      return 'outline';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
};
