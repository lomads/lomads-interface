import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import { get as _get, find as _find } from "lodash";
import Button from "muiComponents/Button";
import copyIcon from "../assets/svg/copyIcon.svg";
import { Tooltip } from "@chakra-ui/react";
import editIcon from "assets/svg/editButton.svg";
import bitMemberIcon from "assets/svg/bigMember.svg";
import SearchSettingsSvg from "assets/svg/search-settings.svg";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { ImportSafe, safeService } from "connection/SafeCall";
import SafeIcon from "../assets/svg/safe.svg";
import TextInput from "muiComponents/TextInput";
import { Image, Input } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import Checkbox from "components/Checkbox";
import { beautifyHexToken } from "utils";
import { off } from "process";
import useSafeTokens from "hooks/useSafeTokens";
import useSafeTransaction from "hooks/useSafeTransaction";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { Box, Drawer, Typography } from "@mui/material";
import React from "react";
import { default as MuiIconButton } from "muiComponents/IconButton";
import CloseSVG from "assets/svg/close-new.svg";
import "pages/NewPages/SafeModal.css";

export default ({ open, onClose }: { open: boolean; onClose: any }) => {
  const { provider, account, chainId } = useWeb3React();
  const [safeName, setSafeName] = useState(null);
  const { DAO } = useAppSelector((store) => store.dashboard);
  const [copy, setCopy] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [owners, setOwners] = useState([]);
  const [thresholdValue, setThresholdValue] = useState(1);
  const [currentThreshold, setCurrentThreshold] = useState(1);
  const [members, setMembers] = useState<any>([]);

  const { updateOwnersWithThreshold, updateOwnerLoading } = useSafeTransaction(
    _get(DAO, "safe.address", "")
  );

  const getSafeThreshold = async (safeAddress: any) => {
    const safeSDK = await ImportSafe(provider, safeAddress);
    const threshold = await safeSDK.getThreshold();
    setThresholdValue(threshold);
    setCurrentThreshold(threshold);
  };

  useEffect(() => {
    if (provider && DAO?.safe) getSafeThreshold(DAO?.safe?.address);
  }, [provider, DAO?.safe]);

  useEffect(() => {
    if (DAO?.safe) setSafeName(_get(DAO, "safe.name"));
    setOwners(_get(DAO, "safe.owners", []));
    setMembers(
      _get(DAO, "members", []).map((member: any) => {
        return {
          ...member.member,
          owner: _find(
            _get(DAO, "safe.owners", []),
            (o) => o.wallet.toLowerCase() === member.member.wallet.toLowerCase()
          )
            ? true
            : false,
        };
      })
    );
  }, [DAO?.safe]);

  const newOwners = useMemo(() => {
    const data = members.filter((member: any) => {
      if (
        member.owner === true &&
        !_find(
          owners,
          (m: any) => m.wallet.toLowerCase() === member.wallet.toLowerCase()
        )
      )
        return true;
      return false;
    });
    return data;
  }, [members]);

  const removeOwners = useMemo(() => {
    const data = members.filter((member: any) => {
      if (
        member.owner === false &&
        _find(
          owners,
          (m: any) => m.wallet.toLowerCase() === member.wallet.toLowerCase()
        )
      )
        return true;
      return false;
    });
    return data;
  }, [members]);

  const newOwnerCount = useMemo(() => {
    return owners.length - removeOwners.length + newOwners.length;
  }, [owners, newOwners, removeOwners]);

  const renderConfirmation = () => {
    return (
      <Box>
        <Box
          sx={{
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "100%",
            height: "100%",
            padding: "112px 70px 164px 70px",
          }}
        >
          {newOwners && newOwners.length > 0 && (
            <Box
              sx={{
                background: "rgba(118, 128, 141, 0.05)",
                borderRadius: "5px",
                padding: "20px",
                margin: "6px 0",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "18px",
                  letterSpacing: "-0.011em",
                  color: "#76808d",
                }}
              >
                Will be added to the safe:
              </Typography>
              <Box sx={{ marginTop: "6px", padding: "17px 0px 0px 17px" }}>
                {newOwners.map((owner: any) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "30px",
                      }}
                    >
                      <img
                        src={bitMemberIcon}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "11px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontStyle: "normal",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "15px",
                          letterSpacing: "-0.011em",
                          color: "#76808d",
                        }}
                      >
                        {owner.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          {removeOwners && removeOwners.length > 0 && (
            <Box
              sx={{
                background: "rgba(118, 128, 141, 0.05)",
                borderRadius: "5px",
                padding: "20px",
                margin: "6px 0",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "18px",
                  letterSpacing: "-0.011em",
                  color: "#76808d",
                }}
              >
                Will be removed from the safe:
              </Typography>
              <Box sx={{ marginTop: "6px", padding: "17px 0px 17px 17px" }}>
                {removeOwners.map((owner: any) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "30px",
                      }}
                    >
                      <img
                        src={bitMemberIcon}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "11px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontStyle: "normal",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "15px",
                          letterSpacing: "-0.011em",
                          color: "#76808d",
                        }}
                      >
                        {owner.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {((newOwners && newOwners.length > 0) ||
            (removeOwners && removeOwners.length > 0)) && (
            <Box
              sx={{
                width: "208px",
                border: "2px solid #c94b32",
                margin: "35px auto",
              }}
            ></Box>
          )}
          <Box sx={{ padding: "0 0 0 20px" }}>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                textAlign: "left",
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "16px",
                lineHeight: "18px",
                letterSpacing: "-0.011em",
                color: "#76808D",
                marginBottom: "10px",
              }}
            >
              Adapt the voting balance
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                textAlign: "left",
                fontStyle: "italic",
                fontWeight: "400",
                fontSize: "14px",
                lineHeight: "18px",
                letterSpacing: "-0.011em",
                color: "#76808D",
                marginBottom: "10px",
              }}
            >
              Any transaction requires the confirmation of
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "134px",
              }}
            >
              <select
                className="safe-modal voting-container tokenDropdown"
                id="chain"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(+e.target.value)}
              >
                {owners.map((owner, i) => {
                  return <option value={i + 1}>{i + 1}</option>;
                })}
              </select>
              <Box
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "16px",
                  lineHeight: "18px",
                  letterSpacing: "-0.011em",
                  color: "rgba(27, 45, 65, 0.6)",
                }}
              >
                of {owners.length} owners
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)",
            width: "567px",
            position: "fixed",
            margin: " 0 auto",
            bottom: 0,
            borderRadius: "0px 0px 0px 20px",
            padding: "30px 0 20px",
          }}
        >
          <Box
            display="flex"
            width={380}
            sx={{ margin: "0 auto" }}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button
              sx={{ width: "169px", height: "50px", fontSize: "20px" }}
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => {
                setShowConfirmation(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                width: "184px",
                height: "50px",
                padding: "0px",
                fontSize: "20px",
                backgroundColor: updateOwnerLoading ? "#76808D" : "#C94B32",
              }}
              disabled={newOwnerCount == 0 || updateOwnerLoading}
              loading={updateOwnerLoading}
              onClick={async () => {
                await updateOwnersWithThreshold({
                  newOwners: newOwners.map((o: any) => o.wallet),
                  removeOwners: removeOwners.map((o: any) => o.wallet),
                  threshold: thresholdValue,
                  ownerCount: newOwnerCount,
                  thresholdChanged: currentThreshold !== thresholdValue,
                });
                onClose();
              }}
            >
              CONFIRM
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderMemberList = () => {
    return (
      <Box>
        <Box
          sx={{
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            //marginTop: "32px",
            height: "100%",
            padding: "100px 80px 100px 85px",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontStyle: "normal",
              fontWeight: "700",
              textAlign: "left",
              fontSize: "16px",
              lineHeight: "18px",
              letterSpacing: "-0.011em",
              color: "#76808d",
              marginBottom: "36px",
            }}
          >
            Select Owners
          </Typography>

          {members.map((member: any) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "16px 0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "30%",
                  }}
                >
                  <img style={{ width: 30, height: 30 }} src={bitMemberIcon} />
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: "14px",
                      marginLeft: "8px",
                      lineHeight: "15px",
                      letterSpacing: "-0.011em",
                      color: "#76808d",
                    }}
                  >
                    {_get(member, "name", "")}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontStyle: "italic",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "15px",
                    letterSpacing: "-0.011em",
                    color: "#76808d",
                  }}
                >
                  {beautifyHexToken(_get(member, "wallet", ""))}
                </Typography>
                <Checkbox
                  onChange={(status: any) => {
                    setMembers((prev: any) =>
                      prev.map((p: any) => {
                        if (member._id === p._id)
                          return { ...p, owner: status };
                        return p;
                      })
                    );
                  }}
                  checked={member.owner}
                />
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)",
            width: "567px",
            position: "fixed",
            margin: "0 auto",
            bottom: 0,
            borderRadius: "0px 0px 0px 20px",
            padding: "30px 0 20px",
          }}
        >
          <Box
            display="flex"
            width={380}
            sx={{ margin: "0 auto" }}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button
              sx={{ width: "169px", height: "50px", fontSize: "20px" }}
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => {
                setShowEdit(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                width: "184px",
                height: "50px",
                padding: "0px",
                fontSize: "20px",
              }}
              loading={false}
              disabled={
                newOwnerCount == 0 ||
                !(
                  (newOwners && newOwners.length > 0) ||
                  (removeOwners && removeOwners.length > 0)
                )
              }
              onClick={() => setShowConfirmation(true)}
            >
              SAVE
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Drawer
      PaperProps={{
        style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
      }}
      sx={{ zIndex: 99999 }}
      anchor={"right"}
      open={open}
      onClose={() => onClose()}
    >
      <Box
        sx={{
          flex: 1,
          borderRadius: "20px 0px 0px 20px",
          width: "575px",
          overflowY: "scroll",
        }}
      >
        <MuiIconButton
          sx={{
            position: "fixed",
            right: "27px",
            top: "36px",
            borderRadius: "0px !important",
          }}
          onClick={() => {
            setShowConfirmation(false);
            setShowEdit(false);
            onClose();
          }}
        >
          <img src={CloseSVG} style={{ width: "15px", height: "15px" }} />
        </MuiIconButton>
        {showConfirmation ? (
          renderConfirmation()
        ) : showEdit ? (
          renderMemberList()
        ) : (
          <Box>
            <Box sx={{ padding: "43px 85px 120px 90px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          > */}
                <Image
                  src={SafeIcon}
                  alt="Safe icon"
                  style={{ marginTop: "58px", width: "52px", height: "52px" }}
                />
                <Typography
                  sx={{
                    fontSize: "30px",
                    textAlign: "center",
                    marginTop: "20px",
                    marginBottom: "10px",
                    fontFamily: "Inter, sans-serif",
                    fontStyle: "normal",
                    color: "#C94B32",
                    height: "37px",
                  }}
                >
                  Safe
                </Typography>
                <Typography
                  sx={{
                    width: "400px",
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "#76808D",
                    textAlign: "center",
                    lineHeight: "20px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Easily customize your multi-sig wallet with a<br />{" "}
                  <b>personal name, signatories,</b> and{" "}
                  <b>voting threshold.</b>
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "400px",
                  marginTop: "35px",
                  // display: "flex",
                  // flexDirection: "column",
                  // alignItems: "center",
                  // justifyContent: "flex-start",
                }}
              >
                <TextInput
                  value={safeName}
                  onChange={(e: any) => setSafeName(e.target.value)}
                  placeholder="Epic dao"
                  sx={{ my: 1 }}
                  fullWidth
                  label="Name"
                />
              </Box>
              <Box
                sx={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                onClick={() => setCopy(true)}
                onMouseOut={() => setCopy(false)}
              >
                <Tooltip label={copy ? "copied" : "copy"}>
                  <MuiIconButton
                    sx={{
                      background:
                        "linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)",
                      borderRadius: "10px",
                      height: "37px",
                      width: "37px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                    }}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        _get(DAO, "safe.address", "")
                      )
                    }
                  >
                    <img src={copyIcon} alt="copy" className="safeCopyImage" />
                  </MuiIconButton>
                </Tooltip>
                <Box
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "16px",
                    color: "#76808D",
                  }}
                >{`${_get(DAO, "safe.address", "").slice(0, 6)}...${_get(
                  DAO,
                  "safe.address",
                  ""
                ).slice(-4)}`}</Box>
              </Box>
              <Box
                sx={{
                  width: "208px",
                  border: "2px solid #c94b32",
                  margin: "35px auto",
                }}
              ></Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontStyle: "normal",
                      fontWeight: "700",
                      fontSize: "16px",
                      lineHeight: "18px",
                      letterSpacing: "-0.011em",
                      color: "#76808D",
                    }}
                  >
                    Owners
                  </Typography>
                  <MuiIconButton
                    sx={{
                      marginRight: "22px",
                      width: "40px !important",
                      height: "40px !important",
                    }}
                    onClick={() => setShowEdit(true)}
                  >
                    <img src={editIcon} alt="editIcon" />
                  </MuiIconButton>
                </Box>
                <Box marginTop="22px">
                  {_get(DAO, "safe.owners", []).map((owner: any) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: "30px",
                          fontFamily: "'Inter', sans-serif",
                          fontStyle: "normal",
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "15px",
                          letterSpacing: "-0.011em",
                          color: "#76808D",
                        }}
                      >
                        <img
                          src={bitMemberIcon}
                          style={{
                            width: "24px",
                            height: "26px",
                            marginRight: "11px",
                          }}
                        />
                        <Typography>{owner.name}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box
                sx={{
                  width: "208px",
                  border: "2px solid #c94b32",
                  margin: "35px auto",
                }}
              ></Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "left",
                    fontStyle: "normal",
                    fontWeight: "700",
                    fontSize: "16px",
                    lineHeight: "18px",
                    letterSpacing: "-0.011em",
                    color: "#76808D",
                    marginBottom: "10px",
                  }}
                >
                  Voting balance
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "left",
                    fontStyle: "italic",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "-0.011em",
                    color: "#76808D",
                    marginBottom: "10px",
                  }}
                >
                  Any transaction requires the confirmation of
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "32px",
                  }}
                >
                  <select
                    className="safe-modal voting-container tokenDropdown"
                    id="chain"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(+e.target.value)}
                  >
                    {owners.map((owner, i) => {
                      return <option value={i + 1}>{i + 1}</option>;
                    })}
                  </select>
                  <Box
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: "16px",
                      lineHeight: "18px",
                      letterSpacing: "-0.011em",
                      color: "rgba(27, 45, 65, 0.6)",
                    }}
                  >
                    of {owners.length} owners
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                background:
                  "linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)",
                width: "567px",
                position: "fixed",
                margin: " 0 auto",
                bottom: 0,
                borderRadius: "0px 0px 0px 20px",
                padding: "30px 0 20px",
              }}
            >
              <Box
                display="flex"
                width={380}
                sx={{ margin: "0 auto" }}
                flexDirection="row"
                justifyContent="space-between"
              >
                <Button
                  sx={{ width: "169px", height: "50px", fontSize: "20px" }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    width: "184px",
                    height: "50px",
                    padding: "0px",
                    fontSize: "20px",
                  }}
                  loading={updateOwnerLoading}
                  disabled={updateOwnerLoading}
                  onClick={async () => {
                    // add name condition
                    if (currentThreshold !== thresholdValue) {
                      await updateOwnersWithThreshold({
                        ownerCount: newOwnerCount,
                        threshold: thresholdValue,
                        thresholdChanged: currentThreshold !== thresholdValue,
                      });
                      onClose();
                    } else {
                      onClose();
                    }
                  }}
                >
                  SAVE CHANGES
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
