// @ts-nocheck
import React, { useRef, useCallback, useEffect, useState } from "react";
import { read, utils, writeFileXLSX } from 'xlsx';
import uploadIcon from 'assets/svg/uploadIcon.svg';
import IconButton from "muiComponents/IconButton";

const ToolTopContainer = React.forwardRef(({ children, ...rest }: any, ref) => (
  <div className="uploadBtn" ref={ref} {...rest}>
    {children}
  </div>
))


export default ({ onComplete, ...props }: any) => {

  const hiddenFileInput = useRef(null);

  const handleUpload = async (f : any) => {
    const d = await f.arrayBuffer();
    let wb = read(d);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = utils.sheet_to_json(ws);
    onComplete(data)
  }

  const handleClick = () => {
    if(hiddenFileInput?.current) {
      hiddenFileInput?.current?.click()
    }
  };

  const handleChange = (event: any) => {
    event.preventDefault();
    const fileUploaded = event.target.files[0];
    event.target.value = ''
    handleUpload(fileUploaded);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <img style={{ height: 18 }} src={uploadIcon} alt="uploadIcon" />
      </IconButton> 
      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} />
    </>
  );
}