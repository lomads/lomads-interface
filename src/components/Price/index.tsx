import { Flex, Img, Text, Icon, Input } from "@chakra-ui/react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import MATIC from "../../assets/svg/price-matic.svg";
import USDC from "../../assets/svg/price-usdc.svg";
import "./styles.css";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDollar, AiOutlineEuro } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";

export default function Price({
  selectedAsset,
  setselectedAsset,
  price,
  setPrice,
}: {
  selectedAsset: string;
  setselectedAsset: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [dropdownOpen, setdropdownOpen] = useState(false);
  // const [selectedAsset, setSelectedAsset] = useState("SELECT");
  const [selectedImage, setSelectedImage] = useState<
    { img: boolean; value: any } | undefined
  >();
  const [value, setValue] = useState(0);
  const ref = useRef<any>(null);

  useEffect(() => {
    function handleClick(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log("clicked");
        setdropdownOpen(false);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref]);

  const assets: any = [
    {
      icon: SiEthereum,
      label: "ETH",
    },
    {
      img: MATIC,
      label: "MATIC",
    },
    {
      icon: AiOutlineDollar,
      label: "USD",
    },
    {
      icon: AiOutlineEuro,
      label: "EUR",
    },
    {
      img: USDC,
      label: "USDC",
    },
  ];
  return (
    <Flex h='30px !important'>
      <Flex flexDirection={"column"}>
        <Flex
          ref={ref}
          borderLeftRadius='6px'
          cursor={"pointer"}
          h='30px !important'
          w='100px !important'
          border='1px solid #F5F5F5'
          justifyContent={"center"}
          onClick={() => setdropdownOpen(!dropdownOpen)}
        >
          {selectedImage && selectedImage?.img ? (
            <Img w='24px' h='24px' src={selectedImage.value} />
          ) : selectedImage && selectedImage.img === false ? (
            <Icon
              mr={1}
              color='#B94733'
              w='24px'
              h='24px'
              as={selectedImage?.value}
            />
          ) : null}
          <Text color='#B94733 !important' mt={3}>
            {selectedAsset}
          </Text>
          <Icon color='#B94733' as={BiChevronDown} />
        </Flex>
        <Flex
          mt={10}
          cursor='pointer'
          display={dropdownOpen ? "block" : "none !important"}
          w='100px !important'
          border='1px solid #F5F5F5'
          flexDirection={"column"}
          position={"absolute"}
          bgColor={"white"}
        >
          {assets.map((value: any) => (
            <Flex
              _hover={{ bgColor: "#eee" }}
              onClick={() => {
                if (value.img) {
                  setselectedAsset(value.label);
                  setSelectedImage({ img: true, value: value.img });
                } else {
                  setselectedAsset(value.label);
                  setSelectedImage({ img: false, value: value.icon });
                }
              }}
              px={2}
              alignItems={"center"}
              cursor='pointer'
            >
              {value.img ? (
                <Img w='24px' h='24px' src={value.img} />
              ) : (
                <Icon
                  mr={1}
                  color='#B94733'
                  w='24px'
                  h='24px'
                  as={value.icon}
                />
              )}
              <Text mt={3}>{value.label}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex>
        <Input
          value={price}
          onChange={(e) => {
            const regex = /^\d+(\.\d+)?$/;

            if (regex.test(e.target.value) || e.target.value === "") {
              setPrice(e.target.value);
            }
          }}
          borderRadius={0}
          color='#ccc'
          bgColor='#F5F5F5'
          w='60px !important'
          h='30px !important'
          maxW='80px !important'
          type={"number"}
          textAlign='center'
          px={0}
          _active={{
            border: "none !important",
          }}
          _focus={{
            border: "none !important",
            borderColor: "none",
          }}
        />
        <Flex
          border='1px solid #F5F5F5'
          w='30px !important'
          h='30px !important'
          flexDirection={"column"}
          justifyContent='center'
          alignItems={"flex-start"}
          borderRightRadius='6px'
          py={4}
        >
          <Icon
            onClick={() => setValue(value ? value + 1 : 1)}
            color='#B94733'
            cursor={"pointer"}
            as={BiChevronUp}
          />
          <Icon
            onClick={() => {
              if (value !== 0) {
                setValue(value - 1);
              }
            }}
            color='#B94733'
            cursor={"pointer"}
            as={BiChevronDown}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
