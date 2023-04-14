import stepOneWalkthrough from '../../../../assets/svg/step_1_walkthrough.svg'
import stepTwoWalkthrough from '../../../../assets/svg/step_2_walkthrough.svg'
import stepThreeWalkthrough from '../../../../assets/svg/step_3_walkthrough.svg'
import stepFourWalkthrough from '../../../../assets/svg/step_4_walkthrough.svg'
import stepFiveWalkthrough from '../../../../assets/svg/step_5_walkthrough.svg'
import stepSixWalkthrough from '../../../../assets/svg/step_6_walkthrough.svg'
import stepSevenWalkthrough from '../../../../assets/svg/step_7_walkthrough.svg'

const steps = (role) => [
   ...[ role === 'role1' ||  role === 'role2' ? {
      step: 0,
      id: 'walkthrough-modal',
      title: 'Welcome to your Lomads Dashboard!',
      content: 'We’re excited to have you here, and would love<br /> to walk you through all of our <b>key features!</b>',
      buttonText: "LET'S GO",
      buttonText2: 'LATER THANKS!',
      imgPath: stepOneWalkthrough,
      placement: 'top'
   } : {
      step: 0,
      id: 'walkthrough-modal',
      title: 'Welcome to your Lomads Dashboard!',
      content: 'Lomads helps contributors and active contributors:<br/>find work that is relevant for you, keep track of earnings, unlock benefits through consistent contribution.',
      buttonText: "LET'S GO",
      buttonText2: 'LATER THANKS!',
      imgPath: stepOneWalkthrough,
      placement: 'top'
   }],
   {
    step: 1,
    id: 'my-workspace',
    title: 'Create Workspaces',
    content: 'Here, you can create <b>customized workspaces</b> <br /> for all of your teams, <b>manage milestones,</b> <br /> and <b>track key results.</b>',
    buttonText: 'NEXT',
    imgPath: stepOneWalkthrough,
    placement: 'top-end'
  },
  {
    step: 2,
    id: 'my-task',
    title: 'Create Tasks',
    content: 'By creating tasks, you can <b>track progress,</b><br /> <b>deadlines,</b> and <b>rewards on bounties,</b> and <b>assign contributors</b> to each task.',
    buttonText: 'NEXT',
    imgPath: stepTwoWalkthrough,
    placement: 'top-end'
  },
  {
    step: 3,
    id: 'treasury-management',
    title: 'Treasury Management',
    content: 'Managing and automating your treasury has <br />never been easier! Here you can approve and <br /><b>send token payments</b> manually, or <b>set up <br />recurring payments</b> to team members!',
    imgPath: stepThreeWalkthrough,
    buttonText: 'NEXT',
    placement: 'top-end'
  },
  {
    step: 4,
    id: 'treasury-management',
    title: 'Bootstrapping?',
    content: 'Turn on <b>SWEAT points</b> in settings to track <br />contributions for future rewards.',
    imgPath: stepFourWalkthrough,
    buttonText: 'NEXT',
    placement: 'top-end'
  },
  {
    step: 5,
    id: 'members',
    title: 'Members',
    content: '<b>Add new members</b> <br />and <b>manage details and roles </b> of existing <br />members.',
    imgPath: stepFiveWalkthrough,
    buttonText: 'NEXT',
    placement: 'top-end'
  },
  {
    step: 6,
    id: 'global-settings',
    title: 'Global settings',
    content: 'Customize your Dashboard with settings: <b>edit <br />organization details,</b> manage <b>treasury signatories,<br /> launch <b>pass tokens,</b> enable <b>SWEAT points,</b> and <br />personalize terminologies. Explore now!',
    imgPath: stepSixWalkthrough,
    buttonText: 'NEXT',
    placement: 'left-start'
  },
  {
    step: 7,
    id: 'question-mark',
    title: 'Well done!',
    content: 'If you need any help or tips,<br /> you will find it here.',
    imgPath: stepSevenWalkthrough,
    buttonText: 'END',
    placement: 'top'
  }
]

export default steps;