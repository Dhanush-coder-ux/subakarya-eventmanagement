import React from 'react';
import { RepostRequestDialog } from '../../../components/reposts/RepostRequestDialog';
import { Reel } from '../types/reel.types';

interface RepostDialogProps {
  reel: Reel;
  isOpen: boolean;
  onClose: () => void;
}

export const RepostDialog: React.FC<RepostDialogProps> = ({
  reel,
  isOpen,
  onClose,
}) => {
  return (
    <RepostRequestDialog
      reel={reel}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

