import { test } from "node:test";
import assert from "node:assert/strict";
import { QmoosaYieldClient } from "../dist/index.js";

test("1. Deposit payload construction and validation", () => {
  const client = new QmoosaYieldClient();
  const payload = client.buildDepositPayload("0xalice", 50_000n);

  assert.equal(payload.action, "DEPOSIT");
  assert.equal(payload.user, "0xalice");
  assert.equal(payload.assets, 50_000n);
  assert.equal(payload.vaultAddress, QmoosaYieldClient.DEFAULT_VAULT_ADDRESS);

  assert.throws(() => client.buildDepositPayload("", 100n), /User address must not be empty/);
  assert.throws(() => client.buildDepositPayload("0xalice", 0n), /Deposit assets must be strictly positive/);
});

test("2. Withdraw payload construction", () => {
  const client = new QmoosaYieldClient();
  const payload = client.buildWithdrawPayload("0xalice", 25_000n);

  assert.equal(payload.action, "WITHDRAW");
  assert.equal(payload.shares, 25_000n);
});

test("3. Harvest payload construction", () => {
  const client = new QmoosaYieldClient();
  const payload = client.buildHarvestPayload("0xoperator", "lending-strat-v1");

  assert.equal(payload.action, "HARVEST");
  assert.equal(payload.strategyId, "lending-strat-v1");
});

test("4. Fail-closed without adapter", async () => {
  const client = new QmoosaYieldClient();
  const payload = client.buildDepositPayload("0xalice", 50_000n);

  await assert.rejects(() => client.broadcast(payload), /Chain adapter not configured/);
});

test("5. Broadcast via configured adapter", async () => {
  const mockAdapter = {
    broadcast: async (payload) => ({ txHash: "0x123456", status: "CONFIRMED" })
  };
  const client = new QmoosaYieldClient({ chainAdapter: mockAdapter });
  const payload = client.buildDepositPayload("0xalice", 50_000n);
  const res = await client.broadcast(payload);

  assert.equal(res.txHash, "0x123456");
  assert.equal(res.status, "CONFIRMED");
});
