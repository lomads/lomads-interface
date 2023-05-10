import Dashboard from "../pages/NewPages/DashBoard/Dashboard";
//import Settings from "../pages/NewPages/Settings";
import DCAuth from '../pages/NewPages/DCAuth';
import CreatePassSucess from "../pages/NewPages/CreatePassSucess";
import CreateProject from "../pages/NewPages/CreateProject";
import ProjectDetails from "../pages/NewPages/ProjectDetails";
import ProjectDetailsPreview from "../pages/NewPages/ProjectDetailsPreview";
import OnlyWhitelisted from "pages/NewPages/OnlyWhitelisted";
import ArchiveProjects from "../pages/NewPages/ArchiveProjects";
import TaskDetails from "pages/NewPages/TaskDetails";
import TaskDetailsPreview from "pages/NewPages/TaskDetailsPreview";
import AllTasks from "pages/NewPages/AllTasks";
import ArchiveTasks from "pages/NewPages/ArchiveTasks";
import ArchiveProjectTasks from "pages/NewPages/ArchiveProjectTasks";
import AllProjectTasks from "pages/NewPages/AllProjectTasks";
import AllProjects from "pages/NewPages/AllProjects";
import ArchiveKRA from "pages/NewPages/ArchiveKRA";
import GithubAuth from "pages/NewPages/GithubAuth";

import PrimaryLayout from "muiLayouts/PrimaryLayout";
import BaseLayout from "muiLayouts/BaseLayout";

import CreatePassToken from "muiViews/CreatePassToken";
import MintPassToken from "muiViews/MintPassToken";
import LoginPage from "muiViews/LoginPage";
import createDaoOrg from "muiViews/CreateDaoOrg"
import AddExistingSafe from "muiViews/AddExistingSafe";
import AddNewSafe from "muiViews/AddNewSafe";
import DAOsuccess from "muiViews/DAOSuccess";
import DAONoAccess from "muiViews/DAONoAccess";
import Settings from "muiViews/Settings";

export default [
    {
        path: '/',
        component: Dashboard
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/createorg',
        component: createDaoOrg
    },
    {
        path: '/addsafe',
        component: AddExistingSafe
    },
    {
        path: '/newsafe',
        component: AddNewSafe
    },
    {
        path: '/:daoURL/addsafe',
        component: AddExistingSafe
    },
    {
        path: '/:daoURL/newsafe',
        component: AddNewSafe
    },
    {
        path: '/success',
        component: DAOsuccess
    },
    {
        path: '/noaccess',
        component: DAONoAccess
    },
    {
        path: '/only-whitelisted',
        component: OnlyWhitelisted
    },
    {
        path: '/:daoURL/create-pass-token',
        component: CreatePassToken,
        layout: PrimaryLayout
    },
    {
        path: '/:daoURL/mint/:contractId',
        component: MintPassToken,
        layout: BaseLayout
    },
    {
        path: '/sbt/success/:contractAddr',
        component: CreatePassSucess
    },
    {
        path: '/createProject',
        component: CreateProject
    },
    {
        path: '/dcauth',
        component: DCAuth
    },
    {
        path: '/githubauth',
        component: GithubAuth
    },
    {
        path: '/:daoURL/project/:projectId',
        component: ProjectDetails
    },
    {
        path: '/:daoURL/project/:projectId/preview',
        component: ProjectDetailsPreview
    },
    {
        path: '/:daoURL/project/:projectId/archiveKra',
        component: ArchiveKRA
    },
    {
        path: '/:daoURL/projects',
        component: AllProjects
    },
    {
        path: '/:daoURL/task/:taskId',
        component: TaskDetails
    },
    {
        path: '/:daoURL/task/:taskId/preview',
        component: TaskDetailsPreview
    },
    {
        path: '/:daoURL/settings',
        component: Settings
    },
    {
        path: '/:daoURL/settings/:openState',
        component: Settings
    },
    {
        path: '/archives',
        component: ArchiveProjects
    },
    {
        path: '/:daoURL/archiveTasks',
        component: ArchiveTasks
    },
    {
        path: '/:daoURL/archiveTasks/:projectId',
        component: ArchiveProjectTasks
    },
    {
        path: '/:daoURL/tasks',
        component: AllTasks
    },
    {
        path: '/:daoURL/tasks/:projectId',
        component: AllProjectTasks
    },
    {
        path: '/:daoURL',
        component: Dashboard
    }
]