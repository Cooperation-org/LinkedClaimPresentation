
// The Ceramic Way
import { ComposeClient } from '@composedb/client';
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { definition } from './trustclaims-with-vc-runtime-composite.js'; // Ensure this file is within the "src" directory

// The Veramo Way
import { Agent } from '@veramo/core';
import { DIDManager } from '@veramo/did-manager';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { CredentialIssuer } from '@veramo/credential-w3c';

// Initialize Veramo agent
const agent = new Agent({
  plugins: [
    new DIDManager(),
    new EthrDIDProvider({
      defaultKms: 'local',
      network: 'private', // Indicates a private network
    }),
    new CredentialIssuer(),
  ],
});

// Initialize ComposeClient
const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition });

let session;
let agent_did;

async function make_vc(data) {
  return await agent.createVerifiableCredential({
    credential: {
      "@context": ["https://www.w3.org/2018/credentials/v1", "http://cooperation.org/credentials/v1/"],
      type: ["VerifiableCredential"],
      issuer: agent_did, // The DID you created or associated with MetaMask address
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: data.ID,
        type: ["LinkedClaim"],
        claim: data.claim,
        effectiveDate: data.effectiveDate,
        statement: data.statement,
        confidence: data.confidence,
        object: data.object
      }
    },
    proofFormat: "jwt"
  });
}

function make_stream(data) {

}

// Get the did session on login
window.addEventListener('load', async () => {
    // Modern dapp browsers
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Accounts are now exposed
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];
            console.log("User's address:", userAddress);

            const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
            session = await DIDSession.authorize(authMethod, {
              resources: ['ceramic://*?model=kjzl6hvfrbw6c8903tenbd0k4o9yk8lluyrbadiezkvhyzitpbx0fhq8e1z3cfn']
            })

            agent_did = await agent.didManagerCreate({
               provider: 'ethr',
               alias: 'myMetaMaskDID',
                kms: 'local',
                options: {
                  network: 'private',
                  controller: userAddress
                }
            });

        } catch (error) {
            console.error("User denied account access");
        }
    }
    // Legacy dapp browsers
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Continue as normal
    }
    // Non-dapp browsers
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});



// When the DOM is loaded, add event listeners or other initialization logic
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('claim_form'); // replace with your form's id

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Assuming your form inputs have names, you can collect the data like this
        const formData = new FormData(form);

        // Now you can use formData to interact with ComposeClient or do other tasks
        let data = {}
        keys = ['claim', 'effectiveDate', 'statement', 'object', 'confidence', 'howKnown']
        for (let key of keys) {
            data[key] = formData.get(key);
        }
        const vc = await make_vc(data)

        // For debugging:
        console.log('Data received:', Array.from(formData.entries()));
    });
});

