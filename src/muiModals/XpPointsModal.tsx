import { ReactComponent as XpPoints } from "../assets/images/settings-page/5-xp-points-color.svg";
// import DisableXpPointDailog from "./DisableXpPointDailog";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
// import CompensateMembersModal from "./CompensateMembersModal";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { toggleXPPoints } from "state/dashboard/actions";
import Switch from "muiComponents/Switch";
import CloseSVG from "assets/svg/close-new.svg";
import DisableXpPointDailog from "pages/NewPages/DisableXpPointDailog";
import palette from "muiTheme/palette";
import { Box, Drawer, Typography } from "@mui/material";
import daoMember2 from "../assets/svg/daoMember2.svg";
import { ReactComponent as PolygonIcon } from "../assets/svg/polygon.svg";
import GoerliIcon from "../assets/images/goerli.png";
import { ReactComponent as StarIcon } from "../assets/svg/star.svg";
import axios from "axios";
import { beautifyHexToken } from "utils";
import { tokenCallSafe } from "connection/DaoTokenCall";
import { ImportSafe, safeService } from "connection/SafeCall";
import axiosHttp from "api";
import { getDao } from "state/dashboard/actions";
import Button from "muiComponents/Button";
import CurrencyInput from "muiComponents/CurrencyInput";
import { ReactComponent as CompensateIcon } from "../assets/images/settings-page/8-compensate-member.svg";
import {
  get as _get,
  find as _find,
  uniqBy as _uniqBy,
  findIndex as _findIndex,
} from "lodash";
import eventEmitter from "utils/eventEmmiter";
import { GNOSIS_SAFE_BASE_URLS } from "constants/chains";
import {
  SupportedChainId,
  SUPPORTED_CHAIN_IDS,
  CHAIN_IDS_TO_NAMES,
} from "constants/chains";
import { useWeb3React } from "@web3-react/core";
import { default as MuiIconButton } from "muiComponents/IconButton";
import React from "react";

export default ({ open, onClose }: { open: boolean; onClose: any }) => {
  const [showDisableDailog, setShowDisableDailog] = useState(false);
  const [isXpPointEnable, setIsXpPointEnable] = useState(false);
  const [isXpPointSetByDailog, setIsXpPointSetByDailog] = useState(false);
  const [showCompensateMembersModals, setShowCompensateMembersModals] =
    useState(false);
  const [firstUpdate, setFirstUpdate] = useState(false);
  const dispatch = useAppDispatch();
  const { DAO } = useAppSelector((state) => state.dashboard);
  const [
    showCompensateMembersDescriptionModals,
    setShowCompensateMembersDescriptionModals,
  ] = useState(false);
  const [safeTokens, setSafeTokens] = useState<any>([]);
  const { user, DAOList, DAOLoading } = useAppSelector(
    (state) => state.dashboard
  );
  const [sweatValue, setSweatValue] = useState(null);
  const [currency, setCurrency] = useState<any>(null);
  const [showCompensateMembersDoneModal, setShowCompensateMembersDoneModal] =
    useState(false);
  const { chainId, account, provider } = useWeb3React();
  console.log(account);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (DAO) setIsXpPointEnable(_get(DAO, "sweatPoints", false));
  }, [DAO]);

  useEffect(() => {
    if (chainId && DAO) {
      axios
        .get(
          `${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${_get(
            DAO,
            "safe.address",
            ""
          )}/balances/usd/`,
          { withCredentials: false }
        )
        .then((tokens) => {
          setSafeTokens(
            tokens.data.map((t: any) => {
              let tkn = t;
              console.log(tkn);
              if (!tkn.tokenAddress) {
                return {
                  ...t,
                  tokenAddress:
                    chainId === SupportedChainId.POLYGON
                      ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS
                      : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS,
                  token: {
                    symbol:
                      chainId === SupportedChainId.POLYGON ? "MATIC" : "GOR",
                  },
                };
              }
              return t;
            })
          );
        });
    }
  }, [chainId, DAO]);

  useEffect(() => {
    if (safeTokens && safeTokens.length > 0) {
      if (!safeTokens[0].tokenAddress) {
        setCurrency(
          chainId === SupportedChainId.GOERLI
            ? process.env.REACT_APP_GOERLI_TOKEN_ADDRESS
            : process.env.REACT_APP_MATIC_TOKEN_ADDRESS
        );
      } else {
        setCurrency(safeTokens[0].tokenAddress);
      }
    }
  }, [safeTokens]);

  const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    if (chainId && DAO) {
      axios
        .get(
          `${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${_get(
            DAO,
            "safe.address",
            ""
          )}/balances/usd/`,
          { withCredentials: false }
        )
        .then((tokens) => {
          setSafeTokens(
            tokens.data.map((t: any) => {
              let tkn = t;
              if (!tkn.tokenAddress) {
                return {
                  ...t,
                  tokenAddress:
                    chainId === SupportedChainId.POLYGON
                      ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS
                      : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS,
                  token: {
                    symbol:
                      chainId === SupportedChainId.POLYGON ? "MATIC" : "GOR",
                  },
                };
              }
              return t;
            })
          );
        });
    }
  }, [chainId, DAO]);

  const sweatMembers = useMemo(() => {
    if (DAO) {
      let members = _get(DAO, "members", []).filter((m: any) =>
        _find(
          _get(m, "member.earnings"),
          (e) =>
            e.currency === "SWEAT" &&
            e.daoId === _get(DAO, "_id", "") &&
            e.value > 0
        )
      );
      members = members.map((m: any) => {
        const sweat = _find(
          _get(m, "member.earnings", []),
          (e) => e.currency === "SWEAT" && e.daoId === _get(DAO, "_id", "")
        );
        return {
          ...m,
          amount: _get(sweat, "value", 0) * (sweatValue ? sweatValue : 0),
        };
      });
      return members;
    }
    return [];
  }, [DAO]);

  const total = useMemo(() => {
    let t = 0;
    for (let index = 0; index < sweatMembers.length; index++) {
      const m = sweatMembers[index];
      const sweat = _find(
        _get(m, "member.earnings", []),
        (e) => e.currency === "SWEAT" && e.daoId === _get(DAO, "_id", "")
      );
      t = t + _get(sweat, "value", 0) * (sweatValue ? sweatValue : 0);
    }
    return t;
  }, [sweatMembers]);

  const NameAndAvatar = ({ data }: any) => {
    console.log(data);
    const name =
      _get(data, "member.name", "") !== ""
        ? _get(data, "member.name", "")
        : beautifyHexToken(_get(data, "member.wallet", ""));
    const sweat = _find(
      _get(data, "member.earnings", []),
      (e) => e.currency === "SWEAT" && e.daoId === _get(DAO, "_id", "")
    );

    return (
      <>
        <Box style={{ margin: "12px 0" }}>
          <Box className="memberRow">
            <Box
              className="avatarAndName"
              style={{ minWidth: "25%", flexGrow: 1 }}
            >
              <img src={daoMember2} alt="avatar" />
              <Box
                style={{ marginRight: 11, minWidth: 92 }}
                className="dashboardText"
              >
                {name}
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Box>
                <StarIcon
                  style={{
                    height: "18px",
                    width: "18px",
                    margin: "0 10px 0 12px",
                  }}
                />
              </Box>
              <Box
                style={{ minWidth: "65px" }}
                className="dashboardText"
              >{`${_get(sweat, "value", 0)} SWT =`}</Box>
              <Box
                style={{
                  marginLeft: "20px",
                  minWidth: "28px",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  display: "flex",
                }}
                className="roleText"
              >
                {_get(sweat, "value", 0) * (sweatValue ? sweatValue : 0)}
              </Box>
              <Box style={{ float: "right" }}>
                {_get(
                  _find(safeTokens, (s) => s.tokenAddress === currency),
                  "token.symbol",
                  ""
                ) === "MATIC" ? (
                  <PolygonIcon
                    style={{
                      height: "20px",
                      width: "20px",
                      margin: "0 0 0 8px",
                    }}
                  />
                ) : _get(
                    _find(safeTokens, (s) => s.tokenAddress === currency),
                    "token.symbol",
                    ""
                  ) === "GOR" ? (
                  <img
                    src={GoerliIcon}
                    style={{
                      height: "20px",
                      width: "20px",
                      margin: "0 0 0 8px",
                    }}
                  />
                ) : (
                  <StarIcon
                    style={{
                      height: "18px",
                      width: "18px",
                      margin: "0 2px 0 12px",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  const createTransaction = async () => {
    try {
      if (!sweatMembers || sweatMembers.length == 0) throw "No entries";
      //setError(null)
      let sendTotal = total;
      let selToken = _find(safeTokens, (t) => t.tokenAddress === currency);
      if (safeTokens.length > 0 && !selToken) selToken = safeTokens[0];
      if (
        selToken &&
        _get(selToken, "balance", 0) /
          10 ** _get(selToken, "token.decimals", 18) <
          sendTotal
      )
        //{ _get(result, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR') }
        //return setError(`Low token balance. Available tokens ${_get(selToken, 'balance', 0) / 10 ** 18} ${selToken.token.symbol}`);
        return; // setError(`Low token balance. Available tokens ${_get(selToken, 'balance', 0) / 10 ** _get(selToken, 'token.decimals', 18)} ${_get(selToken, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')}`);
      //setisLoading(true);
      setLoading(true);
      const token = await tokenCallSafe(currency);
      const safeSDK = await ImportSafe(provider, _get(DAO, "safe.address", ""));
      const safeTransactionData = await Promise.all(
        sweatMembers.map(async (result: any, index: any) => {
          const unsignedTransaction = await token.populateTransaction.transfer(
            result.member.wallet,
            BigInt(
              parseFloat(result.amount) *
                10 ** _get(selToken, "token.decimals", 18)
            )
          );
          const transactionData = {
            to: currency,
            data: unsignedTransaction.data,
            value: "0",
          };
          return transactionData;
        })
      );
      const currentNonce = await (
        await safeService(provider, `${chainId}`)
      ).getNextNonce(_get(DAO, "safe.address", null));
      const options = {
        nonce: currentNonce,
      };
      const safeTransaction = await safeSDK.createTransaction({
        safeTransactionData,
        options,
      });
      const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
      const signature = await safeSDK.signTransactionHash(safeTxHash);
      const senderAddress: string = account as string;
      const safeAddress = _get(DAO, "safe.address", null);
      await (
        await safeService(provider, `${chainId}`)
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
          setLoading(false);
        });
      await (
        await safeService(provider, `${chainId}`)
      )
        .confirmTransaction(safeTxHash, signature.data)
        .then(async (success) => {
          console.log("transaction is successful");
          console.log("success:", success);
          let payload: any = [];
          sweatMembers.map((r: any) => {
            payload.push({
              safeAddress: _get(DAO, "safe.address", null),
              safeTxHash: safeTxHash,
              recipient: r.member.wallet,
              label: "Sweat conversion",
              sweatConversion: true,
            });
          });
          axiosHttp
            .post(`transaction/label`, payload)
            .then(async () => {
              dispatch(getDao(DAO.url));
              // eventEmitter.emit("close-xp-modal");
              setShowCompensateMembersDoneModal(true);
            })
            .finally(() => setLoading(false));
        })
        .catch((err) => {
          setLoading(false);
          console.log("error occured while confirming transaction", err);
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const compensateMembersDoneModal = () => {
    return (
      <Drawer
        PaperProps={{
          style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
        }}
        sx={{ zIndex: 100000 }}
        anchor={"right"}
        open={showCompensateMembersDoneModal}
        onClose={() => setShowCompensateMembersDoneModal(false)}
      >
        <Box sx={{ width: 575, flex: 1, borderRadius: "20px 0px 0px 20px" }}>
          <MuiIconButton
            sx={{
              position: "fixed",
              right: "23px",
              top: "36px",
              borderRadius: "0px !important",
            }}
            onClick={() => {
              setShowCompensateMembersDoneModal(false);
              setShowCompensateMembersDescriptionModals(false);
              setShowCompensateMembersModals(false);
              eventEmitter.emit("close-xp-modal");
            }}
          >
            <img src={CloseSVG} style={{ width: "15px", height: "15px" }} />
          </MuiIconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CompensateIcon
              style={{
                width: "94.48px",
                height: "50px",
                color: "#C94B32",
              }}
            />
            <Typography
              style={{
                color: palette.primary.main,
                fontSize: "30px",
                fontWeight: 400,
                marginBottom: "35px",
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "37px",
              }}
            >
              Done!
            </Typography>
            <Box
              sx={{
                width: "235px",
                height: "18px",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "18px",
                textAlign: "center",
                letterSpacing: "-0.011em",
                color: "#76808D",
              }}
            >
              Batch Transaction initiated. <br /> You will be redirected in a
              few seconds.
            </Box>
          </Box>
        </Box>
      </Drawer>
    );
  };

  const compensateMembersDescriptionModal = () => {
    return (
      <Drawer
        PaperProps={{
          style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
        }}
        sx={{ zIndex: 100000 }}
        anchor={"right"}
        open={showCompensateMembersDescriptionModals}
        onClose={() => setShowCompensateMembersDescriptionModals(false)}
      >
        <Box sx={{ width: 575, flex: 1, borderRadius: "20px 0px 0px 20px" }}>
          <MuiIconButton
            sx={{
              position: "fixed",
              right: "23px",
              top: "36px",
              borderRadius: "0px !important",
            }}
            onClick={() => {
              setShowCompensateMembersDescriptionModals(false);
              setShowCompensateMembersModals(false);
              eventEmitter.emit("close-xp-modal");
            }}
          >
            <img src={CloseSVG} style={{ width: "15px", height: "15px" }} />
          </MuiIconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CompensateIcon
              style={{
                marginBottom: "20px",
                width: "94.48px",
                height: "50px",
                color: "#C94B32",
              }}
            />
            <Typography
              style={{
                color: palette.primary.main,
                fontSize: "30px",
                fontWeight: 400,
                marginBottom: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "37px",
              }}
            >
              Compensate Members
            </Typography>
            <Box style={{ minWidth: "300px" }}>
              {sweatMembers.map((result: any, index: any) => {
                return <NameAndAvatar data={result} />;
              })}
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Box
                  className="dashboardText"
                  style={{
                    clear: "both",
                    display: "inline-block !important",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {"Total ="}
                </Box>
                {/* <div className="memberdivider">
                <hr />
              </div> */}
                <Box style={{ marginLeft: "20px" }} className="roleText">
                  {total}
                </Box>
                <Box>
                  {_get(
                    _find(safeTokens, (s) => s.tokenAddress === currency),
                    "token.symbol",
                    ""
                  ) === "MATIC" ? (
                    <PolygonIcon
                      style={{
                        height: "20px",
                        width: "20px",
                        margin: "0 0 0 8px",
                      }}
                    />
                  ) : _get(
                      _find(safeTokens, (s) => s.tokenAddress === currency),
                      "token.symbol",
                      ""
                    ) === "GOR" ? (
                    <img
                      src={GoerliIcon}
                      style={{
                        height: "20px",
                        width: "20px",
                        margin: "0 0 0 8px",
                      }}
                    />
                  ) : (
                    <StarIcon
                      style={{
                        height: "18px",
                        width: "18px",
                        margin: "0 2px 0 12px",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                width: "400px",
                height: "18px",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "18px",
                textAlign: "center",
                letterSpacing: "-0.011em",
                marginTop: "50px",
                color: "#76808D",
              }}
            >
              All SWEAT counter will be reset to 0.
            </Box>
            {/* //! FOOTER */}
            <Box
              position="fixed"
              sx={{ backgroundColor: "#FFF" }}
              bottom={0}
              pb={3}
              pt={2}
              display="flex"
              flexDirection="row"
            >
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => {
                  // toggleModal();
                  setShowCompensateMembersDescriptionModals(false);
                  setShowCompensateMembersModals(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={loading || safeTokens.length == 0}
                fullWidth
                style={{ backgroundColor: loading ? "grey" : "#C94B32" }}
                onClick={() => createTransaction()}
                id="button-save"
              >
                SEND TOKENS
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    );
  };

  const compensateMembersModal = () => {
    return (
      <Drawer
        PaperProps={{
          style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
        }}
        sx={{ zIndex: 100000 }}
        anchor={"right"}
        open={showCompensateMembersModals}
        onClose={() => setShowCompensateMembersModals(false)}
      >
        <Box sx={{ width: 575, flex: 1, borderRadius: "20px 0px 0px 20px" }}>
          <MuiIconButton
            sx={{
              position: "fixed",
              right: "23px",
              top: "36px",
              borderRadius: "0px !important",
            }}
            onClick={() => {
              setShowCompensateMembersModals(false);
              eventEmitter.emit("close-xp-modal");
            }}
          >
            <img src={CloseSVG} style={{ width: "15px", height: "15px" }} />
          </MuiIconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CompensateIcon
              style={{ width: "94.48px", height: "50px", color: "#C94B32" }}
            />
            <Typography
              style={{
                color: palette.primary.main,
                fontSize: "30px",
                fontWeight: 400,
                marginBottom: "35px",
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "37px",
              }}
            >
              Compensate Members
            </Typography>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              marginBottom="35px"
            >
              <Box
                mr={2}
                alignItems="center"
                display="flex"
                flexDirection="row"
                className="currency-container"
              >
                {/* {_get(null, "compensation.symbol", "SWEAT") === "MATIC" ? (
                  <PolygonIcon />
                ) : (
                  <StarIcon />
                )} */}
                <Box style={{ marginLeft: 8 }}>{"1 SWT = "}</Box>
              </Box>
              <CurrencyInput
                value={sweatValue ? sweatValue : 0}
                onChange={(value: any) => {
                  setSweatValue(value);
                }}
                options={safeTokens.map((t: any) => {
                  return {
                    value: t.tokenAddress,
                    label: t.token.symbol,
                  };
                })}
                dropDownvalue={currency}
                onDropDownChange={(value: any) => {
                  setCurrency(value);
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                setShowCompensateMembersDescriptionModals(true);
                setShowCompensateMembersModals(false);
              }}
            >
              {"Next"}
            </Button>
          </Box>
        </Box>

        {
          // <CompensateMembersDescriptionModal
          //   currency={currency}
          //   open={showCompensateMembersDescriptionModals}
          //   sweatValue={sweatValue || 0}
          //   onClose={() => setShowCompensateMembersDescriptionModals(false)}
          //   toggleCompensate={onClose}
          // />
        }
      </Drawer>
    );
  };

  const XpPointsModal = () => {
    return (
      <Drawer
        PaperProps={{
          style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
        }}
        sx={{ zIndex: 100000 }}
        anchor={"right"}
        open={open}
        onClose={() => onClose()}
      >
        <Box sx={{ width: 575, flex: 1, borderRadius: "20px 0px 0px 20px" }}>
          {showDisableDailog && (
            <DisableXpPointDailog
              setShowDisableDailog={setShowDisableDailog}
              setIsXpPointEnable={(status: any) => {
                if (!status) {
                  dispatch(
                    toggleXPPoints({
                      payload: { status },
                      daoUrl: _get(DAO, "url", ""),
                    })
                  );
                }
              }}
              isXpPointSetByDailog={isXpPointSetByDailog}
            />
          )}
          {/* <Box
          onClick={() => {
            onClose();
          }}
        ></Box> */}
          <MuiIconButton
            sx={{
              position: "fixed",
              right: "23px",
              top: "36px",
              borderRadius: "0px !important",
            }}
            onClick={() => onClose()}
          >
            <img src={CloseSVG} style={{ width: "15px", height: "15px" }} />
          </MuiIconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <XpPoints
              style={{ width: "47px", height: "47px", color: "#C94B32" }}
            />
            <Typography
              style={{
                color: palette.primary.main,
                fontSize: "30px",
                fontWeight: 400,
                marginBottom: "10px",
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "37px",
              }}
            >
              Sweat Points
            </Typography>
            <Typography
              style={{
                width: "400px",
                fontWeight: 400,
                fontSize: "16px",
                color: "#76808D",
                textAlign: "center",
                lineHeight: "20px",
              }}
            >
              Get ahead of the game with SWEAT points during your organization's
              bootstrapping phase.<b>Track contributions</b> and{" "}
              <b>reward members</b> based on their SWEAT points, once your
              organization has the funds.
            </Typography>
            <Box marginTop="35px">
              {isXpPointEnable && (
                <Button
                  size="small"
                  onClick={() => setShowCompensateMembersModals(true)}
                  sx={{
                    backgroundColor: "#C94B32",
                    color: "#FFFFFF",
                    fontWeight: "400",
                    borderRadius: "5px",
                  }}
                >
                  {"Convert to tokens & Compensate members"}
                </Button>
              )}
            </Box>
            <Box
              style={{
                marginTop: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Switch
                checked={isXpPointEnable}
                label={isXpPointEnable ? "ENABLED" : "DISABLED"}
                onChange={(e: any, d: any) => {
                  if (!isXpPointEnable) {
                    dispatch(
                      toggleXPPoints({
                        payload: { status: !isXpPointEnable },
                        daoUrl: _get(DAO, "url", ""),
                      })
                    );
                    setIsXpPointEnable(!isXpPointEnable);
                  } else {
                    setShowDisableDailog(true);
                    setIsXpPointSetByDailog(false);
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    );
  };

  if (showCompensateMembersModals) return compensateMembersModal();
  if (showCompensateMembersDescriptionModals)
    return compensateMembersDescriptionModal();
  if (showCompensateMembersDoneModal) return compensateMembersDoneModal();
  return XpPointsModal();
};
