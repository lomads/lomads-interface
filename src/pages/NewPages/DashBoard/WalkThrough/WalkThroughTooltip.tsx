import React from "react";
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CloseBtn from '../../../../assets/svg/close-btn.svg';
import './WalkThrough.css'

type tooltipObj = {
  step: number;
  id: string;
  title: string;
  content: string;
  imgPath: string;
  buttonText: string;
}


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 650,
    maxHeight: 247,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    borderRadius: 10,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
}));

export default function WalkThroughTooltip({
  open,
  obj,
  moveToNextStep,
  endWalkThrough
}: {
  open: boolean,
  obj: tooltipObj,
  moveToNextStep: any,
  endWalkThrough: any
}) {
  console.log('...obj in card....', obj)

  return (
    <HtmlTooltip
      arrow
      disableHoverListener
      disableFocusListener
      open={open}
      onClose={endWalkThrough}
      key={obj?.step}
      title={
          <React.Fragment>
            <div className="tooltip-img">
              <img src={obj?.imgPath} />
            </div>
            <div className="tooltip-right">
              <Typography id="modal-modal-title" variant="h4" component="h2">
                {obj?.title}
              </Typography>
              <p>{obj?.content}</p>
              <Button
                variant="contained"
                onClick={moveToNextStep}
                size="small">
                {obj?.buttonText}
              </Button>
            </div>
            <div className="close-btn" onClick={endWalkThrough}>
              <img src={CloseBtn} />
            </div>
          </React.Fragment>
      }
    >
      <Button onClick={moveToNextStep}>HTML</Button>
    </HtmlTooltip>
  );
}