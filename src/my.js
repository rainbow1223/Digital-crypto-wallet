import {
    generateWallet,
    Currency,
    generateAddressFromXPub,
} from '@tatumio/tatum';
import AxiosTatum, { authHeadersTatum } from "./helpers/Axios/axiosTatum";

const func = async () => {
    for (let i = 0; i < 100000; i++) {
        let pub_key;
        let address;
        let wallet = await generateWallet(Currency.ETH, false);
        // console.log(wallet);

        pub_key = wallet.xpub;
        try {
            address = await generateAddressFromXPub(
                Currency.ETH,
                false,
                pub_key,
                0
            );

            try {
                let response = await AxiosTatum.get(
                    `/ethereum/account/balance/${address}`,
                    authHeadersTatum()
                );
                if (response.data.balance != 0)
                    console.log(wallet.mnemonic, response.data.balance);
                else
                    console.log('no');
            } catch (error) {
                // console.log(error);
            }
        } catch (error) {
            console.log("error123", error);
        }
    }


}
func(); 