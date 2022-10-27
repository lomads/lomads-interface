import React, { useRef, useCallback, useEffect, useState } from "react";
import { read, utils, writeFileXLSX } from 'xlsx';
import uploadIcon from '../../assets/svg/uploadIcon.svg';
import SimpleButton from "UIpack/SimpleButton";

export default ({ onComplete, ...props }) => {

  const hiddenFileInput = useRef(null);

  const handleUpload = async (f) => {
    const d = await f.arrayBuffer();
    let wb = read(d);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = utils.sheet_to_json(ws);
    onComplete(data)
  }

  const handleClick = () => {
    hiddenFileInput?.current?.click()
  };

  const handleChange = (event) => {
    event.preventDefault();
    const fileUploaded = event.target.files[0];
    event.target.value = ''
    handleUpload(fileUploaded);
  };

  return (
    <>
      <button className="uploadBtn" onClick={handleClick}>
        <img src={uploadIcon} alt="uploadIcon" />
        OR UPLOAD FILE
      </button>
      {/* <SimpleButton className="inviteButton" title="Upload" height={30} width={100} fontsize={14} fontweight={400} bgColor="#C94B32" onClick={handleClick} /> */}
      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} />
    </>
  );
}