import { useState, useEffect } from 'react';
import { useVideoPlayer } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';

export const useVideo = () => {
  const [video, setVideo] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create video player instance
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = false;
    player.muted = false;
  });

  // Setup playback status listener
  useEffect(() => {
    if(!player) return;
  
    if (player && videoUri) {
      const subscription = player.addListener('timeUpdate', (event) => {
        const time = event.currentTime;
        setCurrentTime(time);
        if (player.duration > 0) {
          setDuration(player.duration);
          
          // Check if video has reached the end (within 0.1 seconds tolerance)
          if (time >= player.duration - 0.1 && player.playing) {
            player.pause();
            setIsPlaying(false);
            // Reset to beginning when video ends
            player.currentTime = 0;
            setCurrentTime(0);
          }
        }
      });
      
      const statusSubscription = player.addListener('statusChange', (status) => {
        setIsPlaying(status.isPlaying);
        if (status.duration > 0) {
          setDuration(status.duration);
        }
      });

      const interval = setInterval(() => {
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
        setIsPlaying(player.playing);
    }, 100);

    return () => clearInterval(interval);

      return () => {
        subscription.remove();
        statusSubscription.remove();
        clearInterval(interval);
      };
    }
  }, [player, videoUri]);

  const uploadVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setVideo(asset);
        setVideoUri(asset.uri);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error picking video:', error);
      return false;
    }
  };

  const togglePlayPause = () => {
    if (player) {
      const videoDuration = player.duration > 0 ? player.duration : duration;
      
      // If video has ended (at or near the end), restart from beginning
      if (videoDuration > 0 && currentTime >= videoDuration - 0.1) {
        player.currentTime = 0;
        setCurrentTime(0);
        player.play();
        setIsPlaying(true);
      } else if (isPlaying) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    }
  };

  const seekTo = (time) => {
    if (player) {
      const videoDuration = player.duration > 0 ? player.duration : duration;
      
      if (videoDuration > 0) {
        // Clamp time to valid range
        const clampedTime = Math.max(0, Math.min(time, videoDuration));
        player.currentTime = clampedTime;
        setCurrentTime(clampedTime); // Update local state immediately for responsive UI
        
        // If seeking to end or near end, pause the video
        if (clampedTime >= videoDuration - 0.1) {
          player.pause();
          setIsPlaying(false);
        }
      } else {
        // If duration not available yet, just seek to the time
        player.currentTime = Math.max(0, time);
        setCurrentTime(Math.max(0, time));
      }
    }
  };

  const resetVideo = () => {
    if (player) {
      player.pause();
    }
    setVideo(null);
    setVideoUri(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  return {
    video,
    videoUri,
    currentTime,
    duration,
    isPlaying,
    player,
    uploadVideo,
    togglePlayPause,
    seekTo,
    resetVideo,
  };
};
