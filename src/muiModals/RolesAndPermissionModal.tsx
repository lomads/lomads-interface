import React from 'react';
import { useState } from 'react'
import clsx from 'clsx';
import { get as _get } from 'lodash'
import {
    Drawer, Box, Typography, Paper
} from '@mui/material';
import IconButton from 'muiComponents/IconButton';
import Button from 'muiComponents/Button';
import Switch from "muiComponents/Switch";
import CurrencyInput from "muiComponents/CurrencyInput"
import CloseSVG from 'assets/svg/close-new.svg'
import RP from "assets/images/drawer-icons/RP.svg";
import palette from 'muiTheme/palette';
import { makeStyles } from '@mui/styles';
import PT from "assets/images/drawer-icons/PT.svg";

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import TotalAccess from "assets/images/drawer-icons/StatusAccess.svg";
import ViewOnly from "assets/images/drawer-icons/StatusViewOnly.svg";
import NoAccess from "assets/images/drawer-icons/StatusNoAccess.svg";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    justifyContent: 'flex-start',
    '& .MuiAccordionSummary-content': {
        flexGrow: 'inherit'
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        marginLeft: 16
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: '0px',
}));


const useStyles = makeStyles((theme: any) => ({
    tableHead: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        padding: '10px 0'
    },
    tableHeadBox: {
        width: '165px',
        display: 'flex',
        alignitems: 'center',
        justifyContent: 'center',
    },
    tableRow: {
        width: '100%',
        height: '65px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableRowFirstBox: {
        width: '260px',
        height: '100%',
        padding: '0 15px',
        display: 'flex',
        alignItems: 'center',
        borderRight: '1px solid #76808D22'
    },
    tableRowBox: {
        width: '165px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid #76808D22'
    },
}));

const organisationPermissions = [
    {
        id: 1,
        name: "Access",
        admin: "Yes",
        coreContributor: null,
        activeContributor: null,
        contributor: null,
    }
];

const treasuryPermissions = [
    {
        id: 1,
        name: "Create Transaction (single/batch, recurring)",
        admin: "All",
        coreContributor: null,
        activeContributor: null,
        contributor: null,
    },
    {
        id: 2,
        name: "Modify signer",
        admin: "Yes",
        coreContributor: null,
        activeContributor: null,
        contributor: null,
    },
    {
        id: 3,
        name: "View Transactions",
        admin: "Yes",
        coreContributor: 'Yes*',
        activeContributor: null,
        contributor: null,
    },
]

const membersPermissions = [
    {
        id: 1,
        name: "View members",
        admin: "All",
        coreContributor: "All",
        activeContributor: "Yes",
        contributor: "Yes",
    },
    {
        id: 2,
        name: "Add/Remove (DAO level)",
        admin: "Yes",
        coreContributor: null,
        activeContributor: null,
        contributor: null,
    },
    {
        id: 3,
        name: "Add/Remove (Workspace level)",
        admin: "Yes",
        coreContributor: 'Yes',
        activeContributor: null,
        contributor: null,
    },
    {
        id: 4,
        name: "Change access level",
        admin: "Yes",
        coreContributor: null,
        activeContributor: null,
        contributor: null,
    },
]

const workspacePermissions = [
    {
        id: 1,
        name: "View",
        admin: "All",
        coreContributor: "All",
        activeContributor: "Only eligible",
        contributor: "Only eligible",
    },
    {
        id: 2,
        name: "Create, Modify",
        admin: "Yes",
        coreContributor: "All",
        activeContributor: null,
        contributor: null,
    },
]


export default ({ open, onClose }: { open: boolean, onClose: any }) => {
    const classes = useStyles();

    const [panels, setPanels] = useState<any>([]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        if (panels.indexOf(panel) > -1) {
            setPanels(panels.filter((i: string) => i !== panel));
        }
        else {
            setPanels([...panels, panel]);
        }
    };

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 99999 }}
            anchor={'right'}
            open={open}
            onClose={() => onClose()}>
            <Box sx={{ width: 960, flex: 1, paddingBottom: '80px', paddingLeft: '40px', borderRadius: '20px 0px 0px 20px' }}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" my={6} alignItems="center">
                    <img src={RP} />
                    <Typography my={2} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Roles & Permissions</Typography>
                    <Typography style={{ color: '#76808d' }}>Default member roles and permissions are set and ready, based<br /> on industry best practices. Customization options coming soon!</Typography>
                </Box>

                <Box className={classes.tableHead}>
                    <Box className={classes.tableHeadBox}>
                        <Typography sx={{ fontWeight: '700' }}>Admin</Typography>
                    </Box>
                    <Box className={classes.tableHeadBox}>
                        <Typography sx={{ fontWeight: '700' }}>Core Contributor</Typography>
                    </Box>
                    <Box className={classes.tableHeadBox}>
                        <Typography sx={{ fontWeight: '700' }}>Active Contributor</Typography>
                    </Box>
                    <Box className={classes.tableHeadBox}>
                        <Typography sx={{ fontWeight: '700' }}>Contributor</Typography>
                    </Box>
                </Box>

                <Accordion expanded={panels.includes('panel1')} onChange={handleChange('panel1')}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Box>
                            <Typography>ORGANISATION SETTINGS</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Access</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={panels.includes('panel2')} onChange={handleChange('panel2')}>
                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                        <Box>
                            <Typography>TREASURY</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Create Transaction<br />(single/batch, recurring)</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Modify signer</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>View Transactions</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes*</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={panels.includes('panel3')} onChange={handleChange('panel3')}>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                        <Box>
                            <Typography>MEMBERS</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>View members</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Add/Remove (DAO level)</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Add/Remove (Workspace level)</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Change access level</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={panels.includes('panel4')} onChange={handleChange('panel4')}>
                    <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                        <Box>
                            <Typography>WORKSPACES</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>View</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={ViewOnly} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#0D5263' }}>Only eligible</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={ViewOnly} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#0D5263' }}>Only eligible</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Create, Modify</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All <br /><span style={{ fontSize: '12px', fontWeight: '400', color: '#188C7C', fontStyle: 'italic' }}>(created by them)</span></Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All <br /><span style={{ fontSize: '12px', fontWeight: '400', color: '#188C7C', fontStyle: 'italic' }}>(created by them)</span></Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Validate milestones and KPIs</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All <br /><span style={{ fontSize: '12px', fontWeight: '400', color: '#188C7C', fontStyle: 'italic' }}>(created by them)</span></Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={panels.includes('panel5')} onChange={handleChange('panel5')}>
                    <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                        <Box>
                            <Typography>TASKS</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>View</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={ViewOnly} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#0D5263' }}>Only eligible</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={classes.tableRow}>
                            <Box className={classes.tableRowFirstBox}>
                                <Typography>Create, Modify, Review</Typography>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>Yes</Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                                <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                    <img src={TotalAccess} style={{ marginRight: '5px' }} />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography sx={{ fontWeight: '700', color: '#188C7C' }}>All <br /><span style={{ fontSize: '12px', fontWeight: '400', color: '#188C7C', fontStyle: 'italic' }}>(created by them)</span></Typography>
                                </Box>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                            <Box className={classes.tableRowBox}>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Box sx={{ marginTop: '30px' }}>
                    <Typography sx={{ fontWeight: '700', color: '#76808D', marginBottom: '10px' }}>Notes</Typography>
                    <Typography sx={{ fontWeight: '700', fontSize: '14px', fontStyle: 'italic', color: '#76808D', marginBottom: '10px' }}>*Next release: Toggle (on/off)</Typography>
                    <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: '#76808D', marginBottom: '10px' }}>Admins are by default those who are signatories of the organisation’s safe.</Typography>
                    <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: '#76808D', marginBottom: '10px' }}>If a member is removed as a safe signatory then their status is changed to contributor.</Typography>
                    <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: '#76808D', marginBottom: '10px' }}>If a member is added as a safe signatory, their status is changed to the Admin.</Typography>
                </Box>
            </Box>
        </Drawer>
    )
}