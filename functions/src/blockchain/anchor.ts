import { polygonClient } from "./client";

export async function anchorHashOnChain(hash: string) {
  const tx = await polygonClient.sendTransaction({
    to: polygonClient.account.address,
    data: `0x${Buffer.from(hash).toString("hex")}`
  });

  return tx; // return transaction hash
}
