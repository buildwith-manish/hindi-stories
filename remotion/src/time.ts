import {useCurrentFrame} from 'remotion';
import {K} from './timing';

/**
 * Current frame expressed in the 30 fps units every animation constant was written in.
 * Changing FPS then makes motion smoother without changing its speed or length.
 */
export const useF = () => useCurrentFrame() / K;
