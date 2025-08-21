'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { 
  ResourceService, 
  type Resource, 
  type ResourceStats, 
  type ResourceFilters 
} from '@/lib/services/resource.service';
import {
  ResourceHeader,
  ResourceStatsCards,
  ResourceFilters as ResourceFiltersComponent,
  ResourceTabs,
  ResourceGrid,
  UploadDialog
} from '@/components/teacher/resources-components';

export default function TeacherResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<ResourceStats>({
    total: 0,
    favorites: 0,
    shared: 0,
    totalDownloads: 0,
    byType: {},
    byCategory: {}
  });
  const [filters, setFilters] = useState<ResourceFilters>({
    search: '',
    category: undefined,
    type: undefined,
    subject: undefined,
    grade: undefined,
    tab: 'all'
  });
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (user?.uid) {
      loadResources();
    }
  }, [user]);

  // Update filtered resources when resources or filters change
  useEffect(() => {
    const filtered = ResourceService.filterResources(resources, filters);
    setFilteredResources(filtered);
  }, [resources, filters]);

  /**
   * Load resources and related data
   */
  const loadResources = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      const resourceData = await ResourceService.getTeacherResources(user.uid);
      const resourceStats = await ResourceService.getResourceStats(resourceData);
      
      setResources(resourceData);
      setStats(resourceStats);
      setCategories(ResourceService.getCategories(resourceData));
      setSubjects(ResourceService.getSubjects(resourceData));
      setGrades(ResourceService.getGrades(resourceData));
      
    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle filter changes
   */
  const handleFiltersChange = (newFilters: ResourceFilters) => {
    setFilters(newFilters);
  };

  /**
   * Handle tab changes
   */
  const handleTabChange = (tab: string) => {
    setFilters(prev => ({ ...prev, tab: tab as ResourceFilters['tab'] }));
  };

  /**
   * Toggle favorite status of a resource
   */
  const handleToggleFavorite = async (resourceId: string) => {
    try {
      await ResourceService.toggleFavorite(resourceId);
      
      // Update local state
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, isFavorite: !resource.isFavorite }
          : resource
      ));
      
      // Update stats
      const updatedResources = resources.map(resource => 
        resource.id === resourceId 
          ? { ...resource, isFavorite: !resource.isFavorite }
          : resource
      );
      const updatedStats = await ResourceService.getResourceStats(updatedResources);
      setStats(updatedStats);
      
      toast({
        title: "Success",
        description: "Resource favorite status updated",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  /**
   * Handle resource download
   */
  const handleDownload = async (resource: Resource) => {
    try {
      await ResourceService.downloadResource(resource.id);
      
      // Update download count locally
      setResources(prev => prev.map(r => 
        r.id === resource.id 
          ? { ...r, downloads: r.downloads + 1 }
          : r
      ));
      
      // Update stats
      const updatedStats = { ...stats, totalDownloads: stats.totalDownloads + 1 };
      setStats(updatedStats);
      
      toast({
        title: "Download Started",
        description: `Downloading ${resource.title}`,
      });
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast({
        title: "Error",
        description: "Failed to download resource",
        variant: "destructive",
      });
    }
  };

  /**
   * Handle file upload
   */
  const handleUpload = async (file: File, resourceData: Partial<Resource>) => {
    if (!user?.uid) return;
    
    try {
      const newResource = await ResourceService.uploadFile(file, {
        ...resourceData,
        teacherId: user.uid,
        schoolId: user.profile?.schoolId || 'default-school'
      });
      
      // Add to resources list
      setResources(prev => [newResource, ...prev]);
      
      // Update related data
      const updatedResources = [newResource, ...resources];
      const updatedStats = await ResourceService.getResourceStats(updatedResources);
      setStats(updatedStats);
      setCategories(ResourceService.getCategories(updatedResources));
      setSubjects(ResourceService.getSubjects(updatedResources));
      setGrades(ResourceService.getGrades(updatedResources));
      
      toast({
        title: "Success",
        description: `Resource "${newResource.title}" uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive",
      });
    }
  };

  /**
   * Export resources to CSV
   */
  const handleExport = async () => {
    try {
      const csvContent = await ResourceService.exportResources(filteredResources);
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `teaching-resources-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Resources exported successfully",
      });
    } catch (error) {
      console.error('Error exporting resources:', error);
      toast({
        title: "Error",
        description: "Failed to export resources",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="h-24 bg-gray-200 rounded animate-pulse" />
        
        <ResourceStatsCards stats={stats} loading={true} />
        
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ResourceHeader
        onUpload={() => setShowUploadDialog(true)}
        onAdd={() => setShowUploadDialog(true)}
        onExport={handleExport}
      />

      {/* Search and Filters */}
      <ResourceFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        subjects={subjects}
        grades={grades}
      />

      {/* Resource Stats */}
      <ResourceStatsCards stats={stats} />

      {/* Resources Tabs and Grid */}
      <ResourceTabs
        activeTab={filters.tab || 'all'}
        onTabChange={handleTabChange}
      >
        <ResourceGrid
          resources={filteredResources}
          onToggleFavorite={handleToggleFavorite}
          onDownload={handleDownload}
        />
      </ResourceTabs>

      {/* Upload Dialog */}
      <UploadDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={handleUpload}
        categories={categories}
        subjects={subjects}
        grades={grades}
      />
    </div>
  );
}
