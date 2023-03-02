import React from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseBtn from '../../../../assets/svg/close-btn.svg';
import BasicModal from '../../../../muiComponents/Modal'
import './WalkThrough.css'

type tooltipObj = {
  step: number;
  id: string;
  title: string;
  content: string;
  imgPath: string;
  buttonText: string;
}

export default function WalkThroughTooltip({
  displayTooltip,
  obj,
  incrementWalkThroughSteps,
  endWalkThrough,
}: {
  displayTooltip: boolean,
  obj: tooltipObj,
  incrementWalkThroughSteps: any,
  endWalkThrough: any,
}) {
  return (
    <BasicModal isOpen={displayTooltip} key={displayTooltip.toString() + Math.random() + 'walkThrough'}>
          <div className="tooltip" style={{top: '5%', right: '3%'}}>
          <div className="tooltip-left">
            <img src={obj?.imgPath} />  
          </div>
          <div className="tooltip-right">
            <Typography id="modal-modal-title" variant="h4" component="h2">
              {obj?.title}
            </Typography>
            <p>{obj?.content}</p>
            <Button
              variant="contained"
              onClick={incrementWalkThroughSteps}
              size="small">
              {obj?.buttonText}
            </Button>
          </div>
          <div className="close-btn" onClick={endWalkThrough}>
            <img src={CloseBtn} />
          </div>
          </div>
        </BasicModal>
  );
}