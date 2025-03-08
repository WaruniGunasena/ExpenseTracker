import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import {useUserAuth} from "../../hooks/useUserAuth";
import { data, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/Cards/InfoCard';

import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import {IoMdCard} from "react-icons/io";
import { addThousandsSeparator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomesWithChart from '../../components/Dashboard/RecentIncomesWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async() => {
    if(loading) return;

    setLoading(true);
    
    try{
      const response =await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      if(response.data){
        console.log("data",response.data);
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() =>{
    fetchDashboardData();
    return() =>{};
  }, []);



  return (
    <DashboardLayout activeMenu = 'Dashboard'>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
          icon = {<IoMdCard/>}
          label="Total Balance"
          value = {addThousandsSeparator(dashboardData?.totalBalance || 0)}
          color = "bg-primary"></InfoCard>

          <InfoCard
          icon = {<LuHandCoins/>}
          label="Total Income"
          value = {addThousandsSeparator(dashboardData?.totalIncome || 0)}
          color = "bg-orange-500"></InfoCard>

          <InfoCard
          icon = {<LuWalletMinimal/>}
          label="Total Expense"
          value = {addThousandsSeparator(dashboardData?.totalExpense || 0)}
          color = "bg-red-500"></InfoCard>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <RecentTransactions
          transactions = {dashboardData?.recentTransations}
          onSeeMore = {() => navigate("/expense")}></RecentTransactions>

          <FinanceOverview
            totalBalance ={dashboardData?.totalBalance || 0}
            totalIncome = {dashboardData?.totalIncome || 0}
            totalExpense ={dashboardData?.totalExpense || 0} 
          ></FinanceOverview>

          <ExpenseTransactions
            transactions = {dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore = {() => navigate("/expense")}/>

            <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}/>

            <RecentIncomesWithChart
            data = {dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
            totalIncome ={dashboardData?.totalIncome || 0}/>

            <RecentIncome 
              transactions ={dashboardData?.last60DaysIncome?.transactions || []}
              onSeeMore={() => navigate("/income")}/>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home