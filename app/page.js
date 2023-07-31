"use client";
import { Fragment, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai"; 
import { GrFormNext,GrFormPrevious } from "react-icons/gr";
import { BiFirstPage, BiLastPage } from "react-icons/bi"
const buttonsData = {
  1:{
    lable:1,
    startIndex:0
  },
  2:{
    lable:2,
    startIndex:10
  },
  3:{
    lable:3,
    startIndex:20
  },
  4:{
    lable:4,
    startIndex:30
  },
  5:{
    lable:5,
    startIndex:40,
  },
}
const dropDownMenu = [
  {
    id:1,
    lable: "Role",
    value: "member",
  },
  {
    id:2,
    lable: "Role",
    value: "admin",
  }
]
export default function Home() {

  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [headerCheckBox, setCheckBoxStatus]  = useState(false)
  const [startPage,setStartPage] = useState(1);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    (async () => {
      const API = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
      const response = await fetch(API);
      const data = await response.json();
      const payLoad = data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role,
        status: false
      }));
      setData(payLoad.slice(buttonsData[startPage].startIndex,buttonsData[startPage].startIndex + 10));
    })();
  }, [startPage]);
  
  const handleDeleteUser = (userId) => {
    const filteredData = data.filter(user => user.id !== userId)
    setData(filteredData)
  }

  const handleCheckBox = (event) => {
    const isChecked = event.target.checked;
    setCheckBoxStatus(isChecked);
    setData(prevData => {
      return prevData.map(user => ({
        ...user,
        status: isChecked
      }));
    });
  };
  
  const handleStatus = (id) => {
    setData(prevData => {
      return prevData.map(user => {
        if (user.id === id) {
          return {
            ...user,
            status: !user.status
          };
        }
        return user;
      });
    });
  };
  
  const handleSearchUser = (event) => {
    setInputValue(event.target.value);
  }

  const NoRecordsFound = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <img src="/no_records1.svg" alt="norecords" className="h-[70%] w-[60%]"/>
        <h1 className="text-gray-500 font-bold text-2xl py-3">Sorry we couldn&apos;t find out user, Try another... </h1>
      </div>
    )
  }

  const deletedAllRecords = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <img src="/deleted_all.svg" alt="norecords" className="h-[45%] w-[40%]"/>
        <h1 className="text-gray-500 font-bold text-2xl py-3">You are deleted all records in current page... </h1>
      </div>
    )
  }

  const handleChangePageNumber = (pageNumber) => {
    if(headerCheckBox){
      setCheckBoxStatus(!headerCheckBox)
    }
    setStartPage(pageNumber)
  }

  const handleNextPage = () => {
    if(headerCheckBox){
      setCheckBoxStatus(!headerCheckBox)
    }
    if(startPage !== 5){
      setStartPage(startPage + 1)
    }
  }

  const handlePrevPage = () => {
    if(headerCheckBox){
      setCheckBoxStatus(!headerCheckBox)
    }
    if(startPage !== 1){
      setStartPage(startPage - 1)
    }
  }

  const handleLastPage = () => {
    if(headerCheckBox){
      setCheckBoxStatus(!headerCheckBox)
    }
    if(startPage !== 5){
      setStartPage(5)
    }
  }

  const handleFirstPage = () => {
    if(headerCheckBox){
      setCheckBoxStatus(!headerCheckBox)
    }
    if(startPage !== 1){
      setStartPage(1)
    }
  }

  const handleDeleteAll = () => {
    const beforeAction = data.filter(user => user.status !== true);
    setData(beforeAction);
  }

  const handleUpdateDetails = (event) => {
    event.preventDefault();
    const dispatchDetails = {
      id:selectedPerson.id,
      name: userName,
      email: userEmail,
      role: role
    }
    if (selectedPerson) {
      setData((prevPeople) =>
        prevPeople.map((person) =>
          person.id === dispatchDetails.id
            ? { ...person, name: dispatchDetails.name, email: dispatchDetails.email,role: dispatchDetails.role}
            : person
        )
      );
      setSelectedPerson(null);
    }
  }

  const handleUpdateUserInfo = (userObj) => {
    setSelectedPerson(userObj)
    setUserName(userObj.name)
    setUserEmail(userObj.email)
    setRole(userObj.role)
  }


  return (
    <div className="parent-container relative">
      <div>
        <input type="text" placeholder="Search by Name, Email or Role" className="serch-input" onChange={handleSearchUser}/>
      </div>
      <section>
        <div className="total-container">
          <div className="header-container">
            <div className="fields-col-input">
              <input type="checkbox" className="check-box" checked={headerCheckBox} onChange={handleCheckBox} />
            </div>
            <div className="fields-col fields">
              <p>Name</p>
            </div>
            <div className="fields-col-email fields">
              <p>Email</p>
            </div>
            <div className="fields-col fields">
              <p>Role</p>
            </div>
            <div className="fields-col fields">
              <p>Actions</p>
            </div>
          </div>
          <div className="body-container">
            {data.filter(data => data.name.toLowerCase().includes(inputValue.toLowerCase()) || data.email.toLowerCase().includes(inputValue.toLowerCase()) || data.role.toLowerCase().includes(inputValue.toLowerCase())).length !== 0 ?
              (data.filter(data => data.name.toLowerCase().includes(inputValue.toLowerCase()) || data.email.toLowerCase().includes(inputValue.toLowerCase()) || data.role.toLowerCase().includes(inputValue.toLowerCase())).map((data) =>(
              <div className={`header-container ${data.status ? "bg-[#f1f1f1]":"bg-transparent"}`} key={data.id}>
                <div className="fields-col-input">
                  <input type="checkbox"  className="check-box" checked={data.status} onChange={()=>handleStatus(data.id)}/>
                </div>
                <div className="fields-col">
                  <p>{data.name}</p>
                </div>
                <div className="fields-col-email">
                  <p>{data.email}</p>
                </div>
                <div className="fields-col">
                  <p>{data.role}</p>
                </div>
                <div className="fields-col">
                  <div className="buttons-container">
                    <button onClick={()=>handleUpdateUserInfo(data)}>
                      <FiEdit className="edit-icon"/>
                    </button>
                    <button onClick={() => handleDeleteUser(data.id)}>
                      <AiFillDelete className="edit-icon2"/>
                    </button>
                  </div>
                </div>
              </div>
            ))) : (
              <Fragment>
                {headerCheckBox === true ? deletedAllRecords(): NoRecordsFound()} 
              </Fragment>
            )}       
          </div>
        </div>
      </section>
      <section>
        <div className="flex py-3 bg-slate-200 items-center px-3">
          <button className="py-3 px-4 text-white rounded-full bg-pink-500 text-sm" onClick={handleDeleteAll}>Delete Selected</button>
          <div className="flex justify-center items-center self-center gap-6 lg:gap-10 grow">
            <button onClick={handleFirstPage} className={`paginate-buttton rounded-full flex items-center justify-center h-10 ${startPage !== 1 ? "paginate-active" : "paginate-in-active cursor-not-allowed" }`}>
              <BiFirstPage />
            </button>
            <button onClick={handlePrevPage} className={`paginate-buttton rounded-full flex items-center justify-center h-10 ${startPage !== 1 ? "paginate-active" : "paginate-in-active cursor-not-allowed" }`}>
              <GrFormPrevious />
            </button>
            <div className="flex justify-center gap-6 lg:gap-8">
              {Object.keys(buttonsData).map((buttonValue) =>(
                <button key={buttonValue} onClick={() => handleChangePageNumber(buttonsData[buttonValue].lable)} className={`paginate-buttton rounded-full ${startPage === buttonsData[buttonValue].lable ? "paginate-active" : "paginate-in-active" }`}>
                {buttonsData[buttonValue].lable}
                </button>
              ))}
            </div>
            <button onClick={handleNextPage} className={`paginate-buttton rounded-full flex items-center justify-center h-10 ${startPage !== 5 ? "paginate-active" : "paginate-in-active cursor-not-allowed" }`}>
              <GrFormNext />
            </button>
            <button onClick={handleLastPage} className={`paginate-buttton rounded-full flex items-center justify-center h-10 ${startPage !== 5 ? "paginate-active" : "paginate-in-active cursor-not-allowed" }`}>
              <BiLastPage />
            </button>
          </div> 
        </div>
      </section>
      {selectedPerson && (
        <section>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity h-screen w-full top-0 z-50 flex flex-col justify-center items-center">
          <form className="form-container bg-white rounded-lg px-5 py-5 ease-out duration-300" onSubmit={handleUpdateDetails}>
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col gap-1 items-start w-80">
                <label htmlFor="name" className="form-lable">Name</label>
                <input type="text" name="name" id="name" value={userName}  placeholder="Name" onChange={(event)=>setUserName(event.target.value)} className="form-input w-full" />
              </div>
              <div className="flex flex-col gap-1 items-start w-80">
                <label htmlFor="email" className="form-lable">Email</label>
                <input type="email" name="email" id="email" value={userEmail} placeholder="Email" onChange={(event)=>setUserEmail(event.target.value)} className="form-input w-full"/>
              </div>
              <div className="flex flex-col gap-1 items-start w-80">
                <label htmlFor="role" className="form-lable">Role</label>
                <select name="role" id="role" value={role} className="form-input w-full" onChange={(e)=>setRole(e.target.value)}>
                  {dropDownMenu.map(data=>(
                    <option key={data.id} value={data.value}>{data.value}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-10 py-10">
              <button onClick={()=>setSelectedPerson(null)} type="cancel" className="bg-gray-700 py-1 px-4 rounded-lg text-white font-semibold text-lg hover:bg-slate-500">
                Cancel
              </button>
              <button type="submit" className="bg-green-700 py-1 px-4 rounded-lg text-white font-semibold text-lg hover:bg-green-900">
                Save
              </button>
            </div>
          </form>       
        </div>
      </section>
      )}
    </div>
    
  )
}
