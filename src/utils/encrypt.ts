import JSEncrypt from 'jsencrypt'
import { getPublicKey } from '@/api/publicKey'

const privateKey =
  'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMFPa+v52FkSUXvcUnrGI/XzW3EpZRI0s9BCWJ3oNQmEYA5luWW5p8h0uadTIoTyYweFPdH4hveyxlwmS7oefvbIdiP+o+QIYW/R4Wjsb4Yl8MhR4PJqUE3RCy6IT9fM8ckG4kN9ECs6Ja8fQFc6/mSl5dJczzJO3k1rWMBhKJD/AgMBAAECgYEAucMakH9dWeryhrYoRHcXo4giPVJsH9ypVt4KzmOQY/7jV7KFQK3x//27UoHfUCak51sxFw9ek7UmTPM4HjikA9LkYeE7S381b4QRvFuf3L6IbMP3ywJnJ8pPr2l5SqQ00W+oKv+w/VmEsyUHr+k4Z+4ik+FheTkVWp566WbqFsECQQDjYaMcaKw3j2Zecl8T6eUe7fdaRMIzp/gcpPMfT/9rDzIQk+7ORvm1NI9AUmFv/FAlfpuAMrdL2n7p9uznWb7RAkEA2aP934kbXg5bdV0R313MrL+7WTK/qdcYxATUbMsMuWWQBoS5irrt80WCZbG48hpocJavLNjbtrjmUX3CuJBmzwJAOJg8uP10n/+ZQzjEYXh+BszEHDuw+pp8LuT/fnOy5zrJA0dO0RjpXijO3vuiNPVgHXT9z1LQPJkNrb5ACPVVgQJBALPeb4uV0bNrJDUb5RB4ghZnIxv18CcaqNIft7vuGCcFBAIPIRTBprR+RuVq+xHDt3sNXdsvom4h49+Hky1b0ksCQBBwUtVaqH6ztCtwUF1j2c/Zcrt5P/uN7IHAd44K0gIJc1+Csr3qPG+G2yoqRM8KVqLI8Z2ZYn9c+AvEE+L9OQY='

/**
 * 最长加密长度
 * @type {number}
 */
const MAX_ENCRYPT_BLOCK = 117
/**
 * 最长解码长度
 * @type {number}
 */
const MAX_DECRYPT_BLOCK = 128

/**
 * @description RSA加密(支持长字符加密)
 * @param data
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data: any) {
  let publicKey
  const res = await getPublicKey()
  publicKey = res.data.publicKey
  if (res.data.mockServer) {
    publicKey = ''
  }
  if (publicKey === '') {
    return data
  }
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  )
  let bufTmp: any = ''
  let hexTmp: any = ''
  let result: any = ''
  const buffer = Buffer.from(JSON.stringify(data))
  let offSet = 0
  const inputLen = buffer.length
  while (inputLen - offSet > 0) {
    if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
      bufTmp = buffer.slice(offSet, offSet + MAX_ENCRYPT_BLOCK)
    } else {
      bufTmp = buffer.slice(offSet, inputLen)
    }
    hexTmp = encrypt.encrypt(bufTmp.toString())
    result += atob(hexTmp)
    offSet += MAX_ENCRYPT_BLOCK
  }
  return btoa(result)
}

/**
 * @description RSA解密(支持长字符解密)
 * @param data
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function decryptedData(data: string) {
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(
    `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
  )
  let bufTmp: any = ''
  let hexTmp: any = ''
  let result: any = ''
  const buffer = atob(data)
  let offSet = 0
  const inputLen = buffer.length
  while (inputLen - offSet > 0) {
    if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
      bufTmp = buffer.slice(offSet, offSet + MAX_DECRYPT_BLOCK)
    } else {
      bufTmp = buffer.slice(offSet, inputLen)
    }
    hexTmp = decrypt.decrypt(btoa(bufTmp))
    result += hexTmp
    offSet += MAX_DECRYPT_BLOCK
  }
  return JSON.parse(result)
}
