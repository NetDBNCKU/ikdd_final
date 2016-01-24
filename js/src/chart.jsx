var React = require('react');
var Circles = require('./circles')
module.exports = React.createClass({
    getInitialState: function(){
        var margin = {top:50, bottom:50, left:100, right:100};
        var xScale = d3.scale.linear().range([margin.left, this.props.width - margin.right]);
        var yScale = d3.scale.linear().range([this.props.height - margin.bottom, margin.top]);
        var rScale = d3.scale.sqrt().range([5,40]);
        var colorScale = d3.scale.category20();
        return({
            xScale:xScale,
            yScale:yScale,
            rScale:rScale,
            colorScale:colorScale,
            year:1998,
            margin:margin,
            population_data:[],
            cityArr:[],
            y_axis_data:[],
            x_axis_data:[],
            showCity:"臺北市",
            xField:"歲入(百萬元)",
            yField:"刑案犯罪率(人/十萬人)",
        })
    },
    getDefaultProps: function(){
        return({
            width:1000,
            height:600,
            msPerYear:500,
        })
    },
    componentDidMount: function(){
        //default data
        d3.csv('./data/population.csv', function(population){
            var max = 0;
            population.map(function(year){//find the max value
                max = (parseFloat(year['臺北市']) > max) ? parseFloat(year['臺北市']) : max;
            });
            var rScale = this.state.rScale.domain([0, max * 1.1]);
            this.setState({
                rScale:rScale,
                population_data:population,
            });
        }.bind(this));
        d3.csv('./data/x/annual_income.csv', function(x_axis){
            var max = 0;
            var min = 100000000;
            console.log(x_axis);
            x_axis.map(function(year){//find the max value
                Object.keys(year).map(function(d){
                    if(d === "臺灣地區" || d === '年份' || d === "總計"){return;}
                    max = (parseFloat(year[d]) > max) ? parseFloat(year[d]) : max;
                    min = (parseFloat(year[d]) < min) ? parseFloat(year[d]) : min;
                })
            });
            var xScale = this.state.xScale.domain([min * 0.9, max * 1.1]);
            var axis = d3.svg.axis().scale(xScale).ticks(5).orient("bottom");
            d3.select("#xAxis").call(axis)
            this.setState({
                x_axis_data: x_axis,
                xScale: xScale,
            });
        }.bind(this));
        d3.csv('./data/y/crime_rate.csv', function(y_axis){
            var max = 0;
            y_axis.map(function(year){//find the max value
                Object.keys(year).map(function(d){
                    if(d === "臺灣地區" || d === "年份" || d === "總計"){return;}
                    max = (parseFloat(year[d]) > max) ? parseFloat(year[d]) : max;
                })
            });
            var yScale = this.state.yScale.domain([0, max * 1.1]);
            var axis = d3.svg.axis().scale(yScale).ticks(5).orient("left");
            d3.select("#yAxis").call(axis)
            var cityArr = [];
            Object.keys(y_axis[0]).map(function(d){
                if(d !== '總計' && d !== '年份' && d !== '臺灣地區'){
                    cityArr.push(d);
                }
            })
            this.setState({
                y_axis_data: y_axis,
                yScale: yScale,
                cityArr:cityArr,

            });
        }.bind(this));
        this.startInterval();
        $('.ui.dropdown').dropdown();
        $('.ui.dropdown select').change(function(){
            var filename = $('.ui.dropdown select').val();
            this.changeFile(filename);
        }.bind(this))
    },
    changeFile:function(filename){
        if( filename == 'unemployment.csv'){
            this.setState({
                xField:"失業率（％）"
            })
        }
        else if( filename == 'annual_income.csv'){
            this.setState({
                xField:"歲入（百萬元）"
            })
        }
        else if( filename == 'labor_force.csv'){
            this.setState({
                xField:"勞動力人口數（人/千人）"
            })
        }
        else if( filename == 'people_in.csv'){
            this.setState({
                xField:"遷入人口數（人）"
            })
        }
        else if( filename == 'person_density.csv'){
            this.setState({
                xField:"人口密度（人/平方公里）"
            })
        }
        else if( filename == 'sex.csv'){
            this.setState({
                xField:"性比例（女=100）"
            })
        }
        d3.csv('./data/x/' + filename, function(x_axis){
            var max = 0;
            var min = 100000000;
            x_axis.map(function(year){//find the max value
                Object.keys(year).map(function(d){
                    if(d === "臺灣地區" || d === '年份' || d === "總計"){return;}
                    max = (parseFloat(year[d]) > max) ? parseFloat(year[d]) : max;
                    min = (parseFloat(year[d]) < min) ? parseFloat(year[d]) : min;
                })
            });
            var xScale = this.state.xScale.domain([min * 0.9, max * 1.1]);
            var axis = d3.svg.axis().scale(xScale).ticks(5).orient("bottom");
            d3.select("#xAxis").call(axis)
            this.setState({
                x_axis_data: x_axis,
                xScale: xScale,
                year:1998,
            });
        }.bind(this));
        this.stopInterval();
        this.startInterval();
    },
    startInterval: function(){
        var interval = window.setInterval(function(){
            if(this.state.year > 2014){
                this.setState({year:1998})
                return
            }
            this.setState({year:this.state.year + 1/30})
        }.bind(this),this.props.msPerYear/30);
        this.setState({
            interval:interval,
        })
    },
    stopInterval: function(){
        window.clearInterval(this.state.interval);
    },
    circleOnMouseOver: function(e){
        this.stopInterval();
        this.setState({
            showCity:e.target.getAttribute('id'),
        })
    },
    circleOnMouseOut: function(){
        this.startInterval();
    },
    value:function(){
        if(this.state.x_axis_data.length > 0 && this.state.showCity != undefined){
            return(
                this.state.x_axis_data[Math.floor(this.state.year) - 1998][this.state.showCity]
            )
        }

    },
    render: function(){
        return(
            <div>
                <svg id="svg" width = {this.props.width} height = {this.props.height}>
                    <g id="yAxis"
                        transform={"translate(" + this.state.margin.left + ", 0)"}
                        >
                        <text fill="#555"
                            x={-40}
                            y={this.state.margin.top - 10}
                            >
                            {this.state.yField}
                        </text>
                    </g>
                    <g id="xAxis"
                        transform={"translate(0," + (this.props.height - this.state.margin.bottom) + ")"}
                        >
                        <text fill="#555"
                            x={this.props.width - this.state.margin.right - 50}
                            y={30}
                            >
                            {this.state.xField}
                        </text>

                    </g>
                    <Circles {...this.state}
                        circleOnMouseOver = {this.circleOnMouseOver}
                        circleOnMouseOut = {this.circleOnMouseOut}
                        >

                    </Circles>
                </svg>
                <div id="right">
                    <select className="ui dropdown" defaultValue="annual_income.csv">
                        <option value="annual_income.csv">歲入</option>
                        <option value="labor_force.csv">勞動力</option>
                        <option value="people_in.csv">遷入人口</option>
                        <option value="people_density.csv">人口密度</option>
                        <option value="sex.csv">性別比</option>
                    </select>
                    <div id= 'year'>
                        {Math.floor(this.state.year)}
                    </div>
                    <div id='city'>
                        {this.state.showCity}
                    </div>
                    <div id='value'>
                        {"數值：" + this.value()}
                    </div>
                </div>

            </div>
        )
    },
})
