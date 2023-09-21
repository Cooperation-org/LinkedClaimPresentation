import { ceramic, composeClient } from './ceramic_client.js'

const CREATE_LINKED_CLAIM_MUTATION = `
  mutation CreateNewClaim($i:CreateLinkedClaimInput!) {
    createLinkedClaim(input: $i) {
      document {
        id
        ID
        claim
        statement
        object
        howKnown
        confidence
        effectiveDate
        vcSig
      }
    }
  }
`

type LinkedClaimPayload = {
  ID: string
  claim: string
  statement: string
  object: string
  howKnown: string
  confidence: number
  effectiveDate: string
  vcSig: string
}

interface Content {
  ID: string
  claim: string
  statement?: string
  object?: string
  howKnown?: string
  confidence?: number
  effectiveDate?: string
  vcSig?: string
}

const PublishClaim = async (payload: LinkedClaimPayload): Promise<any> => {
  if (!composeClient) {
    console.log('Compose client connection unavailable')
    return { status: 500 }
  }

  let { ID, claim, statement, object, howKnown, confidence, effectiveDate, vcSig } =
    payload

  if (effectiveDate) {
    edate = effectiveDate.substring(0, 10)
  }

  const variables: { i: { content: Content } } = {
    i: {
      content: {
        ID: ID,
        claim: claim,
        effectiveDate: edate
      }
    }
  }

  if (statement) {
    variables['i']['content']['statement'] = statement
  }
  if (howKnown) {
    variables['i']['content']['howKnown'] = howKnown
  }
  if (object) {
    variables['i']['content']['object'] = object
  }
  if (vcSig) {
    variables['i']['content']['howKnown'] = vcSig
  }
  if (confidence) {
    variables['i']['content']['confidence'] = confidence
  }
  console.log('about to execute query on ' + JSON.stringify(variables))
  const response = await composeClient.executeQuery(CREATE_LINKED_CLAIM_MUTATION, variables)

  console.log('Response from composeclient: ' + JSON.stringify(response))
  return response
}

export { PublishClaim }
