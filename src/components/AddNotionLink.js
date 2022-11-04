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

export default ({ title, desc, link, spaceDomain, accessControl, okButton, ...props }) => {

    const { provider, account, chainId } = useWeb3React();

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
        else {
            if(accessControl){
                axiosHttp.get(`/project/notion/space-admin-status?${spaceDomain}`)
                .then(res => console.log(res.data))
            }
        }
    }

    return (
        <>
            { 
                okButton ? 
                <SimpleLoadButton title="OK" bgColor="#C94B32" className="button" fontsize={16} fontweight={400} height={40} width={129} onClick={() => handleAddResource()} /> : 
                <button
                    style={link !== '' && title !== '' ? { background: '#C84A32' } : null}
                    onClick={() => handleAddResource() }
                >   { false ?
                    <LeapFrog size={20} color="#FFF" /> :
                    <AiOutlinePlus color="#FFF" size={25} />
                    }
                </button>
            }
        </>

    )   
}