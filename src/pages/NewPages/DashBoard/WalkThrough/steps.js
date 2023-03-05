import stepOneWalkthrough from '../../../../assets/svg/step_1_walkthrough.svg'
import stepTwoWalkthrough from '../../../../assets/svg/step_2_walkthrough.svg'
import stepThreeWalkthrough from '../../../../assets/svg/step_3_walkthrough.svg'
import stepFourWalkthrough from '../../../../assets/svg/step_4_walkthrough.svg'
import stepFiveWalkthrough from '../../../../assets/svg/step_5_walkthrough.svg'
import stepSixWalkthrough from '../../../../assets/svg/step_6_walkthrough.svg'
import stepSevenWalkthrough from '../../../../assets/svg/step_7_walkthrough.svg'

const steps = [{
      step: 0,
      id: 'walkthrough-modal',
      title: 'Welcome to your Lomads Dashboard!',
      content: 'We’re excited to have you here, and would love to walk you through all of our key features!',
      buttonText: "LET'S GO",
      buttonText2: 'LATER THANKS!',
      imgPath: stepOneWalkthrough,
   },{
    step: 1,
    id: 'my-workspace',
    title: 'Create Workspaces',
    content: 'Here, you can create customized workspaces for all of your teams, manage milestones, and track key results.',
    buttonText: '1/7  NEXT',
    imgPath: stepOneWalkthrough,
  },
  {
    step: 2,
    id: 'my-task',
    title: 'Create Tasks',
    content: 'By creating tasks, you can track progress, deadlines, and rewards on bounties, and assign contributors to each task.',
    buttonText: '2/7 NEXT',
    imgPath: stepTwoWalkthrough,
   
  },
  {
    step: 3,
    id: 'treasury-management',
    title: 'Treasury Management',
    content: 'Managing and automating your treasury has never been easier! Here you can approve and send token payments manually, or set up recurring payments to team members!',
    imgPath: stepThreeWalkthrough,
    buttonText: '3/7 NEXT',
   
  },
  {
    step: 4,
    id: 'treasury-management',
    title: 'Bootstrapping?',
    content: 'Turn on SWEAT points in settings to track contributions for future rewards.',
    imgPath: stepFourWalkthrough,
    buttonText: '4/7 NEXT',
   
  },
  {
    step: 5,
    id: 'members',
    title: 'Members',
    content: 'Add new members and manage details and roles of existing members.',
    imgPath: stepFiveWalkthrough,
    buttonText: '5/7 NEXT',
   
  },
  {
    step: 6,
    id: 'global-settings',
    title: 'Global settings',
    content: 'Customize your Dashboard with settings: edit organization details, manage treasury signatories, launch pass tokens, enable SWEAT points, and personalize terminologies. Explore now!',
    imgPath: stepSixWalkthrough,
    buttonText: '6/7 NEXT'
  },
  {
    step: 7,
    id: 'question-mark',
    title: 'Well done!',
    content: 'If you need any help or tips, you will find it here.',
    imgPath: stepSevenWalkthrough,
    buttonText: 'END'
  }
]

export default steps;