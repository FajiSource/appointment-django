import { jwtDecrypt } from 'jose'

export const decryptJWE = async (jweString, secretKey) => {
  const secret = new TextEncoder().encode(secretKey)
  const { payload } = await jwtDecrypt(jweString, secret)
  return payload
}