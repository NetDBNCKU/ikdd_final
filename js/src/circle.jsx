var React = require('react');
module.exports = React.createClass({
    render: function(){
        var textStyle={
            "textAnchor":"middle",
            "pointerEvents":"none"

        }
        var style = {
            //"fill":this.props.color,
            "fill":"#17becf",
            "opacity":0.7,
        }
        return(
            <g>
                <circle
                    cx = {this.props.cx}
                    cy = {this.props.cy}
                    r = {this.props.r}
                    id = {this.props.id}
                    style = {style}
                    onMouseOver = {this.props.onMouseOver}
                    onMouseOut = {this.props.onMouseOut}
                    >

                </circle>
                <text
                    fill="#555"
                    x= {this.props.cx}
                    y= {this.props.cy}
                    style={textStyle}
                    >
                    {this.props.id}
                </text>
            </g>
        )
    }
})
