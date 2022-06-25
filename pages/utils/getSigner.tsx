import { ethers } from 'ethers'
import Web3Modal from "web3modal"

const getContractSigner = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    return signer;
}

export default getContractSigner;