import { VaultTransactionRequest, ClientConfig } from "./types.js";

export class QmoosaYieldClient {
  public static readonly DEFAULT_VAULT_ADDRESS = "0x8888888888888888888888888888888888888888";
  private config: ClientConfig;

  constructor(config: ClientConfig = {}) {
    this.config = {
      defaultVaultAddress: config.defaultVaultAddress ?? QmoosaYieldClient.DEFAULT_VAULT_ADDRESS,
      chainAdapter: config.chainAdapter
    };
  }

  public buildDepositPayload(
    user: string,
    assetsUsd: bigint,
    vaultAddress?: string
  ): VaultTransactionRequest {
    if (!user || user.trim().length === 0) {
      throw new Error("User address must not be empty");
    }
    if (assetsUsd <= 0n) {
      throw new Error("Deposit assets must be strictly positive");
    }

    return {
      action: "DEPOSIT",
      vaultAddress: vaultAddress ?? this.config.defaultVaultAddress!,
      user,
      assets: assetsUsd
    };
  }

  public buildWithdrawPayload(
    user: string,
    sharesToBurn: bigint,
    vaultAddress?: string
  ): VaultTransactionRequest {
    if (!user || user.trim().length === 0) {
      throw new Error("User address must not be empty");
    }
    if (sharesToBurn <= 0n) {
      throw new Error("Shares to burn must be strictly positive");
    }

    return {
      action: "WITHDRAW",
      vaultAddress: vaultAddress ?? this.config.defaultVaultAddress!,
      user,
      shares: sharesToBurn
    };
  }

  public buildHarvestPayload(
    operator: string,
    strategyId: string,
    vaultAddress?: string
  ): VaultTransactionRequest {
    if (!operator || operator.trim().length === 0) {
      throw new Error("Operator address must not be empty");
    }
    if (!strategyId || strategyId.trim().length === 0) {
      throw new Error("Strategy ID must not be empty");
    }

    return {
      action: "HARVEST",
      vaultAddress: vaultAddress ?? this.config.defaultVaultAddress!,
      user: operator,
      strategyId
    };
  }

  public async broadcast(payload: VaultTransactionRequest): Promise<{ txHash: string; status: string }> {
    if (!this.config.chainAdapter) {
      throw new Error("Chain adapter not configured: cannot broadcast without active network adapter");
    }
    return this.config.chainAdapter.broadcast(payload);
  }
}
