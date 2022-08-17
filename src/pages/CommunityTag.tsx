import { SyntheticEvent, useCallback, useState } from 'react'

import { Container } from '@chakra-ui/react'

import ChakraTagInput from '../components/ChakraTagInput'
import { updateCommunityTags } from 'state/proposal/reducer'
import { useAppSelector, useAppDispatch } from 'state/hooks'

export default function CommunityTag() {
  const dispatch = useAppDispatch()
  const communityTags = useAppSelector((state) => state.proposal.communityTags)
  const handleTagsChange = useCallback((event: SyntheticEvent, tags: string[]) => {
    dispatch(updateCommunityTags(tags))
  }, [])
  return (
    <Container>
      <ChakraTagInput tags={communityTags} onTagsChange={handleTagsChange} />
    </Container>
  )
}
