"use client"

import React from 'react'
import {Chart as ChartJS,ArcElement,Tooltip,Legend} from 'chart.js'
import {Doughnut} from "react-chartjs-2"
ChartJS.register(ArcElement,Tooltip,Legend)


const DoughNutChart = ({accounts}:DoughnutChartProps) => {
  {console.log("doughnut account ",accounts)}
  const names=accounts.map((a)=>{
    return a.officialName
  })
  
  const balances=accounts.map((a)=>{
    return a.currentBalance
  })
  
  const data={
    datasets:[
        {
            label:"Banks",
            data:balances,
            backgroundColor:['#0747b6','#2265d8','#2f91fa']
        }
    ],
    labels:names
  }
  
    return (
    <Doughnut data={data} options={{
        cutout:'60%',
        plugins:{
            legend:{
                display:false
            }
        }
    }} />
  )
}

export default DoughNutChart
