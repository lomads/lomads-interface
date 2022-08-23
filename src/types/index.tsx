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
    value1: number,
    value2?: number,
    page?: string,
    vote?: string
}
export interface sidebarPropType{
    page?: string,
}