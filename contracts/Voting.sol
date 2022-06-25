// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./WKND.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Voting is WakandaToken, ReentrancyGuard {
    struct Voter {
        bool voted;
        address voterAddress;
        uint256 candidateId;
    }

    struct Candidate {
        bytes32 name;
        uint256 age;
        bytes32 cult;
        int256 voteCount;
        int256 candidateId;
    }

    mapping(address => Voter) private voters;

    Candidate[] public electionCandidates;
    Candidate[] public topThreeCandidates;

    event newChalangerEvent(
        bytes32 name,
        uint256 age,
        bytes32 cult,
        int256 voteCount,
        int256 candidateId
    );

    constructor() {}

    function setCandidates(Candidate[] memory candidates) public {
        for (uint256 i = 0; i < candidates.length; i++) {
            Candidate memory candidate = candidates[i];

            electionCandidates.push(
                Candidate(
                    candidate.name,
                    candidate.age,
                    candidate.cult,
                    candidate.voteCount,
                    candidate.candidateId
                )
            );
        }
    }

    function checkForCandidates() public view returns (Candidate[] memory) {
        return electionCandidates;
    }

    function returnWinners() public view returns (Candidate[] memory) {
        return topThreeCandidates;
    }

    function vote(uint256 candidateId, uint256 wkndAmount)
        public
        payable
        nonReentrant
    {
        Voter storage sender = voters[msg.sender];

        require(
            getTokenBalance() >= 1 * 10**decimals(),
            "The Voter needs at least 1 WKND"
        );

        require(!sender.voted, "Already voted, each voter can vote only once!");

        transfer(address(this), wkndAmount * 10**decimals());

        sender.voted = true;
        sender.voterAddress = msg.sender;
        sender.candidateId = candidateId;

        electionCandidates[candidateId].voteCount += 1;

        int256[3] memory winingCandidatesIds = returnWinningCandidates();

        int256 timesNotFound = 0;

        if (
            // Check if each bigger than 3, because we always get [3]
            // But if not real userId it will be -1
            winingCandidatesIds[0] >= 0 &&
            winingCandidatesIds[1] >= 0 &&
            winingCandidatesIds[2] >= 0
        ) {
            bool isThereNewChalanger = timesNotFound == 3;

            for (uint256 i = 0; i < winingCandidatesIds.length; i++) {
                if (winingCandidatesIds[i] != int(candidateId)) {
                    timesNotFound++;
                }
            }

            if (isThereNewChalanger) {
                emitEvent(candidateId);
            }
        } else {
            emitEvent(candidateId);
        }

        delete topThreeCandidates;

        for (uint256 i = 0; i < winingCandidatesIds.length; i++) {
            if (winingCandidatesIds[i] >= 0) {
             topThreeCandidates.push(
                    Candidate(
                        electionCandidates[uint256(winingCandidatesIds[i])].name,
                        electionCandidates[uint256(winingCandidatesIds[i])].age,
                        electionCandidates[uint256(winingCandidatesIds[i])].cult,
                        electionCandidates[uint256(winingCandidatesIds[i])].voteCount,
                        electionCandidates[uint256(winingCandidatesIds[i])].candidateId
                    )
                );
            }
        }
    }

    function emitEvent(uint256 candidateId) private {
        emit newChalangerEvent(
            electionCandidates[candidateId].name,
            electionCandidates[candidateId].age,
            electionCandidates[candidateId].cult,
            electionCandidates[candidateId].voteCount,
            electionCandidates[candidateId].candidateId
        );
    }

    function returnWinningCandidates() private view returns (int256[3] memory) {
        require(electionCandidates.length > 0, "There are no Candidates");

        int256 firstPlace = 0;
        int256 secondPlace = 0;
        int256 thirdPlace = 0;

        int256 firstPlaceId = -1;
        int256 secondPlaceId = -1;
        int256 thirdPlaceId = -1;


        for (uint256 i = 0; i < electionCandidates.length; i++) {
            int256 candidatesVoteCount = electionCandidates[i].voteCount;
            int256 candidateId = electionCandidates[i].candidateId;

            if (candidatesVoteCount >= firstPlace) {
                if (candidatesVoteCount == firstPlace) {
                    thirdPlace = secondPlace;
                    thirdPlaceId = secondPlaceId;

                    secondPlace = firstPlace;
                    secondPlaceId = firstPlaceId;
                }
                firstPlace = candidatesVoteCount;
                firstPlaceId = candidateId;
            } else if (
                candidatesVoteCount < firstPlace &&
                candidatesVoteCount > thirdPlace &&
                candidatesVoteCount > 0
            ) {
                if (candidatesVoteCount == secondPlace) {
                    thirdPlace = secondPlace;
                    thirdPlaceId = secondPlaceId;
                }
                secondPlace = candidatesVoteCount;
                secondPlaceId = candidateId;
            } else if (
                candidatesVoteCount < firstPlace &&
                candidatesVoteCount < secondPlace &&
                candidatesVoteCount > 0
            ) {
                thirdPlace = candidatesVoteCount;
                thirdPlaceId = candidateId;
            }
        }

        int256[3] memory winingCandidatesIds = [
            firstPlaceId,
            secondPlaceId,
            thirdPlaceId
        ];

        return winingCandidatesIds;
    }
}
