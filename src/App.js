import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [wardTable, stWardTable] = useState([])
  const [ward_name, setWardName] = useState("")
  const [ward_capacity, setWardCapacity] = useState("")
  const [ward_unit, setWardUnit] = useState("")
  const [updated_ward_name, setUpdatedWardName] = useState("")
  const [updated_ward_capacity, setUpdatedWardCapacity] = useState("")
  const [updated_ward_unit, setUpdatedWardUnit] = useState("")
  const [ward_id, setWardId] = useState('')

  useEffect(() => {
    getWards()
  }, [])

  function getWards() {
    fetch("http://13.127.163.217:5008/hmsipd/ward/get-allWard",
      {
        method: "GET"
      })
      .then((data) => {
        data.json()
          .then((resp) => {
            stWardTable(resp.Message_data)
          })
      })
  }

  function deleteWard(id) {
    fetch(`http://13.127.163.217:5008/hmsipd/ward/deleteWard/${id}`,
      {
        method: "DELETE"
      })
      .then((data) => {
        data.json()
          .then((resp) => {
            console.log(resp)
            getWards()
          })
      })
  }

  function addWard() {
    let data = { ward_name, ward_unit, ward_capacity }
    fetch("http://13.127.163.217:5008/hmsipd/ward/add-ward",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then((data) => {
        data.json()
          .then((resp) => {
            getWards()
          })
      })
  }

  function getWardDetails(ward_id) {
    fetch(`http://13.127.163.217:5008/hmsipd/ward/get-ward/${ward_id}`,
      {
        method: "GET"
      })
      .then((data) => {
        data.json()
          .then((resp) => {
            let ward = resp.Message_data[0]
            setWardId(ward._id)
            setUpdatedWardUnit(ward.ward_unit)
            setUpdatedWardCapacity(ward.ward_capacity)
            setUpdatedWardName(ward.ward_name)
          })
      })
  }
  console.log("=======>", updated_ward_name, updated_ward_capacity, updated_ward_unit)
  console.log("_id", ward_id)

  function updateWard() {
    let ward_name = updated_ward_name, ward_capacity = updated_ward_capacity, ward_unit = updated_ward_unit
    const data = { ward_name, ward_capacity, ward_unit }
    fetch(`http://13.127.163.217:5008/hmsipd/ward/update-ward/${ward_id}`,
      {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then((data) => {
        data.json()
          .then((resp) => {
            getWards()
          })
      })
  }

  return (
    <div className="App">
      <form>
        <input type="text" value={ward_name} onChange={(e) => { setWardName(e.target.value) }} placeholder="ward name"></input>
        <input type="text" value={ward_unit} onChange={(e) => { setWardUnit(e.target.value) }} placeholder="ward unit"></input>
        <input type="text" value={ward_capacity} onChange={(e) => { setWardCapacity(e.target.value) }} placeholder="ward capacity"></input>
        <button type='button' onClick={() => { addWard() }}>Add</button>
      </form>

      <form>
        <input type="text" value={updated_ward_name} onChange={(e) => { setUpdatedWardName(e.target.value) }}></input>
        <input type="text" value={updated_ward_unit} onChange={(e) => { setUpdatedWardUnit(e.target.value) }}></input>
        <input type="text" value={updated_ward_capacity} onChange={(e) => { setUpdatedWardCapacity(e.target.value) }}></input>
        <button type='button' onClick={() => { updateWard() }}>Update data</button>
      </form>

      <table border="1">
        <tbody>
          <tr>
            <td>ward name</td>
            <td>ward capacity</td>
            <td>ward unit</td>
            <td>Actions</td>
          </tr>
          {
            wardTable.map((ward) =>
              <tr key={ward.id}>
                <td>{ward.ward_name}</td>
                <td>{ward.ward_capacity}</td>
                <td>{ward.ward_unit}</td>
                <td>
                  <button type='button' onClick={() => { deleteWard(ward._id) }}>Delete</button>
                  <button type='button' onClick={() => { getWardDetails(ward._id) }}>Update</button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default App;
