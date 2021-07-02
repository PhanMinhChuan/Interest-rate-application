import logo from './logo.svg';
import './App.css';
import Modal from 'react-modal'
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TiArrowSortedDown } from 'react-icons/ti';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlineUsergroupAdd, AiOutlineClose } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { MdDone } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropagateLoader from "react-spinners/PropagateLoader";
import BarLoader from "react-spinners/BarLoader";


function App() {
  const { register, getValues} = useForm();
  const [dataShow, setDataShow] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const tenNguoiNo = useRef();
  const soTienNo = useRef();
  const phanTramLai = useRef();
  const search = useRef();

  useEffect(() => {
    fetch("https://60d45efb61160900173cb026.mockapi.io/users").then(
      (response) => response.json().then((data) => {
          setDataShow(data);
          if (localStorage.getItem('dataShow') === null) {
            localStorage.setItem('dataShow', JSON.stringify(data));
            localStorage.removeItem('dataSearch');
          } else if (localStorage.getItem('dataSearch') !== null) {
            var dataOld = JSON.parse(localStorage.getItem('dataSearch'));
            localStorage.setItem('dataShow', JSON.stringify(dataOld));
          }
      })
    );
  }, []);

  function ShowHandle() {
    var data = JSON.parse(localStorage.getItem('dataShow'));
    if (data !== null) {
      return (
        data.map((item, index) => {
          if (item.ngayNo.toString().indexOf("/") == -1) {
            var ngayNo = convert(new Date(parseInt(item.ngayNo, 10) * 1000));
            var ngayTra = convert(new Date(parseInt(item.ngayTra, 10) * 1000));
          } else {
            var ngayNo = item.ngayNo;
            var ngayTra = item.ngayTra;
          }
          var curr1 = new Date(ngayNo.toString());
          curr1.setDate(curr1.getDate());
          var ngayNoAfter = curr1.toISOString().substr(0,10);
          var curr2 = new Date(ngayTra.toString());
          curr2.setDate(curr2.getDate());
          var ngayTraAfer = curr2.toISOString().substr(0,10);
          if (!item.status) {
            return (
              <tr class="row100 body " key={index}>
                <td class="cell100 column1"><form onSubmit={() => UpdateHandle(data, index, "tenNguoiNo")}><input id="title" className="updateMe" type="text" placeholder={item.tenNguoiNo} {...register("tenNguoiNo" + index)} onBlur={() => returnValueHandle()} onClick={() => getValuePresentHandle()} /></form></td>
                <td class="cell100 column2"><table><tr><td><form onSubmit={() => UpdateHandle(data, index, "soTienNo")}><input id="title" className="updateNumberMe" type="number" placeholder={item.soTienNo} {...register("soTienNo" + index)} onBlur={() => returnValueHandle()} /></form></td><td>VND</td></tr></table></td>
                <td class="cell100 column3"><form onChange={() => UpdateHandle(data, index, "ngayNo")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayNoAfter} {...register("ngayNo" + index)}/></form></td>
                <td class="cell100 column4"><form onChange={() => UpdateHandle(data, index, "ngayTra")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayTraAfer} {...register("ngayTra" + index)}/></form></td>
                <td class="cell100 column5"><table><tr><td><form onSubmit={() => UpdateHandle(data, index, "phanTramLai")}><input id="title" className="updatePersenMe" type="number" placeholder={item.phanTramLai} {...register("phanTramLai" + index)} onBlur={() => returnValueHandle()} /></form></td><td>%</td></tr></table></td>
                <td class="cell100 column6">{MoneyMustPayHandle(item.soTienNo, item.ngayNo, item.ngayTra, item.phanTramLai)} VND</td>
                <td class="cell100 column7"><button className="deleteMe" onClick={() => DeleteHandle(data, index)}><RiDeleteBin5Line/></button></td>
              </tr>
            );
          } else {
            return (
              <tr class="row100 lineThough " key={index}>
                <td class="cell100 column1"><form onSubmit={() => UpdateHandle(data, index, "tenNguoiNo")}><input id="title" className="updateMe" type="text" placeholder={item.tenNguoiNo} {...register("tenNguoiNo" + index)} onBlur={() => returnValueHandle()}/></form></td>
                <td class="cell100 column2"><table><tr><td><form onSubmit={() => UpdateHandle(data, index, "soTienNo")}><input id="title" className="updateNumberMe" type="number" placeholder={item.soTienNo} {...register("soTienNo" + index)} onBlur={() => returnValueHandle()} /></form></td><td>VND</td></tr></table></td>
                <td class="cell100 column3"><form onChange={() => UpdateHandle(data, index, "ngayNo")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayNoAfter} {...register("ngayNo" + index)}/></form></td>
                <td class="cell100 column4"><form onChange={() => UpdateHandle(data, index, "ngayTra")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayTraAfer} {...register("ngayTra" + index)}/></form></td>
                <td class="cell100 column5"><table><tr><td><form onSubmit={() => UpdateHandle(data, index, "phanTramLai")}><input id="title" className="updatePersenMe" type="number" placeholder={item.phanTramLai} {...register("phanTramLai" + index)} onBlur={() => returnValueHandle()} /></form></td><td>%</td></tr></table></td>
                <td class="cell100 column6">{MoneyMustPayHandle(item.soTienNo, item.ngayNo, item.ngayTra, item.phanTramLai)} VND</td>
                <td class="cell100 column7"></td>
              </tr>
            );
          }
        })
      );
    }
  }

  function MoneyMustPayHandle(soTienNo ,ngayNo, ngayTra, phanTramLai) {
    var date = new Date(ngayNo);
    var date1 = new Date(ngayTra);
    var difference= Math.abs(date1-date);
    var days = difference/(1000 * 3600 * 24);
    var soTienPhaiTra = (soTienNo*days*phanTramLai/100)+parseInt(soTienNo);
    return soTienPhaiTra;
  }

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("/");
  }

  function AddHandle(tenNguoiNo1, soTienNo1, phanTramLai1) {
    var obj = {
      tenNguoiNo : tenNguoiNo1,
      soTienNo : soTienNo1,
      ngayNo : convert(selectedDateStart),
      ngayTra : convert(selectedDateEnd),
      phanTramLai : phanTramLai1
    }
    var data = JSON.parse(localStorage.getItem('dataShow'));
    data.unshift(obj);
    localStorage.setItem('dataShow', JSON.stringify(data));
    setDataShow(dataShow);
  }

  function DeleteHandle(data, item) {
    var obj = data[item];
    obj.status = true;
    data.splice(item, 1);
    data.push(obj);
    localStorage.setItem('dataShow', JSON.stringify(data));
    setDataShow(data);
  }

  function sortName() {
    var data = JSON.parse(localStorage.getItem('dataShow'));
    data.sort(function(a,b){return a.tenNguoiNo.localeCompare(b.tenNguoiNo)});
    localStorage.setItem('dataShow', JSON.stringify(data));
    localStorage.removeItem('dataSearch');
    setDataShow(data);
  }

  function sortDate() {
    var data = JSON.parse(localStorage.getItem('dataShow'));
    data.sort(function(a,b){return a.ngayTra.toString().localeCompare(b.ngayTra)});
    localStorage.setItem('dataShow', JSON.stringify(data));
    localStorage.removeItem('dataSearch');
    setDataShow(data);
  }

  function searchHandle(search11) {
    var data = JSON.parse(localStorage.getItem('dataShow'));
    localStorage.setItem('dataSearch', JSON.stringify(data));
    const b = data.filter(item => item.tenNguoiNo.toLowerCase().indexOf(search11) > -1);
    localStorage.setItem('dataShow', JSON.stringify(b));
    setDataShow(b);
  }

  function UpdateHandle(data, index, nameProp) {
    switch(nameProp) {
      case "tenNguoiNo":
        data[index].tenNguoiNo = getValues(nameProp + index);
        break;
      case "soTienNo":
        data[index].soTienNo = getValues(nameProp + index);
        break;
      case "ngayNo":
        data[index].ngayNo = getValues(nameProp + index);
        break;
      case "ngayTra":
        data[index].ngayTra = getValues(nameProp + index);
        break;
      case "phanTramLai":
        data[index].phanTramLai = getValues(nameProp + index);
        break;
    }
    localStorage.setItem('dataShow', JSON.stringify(data));
    setDataShow(data);
  }

  function returnValueHandle() {
    window.location.reload(false);
  }

  function getValuePresentHandle() {
    alert('OK');
  }
  
  return (
    <div className="colorMe">
      <h2 className="titleMe">Lãi Suất Ngân Hàng</h2>
      <PropagateLoader color='#00ad5f' size={15}/>
      <BarLoader color='#00ad5f' size={15}/>
      <div class="limiter"> 
        <div class="container-table100">
          <div class="wrap-table100">
            <form class="input-group searchMe" onSubmit={() => searchHandle(search.current.value)}>
              <div class="form-outline">
                <input id="search-focus" type="search" id="form1" class="cssMe" placeholder="Search name" ref={search} onClickOut/>
              </div>
              <button type="button" class="btn btn-primary styleMe" onClick={() => searchHandle(search.current.value)}>
                <BsSearch/>
              </button>
              <span className="buttonMe" onClick={() => setModalIsOpen(true)}><AiOutlineUsergroupAdd/></span>
            </form>
            <Modal 
              isOpen={modalIsOpen}
              style={
                {
                  content: {
                    color:'#555555',
                    margin: '20px auto auto auto',
                    height: '60%',
                    width: '30%',
                    border: '1px solid black',
                    borderRadius: '3%',
                    backgroundColor: 'whitesmoke'
                  }
                }
              }
            >
                <h1 style={{marginLeft: '69px', backgroundColor: 'whitesmoke' ,fontFamily: 'Alex Brush', fontSize:'40px'}} >Thêm thành viên <button className="closeMe" onClick={() => setModalIsOpen(false)}><AiOutlineClose/></button></h1>
                <hr style={{color:'black', height:'3px'}}/>
                <form class="formMe" onSubmit={() => AddHandle(tenNguoiNo.current.value, soTienNo.current.value, phanTramLai.current.value)}><br/>
                    <label class="lableMe">Tên người nợ:</label>
                    <input type="text" class="inputMe" ref={tenNguoiNo} required/><br/>
                    <label class="lableMe">Số tiền nợ:</label>
                    <input type="number" class="inputMe" ref={soTienNo} required/><br/>
                    <label class="lableMe">Ngày nợ: <span class="lableMeMe">Ngày trả:</span></label><br/>
                    <DatePicker 
                      placeholderText="yyyy/mm/dd"
                      selected={selectedDateStart}
                      onChange={date => setSelectedDateStart(date)}
                      dateFormat='yyyy/MM/dd'
                      maxDate={new Date()}
                      isClearable
                      className="datePickStyle"
                      required
                    />
                    <DatePicker 
                      placeholderText="yyyy/mm/dd"
                      selected={selectedDateEnd}
                      onChange={date => setSelectedDateEnd(date)}
                      dateFormat='yyyy/MM/dd'
                      minDate={new Date()}
                      isClearable
                      className="datePickStyle"
                      required
                    /><br/><br/>
                    <label class="lableMe">Lãi (%):</label>
                    <input type="number" class="inputMe" ref={phanTramLai} required/><br/>
                    <button type="submit" class="submitMe"><MdDone/></button>
                </form>
            </Modal>
            <div class="table100 ver3 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th class="cell100 column1">Tên người nợ &nbsp;<button style={{color:'aquamarine'}} onClick={() => sortName()}><TiArrowSortedDown /></button></th>
                      <th class="cell100 column2">Số tiền nợ (VND)</th>
                      <th class="cell100 column3"><span style={{paddingLeft: '7px'}}>Ngày nợ</span></th>
                      <th class="cell100 column4">Ngày trả &nbsp;<button style={{color:'aquamarine'}} onClick={() => sortDate()}><TiArrowSortedDown /></button></th>
                      <th class="cell100 column5"><span style={{paddingLeft: '16px'}}>Lãi (%)</span></th>
                      <th class="cell100 column6">Nợ phải trả</th>
                      <th class="cell100 column7">Function</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="table100-body js-pscroll">
                <table>
                  <tbody>
                    {ShowHandle()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
