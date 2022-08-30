import { SyntheticEvent, useCallback, useState } from "react";

import { Container } from "@chakra-ui/react";

import ChakraTagInput from "../components/ChakraTagInput";
import { updateTags } from "state/proposal/reducer";
import { useAppSelector, useAppDispatch } from "state/hooks";

export default function KeywordTag() {
  const dispatch = useAppDispatch();
  const tags = useAppSelector((state) => state.proposal.tags);
  const handleTagsChange = useCallback(
    (event: SyntheticEvent, tags: string[]) => {
      dispatch(updateTags(tags));
    },
    []
  );
  return (
    <Container>
      <ChakraTagInput tags={tags} onTagsChange={handleTagsChange} />
    </Container>
  );
}
