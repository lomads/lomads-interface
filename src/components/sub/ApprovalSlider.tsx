import React from 'react'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from '@chakra-ui/react'
import { useAppSelector, useAppDispatch } from 'state/hooks'
import { updateMinApproval } from 'state/proposal/reducer'

function ApprovalSliderThumbWithTooltip() {
  const dispatch = useAppDispatch()
  const minApproval = useAppSelector((state) => state.proposal.minApproval)
  const [showTooltip, setShowTooltip] = React.useState(false)
  return (
    <>
      <div className='flex flex-row justify-between items-center w-full'>
        <Slider
          id='slider'
          defaultValue={minApproval}
          min={0}
          max={100}
          colorScheme='teal'
          onChange={(v) => dispatch(updateMinApproval(v))}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <SliderTrack bg='red.100'>
            <SliderFilledTrack bg='#C94B32' />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg='#C94B32'
            color='white'
            placement='top'
            isOpen={showTooltip}
            label={`${minApproval}`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
        <div className='ml-10 font-sans font-semibold text-text_color text-sm'>
          {minApproval}%
        </div>
      </div>
    </>
  )
}

export default ApprovalSliderThumbWithTooltip