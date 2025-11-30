import { API_CONFIG } from '../utils/constants';

class ApiService {
  async uploadVideo(video, overlays, options) {
    const formData = new FormData();
    
    // Add video file
    formData.append('video', {
      uri: video.uri,
      type: 'video/mp4',
      name: 'video.mp4',
    });
    
    // Prepare metadata and files
    const metadataOverlays = [];
    let overlayFileIndex = 0;

    overlays.forEach(overlay => {
      const { uri, startTime, endTime, ...rest } = overlay;
      const overlayCopy = { 
        ...rest,
        start_time: startTime,
        end_time: endTime,
      };

      // For image/video overlays, we need to link the metadata to the uploaded file
      // The backend expects 'content' to match the file key (e.g., 'overlay_0')
      if ((overlay.type === 'image' || overlay.type === 'video') && uri) {
        const fileKey = `overlay_${overlayFileIndex}`;
        overlayCopy.content = fileKey;
        
        formData.append(fileKey, {
          uri: uri,
          type: overlay.type === 'image' ? 'image/jpeg' : 'video/mp4',
          name: `${fileKey}.${overlay.type === 'image' ? 'jpg' : 'mp4'}`,
        });
        overlayFileIndex++;
      }
      
      metadataOverlays.push(overlayCopy);
    });
    
    // Add metadata as JSON string
    formData.append('metadata', JSON.stringify(metadataOverlays));

    try {
      console.log('Uploading to:', `${API_CONFIG.BASE_URL}/upload`);
      console.log('FormData entries:', formData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser/React Native set it automatically
        // with the correct boundary for multipart/form-data
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        apiUrl: API_CONFIG.BASE_URL
      });
      
      // Provide more specific error messages
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to backend at ${API_CONFIG.BASE_URL}. Make sure:\n- Backend is running\n- Using correct URL for your device (localhost for simulator, IP for physical device)`);
      }
      
      throw error;
    }
  }

  async getStatus(jobId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/status/${jobId}`);
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    return await response.json();
  }

  getDownloadUrl(jobId) {
    return `${API_CONFIG.BASE_URL}/download/${jobId}`;
  }
}

export default new ApiService();
