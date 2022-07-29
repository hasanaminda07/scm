# Necessary Installations
# I hope you already have installed prerequisites required while doing this course 
    1. [ Installing Hyperledger Fabric Dependencies ] (https://hyperledger-fabric.readthedocs.io/en/release-2.2/install.html)

    2. Install fabric binaries and images
    ```bash
        curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.1 1.4.7
    ```
    # Make sure you export these binaries to your environment PATH
        export PATH=$PATH:~/bin

    3. [ Installing npm and nodejs ]
    ```bash
        npm apt-get install nodejs
        npm apt-get install npm
        You can also follow the steps in the link (https://nodejs.org/en/)
    
    4. Make sure you have installed golang and exported in PATH
       (https://golang.org/dl/)

    5. Install and upgrade docker and docker-compose:
        - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        - sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu
        - $(lsb_release -cs) stable"
        - $ sudo apt-get update
        - $ apt-cache policy docker-ce
        - sudo apt-get install -y docker-ce
        - sudo apt-get install docker-compose
        - sudo apt-get upgrade

        - If not a Linux user follow this link to know the steps on Windows/Mac or other OS
          (https://docs.docker.com/engine/install/) 

# Important things to read.
# 1. Using CA instead of cryptogen tool for generating crypto materials 
    (https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/)
# 2. Fabric Chaincode Lifecycle
    (https://hyperledger-fabric.readthedocs.io/en/release-2.2/chaincode_lifecycle.html)
# 3. Know about Wallets
    (https://hyperledger-fabric.readthedocs.io/en/release-2.2/developapps/wallet.html)


# Getting Started.

# Make sure you are in the source folder i.e. Network2.0 folder and run command through this folder/

# Step 1: Creating crypto materials and generating genesis block, mychannel.tx and Achor Peers.
    Run ./create-artifacts.sh file

# Step 2: Running all the services and bringing up the network.
    Run docker-compose up -d

# Step 3: Creating channel and joining each peer to the channel.
    Run ./createChannel.sh file.

# Step 4: Deploying Chaincode
    1. Go in chaincode folder and run npm install command to install required dependencies.
        cd chaincode
        npm install
    2. Come back to root folder(network2.0 folder) and run following command.
        ./deployChaincode.sh

# Step 5: Writing Client API to interact with the network.
Install following libraries in src folder:

    cd src
    npm install
    npm install fabric-client fabric-network fabric-ca-client
    npm install express --save
    npm install body-parser
    npm install pdfkit
    npm install js-yaml
    cd ..

    1. Creating wallets for each organiation
        Run commands:
            node src/addWallet.js producer
            node src/addWallet.js retailer
            node src/addWallet.js manufacturer
            node src/addWallet.js deliverer
    2. Creating REST API to interact with system
            Run command
            node src/app.js
    3. Executing html files for API calls to the server.
        All this html files are in /src folder.
            Adding Tuna : producerapp.html
            Query Tuna  : manufacturer1app.html
            Set Position: delivererapp.html
            Add Sushi   : manufacturer2.html
            Query Sushi : retailerapp.html

# To completely clean the project and generate a source folder so that you can perform steps again from   scratch, run following command:
    ./clean.sh


