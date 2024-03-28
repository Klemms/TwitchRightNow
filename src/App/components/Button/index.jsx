import React from "react";
import PropTypes from "prop-types";

const Button = React.memo(React.forwardRef(function Button({children, className, onClick, title}, ref) {
    return (
        <div ref={ref} className={className} onClick={onClick} title={title}>
            {children}
        </div>
    );
}));

Button.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string
};

export default Button;
