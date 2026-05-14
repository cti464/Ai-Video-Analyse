export const extractFrames = async (file: File, numFrames: number = 3): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.crossOrigin = "anonymous";
    video.muted = true;
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const interval = Math.min(duration / numFrames, 5); // Take frames up to first 15 seconds if long
      
      const frames: string[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not found'));

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;

      let currentFrame = 0;

      const captureFrame = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]); // Just base64 data
        currentFrame++;

        if (currentFrame < numFrames) {
          video.currentTime = currentFrame * interval;
        } else {
          URL.revokeObjectURL(url);
          resolve(frames);
        }
      };

      video.addEventListener('seeked', captureFrame);
      video.currentTime = 0; // Starts the process
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video'));
    }
  });
};
