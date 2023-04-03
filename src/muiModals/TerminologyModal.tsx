import { useState, useEffect, useMemo, useRef } from "react";
import {
  find as _find,
  get as _get,
  debounce as _debounce,
  set as _set,
} from "lodash";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import OD from "../assets/images/drawer-icons/Frameterminology.svg";
import editIcon from "assets/svg/editButton.svg";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { updateDao } from "state/dashboard/actions";
import { resetUpdateDAOLoader, setTask } from "state/dashboard/reducer";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import {
  TASK_OPTIONS,
  WORKSPACE_OPTIONS,
  DEFAULT_ROLES,
} from "../constants/terminology";
import { Box, Drawer, Typography } from "@mui/material";
import React from "react";
import Button from "muiComponents/Button";
import { makeStyles } from "@mui/styles";
import { default as MuiIconButton } from "muiComponents/IconButton";
import CloseSVG from "assets/svg/close-new.svg";
import palette from "muiTheme/palette";
import { BsTypeH1 } from "react-icons/bs";
import TextInput from "muiComponents/TextInput";

const useStyles = makeStyles((theme: any) => ({
  terminologyBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    padding: "50px 0px",
  },
  terminologyHeading: {
    color: palette.primary.main,
    fontSize: "30px",
    fontWeight: 400,
    marginBottom: "10px",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "37px",
  },
  terminologyText: {
    fontFamily: " 'Inter',sans-serif",
    fontWeight: "400",
    fontSize: "16px",
    color: "#76808d",
    textAlign: "center",
    lineHeight: "20px",
  },
  section1: {
    display: "flex",
    flexDirection: "column",
    margin: "35px 0",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "320px",
  },
  divider: {
    width: "210px",
    border: "1px solid #c94b32",
  },
  footer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  section2: {
    display: "flex",
    flexDirection: "column",
    margin: "35px 0",
    width: "320px",
  },
  heading: {
    fontWeight: "700",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
  },
  container: {
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "400",
    fontStyle: "italic",
    fontSize: "16px",
  },
}));

export default ({ open, onClose }: { open: boolean; onClose: any }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { DAO, updateDaoLoading } = useAppSelector((state) => state.dashboard);
  const [showEdit, setShowEdit] = useState(false);

  const [workspaceTerminology, setWorkspaceTerminology] = useState("WORKSPACE");
  const [taskTerminology, setTaskTerminology] = useState("TASK");
  const [roles, setRoles] = useState(DEFAULT_ROLES);

  useEffect(() => {
    if (updateDaoLoading === false) {
      dispatch(resetUpdateDAOLoader());
      setShowEdit(false);
    }
  }, [updateDaoLoading]);

  useEffect(() => {
    if (DAO?.terminologies) {
      setWorkspaceTerminology(_get(DAO, "terminologies.workspace.value"));
      setTaskTerminology(_get(DAO, "terminologies.task.value"));
      setRoles(_get(DAO, "terminologies.roles"));
    }
  }, [DAO?.terminologies]);

  const handleChange = (e: any) => {
    setRoles((prev) => {
      return {
        ...prev,
        [e.target.name]: {
          ..._get(prev, e.target.name),
          label: e.target.value && e.target.value !== "" ? e.target.value : "",
        },
      };
    });
  };

  const handleSubmit = () => {
    let r = {};
    Object.keys(roles).map((key) => {
      const role = _get(roles, key);
      const rv = {
        ...role,
        label:
          role.label && role.label !== ""
            ? role.label.trim().replace(/ +(?= )/g, "")
            : _get(DEFAULT_ROLES, key).label,
        value:
          role.label && role.label !== ""
            ? role.label
                .trim()
                .toUpperCase()
                .split(" ")
                .join("_")
                .replace(/ +(?= )/g, "")
                .replace(/[^a-zA-Z0-9_]/g, "")
            : _get(DEFAULT_ROLES, key).value,
      };
      _set(r, key, rv);
    });
    const terminologies = {
      workspace: _find(
        WORKSPACE_OPTIONS,
        (wo) => wo.value === workspaceTerminology
      ),
      task: _find(TASK_OPTIONS, (to) => to.value === taskTerminology),
      roles: r,
    };
    //console.log("terminologies", terminologies)
    dispatch(
      updateDao({ url: _get(DAO, "url", ""), payload: { terminologies } })
    );
  };
  return (
    <Drawer
      PaperProps={{
        style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
      }}
      sx={{ zIndex: 100000 }}
      anchor={"right"}
      open={open}
      onClose={() => onClose()}
    >
      <Box
        sx={{ width: 575, flex: 1, borderRadius: "20px 0px 0px 20px" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <MuiIconButton
          sx={{
            position: "fixed",
            right: "23px",
            top: "36px",
            borderRadius: "0px !important",
          }}
          onClick={() => onClose()}
        >
          <img src={CloseSVG} style={{ width: "15px", height: "15px" }} />
        </MuiIconButton>
        <Box className={classes.terminologyBody}>
          <img src={OD} />
          <Typography className={classes.terminologyHeading}>
            Terminology
          </Typography>
          <p className={classes.terminologyText}>
            Make it yours. Customize the terminology for
            <br /> everything in your organization's space.
          </p>
          {!showEdit ? (
            <>
              <Box className={classes.section1}>
                <Typography
                  sx={{
                    fontWeight: "700",
                    fontSize: "16px",
                    marginBottom: "9px",
                  }}
                >
                  Workspaces :
                  <span className={classes.text}>
                    {
                      _find(
                        WORKSPACE_OPTIONS,
                        (wo) => wo.value === workspaceTerminology
                      )?.labelPlural
                    }
                  </span>
                </Typography>
                <Typography sx={{ fontWeight: "700", fontSize: "16px" }}>
                  Tasks :
                  <span className={classes.text}>
                    {
                      _find(TASK_OPTIONS, (wo) => wo.value === taskTerminology)
                        ?.labelPlural
                    }
                  </span>
                </Typography>
              </Box>
              <Box className={classes.divider}></Box>
              <Box className={classes.section2}>
                {Object.keys(roles).map((key) => {
                  return (
                    <>
                      <Typography
                        sx={{
                          fontWeight: "700",
                          fontSize: "16px",
                          marginBottom: "11px",
                        }}
                      >
                        {key} :{" "}
                        <span
                          style={{
                            fontWeight: "400",
                            fontStyle: "italic",
                            fontSize: "16px",
                          }}
                        >
                          {_get(roles, `${key}.label`)}
                        </span>
                      </Typography>
                    </>
                  );
                })}
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "35px 0",
                  width: "390px",
                }}
              >
                <Box className={classes.container}>
                  <Typography className={classes.heading}>
                    Workspaces
                  </Typography>
                  <select
                    name="workspace"
                    className="tokenDropdown"
                    id="workspace"
                    value={workspaceTerminology}
                    style={{ width: "200px", margin: "0" }}
                    onChange={(e) => setWorkspaceTerminology(e.target.value)}
                  >
                    {WORKSPACE_OPTIONS.map((option) => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.labelPlural}
                        </option>
                      );
                    })}
                  </select>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography className={classes.heading}>Tasks</Typography>
                  <select
                    name="task"
                    id="Tasks"
                    className="tokenDropdown"
                    value={taskTerminology}
                    style={{ width: "200px", margin: "0" }}
                    onChange={(e) => setTaskTerminology(e.target.value)}
                  >
                    {TASK_OPTIONS.map((option) => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.labelPlural}
                        </option>
                      );
                    })}
                  </select>
                </Box>
              </Box>
              <Box className={classes.divider}></Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "35px 0 45px 0",
                  width: "390px",
                }}
              >
                <Box className={classes.container}>
                  <Typography className={classes.heading}>Admin</Typography>
                  <TextInput
                    placeholder="Admin"
                    name="role1"
                    value={_get(roles, "role1.label")}
                    onChange={handleChange}
                  />
                </Box>

                <Box className={classes.container}>
                  <Typography className={classes.heading}>
                    Core Contributor
                  </Typography>
                  <TextInput
                    placeholder="Admin"
                    name="role2"
                    value={_get(roles, "role2.label")}
                    onChange={handleChange}
                  />
                </Box>

                <Box className={classes.container}>
                  <Typography className={classes.heading}>
                    Active Contributor
                  </Typography>
                  <TextInput
                    placeholder="Admin"
                    name="role3"
                    value={_get(roles, "role3.label")}
                    onChange={handleChange}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography className={classes.heading}>
                    Contributor
                  </Typography>
                  <TextInput
                    width="270px"
                    placeholder="Admin"
                    name="role4"
                    value={_get(roles, "role4.label")}
                    onChange={handleChange}
                  />
                </Box>
              </Box>
            </>
          )}

          {showEdit ? (
            <Box className={classes.footer}>
              <Button
                onClick={() => setShowEdit(false)}
                variant="outlined"
                size="small"
                sx={{ width: "129px", marginRight: "20px" }}
              >
                CANCEL
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                size="small"
                sx={{ width: "184px", padding: "0px" }}
                loading={updateDaoLoading}
              >
                SAVE CHANGES
              </Button>
            </Box>
          ) : (
            <Box className={classes.footer}>
              <Button
                onClick={() => setShowEdit(true)}
                variant="outlined"
                size="small"
              >
                EDIT
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
