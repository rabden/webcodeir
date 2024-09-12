import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const LIMIT = 20;
const TIME_WINDOW = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export const useImageGenerationLimit = (userId) => {
  const [generationCount, setGenerationCount] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(null);

  useEffect(() => {
    const fetchGenerationData = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('image_generation_limits')
        .select('generation_count, last_reset_time')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching image generation data:', error);
        return;
      }

      const currentTime = new Date().getTime();
      if (data) {
        if (currentTime - new Date(data.last_reset_time).getTime() > TIME_WINDOW) {
          // Reset if more than 6 hours have passed
          setGenerationCount(0);
          setLastResetTime(currentTime);
          updateGenerationData(userId, 0, currentTime);
        } else {
          setGenerationCount(data.generation_count);
          setLastResetTime(new Date(data.last_reset_time).getTime());
        }
      } else {
        // Initialize if no data exists
        setGenerationCount(0);
        setLastResetTime(currentTime);
        updateGenerationData(userId, 0, currentTime);
      }
    };

    fetchGenerationData();
  }, [userId]);

  const updateGenerationData = async (userId, count, resetTime) => {
    const { error } = await supabase
      .from('image_generation_limits')
      .upsert({ user_id: userId, generation_count: count, last_reset_time: new Date(resetTime).toISOString() });

    if (error) {
      console.error('Error updating image generation data:', error);
    }
  };

  const incrementCount = async () => {
    if (generationCount >= LIMIT) {
      return false;
    }

    const newCount = generationCount + 1;
    setGenerationCount(newCount);
    await updateGenerationData(userId, newCount, lastResetTime);
    return true;
  };

  return {
    generationCount,
    canGenerate: generationCount < LIMIT,
    incrementCount,
    lastResetTime,
  };
};