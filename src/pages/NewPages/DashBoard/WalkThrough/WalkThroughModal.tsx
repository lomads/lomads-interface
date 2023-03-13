import React from "react";
import BasicModal from '../../../../muiComponents/Modal'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CloseBtn from '../../../../assets/svg/close-btn.svg';
import WalkThroughStart from '../../../../assets/svg/step_0_walkthrough.svg'
import Typography from '@mui/material/Typography';
import './WalkThrough.css'

export default function WalkThrough({
  showConfirmation,
  incrementWalkThroughSteps,
  endWalkThrough,
  obj,
}: {
  showConfirmation: boolean,
  incrementWalkThroughSteps: any,
  endWalkThrough: any,
  obj: any
}) {
  return (
    <BasicModal
        isOpen={showConfirmation}
        key={showConfirmation.toString() + Math.random() + 'walkThrough'}
        closeModal={endWalkThrough}
       >
      <div className="confirm-walkthrough">
        <div className="close-btn" onClick={endWalkThrough}>
          <img src={CloseBtn} />
        </div>
        <img src={WalkThroughStart} />
        <Typography id="modal-modal-title">
         {obj.title}
        </Typography>
        <p className="text-content" dangerouslySetInnerHTML={{ __html: obj?.content }} />
        <Stack spacing={2} direction="row">
          <Button
            variant="outlined"
            onClick={endWalkThrough}
            size="small">
            Later Thanks!
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={incrementWalkThroughSteps}
          >
            Let's Go
          </Button>
        </Stack>
      </div>
    </BasicModal>
  );
}