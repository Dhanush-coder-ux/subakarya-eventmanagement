import { Reel, ReelComment, Repost, RepostRequest, ServiceCategory } from '../../../types';

export type { Reel, ReelComment, Repost, RepostRequest, ServiceCategory };

export interface ReelPlaybackState {
  isPlaying: boolean;
  isMuted: boolean;
  activeReelId: string;
  progressPercent: number;
  hasError: boolean;
  isLoading: boolean;
}

export interface NewCommentPayload {
  text: string;
  parentId?: string;
  replyToUserName?: string;
}

export type RepostSubmissionPayload = Omit<RepostRequest, 'id' | 'createdAt' | 'status' | 'updatedAt'>;
