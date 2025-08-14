'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function DemoDeleteButton() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteDemo = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      '⚠️ This will permanently delete ALL demo data from the database. Are you sure you want to continue?'
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/delete-seed-data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: '🗑️ Demo Data Deleted Successfully!',
          description: `Removed ${result.deletedCollections.join(', ')} collections from the database.`,
          duration: 6000,
        });
      } else {
        throw new Error(result.message || 'Failed to delete demo data');
      }
    } catch (error: any) {
      console.error('Error deleting demo data:', error);
      toast({
        title: '❌ Deletion Failed',
        description: error.message || 'An error occurred while deleting demo data',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDeleteDemo}
      disabled={isDeleting}
      variant="destructive"
      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 text-lg py-6 px-8"
    >
      {isDeleting ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Deleting Demo Data...
        </>
      ) : (
        <>
          🗑️ Delete Demo Data
        </>
      )}
    </Button>
  );
}
