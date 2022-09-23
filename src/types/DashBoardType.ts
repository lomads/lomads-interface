import { InviteGangType } from "./UItype";
import React from "react";
import {
  AllTransactionsListResponse,
  SafeMultisigTransactionListResponse,
} from "@gnosis.pm/safe-service-client/dist/src/types/safeTransactionServiceTypes";

export interface IsideModal {
  toggleModal: () => void;
  tokens: any;
  totalMembers: InviteGangType[];
  safeAddress: string;
  getPendingTransactions: () => Promise<void>;
}
export interface ItransactionDetailsType {
  tokens: any;
  modalNavigation: () => void;
  selectToken: (_tokenAddress: string) => void;
  selectedToken: string;
  showNavigation: (
    _showRecipient: boolean,
    _showSuccess: boolean,
    _showTransactionSender: boolean
  ) => void;
}
export interface IselectRecipientType {
  totalMembers: InviteGangType[];
  showNavigation: (
    _showRecipient: boolean,
    _showSuccess: boolean,
    _showTransactionSender: boolean
  ) => void;
  selectedRecipients: React.MutableRefObject<InviteGangType[]>;
  setRecipient: React.MutableRefObject<IsetRecipientType[]>;
}
export interface IselectTransactionSend {
  showNavigation: (
    _showRecipient: boolean,
    _showSuccess: boolean,
    _showTransactionSender: boolean
  ) => void;
  selectedRecipients: React.MutableRefObject<InviteGangType[]>;
  transactionData: TransactionDataType[];
  createTransaction: () => void;
  setRecipient: React.MutableRefObject<IsetRecipientType[]>;
  tokens: any;
  selectToken: (_tokenAddress: string) => void;
  selectedToken: string;
}
export interface TransactionDataType {
  to: string;
  amount: string;
  recipient: string;
  tokenAddress: string;
}
export interface IsetRecipientType {
  amount: string;
  recipient: string;
  name: string;
  reason: string;
}
export interface ItreasuryCardType {
  safeAddress: string;
  pendingTransactions: SafeMultisigTransactionListResponse | undefined;
  executedTransactions: AllTransactionsListResponse | undefined;
  ownerCount: number | undefined;
  toggleModal: () => void;
  fiatBalance: string;
  account: string | undefined;
  getPendingTransactions: () => Promise<void>;
}
