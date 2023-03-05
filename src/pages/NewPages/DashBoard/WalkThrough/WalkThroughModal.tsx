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
  beginWalkThrough,
  endWalkThrough
}: {
  showConfirmation: boolean,
  beginWalkThrough: any,
  endWalkThrough: any
}) {

  return (
    <BasicModal isOpen={showConfirmation} key={showConfirmation.toString() + Math.random() + 'walkThrough'}>
      <div className="confirm-walkthrough">
        <div className="close-btn" onClick={endWalkThrough}>
          <img src={CloseBtn} />
        </div>
        <img src={WalkThroughStart} />
        <Typography id="modal-modal-title" variant="h4" component="h2">
          Welcome to your Lomads Dashboard!
        </Typography>
        <p>We’re excited to have you here, and would love <br />
          to walk you through all of our key features!</p>
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
            onClick={beginWalkThrough}
          >
            Let's Go
          </Button>
        </Stack>
      </div>
    </BasicModal>
  );
}