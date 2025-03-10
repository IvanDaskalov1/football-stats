export interface Team {
  name: string;
  crest?: string;
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    }
  };
  competition?: {
    name: string;
    emblem?: string;
  };
}

export interface Prediction {
  id?: string;
  userId: string;
  userName: string;
  matchId: number;
  prediction: string;
  score?: number;
  createdAt?: Date;
}

export interface UserScore {
  userId: string;
  userName: string;
  totalScore: number;
  correctScores: number;
  correctOutcomes: number;
} 