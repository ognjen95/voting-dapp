import React from 'react'
import { CandidatesType } from '../types/candidates.types'
type Props = {
  winners: CandidatesType[]
}
const WinnerTable = ({ winners }: Props) => {
  return (
    <div className="relative overflow-x-auto shadow-md">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Cult
            </th>
            <th scope="col" className="px-6 py-3">
              Age
            </th>
            <th scope="col" className="px-6 py-3">
              Votes
            </th>
          </tr>
        </thead>
        <tbody>
          {winners?.map((candidate) => {
            if (!candidate?.voteCount) return null;

            return (
              <tr key={candidate?.candidateId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {candidate?.name}
                </th>
                <td className="px-6 py-4">
                  {candidate?.cult}
                </td>
                <td className="px-6 py-4">
                  {candidate?.age}
                </td>
                <td className="px-6 py-4">
                  {candidate?.voteCount}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default WinnerTable