import { InviteGangType } from "./UItype";
import React from "react";
import {
  AllTransactionsListResponse,
  SafeMultisigTransactionListResponse,
} from "@gnosis.pm/safe-service-client/dist/src/types/safeTransactionServiceTypes";

export interface IProject {
  id: number;
  title: string;
  description: string;
  status: boolean;
}

export type ProjectContextType = {
  projects: IProject[];
};

export interface IsideModalNew {
  toggleModal: () => void;
}

export interface IsideModal {
  toggleModal: () => void;
  tokens: any;
  totalMembers: InviteGangType[];
  safeAddress: string;
  getPendingTransactions: () => any;
  showNotificationArea: (_choice: boolean) => void;
  toggleShowMember: () => void;
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
  toggleAddNewRecipient: () => void;
  addNewRecipient: boolean;
}
export interface IselectTransactionSend {
  showNavigation: (
    _showRecipient: boolean,
    _showSuccess: boolean,
    _showTransactionSender: boolean
  ) => void;
  error: string | null;
  selectedRecipients: React.MutableRefObject<InviteGangType[]>;
  transactionData: TransactionDataType[];
  createTransaction: () => void;
  setRecipient: React.MutableRefObject<IsetRecipientType[]>;
  tokens: any;
  selectToken: (_tokenAddress: string) => void;
  selectedToken: string;
  toggleAddNewRecipient: () => void;
  addNewRecipient: boolean;
  isLoading: boolean;
  safeTokens: Array<any>;
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
  tag:any;
}
export interface ItreasuryCardType {
  innerRef: any,
  safeAddress: string;
  onChangePendingTransactions: any,
  onRecurringEdit?: any,
  pendingTransactions: SafeMultisigTransactionListResponse | undefined;
  executedTransactions: AllTransactionsListResponse | undefined;
  ownerCount: number | undefined;
  toggleModal: () => void;
  fiatBalance: any;
  account: string | undefined;
  // getPendingTransactions: () => Promise<void>;
  // getExecutedTransactions: () => Promise<void>;
  tokens: any;
  toggleShowCreateRecurring: () => void;
  isHelpIconOpen: boolean;
}
