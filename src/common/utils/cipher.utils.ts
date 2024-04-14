import * as crypto from 'crypto-js'

const secret = process.env.CIPHER_KEY || '7Y6zcMKdoEoMuciLovCUuZhiN1Q0HPIkaIfWHP9yqThFkjxbxiKZwpEInyggEcrv'

export default {
    encrypt: (str : string) : string => crypto.AES.encrypt(str, secret).toString(),
    decrypt: (str : string) : string => crypto.AES.decrypt(str, secret).toString(crypto.enc.Utf8),
}
