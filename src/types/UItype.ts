export interface InputFieldType {
  isInvalid?: any;
  id?: string;
  className?: string;
  height?: number | string;
  width?: number | string;
  name?: string;
  onKeyDown?: any;
  disabled?:any;
  value?: string | number;
  placeholder?: string;
  onchange?: (e: any) => void;
  type?: string;
  onBlur?: any;
}

export interface ButtonType {
  title: string;
  onClick?: (e?: any) => void;
  height?: number | string;
  width?: number | string;
  fontsize?: number;
  fontweight?: number;
  bgColor?: string;
  className?: string;
  shadow?: string;
  disabled?: boolean | undefined;
}

export interface IconButtonType {
  onClick?: (e?: any) => void;
  height?: number;
  width?: number;
  fontsize?: number;
  fontweight?: number;
  disabled?:boolean;
  Icon: any;
  bgColor?: string;
  className?: string;
  border?: string;
}
export interface SafeButtonType extends ButtonType {
  bgColor: string;
  titleColor: string;
  disabled: boolean;
  opacity?: string;
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
export interface LoadingButtonType extends ButtonType {
  condition: boolean;
}
export interface OutlineButtonType extends ButtonType {
  borderColor: string;
}

export interface MemberType {
  _id?: string;
  wallet: string | null;
  name: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface RoleType {
  _id?: string;
  member?: MemberType | null;
  role?: string | null;
}

export interface SafeType {
  _id: string;
  name: string;
  address?: string | null;
  token?: string | null;
  balance?: number | string;
  transactions?: any | null;
  dao?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  owners?: Array<MemberType>;
}

export interface DAOType {
  _id?: string;
  sbt: any;
  contractAddress?: string;
  name?: string;
  url?: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  members?: Array<RoleType> | [];
  safe?: SafeType
}
