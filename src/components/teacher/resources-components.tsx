'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { type Resource, type ResourceStats, type ResourceFilters } from '@/lib/services/resource.service';
import {
  BookOpen,
  Search,
  Download,
  Upload,
  FolderOpen,
  FileText,
  Video,
  Image,
  Link as LinkIcon,
  Star,
  Eye,
  Share2,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";

interface ResourceStatsCardsProps {
  stats: ResourceStats;
  loading?: boolean;
}

export function ResourceStatsCards({ stats, loading }: ResourceStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="ml-4 space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <FolderOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Favorites</p>
              <p className="text-2xl font-bold">{stats.favorites}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Share2 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Shared</p>
              <p className="text-2xl font-bold">{stats.shared}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Download className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
              <p className="text-2xl font-bold">{stats.totalDownloads}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ResourceFiltersProps {
  filters: ResourceFilters;
  onFiltersChange: (filters: ResourceFilters) => void;
  categories: string[];
  subjects: string[];
  grades: string[];
}

export function ResourceFilters({ 
  filters, 
  onFiltersChange, 
  categories, 
  subjects, 
  grades 
}: ResourceFiltersProps) {
  const handleFilterChange = (key: keyof ResourceFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search resources by title, description, or tags..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filters.type || 'all'}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="link">Links</option>
              <option value="image">Images</option>
              <option value="presentation">Presentations</option>
            </select>
            <select
              value={filters.subject || 'all'}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={filters.grade || 'all'}
              onChange={(e) => handleFilterChange('grade', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResourceCardProps {
  resource: Resource;
  onToggleFavorite: (resourceId: string) => void;
  onDownload: (resource: Resource) => void;
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
  onShare?: (resource: Resource) => void;
}

export function ResourceCard({ 
  resource, 
  onToggleFavorite, 
  onDownload, 
  onEdit,
  onDelete,
  onShare 
}: ResourceCardProps) {
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'presentation': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'document': return 'text-blue-600 bg-blue-50';
      case 'video': return 'text-red-600 bg-red-50';
      case 'link': return 'text-green-600 bg-green-50';
      case 'image': return 'text-purple-600 bg-purple-50';
      case 'presentation': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(resource.type)}>
                {getTypeIcon(resource.type)}
                <span className="ml-1 capitalize">{resource.type}</span>
              </Badge>
              {resource.isFavorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
              {resource.isShared && (
                <Share2 className="h-4 w-4 text-green-500" />
              )}
            </div>
            <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
          </div>
          <div className="ml-2">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{resource.subject} - Grade {resource.grade}</span>
            <span>{resource.category}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Uploaded: {formatDate(resource.uploadDate)}</span>
            {resource.size && <span>{resource.size}</span>}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Download className="h-3 w-3" />
            <span>{resource.downloads} downloads</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onDownload(resource)}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onToggleFavorite(resource.id)}
            >
              <Star className={`h-3 w-3 ${resource.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ResourceGridProps {
  resources: Resource[];
  loading?: boolean;
  onToggleFavorite: (resourceId: string) => void;
  onDownload: (resource: Resource) => void;
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
  onShare?: (resource: Resource) => void;
}

export function ResourceGrid({ 
  resources, 
  loading, 
  onToggleFavorite, 
  onDownload,
  onEdit,
  onDelete,
  onShare
}: ResourceGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No resources found</h3>
            <p className="mt-1 text-muted-foreground">
              Start by uploading your first teaching resource.
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onToggleFavorite={onToggleFavorite}
          onDownload={onDownload}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
        />
      ))}
    </div>
  );
}

interface ResourceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export function ResourceTabs({ activeTab, onTabChange, children }: ResourceTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All Resources</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
        <TabsTrigger value="shared">Shared</TabsTrigger>
        <TabsTrigger value="my">My Resources</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
}

interface ResourceHeaderProps {
  onUpload?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
}

export function ResourceHeader({ onUpload, onAdd, onExport }: ResourceHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Teaching Resources</h1>
        <p className="text-muted-foreground">
          Access and manage your teaching materials and resources
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
        {onUpload && (
          <Button variant="outline" onClick={onUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        )}
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        )}
      </div>
    </div>
  );
}

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, data: Partial<Resource>) => void;
  categories: string[];
  subjects: string[];
  grades: string[];
}

export function UploadDialog({ 
  open, 
  onClose, 
  onUpload, 
  categories, 
  subjects, 
  grades 
}: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0] || '',
    subject: subjects[0] || '',
    grade: grades[0] || '',
    tags: '',
    isShared: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    onUpload(file, {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    
    // Reset form
    setFile(null);
    setFormData({
      title: '',
      description: '',
      category: categories[0] || '',
      subject: subjects[0] || '',
      grade: grades[0] || '',
      tags: '',
      isShared: false
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Resource title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Resource description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Grade</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isShared"
              checked={formData.isShared}
              onChange={(e) => setFormData(prev => ({ ...prev, isShared: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="isShared" className="text-sm">Share with other teachers</label>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
