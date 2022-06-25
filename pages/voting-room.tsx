import { ethers } from 'ethers'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import { votingaddress } from '../config'
import VOTING from '../artifacts/contracts/Voting.sol/Voting.json'


import { CandidatesType } from '../types/candidates.types'
import { VoteCard, WinnerTable } from '../components'
import { getContractSigner } from './utils'

const CreatorDashboard = () => {
  const [candidates, setCandidates] = useState<CandidatesType[]>([])
  const [showTable, setShowTable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [votingSuccessMsg, setVotingSuccessMsg] = useState('');
  const [loadingState, setLoadingState] = useState(true)
  const [userVote, setUserVote] = useState(-1);
  const [winners, setWinners] = useState<CandidatesType[]>([]);
  const [WKNDInput, setWKNDInput] = useState(0);

  const loadCandidates = useCallback(async () => {
    // Check if there is candidates on blockChain
    // If there is display them
    // If not fetch from provided API
    const data = await axios.get('http://localhost:3001');
    const candidatesFromBlockchain = data.data;

    if (candidatesFromBlockchain.length) {
      setCandidates(candidatesFromBlockchain);
      setLoadingState(false);
      return;
    }
    
    const { data: { candidates: candidatesResponse } } = await axios.get('https://wakanda-task.3327.io/list');

    const signer = await getContractSigner();
    let contract = new ethers.Contract(votingaddress, VOTING.abi, signer)
    const indexedCandidates = candidatesResponse.map((item: any, index: number) => ({
      name: ethers.utils.formatBytes32String(item.name),
      cult: ethers.utils.formatBytes32String(item.cult),
      age: item.age,
      candidateId: index,
      voteCount: 0,
    }));

    const settingOfCandidatesOnBC = await contract.setCandidates(indexedCandidates);
    await settingOfCandidatesOnBC.wait()

    loadCandidates();
  }, [])


  const handleShowTable = useCallback(async () => {
    // Fetch winners from API => Blockchain
    const { data } = await axios.get(`http://localhost:3001/winners`);

    if (!data.length) return;

    setWinners(data);

    setShowTable(prev => !prev)

  }, []);

  const handleVote = useCallback(async () => {
    try {
      if (WKNDInput < 1) {
        setErrorMsg('You must pay at least 1 WKND so you can Vote')
        return;
      }
      const signer = await getContractSigner();
      const address = await signer.getAddress();
      // const isContractAvailable = await axios.post(`http://localhost:3001/vote`, {
      //   address,
      //   userVote,
      //   amount: WKNDInput
      // }).catch((res) => {console.log(res)})
      // if (!isContractAvailable) return;

      const contract = new ethers.Contract(votingaddress, VOTING.abi, signer);
      await contract.vote(userVote, WKNDInput);
      setUserVote(-1)
      setShowTable(false);
      setVotingSuccessMsg('You have voted successfully!')
    } catch (error) {
      // setInterval(() => handleVote(), 3000)
      setErrorMsg('Voting failed. You maybe already voted or do not have enough WKND.')
    }
  }, [userVote, WKNDInput]);

  const handleTokenValueChange = (e: ChangeEvent<unknown>) => { setWKNDInput(+(e.target as HTMLInputElement)?.value) };

  useEffect(() => {
    loadCandidates()
  }, [loadCandidates])

  useEffect(() => {
    if (userVote === -1) return;

    handleVote();
  }, [userVote, handleVote])

  useEffect(() => {
    if (votingSuccessMsg || errorMsg) {
      setTimeout(() => {
        setVotingSuccessMsg('');
        setErrorMsg('');
      }, 3000);
    };

  }, [votingSuccessMsg, errorMsg])

  if (loadingState && !candidates.length) return (<h1 className="py-10 px-20 text-3xl">Loading candidates...</h1>)
  if (!loadingState && !candidates.length) return (<h1 className="py-10 px-20 text-3xl">No candidates to display</h1>)

  return (
    <div>
      {showTable && <WinnerTable winners={winners} />}

      <div className="p-4">
        <div className="flex align-center">
          <h2 className="text-3xl font-bold py-2">Candidates</h2>
          <button className="ml-4 bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-12 rounded" onClick={handleShowTable}>
            {showTable ? 'Hide Table' : 'Show Table'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            candidates.map((candidate, i) => {
              const { name, cult, age } = candidate;
              const setCandidateIdForVote = () => { setUserVote(i) };

              return (
                <VoteCard
                  key={i}
                  {...{
                    name,
                    cult,
                    age,
                    setCandidateIdForVote,
                    errorMsg,
                    WKNDInput,
                    handleTokenValueChange,
                    votingSuccessMsg,
                  }}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default CreatorDashboard;