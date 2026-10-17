export interface VaultTransactionRequest {
  action: "DEPOSIT" | "WITHDRAW" | "HARVEST";
  vaultAddress: string;
  user: string;
  assets?: bigint;
  shares?: bigint;
  strategyId?: string;
}

export interface ClientConfig {
  defaultVaultAddress?: string;
  chainAdapter?: {
    broadcast(payload: any): Promise<{ txHash: string; status: string }>;
  };
}
