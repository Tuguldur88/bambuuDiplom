import React, { Component } from "react";
import { Table, Button, Popconfirm, Row, Col,Form, Upload } from "antd";
import { ExcelRenderer } from "react-excel-renderer";
import Allchart from '../allChart'
export default class ExcelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
      errorMessage: null,
      result:[],
      isLoading:false,
      formData: {
        coordinatX: "q2",
        coordinatY: "q3",
        covot: 2,
      },
      columns: [
        {
          title: "Д/д",
          dataIndex: "id",
          editable: true
        },
        {
          title: "Түвшин",
          dataIndex: "level",
          editable: true
        },
        {
          title: "Хүйс",
          dataIndex: "gender",
          editable: true
        },
        {
          title: "Онолын болон практик хичээлийн алийг нь судлахад тухайн сэдвээр ойлголт авахад илүү хялбар байдаг вэ?",
          dataIndex: "q1",
          editable: true
        },
        {
          title: "Сурах үйл ажиллагаанд илүү их хүчин чармайлт гаргахад юу нөлөөлдөг вэ?",
          dataIndex: "q2",
          editable: true
        },
        {
          title: "Хичээлийн үеэр ямар нөхцөлд буюу ямар үед хамгийн идэвхтэй суралцдаг вэ?",
          dataIndex: "q3",
          editable: true
        },
        {
          title: "Долоо хоногт дунджаар хичээл хийхэд хэдэн цагийг зарцуулж байна? Үүнийг ихэсгэх / багасгах бодол байгаа юу?",
          dataIndex: "q4",
          editable: true
        },
        {
          title: "Устгах",
          dataIndex: "action",
          render: (text, record) =>
            this.state.rows.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <p>Устгах</p>
              </Popconfirm>
            ) : null
        }
      ]
    };
  }

  handleSave = row => {
    const newData = [...this.state.rows];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ rows: newData });
  };



  fileHandler = fileList => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!"
      });
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      this.setState({
        errorMessage: "Unknown file format. Only Excel files are uploaded!"
      });
      return false;
    }
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            newRows.push({
              key: index,
              id: row[0],
              level: row[1],
              gender: row[2],
              q1: row[3],
              q2: row[4],
              q3: row[5],
              q4: row[6],

            });
          }
        });
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!"
          });
          return false;
        } else {
          this.setState({
            cols: resp.cols,
            rows: newRows,
            errorMessage: null
          });
        }
      }
    });
    return false;
  };


  handleDelete = key => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter(item => item.key !== key) });
  };

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }
  handleRequest = () => {
    const rows = this.state.rows;
    const formData = this.state.formData;
    const datas = {"rows":rows, "formData":formData}
    this.setState({ isLoading: true });
    fetch('http://127.0.0.1:5000/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(datas)
      })
      .then(response => response.json())
      .then(response => {
        this.setState({
          result: response,
        });
      });
  };
  render() {
    const formData = this.state.formData;
    const result = this.state.result;
    const isLoading = this.state.isLoading;

    var covot = []
    for (var i = 1; i <= 5; i = +(i + 1).toFixed(1)) {
      covot.push(<option key = {i} value = {i}>{i}</option>);
    }
    var seasonNamesX = []
    var inputRows = ["level","gender","q1","q2","q3","q4"]
    for (var i = 0; i < inputRows.length; i++)
    {
      seasonNamesX.push(<option key = {inputRows[i]} value = {inputRows[i]}>{inputRows[i]}</option>);
    }
    var seasonNamesY = []
    for (var i = 0; i < inputRows.length; i++)
    {
      seasonNamesY.push(<option key = {inputRows[i]} value = {inputRows[i]}>{inputRows[i]}</option>);
    }



    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <>
      <div class="d-flex justify-content-center">
        <h1>Өгөгдөл боловсруулах сайт </h1>
      </div>
      <Row gutter={16}>
      <Col span={10}></Col>
      <Col span={4}>
      <div>
          <Upload
            name="file"
            beforeUpload={this.fileHandler}
            onRemove={() => this.setState({ rows: [] })}
            multiple={false}
          >
            <Button>
               Та файлаа оруулна уу
            </Button>
          </Upload>
        </div>
      </Col>
      </Row>
      {this.state.rows.length > 0 && (
        <Row gutter={16}>
        <Col span={1}></Col>
          <Col span={4}>
          <div class="form-group">
            <label for="exampleFormControlSelect1">X: </label>
            <select class="form-control" id="exampleFormControlSelect1"as="select" value={formData.coordinatX} name="coordinatX" onChange={this.handleChange}> {seasonNamesX}</select>
            <label for="exampleFormControlSelect1">Y:</label>
            <select class="form-control" id="exampleFormControlSelect1"as="select" value={formData.coordinatY} name="coordinatY" onChange={this.handleChange}> {seasonNamesY}</select>
            <label for="exampleFormControlSelect1">Хэд хуваах вэ</label>
            <select class="form-control" id="exampleFormControlSelect1"as="select" value={formData.covot} name="covot" onChange={this.handleChange}> {covot}</select>
          </div>
            <Button onClick={this.handleRequest} size="large" type="info" style={{ marginBottom: 16 }} >Ангилах</Button>

          </Col>
          <Col span={4}></Col>
          <Col
            span={8}
            align="right"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {isLoading ? 
        <div><Allchart formData={formData} data={result}></Allchart></div>:<p> </p> }
          </Col>
        </Row>
        )}

        {this.state.rows.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Table
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
          />
        </div>)}
      </>
    );
  }
}