import { DatabaseService } from '@/lib/database-services';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'image' | 'presentation';
  category: string;
  subject: string;
  grade: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  size?: string;
  uploadDate: string;
  downloads: number;
  isFavorite: boolean;
  isShared: boolean;
  tags: string[];
  teacherId: string;
  schoolId: string;
}

export interface ResourceStats {
  total: number;
  favorites: number;
  shared: number;
  totalDownloads: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface ResourceFilters {
  search?: string;
  category?: string;
  type?: string;
  subject?: string;
  grade?: string;
  tab?: 'all' | 'favorites' | 'shared' | 'my';
}

export class ResourceService {
  /**
   * Get all resources for a teacher
   */
  static async getTeacherResources(teacherId: string): Promise<Resource[]> {
    try {
      // This would query the resources collection
      // For now, returning mock data
      console.log('Getting resources for teacher:', teacherId);
      
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Algebra Fundamentals Presentation',
          description: 'Comprehensive slides covering basic algebra concepts for Grade 10',
          type: 'presentation',
          category: 'Lesson Plans',
          subject: 'Mathematics',
          grade: '10',
          fileUrl: '/resources/algebra-fundamentals.pptx',
          thumbnailUrl: '/thumbnails/algebra-fundamentals.jpg',
          size: '2.5 MB',
          uploadDate: '2025-08-15',
          downloads: 45,
          isFavorite: true,
          isShared: true,
          tags: ['algebra', 'basics', 'equations'],
          teacherId,
          schoolId: 'school-1'
        },
        {
          id: '2',
          title: 'Scientific Method Video Tutorial',
          description: 'Interactive video explaining the scientific method with examples',
          type: 'video',
          category: 'Multimedia',
          subject: 'Science',
          grade: '9',
          fileUrl: '/resources/scientific-method.mp4',
          thumbnailUrl: '/thumbnails/scientific-method.jpg',
          size: '15.2 MB',
          uploadDate: '2025-08-12',
          downloads: 78,
          isFavorite: false,
          isShared: true,
          tags: ['science', 'method', 'experiments'],
          teacherId,
          schoolId: 'school-1'
        },
        {
          id: '3',
          title: 'Geometry Practice Worksheets',
          description: 'Collection of worksheets for practicing geometric proofs',
          type: 'document',
          category: 'Worksheets',
          subject: 'Mathematics',
          grade: '10',
          fileUrl: '/resources/geometry-worksheets.pdf',
          size: '1.8 MB',
          uploadDate: '2025-08-18',
          downloads: 32,
          isFavorite: true,
          isShared: false,
          tags: ['geometry', 'proofs', 'practice'],
          teacherId,
          schoolId: 'school-1'
        },
        {
          id: '4',
          title: 'Khan Academy Mathematics',
          description: 'Free online mathematics courses and practice exercises',
          type: 'link',
          category: 'External Resources',
          subject: 'Mathematics',
          grade: 'All',
          fileUrl: 'https://www.khanacademy.org/math',
          uploadDate: '2025-08-10',
          downloads: 123,
          isFavorite: true,
          isShared: true,
          tags: ['online', 'practice', 'free'],
          teacherId,
          schoolId: 'school-1'
        },
        {
          id: '5',
          title: 'Lab Safety Guidelines',
          description: 'Essential safety rules and procedures for science laboratory',
          type: 'document',
          category: 'Safety',
          subject: 'Science',
          grade: 'All',
          fileUrl: '/resources/lab-safety.pdf',
          size: '0.9 MB',
          uploadDate: '2025-08-05',
          downloads: 156,
          isFavorite: false,
          isShared: true,
          tags: ['safety', 'laboratory', 'guidelines'],
          teacherId,
          schoolId: 'school-1'
        },
        {
          id: '6',
          title: 'English Literature Analysis Guide',
          description: 'Step-by-step guide for analyzing literary texts',
          type: 'document',
          category: 'Study Guides',
          subject: 'English',
          grade: '11',
          fileUrl: '/resources/literature-analysis.pdf',
          size: '3.2 MB',
          uploadDate: '2025-08-20',
          downloads: 67,
          isFavorite: true,
          isShared: true,
          tags: ['literature', 'analysis', 'english'],
          teacherId,
          schoolId: 'school-1'
        },
        {
          id: '7',
          title: 'Chemistry Experiment Videos',
          description: 'Collection of safe chemistry experiments with detailed explanations',
          type: 'video',
          category: 'Multimedia',
          subject: 'Chemistry',
          grade: '12',
          fileUrl: '/resources/chemistry-experiments.mp4',
          size: '45.8 MB',
          uploadDate: '2025-08-17',
          downloads: 89,
          isFavorite: false,
          isShared: true,
          tags: ['chemistry', 'experiments', 'laboratory'],
          teacherId,
          schoolId: 'school-1'
        },
        {
          id: '8',
          title: 'Historical Timeline Interactive',
          description: 'Interactive timeline of major historical events',
          type: 'link',
          category: 'Interactive Tools',
          subject: 'History',
          grade: '9',
          fileUrl: 'https://timeline.history.com',
          uploadDate: '2025-08-14',
          downloads: 234,
          isFavorite: true,
          isShared: true,
          tags: ['history', 'timeline', 'interactive'],
          teacherId,
          schoolId: 'school-1'
        }
      ];

      return mockResources;
    } catch (error) {
      console.error('Error fetching teacher resources:', error);
      throw new Error('Failed to fetch resources');
    }
  }

  /**
   * Get resource statistics
   */
  static async getResourceStats(resources: Resource[]): Promise<ResourceStats> {
    const stats: ResourceStats = {
      total: resources.length,
      favorites: resources.filter(r => r.isFavorite).length,
      shared: resources.filter(r => r.isShared).length,
      totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
      byType: {},
      byCategory: {}
    };

    // Calculate by type
    resources.forEach(resource => {
      stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
    });

    // Calculate by category
    resources.forEach(resource => {
      stats.byCategory[resource.category] = (stats.byCategory[resource.category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Filter resources based on criteria
   */
  static filterResources(resources: Resource[], filters: ResourceFilters): Resource[] {
    return resources.filter(resource => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          resource.subject.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (resource.category !== filters.category) return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'all') {
        if (resource.type !== filters.type) return false;
      }

      // Subject filter
      if (filters.subject && filters.subject !== 'all') {
        if (resource.subject !== filters.subject) return false;
      }

      // Grade filter
      if (filters.grade && filters.grade !== 'all') {
        if (resource.grade !== filters.grade && resource.grade !== 'All') return false;
      }

      // Tab filter
      if (filters.tab) {
        switch (filters.tab) {
          case 'favorites':
            if (!resource.isFavorite) return false;
            break;
          case 'shared':
            if (!resource.isShared) return false;
            break;
          case 'my':
            if (resource.isShared) return false;
            break;
          case 'all':
          default:
            break;
        }
      }

      return true;
    });
  }

  /**
   * Get unique categories from resources
   */
  static getCategories(resources: Resource[]): string[] {
    return [...new Set(resources.map(r => r.category))].sort();
  }

  /**
   * Get unique subjects from resources
   */
  static getSubjects(resources: Resource[]): string[] {
    return [...new Set(resources.map(r => r.subject))].sort();
  }

  /**
   * Get unique grades from resources
   */
  static getGrades(resources: Resource[]): string[] {
    return [...new Set(resources.map(r => r.grade))].sort();
  }

  /**
   * Toggle favorite status of a resource
   */
  static async toggleFavorite(resourceId: string): Promise<void> {
    try {
      // This would update the resource in the database
      console.log('Toggling favorite for resource:', resourceId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to update favorite status');
    }
  }

  /**
   * Download a resource and update download count
   */
  static async downloadResource(resourceId: string): Promise<void> {
    try {
      // This would increment the download count in the database
      console.log('Downloading resource:', resourceId);
    } catch (error) {
      console.error('Error downloading resource:', error);
      throw new Error('Failed to download resource');
    }
  }

  /**
   * Create a new resource
   */
  static async createResource(resource: Omit<Resource, 'id' | 'uploadDate' | 'downloads'>): Promise<Resource> {
    try {
      const newResource: Resource = {
        ...resource,
        id: Date.now().toString(),
        uploadDate: new Date().toISOString(),
        downloads: 0
      };

      // This would save to the database
      console.log('Creating resource:', newResource);
      
      return newResource;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw new Error('Failed to create resource');
    }
  }

  /**
   * Update an existing resource
   */
  static async updateResource(resourceId: string, updates: Partial<Resource>): Promise<void> {
    try {
      // This would update the resource in the database
      console.log('Updating resource:', resourceId, updates);
    } catch (error) {
      console.error('Error updating resource:', error);
      throw new Error('Failed to update resource');
    }
  }

  /**
   * Delete a resource
   */
  static async deleteResource(resourceId: string): Promise<void> {
    try {
      // This would delete the resource from the database
      console.log('Deleting resource:', resourceId);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw new Error('Failed to delete resource');
    }
  }

  /**
   * Share/unshare a resource
   */
  static async toggleShare(resourceId: string): Promise<void> {
    try {
      // This would update the sharing status in the database
      console.log('Toggling share for resource:', resourceId);
    } catch (error) {
      console.error('Error toggling share status:', error);
      throw new Error('Failed to update share status');
    }
  }

  /**
   * Upload file and create resource
   */
  static async uploadFile(file: File, resourceData: Partial<Resource>): Promise<Resource> {
    try {
      // This would upload the file to storage and create the resource
      console.log('Uploading file:', file.name);
      
      const resource = await this.createResource({
        title: resourceData.title || file.name,
        description: resourceData.description || '',
        type: this.getFileType(file),
        category: resourceData.category || 'General',
        subject: resourceData.subject || '',
        grade: resourceData.grade || '',
        fileUrl: `/uploads/${file.name}`,
        size: this.formatFileSize(file.size),
        isFavorite: false,
        isShared: false,
        tags: resourceData.tags || [],
        teacherId: resourceData.teacherId || '',
        schoolId: resourceData.schoolId || ''
      });

      return resource;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Determine file type from file object
   */
  private static getFileType(file: File): Resource['type'] {
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    return 'document';
  }

  /**
   * Format file size to human readable format
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Export resources data to CSV
   */
  static async exportResources(resources: Resource[]): Promise<string> {
    const headers = [
      'Title',
      'Type',
      'Category', 
      'Subject',
      'Grade',
      'Upload Date',
      'Downloads',
      'Shared',
      'Favorite',
      'Tags'
    ];

    const csvContent = [
      headers.join(','),
      ...resources.map(resource => [
        `"${resource.title}"`,
        resource.type,
        resource.category,
        resource.subject,
        resource.grade,
        resource.uploadDate,
        resource.downloads,
        resource.isShared,
        resource.isFavorite,
        `"${resource.tags.join(', ')}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Get resource type icon name
   */
  static getTypeIcon(type: Resource['type']): string {
    switch (type) {
      case 'document': return 'FileText';
      case 'video': return 'Video';
      case 'link': return 'Link';
      case 'image': return 'Image';
      case 'presentation': return 'FileText';
      default: return 'FileText';
    }
  }

  /**
   * Get resource type color classes
   */
  static getTypeColor(type: Resource['type']): string {
    switch (type) {
      case 'document': return 'text-blue-600 bg-blue-50';
      case 'video': return 'text-red-600 bg-red-50';
      case 'link': return 'text-green-600 bg-green-50';
      case 'image': return 'text-purple-600 bg-purple-50';
      case 'presentation': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }
}
