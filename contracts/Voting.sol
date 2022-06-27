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

        require(!sender.voted, "Already voted, each voter can vote only once!");
        
        require(
            getTokenBalance() >= 1 * 10**decimals(),
            "The Voter needs at least 1 WKND"
        );


        transfer(address(this), wkndAmount * 10**decimals());

        sender.voted = true;
        sender.voterAddress = msg.sender;
        sender.candidateId = candidateId;

        electionCandidates[candidateId].voteCount += 1;

        Candidate[] memory winningCandidates = returnWinningCandidates();

        delete topThreeCandidates;

        uint256 lengthOfCandidates;

        if (winningCandidates.length >= 3) {
            lengthOfCandidates = 3;
        } else {
            lengthOfCandidates = winningCandidates.length;
        }

        for (uint256 i = 0; i < lengthOfCandidates; i++) {
            topThreeCandidates.push(
                Candidate(
                    winningCandidates[i].name,
                    winningCandidates[i].age,
                    winningCandidates[i].cult,
                    winningCandidates[i].voteCount,
                    winningCandidates[i].candidateId
                )
            );
        }

        int256 timesNotFound = 0;

        if (winningCandidates.length >= 3) {
            for (uint256 i = 0; i < lengthOfCandidates; i++) {
                if (winningCandidates[i].candidateId != int256(candidateId)) {
                    timesNotFound++;
                }
            }

            bool isThereNewChalanger = timesNotFound == 3;

            if (isThereNewChalanger) {
                emitEvent(candidateId);
            }
        } else {
            emitEvent(candidateId);
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

    function returnWinningCandidates()
        private
        view
        returns (Candidate[] memory)
    {
        require(electionCandidates.length > 0, "There are no Candidates");

        Candidate[] memory candidatesCopy = electionCandidates;

        for (uint256 i = 1; i < candidatesCopy.length; i++) {
            for (uint256 j = 0; j < i; j++) {
                if (candidatesCopy[i].voteCount > candidatesCopy[j].voteCount) {
                    Candidate memory candidate = candidatesCopy[i];
                    candidatesCopy[i] = candidatesCopy[j];
                    candidatesCopy[j] = candidate;
                }
            }
        }

        return candidatesCopy;
    }
}
