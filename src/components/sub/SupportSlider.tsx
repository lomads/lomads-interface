import React from 'react'
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Tooltip,
  } from '@chakra-ui/react'
function SliderThumbWithTooltip() {
    const [sliderValue, setSliderValue] = React.useState(5)
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
        onChange={(v) => setSliderValue(v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderMark value={10} mt='1' ml='-2.5' fontSize='sm'>
          10
        </SliderMark>
        <SliderMark value={20} mt='1' ml='-2.5' fontSize='sm'>
          20
        </SliderMark>
        <SliderMark value={30} mt='1' ml='-2.5' fontSize='sm'>
          30
        </SliderMark>
        <SliderMark value={40} mt='1' ml='-2.5' fontSize='sm'>
          40
        </SliderMark>
        <SliderMark value={50} mt='1' ml='-2.5' fontSize='sm'>
          50
        </SliderMark>
        <SliderMark value={60} mt='1' ml='-2.5' fontSize='sm'>
          60
        </SliderMark>
        <SliderMark value={70} mt='1' ml='-2.5' fontSize='sm'>
          70
        </SliderMark>
        <SliderMark value={80} mt='1' ml='-2.5' fontSize='sm'>
          80
        </SliderMark>
        <SliderMark value={90} mt='1' ml='-2.5' fontSize='sm'>
          90
        </SliderMark>
        <SliderMark value={100} mt='1' ml='-2.5' fontSize='sm'>
          100
        </SliderMark>
        <SliderTrack bg='red.100'>
          <SliderFilledTrack bg='#C94B32'/>
        </SliderTrack>
        <Tooltip
          hasArrow
          bg='#C94B32'
          color='white'
          placement='top'
          isOpen={showTooltip}
          label={`${sliderValue}`}
        >
        <SliderThumb/>
        </Tooltip>
      </Slider>
      <div className='ml-10 font-sans font-semibold text-text_color text-sm'>
        {sliderValue}
      </div>
      </div>
      </>
    )
  }

export default SliderThumbWithTooltip