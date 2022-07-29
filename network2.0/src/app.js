
const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const app = express();
app.use(bodyParser.json());

// Setting for Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const gateway = new Gateway();

app.use(bodyParser.urlencoded({
    extended: false
  }));
  //app.set('views', 'views');
  app.set('view engine', 'ejs');
  
// CORS Origin
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.post('/api/addTuna', async function (req, res) {

    try {
            //const contract = await fabricNetwork.connectNetwork('connection-producer.json', 'wallet/wallet-producer');
            const ccpPath = path.resolve(__dirname, '..', 'connections', 'connection-producer.yaml');
            let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));

            const walletPath = path.join(process.cwd(), 'identity/user/producer-user/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            const userName = 'producer-user';

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(userName);
            if (!identity) {
                console.log(`An identity for the user ${userName} does not exist in the wallet`);
                console.log('Run the addWallet.js application before retrying');
                return;
            }

            // Set connection options; identity and wallet
            let connectionOptions = {
                identity: userName,
                wallet: wallet,
                discovery: { enabled:true, asLocalhost: true }
            };

            // Connect to gateway using application specified parameters
            console.log('Connect to Fabric gateway.');
            

            await gateway.connect(connectionProfile, connectionOptions);

            console.log('Use network channel: mychannel.');

            const network = await gateway.getNetwork('mychannel');

            const contract = await network.getContract('scm-contract');


            let tuna = {
                id: req.body.id,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                length: req.body.length,
                weight: req.body.weight
            }

        let tx = await contract.submitTransaction('addAsset', JSON.stringify(tuna));
        res.json({
            status: 'OK - Transaction has been submitted',
            txid: tx.toString()
        });
        console.log("Tuna Added Successfully");
        } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({
            error: error
        });
        }
        finally {

            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
  
  });

  app.post('/api/setPosition', async function (req, res) {

    try {
      
        const ccpPath = path.resolve(__dirname, '..', 'connections', 'connection-deliverer.yaml');
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'identity/user/deliverer-user/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userName = 'deliverer-user';

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user ${userName} does not exist in the wallet`);
            console.log('Run the addWallet.js application before retrying');
            return;
        }

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        const contract = await network.getContract('scm-contract');



      let tx = await contract.submitTransaction('setPosition', req.body.id.toString(), req.body.latitude.toString(), req.body.longitude.toString());
      res.json({
        status: 'OK - Transaction has been submitted',
        txid: tx.toString()
      });
      console.log("Position of product updated");
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      res.status(500).json({
        error: error
      });
    }
    finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
  
  });
  
  app.post('/api/getTuna', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'connections', 'connection-manufacturer.yaml');
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'identity/user/manufacturer-user/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userName = 'manufacturer-user';

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user ${userName} does not exist in the wallet`);
            console.log('Run the addWallet.js application before retrying');
            return;
        }

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        const contract = await network.getContract('scm-contract');

        let pdfDoc = new PDFDocument;
        pdfDoc.pipe(fs.createWriteStream('Product_Details.pdf'));
      const result = await contract.evaluateTransaction('queryAsset', req.body.id);
      let response = JSON.parse(result.toString());
      console.log(result.toString());
      //res.json({result:response});
      res.render('TunaDetails');
      pdfDoc.text("Details: "+ result.toString(), 200, 200);
      pdfDoc.end();
      
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      res.status(500).json({
        error: error
      });
    }
    finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
  
  })

  app.post('/api/addSushi', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'connections', 'connection-manufacturer.yaml');
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'identity/user/manufacturer-user/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userName = 'manufacturer-user';

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user ${userName} does not exist in the wallet`);
            console.log('Run the addWallet.js application before retrying');
            return;
        }

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        const contract = await network.getContract('scm-contract');


      let sushi = {
        id: req.body.id,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        type: req.body.type,
        tunaId: req.body.tunaId
      }
      let tx = await contract.submitTransaction('addAsset', JSON.stringify(sushi));
      res.json({
        status: 'OK - Transaction has been submitted',
        txid: tx.toString()
      });
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      res.status(500).json({
        error: error
      });
    }
    finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
  
  
  })
  
  app.post('/api/getSushi', async function (req, res) {
    try {
        const ccpPath = path.resolve(__dirname, '..', 'connections', 'connection-retailer.yaml');
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'identity/user/retailer-user/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userName = 'retailer-user';

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user ${userName} does not exist in the wallet`);
            console.log('Run the addWallet.js application before retrying');
            return;
        }

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        const contract = await network.getContract('scm-contract');

      let pdfDoc = new PDFDocument;
      pdfDoc.pipe(fs.createWriteStream('Sushi_Details.pdf'));
      const result = await contract.evaluateTransaction('queryAsset', req.body.id);
      let response = JSON.parse(result.toString());
      //res.json(response);
      console.log(result.toString());
      res.render('SushiDetails');
      pdfDoc.text("Details: "+ result.toString(), 200, 200);
      pdfDoc.end();
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      res.status(500).json({
        error: error
      });
    }
    finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
  })
  app.listen(3000, () => {
    console.log("***********************************");
    console.log('REST Server listening on port 3000');
    console.log("***********************************");
  });
  