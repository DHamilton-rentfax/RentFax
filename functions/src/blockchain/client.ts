import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";

export const polygonClient = createWalletClient({
  chain: polygon,
  transport: http(process.env.POLYGON_RPC!),
});
