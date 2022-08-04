import { SyntheticEvent, useCallback, useState } from 'react'

import { Container } from '@chakra-ui/react'

import ChakraTagInput from '../components/ChakraTagInput'

export default function CommunityTag() {
  const [tags, setTags] = useState<Array<string>>([])
  const handleTagsChange = useCallback((event: SyntheticEvent, tags: string[]) => {
    setTags(tags)
  }, [])
  return (
      <Container>
        <ChakraTagInput tags={tags} onTagsChange={handleTagsChange}  />
      </Container>
     
  )
}
