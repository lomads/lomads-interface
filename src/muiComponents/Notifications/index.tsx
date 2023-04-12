import React, { useEffect, useState } from "react";
import { get as _get } from "lodash";
import PROJECT_ICON from "assets/svg/project-icon.svg";
import TASK_ICON from "assets/svg/taskicon.svg";
import USER_ICON from "assets/svg/user-icon.svg";
import TRANSACTION_ICON from "assets/svg/sendTokenOutline.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "state/hooks";
import axiosHttp from "api";
import { useWeb3React } from "@web3-react/core";
import { getCurrentUser } from "state/dashboard/actions";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { beautifyHexToken } from "utils";
import { Box } from "@mui/material";

const useStyles = makeStyles((theme: any) => ({
  notifications: {
    height: "328px",
    width: "100%",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "row",
  },
  my_notifications: {
    width: "60%",
    height: "100%",
    borderRadius: "5px",
    backgroundColor: "#f5f0f1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  list_container: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    padding: "8px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  notification_item: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "20px 22px",
    gap: "20px",
    width: "312.98px",
    background: "#FFFFFF",
    boxShadow:
      "3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)",
    borderRadius: "20px",
    flex: "none",
    order: 0,
    flexGrow: 0,
    margin: "6px 0",
  },
  title: {
    fontFamily: "'Inter', sans-serif",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#76808D",
    marginLeft: "12px",
    flex: 1,
    width: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  date: {
    fontFamily: "'Inter', sans-serif",
    fontStyle: "italic",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "25px",
    display: "flex",
    alignItems: "center",
    textAlign: "right",
    letterSpacing: "-0.011em",
    color: "rgba(118, 128, 141, 0.5)",
  },
  container_notification: {
    fontFamily: "'Inter', sans-serif",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "22px",
    lineHeight: "25px",
    letterSpacing: "-0.011em",
    color: "#B12F15",
    width: "280px",
    marginTop: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  notification: {
    fontFamily: "'Inter', sans-serif",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "18px",
    marginLeft: "8px",
    letterSpacing: "-0.011em",
    color: "#76808D",
    maxWidth: "350px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  date_notification: {
    fontFamily: "'Inter', sans-serif",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "18px",
    display: "flex",
    alignItems: "center",
    textAlign: "right",
    color: "rgba(118, 128, 141, 0.5)",
  },
}));

export default () => {
  const classes = useStyles();
  const { daoURL } = useParams();
  const { user, DAO, DAOLoading } = useAppSelector((state) => state.dashboard);
  const { provider, account, chainId, connector } = useWeb3React();
  const [myNotifications, setMyNotifications] = useState([]);
  const [timeline, setTimeline] = useState([]);
  let navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      account &&
      chainId &&
      (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))
    ) {
      dispatch(getCurrentUser({}));
    }
  }, [account, chainId, user]);

  useEffect(() => {
    if (user && DAO && DAO.url === daoURL) {
      axiosHttp
        .get(`notification?dao=${_get(DAO, "_id", "")}&limit=20`)
        .then((res) => {
          setMyNotifications(res.data.data);
        });
      axiosHttp
        .get(`notification?timeline=1&dao=${_get(DAO, "_id", "")}&limit=10`)
        .then((res) => {
          setTimeline(res.data.data);
        });
    }
  }, [DAO, daoURL, user]);

  const loadNotification = (notification: any) => {
    if (notification.model === "Project") {
      if (
        notification.type === "project:member.invited" ||
        notification.type === "project:member.added"
      ) {
        if (notification.to && notification.to._id === user._id)
          return 'You are <span class="bold">invited</span>';
        if (
          _get(notification, "to.name", "") &&
          _get(notification, "to.name", "") !== ""
        )
          return `${_get(
            notification,
            "to.name",
            ""
          )} has been <span class="bold">invited</span> to ${_get(
            notification,
            "project.name",
            ""
          )}`;
        return `${beautifyHexToken(
          _get(notification, "to.wallet", "")
        )} has been <span class="bold">invited </span> to ${_get(
          notification,
          "project.name",
          ""
        )}`;
      } else if (notification.type === "project:created") {
        return `${_get(
          notification,
          "project.name",
          ""
        )} <span class="bold">created</span>`;
      } else if (notification.type === "project:deleted") {
        return `${_get(
          notification,
          "project.name",
          ""
        )} <span class="bold">deleted</span>`;
      } else if (notification.type === "project:member:removed") {
        return notification.notification;
      }
    } else if (notification.model === "Task") {
      if (notification.type === "task:member.assigned") {
        if (notification.to._id === user._id)
          return 'You are <span class="bold">Assigned</span>';
      } else if (
        notification.type === "task:member.submission.rejected" ||
        notification.type === "task:member.submission.approve"
      ) {
        if (notification.to && notification.to._id === user._id)
          return notification.type === "task:member.submission.rejected"
            ? 'Submission <span class="bold">rejected</span>'
            : 'Submission <span class="bold">approved</span>';
      } else if (notification.type === "task:paid") {
        if (notification.to && notification.to._id === user._id)
          return `Paid for <span class="bold">${notification.title}</span>`;
      }
      return notification.notification;
    } else {
      return notification.notification;
    }
  };

  const navigateTo = (notification: any) => {
    if (notification.model === "Project") {
      if (
        !_get(notification, "project.deletedAt", null) &&
        !_get(notification, "project.archivedAt", null)
      ) {
        navigate(
          `/${DAO.url}/project/${_get(notification, "project._id", "")}`
        );
      }
    } else if (notification.model === "Task") {
      if (
        !_get(notification, "task.deletedAt", null) &&
        !_get(notification, "task.archivedAt", null)
      ) {
        navigate(`/${DAO.url}/task/${_get(notification, "task._id", "")}`);
      }
    }
  };

  const getIcon = (notification: any, userIcon = true) => {
    if (notification.model === "Task") {
      if (notification.type.indexOf("member") > -1 && userIcon)
        return USER_ICON;
      return TASK_ICON;
    } else if (notification.model === "Project") {
      if (notification.type.indexOf("member") > -1 && userIcon)
        return USER_ICON;
      return PROJECT_ICON;
    } else if (notification.model === "Transaction") {
      return TRANSACTION_ICON;
    } else {
      if (userIcon) return USER_ICON;
      return undefined;
    }
  };

  if (myNotifications.length == 0) return null;

  return (
    <Box className={classes.notifications}>
      <Box className={classes.my_notifications}>
        <Box className={classes.list_container}>
          {myNotifications.map((notification: any) => {
            return (
              <Box
                onClick={() => navigateTo(notification)}
                key={notification?._id}
                className={classes.notification_item}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <img className="icon" src={getIcon(notification)}></img>
                    <Box className={classes.title}>
                      {_get(notification, "title", "")}
                    </Box>
                    <Box className={classes.date}>
                      {moment
                        .utc(notification.createdAt)
                        .local()
                        .format("MM/DD")}
                    </Box>
                  </Box>
                  <Box
                    className={classes.container_notification}
                    dangerouslySetInnerHTML={{
                      __html: loadNotification(notification),
                    }}
                  ></Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          width: "40%",
          height: "100%",
          /* background: rgba(118, 128, 141, 0.03); */
          borderRadius: "5px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            padding: "21px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {timeline.map((notification: any) => {
            return (
              <>
                <Box
                  onClick={() => navigateTo(notification)}
                  key={notification._id}
                  sx={{ padding: "18px 0px", cursor: "pointer" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <img className="icon" src={getIcon(notification)}></img>
                      <Box
                        className={classes.notification}
                        dangerouslySetInnerHTML={{
                          __html: loadNotification(notification),
                        }}
                      ></Box>
                    </Box>
                    <Box className={classes.date_notification}>
                      {moment
                        .utc(notification.createdAt)
                        .local()
                        .format("MM/DD")}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{ border: "1px dashed rgba(118, 128, 141, 0.5)" }}
                ></Box>
              </>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
