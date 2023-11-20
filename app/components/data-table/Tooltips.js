const Tooltip = ({ text, showTooltip, hideTooltip }) => {
    const handleMouseEnter = (e) => {
        // console.log(showTooltip)
        const { pageX, pageY } = e;
        // console.log('Tooltip position:', pageX, pageY); // Add this line for debugging
        // console.log(text)
        showTooltip(text, pageY, pageX); // Pass coordinates as separate arguments
    };

    const handleMouseLeave = () => {
        hideTooltip();
    };

    return (
        <div
            className="inline-block w-full h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="truncate">
                {text}
            </div>
        </div>
    );
};

export default Tooltip;
