import React from "react";

const TrimmedText = (props) => {
    if(props && props.text && props.text.length) {
        let startIndex = props.startIndex;
        let endIndex = props.endIndex;
        if(startIndex == undefined || endIndex == undefined) {
            throw new Error("startIndex and endIndex must be passed as attributes to TrimmedText component");
        }
        if(startIndex > endIndex) {
            throw new Error(`startIndex ${startIndex} can't be greater than endIndex ${endIndex}`);
        }
        if(startIndex > props.text.length || endIndex > props.text.length) {
            throw new Error(`startIndex and endIndex should be less than ${props.text.length}`);
        }
        
        return (
            <div className={props.className}>
                {typeof props.text === 'number' ? props.text : props.text ? props.text.slice(0, startIndex) + '...' + props.text.slice(endIndex, props.text.length) : "Not Applicable"}
            </div>
        )
    } else {
        return (
            <div>
                {props.text}
            </div>
        )
    }

};

export default TrimmedText;