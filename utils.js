const crypto = require("crypto")
const PublicKey = require("./models/PublicKey")

const generateKeyPairs = async (userId, accountAddress) => {
     try {
            let keys = await new Promise((resolve, reject) => {
                crypto.generateKeyPair(
                    "rsa",
                    {
                        modulusLength: 1024,
                        publicKeyEncoding: {
                            type: "spki",
                            format: "pem",
                        },
                        privateKeyEncoding: {
                            type: "pkcs8",
                            format: "pem",
                        },
                    },
                    (err, publicKey, privateKey) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve({ publicKey, privateKey });
                    }
                );
            });

            const publicKey = new PublicKey({
                userId: userId,
                accountAddress: accountAddress,
                key: keys.publicKey
            });
            await publicKey.save();

            return keys.privateKey

        } catch (err) {
            console.error(err)
        }

}

module.exports = {generateKeyPairs};