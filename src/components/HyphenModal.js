
import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import clsx from  'clsx';
import CrossIcon from '../assets/cross-icon.svg';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: 450,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

    modalContainer: {
        width: 500,
        top: '50px',
        borderRadius: '20px',
        position: 'relative',
        display: 'flex',
        margin: 'auto',     
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
    },
    modalRow: {
        paddingRight: "5%",
        paddingLeft: "5%",
        width: "90%"        
    },
    modalContent: {
        display: "flex",
        width: "100%",
        flexDirection: "column"
    },
    modalTop: {
        display: "flex",
        flexDirection: "column",
        width: "90%",
        borderRadius: '20px 20px 0px 0px',
        paddingTop: "40px",
        paddingBottom: "10px"
    },
    modalHeader: {
        display: "flex",
        flexDirection: "row",
        fontStyle: "normal",
        lineHeight: "32px",
        textTransform: "capitalize",
        color: "rgba(0, 0, 0, 0.5)",
        width: "100%"
    },
    modalHeaderText: {
        display: "flex",
        flexGrow: "1",
        fontWeight: "600",
        fontSize: "22px",
    },
    modalHeaderClose: {
        display: "flex",
        cursor: "pointer"
    },
    modalBottom: {
        background: "#F1F0FF",
        borderRadius: '0 0 20px 20px',
        paddingBottom: "10px",
        paddingTop: "10px"
    },
    modalBody: {
        width: "100%"
    },
    modalFooter: {
        width: "100%",
        display: "flex",
        justifyContent: "center"
    },
    footerNote: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: "#615CCD",
        fontSize: "14px",
        marginBottom: "5px"
    }
}));

export default function HyphenModal(props) {
    const classes = useStyles();

    return (
        <div>
            <Modal
            disableEnforceFocus
            disableAutoFocus
            open={props.open}
            onClose={props.onModalClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            >
                <div className={classes.modalContainer}>
                    <div className={classes.modalContent}>
                        <div className={clsx(classes.modalTop, classes.modalRow)}>
                            <div className={classes.modalHeader}>
                                <div className={classes.modalHeaderText}>
                                    {props.headerText}
                                </div>
                                <div className={classes.modalHeaderClose} onClick={props.onModalClose}>
                                    <img src={CrossIcon} alt="=>" />
                                </div>
                            </div>
                            <div className={classes.modalBody}>
                                {props.topContent}
                            </div>
                        </div>
                        <div className={clsx(classes.modalBottom, classes.modalRow)}>
                            {props.bottomContent}
                            {props.footerNote && 
                                <div className={classes.footerNote}>
                                    {props.footerNote}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}