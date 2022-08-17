import React from 'react'
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Tooltip,
  } from '@chakra-ui/react'
function ApprovalSliderThumbWithTooltip() {
    const [ApprovalSliderValue, setApprovalSliderValue] = React.useState(5)
    const [showTooltip, setShowTooltip] = React.useState(false)
    return (
      <>
      <div className='flex flex-row justify-between items-center w-full'>
      <Slider
        id='slider'
        defaultValue={5}
        min={0}
        max={100}
        colorScheme='teal'
        onChange={(v) => setApprovalSliderValue(v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack bg='red.100'>
          <SliderFilledTrack bg='#C94B32'/>
        </SliderTrack>
        <Tooltip
          hasArrow
          bg='#C94B32'
          color='white'
          placement='top'
          isOpen={showTooltip}
          label={`${ApprovalSliderValue}`}
        >
        <SliderThumb/>
        </Tooltip>
      </Slider>
      <div className='ml-10 font-sans font-semibold text-text_color text-sm'>
        {ApprovalSliderValue}%
      </div>
      </div>
      </>
    )
  }

export default ApprovalSliderThumbWithTooltip