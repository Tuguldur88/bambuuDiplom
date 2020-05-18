import React from 'react';
import CanvasJSReact from './canvas.js/canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class amountChart extends React.Component {
	constructor() {
		super();
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
	}

	
	toggleDataSeries(e){
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else{
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}
	
	render() {

		const aldatas = this.props.data
		const covot = this.props.formData.covot
		const chartData = [{"data1":[]},{"data2":[]},{"data3":[]},{"data4":[]},{"data5":[]}]
		for(var i=0; i < aldatas.length; i++)
		{
			if(0 == aldatas[i][2])
			{
					chartData[0].data1.push({"x":aldatas[i][0],"y":aldatas[i][1]})
			}
			if(1 == aldatas[i][2])
			{
					chartData[1].data2.push({"x":aldatas[i][0],"y":aldatas[i][1]})
			}
			if(2 == aldatas[i][2])
			{
					chartData[2].data3.push({"x":aldatas[i][0],"y":aldatas[i][1]})
			}
			if(3 == aldatas[i][2])
			{
					chartData[3].data4.push({"x":aldatas[i][0],"y":aldatas[i][1]})
			}
			if(4 == aldatas[i][2])
			{
					chartData[4].data5.push({"x":aldatas[i][0],"y":aldatas[i][1]})
			}
		}
		







		const options = {
			animationEnabled: true,
			title:{
				text: covot + " Хэсэгт ангилав"
			},
			axisX: {
				title:this.props.formData.coordinatX + " Багана"
			},
			axisY:{
				title:this.props.formData.coordinatY + " Багана"
			},
			data: [{
				type: "scatter",
				toolTipContent: "<span style=\"color:#4F81BC \"><b></b></span><br/><b> X:</b> {x} <br/><b> Y:</b></span> {y} ",
				name: "1 Хэсэг",
				showInLegend: true,
				dataPoints: chartData[0].data1
			},
			{
				type: "scatter",
				name: "2 Хэсэг",
				showInLegend: true, 
				toolTipContent: "<span style=\"color:#C0504E \"><b></b></span><br/><b> X:</b> {x} <br/><b> Y:</b></span> {y} ",
				dataPoints: chartData[1].data2
			},
			{
				type: "scatter",
				name: "3 Хэсэг",
				showInLegend: true, 
				toolTipContent: "<span style=\"color:#C0504E \"><b></b></span><br/><b> X:</b> {x} <br/><b> Y:</b></span> {y} ",
				dataPoints: chartData[2].data3
			},
			{
				type: "scatter",
				name: "4 Хэсэг",
				showInLegend: true, 
				toolTipContent: "<span style=\"color:#C0504E \"><b></b></span><br/><b> X:</b> {x} <br/><b> Y:</b></span> {y} ",
				dataPoints: chartData[3].data4
			},
			{
				type: "scatter",
				name: "5 Хэсэг",
				showInLegend: true, 
				toolTipContent: "<span style=\"color:#C0504E \"><b></b></span><br/><b> X:</b> {x} <br/><b> Y:</b></span> {y} ",
				dataPoints: chartData[4].data5
			}]
		}
		
		
		return (
		<div>
			<CanvasJSChart options = {options} onRef={ref => this.chart = ref}/>
		</div>
		);
	}
			
}

  export default amountChart;
