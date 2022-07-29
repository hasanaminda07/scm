docker-compose down

rm -rf crypto-config

rm -rf channel-artifacts/genesis.block
rm -rf channel-artifacts/DelivererMSPAnchors.tx 
rm -rf channel-artifacts/ProducerMSPAnchors.tx
rm -rf channel-artifacts/RetailerMSPAnchors.tx 
rm -rf channel-artifacts/ManufacturerMSPAnchors.tx 
rm -rf channel-artifacts/mychannel.tx
rm -rf channel-artifacts/channel-config/mychannel.block

rm -rf connections/connection-producer.json 
rm -rf connections/connection-producer.yaml
rm -rf connections/connection-retailer.yaml 
rm -rf connections/connection-retailer.json
rm -rf connections/connection-manufacturer.yaml 
rm -rf connections/connection-manufacturer.json
rm -rf connections/connection-deliverer.yaml   
rm -rf connections/connection-deliverer.json 
 
rm -rf identity

rm -rf scm-contract.tar.gz
 
 

 
