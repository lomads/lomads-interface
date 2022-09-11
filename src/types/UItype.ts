export interface InputFieldType {
  isInvalid: any;
  id: string;
  className: string;
  height: number;
  width: number;
  name: string;
  value: string | number;
  placeholder: string;
  onchange: (e: any) => void;
  type?: string;
}
