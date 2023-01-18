import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import { get as _get, find as _find } from 'lodash';
import './SafeModal.css';
import copyIcon from "../../assets/svg/copyIcon.svg";
import { Tooltip } from "@chakra-ui/react";
import editIcon from 'assets/svg/editButton.svg';
import bitMemberIcon from 'assets/svg/bigMember.svg';
import SearchSettingsSvg from 'assets/svg/search-settings.svg';
import OD from "../../assets/images/drawer-icons/OD.svg";
import { ImportSafe, safeService } from "connection/SafeCall";
import SafeIcon from "../../assets/svg/safe.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import Checkbox from "components/Checkbox";
import { beautifyHexToken } from "utils";
import { off } from "process";
import useSafeTokens from "hooks/useSafeTokens";
import useSafeTransaction from "hooks/useSafeTransaction";
import SimpleLoadButton from "UIpack/SimpleLoadButton";

const SafeModal = ({ toggleModal, toggleS }) => {
	const { provider, account, chainId } = useWeb3React();
  const [safeName, setSafeName] = useState(null)
  const { DAO } = useAppSelector(store => store.dashboard)
  const [copy, setCopy] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [owners, setOwners] = useState([])
  const [thresholdValue, setThresholdValue] = useState(1);
  const [currentThreshold, setCurrentThreshold] = useState(1);
  const [members, setMembers] = useState([])

  const { updateOwnersWithThreshold, updateOwnerLoading } = useSafeTransaction(_get(DAO, 'safe.address', ''))

  const getSafeThreshold = async safeAddress => {
		const safeSDK = await ImportSafe(provider, safeAddress);
		const threshold = await safeSDK.getThreshold();
		setThresholdValue(threshold)
    setCurrentThreshold(threshold)
  }

  useEffect(() => {
    if(provider && DAO?.safe)
      getSafeThreshold(DAO?.safe?.address)
  }, [provider, DAO?.safe])

  useEffect(() => {
    if(DAO?.safe)
      setSafeName(_get(DAO, 'safe.name'))
      setOwners(_get(DAO, 'safe.owners', []))
      setMembers(_get(DAO, 'members', []).map(member => {
        return {
          ...member.member, owner: _find(_get(DAO, 'safe.owners', []), o => o.wallet.toLowerCase() === member.member.wallet.toLowerCase()) ? true : false
        }
      }))
  }, [DAO?.safe])

  const newOwners = useMemo(() => {
    const data = members.filter(member => {
      if(member.owner === true && !_find(owners, m => m.wallet.toLowerCase() === member.wallet.toLowerCase()))
        return true
      return false;
    })
    return data
  }, [members])

  const removeOwners = useMemo(() => {
    const data = members.filter(member => {
      if(member.owner === false && _find(owners, m => m.wallet.toLowerCase() === member.wallet.toLowerCase()))
        return true
      return false;
    })
    return data
  }, [members])


  const newOwnerCount = useMemo(() => {
    return ((owners.length - removeOwners.length) + newOwners.length)
  }, [owners, newOwners, removeOwners])

  const renderConfirmation = () => {
    return (
      <div className="safe-modal_confirmation-container">
          {  newOwners && newOwners.length > 0 &&
          <div className="add-remove-container">
            <div className="title">Will be added to the safe:</div>
            <div className="safe-modal owner-list">
                {
                  newOwners.map(owner => {
                    return (
                      <div className="safe-modal owner-item">
                          <img src={bitMemberIcon} />
                          <div>{ owner.name }</div>
                      </div>
                    )
                  })
                }
              </div>
          </div>
          }
          {  removeOwners && removeOwners.length > 0 &&
          <div className="add-remove-container">
              <div className="title">Will be removed from the safe:</div>
              <div className="safe-modal owner-list">
                  {
                    removeOwners.map(owner => {
                      return (
                        <div className="safe-modal owner-item">
                            <img src={bitMemberIcon} />
                            <div>{ owner.name }</div>
                        </div>
                      )
                    })
                  }
                </div>
            </div>
            }

            { ((newOwners && newOwners.length > 0) || (removeOwners && removeOwners.length > 0)) &&
              <div style={{ height: 2, width: 208, margin: '60px auto', backgroundColor: "#C94B32" }}></div>
            }
            <div className="safe-modal voting-container">
                <div className="header">Voting balance</div>
                <div className="description">Any transaction requires the confirmation of</div>
                <div className="vote-select-container">
                  <select className="tokenDropdown" id="chain" value={thresholdValue} onChange={e => setThresholdValue(+e.target.value)}>
                  {
                    owners.map((owner, i) => {
                      return <option value={i+1} >{ i+1 }</option>
                    })
                  }
                  </select>
                  <div className="voting-total">
                    of { owners.length } owners
                  </div>
                </div>
            </div>
            <div className="button-section">
                <Button onClick={() => setShowConfirmation(false)} className="chakra-button btn-cancel">CANCEL</Button>
                <SimpleLoadButton height={40}  title="CONFIRM" width={200} bgColor={updateOwnerLoading ? 'grey' : "#C94B32" } condition={updateOwnerLoading} disabled={newOwnerCount == 0 || updateOwnerLoading} onClick={async () => {
                  await updateOwnersWithThreshold({ newOwners: newOwners.map(o => o.wallet), removeOwners: removeOwners.map(o => o.wallet), threshold: thresholdValue, ownerCount: newOwnerCount, thresholdChanged: currentThreshold !== thresholdValue })
                  toggleModal();
                  toggleS();
                }} className="chakra-button btn-save">CONFIRM</SimpleLoadButton>
          </div>
      </div>
    )
  }


  const renderMemberList = () => {
    return (
      <>
        <div className="safe-modal_member-list-container">
          <div className="header">Select Owners</div>
          {/* <div className="safe-modal_search_container">
            <Input className="search-input" variant="filled" onChange={(evt) => setSafeName(evt.target.value)} placeholder="Search" />
            <div className="search-button">
              <img src={SearchSettingsSvg} />
            </div>
          </div> */}
          {
            members.map(member => {
              return (
                <div className="list-item">
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '30%' }}>
                    <img style={{ width: 30, height: 30 }} src={bitMemberIcon} />
                    <div className="name">{ _get(member, 'name', '') }</div>
                  </div>
                  <div className="wallet">{ beautifyHexToken(_get(member, 'wallet', '')) }</div>
                  <Checkbox onChange={status => {
                    setMembers(prev => prev.map(p => {
                      if(member._id === p._id)
                        return { ...p, owner: status }
                      return p
                    }))
                   }} checked={member.owner} />
                </div>
              )
            })
          }
          <div className="button-section">
                <Button onClick={() => setShowEdit(false)} className="chakra-button btn-cancel">CANCEL</Button>
                <SimpleLoadButton height={40}  title="SAVE OWNERS" width={200} bgColor={!((newOwners && newOwners.length > 0) || (removeOwners && removeOwners.length > 0)) || newOwnerCount == 0  ? 'grey' : "#C94B32" } condition={false} disabled={newOwnerCount == 0 || !((newOwners && newOwners.length > 0) || (removeOwners && removeOwners.length > 0)) } 
                onClick={() => setShowConfirmation(true)}  className="chakra-button btn-save"></SimpleLoadButton>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleS();
          }}
          className="overlay"
        ></div>
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
              onClick={toggleModal}
            />
          </div>
          { 
          showConfirmation ? 
          renderConfirmation() :
          showEdit ?
          renderMemberList() :
          <div className="safe-modal-container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                src={SafeIcon}
                alt="Safe icon"
                style={{ marginTop: "100px", width: "94.48px", height: "50px" }}
              />
              <div style={{ marginTop: 16 }} id="title-type">Safe</div>
            </div>

            {/* //! BODY */}
            <div
              style={{
                width: '400px',
                marginTop: "30px",
              }}
            >
                <div>
                  <div id="text-type-od">Name</div>
                  <Input value={safeName} variant="filled" onChange={(evt) => setSafeName(evt.target.value)} placeholder="Safe name" />
                </div>
                <div style={{ marginTop: 16 }} className="copyArea" onClick={() => setCopy(true)} onMouseOut={() => setCopy(false)}>
                  <Tooltip label={copy ? "copied" : "copy"}>
                    <div className="copyLinkButton" onClick={() => navigator.clipboard.writeText(_get(DAO, 'safe.address', ''))}>
                      <img src={copyIcon} alt="copy" className="safeCopyImage" />
                    </div>
                  </Tooltip>
                  <div className="dashboardText">{`${_get(DAO, 'safe.address', '').slice(0, 6)}...${_get(DAO, 'safe.address', '').slice(-4)}`}</div>
                </div>
                <div style={{ height: 2, width: 208, margin: '38px auto', backgroundColor: "#C94B32" }}></div>
                <div className="safe-modal owner-container">
                  <div className="safe-modal owner-header">
                    <div>Owners</div>
                    <button style={{ marginRight: '22px' }} onClick={() => setShowEdit(true)}>
                      <img src={editIcon} alt="editIcon" />
                    </button>
                  </div>
                  <div className="safe-modal owner-list">
                    {
                      _get(DAO, 'safe.owners', []).map(owner => {
                        return (
                          <div className="safe-modal owner-item">
                              <img src={bitMemberIcon} />
                              <div>{ owner.name }</div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <div style={{ height: 2, width: 208, margin: '60px auto', backgroundColor: "#C94B32" }}></div>
                <div className="safe-modal voting-container">
                    <div className="header">Voting balance</div>
                    <div className="description">Any transaction requires the confirmation of</div>
                    <div className="vote-select-container">
                      <select className="tokenDropdown" id="chain" value={thresholdValue} onChange={e => setThresholdValue(+e.target.value)}>
                      {
                        owners.map((owner, i) => {
                          return <option value={i+1} >{ i+1 }</option>
                        })
                      }
                      </select>
                      <div className="voting-total">
                        of { owners.length } owners
                      </div>
                    </div>
                </div>
            </div>
            {/* //! FOOTER */}
            <div className="button-section" style={{ display: 'flex' }}>
              <Button
                variant="outline"
                mr={3}
                className="btn-cancel"
                onClick={() => {
                  toggleModal();
                  toggleS();
                }}
              >
                Cancel
              </Button>
              <SimpleLoadButton height={40}  title="SAVE CHANGES" width={200} bgColor={updateOwnerLoading ? 'grey' : "#C94B32" } condition={updateOwnerLoading} disabled={updateOwnerLoading} 
              onClick={async () => { 
                if(currentThreshold !== thresholdValue) {
                  await updateOwnersWithThreshold({ ownerCount: newOwnerCount, threshold: thresholdValue, thresholdChanged: currentThreshold !== thresholdValue })
                  toggleModal();
                  toggleS();
                }
              }}
              className="chakra-button btn-save">SAVE CHANGES</SimpleLoadButton>
            </div>
          </div>
          }
        </div>
      </div>
    </>
  );
};

export default SafeModal;
