import React, { useEffect, useState } from "react";
import _ from "lodash";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../styles/Global.css";
import "../../styles/pages/InviteGang.css";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AddressInputField from "UIpack/AddressInputField";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { updateInvitedGang } from "state/flow/reducer";
import { ethers } from "ethers";
import { InviteGangType } from "types/UItype";
import daoMember2 from "../../assets/svg/daoMember2.svg";

const InviteGang = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const invitedMembers = useAppSelector((state) => state.flow.invitedGang);

  const isAddressValid = (holderAddress: string) => {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
  };

  useEffect(() => {
    isAddressValid(ownerAddress);
  }, [ownerAddress]);

  const addMember = (_ownerName: string, _ownerAddress: string) => {
    const member: InviteGangType = { name: _ownerName, address: _ownerAddress };
    const newMember = [...invitedMembers, member];
    dispatch(updateInvitedGang(newMember));
    setOwnerName("");
    setOwnerAddress("");
  };

  const handleClick = (_ownerName: string, _ownerAddress: string) => {
    let terrors: any = {};
    if (!isAddressValid(ownerAddress)) {
      terrors.ownerAddress = " * owner address is not valid.";
    }
    if (_.isEmpty(terrors)) {
      addMember(_ownerName, _ownerAddress);
    } else {
      setErrors(terrors);
    }
  };

  const deleteMember = (_address: any) => {
    const deleteMember = [...invitedMembers];

    const newContract = deleteMember.splice(
      deleteMember.findIndex((ele) => ele.address === _address),
      1
    );
    dispatch(updateInvitedGang(deleteMember));
    console.log(newContract);
    console.log("rest length:", deleteMember);
  };

  const handleNavigate = () => {
    if (invitedMembers.length >= 1) {
      navigate("/startsafe");
    }
  };

  return (
    <>
      <div className="InviteGang">
        <div className="headerText">2/3 Original Gang</div>
        <div className="centerCard">
          <div>
            <div className="inputFieldTitle">Name Your DAO</div>
          </div>
          <div className="inputArea">
            <div>
              <SimpleInputField
                className="inputField"
                height={50}
                width={120}
                placeholder="Gavin Belson"
                value={ownerName}
                onchange={(event) => {
                  setOwnerName(event.target.value);
                }}
              />
            </div>
            <div>
              <AddressInputField
                className="inputField"
                height={50}
                width={270}
                placeholder="0xbeee39"
                value={ownerAddress}
                onchange={(event) => {
                  setOwnerAddress(event.target.value);
                }}
                isInvalid={errors.ownerAddress}
              />
            </div>
            <div>
              <IconButton
                Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
                height={50}
                width={50}
                onClick={() => {
                  handleClick(ownerName, ownerAddress);
                }}
                bgColor={isAddressValid(ownerAddress) ? "#C94B32" : "#76808D"}
              />
            </div>
          </div>
        </div>
        {invitedMembers.length >= 1 && (
          <>
            <div className="invitedMembers">
              {invitedMembers.map((result: any, index: any) => {
                return (
                  <div key={index} className="owner">
                    <div className="avatarName">
                      <img src={daoMember2} alt={result.address} />
                      <p className="text">{result.name}</p>
                    </div>
                    <p className="text">
                      {result.address.slice(0, 18) +
                        "..." +
                        result.address.slice(-6)}
                    </p>
                    <div
                      className="deleteButton"
                      onClick={() => {
                        deleteMember(result.address);
                      }}
                    >
                      <AiOutlineClose style={{ height: 15, width: 15 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className="inviteGang">
          <SimpleButton
            title="INVITE"
            height={50}
            width={250}
            fontsize={20}
            fontweight={400}
            bgColor={invitedMembers.length >= 1 ? "#C94B32" : "#76808D"}
            onClick={handleNavigate}
          />
        </div>
        <div
          className="infoText"
          onClick={() => {
            navigate("/startsafe");
          }}
        >
          skip
        </div>
      </div>
    </>
  );
};

export default InviteGang;
