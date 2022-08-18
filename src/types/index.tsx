import { Web3Auth } from "@web3auth/web3auth";
import { SafeEventEmitterProvider } from "@web3auth/base";
export interface blockType{
    onClickGoToStep?: string,
    blockTitle: string,
    blockDescription: string,
}
export interface templateType{
    onClickGoToStep?: string,
    blockTitle: string,
    blockDescription: string,
    iconColor: string,
    onClick: () => void
}
export type imageType = any;

export interface sliderType{
    value: number,
}

export interface tagType{
    title: string,
}

export interface ChangeComponentType{
    property: string,
}
export interface sidebarPropType{
    page?: string,
}
export interface Web3AuthPropType extends sidebarPropType {
    web3auth?: Web3Auth | null,
    login?: ()=> void,
    logout?: () => void,
    web3Provider?: SafeEventEmitterProvider | null
}