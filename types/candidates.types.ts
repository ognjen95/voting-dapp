export type CandidatesType = {
    name: any;
    age: number;
    cult: any;
    candidateId: number;
    voteCount?: number;
}

export type ReducedCandidatesType = {
    indexedCandidates: CandidatesType[],
    indexedCandidatesToHex: CandidatesType[]
  }