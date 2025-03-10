export interface Match {
  id: number;
  utcDate: string;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  status: string;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    }
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