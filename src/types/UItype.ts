export interface InputFieldType {
  isInvalid?: any;
  id?: string;
  className?: string;
  height?: number;
  width?: number;
  name?: string;
  value?: string | number;
  placeholder?: string;
  onchange?: (e: any) => void;
  type?: string;
}

export interface ButtonType {
  title: string;
  onClick?: () => void;
  height?: number;
  width?: number;
  fontsize?: number;
  fontweight?: number;
  bgColor?: string;
}

export interface IconButtonType {
  onClick?: () => void;
  height?: number;
  width?: number;
  fontsize?: number;
  fontweight?: number;
  Icon: any;
  bgColor?: string;
}
export interface SafeButtonType extends ButtonType {
  bgColor: string;
  titleColor: string;
}
export interface Colorstype {
  backgroudColor: string;
  left: string;
  right: string;
  top: string;
  bottom: string;
  transform: string;
}
export interface OwnerType {
  name: string;
  address: string;
}
export interface InviteGangType {
  name: string;
  address: string;
}
