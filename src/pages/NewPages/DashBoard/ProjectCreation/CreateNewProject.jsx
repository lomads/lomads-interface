import { useState } from "react";
import { ChevronRight } from "react-feather";
import { Link } from "react-router-dom";
import KeyResults from "./KeyResults";
import ProjectMilestones from "./ProjectMilestones";
import ProjectResources from "./ProjectResources";

const CreateNewProject = () => {
  //! CONST DECLARATION
  const [showModal, setShowModal] = useState(false);
  const [openProjectResources, setOpenProjectResources] = useState(false);
  const [openProjectMilestones, setOpenProjectMilestones] = useState(false);
  const [openKeyResults, setOpenKeyResults] = useState(false);
  //! TOGGLE FUNCTIONS
  let toggleModal = () => {
    setShowModal(!showModal);
  };
  let toggleProjectResources = () => {
    setOpenProjectResources(!openProjectResources);
  };
  let toggleProjectMilestones = () => {
    setOpenProjectMilestones(!openProjectMilestones);
  };
  let toggleKeyResults = () => {
    setOpenKeyResults(!openKeyResults);
  };

  return (
    <>
      <div className="dashBoardBody">
        <Link
          className="style-content"
          style={{ color: "#C94B32" }}
          onClick={() => {
            toggleModal();
            setOpenProjectResources(true);
          }}
        >
          Project Resources
          <ChevronRight />
        </Link>
        <Link
          className="style-content"
          style={{ color: "#C94B32" }}
          onClick={() => {
            toggleModal();
            setOpenProjectMilestones(true);
          }}
        >
          Project Milestones
          <ChevronRight />
        </Link>
        <Link
          className="style-content"
          style={{ color: "#C94B32" }}
          onClick={() => {
            toggleModal();
            setOpenKeyResults(true);
          }}
        >
          Key Results
          <ChevronRight />
        </Link>
      </div>
      {/* // !-------------  Project Resources ------------ */}
      {showModal && openProjectResources && (
        <ProjectResources
          toggleModal={toggleModal}
          toggleProjectResources={toggleProjectResources}
        />
      )}
      // !------------- Project Milestones ------------
      {showModal && openProjectMilestones && (
        <ProjectMilestones
          toggleModal={toggleModal}
          toggleProjectMilestones={toggleProjectMilestones}
        />
      )}
      {/* // !-------------  Key Results ------------ */}
      {showModal && openKeyResults && (
        <KeyResults
          toggleModal={toggleModal}
          toggleKeyResults={toggleKeyResults}
        />
      )}
    </>
  );
};

export default CreateNewProject;
