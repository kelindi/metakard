import { execOnce } from "next/dist/shared/lib/utils"
import fs from 'fs'
import path from 'path'
const { exec } = require('child_process');
import getConfig from 'next/config'


let createConfigJSON = (price,quantity,wallet) => {
  const { serverRuntimeConfig } = getConfig()
  let name = 'config.json'
  let config = JSON.parse(fs.readFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, 'configs', name), 'utf8'))
  config.price = price
  config.number = quantity
  //get todays date in a format same as  15 Jan 2022 00:00:00 GMT
  let today = new Date();
  console.log(config.date)
  fs.writeFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, 'configs', name), JSON.stringify(config))
}

let createMetaDataJSON = (companyName,collectionName,description,wallet) => {
const { serverRuntimeConfig } = getConfig()
let name = '0.json'
let metadata = JSON.parse(fs.readFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, 'assets', name), 'utf8'))
metadata.name = collectionName
metadata.description = description
metadata.collection.name = collectionName
metadata.collection.family = companyName
metadata.properties.creators[0].address = wallet
fs.writeFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, 'assets', name), JSON.stringify(metadata))
}

let getFile = async (image) => {
  
    exec(`wget ${image} -O ${path.join(serverRuntimeConfig.PROJECT_ROOT,'./assets')}/0.jpg`)
 }
  






export default async (req, res) => {
  const { serverRuntimeConfig } = getConfig()

  const result = await new Promise((resolve, reject) => {
   exec(
      `wget ${req.body.image} -O ${path.join(serverRuntimeConfig.PROJECT_ROOT,'./assets')}/0.jpg`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout); 
        }
      });
});
  //create config.json
  createConfigJSON(req.body.price,req.body.quantity,req.body.wallet)
  //create metadata.json
  createMetaDataJSON(req.body.companyName,req.body.collectionName,req.body.description,req.body.wallet)
  //create the candy machine
  let makemachine = await new Promise((resolve, reject) => { exec(`ts-node ./metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ./solana/devnet.json -cp ./configs/config.json -c kard ./assets`
  , (error, stdout, stderr) => {
    if (error) {
      reject
      (`exec error: ${error}`);
    }
    if (stderr) {
      console.log(stderr)
      //res.status(500)
    }
    if (stdout) {
      resolve(stdout)
      //res.status(200)
    }
  })
});
  //open /.cache and writ ethe machine address to machines.json
  let machines = JSON.parse(fs.readFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, 'machine','machines.json'), 'utf8'))
  let cache = JSON.parse(fs.readFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, '.cache','devnet-kard.json'), 'utf8'))
  machines.machines.push(cache.program.candyMachine)
  let data = cache.program.candyMachine
  console.log(data)
  fs.writeFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT, 'machine','machines.json'), JSON.stringify(machines))
  res.status(200).send({message:data})
}