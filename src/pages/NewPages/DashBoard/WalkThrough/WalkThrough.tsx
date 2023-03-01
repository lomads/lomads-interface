import React, { useState } from "react";
import BasicModal from '../../../../muiComponents/Modal'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CloseBtn from '../../../../assets/svg/close-btn.svg';
import WalkThroughStart from '../../../../assets/svg/step_0_walkthrough.svg'
import Typography from '@mui/material/Typography';
import './WalkThrough.css'

export default function WalkThrough({beginWalkThrough}: {beginWalkThrough: any}) {

  const [showWalkThrough, setShowWalkthrough] = useState<boolean>(true);
  const closeWalkthrough = () =>  setShowWalkthrough(false)
  const beginWalkThroughStep = () => {
    beginWalkThrough()
    setShowWalkthrough(false)
  }
  
  let steps = [{
    step: 1,
    id: 'my-workspace',
    title: 'Create Workspaces',
    content: 'Here, you can create customized workspaces for all of your teams, manage milestones, and track key results.',
    buttonText: '1/7  NEXT',
    imgPath: '.../'
  },
  {
    step: 2,
    id: 'my-task',
    title: 'Create Tasks',
    content: 'By creating tasks, you can track progress, deadlines, and rewards on bounties, and assign contributors to each task.',
    imgPath: '../../',
    buttonText: '2/7 NEXT'
  },
  {
    step: 3,
    id: 'treasury-management',
    title: 'Treasury Management',
    content: 'Managing and automating your treasury has never been easier! Here you can approve and send token payments manually, or set up recurring payments to team members!',
    imgPath: '../../',
    buttonText: '3/7 NEXT'
  },
  {
    step: 4,
    id: 'bootstrapping',
    title: 'Bootstrapping?',
    content: 'Turn on SWEAT points in settings to track contributions for future rewards.',
    imgPath: '../../',
    buttonText: '4/7 NEXT'
  },
  {
    step: 5,
    id: 'members',
    title: 'Members',
    content: 'Add new members and manage details and roles of existing members.',
    imgPath: '../../',
    buttonText: '5/7 NEXT',
  },
  {
    step: 6,
    id: 'global-settings',
    title: 'Global settings',
    content: 'Customize your Dashboard with settings: edit organization details, manage treasury signatories, launch pass tokens, enable SWEAT points, and personalize terminologies. Explore now!',
    imgPath: '../../',
    buttonText: '6/7 NEXT',
  },
  {
    step: 7,
    id: 'question-mark',
    title: 'Well done!',
    content: 'If you need any help or tips, you will find it here.',
    imgPath: '../../',
    buttonText: 'END'
  }
]
  return (
      <BasicModal isOpen={showWalkThrough} key={showWalkThrough.toString() + Math.random()}>
        <div className="confirm-walkthrough">
          <div className="close-btn" onClick={closeWalkthrough}>
          <img src={CloseBtn} />
          </div>
        <img src={WalkThroughStart} />
        <Typography id="modal-modal-title" variant="h4" component="h2">
             Welcome to your Lomads Dashboard!
        </Typography>
        <p>We’re excited to have you here, and would love <br/>
          to walk you through all of our key features!</p>
        <Stack spacing={2} direction="row">
          <Button 
              variant="outlined" 
              onClick={closeWalkthrough}
              size="small">
                Later Thanks!
          </Button>
          <Button 
             variant="contained"
             size="small"
             onClick={beginWalkThroughStep}
             >
               Let's Go
          </Button>
        </Stack>
        </div>
      </BasicModal>
  );
}