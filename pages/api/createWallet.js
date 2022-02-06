import { execOnce } from "next/dist/shared/lib/utils"
const { exec } = require('child_process');
// Fake users data
const users = [{ id: 1 }, { id: 2 }, { id: 3 }]

export default function handler(req, res) {
  let a = exec('solana-keygen new --outfile ~/.config/solana/devnet.json  ')
  res.status(200).json(a)
}