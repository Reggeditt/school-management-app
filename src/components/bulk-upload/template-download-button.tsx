'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportStudentTemplate } from '@/lib/bulk-upload-service';
import { Class } from '@/lib/database-services';

interface TemplateDownloadButtonProps {
  classes: Class[];
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function TemplateDownloadButton({ 
  classes, 
  variant = 'outline', 
  size = 'default',
  className 
}: TemplateDownloadButtonProps) {
  const handleDownload = () => {
    exportStudentTemplate(classes);
  };

  return (
    <Button
      onClick={handleDownload}
      variant={variant}
      size={size}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      Download Template
    </Button>
  );
}
