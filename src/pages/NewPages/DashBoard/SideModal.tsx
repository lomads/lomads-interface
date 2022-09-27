import React, { useEffect, useRef, useState } from "react";
import TransactionDetails from "./SideModal/TransactionDetails";
import {
  IsetRecipientType,
  IsideModal,
  TransactionDataType,
} from "types/DashBoardType";
import { InviteGangType } from "types/UItype";
import SelectRecipient from "./SideModal/SelectRecipient";
import { useAppSelector } from "state/hooks";
import TransactionSend from "./SideModal/TransactionSend";
import { tokenCallSafe } from "connection/DaoTokenCall";
import { ImportSafe, safeService } from "connection/SafeCall";
import { useWeb3React } from "@web3-react/core";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import TransactionSuccess from "./SideModal/TransactionSuccess";
import { Checkbox } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import { SafeTransactionOptionalProps } from "@gnosis.pm/safe-core-sdk/dist/src/utils/transactions/types";
import { useDispatch } from "react-redux";
import ethers from "ethers";

const SideModal = (props: IsideModal) => {
  const dispatch = useDispatch();
  const { provider, account } = useWeb3React();
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [addNewRecipient, setAddNewRecipient] = useState<boolean>(false);
  const [modalNavigation, setModalNavigation] = useState({
    showRecipient: false,
    showTransactionSender: false,
    showSuccess: false,
  });
  const [isLoading, setisLoading] = useState<boolean>(false);
  const totalMembers = useAppSelector((state) => state.flow.totalMembers);
  const selectToken = (_tokenAddress: string) => {
    setSelectedToken(_tokenAddress);
    console.log(selectedToken);
  };
  const selectedRecipients = useRef<InviteGangType[]>([]);
  const setRecipient = useRef<IsetRecipientType[]>([]);
  const currentNonce = useAppSelector((state) => state.flow.currentNonce);
  const safeAddress = useAppSelector((state) => state.flow.safeAddress);

  const showNavigation = (
    _showRecipient: boolean,
    _showSuccess: boolean,
    _showTransactionSender: boolean
  ) => {
    setModalNavigation({
      showRecipient: _showRecipient,
      showSuccess: _showSuccess,
      showTransactionSender: _showTransactionSender,
    });
  };
  const transactionData = useRef<TransactionDataType[]>([]);

  const toggleAddNewRecipient = () => {
    setAddNewRecipient(!addNewRecipient);
  };

  const createTransaction = async () => {
    setisLoading(true);
    const token = await tokenCallSafe(selectedToken);
    const safeSDK = await ImportSafe(provider, props.safeAddress);
    const safeTransactionData: SafeTransactionDataPartial[] = await Promise.all(
      setRecipient.current.map(
        async (result: IsetRecipientType, index: number) => {
          const unsignedTransaction = await token.populateTransaction.transfer(
            result.recipient,
            BigInt(parseInt(result.amount) * 10 ** 18)
          );
          const transactionData = {
            to: selectedToken,
            data: unsignedTransaction.data as string,
            value: "0",
          };
          return transactionData;
        }
      )
    );
    const options: SafeTransactionOptionalProps = {
      nonce: currentNonce,
    };
    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
      options,
    });
    const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
    const signature = await safeSDK.signTransactionHash(safeTxHash);
    const senderAddress = account as string;
    const safeAddress = props.safeAddress;
    await (
      await safeService(provider)
    )
      .proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      })
      .then((value) => {
        console.log("transaction has been proposed");
      })
      .catch((error) => {
        console.log("an error occoured while proposing transaction", error);
        setisLoading(false);
      });
    await (
      await safeService(provider)
    )
      .confirmTransaction(safeTxHash, signature.data)
      .then(async (success) => {
        console.log("transaction is successful");
        await props.getPendingTransactions();
        showNavigation(false, true, false);
        setisLoading(false);
      })
      .catch((err) => {
        setisLoading(false);
        console.log("error occured while confirming transaction", err);
      });
  };

  return (
    <>
      <div className="sidebarModal">
        <div onClick={props.toggleModal} className="overlay"></div>
        <div className="SideModal">
          <div className="closeButtonArea">
            <IconButton
              Icon={
                <AiOutlineClose
                  style={{
                    color: "#C94B32",
                    height: "16px",
                    width: "16px",
                  }}
                />
              }
              bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
              height={37}
              width={37}
              className="sideModalCloseButton"
              onClick={props.toggleModal}
            />
          </div>
          {!modalNavigation.showRecipient &&
            !modalNavigation.showSuccess &&
            !modalNavigation.showTransactionSender && (
              <TransactionDetails
                tokens={props.tokens}
                modalNavigation={props.toggleModal}
                selectToken={selectToken}
                selectedToken={selectedToken}
                showNavigation={showNavigation}
              />
            )}
          {modalNavigation.showRecipient &&
            !modalNavigation.showSuccess &&
            !modalNavigation.showTransactionSender && (
              <SelectRecipient
                totalMembers={totalMembers}
                showNavigation={showNavigation}
                selectedRecipients={selectedRecipients}
                setRecipient={setRecipient}
                toggleAddNewRecipient={toggleAddNewRecipient}
                addNewRecipient={addNewRecipient}
              />
            )}
          {!modalNavigation.showRecipient &&
            !modalNavigation.showSuccess &&
            modalNavigation.showTransactionSender && (
              <TransactionSend
                showNavigation={showNavigation}
                selectedRecipients={selectedRecipients}
                transactionData={transactionData.current}
                createTransaction={createTransaction}
                setRecipient={setRecipient}
                tokens={props.tokens}
                selectToken={selectToken}
                selectedToken={selectedToken}
                toggleAddNewRecipient={toggleAddNewRecipient}
                addNewRecipient={addNewRecipient}
                isLoading={isLoading}
              />
            )}
          {!modalNavigation.showRecipient &&
            modalNavigation.showSuccess &&
            !modalNavigation.showTransactionSender && <TransactionSuccess />}
        </div>
      </div>
    </>
  );
};

export default SideModal;
