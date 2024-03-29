import React, { useState, useEffect, useCallback } from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { useWeb3React } from "@web3-react/core";
import { getSigner } from 'utils'
import { isValidUrl } from 'utils';
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import useDCAuth from 'hooks/useDCAuth';
import { toast, ToastContainer } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import usePopupWindow from 'hooks/usePopupWindow';
import useLomadsBotPopupWindow from 'hooks/useLomadsBotPopupWindow';
import axios from "axios";
import { LeapFrog } from "@uiball/loaders";
import { usePrevious } from 'hooks/usePrevious';
import useInterval from "hooks/useInterval";
import { guild, role } from "@guildxyz/sdk";
import { useAppSelector, useAppDispatch } from "state/hooks";
import axiosHttp from '../api';
import { nanoid } from "@reduxjs/toolkit";

export default ({ title, desc, link, spaceDomain, accessControl, okButton, onNotionCheckStatus, ...props }) => {

    console.log("spaceDomain", spaceDomain)
    const { provider, account, chainId } = useWeb3React();
    const [linkLoading, setLinkLoading] = useState(false)

    const handleAddResource = async () => {
        if (title === '') {
            return toast.error("Please enter title");
        }
        else if (link === '') {
            return toast.error("Please enter link");
        }
        else if (!isValidUrl(link)) {
            return toast.error("Please enter a valid link");
        }
        else if (!spaceDomain) {
            return toast.error("Valid notion domain required");
        }
        else {
            if (accessControl) {
                setLinkLoading(true)
                axiosHttp.get(`/project/notion/space-admin-status?domain=${spaceDomain}`)
                    .then(res => {
                        console.log(res)
                        onNotionCheckStatus(res.data)
                    })
                    .catch(e => {
                        console.log(e)
                        onNotionCheckStatus({ status: false, message: 'Something went wrong. Try again' })
                    })
                    .finally(() => setLinkLoading(false))
            } else {
                onNotionCheckStatus({ status: true })
            }
        }
    }

    return (
        <>
            {
                okButton ?
                    <SimpleLoadButton disabled={linkLoading} title="OK" bgColor={link !== '' && title !== '' && !linkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0.2)'} className="button" fontsize={16} fontweight={400} height={40} width={129} onClick={() => handleAddResource()} /> :
                    <button
                        disabled={link === '' || title === '' || linkLoading}
                        style={{ background: link !== '' && title !== '' && !linkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0.2)', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleAddResource()}
                    >   {
                            <AiOutlinePlus color="#FFF" size={25} />
                        }
                    </button>
            }
        </>

    )
}