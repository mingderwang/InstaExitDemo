import React from "react";
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import clsx from  'clsx';

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%"
    },
    messageContainer: {
        padding: "10px 0px",
        display: "flex",
        flexDirection: "row"
    },
    crossIcon: {
        width: "10px"
    },
    messageLeft: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    },
    title: {
        fontWeight: "bold",
        textDecoration: "uppercase",
        marginBottom: "5px",
        fontSize: "14px"
    },
    message: {
        fontSize: "15px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "5px"
    },
    link: {
        textDecoration: "none",
        cursor: "pointer",
        color: "#615CCD!important"
    },
    icon: {
        width: "18px"
    },
    info: {
        color: "#615CCD!important"
    },
    success: {
        color: "#079E05!important"
    },
    iconContainer: {
        display: "flex",
        marginRight: "10px"
    },
    default: {
        color: "#615CCD!important"
    }
}));

const CustomNotification = (props) => {
    const classes = useStyles();
    
    let className = classes.default;
    if(props.type === "info") {
        className = classes.info;
    } else if(props.type === "success") {
        className = classes.success;
    }

    return (
        <div className={classes.container}>
            <a className={clsx(classes.link, classes.message, className)} href={props.href ? props.href : "#"} target="_blank">
                {props.type && 
                    <div className={classes.iconContainer}>
                        {
                            props.type === "info" &&
                                <InfoOutlinedIcon className={clsx(classes.icon, classes.info)}/>
                        }
                        {
                            props.type === "success" &&
                                <DoneAllOutlinedIcon className={clsx(classes.icon, classes.success)}/>
                        }
                    </div>
                }
                <div className={classes.messageContainer}>
                    {props.message}
                </div>
            </a>
            { props.showProgress &&
                <LinearProgress />
            }
        </div>
    )
}

export default CustomNotification;