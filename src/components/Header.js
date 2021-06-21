import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import Logo from '../assets/Hyphen_icon.png';

const HeaderWrapper = styled.div`
  display: flex;
  padding: 5px;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1)
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

const SwitchNetworkWrapper = styled.div`
    padding: 5px;
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
    }
}));


function Header(props) {
    const classes = useStyles();

    const onClickNetworkChange = () => {
        if(props.onClickNetworkChange) {
            props.onClickNetworkChange(props.selectedFromChain.chainId);
        }
    }
    
    return (
        <HeaderWrapper>
            <IconWrapper className={classes.headerItems, classes.logoText}>
                <img src={Logo} className={classes.logoIcon}/> Hyphen
            </IconWrapper>
            <RightMenuWrapper className={classes.headerItems}>
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