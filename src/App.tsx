import './App.css'
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import {IIdentityWallet}  from '@0xpolygonid/js-sdk'

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [] }
  const [wallet, setWallet] = useState(initialState)
  const [createdDID, setCreatedDID] = useState<string | null>(null);

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {                
      if (accounts.length > 0) {                                
        updateWallet(accounts)                                  
      } else {                                                  
        // if length 0, user is disconnected                    
        setWallet(initialState)                                 
      }                                                         
    }                                                           

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider) {                                          
        const accounts = await window.ethereum.request(        
          { method: 'eth_accounts' }                           
        )                                                      
        refreshAccounts(accounts)                              
        window.ethereum.on('accountsChanged', refreshAccounts) 
      }                                                        
    }

    getProvider()
    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
    }                                                           
  }, [])

  const updateWallet = async (accounts:any) => {
    setWallet({ accounts })
  }

  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    updateWallet(accounts)
  }

  const hanndleCreateDID = async () => {
    if (wallet.accounts.length > 0) {
      // Use the createIdentity function from PolygonID
      const identity: any = {}
      
      // Assuming the identity object has a property 'did' for the created DID
      const did = identity.did;
      setCreatedDID(did);
  } else {
      console.error("No connected account found.");
  }
  }

  return (
    <div className="App">
      <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>

      { window.ethereum?.isMetaMask && wallet.accounts.length < 1 && 
        <button onClick={handleConnect}>Connect MetaMask</button>
      }

      { wallet.accounts.length > 0 &&
      <div>
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
        <button onClick={hanndleCreateDID}>Createdid</button>
        { createdDID && <div>Created DID: {createdDID}</div> }
      </div>
      }
    </div>
  )
}

export default App