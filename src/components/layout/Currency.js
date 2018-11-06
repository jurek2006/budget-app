import React from "react";

function Currency(props) {
    const { value, className } = props;
    return (
        <span className={className}>
            {new Intl.NumberFormat("pl-PLN", {
                style: "currency",
                currency: "PLN"
            }).format(value)}
        </span>
    );
}

export default Currency;
