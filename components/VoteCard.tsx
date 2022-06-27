import { ChangeEvent, FunctionComponent } from 'react'

type Props = {
  name: string,
  age: number,
  setCandidateIdForVote: () => void,
  handleTokenValueChange: (e: ChangeEvent<unknown>) => void,
  cult: string,
  errorMsg: string,
  votingSuccessMsg: string,
  WKNDInput: number;
  i: number;
  isActive: boolean;
}

const CandidateCard: FunctionComponent<Props> = ({
  name,
  age,
  cult,
  setCandidateIdForVote,
  handleTokenValueChange,
  votingSuccessMsg,
  errorMsg,
  i,
  isActive }) => {
  return (
    <div className="border shadow rounded-xl bg-gray-100 overflow-hidden my-4 flex flex-col justify-between	">

      <div className={'p-4'}>
        <p className="text-3xl pb-6 font-semibold">Name: {name}</p>
        <p className="text-2xl pb-6 font-semibold">Age: {age}</p>
        <p className="text-2xl font-semibold">Cult: {cult}</p>
      </div>
      <div className="flex justify-center pt-2">
      </div>
      <div className="p-4 bg-gray-800">
        {errorMsg || votingSuccessMsg ?
          <p className={`font-bold text-${votingSuccessMsg ? 'white' : 'red-500'}`}>{errorMsg || votingSuccessMsg}</p>
          : <div>
            <input
              name={`${i}`}
              placeholder="Amount of WKND"
              type="number"
              className="border rounded p-4 w-full	mb-2"
              onChange={handleTokenValueChange}
              disabled={!isActive}
            />
            <button className="w-full bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-12 rounded" disabled={!isActive} onClick={setCandidateIdForVote}>
              Vote
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default CandidateCard