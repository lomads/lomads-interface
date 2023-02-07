import { AiOutlineClose } from "react-icons/ai";
import { IsideModalNew } from "types/DashBoardType";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import { Button, Image, Input } from "@chakra-ui/react";
import Table from "react-bootstrap/Table";
// ! IMAGES
import RP from "../../assets/images/drawer-icons/RP.svg";
import TotalAccess from "../../assets/images/drawer-icons/StatusAccess.svg";
import ViewOnly from "../../assets/images/drawer-icons/StatusViewOnly.svg";
import NoAccess from "../../assets/images/drawer-icons/StatusNoAccess.svg";

const RolesPermissionsModal = ({ toggleModal, toggleRP }) => {
  //! ROLES & PERMISSIONS OBJECT
  var permissionsArray = [
    {
      id: 1,
      name: "Transactions voting",
      admin: "total",
      coreContributor: "no",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 2,
      name: "Edit Organisation Settings",
      admin: "total",
      coreContributor: "no",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 3,
      name: "Send transactions",
      admin: "total",
      coreContributor: "no",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 4,
      name: "View transactions",
      admin: "total",
      coreContributor: "total",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 5,
      name: "Add members",
      admin: "total",
      coreContributor: "total",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 6,
      name: "Remove members",
      admin: "total",
      coreContributor: "no",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 7,
      name: "Change access level of members",
      admin: "total",
      coreContributor: "no",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 8,
      name: "Create and modify projects",
      admin: "total",
      coreContributor: "total",
      activeContributor: "total",
      contributor: "no",
    },
    {
      id: 9,
      name: "View complete details of all the projects",
      admin: "total",
      coreContributor: "total",
      activeContributor: "view",
      contributor: "view",
    },
    {
      id: 10,
      name: "Create and modify tasks",
      admin: "total",
      coreContributor: "total",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 11,
      name: "Review tasks",
      admin: "total",
      coreContributor: "total",
      activeContributor: "no",
      contributor: "no",
    },
    {
      id: 12,
      name: "View tasks details",
      admin: "total",
      coreContributor: "no",
      activeContributor: "view",
      contributor: "view",
    },
    {
      id: 13,
      name: "See members of project",
      admin: "total",
      coreContributor: "view",
      activeContributor: "view",
      contributor: "view",
    },
  ];

  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleRP();
          }}
          className="overlay"
        ></div>
        <div className="SideModalRolesPermissions">
          <div className="closeButtonArea">
            <IconButton
              Icon={
                <AiOutlineClose
                  style={{
                    color: "#C94B32",
                    height: "16px",
                    width: "16px",
                  }}
                />
              }
              bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
              height={37}
              width={37}
              className="sideModalCloseButton"
              onClick={() => {
                toggleModal();
                toggleRP();
              }}
            />
          </div>
          <div className="MainComponent-rolesPermissions">
            <div className="test">
              <Image
                src={RP}
                alt="Roles & permissions icon"
                style={{ width: "94.48px", height: "50px" }}
              />
              <div id="title-type">Roles & Permissions</div>
              <div id="rp-text">
                We have provided certain default permissions for different types
                of members based on the best practices we have seen being
                followed in many well-functioning organisations. In future, we
                may give options to change the permissions for different types
                of members.
              </div>
            </div>

            {/* //! BODY */}
            <div>
              <div
                style={{
                  width: "420.38px",
                  height: " 50px",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: "#edf2f7",
                  color: "#4c535c",
                  borderRadius: "5px",
                  justifyContent: "space-around",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "35px",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Image
                    src={TotalAccess}
                    alt="total access icon"
                    style={{ marginRight: "11.25px" }}
                  />
                  Total access
                </div>
                <div style={{ display: "flex" }}>
                  <Image
                    src={NoAccess}
                    alt="no access icon"
                    style={{ marginRight: "11.25px" }}
                  />
                  No access
                </div>
                <div style={{ display: "flex" }}>
                  <Image
                    src={ViewOnly}
                    alt="voew only icon"
                    style={{ marginRight: "11.25px" }}
                  />
                  View only
                </div>
              </div>
              <div>
                <Table borderless hover>
                  <thead>
                    <tr>
                      <th></th>
                      <th align="center">Admin</th>
                      <th align="center">Core Contributor</th>
                      <th align="center">Active Contributor</th>
                      <th align="center">Contributor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsArray.map((e) => {
                      return (
                        <tr>
                          <td>{e.name}</td>
                          <td align="center">
                            {e.admin === "total" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={TotalAccess}
                                alt="total access icon"
                              />
                            ) : null}
                            {e.admin === "no" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={NoAccess}
                                alt="no access icon"
                              />
                            ) : null}
                            {e.admin === "view" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={ViewOnly}
                                alt="view access icon"
                              />
                            ) : null}
                          </td>
                          <td align="center">
                            {e.coreContributor === "total" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={TotalAccess}
                                alt="total access icon"
                              />
                            ) : null}
                            {e.coreContributor === "no" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={NoAccess}
                                alt="no access icon"
                              />
                            ) : null}
                            {e.coreContributor === "view" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={ViewOnly}
                                alt="view access icon"
                              />
                            ) : null}
                          </td>
                          <td align="center">
                            {e.activeContributor === "total" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={TotalAccess}
                                alt="total access icon"
                              />
                            ) : null}
                            {e.activeContributor === "no" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={NoAccess}
                                alt="no access icon"
                              />
                            ) : null}
                            {e.activeContributor === "view" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={ViewOnly}
                                alt="view access icon"
                              />
                            ) : null}
                          </td>
                          <td align="center">
                            {e.contributor === "total" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={TotalAccess}
                                alt="total access icon"
                              />
                            ) : null}
                            {e.contributor === "no" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={NoAccess}
                                alt="no access icon"
                              />
                            ) : null}
                            {e.contributor === "view" ? (
                              <Image
                                style={{ width: "30px", height: "30px" }}
                                src={ViewOnly}
                                alt="view access icon"
                              />
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={6}>
                        <div id="notes-type">Notes</div>
                        <div id="paragraph-type">
                          Admins are by default those who are signatories of the
                          organisation’s safe.
                        </div>
                        <div id="paragraph-type">
                          If a member is removed as a safe signatory then their
                          status is changed to contributor.
                        </div>
                        <div id="paragraph-type">
                          If a member is added as a safe signatory, their status
                          is changed to the Admin.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RolesPermissionsModal;
