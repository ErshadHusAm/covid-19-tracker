import React from 'react'
import {
    Card,
    CardContent,
    Typography
  } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({title, cases, active, isRed, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
            <CardContent>  
                <Typography className="infoBox__title" color="textPrimary">
                    {title} <small>(today)</small>
                </Typography>
                <h1 className="infoBox__cases">{cases}</h1>
                <Typography className="infoBox__total" color="textSecondary">
                Total - {total} 
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
