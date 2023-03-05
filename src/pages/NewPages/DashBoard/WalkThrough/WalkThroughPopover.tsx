import React, { useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CloseBtn from '../../../../assets/svg/close-btn.svg';
import Button from '@mui/material/Button';
import './WalkThrough.css'

type originObj = {
  vertical: number | "top" | "center" | "bottom";
  horizontal: number | "center" | "left" | "right";
}
type tooltipObj = {
  step: number;
  id: string;
  title: string;
  content: string;
  imgPath: string;
  buttonText: string;
  origin: originObj;
}

export default function WalkThroughPopover({
  displayPopover,
  obj,
  incrementWalkThroughSteps,
  endWalkThrough,
  anchorEl
}: {
  displayPopover: boolean,
  obj: tooltipObj,
  incrementWalkThroughSteps: any,
  endWalkThrough: any,
  anchorEl: any
}) {
  console.log(anchorEl, '...anchor el.in popover.', obj)
  return (
    <Popover
       id={obj?.id}
      open={displayPopover}
      anchorOrigin={obj?.origin}
      anchorEl={anchorEl}
    >
      <div className="tooltip" style={{ top: '5%', right: '3%' }}>
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
    </Popover>
  );
}