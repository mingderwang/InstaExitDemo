import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux'
import TrimmedText from "../components/util/TrimmedText";
import { config as cssConfig } from "../css-config";
import EthIcon from "eth-icon";
import UserDetails from "./user/UserDetails";
import CallMadeIcon from '@material-ui/icons/CallMade';
import { updateUserState } from "../redux";

const HeaderWrapper = styled.div`
  display: flex;
  padding: 5px;
  height: 40px;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  flex-wrap: wrap;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`
const IconWrapper = styled.div`
    display: flex;
    height: 40px;
    padding: 0px 5px;
    align-items: center;
`
const RightMenuWrapper = styled.div`
    display: flex;
    height: 40px;
    padding: 0px 5px;
    align-items: center;
`
const UserAddressWrapper = styled.div`
    padding: 7px 16px;
    background: ${cssConfig.theme.dark.buttonBackground};
    color: ${cssConfig.theme.dark.primaryTextColor};
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const SwitchNetworkWrapper = styled.div`
    padding: 5px;
`
const ConnectWalletWrapper = styled.div`
    padding: 5px,
`

const useStyles = makeStyles((theme) => ({
    headerItems: {
        marginTop: "2px"
    },
    logoText: {
        fontWeight: "bold",
        fontSize: "28px"
    },
    logoIcon: {
        height: "35px",
        marginRight: "10px"
    },
    connectWallet: {
        color: cssConfig.theme.dark.primaryTextColor
    },
    userAddress: {
        paddingRight: "5px"
    },
    userAddressIcon: {
        borderRadius: "16px",
        marginLeft: "10px",
        height: "24px!important",
        width: "24px!important"
    },
    icon: {
        width: "14px",
        marginLeft: "4px",
        color: "#fff"
    },
    headerLink: {
        textDecoration: "none",
        color: "#fff"
    },
    headerLinksContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "2px 5px",
        marginLeft: "20px"
    }
}));


function Header(props) {
    const dispatch = useDispatch();
    const classes = useStyles();

    const selectedWallet = useSelector(state => state.network.selectedWallet);
    const selectedUserAddress = useSelector(state => state.user.userAddress);

    const onClickNetworkChange = () => {
        if(props.onClickNetworkChange) {
            props.onClickNetworkChange(props.selectedFromChain.chainId);
        }
    }

    const onClickConnectWallet = () => {
        if(props.connectWallet) {
            props.connectWallet();
        }
    }

    const onClickUserAddress = () => {
        dispatch(updateUserState({showUserDetails: true}))
    }
    
    return (
        <HeaderWrapper>
            {/* <UserDetails onClickWalletChange={props.onClickWalletChange}/> */}

            <IconWrapper className={classes.headerItems}>
                <div className={classes.headerLinksContainer}>
                    <a href="https://hyphen-info.biconomy.io" target="_target" className={classes.headerLink}>Analytics</a> 
                    <CallMadeIcon className={classes.icon} />
                </div>
            </IconWrapper>
            
            <RightMenuWrapper className={classes.headerItems}>                
                {!selectedWallet &&
                    <ConnectWalletWrapper>
                        <Button variant="contained" onClick={onClickConnectWallet} className={classes.connectWallet}>
                            {props.connectWalletText}
                        </Button>
                    </ConnectWalletWrapper>
                }
                {selectedWallet && selectedUserAddress &&
                    <UserAddressWrapper onClick={onClickUserAddress}>
                        <TrimmedText text={selectedUserAddress} startIndex={6} endIndex={38}/>
                        <EthIcon address={selectedUserAddress} scale={8} className={classes.userAddressIcon}/>
                    </UserAddressWrapper>
                }
                <SwitchNetworkWrapper >
                    {props.showSwitchNetworkButton && 
                        <Button variant="contained" color="secondary" onClick={onClickNetworkChange}>
                            {props.switchButtonText}
                        </Button>
                    }
                </SwitchNetworkWrapper>
            </RightMenuWrapper>
        </HeaderWrapper>
    )
}

export default Header