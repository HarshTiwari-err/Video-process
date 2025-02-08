const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export const getPresignedUrls = async (
  videoId: string,
  chunks: number
): Promise<PresignedUrl[]> => {
  try {
    const response = await fetch(`http://localhost:3000/presigned-urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, chunks }),
    });
    
    if (!response.ok) throw new Error('Failed to get presigned URLs');
    return response.json();
  } catch (error) {
    console.error('Error getting presigned URLs:', error);
    throw error;
  }
};