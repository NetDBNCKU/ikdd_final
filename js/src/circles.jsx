var React = require('react');
var Circle = require('./circle')
module.exports = React.createClass({
    getInitialState:function(){
        var bottom_index = Math.floor(this.props.year) - 1998
        var y_data = this.props.y_axis_data[bottom_index];
        var x_data = this.props.x_axis_data[bottom_index];
        var population_data = this.props.population_data[bottom_index];
        return({
            y_data:y_data,
            x_data:x_data,
            population_data:population_data,
        })
    },
    componentWillReceiveProps: function(nextProps){

        var y_data = this.computeData(nextProps.y_axis_data,nextProps.year);
        var x_data = this.computeData(nextProps.x_axis_data,nextProps.year);
        var population_data = this.computeData(nextProps.population_data,nextProps.year);
        this.setState({
            y_data:y_data,
            x_data:x_data,
            population_data:population_data,
        })
    },
    computeData: function(dataArr,year){
        var bottom_year = Math.floor(year);
        var top_year = Math.ceil(year);
        var bottom_rate = year - bottom_year;
        var top_rate = top_year - year;
        if(top_year == bottom_year){
            bottom_rate = 0.5;
            top_rate = 0.5;
        }
        var top_obj = dataArr[top_year - 1998];
        var bottom_obj = dataArr[bottom_year - 1998];
        var dataObj = {}
        this.props.cityArr.map(function(d){
            dataObj[d] = bottom_obj[d] * top_rate + top_obj[d] * bottom_rate;
        });
        return dataObj;
    },
    circle: function(){
        var props = this.props;
        var state = this.state;
        return props.cityArr.map(function(city_name){
            var yVal = props.yScale(state.y_data[city_name]);
            var xVal = props.xScale(state.x_data[city_name]);
            var populationVal = props.rScale(state.population_data[city_name]);
            var color = props.colorScale(city_name);

            if(isNaN(yVal) || isNaN(xVal) || isNaN(populationVal)){}
            else{
                return(<Circle color={color}
                            key={city_name}
                            id={city_name}
                            cy = {yVal} cx = {xVal}
                            r = {populationVal}
                            onMouseOver = {this.props.circleOnMouseOver}
                            onMouseOut = {this.props.circleOnMouseOut}
                            >
                        </Circle>)

            }
        }.bind(this))
    },
    render: function(){
        return(
            <g id = "circles">
                {this.circle()}
            </g>
        )
    },
})
