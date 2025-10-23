class FileService {
  private readonly UPLOAD_URL = '/api/upload';
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  async uploadFile(file: File): Promise<{ url: string }> {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('File type not allowed');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds limit');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(this.UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  getFilePreview(url: string): string {
    const fileType = this.getFileType(url);
    
    if (this.isImage(fileType)) {
      return url;
    }
    
    return this.getFileIcon(fileType);
  }

  private getFileType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  }

  private isImage(fileType: string): boolean {
    return fileType.startsWith('image/');
  }

  private getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'application/pdf':
        return '/icons/pdf.svg';
      default:
        return '/icons/file.svg';
    }
  }
}

export const fileService = new FileService();