'use client';

export async function uploadImage(file: File): Promise<string> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);

    // Use fetch to upload to a client API route
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}