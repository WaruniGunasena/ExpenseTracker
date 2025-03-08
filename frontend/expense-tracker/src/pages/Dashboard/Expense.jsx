import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosinstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import toast from 'react-hot-toast';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data:null,
  });
  
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);

  //Get all expense details
  const fetchExpenseDetails = async () => {
    if(loading) return;

    setLoading(true);

    try{
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if(response.data) {
        setExpenseData(response.data);
      }
    } catch(error){
      console.log("Something went wrong. Please try again.", error);
    } finally{
      setLoading(false);
    }
  };

  //Handle add expense
  const handleAddExpense = async (expense) => {
    const {category, amount, date, icon} = expense;

    //validate checks
    if(!category.trim()){
      FaTowerBroadcast.error("Category is required.");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <=0) {
      toast.error("Amount shoud be a valid number grater than 0.");
      return;
    }

    if(!date){
      toast.error("Date is required.");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding expense:",
      error.response?.data?.message || error.message);
    }
  };

  //Delete Expense
  const deleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({show: false, data:null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch(error){
      console.error(
      "Error deleting expense:",
      error.response?.data?.message || error.message
    );
  }
  };

  //handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{
          responseType: "blob",
        }
      );
      //create aURL for the blob
      const url =window.URL.createObjectURL(new Blob ([response.data]))
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch(error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };
  
  useEffect(() => {
      fetchExpenseDetails();  
    
      return () => {};
    }, []);
    
    
  return (
   <DashboardLayout activeMenu = 'Expense'>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview 
              transactions={expenseData}
              onExpenseIncome = {() => setOpenAddExpenseModel(true)}/>
          </div>
          <ExpenseList
            transactions= {expenseData}
            onDelete ={(id) => {
              setOpenDeleteAlert({show: true, data:id});
            }}
            onDownload ={handleDownloadExpenseDetails}/>
        </div>
        
        <Modal 
          isOpen={openAddExpenseModel}
          onClose ={() => setOpenAddExpenseModel(false)}
          title ="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title="Delete Expense">
            <DeleteAlert
              content="Are you sure to delete this expense detail."
              onDelete ={() => deleteExpense(openDeleteAlert.data)}/>
          </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;