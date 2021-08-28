import React from 'react'
import { makeStyles, withStyles} from '@material-ui/core/styles';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux'
import TrimmedText from "../components/util/TrimmedText";
import InfoIcon from '@material-ui/icons/Info';
import { config as cssConfig } from "../css-config";
import { config } from '../config';
import Tooltip from '@material-ui/core/Tooltip';
import EthIcon from "eth-icon";
import UserDetails from "./user/UserDetails";
import CallMadeIcon from '@material-ui/icons/CallMade';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { updateTransferState, updateUserState } from "../redux";

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

const UseBiconomySwitchWrapper = styled.div`
    color: #fff;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 13,
      maxWidth: 200,
      marginRight: "10px"
    },
}))(Tooltip);

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
    },
    useBiconomySwitch: {
        color: "#CCBA5C"
    },
    infoIcon: {
        marginRight: "10px",
        width: "18px",
        color: "#CCBA5C"
    },
    gaslessModeLable: {
        marginRight: "20px",
        color: "#CCBA5C"
    }
}));

const HyphenSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: "#CCBA5C",
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.black,
            '& + $track': {
                opacity: 1,
                backgroundColor: "#CCBA5C",
                borderColor: theme.palette.common.white,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: "#111"
    },
    checked: {}
}))(Switch);

function Header(props) {
    const dispatch = useDispatch();
    const classes = useStyles();

    const selectedWallet = useSelector(state => state.network.selectedWallet);
    const selectedUserAddress = useSelector(state => state.user.userAddress);
    const useBiconomy = useSelector(state => state.transfer.useBiconomy);

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

    const onClickGaslessSwitch = () => {
        
        if(localStorage) {
            if(useBiconomy) {
                localStorage.removeItem(config.useBiconomyKey);
            } else {
                localStorage.setItem(config.useBiconomyKey, true);
            }
        }
        dispatch(updateTransferState({useBiconomy: !useBiconomy}));
    }
    
    return (
        <HeaderWrapper>
            <IconWrapper className={classes.headerItems}>
                <div className={classes.headerLinksContainer}>
                    <a href="https://hyphen-info.biconomy.io" target="_target" className={classes.headerLink}>Analytics</a> 
                    <CallMadeIcon className={classes.icon} />
                </div>
            </IconWrapper>
            <UserDetails onClickWalletChange={props.onClickWalletChange}/>

            
            <RightMenuWrapper className={classes.headerItems}>

                <UseBiconomySwitchWrapper >
                    <LightTooltip title={`This button will toggle Hyphen gasless feature for your wallet. Users with hardware wallets should keep this setting turned off.`} 
                    placement="bottom">
                        <InfoIcon className={`${classes.infoIcon}`} />
                    </LightTooltip>
                    <div className={classes.gaslessModeLable}>{`Gasless Mode`}</div>
                    <FormControlLabel
                        className={classes.useBiconomySwitch}
                        control={<HyphenSwitch checked={useBiconomy} onChange={onClickGaslessSwitch} name="useBiconomy" />}
                    />
                </UseBiconomySwitchWrapper>

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