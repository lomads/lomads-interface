import LoginPage from "../pages/LoginPage";
import Header from "components/Header";
import DAOsuccess from "../pages/NewPages/DAOsuccess";
import DAONoAccess from "../pages/NewPages/DAONoAccess";
import NameDAO from "../pages/NewPages/NameDAO";
import StartSafe from "../pages/NewPages/StartSafe";
import InviteGang from "../pages/NewPages/InviteGang";
import AddExistingSafe from "../pages/NewPages/AddExistingSafe";
import AddNewSafe from "../pages/NewPages/AddNewSafe";
import Dashboard from "../pages/NewPages/DashBoard/Dashboard";
import Settings from "../pages/NewPages/Settings";
import SettingsOlder from "../pages/NewPages/SettingsOlder";
import DCAuth from '../pages/NewPages/DCAuth';
import CreatePassToken from "../pages/NewPages/CreatePassToken";
import MintPassToken from "../pages/NewPages/MintPassToken";
import CreatePassSucess from "../pages/NewPages/CreatePassSucess";
import CreateProject from "../pages/NewPages/CreateProject";
import ProjectDetails from "../pages/NewPages/ProjectDetails";
import OnlyWhitelisted from "pages/NewPages/OnlyWhitelisted";
import ArchiveProjects from "../pages/NewPages/ArchiveProjects";
import TaskDetails from "pages/NewPages/TaskDetails";
import AllTasks from "pages/NewPages/AllTasks";
import ArchiveTasks from "pages/NewPages/ArchiveTasks";
import ArchiveProjectTasks from "pages/NewPages/ArchiveProjectTasks";
import AllProjectTasks from "pages/NewPages/AllProjectTasks";

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
        component: NameDAO
    },
    {
        path: '/createdao',
        component: NameDAO
    },
    {
        path: '/invitegang',
        component: InviteGang
    },
    {
        path: '/startsafe',
        component: StartSafe
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
        path: '/sbt/create',
        component: CreatePassToken
    },
    {
        path: '/:daoURL/sbt/mint/:contractAddr',
        component: MintPassToken
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
        path: '/:daoURL/project/:projectId',
        component: ProjectDetails
    },
    {
        path: '/:daoURL/task/:taskId',
        component: TaskDetails
    },
    {
        path: '/:daoURL/settings',
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