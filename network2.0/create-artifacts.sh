echo "Creating crypto materials..."
cryptogen generate --config=./crypto-config.yaml --output=./crypto-config
echo "Generated crypto materials successfully!!!"

echo "Generating connection profiles for each organization..."
./generate-ccp.sh
echo "Connection profiles generated successfully!!!"

SYS_CHANNEL="sys-channel"

CHANNEL_NAME="mychannel"

echo $CHANNEL_NAME

echo "Generating genesis block and mychannel.tx files..."
configtxgen -configPath . -profile SupplyOrdererGenesis -channelID $SYS_CHANNEL -outputBlock ./channel-artifacts/genesis.block

configtxgen -configPath . -profile SupplyChannel -channelID $CHANNEL_NAME -outputCreateChannelTx ./channel-artifacts/mychannel.tx
echo "Genesis block anf mychannel.tx file generated successfully in channel-artifacts folder!!!"

echo "Creating anchor peers for each organization..."
configtxgen -profile SupplyChannel -configPath . -outputAnchorPeersUpdate ./channel-artifacts/ProducerMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg ProducerMSP
configtxgen -profile SupplyChannel -configPath . -outputAnchorPeersUpdate ./channel-artifacts/RetailerMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg RetailerMSP
configtxgen -profile SupplyChannel -configPath . -outputAnchorPeersUpdate ./channel-artifacts/ManufacturerMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg ManufacturerMSP
configtxgen -profile SupplyChannel -configPath . -outputAnchorPeersUpdate ./channel-artifacts/DelivererMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg DelivererMSP
echo "Anchor peers created successfully!!!"

