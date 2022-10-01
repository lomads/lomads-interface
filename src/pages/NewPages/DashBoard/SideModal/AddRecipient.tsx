import React, { useEffect, useState } from "react";
import _ from "lodash";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../../../styles/Global.css";
import "../../../../styles/pages/InviteGang.css";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AddressInputField from "UIpack/AddressInputField";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { updateInvitedGang, updateTotalMembers } from "state/flow/reducer";
import { ethers } from "ethers";
import { InviteGangType } from "types/UItype";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { useWeb3React } from "@web3-react/core";
import { useEnsAddress } from "react-moralis";
import OutlineButton from "UIpack/OutlineButton";

const AddRecipient = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const totalMembers = useAppSelector((state) => state.flow.totalMembers);
  const { account } = useWeb3React();

  const isAddressValid = (holderAddress: string) => {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
  };

  const isPresent = (_address: string) => {
    const check = totalMembers.some((mem) => mem.address === _address);
    return check;
  };
  const isRecipientPresent = (_address: string) => {
    const check = props.setRecipient.some(
      (mem: any) => mem.address === _address
    );
    return check;
  };
  useEffect(() => {
    const check = totalMembers.some(
      (member) => member.address === (account as string)
    );
    if (!check) {
      const creator = [
        ...totalMembers,
        { name: "", address: account as string },
      ];
      dispatch(updateInvitedGang(creator));
    }
  });

  useEffect(() => {
    isAddressValid(ownerAddress);
  }, [ownerAddress]);

  useEffect(() => {
    isPresent(ownerAddress);
  }, [ownerAddress]);

  const addMember = (_ownerName: string, _ownerAddress: string) => {
    const member: InviteGangType = { name: _ownerName, address: _ownerAddress };
    if (!isPresent(member.address)) {
      const newMember = [...totalMembers, member];
      dispatch(updateTotalMembers(newMember));
      setOwnerName("");
      setOwnerAddress("");
      props.toggleAddNewRecipient();
    }
  };

  const handleClick = (_ownerName: string, _ownerAddress: string) => {
    let terrors: any = {};
    if (!isAddressValid(ownerAddress)) {
      terrors.ownerAddress = " * address is not correct.";
    }
    if (isPresent(ownerAddress)) {
      terrors.ownerAddress = " * address already exists.";
    }
    if (_.isEmpty(terrors)) {
      addMember(_ownerName, _ownerAddress);
    } else {
      setErrors(terrors);
    }
  };
  return (
    <>
      <div id="AddNewRecipientComponent">
        <div>
          <div className="inputTitle">Add member :</div>
        </div>
        <div className="inputArea">
          <div>
            <SimpleInputField
              className="inputField"
              height={50}
              width={144}
              placeholder="Name"
              value={ownerName}
              onchange={(event) => {
                ownerName.length <= 12 && setOwnerName(event.target.value);
              }}
            />
          </div>
          <div>
            <AddressInputField
              className="inputField"
              height={50}
              width={251}
              placeholder="ENS Domain and Wallet Address"
              value={ownerAddress}
              onchange={(event) => {
                setErrors({ ownerAddress: "" });
                setOwnerAddress(event.target.value);
              }}
              isInvalid={errors.ownerAddress}
            />
          </div>
        </div>
        <div id="addMemberButtonArea">
          <div>
            <OutlineButton
              borderColor="#C94B32"
              bgColor="#FFFFFF"
              title="CANCEL"
              className="button"
              height={40}
              width={129}
              fontsize={16}
              fontweight={400}
              onClick={props.toggleAddNewRecipient}
            />
          </div>
          <div>
            <SimpleButton
              title="OK"
              bgColor="#C94B32"
              className="button"
              fontsize={16}
              fontweight={400}
              height={40}
              width={129}
              onClick={() => {
                handleClick(ownerName, ownerAddress);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecipient;
