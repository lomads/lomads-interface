import { Trans } from "@lingui/macro";
import { Fraction, TradeType } from "@uniswap/sdk-core";
import JSBI from "jsbi";
import * as React from 'react';
import { nativeOnChain } from "constants/tokens";
import { useCurrency, useToken } from "hooks/Tokens";
import {
  AddLiquidityV2PoolTransactionInfo,
  AddLiquidityV3PoolTransactionInfo,
  ApproveTransactionInfo,
  ClaimTransactionInfo,
  CollectFeesTransactionInfo,
  CreateV3PoolTransactionInfo,
  DelegateTransactionInfo,
  DepositLiquidityStakingTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  ExecuteTransactionInfo,
  MigrateV2LiquidityToV3TransactionInfo,
  QueueTransactionInfo,
  RemoveLiquidityV3TransactionInfo,
  SubmitProposalTransactionInfo,
  TransactionInfo,
  TransactionType,
  WithdrawLiquidityStakingTransactionInfo,
  WrapTransactionInfo,
} from "../../state/transactions/types";
import { formatAddress } from "utils";

function formatAmount(
  amountRaw: string,
  decimals: number,
  sigFigs: number
): string {
  return new Fraction(
    amountRaw,
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
  ).toSignificant(sigFigs);
}

function FormattedCurrencyAmount({
  rawAmount,
  symbol,
  decimals,
  sigFigs,
}: {
  rawAmount: string;
  symbol: string;
  decimals: number;
  sigFigs: number;
}) {
  return (
    <>
      {formatAmount(rawAmount, decimals, sigFigs)} {symbol}
    </>
  );
}

function FormattedCurrencyAmountManaged({
  rawAmount,
  currencyId,
  sigFigs = 6,
}: {
  rawAmount: string;
  currencyId: string;
  sigFigs: number;
}) {
  const currency = useCurrency(currencyId);
  return currency ? (
    <FormattedCurrencyAmount
      rawAmount={rawAmount}
      decimals={currency.decimals}
      sigFigs={sigFigs}
      symbol={currency.symbol ?? "???"}
    />
  ) : null;
}

function ClaimSummary({
  info: { recipient, uniAmountRaw },
}: {
  info: ClaimTransactionInfo;
}) {
  return typeof uniAmountRaw === "string" ? (
    <span>
      Claim{" "}
      <FormattedCurrencyAmount
        rawAmount={uniAmountRaw}
        symbol={"UNI"}
        decimals={18}
        sigFigs={4}
      />{" "}
      for {recipient}
    </span>
  ) : (
    <span>Claim UNI reward for {recipient}</span>
  );
}

function SubmitProposalTransactionSummary(_: {
  info: SubmitProposalTransactionInfo;
}) {
  return <Trans>Submit new proposal</Trans>;
}

function ApprovalSummary({ info }: { info: ApproveTransactionInfo }) {
  const token = useToken(info.tokenAddress);

  return <span>Approve {token?.symbol}</span>;
}

function QueueSummary({ info }: { info: QueueTransactionInfo }) {
  const proposalKey = `${info.governorAddress}/${info.proposalId}`;
  return <span>Queue proposal {proposalKey}.</span>;
}

function ExecuteSummary({ info }: { info: ExecuteTransactionInfo }) {
  const proposalKey = `${info.governorAddress}/${info.proposalId}`;
  return <span>Execute proposal {proposalKey}.</span>;
}

function DelegateSummary({
  info: { delegatee },
}: {
  info: DelegateTransactionInfo;
}) {
  return <span>Delegate voting power to {delegatee}</span>;
}

function WrapSummary({
  info: { chainId, currencyAmountRaw, unwrapped },
}: {
  info: WrapTransactionInfo;
}) {
  const native = chainId ? nativeOnChain(chainId) : undefined;

  if (unwrapped) {
    return (
      <span>
        Unwrap{" "}
        <FormattedCurrencyAmount
          rawAmount={currencyAmountRaw}
          symbol={native?.wrapped?.symbol ?? "WETH"}
          decimals={18}
          sigFigs={6}
        />{" "}
        to {native?.symbol ?? "ETH"}
      </span>
    );
  } else {
    return (
      <span>
        Wrap{" "}
        <FormattedCurrencyAmount
          rawAmount={currencyAmountRaw}
          symbol={native?.symbol ?? "ETH"}
          decimals={18}
          sigFigs={6}
        />{" "}
        to {native?.wrapped?.symbol ?? "WETH"}
      </span>
    );
  }
}

function DepositLiquidityStakingSummary({
  hash,
  info,
}: {
  hash: string;
  info: DepositLiquidityStakingTransactionInfo;
}) {
  // not worth rendering the tokens since you can should no longer deposit liquidity in the staking contracts
  // todo: deprecate and delete the code paths that allow this, show user more information
  return <span>{formatAddress(hash)}</span>;
}

function WithdrawLiquidityStakingSummary(_: {
  info: WithdrawLiquidityStakingTransactionInfo;
}) {
  return <Trans>Withdraw deposited liquidity</Trans>;
}

function MigrateLiquidityToV3Summary({
  info: { baseCurrencyId, quoteCurrencyId },
}: {
  info: MigrateV2LiquidityToV3TransactionInfo;
}) {
  const baseCurrency = useCurrency(baseCurrencyId);
  const quoteCurrency = useCurrency(quoteCurrencyId);

  return (
    <span>
      Migrate {baseCurrency?.symbol}/{quoteCurrency?.symbol} liquidity to V3
    </span>
  );
}

function CreateV3PoolSummary({
  info: { quoteCurrencyId, baseCurrencyId },
}: {
  info: CreateV3PoolTransactionInfo;
}) {
  const baseCurrency = useCurrency(baseCurrencyId);
  const quoteCurrency = useCurrency(quoteCurrencyId);

  return (
    <span>
      Create {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 pool
    </span>
  );
}

function CollectFeesSummary({
  info: { currencyId0, currencyId1 },
}: {
  info: CollectFeesTransactionInfo;
}) {
  const currency0 = useCurrency(currencyId0);
  const currency1 = useCurrency(currencyId1);

  return (
    <span>
      Collect {currency0?.symbol}/{currency1?.symbol} fees
    </span>
  );
}

function RemoveLiquidityV3Summary({
  info: {
    baseCurrencyId,
    quoteCurrencyId,
    expectedAmountBaseRaw,
    expectedAmountQuoteRaw,
  },
}: {
  info: RemoveLiquidityV3TransactionInfo;
}) {
  return (
    <span>
      Remove{" "}
      <FormattedCurrencyAmountManaged
        rawAmount={expectedAmountBaseRaw}
        currencyId={baseCurrencyId}
        sigFigs={3}
      />{" "}
      and{" "}
      <FormattedCurrencyAmountManaged
        rawAmount={expectedAmountQuoteRaw}
        currencyId={quoteCurrencyId}
        sigFigs={3}
      />
    </span>
  );
}

function AddLiquidityV3PoolSummary({
  info: { createPool, quoteCurrencyId, baseCurrencyId },
}: {
  info: AddLiquidityV3PoolTransactionInfo;
}) {
  const baseCurrency = useCurrency(baseCurrencyId);
  const quoteCurrency = useCurrency(quoteCurrencyId);

  return createPool ? (
    <span>
      Create pool and add {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3
      liquidity
    </span>
  ) : (
    <span>
      Add {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 liquidity
    </span>
  );
}

function AddLiquidityV2PoolSummary({
  info: {
    quoteCurrencyId,
    expectedAmountBaseRaw,
    expectedAmountQuoteRaw,
    baseCurrencyId,
  },
}: {
  info: AddLiquidityV2PoolTransactionInfo;
}) {
  return (
    <span>
      Add{" "}
      <FormattedCurrencyAmountManaged
        rawAmount={expectedAmountBaseRaw}
        currencyId={baseCurrencyId}
        sigFigs={3}
      />{" "}
      and{" "}
      <FormattedCurrencyAmountManaged
        rawAmount={expectedAmountQuoteRaw}
        currencyId={quoteCurrencyId}
        sigFigs={3}
      />{" "}
      to Uniswap V2
    </span>
  );
}

function SwapSummary({
  info,
}: {
  info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo;
}) {
  if (info.tradeType === TradeType.EXACT_INPUT) {
    return (
      <span>
        Swap exactly{" "}
        <FormattedCurrencyAmountManaged
          rawAmount={info.inputCurrencyAmountRaw}
          currencyId={info.inputCurrencyId}
          sigFigs={6}
        />{" "}
        for{" "}
        <FormattedCurrencyAmountManaged
          rawAmount={info.expectedOutputCurrencyAmountRaw}
          currencyId={info.outputCurrencyId}
          sigFigs={6}
        />
      </span>
    );
  } else {
    return (
      <span>
        Swap{" "}
        <FormattedCurrencyAmountManaged
          rawAmount={info.expectedInputCurrencyAmountRaw}
          currencyId={info.inputCurrencyId}
          sigFigs={6}
        />{" "}
        for exactly{" "}
        <FormattedCurrencyAmountManaged
          rawAmount={info.outputCurrencyAmountRaw}
          currencyId={info.outputCurrencyId}
          sigFigs={6}
        />
      </span>
    );
  }
}

export function TransactionSummary({
  hash,
  info,
}: {
  hash: string;
  info: TransactionInfo;
}) {
  switch (info.type) {
    case TransactionType.ADD_LIQUIDITY_V3_POOL:
      return <AddLiquidityV3PoolSummary info={info} />;

    case TransactionType.ADD_LIQUIDITY_V2_POOL:
      return <AddLiquidityV2PoolSummary info={info} />;

    case TransactionType.CLAIM:
      return <ClaimSummary info={info} />;

    case TransactionType.DEPOSIT_LIQUIDITY_STAKING:
      return <DepositLiquidityStakingSummary hash={hash} info={info} />;

    case TransactionType.WITHDRAW_LIQUIDITY_STAKING:
      return <WithdrawLiquidityStakingSummary info={info} />;

    case TransactionType.SWAP:
      return <SwapSummary info={info} />;

    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />;

    case TransactionType.DELEGATE:
      return <DelegateSummary info={info} />;

    case TransactionType.WRAP:
      return <WrapSummary info={info} />;

    case TransactionType.CREATE_V3_POOL:
      return <CreateV3PoolSummary info={info} />;

    case TransactionType.MIGRATE_LIQUIDITY_V3:
      return <MigrateLiquidityToV3Summary info={info} />;

    case TransactionType.COLLECT_FEES:
      return <CollectFeesSummary info={info} />;

    case TransactionType.REMOVE_LIQUIDITY_V3:
      return <RemoveLiquidityV3Summary info={info} />;

    case TransactionType.QUEUE:
      return <QueueSummary info={info} />;

    case TransactionType.EXECUTE:
      return <ExecuteSummary info={info} />;

    case TransactionType.SUBMIT_PROPOSAL:
      return <SubmitProposalTransactionSummary info={info} />;
  }
}
