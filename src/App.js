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
    //return () => {
    fetch("https://60d45efb61160900173cb026.mockapi.io/users").then(
      (response) => response.json().then((data) => {
          //setDataShow(data);
          //localStorage.removeItem('dataShow');
          //console.log(typeof localStorage.getItem('dataShow'), "type local")
          //console.log(localStorage.getItem('dataShow'), "value")
          if (localStorage.getItem('dataShow') === null) {
            localStorage.setItem('dataShow', JSON.stringify(data));
            //localStorage.setItem('modalIsOpen', false);
            localStorage.removeItem('dataSearch');
          } else if (localStorage.getItem('dataSearch') !== null) {
            var dataOld = JSON.parse(localStorage.getItem('dataSearch'));
            localStorage.setItem('dataShow', JSON.stringify(dataOld));
          }
      })
    );
    //}
  }, []);

  function ShowHandle() {
    var data = JSON.parse(localStorage.getItem('dataShow'));
    if (data !== null) {
      return (
        data.map((item, index) => {
          if (item.ngayNo.toString().indexOf("/") == -1) {
            var ngayNo = convert(new Date(parseInt(item.ngayNo, 10) * 1000)); //H??m comparse
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
          if (!item.status) { //uuid
            return (
              <tr class="row100 body " key={item.id}>
                <td class="cell100 column1"><form onSubmit={() => UpdateHandle(data, item.id, "tenNguoiNo")}><input id="title" className="updateMe" type="text" defaultValue={item.tenNguoiNo} {...register("tenNguoiNo" + item.id)} onBlur={() => returnValueHandle()}/></form></td>
                <td class="cell100 column2"><table><tr><td><form onSubmit={() => UpdateHandle(data, item.id, "soTienNo")}><input id="title" className="updateNumberMe" type="number" defaultValue={item.soTienNo} {...register("soTienNo" + item.id)} onBlur={() => returnValueHandle()} /></form></td><td>VND</td></tr></table></td>
                <td class="cell100 column3"><form onChange={() => UpdateHandle(data, item.id, "ngayNo")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayNoAfter} {...register("ngayNo" + item.id)}/></form></td>
                <td class="cell100 column4"><form onChange={() => UpdateHandle(data, item.id, "ngayTra")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayTraAfer} {...register("ngayTra" + item.id)}/></form></td>
                <td class="cell100 column5"><table><tr><td><form onSubmit={() => UpdateHandle(data, item.id, "phanTramLai")}><input id="title" className="updatePersenMe" type="number" defaultValue={item.phanTramLai} {...register("phanTramLai" + item.id)} onBlur={() => returnValueHandle()} /></form></td><td>%</td></tr></table></td>
                <td class="cell100 column6">{MoneyMustPayHandle(item.soTienNo, item.ngayNo, item.ngayTra, item.phanTramLai)} VND</td>
                <td class="cell100 column7"><button className="deleteMe" onClick={() => DeleteHandle(data, index)}><RiDeleteBin5Line/></button></td>
              </tr>
            );
          } else {
            return (
              <tr class="row100 lineThough " key={item.id}>
                <td class="cell100 column1"><form onSubmit={() => UpdateHandle(data, item.id, "tenNguoiNo")}><input id="title" className="updateMe" type="text" defaultValue={item.tenNguoiNo} {...register("tenNguoiNo" + item.id)} onBlur={() => returnValueHandle()}/></form></td>
                <td class="cell100 column2"><table><tr><td><form onSubmit={() => UpdateHandle(data, item.id, "soTienNo")}><input id="title" className="updateNumberMe" type="number" defaultValue={item.soTienNo} {...register("soTienNo" + item.id)} onBlur={() => returnValueHandle()} /></form></td><td>VND</td></tr></table></td>
                <td class="cell100 column3"><form onChange={() => UpdateHandle(data, item.id, "ngayNo")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayNoAfter} {...register("ngayNo" + item.id)}/></form></td>
                <td class="cell100 column4"><form onChange={() => UpdateHandle(data, item.id, "ngayTra")}><input id="title" className="updateDateMe" type="date" defaultValue={ngayTraAfer} {...register("ngayTra" + item.id)}/></form></td>
                <td class="cell100 column5"><table><tr><td><form onSubmit={() => UpdateHandle(data, item.id, "phanTramLai")}><input id="title" className="updatePersenMe" type="number" defaultValue={item.phanTramLai} {...register("phanTramLai" + item.id)} onBlur={() => returnValueHandle()} /></form></td><td>%</td></tr></table></td>
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
    var days = Math.abs(date1-date)/(1000 * 3600 * 24);
    var soTienPhaiTra = (soTienNo*days*phanTramLai/100)+parseInt(soTienNo);
    return parseFloat(soTienPhaiTra).toFixed(2);
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
    //localStorage.setItem('modalIsOpen', false);
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
    data.sort(function(a,b){
      //return a.tenNguoiNo.localeCompare(b.tenNguoiNo)
      // let x = a.tenNguoiNo.toUpperCase(),
      //   y = b.tenNguoiNo.toUpperCase();
      // return x == y ? 0 : x > y ? 1 : -1;
      return (Number(a.tenNguoiNo.match(/(\d+)/g)) - Number((b.tenNguoiNo.match(/(\d+)/g))));
    });

    localStorage.setItem('dataShow', JSON.stringify(data));
    localStorage.removeItem('dataSearch');
    //window.location.reload(false);
    setDataShow(data);
  }

  function sortDate() {
    var data = JSON.parse(localStorage.getItem('dataShow'));
    data.sort(function(a,b){return a.ngayTra.toString().localeCompare(b.ngayTra)});
    localStorage.setItem('dataShow', JSON.stringify(data));
    localStorage.removeItem('dataSearch');
    //window.location.reload(false);
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
        data[index-2].tenNguoiNo = getValues(nameProp + index);
        break;
      case "soTienNo":
        data[index-2].soTienNo = getValues(nameProp + index);
        break;
      case "ngayNo":
        data[index-2].ngayNo = getValues(nameProp + index);
        break;
      case "ngayTra":
        data[index-2].ngayTra = getValues(nameProp + index);
        break;
      case "phanTramLai":
        data[index-2].phanTramLai = getValues(nameProp + index);
        break;
    }
    localStorage.setItem('dataShow', JSON.stringify(data));
    setDataShow(data);
  }

  function returnValueHandle() {
    window.location.reload(false);
  }

  // function openModalHandle(booleanValue) {
  //   localStorage.setItem('modalIsOpen', booleanValue);
  //   window.location.reload(false);
  // }

  // function stringToBoolean(val) {
  //   var a = {
  //     'true': true,
  //     'false': false
  //   };
  //   return a[val];
  // }

  return (
    <div className="colorMe">
      <h2 className="titleMe">L??i Su???t Ng??n H??ng</h2>
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
                <h1 style={{marginLeft: '69px', backgroundColor: 'whitesmoke' ,fontFamily: 'Alex Brush', fontSize:'40px'}} >Th??m th??nh vi??n <button className="closeMe" onClick={() => setModalIsOpen(false)}><AiOutlineClose/></button></h1>
                <hr style={{color:'black', height:'3px'}}/>
                <form class="formMe" onSubmit={() => AddHandle(tenNguoiNo.current.value, soTienNo.current.value, phanTramLai.current.value)}><br/>
                    <label class="lableMe">T??n ng?????i n???:</label>
                    <input type="text" class="inputMe" ref={tenNguoiNo} required/><br/>
                    <label class="lableMe">S??? ti???n n???:</label>
                    <input type="number" class="inputMe" ref={soTienNo} required/><br/>
                    <label class="lableMe">Ng??y n???: <span class="lableMeMe">Ng??y tr???:</span></label><br/>
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
                    <label class="lableMe">L??i (%):</label>
                    <input type="number" class="inputMe" ref={phanTramLai} required/><br/>
                    <button type="submit" class="submitMe"><MdDone/></button>
                </form>
            </Modal>
            <div class="table100 ver3 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th class="cell100 column1">T??n ng?????i n??? &nbsp;<button style={{color:'aquamarine'}} onClick={() => sortName()}><TiArrowSortedDown /></button></th>
                      <th class="cell100 column2">S??? ti???n n??? (VND)</th>
                      <th class="cell100 column3"><span style={{paddingLeft: '7px'}}>Ng??y n???</span></th>
                      <th class="cell100 column4">Ng??y tr??? &nbsp;<button style={{color:'aquamarine'}} onClick={() => sortDate()}><TiArrowSortedDown /></button></th>
                      <th class="cell100 column5"><span style={{paddingLeft: '16px'}}>L??i (%)</span></th>
                      <th class="cell100 column6">N??? ph???i tr???</th>
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
