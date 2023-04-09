import React, { useState } from "react";
import "../App.css";
import Card from "react-bootstrap/Card";
import Button from "../elements/button";
import Form from "react-bootstrap/Form";
import Navbar from "../elements/navbar";
import TitleSec from "../elements/titleSec";
import emailjs from "emailjs-com";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router";

function ManagerProveMail() {
  const navigate = useNavigate("");
  const [user] = useAuthState(auth);
  if (!user) {
    navigate("/signIn");
  }
  // const form = useRef();
  let org = JSON.parse(localStorage.getItem("proveOrg"));
  // console.log("localstorage",org);

  const [values, setValues] = useState({
    toName: org.name,
    toEmail: org.mail, //密碼：tobofficial
    result: "",
    reason: "",
  });

  const handleChange = (e) => {
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  function sendEmail(e) {
    e.preventDefault();
    if (
      values.result === "" ||
      (values.result === "" && values.reason !== "")
    ) {
      alert("請選擇審核狀態");
    } else if (values.result === "審核不通過" && values.reason === "") {
      alert("請填寫審核失敗原因");
    } else if (values.result === "審核通過" && values.reason !== "") {
      alert("不必填寫審核失敗原因");
    } else {
      emailjs
        .send(
          "service_5uyv6mh",
          "template_mc4ck0k",
          values,
          "vjHGM4GthM0EkFWQC"
        )
        .then(
          (result) => {
            console.log(result.text);
            navigate("/managerProve");
            alert("信件寄送成功！");
            if (values.result === "審核不通過") {
              handleDelete();
            } else {
              handleUpdate();
            }
          },
          (error) => {
            console.log(error.text);
            alert("信件寄送失敗，請再寄送一次！");
          }
        );
    }
  }

  const handleUpdate = async () => {
    const taskDocRef = doc(db, "charity", org.id);
    // console.log(taskDocRef._key.id);
    console.log(taskDocRef);
    try {
      await updateDoc(taskDocRef, {
        "info.status": "待啟用",
      });
    } catch (err) {
      console.log(err);
      // alert("資料更新有誤：", err)
    }
  };

  const handleDelete = async () => {
    const taskDocRef = doc(db, "charity", org.id);
    try {
      await deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  };

  const cardStyle = {
    width: "80%",
    marginLeft: "10%",
    color: "black",
    // left: "50%",
    marginTop: "50px",
    // transform: `translate(${-50}%, ${-10}%)`,
    padding: "3% 5% 5% 5%",
    
    letterSpacing: "1px",
    
  };

  const btnStyle = {
    padding: "5px 0px 0px 0px",
    letterSpacing: "1px",
  };

  const pStyle = {
    lineHeight: "40px",
    textAlign: "left",
  };

  const tableStyle = {
    position: "absolute",
    marginTop: "30px",
    left: "50%",
    transform: `translate(${-50}%, ${-50}%)`,
  };

  const stepBtnStyle = {
    color: "#ffffff",
    backgroundColor: "#069A8E",
    borderRadius: "30px",
    borderColor: "#002B5B",
    fontSize: "16px",
    width: "120px",
    textAlign: "center",
    height: "35px",
    fontWeight: "bold",
    border: "none"
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar />
      <TitleSec name="公益單位申請-審核信件發送" color="#7BBFBA" />


      <Container>
        <div style={{ textAlign: "center" }}>
          <Row>
            <Col>
              <Card style={cardStyle}>
                <Card.Body>
                  <p style={pStyle}>
                    將對「<span style={{ fontWeight: "bold" }}>{org.name}</span>
                    」之審核結果發送至對方信箱裡。請勾選下列審核狀態，並依狀態選填審核失敗原因：
                  </p>
                  <form onSubmit={sendEmail}>
                    <input
                      type="radio"
                      name="result"
                      value="審核通過"
                      required
                      checked={values.result === "審核通過"}
                      onChange={handleChange}
                    />
                    <label style={{ fontWeight: "bold", color: "#007500" }}>
                      &nbsp;審核通過
                    </label>
                    <input
                      type="radio"
                      name="result"
                      value="審核不通過"
                      required
                      checked={values.result === "審核不通過"}
                      onChange={handleChange}
                      style={{ marginLeft: "6%" }}
                    />
                    <label style={{ fontWeight: "bold", color: "#CE0000", marginBottom: "10px" }}>
                      &nbsp;審核不通過
                    </label>
                    <Form.Control
                      as="textarea"
                      name="reason"
                      value={values.reason}
                      onChange={handleChange}
                      placeholder="若審核不通過，請填寫審核失敗原因..."
                      style={{ height: "100px", marginBottom: "10px" }}
                    />
                    <div style={{ marginBottom: "40px" }}>
                      <table style={tableStyle}>
                        <tr>
                          <td style={{ paddingRight: "5px" }}>
                            <div style={btnStyle}>
                              <Button color="#069A8E" to="/managerProve" name="返回" />
                            </div>
                          </td>
                          <td>
                            <div style={btnStyle}>
                              <input
                                style={stepBtnStyle}
                                name="發送信件"
                                type="submit"
                                value="發送信件"
                                onClick={sendEmail}
                              />
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default ManagerProveMail;
