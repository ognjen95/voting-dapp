import { ChangeEvent, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import { votingaddress } from '../config'

import VOTING from '../artifacts/contracts/Voting.sol/Voting.json'
import { getContractSigner } from './utils'

const SignIn = () => {
  const [formInput, setFormInput] = useState('')
  const [formError, setFormError] = useState('')
  const { push } = useRouter()


  const createTokenAndEnterVoting = async () => {
    if (!formInput) {
      setFormError('Please enter ETH address to enter voting room');
      return;
    } else if (formError) setFormError('')

    const signer = await getContractSigner();

    // /* create the WKND token and send user to voting */
    let contract = new ethers.Contract(votingaddress, VOTING.abi, signer)
    const creationOfWKNDToken = await contract.createNewToken(formInput);
    await creationOfWKNDToken.wait()
    
    push('/voting-room')
  }

  const handleChange = (e: ChangeEvent) => setFormInput((e.target as HTMLInputElement)?.value)

  return (
    <div className="flex justify-center mt-12">
      <div className="w-1/2 flex flex-col pb-12">
        <h1 className="flex justify-center p-6 text-3xl">
          Please enter your ETH address to enter Voting Room
        </h1>
        <input
          placeholder="Eth Address"
          className="mt-8 border rounded p-4"
          onChange={handleChange}
        />
        <button onClick={createTokenAndEnterVoting} className="font-bold mt-4 bg-gray-800 text-white rounded p-4 shadow-lg">
          Enter Voting Room
        </button>
        <div className="flex justify-center pt-2">
          {formError && <p className="font-bold text-red-500">{formError}</p>}
        </div>
      </div>
    </div>
  )
}

export default SignIn;