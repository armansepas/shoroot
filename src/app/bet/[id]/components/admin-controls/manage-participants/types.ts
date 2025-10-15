export interface Participant {
  id: number;
  userId: number;
  userEmail?: string;
  userFullName?: string;
  selectedOptionId: number;
  selectedOptionText: string;
  participatedAt: string;
  isWinner?: boolean;
}

export interface ManageParticipantsProps {
  participants: Participant[];
  betOptions: { id: number; optionText: string }[];
  onRemoveParticipant: (participationId: number) => void;
  onChangeOption: (userId: number, newOptionId: number) => void;
  loading: boolean;
}
