/* global BigInt */
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { ReactComponent as CompensateIcon } from "../../assets/images/settings-page/8-compensate-member.svg";
import moment from 'moment';
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { ReactComponent as PolygonIcon } from '../../assets/svg/polygon.svg';
import GoerliIcon  from '../../assets/images/goerli.png';
import { ReactComponent as StarIcon } from '../../assets/svg/star.svg';
import axios from "axios";
import { useEffect } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import CompensateMembersDoneModal from "./CompensateMembersDoneModal";
import { useMemo, useState } from "react";
import eventEmitter from "utils/eventEmmiter";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import { beautifyHexToken } from "utils";
import { GNOSIS_SAFE_BASE_URLS, SupportedChainId } from 'constants/chains';
import { tokenCallSafe } from "connection/DaoTokenCall";
import { ImportSafe, safeService } from "connection/SafeCall";
import axiosHttp from 'api'
import { getDao } from "state/dashboard/actions";


const CompensateMembersDescriptionModal = ({ currency, sweatValue = 0, toggleModal, toggleCompensate }) => {
  const [showCompensateMembersDoneModal , setShowCompensateMembersDoneModal] = useState(false)
  const { user, DAO, DAOList, DAOLoading } = useAppSelector((state) => state.dashboard);
  const { chainId, account, provider } = useWeb3React();
  const dispatch = useAppDispatch()
  const [safeTokens, setSafeTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

  useEffect(() => {
    if(chainId, DAO) {
      axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${_get(DAO, 'safe.address', '')}/balances/usd/`, {withCredentials: false })
      .then((tokens) => {
        setSafeTokens(tokens.data.map(t => {
          let tkn = t
          if(!tkn.tokenAddress){
            return {
              ...t,
              tokenAddress: chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS,
              token: {
                symbol: chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'
              }
            }
          }
            return t
        }));
      });
    }
	}, [chainId, DAO]);

  const sweatMembers = useMemo(() => {
    if(DAO) {
      let members = _get(DAO, 'members', []).filter(m => _find(_get(m, 'member.earnings'), e => e.currency === 'SWEAT' && e.daoId === _get(DAO, '_id', '') && e.value > 0))
      members = members.map(m => {
        const sweat = _find(_get(m, 'member.earnings', []), e => e.currency === 'SWEAT' && e.daoId === _get(DAO, '_id', ''))
        return {
          ...m, amount: _get(sweat, 'value', 0) * sweatValue
        }
      })
      return members
    }
    return []
  }, [DAO])

  const total = useMemo(() => {
    let t = 0;
    for (let index = 0; index < sweatMembers.length; index++) {
      const m = sweatMembers[index];
      const sweat = _find(_get(m, 'member.earnings', []), e => e.currency === 'SWEAT' && e.daoId === _get(DAO, '_id', ''))
      t = t + (_get(sweat, 'value', 0) * sweatValue)
    }
    return t;
  }, [sweatMembers])

  const NameAndAvatar = ({data}) => {
    console.log(data)
    const name = _get(data, 'member.name', '') !== '' ? _get(data, 'member.name', '') : beautifyHexToken(_get(data, 'member.wallet', ''))
    const sweat = _find(_get(data, 'member.earnings', []), e => e.currency === 'SWEAT' && e.daoId === _get(DAO, '_id', ''))

		return (
			<>
				<div style={{margin:'12px 0'}}>
					<div className="memberRow">
						<div className="avatarAndName">
							<img src={daoMember2} alt="avatar" />
							<div style={{marginRight:11, minWidth:92}} className="dashboardText">{name}</div>
						</div>
            <div>
            <StarIcon style={{height:"18px", width:"18px", margin:'0 10px 0 12px'}}/>
            </div>
						<div style={{ minWidth:"65px"}} className="dashboardText">{`${_get(sweat, 'value', 0)} SWT =`}</div>
						<div style={{marginLeft:"20px", minWidth:"28px", alignItems:'center', justifyContent:'flex-end', display:'flex'}} className="roleText">
							{_get(sweat, 'value', 0) * sweatValue}
						</div>
            <div>
              { _get(_find(safeTokens, s => s.tokenAddress === currency), 'token.symbol', '') === 'MATIC' ?
                <PolygonIcon style={{height:"20px", width:"20px", margin:'0 0 0 8px'}}/> :
                _get(_find(safeTokens, s => s.tokenAddress === currency), 'token.symbol', '') === 'GOR' ?
                <img src={GoerliIcon} style={{height:"20px", width:"20px", margin:'0 0 0 8px'}}/> :
                <StarIcon style={{height:"18px", width:"18px", margin:'0 10px 0 12px'}}/>
              }
            </div>
					</div>
				</div>
			</>
		);
	};


  const createTransaction = async () => {
		try {
			//setError(null)
			let sendTotal = total
			let selToken = _find(safeTokens, t => t.tokenAddress === currency)
			if (safeTokens.length > 0 && !selToken)
				selToken = safeTokens[0];
			if (selToken && (_get(selToken, 'balance', 0) / 10 ** _get(selToken, 'token.decimals', 18)) < sendTotal)
				//{ _get(result, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR') }
				//return setError(`Low token balance. Available tokens ${_get(selToken, 'balance', 0) / 10 ** 18} ${selToken.token.symbol}`);
				return;// setError(`Low token balance. Available tokens ${_get(selToken, 'balance', 0) / 10 ** _get(selToken, 'token.decimals', 18)} ${_get(selToken, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')}`);
			//setisLoading(true);
      setLoading(true)
			const token = await tokenCallSafe(currency);
			const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
			const safeTransactionData = await Promise.all(
				sweatMembers.map(
					async (result, index) => {
						const unsignedTransaction = await token.populateTransaction.transfer(
							result.member.wallet,
							BigInt(parseFloat(result.amount) * 10 ** _get(selToken, 'token.decimals', 18))
						);
						const transactionData = {
							to: currency,
							data: unsignedTransaction.data,
							value: "0",
						};
						return transactionData;
					}
				)
			);
      const currentNonce = await (await safeService(provider, `${chainId}`)).getNextNonce(_get(DAO, 'safe.address', null));
			const options = {
				nonce: currentNonce,
			};
			const safeTransaction = await safeSDK.createTransaction({
				safeTransactionData,
				options,
			});
			const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
			const signature = await safeSDK.signTransactionHash(safeTxHash);
			const senderAddress = account;
			const safeAddress = _get(DAO, 'safe.address', null);
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
					let payload = [];
					sweatMembers.map(r => {
						payload.push({
							safeAddress: _get(DAO, 'safe.address', null),
							safeTxHash: safeTxHash,
							recipient: r.member.wallet,
							label: "Sweat conversion",
              sweatConversion: true
						})
					})
					axiosHttp.post(`transaction/label`, payload)
					.then(async () => {
						dispatch(getDao(DAO.url))
            eventEmitter.emit('close-xp-modal')
					})
          .finally(() => setLoading(false))
				})
				.catch((err) => {
          setLoading(false)
					console.log("error occured while confirming transaction", err);
				});
		} catch (e) {
      setLoading(false)
			console.log(e)
		}
	};


  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            eventEmitter.emit('close-xp-modal')
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
              onClick={() => {
                eventEmitter.emit('close-xp-modal')
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CompensateIcon style={{marginTop: "100px",marginBottom:'20px', width: "94.48px", height: "50px",color: "#C94B32" }} />
            <div id="title-type">Compensate Members</div>
          </div>

          {/* //! BODY */}
          <div style={{minWidth:'300px'}}>
          {
          //  _uniqBy([{},{}], (m) => m.member.wallet.toLowerCase())
          sweatMembers.map((result, index) => {
						return (
							<NameAndAvatar
								data={result}
							/>
						);
					})}
          <div style={{display:'flex', alignItems: 'center', flexDirection:'row', justifyContent:'flex-end', marginTop:'20px'}}>
            <div className="dashboardText">{"Total ="}</div>
              {/* <div className="memberdivider">
                <hr />
              </div> */}
              <div style={{marginLeft:"20px"}} className="roleText">
                {total}
              </div>
              <div>
                { _get(_find(safeTokens, s => s.tokenAddress === currency), 'token.symbol', '') === 'MATIC' ?
                  <PolygonIcon style={{height:"20px", width:"20px", margin:'0 0 0 8px'}}/> :
                  _get(_find(safeTokens, s => s.tokenAddress === currency), 'token.symbol', '') === 'GOR' ?
                  <img src={GoerliIcon} style={{height:"20px", width:"20px", margin:'0 0 0 8px'}}/> :
                  <StarIcon style={{height:"18px", width:"18px", margin:'0 10px 0 12px'}}/>
                }
              </div>
            </div>
          </div>
          <div id="cm-info"
          >
            All SWEAT counter will be reset to 0.
          </div>
          {/* //! FOOTER */}
          <div className="button-section">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                toggleModal();
                toggleCompensate();
              }}
            >
              Cancel
            </Button>
            <Button disabled={loading || safeTokens.length == 0} style={{ backgroundColor: loading ? 'grey' : '#C94B32' }} onClick={() => createTransaction()} id="button-save">SAVE CHANGES</Button>
          </div>
        </div>
      </div>
      {showCompensateMembersDoneModal && (
        <CompensateMembersDoneModal toggleCompensate={()=>setShowCompensateMembersDoneModal(false)} />
      )}
    </>
  );
};

export default CompensateMembersDescriptionModal;
