import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../../components/Cards/TransactionInfoCard'
import moment from 'moment'

const ExpenseTransactions = ({transactions, onSeeMore}) => {
    console.log("trans",transactions);
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='flex-lg'>Expenses</h5>
            <button className='card-btn' onClick={onSeeMore}>
                See All <LuArrowRight className='text-base'/>
            </button>
        </div>

        <div className='mt-6'>
            {transactions?.slice(0,5)?.map((expense) => (
                <TransactionInfoCard
                key={expense._id}
                title={expense.category}
                icon={expense.icon}
                date={moment(expense.date).format("Do MMM YYYY")}
                amount={expense.amount}
                type="expense"
                hideDeleteBtn/>
            ))}
        </div>
    </div>
  );
};

export default ExpenseTransactions