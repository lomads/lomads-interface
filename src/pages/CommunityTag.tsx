import React, { SyntheticEvent, useCallback, useState } from "react";

import { Container } from "@chakra-ui/react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import ChakraTagInput from "../components/ChakraTagInput";
import { updateCommunityTags } from "state/proposal/reducer";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { isValidUrl } from "utils";

export default function CommunityTag() {
  const dispatch = useAppDispatch();
  const communityTags = useAppSelector((state) => state.proposal.communityTags);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleTagsChange = useCallback(
    (event: SyntheticEvent, tags: string[]) => {
      const filteredTags = tags.filter((tag) => {
        if (isValidUrl(tag)) {
          setIsInvalid(false);
          return true;
        } else {
          setIsInvalid(true);
          return false;
        }
      });
      dispatch(updateCommunityTags(filteredTags));
    },
    [dispatch]
  );

  return (
    <FormControl isInvalid={isInvalid}>
      {isInvalid && !!communityTags && (
        <FormErrorMessage style={{ marginBottom: 5, fontSize: "x-small" }}>
          * Valid http url is required.
        </FormErrorMessage>
      )}
      <Container>
        <ChakraTagInput tags={communityTags} onTagsChange={handleTagsChange} />
      </Container>
    </FormControl>
  );
}
