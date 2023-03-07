import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import CloseBtn from '../../../../assets/svg/close-btn.svg';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import styled from "styled-components";
import './WalkThrough.css'

type tooltipObj = {
  step: number;
  id: string;
  title: string;
  content: string;
  imgPath: string;
  buttonText: string;
  placement: PopperPlacementType;
}
const StyledPopper = styled(Popper)`&&{
  
  z-index: 1;
  &[x-placement*="bottom"] .arrow{

    width: 0; 
    height: 0; 
    border-left: 1em solid transparent;
    border-right: 1em solid transparent;
    border-bottom: 1em solid #2c3e50;
    margin-top: -0.9em;
    
    &:before {
      border-width: '0 1em 1em 1em';
      border-color: 'transparent transparent white transparent';
    }
  }

  &[x-placement*="top"] .arrow{

    bottom: 0;
    width: 0; 
    height: 0; 
    border-left: 1em solid transparent;
    border-right: 1em solid transparent;
    border-top: 1em solid #2c3e50;
    margin-bottom: -0.9em;

    &:before {
      border-width: 1em 1em 0 1em;
      border-color: white transparent transparent transparent;
    }
  }

  &[x-placement*="right"] .arrow{

    left: 0;
    width: 0; 
    height: 0; 
    border-top: 1em solid transparent;
    border-bottom: 1em solid transparent;
    border-right: 1em solid #2c3e50;
    margin-left: -0.9em;

    &:before {
      border-width: 1em 1em 1em 0;
      border-color: transparent white transparent transparent;
    }
  }

  &[x-placement*="left"] .arrow{
    
    right: 0;
    width: 0; 
    height: 0; 
    border-top: 1em solid transparent;
    border-bottom: 1em solid transparent;
    border-left: 1em solid #2c3e50;
    margin-right: -0.9em;

    &:before {
      border-width: 1em 0 1em 1em;
      border-color: transparent transparent transparent white;
    }
  }

  .arrow {
    position: absolute;
    font-size: 7px;
    width: 3em;
    height: 3em;

    &:before {
      content: '""',
      margin: auto;
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
    }
  }
}`;

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
 const [arrowRef, setArrowRef] = useState<any>(null)
  return (
    <StyledPopper
      open={displayPopover}
      anchorEl={anchorEl}
      style={{ zIndex: '30', padding: 10 }}
      placement={obj?.placement}
      modifiers={[
        {
          name: 'flip',
          enabled: true,
          options: {
            altBoundary: true,
            rootBoundary: 'document',
            padding: 8,
          },
        },
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            rootBoundary: 'document',
            padding: 8,
          },
        },
        {
          name: 'arrow',
          enabled: false,
          options: {
            element: arrowRef,
          },
        },
      ]}
    >
      {
        true &&
        <span className="arrow" ref={setArrowRef} />
      }
      <Box>
        <div className="tooltip" style={{ top: '5%', right: '3%' }}>
          <div className="tooltip-left">
            <img src={obj?.imgPath} />
          </div>
          <div className="tooltip-right">
            <Typography className="popper-title" component="h2" variant="h4">
              {obj?.title}
            </Typography>
            <p className="text-content" dangerouslySetInnerHTML={{ __html: obj?.content }} />
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
      </Box>
    </StyledPopper>
  );
}