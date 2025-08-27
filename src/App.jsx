import './App.css';
import { Route, Routes } from 'react-router-dom';
import AddFund from './Pages/AddFund/addfund';
import Fund from './Pages/Home/home';
import AddExpense from './Pages/AddExpense/addexpense';
import AddPerson from './Pages/Addpearson/addperson';
import AddCategory from './Pages/AddCategory/addcategory';
import EditPerson from './Pages/EditPerson/editperson';
import Client from './Pages/Client/person';
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Fund />} />
        <Route path="/addfund" element={<AddFund />} />
        <Route path="/addexpense" element={<AddExpense />} />
        <Route path="/addperson" element={<AddPerson />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/editperson/:id" element={<EditPerson />} />
        <Route path="/clientdetails" element={<Client />} />
      </Routes>
    </>
  );
};

export default App;
