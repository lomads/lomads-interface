import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import {
  Input,
  Textarea,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Oval } from "react-loader-spinner";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import { imageType } from "../types";
import { useAppDispatch } from "state/hooks";
import {
  updateTitle,
  updatePurpose,
  updateShortDesc,
  updateLongDesc,
  updateCoverImgPath,
  updateStepNumber,
} from "state/proposal/reducer";
import { useAppSelector } from "state/hooks";
import CommunityTag from "./CommunityTag";
import KeywordTag from "./KeywordTag";
import { fileUpload } from "../utils/ipfs";
import useStepRouter from "hooks/useStepRouter";

const BasicsPage = () => {
  useStepRouter(2);
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.proposal.title);
  const purpose = useAppSelector((state) => state.proposal.purpose);
  const shortDesc = useAppSelector((state) => state.proposal.shortDesc);
  const longDesc = useAppSelector((state) => state.proposal.longDesc);
  const [file, setFile] = useState(null);
  const [fileUploadFailed, setFileUploadFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!_.isEmpty(errors)) {
      const id = Object.keys(errors)[0];
      const element = document.getElementById(id);
      if (element) {
        element.focus();
        const rect = element.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.y - 60,
          behavior: "auto",
        });
      }
    }
  }, [errors]);

  async function handleUpload(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    setFile(files[0]);
    setLoading(true);
    try {
      const result: any = await fileUpload(files[0]);
      setFileUploadFailed(false);
      dispatch(updateCoverImgPath(result));
    } catch (e) {
      setFileUploadFailed(true);
      setFile(null);
    }
    setLoading(false);
  }

  function handleRemoveCover() {
    setFile(null);
    dispatch(updateCoverImgPath(""));
  }

  const handleClick = () => {
    let terrors: any = {};

    if (!title) {
      terrors.title = "* DAO title is required.";
    }

    if (!purpose) {
      terrors.purpose = "* DAO purpose is required.";
    }

    if (!shortDesc) {
      terrors.shortDesc = "* DAO short description is required.";
    }

    if (_.isEmpty(terrors)) {
      dispatch(updateStepNumber(3));
      navigate("/safe");
    } else {
      setErrors(terrors);
    }
  };

  const ImageThumb: React.FC<imageType> = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        width="300"
        height={"300"}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "100%",
        }}
      />
    );
  };
  return (
    <>
      <div
        className={"something"}
        style={{
          paddingLeft: 480,
          paddingTop: 100,
          paddingBottom: 100,
          height: 1600,
        }}
      >
        <div className={"pageTitle"}>Basics</div>
        <div className={"pageDescription"}>
          Name your project, upload an image, and set the details.
        </div>
        <div className={"titleBar"}>
          <div className={"titleTile"} style={{ width: 380 }}>
            <div className={"tileItemHeader"}>
              <div>Title</div>
              <div className={"rect2"}>
                <div className={"reqText"}>Required</div>
              </div>
            </div>
            <FormControl isInvalid={!title && errors.title}>
              <Input
                id="title"
                className={"inputField"}
                style={{ height: 40, width: 340 }}
                name="title"
                value={title}
                placeholder="Name your DAO"
                autoFocus={!title}
                onChange={(e) => {
                  dispatch(updateTitle(e.target.value));
                }}
              />
              {!title && errors.title && (
                <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
                  {errors.title}
                </FormErrorMessage>
              )}
            </FormControl>
          </div>
          <div className={"titleTile"} style={{ width: 280 }}>
            <div className={"tileItemHeader"}>
              <div>Purpose</div>
              <div className={"rect2"}>
                <div className={"reqText"}>Required</div>
              </div>
            </div>
            <FormControl isInvalid={!purpose && errors.purpose}>
              <Input
                id="purpose"
                className={"inputField"}
                style={{ height: 40, width: 240 }}
                name="purpose"
                value={purpose}
                placeholder="Choose Purpose"
                autoFocus={!!title && !purpose}
                onChange={(e) => {
                  dispatch(updatePurpose(e.target.value));
                }}
              />
              {!purpose && errors.purpose && (
                <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
                  {errors.purpose}
                </FormErrorMessage>
              )}
            </FormControl>
          </div>
        </div>
        <div className={"subItemHeader"}>
          <div>Short description</div>
          <div className={"rect2"}>
            <div className={"reqText"}>Required</div>
          </div>
        </div>
        <FormControl isInvalid={!shortDesc && errors.shortDesc}>
          <Textarea
            id="shortDesc"
            className={"shorttextField"}
            style={{ width: "500px", background: "#f5f5f5" }}
            name="shortDesc"
            value={shortDesc}
            placeholder="In a few words"
            autoFocus={!!title && !!purpose && !shortDesc}
            onChange={(e) => {
              dispatch(updateShortDesc(e.target.value));
            }}
          />
          {!shortDesc && errors.shortDesc && (
            <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
              {errors.shortDesc}
            </FormErrorMessage>
          )}
        </FormControl>
        <div className={"pageItemHeader"}>Long description</div>
        <textarea
          className={"textField"}
          name="longDesc"
          value={longDesc}
          style={{ height: 150 }}
          placeholder="Explain in detail"
          onChange={(e) => {
            dispatch(updateLongDesc(e.target.value));
          }}
        />
        <div className={"pageItemHeader"}>
          Cover image
          <div id="upload-box">
            {!loading && file && (
              <div id="upload-remove" onClick={handleRemoveCover} />
            )}
            {loading && (
              <Oval
                height={80}
                width={80}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            )}
            {!loading && !file && (
              <div>
                <div id="upload-file">
                  <button>
                    <input
                      type="file"
                      accept="Image/jpeg, Image/png, Image/apng, Image/jpg"
                      style={{ opacity: "0", position: "relative", zIndex: 2 }}
                      onChange={handleUpload}
                    />
                  </button>
                </div>
                {fileUploadFailed && (
                  <p style={{ margin: "10px 0 0 -10px" }}> Try again...</p>
                )}
              </div>
            )}
            {!loading && file && <ImageThumb image={file} />}
          </div>
        </div>
        <div className={"pageItemHeader"}>
          Tags
          <div className="mt-3 w-72">
            <KeywordTag />
          </div>
        </div>
        <div className={"pageItemHeader"}>
          Community links
          <div className="mt-3 w-72">
            <CommunityTag />
          </div>
        </div>
        <div>
          <button
            id="nextButtonBasics"
            className={"nextButton"}
            onClick={handleClick}
          >
            NEXT STEP
          </button>
        </div>
      </div>
    </>
  );
};

export default BasicsPage;
