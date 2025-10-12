import { Bet } from "../types";

export interface ParticipateModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: Bet | null;
  onParticipate: (betId: number, selectedOptionId: number) => Promise<void>;
}
