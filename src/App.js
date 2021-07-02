import logo from './logo.svg';
import './App.css';
// import Button from 'react-bootstrap'
import Modal from 'react-modal'
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TiArrowSortedDown } from 'react-icons/ti';
import { BsSearch } from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function App() {
  const { register, getValues, watch} = useForm();
  const [dataShow, setDataShow] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const tenNguoiNo = useRef();
  const soTienNo = useRef();
  const phanTramLai = useRef();
  const search = useRef();
  const tenNguoiNoNo = useRef();
  //const [prop, setProp] = useState('')


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
    return (
      data.map((item, index) => {
        if (item.ngayNo.toString().indexOf("/") == -1) {
          var ngayNo = convert(new Date(parseInt(item.ngayNo, 10) * 1000));
          var ngayTra = convert(new Date(parseInt(item.ngayTra, 10) * 1000));
        } else {
          var ngayNo = item.ngayNo;
          var ngayTra = item.ngayTra;
        }
        if (!item.status) {
          return (
            <tr class="row100 body " key={index}>
              <td class="cell100 column1"><form onSubmit={() => UpdateHandle(data, index, "tenNguoiNo")}><input id="title" className="updateMe" type="text" defaultValue={item.tenNguoiNo} {...register("tenNguoiNo" + index)}/></form></td>
              <td class="cell100 column2"><form onSubmit={() => UpdateHandle(data, index, "soTienNo")}><input id="title" className="updateMe" type="number" defaultValue={item.soTienNo} {...register("soTienNo" + index)}/><label>VND</label></form></td>
              <td class="cell100 column3"><form onSubmit={() => UpdateHandle(data, index, "ngayNo")}>
                <DatePicker 
                  placeholderText="yyyy/mm/dd"
                  //selected={selectedDateEnd}
                  defaultValue={ngayNo}
                  dateFormat='yyyy/MM/dd'
                  minDate={new Date()}
                  isClearable
                  className="datePickStyle"
                  required
                /></form>
              </td>
              <td class="cell100 column4"><form onSubmit={() => UpdateHandle(data, index, "ngayTra")}>{ngayTra}</form></td>
              <td class="cell100 column5"><form onSubmit={() => UpdateHandle(data, index, "phanTramLai")}><input id="title" className="updateMe" type="number" defaultValue={item.phanTramLai} {...register("phanTramLai" + index)}/><label> %</label></form></td>
              <td class="cell100 column6">{MoneyMustPayHandle(item.soTienNo, item.ngayNo, item.ngayTra, item.phanTramLai)} VND</td>
              <td class="cell100 column7"><button className="deleteMe" onClick={() => DeleteHandle(data, index)}>DELETE</button></td>
            </tr>
          );
        } else {
          return (
            <tr class="row100 body lineThough" key={index}>
              <td class="cell100 column1"><input id='title' type="text" className="updateMe" defaultValue={item.tenNguoiNo} /></td>
              <td class="cell100 column2">{item.soTienNo} VND</td>
              <td class="cell100 column3">{ngayNo}</td>
              <td class="cell100 column4">{ngayTra}</td>
              <td class="cell100 column5">{item.phanTramLai}%</td>
              <td class="cell100 column6">{MoneyMustPayHandle(item.soTienNo, item.ngayNo, item.ngayTra, item.phanTramLai)} VND</td>
              <td class="cell100 column7"></td>
            </tr>
          );
        }
      })
    );
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
  
  return (
    <div className="colorMe">
      <h2 className="titleMe">Lãi Suất Ngân Hàng</h2><br/>
      <div class="limiter">
        <div class="container-table100">
          <div class="wrap-table100">
            <form class="input-group searchMe" onSubmit={() => searchHandle(search.current.value)}>
              <div class="form-outline">
                <input id="search-focus" type="search" id="form1" class="cssMe" placeholder="Search name" ref={search}/>
              </div>
              <button type="button" class="btn btn-primary styleMe" onClick={() => searchHandle(search.current.value)}>
                <BsSearch/>
              </button>
              <span className="buttonMe" onClick={() => setModalIsOpen(true)}>Add</span>
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
                <h1 style={{marginLeft: '50px', backgroundColor: 'whitesmoke'}} >Thêm thành viên <button className="closeMe" onClick={() => setModalIsOpen(false)}>X</button></h1>
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
                    <button type="submit" class="submitMe">Add</button>
                </form>
            </Modal>
            <div class="table100 ver3 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th class="cell100 column1">Tên người nợ &nbsp;<button style={{color:'aquamarine'}} onClick={() => sortName()}><TiArrowSortedDown /></button></th>
                      <th class="cell100 column2">Số tiền nợ (VND)</th>
                      <th class="cell100 column3">Ngày nợ</th>
                      <th class="cell100 column4">Ngày trả &nbsp;<button style={{color:'aquamarine'}} onClick={() => sortDate()}><TiArrowSortedDown /></button></th>
                      <th class="cell100 column5">Lãi (%)</th>
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
