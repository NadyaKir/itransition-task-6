import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Button, Input, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { setUserName } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEmpty, setIsEmpty] = useState(false);

  const userName = useSelector((state) => state.users.userName);

  const handleEnter = () => {
    setIsEmpty(true);
    if (userName.trim() !== "") {
      navigate("/boards");
    }
  };

  const handleUserName = (event) => {
    setIsEmpty(false);
    dispatch(setUserName(event.target.value));
  };

  return (
    <div className="h-screen">
      <div className="h-screen flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" className="w-64 h-auto" />
        {isEmpty && <p className="mb-2">You forgot enter your name!</p>}
        <Flex justify="center" align="center" gap="small">
          <Input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={handleUserName}
            style={{
              borderColor: "#FFA500",
            }}
          />
          <Button
            onClick={handleEnter}
            type="primary"
            shape="round"
            size="large"
            ghost
            htmlType="submit"
            style={{
              backgroundColor: "#FFA500",
              borderColor: "#FFA500",
              color: "white",
              transition: "background-color 0.3s",
            }}
          >
            Enter
          </Button>
        </Flex>
      </div>
    </div>
  );
}
