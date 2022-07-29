/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');

// Main program function
async function main() {

    // A wallet stores a collection of identities for use
    //const wallet = await Wallets.newFileSystemWallet('../identity/user/producer-user/wallet');
        const walletPath = path.join(process.cwd(), 'identity/user/deliverer-user/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        const args = process.argv.slice(2);
        const id = args[0];
        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'deliverer-user';

        // Load connection profile; will be used to locate a gateway
        const ccpPath = path.resolve(__dirname, '..', 'connections', 'connection-deliverer.yaml');
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        //console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('scm-contract');

        // issue commercial paper
        console.log(' Setting position Tuna transaction.');
        
    
        const latitude = 600;
        const longitude = 400;
    let tx = await contract.submitTransaction('setPosition', id.toString(), latitude.toString(), longitude.toString());
        // process response
        console.log('Position updated.'+ tx.toString());

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Add Tuna program complete.');

}).catch((e) => {

    console.log('Add Tuna program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
