import { execOnce } from "next/dist/shared/lib/utils"
import fs from 'fs'
import path from 'path'
const { exec } = require('child_process');
import getConfig from 'next/config'

// export default function handler(req, res) {
//   let a = exec('ts-node ./metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ./solana/devnet.json -cp ./configs/config.json -c kard  ./assets')
  
//   res.status(200).json(a)
// }


export default (req, res) => {
  const { serverRuntimeConfig } = getConfig()
  let file = fs.readFileSync(path.join(serverRuntimeConfig.PROJECT_ROOT,'./.cache/devnet-example.json'))
  let data = JSON.parse(file)
  res.status(200).json(data)
}