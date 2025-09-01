import './App.css';
import { Route, Routes } from 'react-router-dom';
import AddFund from './Pages/AddFund/addfund';
import Fund from './Pages/Home/home';
import AddExpense from './Pages/AddExpense/addexpense';
import AddPerson from './Pages/Addpearson/addperson';
import AddCategory from './Pages/AddCategory/addcategory';
import EditPerson from './Pages/EditPerson/editperson';
import Client from './Pages/Client/person';
import Category from './Pages/Categories/category';
import Reports from './Pages/Reports/reports';
import Login from './Pages/Login/login';
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Fund />} />
        <Route path="/addfund" element={<AddFund />} />
        <Route path="/Category-page" element={<Category />} />
        <Route path="/addexpense" element={<AddExpense />} />
        <Route path="/addperson" element={<AddPerson />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/editperson/:id" element={<EditPerson />} />
        <Route path="/clientdetails" element={<Client />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
